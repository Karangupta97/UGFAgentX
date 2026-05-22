import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { ChatPromptMenu } from './SuggestedPrompts';

interface ChatInputProps {
  prefill?: string;
  onPrefillConsumed?: () => void;
}

export const ChatInput = ({ prefill, onPrefillConsumed }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const { submitPrompt, isProcessing } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      inputRef.current?.focus();
      onPrefillConsumed?.();
    }
  }, [prefill, onPrefillConsumed]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;
    submitPrompt(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const canSubmit = input.trim().length > 0 && !isProcessing;

  return (
    <form onSubmit={handleSubmit} className="relative group w-full">
      <div
        className={cn(
          'relative flex items-center gap-1 sm:gap-2 rounded-[26px] sm:rounded-[28px] px-2 sm:px-3 min-h-[52px] sm:min-h-[56px] transition-all duration-200',
          'bg-[#2F2F2F] border border-[#3A3A3A] shadow-lg shadow-black/20',
          isProcessing
            ? 'border-blue-500/30'
            : 'focus-within:border-[#52525B] focus-within:bg-[#333333]'
        )}
      >
        <ChatPromptMenu onSelect={handlePromptSelect} disabled={isProcessing} />

        <input
          ref={inputRef}
          type="text"
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder={isProcessing ? 'AgentX is processing...' : 'Ask anything'}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none text-sm sm:text-[15px] focus:outline-none focus:ring-0 py-3',
            isProcessing
              ? 'text-[#52525B] placeholder-[#52525B] cursor-not-allowed'
              : 'text-white placeholder-[#9CA3AF]'
          )}
        />

        <div className="flex items-center gap-1.5 shrink-0 pr-0.5 sm:pr-1">
          <span className="text-[10px] text-[#52525B] font-mono font-bold tracking-widest hidden lg:inline">
            ↵
          </span>

          <AnimatePresence mode="wait">
            <motion.button
              key={isProcessing ? 'processing' : canSubmit ? 'ready' : 'idle'}
              type="submit"
              disabled={!canSubmit}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.12 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Send message"
              className={cn(
                'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200',
                canSubmit
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-[#424242] text-[#71717A] cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4 fill-current" />
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
};
