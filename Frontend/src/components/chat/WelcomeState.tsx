import {
  Shield,
  Award,
  Heart,
  Send,
  Medal,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ACTION_CHIPS = [
  { icon: Shield, label: 'Mint a badge', prompt: "Let's mint badge for you!" },
  { icon: Award, label: 'Claim certificate', prompt: 'Claim certificate' },
  { icon: Heart, label: 'Donate USD', prompt: 'Donate 5 USD' },
  { icon: Send, label: 'Send reward', prompt: 'Claim all pending rewards' },
] as const;

const FEATURE_CARDS = [
  {
    icon: Medal,
    badge: 'MINT',
    title: 'NFT Minting',
    description: 'Create on-chain badges and certificates instantly',
    prompt: "Let's mint badge for you!",
  },
  {
    icon: Zap,
    badge: 'GAS FREE',
    title: 'Gas Abstraction',
    description: 'Pay fees in Mock USD. No ETH required ever',
    prompt: 'Execute a gasless UGF transaction',
  },
  {
    icon: ShieldCheck,
    badge: 'VERIFY',
    title: 'Verified Credentials',
    description: 'All actions recorded permanently on Base Sepolia',
    prompt: 'Claim certificate',
  },
] as const;

export function WelcomeState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pb-[120px] animate-fade ugf-hero-bg w-full min-w-0">
      <div
        className="w-[72px] h-[72px] rounded-full animate-float mb-5 ugf-orb"
        aria-hidden
      />

      <h2 className="text-[26px] font-semibold text-[var(--text-1)] mb-1.5 text-center">
        Ready to go on-chain?
      </h2>
      <p className="text-sm text-[var(--text-2)] mb-7 text-center">
        Your gasless Web3 assistant on Base Sepolia
      </p>

      <div
        className="grid gap-2 justify-center mb-8"
        style={{ gridTemplateColumns: 'repeat(2, auto)' }}
      >
        {ACTION_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onSelectPrompt(chip.prompt)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] min-w-[160px]',
              'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-2)]',
              'hover:bg-[var(--bg-surface-2)] hover:border-[var(--border-strong)] hover:text-[var(--text-1)]',
              'hover:-translate-y-px transition-all duration-150 cursor-pointer'
            )}
          >
            <chip.icon className="w-3.5 h-3.5 shrink-0" />
            {chip.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-[640px] px-2 sm:px-0">
        {FEATURE_CARDS.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => onSelectPrompt(card.prompt)}
            className={cn(
              'group relative text-left rounded-[14px] p-4 border border-[var(--border-subtle)]',
              'hover:border-[var(--border-strong)] hover:-translate-y-[3px] transition-all duration-200 ease-out cursor-pointer overflow-hidden'
            )}
            style={{ background: 'var(--gradient-card)' }}
          >
            <span className="absolute top-3 right-3 text-[10px] font-medium text-ugf-violet px-2 py-0.5 rounded-md bg-[var(--accent-soft)]">
              {card.badge}
            </span>
            <card.icon className="w-[18px] h-[18px] text-[var(--text-2)] mb-2" />
            <p className="text-sm font-medium text-[var(--text-1)]">{card.title}</p>
            <p
              className={cn(
                'text-xs text-[var(--text-3)] leading-relaxed transition-all duration-200 ease-out',
                'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-24 group-hover:mt-1'
              )}
            >
              {card.description}
            </p>
            <ArrowRight
              className={cn(
                'absolute bottom-3 right-3 w-3 h-3 text-[var(--accent)]',
                'opacity-0 transition-opacity duration-200 group-hover:opacity-100'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
