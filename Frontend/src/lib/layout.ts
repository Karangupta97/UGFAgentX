/** Sidebar is a persistent column (not overlay) at this width and up. */
export const SIDEBAR_INLINE_MEDIA = '(min-width: 1280px)';

/** Wallet panel is a persistent column (not overlay) at this width and up. */
export const WALLET_INLINE_MEDIA = '(min-width: 1536px)';

export function isSidebarInlineViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(SIDEBAR_INLINE_MEDIA).matches;
}

export function isWalletInlineViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(WALLET_INLINE_MEDIA).matches;
}
