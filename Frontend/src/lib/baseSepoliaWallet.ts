import { BrowserProvider, JsonRpcProvider, type Eip1193Provider, type Signer } from 'ethers';
import { baseSepolia } from 'wagmi/chains';

/** Public Base Sepolia RPC — used for read calls so MetaMask RPC quirks do not break UGF. */
export const BASE_SEPOLIA_RPC_URL =
  import.meta.env.VITE_BASE_SEPOLIA_RPC_URL?.trim() || 'https://sepolia.base.org';

export const BASE_SEPOLIA_CHAIN_ID = baseSepolia.id;
const BASE_SEPOLIA_CHAIN_ID_HEX = `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`;

let readProvider: JsonRpcProvider | null = null;

export function getBaseSepoliaReadProvider(): JsonRpcProvider {
  if (!readProvider) {
    readProvider = new JsonRpcProvider(BASE_SEPOLIA_RPC_URL, BASE_SEPOLIA_CHAIN_ID);
  }
  return readProvider;
}

function getEthereum(): Eip1193Provider {
  const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;
  if (!ethereum) {
    throw new Error('No wallet found. Install MetaMask or Coinbase Wallet and connect.');
  }
  return ethereum;
}

/** Prompt MetaMask to use Base Sepolia before signing or paying gas. */
export async function ensureWalletOnBaseSepolia(): Promise<void> {
  const ethereum = getEthereum();
  const current = (await ethereum.request({ method: 'eth_chainId' })) as string;
  if (current.toLowerCase() === BASE_SEPOLIA_CHAIN_ID_HEX) {
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code !== 4902) {
      throw new Error(
        'Switch your wallet to Base Sepolia (chain 84532), then retry the transaction.'
      );
    }

    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: BASE_SEPOLIA_CHAIN_ID_HEX,
          chainName: 'Base Sepolia',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: [BASE_SEPOLIA_RPC_URL],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        },
      ],
    });
  }
}

export async function getConnectedEthersSigner(): Promise<Signer> {
  await ensureWalletOnBaseSepolia();
  const provider = new BrowserProvider(getEthereum());
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== BASE_SEPOLIA_CHAIN_ID) {
    throw new Error('Wallet is not on Base Sepolia (chain 84532). Switch network and retry.');
  }
  return provider.getSigner();
}

/** Legacy gas price via stable RPC (avoids eth_maxPriorityFeePerGas on limited wallet RPCs). */
export async function resolveLegacyGasPrice(
  provider: JsonRpcProvider,
  maxAffordable: bigint
): Promise<bigint> {
  let suggested = 0n;
  try {
    const feeData = await provider.getFeeData();
    suggested = feeData.gasPrice ?? 0n;
  } catch {
    const hex = (await provider.send('eth_gasPrice', [])) as string;
    suggested = BigInt(hex);
  }

  if (suggested === 0n) {
    return maxAffordable;
  }
  return suggested <= maxAffordable ? suggested : maxAffordable;
}

export function formatWalletRpcError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Wallet RPC error — switch to Base Sepolia and retry.';
  }

  const msg = error.message;
  const lower = msg.toLowerCase();

  if (lower.includes('eth_maxpriorityfeepergas')) {
    return 'Wallet RPC does not support fee estimation on this network. Ensure MetaMask is on Base Sepolia (84532), then retry.';
  }
  if (lower.includes('internal json-rpc') || lower.includes('-32603')) {
    return 'Wallet could not read the TYI token on Base Sepolia. Switch to Base Sepolia, fund TYI Mock USD from the UGF faucet, then retry.';
  }
  if (lower.includes('user rejected') || lower.includes('user denied')) {
    return 'Transaction cancelled in wallet.';
  }

  return msg;
}
