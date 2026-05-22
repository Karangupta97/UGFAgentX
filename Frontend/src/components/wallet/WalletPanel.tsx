import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from 'connectkit';
import { useAccount, useDisconnect } from 'wagmi';
import {
  Loader2,
  X,
  KeyRound,
  Mail,
  LogIn,
  Wallet2,
  ImageOff,
  LogOut,
  Medal,
  Award,
  Heart,
  Gift,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn, formatAddress, formatCurrency } from '../../lib/utils';
import { resolveTransactionKind } from './transactionIcons';
import type { TransactionState } from '../../types';
import { loginWithGoogle } from '../../lib/api';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { clearAuthSession, setStoredToken } from '../../lib/authStorage';
import { showToast } from '../../lib/toast';
import { StatusDot } from '../ui/StatusBadge';
import { CopyButton } from '../ui/CopyButton';
import { btnPrimary, btnPrimaryStyle, btnGhost } from '../../lib/styles';
import type { LucideIcon } from 'lucide-react';

const TX_ICONS: Record<string, LucideIcon> = {
  mint_badge: Medal,
  claim_cert: Award,
  donate: Heart,
  send_reward: Gift,
  swap: Gift,
  unknown: Medal,
};

const TX_ICON_STYLES: Record<string, { bg: string; color: string }> = {
  mint_badge: { bg: 'rgba(124,58,237,0.15)', color: '#A78BFA' },
  claim_cert: { bg: 'rgba(16,185,129,0.12)', color: '#34D399' },
  donate: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  send_reward: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA' },
  swap: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA' },
  unknown: { bg: 'rgba(124,58,237,0.15)', color: '#A78BFA' },
};

function formatTxAction(type: string): string {
  const t = type.toUpperCase();
  if (t.includes('MINT')) return 'Mint Badge';
  if (t.includes('CLAIM') || t.includes('CERT')) return 'Claim Cert';
  if (t.includes('DONATE')) return 'Donate';
  if (t.includes('REWARD')) return 'Send Reward';
  return type;
}

function TransactionHistoryItem({
  tx,
  onSelect,
}: {
  tx: TransactionState;
  onSelect: () => void;
}) {
  const kind = resolveTransactionKind(tx);
  const Icon = TX_ICONS[kind] ?? Medal;
  const iconStyle = TX_ICON_STYLES[kind] ?? TX_ICON_STYLES.unknown;
  const status =
    tx.status === 'completed' ? 'completed' : tx.status === 'failed' ? 'failed' : 'active';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-2.5 py-2.5 border-b border-[var(--border-subtle)] last:border-0 text-left transition-colors duration-150 hover:opacity-90"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconStyle.bg }}
      >
        <Icon className="w-4 h-4" style={{ color: iconStyle.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-1)] truncate">
          {formatTxAction(tx.type)}
        </p>
        <p className="text-xs text-[var(--text-3)]">
          {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <StatusDot status={status} />
    </button>
  );
}

