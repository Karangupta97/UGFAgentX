import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { PROMPT_CATALOG, type PromptCategory } from '../../lib/promptCatalog';

interface ChatPromptMenuProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

/** ChatGPT-style + menu embedded in the chat composer. */
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
          'w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150',
          isDisabled
            ? 'text-[#3F3F46] cursor-not-allowed'
            : open
              ? 'bg-[#2A2A32] text-white'
              : 'text-[#A1A1AA] hover:bg-[#2A2A32] hover:text-white'
        )}
      >
        <Plus className={cn('w-5 h-5 transition-transform duration-200', open && 'rotate-45')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 bottom-full mb-2 z-40 w-[min(100vw-2rem,320px)] rounded-2xl border border-[#2A2A32] bg-[#212121] shadow-2xl shadow-black/60 overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {activeCategory ? (
                <motion.div
                  key={activeCategory.id}
                  role="group"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.12 }}
                >
                  <div className="flex items-center gap-2 px-2 py-2 border-b border-[#2A2A32]">
                    <button
                      type="button"
                      onClick={() => setActiveCategory(null)}
                      className="p-2 rounded-lg text-[#A1A1AA] hover:bg-[#2A2A32] hover:text-white transition-colors"
                      aria-label="Back to all prompts"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={cn(
                          'w-7 h-7 rounded-lg border border-[#3A3A44] flex items-center justify-center shrink-0',
                          activeCategory.bg
                        )}
                      >
                        <activeCategory.icon className={cn('w-3.5 h-3.5', activeCategory.color)} />
                      </span>
                      <span className="text-sm font-semibold text-white truncate">
                        {activeCategory.label}
                      </span>
                    </div>
                  </div>
                  <ul className="max-h-[min(240px,45vh)] overflow-y-auto py-1 no-scrollbar">
                    {activeCategory.options.map((opt) => (
                      <li key={opt.prompt}>
                        <button
                          type="button"
                          role="menuitem"
                          disabled={isDisabled}
                          onClick={() => handleSelect(opt.prompt)}
                          className={cn(
                            'w-full px-4 py-2.5 text-left text-sm text-[#E4E4E7] transition-colors',
                            isDisabled
                              ? 'cursor-not-allowed text-[#52525B]'
                              : 'hover:bg-[#2A2A32] active:bg-[#33333D]'
                          )}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="root"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.12 }}
                >
                  <div className="px-4 py-2.5 border-b border-[#2A2A32]">
                    <p className="text-xs font-medium text-[#9CA3AF]">Suggested prompts</p>
                  </div>
                  <ul className="max-h-[min(320px,50vh)] overflow-y-auto py-1 no-scrollbar">
                    {PROMPT_CATALOG.map((category) => (
                      <li key={category.id}>
                        <button
                          type="button"
                          role="menuitem"
                          disabled={isDisabled}
                          onClick={() => setActiveCategory(category)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                            isDisabled
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:bg-[#2A2A32] active:bg-[#33333D]'
                          )}
                        >
                          <span
                            className={cn(
                              'w-8 h-8 rounded-lg border border-[#3A3A44] flex items-center justify-center shrink-0',
                              category.bg
                            )}
                          >
                            <category.icon className={cn('w-4 h-4', category.color)} />
                          </span>
                          <span className="flex-1 min-w-0 text-sm font-medium text-[#E4E4E7] truncate">
                            {category.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#71717A] shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** @deprecated Use ChatPromptMenu — kept for existing imports */
export const SuggestedPrompts = ChatPromptMenu;
