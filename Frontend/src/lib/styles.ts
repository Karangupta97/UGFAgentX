/** Utility class strings using CSS custom properties */

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 w-full rounded-[10px] px-4 py-2.5 text-[13px] font-medium text-white transition-all duration-150 hover:brightness-110 hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0';

export const btnPrimaryStyle = {
  background: 'var(--gradient-btn)',
  boxShadow: '0 2px 12px var(--accent-glow)',
} as const;

export const btnGhost =
  'inline-flex items-center justify-center gap-2 w-full rounded-[10px] px-4 py-2.5 text-[13px] text-[var(--text-2)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors duration-150 hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-1)]';

export const surfaceCard =
  'bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl transition-colors duration-150';

export const kvRow =
  'flex justify-between items-center py-2.5 border-b border-[var(--border-subtle)] last:border-0';
