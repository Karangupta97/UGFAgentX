import { useMemo } from 'react';
import { X } from 'lucide-react';

function parseMetadataUri(uri: string): Record<string, unknown> | null {
  try {
    if (uri.startsWith('data:application/json;base64,')) {
      return JSON.parse(atob(uri.slice('data:application/json;base64,'.length))) as Record<
        string,
        unknown
      >;
    }
    if (uri.startsWith('{')) return JSON.parse(uri) as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}

export function MetadataPreviewModal({
  open,
  onClose,
  metadataUri,
  badgeName,
}: {
  open: boolean;
  onClose: () => void;
  metadataUri: string;
  badgeName?: string;
}) {
  const parsed = useMemo(() => parseMetadataUri(metadataUri), [metadataUri]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md max-h-[80vh] overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">Metadata preview</h3>
            {badgeName ? (
              <p className="text-xs text-[var(--text-2)] mt-0.5">{badgeName}</p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-3)] hover:text-[var(--text-1)]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {parsed ? (
            <dl className="space-y-3">
              {Object.entries(parsed).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">{key}</dt>
                  <dd className="text-sm text-[var(--text-1)] mt-0.5 break-words font-mono">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-[var(--text-2)]">Could not parse on-chain metadata.</p>
          )}
        </div>
      </div>
    </div>
  );
}
