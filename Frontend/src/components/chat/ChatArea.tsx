import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TransactionTimeline } from './TransactionTimeline';
import { WelcomeState } from './WelcomeState';
import { ThemeToggle } from '../ThemeToggle';
import { Menu, Wallet as WalletIcon, ChevronDown } from 'lucide-react';
import { getCommandHint, truncateText } from '../../lib/utils';
import { cn } from '../../lib/utils';

const SCROLL_THRESHOLD = 100;

export const ChatArea = () => {
  const { messages, activeTransaction, toggleSidebar, toggleWallet, isTyping, isProcessing } =
    useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [prefill, setPrefill] = useState<string | undefined>();
  const [bottomInset, setBottomInset] = useState(120);
  const [inputValue, setInputValue] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const hasUserMessages = useMemo(() => messages.some((m) => m.role === 'user'), [messages]);
  const showWelcome = !hasUserMessages && !isTyping && !activeTransaction;

  const sessionTitle = useMemo(() => {
    const firstUser = messages.find((m) => m.role === 'user');
    if (!firstUser?.content) return null;
    return truncateText(firstUser.content, 35);
  }, [messages]);

  const commandHint = getCommandHint(inputValue);

  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el || showWelcome) {
      setShowScrollBtn(false);
      return;
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > SCROLL_THRESHOLD);
  }, [showWelcome]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setShowScrollBtn(false);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || showWelcome) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    checkScrollPosition();
  }, [messages, isTyping, activeTransaction, showWelcome, checkScrollPosition]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || showWelcome) return;
    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();
    return () => el.removeEventListener('scroll', checkScrollPosition);
  }, [showWelcome, checkScrollPosition]);

  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;
    const updateInset = () => setBottomInset(bottom.offsetHeight + 8);
    updateInset();
    const ro = new ResizeObserver(updateInset);
    ro.observe(bottom);
    return () => ro.disconnect();
  }, [commandHint]);

  return (
    <div className="flex flex-1 flex-col min-w-0 min-h-0 bg-[var(--bg-app)] relative w-full">
      <header className="h-[52px] shrink-0 border-b border-[var(--border-subtle)] flex items-center px-6 gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-lg xl:hidden text-[var(--text-2)] hover:bg-[var(--bg-surface)] transition-colors duration-150 shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 min-w-0 mr-auto truncate text-sm">
          <span className="font-medium text-[var(--text-1)] shrink-0">AgentX</span>
          {!showWelcome && sessionTitle ? (
            <>
              <span className="text-[var(--text-3)] shrink-0">/</span>
              <span className="font-medium text-[var(--text-2)] truncate">{sessionTitle}</span>
            </>
          ) : null}
        </div>
        {isProcessing && (
          <span className="text-[11px] text-[var(--text-3)] hidden sm:inline shrink-0">
            Processing…
          </span>
        )}
        <span className="hidden sm:inline text-[10px] font-medium tracking-wide text-ugf-violet px-2 py-0.5 rounded-md border border-[rgba(124,58,237,0.3)] bg-[var(--accent-soft)] shrink-0">
          UGF POWERED
        </span>
        <ThemeToggle />
        <button
          type="button"
          onClick={toggleWallet}
          className="p-2 rounded-lg 2xl:hidden text-[var(--text-2)] hover:bg-[var(--bg-surface)] transition-colors duration-150 shrink-0"
          aria-label="Open wallet"
        >
          <WalletIcon className="w-4 h-4" />
        </button>
      </header>

      {showWelcome ? (
        <WelcomeState onSelectPrompt={setPrefill} />
      ) : (
        <div className="relative flex-1 min-h-0 w-full">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-4"
            style={{ paddingBottom: bottomInset }}
          >
            <div className="w-full flex flex-col gap-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              {activeTransaction && (
                <div className="animate-fade">
                  <TransactionTimeline transaction={activeTransaction} />
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToBottom}
            className={cn(
              'absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5',
              'border border-[var(--border-default)] bg-[var(--bg-surface-2)] text-xs text-[var(--text-2)]',
              'hover:border-[var(--border-strong)] transition-opacity duration-150',
              showScrollBtn ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            style={{ bottom: bottomInset + 16 }}
            aria-hidden={!showScrollBtn}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Scroll to bottom
          </button>
        </div>
      )}

      <div
        ref={bottomRef}
        className="shrink-0 border-t border-[var(--border-subtle)] px-6 pt-4 pb-5 bg-[var(--bg-app)] w-full"
      >
        <div className="w-full max-w-none">
          <ChatInput
            prefill={prefill}
            onPrefillConsumed={() => setPrefill(undefined)}
            onInputChange={setInputValue}
          />
          <p
            className={cn(
              'text-[11px] text-[var(--text-3)] text-center mt-2 transition-opacity duration-150',
              commandHint ? 'opacity-100' : 'opacity-80'
            )}
          >
            {commandHint ??
              'UGF AgentX can execute transactions — always verify on-chain'}
          </p>
        </div>
      </div>
    </div>
  );
};
