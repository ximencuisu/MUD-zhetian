// 炼丹配方系统
// 每个配方定义：需要哪些材料 + 所需境界等级 + 基础成功率 + 费用

export interface AlchemyRecipe {
  id: string;
  name: string;
  description: string;
  // 产出的丹药ID
  resultId: string;
  // 所需材料: { itemId: 数量 }
  materials: Record<string, number>;
  // 最低境界等级要求
  requiredLevel: number;
  // 基础成功率 (0-100)
  baseSuccessRate: number;
  // 金币费用
  goldCost: number;
}

// ── 绿色丹药配方 ──────────────────────────────────────────────

const rage_pill_recipe: AlchemyRecipe = {
  id: 'recipe_rage_pill',
  name: '狂暴丹配方',
  description: '以源石精华和回气丹为引，炼制短时间内提升攻击力的丹药。',
  resultId: 'rage_pill',
  materials: {
    'source_stone': 3,
    'qi_recovery_pill': 1,
  },
  requiredLevel: 5,
  baseSuccessRate: 85,
  goldCost: 30,
};

const armor_pill_recipe: AlchemyRecipe = {
  id: 'recipe_armor_pill',
  name: '铁甲丹配方',
  description: '以源晶和铁精炼制而成的防御丹药，可短时间大幅提升肉身防御。',
  resultId: 'armor_pill',
  materials: {
    'source_crystal': 1,
    'source_stone': 2,
    'iron_rod': 1,
  },
  requiredLevel: 8,
  baseSuccessRate: 80,
  goldCost: 50,
};

const speed_pill_recipe: AlchemyRecipe = {
  id: 'recipe_speed_pill',
  name: '风行丹配方',
  description: '以轻灵草和源石炼制，服用后可提升身法速度。',
  resultId: 'speed_pill',
  materials: {
    'source_stone': 3,
    'qi_recovery_pill': 1,
  },
  requiredLevel: 5,
  baseSuccessRate: 85,
  goldCost: 25,
};

// ── 蓝色丹药配方 ──────────────────────────────────────────────

const crit_pill_recipe: AlchemyRecipe = {
  id: 'recipe_crit_pill',
  name: '破障丹配方',
  description: '需要源晶和经文碎片激发潜能，短时间内提升暴击率。',
  resultId: 'crit_pill',
  materials: {
    'source_crystal': 2,
    'scripture_shard_common': 1,
  },
  requiredLevel: 15,
  baseSuccessRate: 70,
  goldCost: 120,
};

const regen_potion_recipe: AlchemyRecipe = {
  id: 'recipe_regen_potion',
  name: '回神液配方',
  description: '以回气丹和源晶为主药，炼制后可持续恢复气血。',
  resultId: 'regen_potion',
  materials: {
    'qi_recovery_pill': 2,
    'source_crystal': 1,
  },
  requiredLevel: 12,
  baseSuccessRate: 75,
  goldCost: 80,
};

// ── 紫色丹药配方 ──────────────────────────────────────────────

const divine_pill_recipe: AlchemyRecipe = {
  id: 'recipe_divine_pill',
  name: '神力丹配方',
  description: '禁忌丹药配方，以龙血精华和源晶为引，辅以古经残卷，短时间内战力大幅飙升。',
  resultId: 'divine_pill',
  materials: {
    'dragon_blood': 2,
    'source_crystal': 3,
    'ancient_scripture_fragment': 1,
  },
  requiredLevel: 25,
  baseSuccessRate: 55,
  goldCost: 300,
};

const berserk_pill_recipe: AlchemyRecipe = {
  id: 'recipe_berserk_pill',
  name: '燃血丹配方',
  description: '燃烧气血换取力量的禁忌之丹，需要妖兽内丹和龙血精华。',
  resultId: 'berserk_pill',
  materials: {
    'dragon_blood': 2,
    'source_crystal': 2,
    'demon_beast_core': 1,
  },
  requiredLevel: 22,
  baseSuccessRate: 60,
  goldCost: 280,
};

// ── 全部配方 ──────────────────────────────────────────────────

export const ALL_ALCHEMY_RECIPES: AlchemyRecipe[] = [
  rage_pill_recipe,
  armor_pill_recipe,
  speed_pill_recipe,
  crit_pill_recipe,
  regen_potion_recipe,
  divine_pill_recipe,
  berserk_pill_recipe,
];

// 按结果ID快速查找配方
export const ALCHEMY_RECIPE_MAP: Record<string, AlchemyRecipe> = {};
for (const r of ALL_ALCHEMY_RECIPES) {
  ALCHEMY_RECIPE_MAP[r.resultId] = r;
}
