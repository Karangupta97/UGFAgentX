import {
  TYI_USD_PAYMENT_COIN,
  UGFClient,
  type QuoteResponse,
} from '@tychilabs/ugf-testnet-js';
import type { Signer, TransactionRequest } from 'ethers';
import {
  getBaseSepoliaReadProvider,
  getConnectedEthersSigner,
  resolveLegacyGasPrice,
  formatWalletRpcError,
} from './baseSepoliaWallet';

const SPONSOR_POLL = { maxAttempts: 45, intervalMs: 2000 };

const UGF_GATEWAY_URL =
  import.meta.env.VITE_UGF_GATEWAY_URL?.replace(/\/$/, '') ||
  'https://gateway.universalgasframework.com';

/**
 * Poll UGF, then send the user tx using a stable Base Sepolia RPC for estimates/fees.
 * MetaMask's injected RPC often lacks eth_maxPriorityFeePerGas and breaks DOMAIN_SEPARATOR reads.
 */
async function sponsorAndExecuteWithStableRpc(
  client: UGFClient,
  digest: string,
  signer: Signer,
  buildTx: (signer: Signer) => Promise<TransactionRequest>
): Promise<{ userTxHash: string }> {
  const readProvider = getBaseSepoliaReadProvider();
  const signerAddress = await signer.getAddress();

  await client.status.poll(digest, SPONSOR_POLL);

  let sponsoredBalance = await readProvider.getBalance(signerAddress);
  for (let i = 0; sponsoredBalance === 0n && i < 10; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    sponsoredBalance = await readProvider.getBalance(signerAddress);
  }
  if (sponsoredBalance === 0n) {
    throw new Error(
      'No sponsored ETH arrived after payment. Wait a few seconds and retry, or check UGF dashboard.'
    );
  }

  const txRequest = await buildTx(signer);
  const estimatedGas = await readProvider.estimateGas({
    from: signerAddress,
    ...txRequest,
  });
  const gasLimit = (estimatedGas * 105n) / 100n;
  const maxAffordableGasPrice = sponsoredBalance / gasLimit;
  const gasPrice = await resolveLegacyGasPrice(readProvider, maxAffordableGasPrice);

  if (gasPrice === 0n) {
    throw new Error('Sponsored ETH is too low for the estimated gas. Retry or contact support.');
  }

  const userTx = await signer.sendTransaction({
    ...txRequest,
    gasLimit,
    gasPrice,
    type: 0,
  });

  const token = client.auth.getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${UGF_GATEWAY_URL}/evm/confirm`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ digest, tx_hash: userTx.hash }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      detail = body.error ?? body.message ?? detail;
    } catch {
      // ignore
    }
    throw new Error(`UGF confirm failed: ${detail}`);
  }

  return { userTxHash: userTx.hash };
}

/**
 * User wallet: pay TYI (x402) then mint via UGF-sponsored ETH on the same address.
 * Contract `owner` must be the connected wallet when UGF_PAYMENT_WALLET=user.
 */
export async function runUserWalletUgfFlow(params: {
  quoteSnapshot: Record<string, unknown>;
  contractAddress: string;
  calldata: `0x${string}`;
}): Promise<{ userTxHash: string; quoteId: string }> {
  const quote = params.quoteSnapshot as unknown as QuoteResponse;
  if (!quote?.digest) {
    throw new Error('Invalid UGF quote — claim again from chat');
  }

  try {
    const signer = await getConnectedEthersSigner();
    const client = new UGFClient();
    const readProvider = getBaseSepoliaReadProvider();

    await client.auth.login(signer);

    const x402Payload = await client.payment.x402.sign(quote, signer, readProvider);
    await client.payment.x402.submit(x402Payload);

    const execution = await sponsorAndExecuteWithStableRpc(
      client,
      quote.digest,
      signer,
      async () => ({
        to: params.contractAddress,
        data: params.calldata,
        value: 0n,
      })
    );

    return {
      userTxHash: execution.userTxHash,
      quoteId: quote.digest,
    };
  } catch (error) {
    throw new Error(formatWalletRpcError(error));
  }
}
