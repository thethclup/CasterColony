import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';
import { Minus, Plus, Users, Zap, BookOpen, Hammer, Sparkles } from 'lucide-react';

const ROLES = [
  { id: 'harvesters', label: 'Harvesters', desc: 'Gather mana & crystals', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'researchers', label: 'Researchers', desc: 'Study ancient runes', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'architects', label: 'Architects', desc: 'Reduce build costs (soon)', icon: Hammer, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { id: 'enchanters', label: 'Enchanters', desc: 'Extract arcane essence', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-400/10' },
] as const;

export function CastersView() {
  const { casters, assignCaster } = useGameStore();

  return (
    <div className="p-4 h-full flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-serif mb-1">Caster Management</h2>
        <p className="text-sm text-slate-400">Assign your acolytes to tasks.</p>
      </div>

      <div className="bg-indigo-900/60 border border-indigo-400/20 rounded-2xl p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <Users className="w-8 h-8 mx-auto mb-2 text-indigo-300 opacity-80" />
        <div className="text-4xl font-mono font-bold text-white shadow-indigo-500">{casters.unassigned}</div>
        <div className="text-xs font-black text-indigo-300 uppercase tracking-widest mt-2">Unassigned Casters</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 pb-8">
        {ROLES.map((role) => {
          const count = casters[role.id as keyof Omit<typeof casters, 'unassigned'>];
          const Icon = role.icon;
          
          return (
            <div key={role.id} className="flex items-center gap-4 p-4 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className={cn("p-3 rounded-xl border border-white/10", role.bg, role.color)}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-200">{role.label}</div>
                <div className="text-[10px] text-slate-400 truncate tracking-wide">{role.desc}</div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => assignCaster(role.id as any, -1)}
                  disabled={count <= 0}
                  className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4 text-slate-300" />
                </motion.button>
                <div className="font-mono w-4 text-center font-bold text-lg text-white">{count}</div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => assignCaster(role.id as any, 1)}
                  disabled={casters.unassigned <= 0}
                  className="w-8 h-8 rounded-full bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-indigo-600 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                >
                  <Plus className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
