import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SIDEBAR_INLINE_MEDIA, WALLET_INLINE_MEDIA } from '../lib/layout';

/**
 * Collapses overlay panels when the viewport shrinks (e.g. MetaMask side panel)
 * so the chat/activity area keeps usable width.
 */
export function LayoutResizeSync() {
  useEffect(() => {
    const mqSidebar = window.matchMedia(SIDEBAR_INLINE_MEDIA);
    const mqWallet = window.matchMedia(WALLET_INLINE_MEDIA);

    const sync = () => {
      const { isSidebarOpen, isWalletOpen } = useStore.getState();
      const patches: { isSidebarOpen?: boolean; isWalletOpen?: boolean } = {};

      if (!mqSidebar.matches && isSidebarOpen) {
        patches.isSidebarOpen = false;
      }
      if (!mqWallet.matches && isWalletOpen) {
        patches.isWalletOpen = false;
      }

      if (Object.keys(patches).length > 0) {
        useStore.setState(patches);
      }
    };

    sync();
    mqSidebar.addEventListener('change', sync);
    mqWallet.addEventListener('change', sync);
    window.addEventListener('resize', sync);

    return () => {
      mqSidebar.removeEventListener('change', sync);
      mqWallet.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return null;
}
