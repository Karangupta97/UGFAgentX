import type { TransactionState, TransactionStep } from '../types';

const STEP_ORDER = ['pending', 'quote', 'settle', 'execute', 'mining', 'confirm', 'save'] as const;

const ACTIVE_HINTS: Record<string, string> = {
  pending: 'Spinning up your transaction on AgentX…',
  quote: 'UGF is calculating gas in Mock USD — no ETH needed.',
  settle: 'Almost there — wallet step unlocks gasless execution.',
  execute: 'Broadcasting your action to Base Sepolia…',
  mining: 'Validators are confirming your transaction…',
  confirm: 'Double-checking receipt on-chain…',
  save: 'Adding your NFT to the gallery…',
};

const COMPLETED_HINTS: Record<string, string> = {
  pending: 'Session ready',
  quote: 'Gas quote locked in',
  settle: 'Mock USD payment settled',
  execute: 'Submitted to the network',
  mining: 'Included in a block',
  confirm: 'Receipt verified',
  save: 'Saved to your collection',
};

const WALLET_STEP_IDS = new Set(['settle', 'execute']);

export function isWalletStep(stepId: string): boolean {
  return WALLET_STEP_IDS.has(stepId);
}

/** True while MetaMask / wallet popup steps are active (hide chrome on small screens). */
export function isWalletCommunicating(
  transaction: TransactionState | null | undefined
): boolean {
  return (
    transaction?.steps.some((s) => s.status === 'active' && s.walletPending) ?? false
  );
}

export function getTimelineProgress(steps: TransactionStep[]): number {
  if (steps.length === 0) return 0;
  const weights = steps.map((s) => {
    if (s.status === 'completed') return 1;
    if (s.status === 'active') return 0.45;
    if (s.status === 'error') return 0;
    return 0;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  return Math.min(100, Math.round((sum / steps.length) * 100));
}

/** Subtitle under each step label — prefers live detail from wallet/backend. */
export function getStepSubtitle(step: TransactionStep): string | null {
  if (step.status === 'error') {
    return step.detail ?? 'Something went wrong — check wallet and retry.';
  }
  if (step.status === 'active' && step.detail?.trim()) {
    return step.detail.trim();
  }
  if (step.status === 'active') {
    return ACTIVE_HINTS[step.id] ?? 'Working on it…';
  }
  if (step.status === 'completed') {
    if (step.txHash) {
      return `Tx ${step.txHash.slice(0, 10)}…${step.txHash.slice(-6)}`;
    }
    return step.detail?.trim() || COMPLETED_HINTS[step.id] || null;
  }
  return null;
}

export function getTimelineStatusHeadline(
  status: 'active' | 'completed' | 'failed',
  progress: number,
  walletPending: boolean
): string {
  if (status === 'failed') {
    return 'Transaction stopped — see step below';
  }
  if (status === 'completed') {
    return 'All done — your action is on-chain';
  }
  if (walletPending) {
    return 'Waiting for MetaMask — check the extension popup';
  }
  if (progress < 35) {
    return 'Setting up your gasless transaction…';
  }
  if (progress < 70) {
    return 'UGF is handling gas — hang tight';
  }
  return 'Finalizing on Base Sepolia…';
}

export function stepIndex(stepId: string): number {
  const idx = STEP_ORDER.indexOf(stepId as (typeof STEP_ORDER)[number]);
  return idx >= 0 ? idx : 0;
}

export function applyTimelinePatch(
  steps: TransactionStep[],
  patch: {
    activeStepId: string;
    detail: string;
    walletPending?: boolean;
    completeThrough?: string;
  }
): TransactionStep[] {
  const throughIdx = patch.completeThrough ? stepIndex(patch.completeThrough) : -1;
  const activeIdx = stepIndex(patch.activeStepId);

  return steps.map((s) => {
    const idx = stepIndex(s.id);

    if (s.status === 'error') {
      return s;
    }

    if (throughIdx >= 0 && idx <= throughIdx) {
      return { ...s, status: 'completed' as const, walletPending: false, detail: undefined };
    }

    if (s.id === patch.activeStepId) {
      return {
        ...s,
        status: 'active' as const,
        detail: patch.detail,
        walletPending: patch.walletPending ?? isWalletStep(s.id),
      };
    }

    if (idx < activeIdx) {
      return { ...s, status: 'completed' as const, walletPending: false };
    }

    return { ...s, status: 'pending' as const, walletPending: false, detail: undefined };
  });
}
