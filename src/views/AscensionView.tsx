import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatNum } from '../App';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';
import { Sparkles, ArrowUpCircle, ShieldCheck, History } from 'lucide-react';
import { motion } from 'motion/react';

export function AscensionView() {
  const { isConnected, address } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { score, resources, ascend, buildings } = useGameStore();

  const [txState, setTxState] = useState<'idle' | 'signing' | 'mining' | 'success'>('idle');

  // Simulate on-chain submission (ERC-8021 interaction would happen here)
  const handleRecordColony = async () => {
    if (!isConnected) return;
    setTxState('signing');
    
    // In a real implementation:
    // 1. SIWE signature generating a session
    // 2. Wagmi useWriteContract passing ATTRIBUTION_CODE
    // 3. Waiting for receipt
    
    setTimeout(() => {
      setTxState('mining');
      setTimeout(() => {
        setTxState('success');
        setTimeout(() => setTxState('idle'), 3000);
      }, 2000);
    }, 1500);
  };

  const handleAscend = () => {
    if (confirm('Ascension will reset buildings, casters, and standard resources, but grant Arcane Essence. Continue?')) {
      ascend();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-serif mb-1">Web3 Integration</h2>
        <p className="text-sm text-slate-400">Record your legacy on Base Mainnet.</p>
      </div>

      <div className="bg-indigo-900/60 border border-[var(--color-essence)]/30 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-white">Colony Power</h3>
            <p className="text-xs text-slate-400">Calculated from total assets</p>
          </div>
          <div className="text-3xl font-mono font-bold animate-pulse-glow text-[var(--color-essence)]">
            {formatNum(score)}
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
              <span className="text-slate-400 font-bold uppercase">Wallet</span>
              <span className="font-mono text-[var(--color-mana)] font-bold">{address?.slice(0,6)}...{address?.slice(-4)}</span>
            </div>
            
            <button
              onClick={handleRecordColony}
              disabled={txState !== 'idle' || score < 10}
              className={cn(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                txState !== 'idle' ? "bg-slate-800 text-slate-400" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30",
                score < 10 && "opacity-50 cursor-not-allowed shadow-none"
              )}
            >
              {txState === 'idle' && <ShieldCheck className="w-5 h-5" />}
              {txState === 'idle' && (score < 10 ? 'Power too low' : 'Record Colony On-Chain')}
              {txState === 'signing' && 'Confirm in wallet...'}
              {txState === 'mining' && 'Mining on Base...'}
              {txState === 'success' && 'Archived in the Codex!'}
            </button>
            
            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <History className="w-3 h-3" /> Includes ERC-8021 Attribution (bc_ls55a4v0)
            </div>

            <button onClick={() => disconnect()} className="w-full text-xs text-red-400/80 hover:text-red-400 py-2">
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold transition-colors shadow-lg"
              >
                Connect Wallet ({connector.name})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-6 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-purple-500/20 rounded-2xl text-center backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
        <h3 className="font-black text-xl text-purple-200 mb-2 tracking-tight">Ascension</h3>
        <p className="text-xs text-purple-300/70 mb-6 leading-relaxed font-medium">
          Sacrifice your current colony to claim Arcane Essence.<br/>
          (Gain +{Math.floor(score / 1000)} Essence)
        </p>
        <button 
          onClick={handleAscend}
          disabled={score < 1000}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-purple-500/20 w-full sm:w-auto"
        >
          {score < 1000 ? "Need 1000 Power" : "Ascend Colony"}
        </button>
      </div>

    </div>
  );
}
