import type { WalletSettlementPhase } from './ugfWalletSettlement';
import { applyTimelinePatch } from './timelineCopy';
import type { TransactionStep } from '../types';

const WALLET_PHASE_PATCH: Record<
  WalletSettlementPhase,
  Parameters<typeof applyTimelinePatch>[1]
> = {
  switch_network: {
    activeStepId: 'settle',
    completeThrough: 'quote',
    walletPending: true,
    detail: 'Opening MetaMask — confirming you are on Base Sepolia…',
  },
  ugf_login: {
    activeStepId: 'settle',
    completeThrough: 'quote',
    walletPending: true,
    detail: 'Sign the login message in MetaMask (free, no gas).',
  },
  tyi_signature: {
    activeStepId: 'settle',
    completeThrough: 'quote',
    walletPending: true,
    detail: 'Approve TYI Mock USD in MetaMask — this pays gas instead of ETH.',
  },
  submit_payment: {
    activeStepId: 'settle',
    completeThrough: 'quote',
    walletPending: false,
    detail: 'Payment signed — submitting to UGF gateway…',
  },
  await_sponsor: {
    activeStepId: 'execute',
    completeThrough: 'settle',
    walletPending: false,
    detail: 'UGF is sponsoring ETH for your transaction — usually a few seconds…',
  },
  mint_tx: {
    activeStepId: 'execute',
    completeThrough: 'settle',
    walletPending: true,
    detail: 'Confirm the on-chain action in MetaMask (UGF covers gas).',
  },
};

export function patchStepsForWalletPhase(
  steps: TransactionStep[],
  phase: WalletSettlementPhase
): TransactionStep[] {
  return applyTimelinePatch(steps, WALLET_PHASE_PATCH[phase]);
}
