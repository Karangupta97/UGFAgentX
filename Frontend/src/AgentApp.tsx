import React, { useEffect } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ActivityPage } from './components/activity/ActivityPage';
import { WalletPanel } from './components/wallet/WalletPanel';
import { LayoutResizeSync } from './components/LayoutResizeSync';
import { Web3Provider } from './components/Web3Provider';
import { LoginPage } from './components/auth/LoginPage';
import { useStore } from './store/useStore';

function AgentAppContent() {
  const { wallet, mainView } = useStore();

  if (!wallet.isConnected) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-page)]">
      <LayoutResizeSync />
      <div className="relative h-full w-full xl:grid xl:grid-cols-[300px_minmax(0,1fr)_320px] xl:grid-rows-1 bg-[var(--bg-app)]">
        <Sidebar />
        <main className="relative z-0 min-w-0 min-h-0 h-full w-full flex flex-col border-[var(--border-subtle)] xl:border-l xl:border-r">
          {mainView === 'activity' ? <ActivityPage /> : <ChatArea />}
        </main>
        <WalletPanel />
      </div>
    </div>
  );
}

export default function AgentApp() {
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  return (
    <Web3Provider>
      <AgentAppContent />
    </Web3Provider>
  );
}
