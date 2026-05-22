import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { showToast } from '../../lib/toast';

export function CopyButton({
  text,
  label,
  className,
  size = 'sm',
}: {
  text: string;
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied!');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed');
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={cn(
        'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-150',
        size === 'sm' ? 'p-0.5' : 'p-1',
        className
      )}
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-green-500')} />
      ) : (
        <Copy className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
    </button>
  );
}
