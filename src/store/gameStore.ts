import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Resources {
  mana: number;
  crystals: number;
  moonHerbs: number;
  starWood: number;
  aetherOre: number;
  essence: number;
}

export interface CasterStats {
  unassigned: number;
  researchers: number;
  harvesters: number;
  architects: number;
  enchanters: number;
  defenders: number;
}

export type BuildingType = 'manaNode' | 'crystalMine' | 'herbGarden' | 'woodMill' | 'aetherForge';

export interface PlacedBuilding {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  level: number;
}

export interface GameState {
  resources: Resources;
  casters: CasterStats;
  buildings: PlacedBuilding[];
  
  // Metrics
  lastTickTime: number;
  score: number;

  // Actions
  addResource: (type: keyof Resources, amount: number) => void;
  assignCaster: (role: keyof Omit<CasterStats, 'unassigned'>, amount: number) => void;
  placeBuilding: (building: Omit<PlacedBuilding, 'id'>) => void;
  tick: () => void;
  ascend: () => void;
}

// Balance config
export const PRODUCTION_RATES = {
  mana: { base: 1, perHarvester: 0.5, perManaNode: 2 },
  crystals: { base: 0.1, perHarvester: 0.1, perCrystalMine: 0.5 },
  moonHerbs: { base: 0, perHarvester: 0.2, perHerbGarden: 0.5 },
  starWood: { base: 0, perArchitect: 0.2, perWoodMill: 0.5 },
  aetherOre: { base: 0, perEnchanter: 0.1, perAetherForge: 0.3 },
  essence: { base: 0, perEnchanter: 0.05 },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      resources: {
        mana: 0,
        crystals: 0,
        moonHerbs: 0,
        starWood: 0,
        aetherOre: 0,
        essence: 0,
      },
      casters: {
        unassigned: 3,
        researchers: 0,
        harvesters: 0,
        architects: 0,
        enchanters: 0,
        defenders: 0,
      },
      buildings: [],
      lastTickTime: Date.now(),
      score: 0,

      addResource: (type, amount) => 
        set((state) => ({
          resources: { ...state.resources, [type]: state.resources[type] + amount }
        })),

      assignCaster: (role, amount) => 
        set((state) => {
          const change = amount > 0 ? 1 : -1;
          const absChange = Math.abs(amount);
          
          if (change > 0 && state.casters.unassigned >= absChange) {
            return {
              casters: {
                ...state.casters,
                unassigned: state.casters.unassigned - absChange,
                [role]: state.casters[role] + absChange,
              }
            };
          } else if (change < 0 && state.casters[role] >= absChange) {
            return {
              casters: {
                ...state.casters,
                unassigned: state.casters.unassigned + absChange,
                [role]: state.casters[role] - absChange,
              }
            };
          }
          return state;
        }),

      placeBuilding: (building) => 
        set((state) => ({
          buildings: [...state.buildings, { ...building, id: Math.random().toString(36).substr(2, 9) }]
        })),

      tick: () => 
        set((state) => {
          const now = Date.now();
          const deltaSeconds = Math.max(0, (now - state.lastTickTime) / 1000);
          // Prevent massive leaps if away for years, cap at 24 hours of offline progress
          const effectiveDelta = Math.min(deltaSeconds, 86400);

          // Calculate resource generation
          const { casters, buildings } = state;
          
          const manaNodes = buildings.filter(b => b.type === 'manaNode').length;
          const mines = buildings.filter(b => b.type === 'crystalMine').length;
          const gardens = buildings.filter(b => b.type === 'herbGarden').length;
          const mills = buildings.filter(b => b.type === 'woodMill').length;
          const forges = buildings.filter(b => b.type === 'aetherForge').length;

          const manaGen = (PRODUCTION_RATES.mana.base + (casters.harvesters * PRODUCTION_RATES.mana.perHarvester) + (manaNodes * PRODUCTION_RATES.mana.perManaNode)) * effectiveDelta;
          const crystalGen = (PRODUCTION_RATES.crystals.base + (casters.harvesters * PRODUCTION_RATES.crystals.perHarvester) + (mines * PRODUCTION_RATES.crystals.perCrystalMine)) * effectiveDelta;
          const herbGen = (PRODUCTION_RATES.moonHerbs.base + (casters.harvesters * PRODUCTION_RATES.moonHerbs.perHarvester) + (gardens * PRODUCTION_RATES.moonHerbs.perHerbGarden)) * effectiveDelta;
          const woodGen = (PRODUCTION_RATES.starWood.base + (casters.architects * PRODUCTION_RATES.starWood.perArchitect) + (mills * PRODUCTION_RATES.starWood.perWoodMill)) * effectiveDelta;
          const oreGen = (PRODUCTION_RATES.aetherOre.base + (casters.enchanters * PRODUCTION_RATES.aetherOre.perEnchanter) + (forges * PRODUCTION_RATES.aetherOre.perAetherForge)) * effectiveDelta;
          const essenceGen = (PRODUCTION_RATES.essence.base + (casters.enchanters * PRODUCTION_RATES.essence.perEnchanter)) * effectiveDelta;

          // Simple score calculation based on total resources collected history (here simplified to current reserves + buildings)
          const newScore = Math.floor(
            state.resources.mana * 0.1 + 
            state.resources.crystals * 2 + 
            state.resources.moonHerbs * 5 + 
            state.resources.starWood * 5 + 
            state.resources.aetherOre * 10 + 
            state.resources.essence * 100 + 
            state.buildings.length * 50
          );

          return {
            lastTickTime: now,
            score: state.score > newScore ? state.score : newScore, // Score doesn't drop
            resources: {
              mana: state.resources.mana + manaGen,
              crystals: state.resources.crystals + crystalGen,
              moonHerbs: state.resources.moonHerbs + herbGen,
              starWood: state.resources.starWood + woodGen,
              aetherOre: state.resources.aetherOre + oreGen,
              essence: state.resources.essence + essenceGen,
            }
          };
        }),

      ascend: () => 
        set((state) => {
          // Ascension logic (prestige)
          const prestigeGain = Math.floor(state.score / 1000);
          return {
            resources: { mana: 0, crystals: 0, moonHerbs: 0, starWood: 0, aetherOre: 0, essence: prestigeGain },
            casters: { unassigned: 3 + prestigeGain, researchers: 0, harvesters: 0, architects: 0, enchanters: 0, defenders: 0 },
            buildings: [],
            score: 0,
            lastTickTime: Date.now(),
          };
        })
    }),
    {
      name: 'caster-colony-storage',
    }
  )
);
