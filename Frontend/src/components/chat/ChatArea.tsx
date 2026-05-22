import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TransactionTimeline } from './TransactionTimeline';
import { Menu, Wallet as WalletIcon, Sparkles } from 'lucide-react';

export const ChatArea = () => {
  const { messages, activeTransaction, toggleSidebar, toggleWallet, isTyping, isProcessing } =
    useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [bottomInset, setBottomInset] = useState(120);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, activeTransaction]);

  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;

    const updateInset = () => {
      setBottomInset(bottom.offsetHeight + 16);
    };

    updateInset();
    const ro = new ResizeObserver(updateInset);
    ro.observe(bottom);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0A0A0B] overflow-hidden h-full">
      <header className="h-12 sm:h-14 border-b border-[#1A1A1F] flex items-center px-3 sm:px-6 justify-between shrink-0 bg-[#0A0A0B]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#1F1F23] rounded-lg xl:hidden transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 text-[#71717A]" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#52525B] min-w-0">
            <span className="shrink-0">Session:</span>
            <span className="text-white font-semibold font-mono truncate">
              Agent Operations #042
            </span>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 ml-1 shrink-0 text-blue-400"
              >
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Processing
                </span>
              </motion.div>
            )}
          </div>
          <div className="text-sm font-bold text-white sm:hidden truncate">AgentX</div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleWallet}
            className="p-2 hover:bg-[#1F1F23] rounded-lg 2xl:hidden transition-colors"
            aria-label="Open wallet"
          >
            <WalletIcon className="w-4 h-4 text-[#71717A]" />
          </button>
          <div className="hidden lg:flex gap-1.5 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#1F1F23]" />
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-6 md:px-8 py-4 sm:py-6 scroll-smooth no-scrollbar"
        style={{ paddingBottom: bottomInset }}
      >
        <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>

          <AnimatePresence>
            {activeTransaction && (
              <motion.div
                key={activeTransaction.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-sm"
              >
                <TransactionTimeline transaction={activeTransaction} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        ref={bottomRef}
        className="shrink-0 bg-[#0A0A0B]/95 backdrop-blur-md px-3 sm:px-6 md:px-8 py-3 sm:py-4 z-20"
      >
        <div className="max-w-3xl mx-auto w-full space-y-2">
          <ChatInput />
          <p className="text-[9px] sm:text-[10px] text-center text-[#52525B] font-medium px-1">
            UGF AGENTX CAN EXECUTE TRANSACTIONS — ALWAYS VERIFY ON-CHAIN
          </p>
        </div>
      </div>
    </div>
  );
};
