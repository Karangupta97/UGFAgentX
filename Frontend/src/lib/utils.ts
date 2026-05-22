import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/** Truncate long hashes/IDs in the middle: 0x19...2eba */
export function truncateMiddle(value: string, start = 6, end = 4): string {
  if (!value) return '';
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

/**
 * Format mock gas fees. Raw values > 10 are divided by 100 (wrong scale from API).
 */
export function formatMockGasFee(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return '—';
  let normalized = amount;
  if (normalized > 10) normalized = normalized / 100;
  const decimals = normalized < 0.01 ? 4 : normalized < 1 ? 4 : 4;
  return `${normalized.toFixed(decimals)} Mock USD`;
}

export function formatDisplayDate(isoOrMs: string | number): string {
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatShortTime(isoOrMs: string | number): string {
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Sidebar chat list: time today, else short date */
export function formatSessionListTime(isoOrMs: string): string {
  const d = new Date(isoOrMs);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (d >= startToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function getCommandHint(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  if (trimmed.startsWith('mint')) {
    return "💡 Tip: Include a recipient name — e.g. 'for Jay'";
  }
  if (trimmed.startsWith('donate')) {
    return "💡 Tip: Include an amount — e.g. 'donate 5 USD'";
  }
  return null;
}

export function truncateText(text: string, max = 35): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}...`;
}
