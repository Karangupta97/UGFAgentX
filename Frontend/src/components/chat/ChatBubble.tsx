import React, { useState } from 'react';
import { Bot, ExternalLink, Copy, Check } from 'lucide-react';
import { Message, TransactionReceipt } from '../../types';
import { cn, formatMockGasFee, truncateMiddle } from '../../lib/utils';
import { showToast } from '../../lib/toast';

interface ChatBubbleProps {
  message: Message;
}

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-1)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part === '\n') return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

function TransactionReceiptCard({ tx }: { tx: TransactionReceipt }) {
  const [copied, setCopied] = useState(false);
  const hasRealHash = /^0x[a-fA-F0-9]{64}$/u.test(tx.txHash);
  if (!hasRealHash) return null;

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2 text-[12px]">
      <p className="text-[var(--success)] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
        Transaction confirmed
      </p>
      <div className="flex justify-between gap-2 items-center">
        <span className="text-[var(--text-3)]">Tx hash</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[var(--text-2)]">{truncateMiddle(tx.txHash)}</span>
          <button
            type="button"
            className="text-[var(--text-3)] hover:text-[var(--text-1)]"
            onClick={() => {
              void navigator.clipboard.writeText(tx.txHash);
              setCopied(true);
              showToast('Copied!');
              window.setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check className="w-3 h-3 text-[var(--success)]" /> : <Copy className="w-3 h-3" />}
          </button>
          {tx.explorerUrl ? (
            <a href={tx.explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--text-3)]">Gas</span>
        <span>{formatMockGasFee(Number(tx.mockUsdCost) || null)}</span>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-[70%] animate-fade">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center ugf-orb-sm">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-1">
        <span className="typing-dot typing-dot-1" />
        <span className="typing-dot typing-dot-2" />
        <span className="typing-dot typing-dot-3" />
      </div>
    </div>
  );
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const timeLabel = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isAssistant) {
    return (
      <div className="flex items-start gap-3 max-w-[70%] animate-fade">
        <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center ugf-orb-sm">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm leading-relaxed text-[var(--text-1)]">
            <p>{renderContent(message.content)}</p>
            {message.transaction ? <TransactionReceiptCard tx={message.transaction} /> : null}
          </div>
          <p className="text-[11px] text-[var(--text-3)] mt-1 ml-1">{timeLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end max-w-[70%] ml-auto animate-fade">
      <div
        className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
        style={{
          background: 'var(--gradient-btn)',
          boxShadow: '0 2px 12px var(--accent-glow)',
        }}
      >
        <p>{renderContent(message.content)}</p>
      </div>
      <p className="text-[11px] text-violet-200/70 mt-1">{timeLabel}</p>
    </div>
  );
};
