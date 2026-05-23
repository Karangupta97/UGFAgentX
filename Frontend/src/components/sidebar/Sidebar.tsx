import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { SIDEBAR_INLINE_MEDIA, SIDEBAR_WIDTH_PX } from '../../lib/layout';
import { isWalletCommunicating } from '../../lib/timelineCopy';
import { btnPrimary, btnPrimaryStyle, btnGhost } from '../../lib/styles';
import { PreviousChats } from './PreviousChats';

const SIDEBAR_W = SIDEBAR_WIDTH_PX;

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen, startNewChat, setMainView, activeTransaction } =
    useStore();
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SIDEBAR_INLINE_MEDIA).matches
  );

  const walletBusy = isWalletCommunicating(activeTransaction);

  useEffect(() => {
    const mq = window.matchMedia(SIDEBAR_INLINE_MEDIA);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (walletBusy && !isDesktop) {
      setSidebarOpen(false);
    }
  }, [walletBusy, isDesktop, setSidebarOpen]);

  const showSidebar = walletBusy && !isDesktop ? false : isDesktop || isSidebarOpen;

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && !walletBusy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: showSidebar ? SIDEBAR_W : 0,
          x: showSidebar ? 0 : -SIDEBAR_W,
          opacity: showSidebar ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          'flex flex-col h-full max-h-screen overflow-hidden z-50 shrink-0',
          'fixed xl:relative left-0 top-0',
          !showSidebar && 'pointer-events-none'
        )}
        style={{ background: 'var(--gradient-sidebar)' }}
      >
        <div className="flex flex-col flex-1 min-h-0 py-5 px-4">
          <div className="flex items-center gap-2 mb-6 shrink-0 min-w-0">
            <Link
              to="/"
              className="text-base font-semibold text-[var(--text-1)] truncate hover:text-[var(--accent)] transition-colors duration-150"
              title="UGF AgentX home"
            >
              UGF AgentX
            </Link>
            <span
              className="w-2 h-2 rounded-full bg-[var(--success)] ml-auto shrink-0"
              aria-hidden
            />
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className={cn(btnPrimary, 'mb-2 text-sm')}
            style={btnPrimaryStyle}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button type="button" onClick={() => setMainView('activity')} className={cn(btnGhost, 'mb-6 text-sm')}>
            <Award className="w-4 h-4" />
            My Certificates
          </button>

          <PreviousChats />
        </div>

        <div className="shrink-0 px-4 pb-5 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap gap-3 text-[11px] text-[var(--text-3)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Base Sepolia
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              UGF Enabled
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
