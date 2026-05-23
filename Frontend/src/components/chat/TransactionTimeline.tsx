import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Circle,
  ExternalLink,
  Loader2,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { TransactionState, TransactionStep } from '../../types';
import {
  getStepSubtitle,
  getTimelineProgress,
  getTimelineStatusHeadline,
  isWalletStep,
} from '../../lib/timelineCopy';
import { cn } from '../../lib/utils';

interface TransactionTimelineProps {
  transaction: TransactionState;
}

function StepIcon({ step }: { step: TransactionStep }) {
  const walletLoading = step.status === 'active' && step.walletPending;

  if (step.status === 'completed') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)] ring-1 ring-[var(--success)]/30">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }

  if (step.status === 'error') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/15 text-[var(--danger)] ring-1 ring-[var(--danger)]/35">
        <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }

  if (step.status === 'active') {
    return (
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] ring-2 ring-[var(--accent)]/40',
          walletLoading && 'ugf-timeline-active-ring'
        )}
      >
        {walletLoading ? (
          <Wallet className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        ) : (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} aria-hidden />
        )}
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-app)] text-[var(--text-3)]">
      <Circle className="h-2 w-2 fill-current" aria-hidden />
    </span>
  );
}

function StepRow({
  step,
  isLast,
  index,
}: {
  step: TransactionStep;
  isLast: boolean;
  index: number;
}) {
  const subtitle = getStepSubtitle(step);
  const isActive = step.status === 'active';
  const isCompleted = step.status === 'completed';
  const showWalletChip = isActive && (step.walletPending || isWalletStep(step.id));

  return (
    <div
      className={cn(
        'relative flex gap-3 py-2.5 transition-colors duration-300',
        isActive && 'rounded-xl bg-[var(--accent-soft)]/40 px-2 -mx-2',
        index === 0 && 'pt-0'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {!isLast && (
        <span
          className={cn(
            'absolute left-[13px] top-9 bottom-0 w-0.5 z-0 rounded-full transition-colors duration-500',
            isCompleted
              ? 'bg-gradient-to-b from-[var(--success)]/70 to-[var(--border-subtle)]'
              : 'bg-[var(--border-subtle)]'
          )}
          aria-hidden
        />
      )}

      <StepIcon step={step} />

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              'text-[13px] leading-snug',
              isCompleted && 'text-[var(--text-2)]',
              isActive && 'text-[var(--text-1)] font-semibold',
              step.status === 'pending' && 'text-[var(--text-3)]',
              step.status === 'error' && 'text-[var(--danger)] font-medium'
            )}
          >
            {step.label}
          </p>
          {showWalletChip ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              <Loader2 className="h-2.5 w-2.5 animate-spin" aria-hidden />
              MetaMask
            </span>
          ) : null}
          {isActive && !showWalletChip ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface-3)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-3)]">
              <Loader2 className="h-2.5 w-2.5 animate-spin" aria-hidden />
              In progress
            </span>
          ) : null}
        </div>

        {subtitle ? (
          <p
            className={cn(
              'mt-1 text-[12px] leading-relaxed',
              step.status === 'error'
                ? 'text-[var(--danger)]/90'
                : isActive
                  ? 'text-[var(--text-2)]'
                  : 'text-[var(--text-3)]'
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export const TransactionTimeline = ({ transaction }: TransactionTimelineProps) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  const progress = useMemo(
    () => getTimelineProgress(transaction.steps),
    [transaction.steps]
  );

  const walletPending = useMemo(
    () => transaction.steps.some((s) => s.status === 'active' && s.walletPending),
    [transaction.steps]
  );

  const statusHeadline = getTimelineStatusHeadline(
    transaction.status,
    progress,
    walletPending
  );

  useEffect(() => {
    if (transaction.status !== 'active' || !transaction.startedAt) {
      return;
    }
    const tick = () => setElapsedMs(Date.now() - transaction.startedAt!);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [transaction.status, transaction.startedAt]);

  const isSuccess = transaction.status === 'completed';
  const isFailed = transaction.status === 'failed';

  return (
    <div
      className={cn(
        'max-w-[min(100%,520px)] overflow-hidden rounded-2xl border shadow-lg',
        'border-[var(--border-default)] bg-[var(--gradient-card)]',
        isSuccess && 'border-[var(--success)]/25',
        isFailed && 'border-[var(--danger)]/30'
      )}
    >
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]/80 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-3)]">
              Transaction timeline
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[var(--text-1)]">
              {transaction.type}
            </p>
            <p className="mt-1.5 text-[12px] text-[var(--text-2)] leading-snug">{statusHeadline}</p>
          </div>
          {transaction.status === 'active' ? (
            <span className="shrink-0 rounded-lg bg-[var(--bg-surface-3)] px-2 py-1 font-mono text-[11px] text-[var(--text-3)] tabular-nums">
              {formatElapsed(elapsedMs)}
            </span>
          ) : isSuccess ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
          ) : null}
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-app)]">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              isFailed
                ? 'bg-[var(--danger)]'
                : isSuccess
                  ? 'bg-[var(--success)]'
                  : 'bg-gradient-to-r from-[var(--accent)] to-[#00d4ff] ugf-timeline-progress-bar'
            )}
            style={{ width: `${isFailed ? 100 : progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-[var(--text-3)] tabular-nums">
          {isSuccess ? '100% complete' : isFailed ? 'Stopped' : `${progress}% complete`}
        </p>
      </div>

      {walletPending ? (
        <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/20">
            <Wallet className="h-4 w-4 text-[var(--accent)] animate-pulse" aria-hidden />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-[var(--text-1)]">Check MetaMask</p>
            <p className="text-[11px] text-[var(--text-2)] leading-relaxed mt-0.5">
              A popup may be behind this window. Approve the request to continue — you will not spend
              ETH for gas; Mock USD covers UGF fees.
            </p>
          </div>
        </div>
      ) : null}

      {transaction.gasEstimate && transaction.status === 'active' ? (
        <div className="mx-4 mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2 py-1 text-[var(--text-2)]">
            ~{transaction.gasEstimate.mockUSD} Mock USD
          </span>
          {transaction.gasEstimate.chainName ? (
            <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] px-2 py-1 text-[var(--text-3)]">
              {transaction.gasEstimate.chainName}
            </span>
          ) : null}
        </div>
      ) : null}

      {transaction.failureReason && isFailed ? (
        <div className="mx-4 mt-3 rounded-xl border border-[var(--danger)]/25 bg-[var(--danger)]/10 px-3 py-2.5">
          <p className="text-[12px] font-medium text-[var(--danger)]">{transaction.failureReason}</p>
        </div>
      ) : null}

      <div className="px-4 py-3">
        {transaction.steps.map((step, i) => (
          <StepRow key={step.id} step={step} isLast={i === transaction.steps.length - 1} index={i} />
        ))}
      </div>

      {transaction.receipt?.explorerUrl && isSuccess ? (
        <div className="border-t border-[var(--border-subtle)] px-4 py-3">
          <a
            href={transaction.receipt.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent)] hover:underline"
          >
            View on BaseScan
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </div>
      ) : null}
    </div>
  );
};
