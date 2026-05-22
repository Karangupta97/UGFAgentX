import { cn } from '../../lib/utils';

type Status = 'completed' | 'active' | 'failed' | string;

function normalizeStatus(status: Status): 'completed' | 'active' | 'failed' | 'other' {
  const key = status.toLowerCase();
  if (['completed', 'success', 'confirmed'].includes(key)) return 'completed';
  if (['active', 'processing', 'in progress'].includes(key)) return 'active';
  if (['failed', 'error'].includes(key)) return 'failed';
  return 'other';
}

const CONFIG = {
  completed: { label: 'Completed', dot: 'bg-[var(--success)]', text: 'text-[var(--success)]' },
  active: {
    label: 'Active',
    dot: 'bg-[var(--warning)] animate-status',
    text: 'text-[var(--warning)]',
  },
  failed: { label: 'Failed', dot: 'bg-[var(--danger)]', text: 'text-[var(--danger)]' },
  other: { label: '', dot: 'bg-[var(--text-3)]', text: 'text-[var(--text-2)]' },
} as const;

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const normalized = normalizeStatus(status);
  const cfg = CONFIG[normalized];
  const label =
    normalized === 'other'
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : cfg.label;

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px]', cfg.text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} aria-hidden />
      {label}
    </span>
  );
}

/** Status dot only (wallet history) */
export function StatusDot({ status }: { status: Status }) {
  const normalized = normalizeStatus(status);
  const color =
    normalized === 'completed'
      ? 'bg-[var(--success)]'
      : normalized === 'active'
        ? 'bg-[var(--warning)] animate-status'
        : normalized === 'failed'
          ? 'bg-[var(--danger)]'
          : 'bg-[var(--text-3)]';

  const title =
    normalized === 'completed'
      ? 'Completed'
      : normalized === 'active'
        ? 'Active'
        : normalized === 'failed'
          ? 'Failed'
          : status;

  return (
    <span
      className={cn('w-1.5 h-1.5 rounded-full shrink-0', color)}
      title={title}
      aria-label={title}
    />
  );
}
