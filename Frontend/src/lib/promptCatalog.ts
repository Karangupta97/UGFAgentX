import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck,
  Cpu,
  Wallet,
  History,
  ArrowLeftRight,
  BarChart3,
  ScrollText,
  Zap,
  Gift,
} from 'lucide-react';

export interface PromptOption {
  label: string;
  prompt: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  options: PromptOption[];
}

export const PROMPT_CATALOG: PromptCategory[] = [
  {
    id: 'mint',
    label: 'Mint badge',
    icon: ShieldCheck,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    options: [
      { label: "Let's mint badge for you!", prompt: "Let's mint badge for you!" },
      { label: 'Mint achievement badge', prompt: 'Mint an achievement badge for me' },
      { label: 'Mint course completion badge', prompt: 'Mint a course completion badge' },
      { label: 'Mint skill badge on-chain', prompt: 'Mint a skill badge on Base Sepolia' },
    ],
  },
  {
    id: 'claim',
    label: 'Claim certificate',
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    options: [
      { label: 'Claim certificate', prompt: 'Claim certificate' },
      { label: 'Claim certificate for me', prompt: 'Claim certificate for me' },
      { label: 'Claim certificate for my wallet', prompt: 'Claim certificate for my connected wallet' },
      { label: 'Claim certificate on Base Sepolia', prompt: 'Claim certificate on Base Sepolia testnet' },
      { label: 'Claim my latest certificate', prompt: 'Claim my latest earned certificate' },
    ],
  },
  {
    id: 'donate',
    label: 'Donate',
    icon: Wallet,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    options: [
      { label: 'Donate 5 USD', prompt: 'Donate 5 USD' },
      { label: 'Donate 10 USD to charity', prompt: 'Donate 10 USD to charity' },
      { label: 'Donate ETH gaslessly', prompt: 'Donate ETH using gasless UGF' },
      { label: 'Send 5 USD to a friend', prompt: 'Send 5 USD to a friend' },
    ],
  },
  {
    id: 'swap',
    label: 'Swap tokens',
    icon: ArrowLeftRight,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    options: [
      { label: 'Swap ETH to USDC', prompt: 'Swap ETH to USDC' },
      { label: 'Swap 0.01 ETH to USDC', prompt: 'Swap 0.01 ETH to USDC' },
      { label: 'Swap USDC to ETH', prompt: 'Swap USDC to ETH' },
      { label: 'Get best swap quote', prompt: 'Get the best swap quote for ETH to USDC' },
    ],
  },
  {
    id: 'balance',
    label: 'Check balance',
    icon: BarChart3,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    options: [
      { label: 'Check balance', prompt: 'Check balance' },
      { label: 'Check ETH balance', prompt: 'Check my ETH balance' },
      { label: 'Check full portfolio', prompt: 'Check my full wallet portfolio' },
      { label: 'Check mock USD balance', prompt: 'Check my mock USD gas balance' },
    ],
  },
  {
    id: 'history',
    label: 'History & activity',
    icon: History,
    color: 'text-[#A1A1AA]',
    bg: 'bg-[#1F1F23]',
    options: [
      { label: 'History', prompt: 'History' },
      { label: 'Show transaction history', prompt: 'Show my transaction history' },
      { label: 'List recent certificates', prompt: 'List my recent certificates and badges' },
      { label: 'Show last 5 transactions', prompt: 'Show my last 5 on-chain transactions' },
    ],
  },
  {
    id: 'certificates',
    label: 'My certificates',
    icon: ScrollText,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    options: [
      { label: 'Open my certificates', prompt: 'Show my certificates page' },
      { label: 'View minted badges', prompt: 'View all minted badges in my wallet' },
      { label: 'Download certificate proof', prompt: 'Download proof for my latest certificate' },
    ],
  },
  {
    id: 'ugf',
    label: 'UGF gasless',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    options: [
      { label: 'Run gasless transaction', prompt: 'Execute a gasless UGF transaction' },
      { label: 'Enable UGF for this wallet', prompt: 'Enable UGF gasless mode for my wallet' },
      { label: 'Explain UGF settlement', prompt: 'Explain how UGF gasless settlement works' },
    ],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: Gift,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    options: [
      { label: 'Claim pending rewards', prompt: 'Claim all pending rewards' },
      { label: 'Check eligible rewards', prompt: 'Check which rewards I am eligible for' },
      { label: 'Redeem promo certificate', prompt: 'Redeem my promo certificate code' },
    ],
  },
];
