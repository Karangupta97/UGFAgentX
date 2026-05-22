import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Fuel,
  Gift,
  HandCoins,
  Medal,
  MessageSquare,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  RevealSection,
  StaggerOnScroll,
  StaggerItem,
  fadeUpLight,
  heroStagger,
  scrollViewport,
} from '../components/landing/LandingMotion';
import { FlowNodeIcon, LandingIconBox } from '../components/landing/LandingIconBox';
import { ROUTES } from '../lib/routes';
import { cn } from '../lib/utils';
import '../styles/landing.css';

const PROBLEMS: {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
}[] = [
  {
    icon: Fuel,
    iconColor: '#f87171',
    title: 'Gas Wall',
    text: 'Users need ETH in their wallet before doing anything on-chain. No ETH = blocked, no exceptions.',
  },
  {
    icon: Route,
    iconColor: '#fbbf24',
    title: 'Complex Onboarding',
    text: 'Buy ETH on exchange → KYC → bridge → configure gas limit → approve. Most give up at step one.',
  },
  {
    icon: TrendingDown,
    iconColor: '#f87171',
    title: 'Broken UX',
    text: 'Apps lose 90% of users at the "pay gas" step. Real utility never reaches real people.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Connect Your Wallet',
    text: 'Connect MetaMask or any WalletConnect wallet on Base Sepolia. Sign a message to authenticate — no ETH needed.',
  },
  {
    num: '02',
    title: 'Type What You Want',
    text: 'Type naturally: "Mint a badge for Jay" or "Donate 5 USD". The AI parser understands your intent instantly.',
  },
  {
    num: '03',
    title: 'UGF Handles the Gas',
    text: 'UGF quotes the cost in Mock USD, settles the payment, and executes the transaction on-chain. You pay cents. No ETH.',
  },
  {
    num: '04',
    title: 'Action Confirmed On-Chain',
    text: 'Your NFT is minted, badge is claimed, or donation is sent on Base Sepolia. Real on-chain action, verifiable tx hash.',
  },
] as const;

const UGF_STEPS: {
  num: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
  bg: string;
}[] = [
  {
    num: 'STEP 01',
    icon: BarChart3,
    iconColor: '#a78bfa',
    title: 'Quote',
    text: 'UGF calculates the gas cost in Mock USD',
    bg: 'rgba(124,80,255,.15)',
  },
  {
    num: 'STEP 02',
    icon: CircleDollarSign,
    iconColor: '#00d4ff',
    title: 'Settle',
    text: 'Mock USD deducted from server vault',
    bg: 'rgba(0,212,255,.12)',
  },
  {
    num: 'STEP 03',
    icon: Zap,
    iconColor: '#bf5fff',
    title: 'Execute',
    text: 'UGF pays ETH gas and submits the tx',
    bg: 'rgba(191,95,255,.12)',
  },
  {
    num: 'STEP 04',
    icon: CheckCircle2,
    iconColor: '#00e5a0',
    title: 'Confirm',
    text: 'Transaction confirmed with real tx hash',
    bg: 'rgba(0,229,160,.12)',
  },
];

const FEATURES: {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  tag: string;
  tagColor: string;
  bg: string;
  text: string;
}[] = [
  {
    icon: Medal,
    iconColor: '#a78bfa',
    title: 'Mint NFT Badge',
    tag: 'MINT_BADGE',
    tagColor: '#a78bfa',
    bg: 'rgba(124,80,255,.15)',
    text: 'Create on-chain achievement badges with fully on-chain Base64 SVG metadata. No IPFS.',
  },
  {
    icon: Award,
    iconColor: '#00e5a0',
    title: 'Claim Certificate',
    tag: 'CLAIM_CERT',
    tagColor: '#00e5a0',
    bg: 'rgba(0,229,160,.12)',
    text: 'Issue verifiable on-chain credentials for courses, events, and workshops on Base Sepolia.',
  },
  {
    icon: HandCoins,
    iconColor: '#fbbf24',
    title: 'Donate USD',
    tag: 'DONATE',
    tagColor: '#fbbf24',
    bg: 'rgba(251,191,36,.12)',
    text: 'Send transparent on-chain donations to any address. Recorded forever on the blockchain.',
  },
  {
    icon: Gift,
    iconColor: '#00d4ff',
    title: 'Send Reward',
    tag: 'SEND_REWARD',
    tagColor: '#00d4ff',
    bg: 'rgba(0,212,255,.12)',
    text: 'Reward contributors with on-chain NFT tokens. Gasless, instant, verifiable.',
  },
  {
    icon: Sparkles,
    iconColor: '#a78bfa',
    title: 'AI Intent Parser',
    tag: 'AI POWERED',
    tagColor: '#a78bfa',
    bg: 'rgba(124,80,255,.15)',
    text: 'Regex-first parser with Google Gemini fallback. Understands natural language commands.',
  },
  {
    icon: ShieldCheck,
    iconColor: '#bf5fff',
    title: 'Wallet Auth (JWT)',
    tag: 'SECURE',
    tagColor: '#bf5fff',
    bg: 'rgba(191,95,255,.12)',
    text: 'Sign a nonce with your wallet to get a 7-day JWT. Pure cryptographic identity.',
  },
];

