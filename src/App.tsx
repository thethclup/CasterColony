import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { ColonyView } from './views/ColonyView';
import { CastersView } from './views/CastersView';
import { ResearchView } from './views/ResearchView';
import { AscensionView } from './views/AscensionView';
import { LayoutDashboard, Users, FlaskConical, Webhook, Sun } from 'lucide-react';
import { cn } from './lib/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useConnect, useAccount, useSendTransaction } from 'wagmi';
import { config } from './config/wagmi';

const queryClient = new QueryClient();

// Number formatter helper
export const formatNum = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return Math.floor(num).toString();
};

function GameUI() {
  const [activeTab, setActiveTab] = useState<'colony' | 'casters' | 'research' | 'ascension'>('colony');
  const tick = useGameStore((state) => state.tick);
  const resources = useGameStore((state) => state.resources);
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: 0n,
    });
  };

  // The core Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000); // 1 tick per second
    // Perform initial catch-up tick
    tick();
    return () => clearInterval(interval);
  }, [tick]);

  const tabs = [
    { id: 'colony', label: 'Colony', icon: LayoutDashboard },
    { id: 'casters', label: 'Casters', icon: Users },
    { id: 'research', label: 'Research', icon: FlaskConical },
    { id: 'ascension', label: 'Web3', icon: Webhook },
  ] as const;

  return (
    <div className="w-full h-full flex flex-col items-stretch overflow-hidden font-sans text-white relative bg-[radial-gradient(circle_at_center,#2e1065,#020617)]">
      {/* Top Resources Bar */}
      <header className="flex-none p-4 sm:p-6 bg-indigo-900/40 border-b border-indigo-400/20 backdrop-blur-md z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0">
            <span className="text-xl sm:text-2xl">✨</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">CASTER COLONY</h1>
            <p className="text-[9px] sm:text-xs text-indigo-300 uppercase tracking-widest font-semibold">Level 14 • Archmage Tier</p>
          </div>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3 bg-black/30 p-1.5 sm:p-2 rounded-2xl border border-white/5 order-3 w-full sm:w-auto overflow-x-auto no-scrollbar sm:order-2 justify-center">
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-cyan-950/50 rounded-xl border border-cyan-500/30 whitespace-nowrap">
            <span className="text-cyan-400 font-bold text-xs sm:text-sm">💧 {formatNum(resources.mana)}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-purple-950/50 rounded-xl border border-purple-500/30 whitespace-nowrap">
            <span className="text-purple-400 font-bold text-xs sm:text-sm">💠 {formatNum(resources.crystals)}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-emerald-950/50 rounded-xl border border-emerald-500/30 whitespace-nowrap">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">🌿 {formatNum(resources.moonHerbs)}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-amber-950/50 rounded-xl border border-amber-500/30 whitespace-nowrap">
            <span className="text-orange-400 font-bold text-xs sm:text-sm">🪵 {formatNum(resources.starWood)}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-slate-950/50 rounded-xl border border-slate-500/30 whitespace-nowrap">
            <span className="text-slate-400 font-bold text-xs sm:text-sm">🪨 {formatNum(resources.aetherOre)}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-amber-950/50 rounded-xl border border-amber-500/30 whitespace-nowrap">
            <span className="text-amber-400 font-bold text-xs sm:text-sm">✨ {formatNum(resources.essence)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 order-2 sm:order-3 ml-auto sm:ml-0">
          {isConnected && (
            <button
              onClick={sendGMTransaction}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun className="w-4 h-4" /> Say GM
            </button>
          )}
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 rounded-xl border border-white/10 text-[10px] sm:text-xs font-mono">
            {isConnected ? `${address?.substring(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col text-slate-200">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative w-full h-full p-4 lg:p-12 z-10 flex-1">
          {activeTab === 'colony' && <ColonyView />}
          {activeTab === 'casters' && <CastersView />}
          {activeTab === 'research' && <ResearchView />}
          {activeTab === 'ascension' && <AscensionView />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="flex-none p-4 sm:p-6 lg:p-8 bg-black/40 border-t border-white/5 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-center md:justify-between gap-4">
          <div className="flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center shrink-0 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-2xl border-b-4 transition-transform hover:-translate-y-0.5",
                  activeTab === tab.id 
                    ? "bg-indigo-600 border-indigo-800 text-white" 
                    : "bg-slate-800 border-slate-950 text-slate-400 hover:text-slate-200"
                )}
              >
                <tab.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>

          <button className="hidden md:flex px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl border-b-4 border-amber-800 font-black text-indigo-950 flex-col items-center shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-shadow">
            <span>ASCEND TO ON-CHAIN</span>
            <span className="text-[10px] opacity-70 tracking-tighter">PERMANENT RECORD ON BASE</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameUI />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
