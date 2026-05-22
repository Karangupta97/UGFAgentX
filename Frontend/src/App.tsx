import React from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ActivityPage } from './components/activity/ActivityPage';
import { WalletPanel } from './components/wallet/WalletPanel';
import { LayoutResizeSync } from './components/LayoutResizeSync';
import { Web3Provider } from './components/Web3Provider';
import { LoginPage } from './components/auth/LoginPage';
import { useStore } from './store/useStore';

function AppContent() {
  const { wallet, mainView } = useStore();

  if (!wallet.isConnected) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-page)]">
      <LayoutResizeSync />
      <div className="h-full w-full grid grid-cols-1 xl:grid-cols-[220px_1fr_240px] bg-[var(--bg-app)]">
        <Sidebar />
        <main className="min-w-0 min-h-0 flex flex-col border-[var(--border-subtle)] xl:border-l xl:border-r">
          {mainView === 'activity' ? <ActivityPage /> : <ChatArea />}
        </main>
        <WalletPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