const TECH = [
  'React + Vite',
  'Express.js',
  'UGF Testnet SDK',
  'Base Sepolia',
  'Supabase',
  'Google Gemini',
  'Wagmi v2',
  'ConnectKit',
  'Tailwind CSS',
  'JWT Auth',
  'ERC-721',
  'viem',
  'Zustand',
  '@tychilabs/ugf-testnet-js',
] as const;

function useLandingScroll() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    const hadLight = html.classList.contains('light');
    html.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    html.classList.add('dark');
    html.classList.remove('light');

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.overflowY = '';
      if (hadLight) {
        html.classList.remove('dark');
        html.classList.add('light');
      }
    };
  }, []);

  return rootRef;
}

export default function LandingPage() {
  const rootRef = useLandingScroll();

  return (
    <div ref={rootRef} className="landing-page" data-motion>
      <motion.nav
        className="lp-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to={ROUTES.home} className="lp-nav-logo">
          <span className="lp-nav-dot" aria-hidden />
          UGF AgentX
        </Link>
        <ul className="lp-nav-links">
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#stack">Stack</a>
          </li>
        </ul>
        <Link to={ROUTES.agent} className="lp-nav-cta">
          Launch App →
        </Link>
      </motion.nav>

      <motion.section
        className="lp-hero lp-section"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        <div className="lp-hero-glow" aria-hidden />
        <div className="lp-hero-glow2" aria-hidden />

        <motion.div className="lp-hero-visual" variants={fadeUpLight}>
          <img
            src="/landing/hero-blockchain.png"
            alt="Blockchain network visualization with connected cubes"
            width={480}
            height={400}
            fetchPriority="high"
          />
        </motion.div>

        <motion.div className="lp-hero-badge" variants={fadeUpLight}>
          <span className="lp-nav-dot" style={{ width: 6, height: 6 }} aria-hidden />
          Built for UGF × TychiLabs Hackathon
        </motion.div>

        <motion.h1 className="lp-hero-title" variants={fadeUpLight}>
          Type a Command.
          <br />
          <span className="lp-gradient-text">Go On-Chain Instantly.</span>
        </motion.h1>

        <motion.p className="lp-hero-sub" variants={fadeUpLight}>
          UGF AgentX is your AI-powered Web3 assistant. Mint NFTs, claim certificates, and donate — all
          without ETH. Gas is paid in Mock USD via Universal Gas Framework.
        </motion.p>

        <motion.div className="flex gap-4 justify-center flex-wrap" variants={fadeUpLight}>
          <Link to={ROUTES.agent} className="lp-btn-primary">
            Launch AgentX →
          </Link>
          <a href="#how" className="lp-btn-secondary">
            See how it works
          </a>
        </motion.div>

        <motion.div className="lp-hero-stats" variants={fadeUpLight}>
          <div>
            <div className="lp-stat-num">0 ETH</div>
            <div className="lp-stat-label">Gas Required</div>
          </div>
          <div>
            <div className="lp-stat-num">4</div>
            <div className="lp-stat-label">Actions Available</div>
          </div>
          <div>
            <div className="lp-stat-num">Base</div>
            <div className="lp-stat-label">Sepolia Network</div>
          </div>
          <div>
            <div className="lp-stat-num">&lt; 1s</div>
            <div className="lp-stat-label">Execution Time</div>
          </div>
        </motion.div>
      </motion.section>

      <RevealSection className="lp-section text-center px-[clamp(20px,5vw,60px)] py-[100px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={heroStagger}
          className="flex flex-col items-center"
        >
          <motion.div className="lp-section-label mx-auto" variants={fadeUpLight}>
            The Problem
          </motion.div>
          <motion.h2 className="lp-section-title" variants={fadeUpLight}>
            Web3 Breaks for
            <br />
            Regular Users
          </motion.h2>
          <motion.p className="lp-section-sub mx-auto" variants={fadeUpLight}>
            Every blockchain action on Ethereum requires ETH for gas. Most people don&apos;t have it,
            don&apos;t know how to get it, and give up before taking any action.
          </motion.p>
        </motion.div>
        <StaggerOnScroll className="lp-problem-grid max-w-[900px] mx-auto mt-[60px]">
          {PROBLEMS.map((p) => (
            <StaggerItem key={p.title}>
              <div className="lp-card lp-problem-card h-full">
                <LandingIconBox
                  icon={p.icon}
                  color={p.iconColor}
                  bg="rgba(239,68,68,0.1)"
                  size="md"
                  className="mb-4"
                />
                <h3 className="text-[15px] font-semibold mb-2">{p.title}</h3>
                <p className="text-[13px] text-[var(--lp-text2)] leading-relaxed">{p.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerOnScroll>
      </RevealSection>

      <RevealSection
        id="how"
        className="lp-section px-[clamp(20px,5vw,60px)] py-[120px] max-w-[1200px] mx-auto"
        variant="light"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={heroStagger}>
          <motion.div className="lp-section-label" variants={fadeUpLight}>
            The Solution
          </motion.div>
          <motion.h2 className="lp-section-title" variants={fadeUpLight}>
            One Chat.
            <br />
            Zero ETH Required.
          </motion.h2>
          <motion.p className="lp-section-sub mb-[60px]" variants={fadeUpLight}>
            AgentX uses AI to understand your intent, then UGF executes the transaction — paying gas with Mock
            USD, never touching your ETH.
          </motion.p>
        </motion.div>

        <div className="lp-how-inner">
          <StaggerOnScroll className="flex flex-col">
            {STEPS.map((step, i) => (
              <StaggerItem
                key={step.num}
                className={cn(
                  'flex gap-5 py-6',
                  i < STEPS.length - 1 && 'border-b border-[var(--lp-border)]'
                )}
              >
                <div
                  className="lp-display w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center text-[11px] text-[var(--lp-accent)]"
                  style={{ borderColor: 'rgba(124,80,255,0.3)' }}
                >
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1.5">{step.title}</h3>
                  <p className="text-[13px] text-[var(--lp-text2)] leading-relaxed">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerOnScroll>

          <motion.div
            className="lp-flow-diagram"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center pb-3 relative z-[1]">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#a78bfa]"
                style={{ background: 'rgba(124,80,255,0.15)', border: '1px solid rgba(124,80,255,0.4)' }}
              >
                <Zap className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
                UGF Execution Layer
              </span>
            </div>
            <div className="relative z-[1]">
              <div className="lp-flow-node">
                <FlowNodeIcon icon={MessageSquare} color="#a78bfa" bg="rgba(124,80,255,0.2)" />
                <div>
                  <div className="text-[13px] font-medium">&quot;Mint badge for Jay&quot;</div>
                  <div className="text-[11px] text-[var(--lp-text3)]">User chat input</div>
                </div>
              </div>
              <div className="flex justify-center py-1 text-[var(--lp-accent)]">
                <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="lp-flow-node active">
                <FlowNodeIcon icon={Bot} color="#00d4ff" bg="rgba(0,212,255,0.15)" />
                <div>
                  <div className="text-[13px] font-medium">AI Intent Parser</div>
                  <div className="text-[11px] text-[var(--lp-text3)]">MINT_BADGE · recipient: Jay</div>
                </div>
              </div>
              <div className="flex justify-center py-1 text-[var(--lp-accent)]">
                <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="lp-flow-node active">
                <FlowNodeIcon icon={Zap} color="#a78bfa" bg="rgba(124,80,255,0.2)" />
                <div>
                  <div className="text-[13px] font-medium">UGF: Quote → Settle → Execute</div>
                  <div className="text-[11px] text-[var(--lp-text3)]">Gas paid in Mock USD · 0.5s</div>
                </div>
              </div>
              <div className="flex justify-center py-1 text-[var(--lp-success)]">
                <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="lp-flow-node success">
                <FlowNodeIcon icon={Medal} color="#00e5a0" bg="rgba(0,229,160,0.15)" />
                <div>
                  <div className="text-[13px] font-medium">NFT Minted on Base Sepolia</div>
                  <div className="text-[11px]" style={{ color: 'var(--lp-success)' }}>
                    0x1982...4eba · Block #41854846
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      <RevealSection
        id="features"
        className="lp-section text-center px-[clamp(20px,5vw,60px)] py-[120px] relative overflow-hidden"
      >
        <div className="lp-slides-bg" aria-hidden />
        <div className="relative z-[1]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={heroStagger}
            className="flex flex-col items-center"
          >
            <motion.div className="lp-section-label justify-center mx-auto" variants={fadeUpLight}>
              UGF Protocol
            </motion.div>
            <motion.h2 className="lp-section-title max-w-[600px] mx-auto" variants={fadeUpLight}>
              The 4-Step Gas Framework
            </motion.h2>
            <motion.p className="lp-section-sub mx-auto mb-16" variants={fadeUpLight}>
              No paymasters. No bundlers. No ERC-4337. Just four clean steps.
            </motion.p>
          </motion.div>

          <StaggerOnScroll className="lp-ugf-flow">
            {UGF_STEPS.map((step, i) => (
              <React.Fragment key={step.num}>
                {i > 0 ? <div className="lp-ugf-arrow hidden sm:block" aria-hidden /> : null}
                <StaggerItem>
                  <div className="lp-ugf-step h-full">
                    <div className="lp-display text-[10px] tracking-widest text-[var(--lp-accent)] mb-3">
                      {step.num}
                    </div>
                    <LandingIconBox
                      icon={step.icon}
                      color={step.iconColor}
                      bg={step.bg}
                      size="xl"
                      className="mb-3.5 mx-auto"
                    />
                    <h3 className="text-sm font-semibold mb-1.5">{step.title}</h3>
                    <p className="text-[11px] text-[var(--lp-text3)] leading-snug">{step.text}</p>
                  </div>
                </StaggerItem>
              </React.Fragment>
            ))}
          </StaggerOnScroll>
        </div>
      </RevealSection>

      <RevealSection className="lp-section px-[clamp(20px,5vw,60px)] py-[80px] max-w-[1100px] mx-auto" variant="light">
        <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={heroStagger}>
          <motion.div className="lp-section-label" variants={fadeUpLight}>
            What You Can Do
          </motion.div>
          <motion.h2 className="lp-section-title" variants={fadeUpLight}>
            4 On-Chain Actions,
            <br />
            Zero ETH
          </motion.h2>
        </motion.div>
        <StaggerOnScroll className="lp-features-grid mt-12">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <div className="lp-card h-full">
                <LandingIconBox
                  icon={f.icon}
                  color={f.iconColor}
                  bg={f.bg}
                  size="lg"
                  className="mb-5"
                />
                <h3 className="text-base font-semibold mb-2.5">{f.title}</h3>
                <p className="text-[13px] text-[var(--lp-text2)] leading-relaxed">{f.text}</p>
                <span
                  className="inline-block mt-4 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                  style={{ background: f.bg, color: f.tagColor }}
                >
                  {f.tag}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerOnScroll>
      </RevealSection>

      <RevealSection
        id="stack"
        className="lp-section text-center py-20 px-[clamp(20px,5vw,60px)] border-y border-[var(--lp-border)]"
        variant="light"
      >
        <motion.div
          className="text-xs text-[var(--lp-text3)] tracking-widest uppercase mb-8 lp-display"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.5 }}
        >
          Built with
        </motion.div>
        <StaggerOnScroll className="lp-tech-pills">
          {TECH.map((t) => (
            <StaggerItem key={t}>
              <span className="lp-tech-pill inline-block">{t}</span>
            </StaggerItem>
          ))}
        </StaggerOnScroll>
      </RevealSection>

      <RevealSection
        id="cta"
        className="lp-section text-center px-[clamp(20px,5vw,60px)] py-[140px] relative overflow-hidden"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,80,255,0.12) 0%, transparent 70%)' }}
          aria-hidden
        />
        <motion.div
          className="relative z-[1]"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={heroStagger}
        >
          <motion.div className="lp-section-label justify-center mx-auto" variants={fadeUpLight}>
            Get Started
          </motion.div>
          <motion.h2 className="lp-section-title max-w-[700px] mx-auto" variants={fadeUpLight}>
            Ready to Go On-Chain?
            <br />
            <span className="lp-gradient-text">No ETH Needed.</span>
          </motion.h2>
          <motion.p className="lp-section-sub mx-auto mb-12" variants={fadeUpLight}>
            Type a command. Pay cents in Mock USD. Your action is recorded permanently on Base Sepolia. Web3
            has never been this simple.
          </motion.p>
          <motion.div className="flex gap-4 justify-center flex-wrap" variants={fadeUpLight}>
            <Link to={ROUTES.agent} className="lp-btn-primary text-base px-10 py-4">
              Launch UGF AgentX →
            </Link>
            <a
              href="https://universalgasframework.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-secondary text-base px-10 py-4"
            >
              Read UGF Docs
            </a>
          </motion.div>
        </motion.div>
      </RevealSection>

      <motion.footer
        className="lp-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={scrollViewport}
        transition={{ duration: 0.6 }}
      >
        <div className="lp-display text-sm text-[var(--lp-text2)]">UGF AgentX</div>
        <div className="text-xs text-[var(--lp-text3)]">
          Built for UGF × TychiLabs Hackathon · May 2026 · Base Sepolia
        </div>
        <div className="flex gap-6">
          <a
            href="https://github.com/Karangupta97/UGFAgentX"
            className="text-[13px] text-[var(--lp-text3)] hover:text-[var(--lp-text2)]"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://universalgasframework.com/docs"
            className="text-[13px] text-[var(--lp-text3)] hover:text-[var(--lp-text2)]"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
          <a
            href="https://tychilabs.com"
            className="text-[13px] text-[var(--lp-text3)] hover:text-[var(--lp-text2)]"
            target="_blank"
            rel="noreferrer"
          >
            TychiLabs
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
