import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Loader2, RefreshCw, FileSearch, Medal, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn, formatDisplayDate } from '../../lib/utils';
import { resolveTransactionKind } from '../wallet/transactionIcons';
import { TransactionDetailPanel } from './TransactionDetailPanel';
import type { ActivityRecord } from '../../lib/activityRecords';
import { StatusBadge } from '../ui/StatusBadge';
import { btnGhost } from '../../lib/styles';

function ActivityListItem({
  record,
  selected,
  onClick,
}: {
  record: ActivityRecord;
  selected: boolean;
  onClick: () => void;
}) {
  const kind = resolveTransactionKind(record);
  const Icon = kind === 'claim_cert' ? Award : Medal;
  const hasTx = Boolean(record.receipt?.txHash ?? record.steps[0]?.txHash);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-[10px] px-3.5 py-3 mb-1 transition-all duration-150',
        selected
          ? 'bg-[var(--bg-surface)] border-l-2 border-l-[var(--accent)]'
          : 'bg-transparent hover:bg-[var(--bg-surface)] border-l-2 border-l-transparent'
      )}
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-ugf-violet" />
        </div>
        <span className="text-sm font-medium text-[var(--text-1)] truncate flex-1">
          {record.displayTitle}
        </span>
        <StatusBadge status={record.status} className="text-[11px] shrink-0" />
      </div>
      <div className="flex items-center gap-2 pl-[42px] text-[11px] text-[var(--text-3)]">
        <span>{formatDisplayDate(record.createdAt)}</span>
        {hasTx ? <span>· Has transaction</span> : null}
      </div>
    </button>
  );
}

export function ActivityPage() {
  const {
    activityRecords,
    selectedActivityId,
    activityLoading,
    loadActivityRecords,
    selectActivity,
    setMainView,
    refreshSelectedActivity,
  } = useStore();

  const selected = activityRecords.find((r) => r.id === selectedActivityId) ?? null;

  const stats = useMemo(() => {
    const total = activityRecords.length;
    const completed = activityRecords.filter((r) => r.status === 'completed').length;
    const active = activityRecords.filter((r) => r.status === 'active').length;
    return { total, completed, active };
  }, [activityRecords]);

  useEffect(() => {
    void loadActivityRecords();
  }, [loadActivityRecords]);

  useEffect(() => {
    if (selectedActivityId) void refreshSelectedActivity();
  }, [selectedActivityId, refreshSelectedActivity]);

  return (
    <div className="flex flex-1 flex-col min-w-0 min-h-0 bg-[var(--bg-app)]">
      <header className="shrink-0 px-6 pt-5 pb-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMainView('chat')}
              className="xl:hidden p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-2)] hover:bg-[var(--bg-surface)]"
              aria-label="Back to chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[var(--text-1)]">
                My Certificates & Activity
              </h1>
              <p className="text-[13px] text-[var(--text-2)] mt-0.5">
                Tap any item for full on-chain details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void loadActivityRecords()}
            disabled={activityLoading}
            className={cn(btnGhost, 'w-auto shrink-0 h-9')}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', activityLoading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        <div className="flex border-b border-[var(--border-subtle)] mt-5 mb-0">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Completed', value: stats.completed },
            { label: 'Active', value: stats.active },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'flex-1 text-center py-5',
                i < 2 && 'border-r border-[var(--border-subtle)]'
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-1">
                {stat.label}
              </p>
              <p className="text-[28px] font-semibold text-[var(--text-1)] tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <div
          className={cn(
            'w-full xl:w-[400px] shrink-0 border-r border-[var(--border-subtle)] flex flex-col min-h-0',
            selected && 'hidden xl:flex'
          )}
        >
          <div className="flex-1 overflow-y-auto p-3">
            {activityLoading && activityRecords.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-[var(--text-3)]">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs">Loading…</p>
              </div>
            ) : activityRecords.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-[var(--text-2)]">No on-chain activity yet.</p>
                <button
                  type="button"
                  onClick={() => setMainView('chat')}
                  className="mt-3 text-xs text-[var(--accent)]"
                >
                  Go to chat →
                </button>
              </div>
            ) : (
              activityRecords.map((record) => (
                <ActivityListItem
                  key={record.id}
                  record={record}
                  selected={record.id === selectedActivityId}
                  onClick={() => selectActivity(record.id)}
                />
              ))
            )}
          </div>
        </div>

        <div
          className={cn(
            'flex-1 min-w-0 flex flex-col min-h-0',
            !selected && 'hidden xl:flex'
          )}
        >
          {selected ? (
            <>
              <div className="xl:hidden shrink-0 px-4 py-3 border-b border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => selectActivity(null)}
                  className="flex items-center gap-2 text-xs text-[var(--text-2)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All activity
                </button>
              </div>
              <TransactionDetailPanel record={selected} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <FileSearch className="w-8 h-8 text-[var(--text-3)] mb-3" />
              <p className="text-sm text-[var(--text-2)]">Select a certificate to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
