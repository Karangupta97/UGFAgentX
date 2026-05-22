import React, { useState } from 'react';
import { useModal } from 'connectkit';
import { Loader2, X, Mail, Wallet2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { loginWithGoogle } from '../../lib/api';
import { setStoredToken } from '../../lib/authStorage';
import { showToast } from '../../lib/toast';
import { btnPrimary, btnPrimaryStyle, btnGhost } from '../../lib/styles';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ThemeToggle';

export const LoginPage = () => {
  const { setWalletStatus, loadTransactionHistory, loadChatSessions } = useStore();
  const { setOpen } = useModal();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMockGoogleLogin = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle(undefined, {
        sub: `google-sub-${email}`,
        email,
        name,
      });

      if (!result.success || !result.token) {
        throw new Error('Google Sign-In failed');
      }

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
      console.error('[GoogleAuth] Sign-in error:', error);
      showToast(error instanceof Error ? error.message : 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'var(--bg-page)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-hero)' }}
      />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div
        className="relative z-10 w-full max-w-[400px] rounded-2xl border border-[var(--border-subtle)] p-8 flex flex-col items-center text-center animate-fade"
        style={{ background: 'var(--gradient-card)' }}
      >
        <div className="w-16 h-16 rounded-full animate-float mb-5 ugf-orb" />

        <h1 className="text-2xl font-semibold text-[var(--text-1)] mb-1">UGF AgentX</h1>
        <p className="text-sm text-[var(--text-2)] mb-8 max-w-[280px]">
          Your gasless Web3 assistant on Base Sepolia
        </p>

        <div className="w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            disabled={isLoading}
            className={cn(btnPrimary)}
            style={btnPrimaryStyle}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Sign in with Google
          </button>
          <button type="button" onClick={() => setOpen(true)} className={btnGhost}>
            <Wallet2 className="w-4 h-4" />
            Connect Web3 Wallet
          </button>
        </div>

        <p className="text-[11px] text-[var(--text-3)] mt-6">
          TYI Mock USD settles gas — no ETH required
        </p>
      </div>

      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsGoogleModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-[var(--text-1)]">Sign in</h2>
              <button type="button" onClick={() => setIsGoogleModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-3)]" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleMockGoogleLogin('jay@example.com', 'Jay')}
              className={btnGhost}
            >
              jay@example.com
            </button>
            <button
              type="button"
              onClick={() => handleMockGoogleLogin('demo@example.com', 'Demo')}
              className={btnGhost}
            >
              demo@example.com
            </button>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)]" />
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs text-[var(--text-1)] focus:outline-none focus:border-[var(--border-default)]"
                />
              </div>
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
                Go
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
