/** Desktop sidebar column width (px). */
export const SIDEBAR_WIDTH_PX = 300;

/** Desktop wallet panel column width (px). */
export const WALLET_PANEL_WIDTH_PX = 320;

/** Sidebar is a persistent column (not overlay) at this width and up. */
export const SIDEBAR_INLINE_MEDIA = '(min-width: 1280px)';

/** Wallet panel is a persistent column (not overlay) at this width and up — matches App 3-col grid (xl). */
export const WALLET_INLINE_MEDIA = '(min-width: 1280px)';

export function isSidebarInlineViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(SIDEBAR_INLINE_MEDIA).matches;
}

export function isWalletInlineViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(WALLET_INLINE_MEDIA).matches;
}
