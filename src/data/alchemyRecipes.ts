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

  // ── 新增绿色配方 ──
  {
    id: 'recipe_health_pill',
    name: '回血丹配方',
    description: '以灵草和源石炼制的基础回复丹药，可快速恢复气血。',
    resultId: 'health_pill',
    materials: { 'green_herb': 2, 'source_stone': 1 },
    requiredLevel: 1,
    baseSuccessRate: 95,
    goldCost: 10,
  },
  {
    id: 'recipe_mp_pill',
    name: '回神丹配方',
    description: '以灵草和源石炼制的基础回复丹药，可快速恢复神力。',
    resultId: 'mp_pill',
    materials: { 'green_herb': 2, 'source_stone': 1 },
    requiredLevel: 1,
    baseSuccessRate: 95,
    goldCost: 10,
  },
  {
    id: 'recipe_qi_recovery_pill',
    name: '回气丹配方',
    description: '以灵草炼制的基础丹药，可恢复气血与神力。',
    resultId: 'qi_recovery_pill',
    materials: { 'green_herb': 3, 'source_stone': 2 },
    requiredLevel: 3,
    baseSuccessRate: 90,
    goldCost: 15,
  },

  // ── 新增蓝色配方 ──
  {
    id: 'recipe_exp_pill',
    name: '经验丹配方',
    description: '以源晶和经文碎片炼制，服用后可获得大量经验。',
    resultId: 'exp_pill',
    materials: { 'source_crystal': 3, 'scripture_shard_common': 2 },
    requiredLevel: 15,
    baseSuccessRate: 70,
    goldCost: 150,
  },
  {
    id: 'recipe_gold_pill',
    name: '聚财丹配方',
    description: '以源晶和金精炼制，服用后可获得大量金叶。',
    resultId: 'gold_pill',
    materials: { 'source_crystal': 2, 'gold_coin': 10 },
    requiredLevel: 10,
    baseSuccessRate: 75,
    goldCost: 100,
  },
  {
    id: 'recipe_reputation_pill',
    name: '声望丹配方',
    description: '以源晶和荣誉勋章炼制，服用后可获得声望。',
    resultId: 'reputation_pill',
    materials: { 'source_crystal': 2, 'sect_honor_medal': 1 },
    requiredLevel: 20,
    baseSuccessRate: 65,
    goldCost: 200,
  },

  // ── 新增紫色配方 ──
  {
    id: 'recipe_breakthrough_pill',
    name: '突破丹配方',
    description: '以龙血和古经残卷炼制，服用后可大幅提升突破成功率。',
    resultId: 'breakthrough_pill',
    materials: { 'dragon_blood': 3, 'ancient_scripture_fragment': 1, 'source_crystal': 5 },
    requiredLevel: 30,
    baseSuccessRate: 50,
    goldCost: 500,
  },
  {
    id: 'recipe_marrow_wash_pill',
    name: '洗髓丹配方',
    description: '以龙血和妖兽内丹炼制，服用后可洗筋伐髓，提升资质。',
    resultId: 'marrow_wash_pill',
    materials: { 'dragon_blood': 2, 'demon_beast_core': 2, 'source_crystal': 3 },
    requiredLevel: 25,
    baseSuccessRate: 55,
    goldCost: 400,
  },
  {
    id: 'recipe_rebirth_pill',
    name: '重生丹配方',
    description: '以凤凰羽毛和龙血炼制，服用后可浴火重生，恢复全部状态。',
    resultId: 'rebirth_pill',
    materials: { 'phoenix_feather': 1, 'dragon_blood': 3, 'ancient_scripture_fragment': 1 },
    requiredLevel: 35,
    baseSuccessRate: 45,
    goldCost: 800,
  },

  // ── 新增橙色配方 ──
  {
    id: 'recipe_nine_turn_elixir',
    name: '九转金丹配方',
    description: '传说中的神丹配方，需要极其珍稀的材料。服用后可直接提升一个境界。',
    resultId: 'nine_turn_elixir',
    materials: { 'phoenix_feather': 2, 'emperor_blood': 3, 'ancient_scripture_fragment': 2, 'source_crystal': 10 },
    requiredLevel: 50,
    baseSuccessRate: 30,
    goldCost: 2000,
  },
  {
    id: 'recipe_emperor_pill',
    name: '帝丹配方',
    description: '以帝血和古经残卷炼制的禁忌丹药，服用后可获得帝者之力。',
    resultId: 'emperor_pill',
    materials: { 'emperor_blood': 5, 'ancient_scripture_fragment': 3, 'phoenix_feather': 1 },
    requiredLevel: 60,
    baseSuccessRate: 25,
    goldCost: 5000,
  },
  {
    id: 'recipe_heaven_dao_pill',
    name: '天道丹配方',
    description: '以天道精华和帝血炼制的终极丹药，服用后可感悟天道之力。',
    resultId: 'heaven_dao_pill',
    materials: { 'heaven_essence': 3, 'emperor_blood': 5, 'ancient_scripture_fragment': 5 },
    requiredLevel: 70,
    baseSuccessRate: 20,
    goldCost: 10000,
  },
];

// 按结果ID快速查找配方
export const ALCHEMY_RECIPE_MAP: Record<string, AlchemyRecipe> = {};
for (const r of ALL_ALCHEMY_RECIPES) {
  ALCHEMY_RECIPE_MAP[r.resultId] = r;
}
