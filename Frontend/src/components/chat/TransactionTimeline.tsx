import { TransactionState, TransactionStep } from '../../types';
import { cn } from '../../lib/utils';

interface TransactionTimelineProps {
  transaction: TransactionState;
}

function StepDot({ status }: { status: TransactionStep['status'] }) {
  if (status === 'completed') {
    return <span className="w-3 h-3 rounded-full bg-[var(--success)] shrink-0 relative z-[1]" />;
  }
  if (status === 'active') {
    return (
      <span
        className="w-3 h-3 rounded-full bg-[var(--accent)] shrink-0 relative z-[1]"
        style={{ boxShadow: '0 0 8px var(--accent-glow)' }}
      />
    );
  }
  if (status === 'error') {
    return <span className="w-3 h-3 rounded-full bg-[var(--danger)] shrink-0 relative z-[1]" />;
  }
  return (
    <span className="w-3 h-3 rounded-full border-2 border-[var(--border-default)] bg-[var(--bg-app)] shrink-0 relative z-[1]" />
  );
}

function StepRow({ step, isLast }: { step: TransactionStep; isLast: boolean }) {
  const isActive = step.status === 'active';
  const isCompleted = step.status === 'completed';

  return (
    <div className="relative flex items-center gap-2.5 py-2">
      {!isLast && (
        <span
          className="absolute left-[5px] top-6 bottom-0 w-px bg-[var(--border-subtle)] z-0"
          aria-hidden
        />
      )}
      <StepDot status={step.status} />
      <p
        className={cn(
          'text-[13px] relative z-[1]',
          isCompleted
            ? 'text-[var(--text-2)]'
            : isActive
              ? 'text-[var(--text-1)] font-medium'
              : 'text-[var(--text-3)]'
        )}
      >
        {step.label}
      </p>
    </div>
  );
}

export const TransactionTimeline = ({ transaction }: TransactionTimelineProps) => {
  return (
    <div className="max-w-[70%] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <p className="text-[13px] font-medium text-[var(--text-1)] mb-3">{transaction.type}</p>

      {transaction.failureReason && transaction.status === 'failed' ? (
        <p className="text-[12px] text-[var(--danger)] mb-3">{transaction.failureReason}</p>
      ) : null}

      <div className="relative">
        {transaction.steps.map((step, i) => (
          <StepRow
            key={step.id}
            step={step}
            isLast={i === transaction.steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
