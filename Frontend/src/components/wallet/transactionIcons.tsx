import {
  Award,
  ScrollText,
  Heart,
  Gift,
  ArrowLeftRight,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';
import type { TransactionState } from '../../types';

export type TransactionKind =
  | 'mint_badge'
  | 'claim_cert'
  | 'donate'
  | 'send_reward'
  | 'swap'
  | 'unknown';

const KIND_META: Record<
  TransactionKind,
  { Icon: LucideIcon; accent: string; iconColor: string; historyBg: string }
> = {
  mint_badge: {
    Icon: Award,
    accent: 'border-accent-primary/30 bg-accent-primary/10',
    iconColor: 'text-accent-primary',
    historyBg: 'bg-accent-primary/15 text-accent-primary',
  },
  claim_cert: {
    Icon: ScrollText,
    accent: 'border-accent-success/30 bg-accent-success/10',
    iconColor: 'text-accent-success',
    historyBg: 'bg-accent-success/15 text-accent-success',
  },
  donate: {
    Icon: Heart,
    accent: 'border-accent-warning/30 bg-accent-warning/10',
    iconColor: 'text-accent-warning',
    historyBg: 'bg-accent-warning/15 text-accent-warning',
  },
  send_reward: {
    Icon: Gift,
    accent: 'border-accent-secondary/30 bg-accent-secondary/10',
    iconColor: 'text-accent-secondary',
    historyBg: 'bg-accent-secondary/15 text-accent-secondary',
  },
  swap: {
    Icon: ArrowLeftRight,
    accent: 'border-cyan-500/30 bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    historyBg: 'bg-cyan-500/15 text-cyan-400',
  },
  unknown: {
    Icon: CircleDot,
    accent: 'border-border bg-bg-card',
    iconColor: 'text-text-secondary',
    historyBg: 'bg-bg-hover text-text-secondary',
  },
};

const ACTION_TYPE_KIND: Record<string, TransactionKind> = {
  claim_cert: 'claim_cert',
  mint_badge: 'mint_badge',
  donate: 'donate',
  send_reward: 'send_reward',
};

export function resolveTransactionKind(tx: TransactionState): TransactionKind {
  const intent = tx.intent?.toLowerCase().trim().replace(/\s+/g, '_');
  if (intent && intent in KIND_META) {
    return intent as TransactionKind;
  }
  if (intent && ACTION_TYPE_KIND[intent]) {
    return ACTION_TYPE_KIND[intent];
  }

  const type = tx.type.toUpperCase();
  if (type.includes('MINT') && type.includes('BADGE')) return 'mint_badge';
  if (type.includes('CLAIM') || type.includes('CERT')) return 'claim_cert';
  if (type.includes('DONATE')) return 'donate';
  if (type.includes('REWARD')) return 'send_reward';
  if (type.includes('SWAP')) return 'swap';
  if (type.startsWith('MINT')) return 'mint_badge';

  return 'unknown';
}

export function getTransactionKindMeta(kind: TransactionKind) {
  return KIND_META[kind] ?? KIND_META.unknown;
}
