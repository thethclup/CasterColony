import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, BuildingType } from '../store/gameStore';
import { Grid, Sparkles, Gem, Book, TowerControl, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatNum } from '../App';

const BUILDING_COSTS: Record<BuildingType, { mana: number; crystals: number }> = {
  manaNode: { mana: 50, crystals: 0 },
  crystalMine: { mana: 100, crystals: 10 },
  runeLibrary: { mana: 250, crystals: 50 },
  arcaneTower: { mana: 1000, crystals: 200 }
};

const BUILDING_INFO: Record<BuildingType, { icon: any; color: string; label: string; desc: string, style: string }> = {
  manaNode: { icon: Sparkles, color: 'text-[var(--color-mana)]', label: 'Mana Node', desc: '+2 Mana/s per Harvester', style: 'bg-gradient-to-b from-cyan-500 to-cyan-800 border-cyan-300' },
  crystalMine: { icon: Gem, color: 'text-[var(--color-crystal)]', label: 'Crystal Mine', desc: '+0.5 Crystals/s', style: 'bg-gradient-to-b from-purple-500 to-purple-800 border-purple-300' },
  runeLibrary: { icon: Book, color: 'text-[var(--color-rune)]', label: 'Rune Library', desc: '+0.5 Runes/s for Researchers', style: 'bg-gradient-to-b from-emerald-500 to-emerald-800 border-emerald-300' },
  arcaneTower: { icon: TowerControl, color: 'text-[var(--color-essence)]', label: 'Arcane Tower', desc: 'Boosts total colony range. (Future update)', style: 'bg-gradient-to-b from-indigo-500 to-indigo-800 border-indigo-300' }
};

export function ColonyView() {
  const { buildings, resources, placeBuilding, addResource } = useGameStore();
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  
  // Create a 4x4 grid (16 cells) for mobile ease
  const GRID_SIZE = 16;
  const gridCells = Array.from({ length: GRID_SIZE }, (_, i) => ({
    index: i,
    x: i % 4,
    y: Math.floor(i / 4)
  }));

  const handleBuild = (type: BuildingType) => {
    if (selectedCell === null) return;
    
    const cost = BUILDING_COSTS[type];
    if (resources.mana >= cost.mana && resources.crystals >= cost.crystals) {
      // Deduct resources
      addResource('mana', -cost.mana);
      addResource('crystals', -cost.crystals);
      
      const x = selectedCell % 4;
      const y = Math.floor(selectedCell / 4);
      
      placeBuilding({ type, x, y, level: 1 });
      setSelectedCell(null);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-6 relative">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-serif tracking-tight text-white mb-1">Arcane Colony</h1>
        <p className="text-sm text-slate-400">Establish your magical settlement.</p>
        <p className="text-xs text-var(--color-mana) mt-2 opacity-80">(Tap empty space to build)</p>
      </div>

      {/* Isometric-ish Grid view */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-4 gap-4 w-full max-w-md mx-auto aspect-square p-6 bg-indigo-900/40 border border-indigo-400/20 backdrop-blur-sm rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
          {gridCells.map((cell) => {
            const building = buildings.find(b => b.x === cell.x && b.y === cell.y);
            const isSelected = selectedCell === cell.index;
            
            return (
              <motion.button
                key={cell.index}
                whileHover={{ scale: building ? 1.05 : 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!building) {
                    setSelectedCell(isSelected ? null : cell.index);
                  }
                }}
                className={cn(
                  "relative aspect-square flex items-center justify-center transition-all duration-300",
                  building ? `rounded-[2rem] border-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${BUILDING_INFO[building.type].style}` 
                           : "rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 border-dashed",
                  isSelected && !building && "ring-2 ring-[var(--color-mana)] bg-[var(--color-mana)]/10"
                )}
              >
                {building ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn("flex flex-col items-center justify-center text-white")}
                  >
                    {(() => {
                      const Icon = BUILDING_INFO[building.type].icon;
                      return <Icon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />;
                    })()}
                    <div className="absolute -bottom-3 bg-amber-500 px-2 py-0.5 rounded-full text-[9px] font-black shadow-md text-indigo-950">LVL {building.level}</div>
                  </motion.div>
                ) : (
                  <Plus className={cn("w-6 h-6 transition-opacity", isSelected ? "opacity-100 text-[var(--color-mana)]" : "opacity-20")} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Build Menu Sheet */}
      <AnimatePresence>
        {selectedCell !== null && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-4 left-4 right-4 bg-indigo-900/60 p-5 rounded-2xl border border-indigo-400/20 backdrop-blur-md shadow-2xl z-20 max-h-[50vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-indigo-100">Construct</h3>
              <button onClick={() => setSelectedCell(null)} className="text-indigo-400 hover:text-white p-2">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {(Object.keys(BUILDING_COSTS) as BuildingType[]).map((type) => {
                const cost = BUILDING_COSTS[type];
                const info = BUILDING_INFO[type];
                const Icon = info.icon;
                const canAfford = resources.mana >= cost.mana && resources.crystals >= cost.crystals;

                return (
                  <motion.button
                    key={type}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                    onClick={() => handleBuild(type)}
                    disabled={!canAfford}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl border text-left transition-colors",
                      canAfford 
                        ? "bg-slate-900/60 border-white/10 hover:bg-slate-800/80" 
                        : "bg-black/50 border-white/5 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl flex items-center justify-center text-white border-2", info.style.replace('from-', 'from-').replace('to-', 'to-'))}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-200">{info.label}</div>
                      <div className="text-[10px] text-indigo-300">{info.desc}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs font-bold">
                      {cost.mana > 0 && (
                        <span className={resources.mana >= cost.mana ? "text-[var(--color-mana)]" : "text-red-400"}>
                          {formatNum(cost.mana)} Mana
                        </span>
                      )}
                      {cost.crystals > 0 && (
                        <span className={resources.crystals >= cost.crystals ? "text-[var(--color-crystal)]" : "text-red-400"}>
                          {formatNum(cost.crystals)} Cry
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