export const WalletPanel = () => {
  const {
    wallet,
    transactionHistory,
    openActivityDetail,
    setMainView,
    isWalletOpen,
    toggleWallet,
  } = useStore();
  const setWalletStatus = useStore((s) => s.setWalletStatus);
  const loadTransactionHistory = useStore((s) => s.loadTransactionHistory);
  const loadChatSessions = useStore((s) => s.loadChatSessions);

  const { address, isConnected } = useAccount();
  const { setOpen } = useModal();
  const { disconnect } = useDisconnect();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  const isLoggedIn = wallet.isConnected && Boolean(wallet.address);
  const {
    ethDisplay,
    usdTotal,
    isLoading: balancesLoading,
    isRefreshing: balancesRefreshing,
  } = useWalletBalances(isLoggedIn, wallet.address, wallet.token);

  const recentTx = transactionHistory.slice(0, 5);

  const handleMockGoogleLogin = async (email: string, name: string) => {
    try {
      const result = await loginWithGoogle(undefined, {
        sub: `google-sub-${email}`,
        email,
        name,
      });
      if (!result.success || !result.token) throw new Error('Google Sign-In failed');

      setStoredToken(result.token);
      setWalletStatus({
        isConnected: true,
        address: result.user.walletAddress,
        token: result.token,
        authType: 'google',
        email,
        name: name || result.user.displayName || undefined,
        ethBalance: String(result.user.ethBalance ?? 0),
        usdBalance: result.user.mockusdBalance ?? 0,
        profilePicture: undefined,
      });
      setIsGoogleModalOpen(false);
      showToast(`Welcome back, ${name}!`);
      await loadTransactionHistory();
      await loadChatSessions();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Google login failed');
    }
  };

  const handleDisconnect = () => {
    if (wallet.authType !== 'google' && isConnected) disconnect();
    clearAuthSession();
    showToast('Logged out successfully.');
  };

  return (
    <>
      <AnimatePresence>
        {isWalletOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={toggleWallet}
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          />
        )}
      </AnimatePresence>

      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsGoogleModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-semibold text-[var(--text-1)]">Google Secure Auth</h2>
              <button type="button" onClick={() => setIsGoogleModalOpen(false)} className="text-[var(--text-3)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-2)]">Sandbox sign-in for demo wallets.</p>
            <button
              type="button"
              onClick={() => handleMockGoogleLogin('jay@example.com', 'Jay')}
              className={cn(btnGhost, 'justify-start')}
            >
              jay@example.com
            </button>
            <button
              type="button"
              onClick={() => handleMockGoogleLogin('demo@example.com', 'Demo User')}
              className={cn(btnGhost, 'justify-start')}
            >
              demo@example.com
            </button>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs text-[var(--text-1)] focus:outline-none focus:border-[var(--border-default)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customEmail.includes('@')) {
                    const n = customEmail.split('@')[0];
                    handleMockGoogleLogin(customEmail, n.charAt(0).toUpperCase() + n.slice(1));
                  }
                }}
                className={cn(btnPrimary, 'w-auto px-3')}
                style={btnPrimaryStyle}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          'flex flex-col h-full max-h-screen shrink-0 z-50 transition-transform duration-150',
          'bg-[var(--bg-sidebar)] border-l border-[var(--border-subtle)]',
          'fixed right-0 top-0 w-full max-w-[320px] xl:relative xl:w-[320px] xl:max-w-none',
          'max-md:bottom-0 max-md:top-auto max-md:max-h-[85vh] max-md:rounded-t-2xl',
          isWalletOpen
            ? 'translate-x-0 max-md:translate-y-0 flex'
            : 'translate-x-full max-md:translate-y-full max-xl:hidden',
          'xl:flex xl:translate-x-0 xl:translate-y-0'
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 py-5 px-5">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mb-3">
            Connected Wallet
          </p>

          {!isLoggedIn ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(btnPrimary, 'text-sm')}
                style={btnPrimaryStyle}
              >
                Connect Wallet
              </button>
              <button type="button" onClick={() => setIsGoogleModalOpen(true)} className={cn(btnGhost, 'text-sm')}>
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet2 className="w-4 h-4 text-[var(--text-3)]" />
                  <span className="text-sm text-[var(--text-2)]">Web3 Wallet</span>
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-sm text-[var(--text-1)]">
                    {formatAddress(wallet.address ?? '')}
                  </span>
                  {wallet.address ? (
                    <CopyButton text={wallet.address} label="address" size="sm" />
                  ) : null}
                </div>
                <p className="text-xs text-[var(--text-3)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  Base Sepolia
                </p>
              </div>

              <div className="mb-5">
                <p className="text-xs text-[var(--text-3)] mb-1">ETH Balance</p>
                <p className="text-2xl font-semibold text-[var(--text-1)] tabular-nums">
                  {balancesLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  ) : (
                    `${ethDisplay} ETH`
                  )}
                </p>
                <p className="text-sm text-[var(--text-2)] tabular-nums mt-0.5">
                  {balancesLoading ? '—' : formatCurrency(usdTotal)}
                </p>
                {balancesRefreshing && !balancesLoading ? (
                  <p className="text-[11px] text-[var(--text-3)] mt-1">Updating…</p>
                ) : null}
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-3)]">
                    Collection
                  </span>
                  <span className="text-[11px] text-[var(--text-3)]">{wallet.nfts.length} NFT</span>
                </div>
                {wallet.nfts.length === 0 ? (
                  <div className="flex flex-col items-center py-3 text-center">
                    <ImageOff className="w-[18px] h-[18px] text-[var(--text-3)] mb-1.5" />
                    <p className="text-sm text-[var(--text-3)]">No NFTs yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {wallet.nfts.slice(0, 8).map((nft) => (
                      <div
                        key={nft.id}
                        className="w-10 h-10 rounded-md overflow-hidden bg-[var(--bg-surface-2)] shrink-0"
                      >
                        <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-3)]">
                    Transaction History
                  </span>
                  {transactionHistory.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setMainView('activity')}
                      className="text-[11px] text-[var(--accent)] hover:opacity-80"
                    >
                      View all →
                    </button>
                  ) : null}
                </div>
                <div className="overflow-y-auto min-h-0 flex-1">
                  {recentTx.length === 0 ? (
                    <p className="text-sm text-[var(--text-3)] py-4 text-center">No transactions yet</p>
                  ) : (
                    recentTx.map((tx) => (
                      <TransactionHistoryItem
                        key={tx.id}
                        tx={tx}
                        onSelect={() => openActivityDetail(tx.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {isLoggedIn ? (
          <div className="shrink-0 px-5 pb-5 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 text-sm text-[var(--text-3)] hover:text-[var(--danger)] transition-colors duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
};
