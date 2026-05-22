import React, { useState } from 'react';
import { ExternalLink, AlertCircle, Medal, Zap } from 'lucide-react';
import type { ActivityRecord } from '../../lib/activityRecords';
import { buildBasescanTxUrl } from '../../lib/activityLabels';
import { cn, formatDisplayDate, formatMockGasFee, truncateMiddle } from '../../lib/utils';
import { StatusBadge } from '../ui/StatusBadge';
import { CopyButton } from '../ui/CopyButton';
import { MetadataPreviewModal } from '../ui/MetadataPreviewModal';
import { kvRow } from '../../lib/styles';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mt-4 mb-2 first:mt-0">
      {children}
    </p>
  );
}

function KvRow({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={kvRow}>
      <span className="text-xs text-[var(--text-3)]">{label}</span>
      {children ?? (
        <span
          className={cn('text-[13px] text-[var(--text-1)]', mono && 'font-mono text-xs')}
        >
          {value || '—'}
        </span>
      )}
    </div>
  );
}

function IdentifierRow({ label, value }: { label: string; value: string }) {
  const explorer = value.startsWith('0x') ? buildBasescanTxUrl(value) : null;
  return (
    <div className={kvRow}>
      <span className="text-xs text-[var(--text-3)]">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs text-[var(--text-1)]">
          {truncateMiddle(value, 6, 4)}
        </span>
        <CopyButton text={value} label={label} size="sm" />
        {explorer ? (
          <a
            href={explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-3)] hover:text-[var(--text-1)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function TransactionDetailPanel({ record }: { record: ActivityRecord }) {
  const [metadataOpen, setMetadataOpen] = useState(false);
  const explorerUrl =
    record.explorerUrl ?? buildBasescanTxUrl(record.receipt?.txHash ?? record.steps[0]?.txHash);
  const txHash = record.receipt?.txHash ?? record.steps[0]?.txHash;
  const gasDisplay = formatMockGasFee(record.gasFeeUsd);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto p-6">
      <h2 className="text-xl font-semibold text-[var(--text-1)] mb-1">{record.displayTitle}</h2>
      <div className="mb-4">
        <StatusBadge status={record.status} />
      </div>

      {explorerUrl && txHash ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[13px] text-[var(--text-1)] hover:border-[var(--accent)] hover:text-ugf-violet transition-colors duration-150 mb-5"
        >
          View on Base Sepolia Basescan
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <p className="text-xs text-[var(--text-3)] mb-5">Transaction hash not available yet.</p>
      )}

      {record.failureReason ? (
        <div className="flex gap-2 mb-4 text-xs text-[var(--danger)]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{record.failureReason}</p>
        </div>
      ) : null}

      <SectionLabel>Overview</SectionLabel>
      <KvRow label="Created" value={formatDisplayDate(record.createdAt)} />
      <KvRow
        label="Confirmed"
        value={record.confirmedAt ? formatDisplayDate(record.confirmedAt) : null}
      />
      <KvRow label="Network" value={record.network} />
      <KvRow label="Current step" value={record.currentStep} />

      <SectionLabel>Gas & payment</SectionLabel>
      <KvRow label="Gas fee" value={gasDisplay} />
      <KvRow label="Payment coin" value={record.paymentCoin ?? 'TYI_USD'} />
      <KvRow label="Sponsor" value={record.sponsorStatus ?? 'x402'} />
      <KvRow
        label="Execution time"
        value={
          record.executionTimeMs != null ? (
            <span className="inline-flex items-center gap-1 text-[13px] text-[var(--text-1)]">
              <Zap className="w-3 h-3 text-[var(--warning)]" />
              {(record.executionTimeMs / 1000).toFixed(1)}s
            </span>
          ) : (
            '—'
          )
        }
      />

      <SectionLabel>On-chain identifiers</SectionLabel>
      {txHash ? <IdentifierRow label="Transaction hash" value={txHash} /> : null}
      {record.blockNumber != null ? (
        <KvRow label="Block number" value={`#${record.blockNumber}`} mono />
      ) : null}
      {record.ugfDigest ? <IdentifierRow label="UGF digest" value={record.ugfDigest} /> : null}
      <IdentifierRow label="Activity ID" value={record.id} />

      {record.badge ? (
        <>
          <SectionLabel>Certificate / badge</SectionLabel>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex gap-3">
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
              style={{
                background: 'var(--gradient-orb)',
                boxShadow: '0 0 16px var(--accent-glow)',
              }}
            >
              <Medal className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-[15px] font-medium text-[var(--text-1)]">{record.badge.badgeName}</p>
              {record.badge.recipientName ? (
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-[var(--text-2)]">
                    {truncateMiddle(record.badge.recipientName, 8, 6)}
                  </span>
                  <CopyButton text={record.badge.recipientName} label="recipient" size="sm" />
                </div>
              ) : null}
              {record.badge.metadataUri ? (
                <div>
                  <p className="text-[11px] text-[var(--text-3)]">On-chain Base64</p>
                  <button
                    type="button"
                    onClick={() => setMetadataOpen(true)}
                    className="text-[11px] text-ugf-violet hover:opacity-80 mt-0.5"
                  >
                    Preview →
                  </button>
                  <MetadataPreviewModal
                    open={metadataOpen}
                    onClose={() => setMetadataOpen(false)}
                    metadataUri={record.badge.metadataUri}
                    badgeName={record.badge.badgeName}
                  />
                </div>
              ) : null}
              {record.badge.mintedAt ? (
                <p className="text-[11px] text-[var(--text-3)]">
                  Minted {formatDisplayDate(record.badge.mintedAt)}
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
