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
    <div className="flex h-screen w-full min-h-0 bg-[#050505] overflow-hidden font-sans">
      <LayoutResizeSync />
      <Sidebar />
      <main className="flex-1 flex min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {mainView === 'activity' ? <ActivityPage /> : <ChatArea />}
        </div>
        <WalletPanel />
      </main>
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
