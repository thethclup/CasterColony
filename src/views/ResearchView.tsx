import { FlaskConical } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function ResearchView() {
  const { resources } = useGameStore();
  
  return (
    <div className="p-4 h-full flex flex-col justify-center items-center gap-6 text-center relative overflow-hidden">
      <FlaskConical className="w-20 h-20 text-[var(--color-rune)] opacity-20" />
      
      <div className="z-10">
        <h2 className="text-2xl font-bold font-serif mb-2">Spell Codex</h2>
        <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
          The research network is still expanding its ley lines. Soon you will unlock powerful paradigms by spending Ancient Runes.
        </p>
      </div>
      
      <div className="bg-slate-900/60 border border-[var(--color-rune)]/20 text-[var(--color-rune)] px-8 py-6 rounded-2xl z-10 flex flex-col items-center backdrop-blur-sm shadow-lg">
        <span className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Current Runes</span>
        <span className="text-4xl font-mono font-bold animate-pulse-glow">{Math.floor(resources.runes)}</span>
      </div>

    </div>
  );
}
