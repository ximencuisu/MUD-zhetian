// 锻造配方系统
export interface ForgeRecipe {
  id: string;
  name: string;
  description: string;
  resultId: string;
  materials: Record<string, number>;
  requiredLevel: number;
  goldCost: number;
}

export const ALL_FORGE_RECIPES: ForgeRecipe[] = [
  {
    id: 'forge_iron_sword',
    name: '锻造铁剑',
    description: '以精铁矿石锻造的长剑。',
    resultId: 'iron_sword',
    materials: { 'iron_ore': 3 },
    requiredLevel: 1,
    goldCost: 100,
  },
  {
    id: 'forge_steel_armor',
    name: '锻造钢甲',
    description: '以精钢矿和兽皮缝制的护甲。',
    resultId: 'steel_armor',
    materials: { 'steel_ore': 2, 'leather': 1 },
    requiredLevel: 5,
    goldCost: 200,
  },
];

export const FORGE_RECIPE_MAP: Record<string, ForgeRecipe> = {};
for (const r of ALL_FORGE_RECIPES) {
  FORGE_RECIPE_MAP[r.id] = r;
}
