import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { ChatPromptMenu } from './SuggestedPrompts';
import { CHAT_INPUT_PLACEHOLDER, CHAT_INPUT_PLACEHOLDER_SHORT } from '../../lib/promptCatalog';

interface ChatInputProps {
  prefill?: string;
  onPrefillConsumed?: () => void;
  onInputChange?: (value: string) => void;
}

export const ChatInput = ({ prefill, onPrefillConsumed, onInputChange }: ChatInputProps) => {
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

  useEffect(() => {
    onInputChange?.(input);
  }, [input, onInputChange]);

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
  const showPlaceholder = !input.trim() && !isProcessing;

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-[14px] px-4 py-3.5 border border-[var(--border-default)] transition-all duration-150',
          'focus-within:border-[rgba(124,58,237,0.5)] focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.08)]'
        )}
        style={{ background: 'var(--gradient-input)' }}
      >
        <ChatPromptMenu onSelect={handlePromptSelect} disabled={isProcessing} />

        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder={isProcessing ? 'AgentX is processing...' : undefined}
            className={cn(
              'w-full bg-transparent border-none text-sm text-[var(--text-1)] focus:outline-none focus:ring-0',
              isProcessing && 'text-[var(--text-3)] cursor-not-allowed'
            )}
          />
          {showPlaceholder && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center text-sm text-[var(--text-3)] truncate"
              aria-hidden
            >
              <span className="sm:hidden">{CHAT_INPUT_PLACEHOLDER_SHORT}</span>
              <span className="hidden sm:inline">{CHAT_INPUT_PLACEHOLDER}</span>
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Send message"
          className={cn(
            'w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 transition-all duration-150',
            canSubmit
              ? 'text-white hover:brightness-110 hover:-translate-y-px'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-3)] cursor-not-allowed'
          )}
          style={
            canSubmit
              ? { background: 'var(--gradient-btn)', boxShadow: '0 2px 8px var(--accent-glow)' }
              : undefined
          }
        >
          <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
};
