import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { PROMPT_CATALOG, type PromptCategory } from '../../lib/promptCatalog';

interface ChatPromptMenuProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export const ChatPromptMenu = ({ onSelect, disabled }: ChatPromptMenuProps) => {
  const isProcessing = useStore((state) => state.isProcessing);
  const isDisabled = disabled ?? isProcessing;
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setActiveCategory(null);
  }, []);

  const handleSelect = (prompt: string) => {
    if (isDisabled) return;
    onSelect(prompt);
    close();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        disabled={isDisabled}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Suggested prompts"
        onClick={() => {
          if (isDisabled) return;
          setOpen((v) => {
            if (v) {
              setActiveCategory(null);
              return false;
            }
            return true;
          });
        }}
        className={cn(
          'w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150',
          'bg-[var(--bg-surface-2)] text-[var(--text-3)]',
          !isDisabled && 'hover:text-[var(--text-1)]',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <Plus className={cn('w-3.5 h-3.5 transition-transform duration-150', open && 'rotate-45')} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 bottom-full mb-2 z-40 w-[min(100vw-2rem,300px)] rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-xl overflow-hidden animate-fade"
        >
          {activeCategory ? (
            <div>
              <div className="px-2 py-2 border-b border-[var(--border-subtle)] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="p-1.5 rounded-md text-[var(--text-2)] hover:bg-[var(--bg-surface-2)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-[var(--text-1)] truncate">
                  {activeCategory.label}
                </span>
              </div>
              <ul className="max-h-[240px] overflow-y-auto py-1">
                {activeCategory.options.map((opt) => (
                  <li key={opt.prompt}>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isDisabled}
                      onClick={() => handleSelect(opt.prompt)}
                      className="w-full px-4 py-2 text-left text-sm text-[var(--text-1)] hover:bg-[var(--bg-surface-2)] transition-colors duration-150"
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                <p className="text-xs font-medium text-[var(--text-1)]">Suggested prompts</p>
              </div>
              <ul className="max-h-[280px] overflow-y-auto py-1">
                {PROMPT_CATALOG.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isDisabled}
                      onClick={() => setActiveCategory(category)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--bg-surface-2)] transition-colors duration-150"
                    >
                      <category.icon className="w-4 h-4 text-[var(--text-2)] shrink-0" />
                      <span className="flex-1 text-sm text-[var(--text-1)] truncate">
                        {category.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--text-3)]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SuggestedPrompts = ChatPromptMenu;
