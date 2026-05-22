import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Award } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { SIDEBAR_INLINE_MEDIA } from '../../lib/layout';
import { btnPrimary, btnPrimaryStyle, btnGhost } from '../../lib/styles';
import { PreviousChats } from './PreviousChats';

const SIDEBAR_W = 220;

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, startNewChat, setMainView } = useStore();
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SIDEBAR_INLINE_MEDIA).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(SIDEBAR_INLINE_MEDIA);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showSidebar = isDesktop || isSidebarOpen;

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
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
          width: showSidebar ? (isDesktop ? SIDEBAR_W : 260) : 0,
          x: showSidebar ? 0 : isDesktop ? -SIDEBAR_W : -260,
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
        <div className="flex flex-col flex-1 min-h-0 py-5 px-3">
          <div className="flex items-center gap-2 mb-6 shrink-0">
            <span className="text-[15px] font-semibold text-[var(--text-1)]">UGF AgentX</span>
            <span
              className="w-2 h-2 rounded-full bg-[var(--success)] ml-auto shrink-0"
              aria-hidden
            />
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className={cn(btnPrimary, 'mb-2')}
            style={btnPrimaryStyle}
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
          <button type="button" onClick={() => setMainView('activity')} className={cn(btnGhost, 'mb-6')}>
            <Award className="w-3.5 h-3.5" />
            My Certificates
          </button>

          <PreviousChats showTimestamps={showSidebar} />
        </div>

        <div className="shrink-0 px-3 pb-5 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap gap-3 text-[10px] text-[var(--text-3)]">
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
