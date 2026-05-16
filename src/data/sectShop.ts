

// 门派商店物品类型
export interface SectShopItem {
  id: string;
  name: string;
  description: string;
  type: 'item' | 'skill' | 'material' | 'consumable';
  contribCost: number;
  goldCost: number;
  requiredRank?: string;
  requiredReputation?: number;
  stock: number;
  maxStock: number;
  icon: string;
  effect?: string;
}

// 通用门派商店物品
export const COMMON_SECT_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'sect_pill_1',
    name: '聚气丹',
    description: '门派特制的丹药，可加速灵气吸收。',
    type: 'consumable',
    contribCost: 50,
    goldCost: 100,
    stock: 10,
    maxStock: 10,
    icon: '💊',
    effect: '修炼速度+20%，持续1小时',
  },
  {
    id: 'sect_pill_2',
    name: '洗髓丹',
    description: '洗髓伐骨，改善体质。',
    type: 'consumable',
    contribCost: 200,
    goldCost: 500,
    requiredRank: '内门弟子',
    stock: 5,
    maxStock: 5,
    icon: '💎',
    effect: '随机提升一项属性1-3点',
  },
  {
    id: 'sect_pill_3',
    name: '破境丹',
    description: '辅助突破境界的珍贵丹药。',
    type: 'consumable',
    contribCost: 500,
    goldCost: 2000,
    requiredRank: '真传弟子',
    stock: 2,
    maxStock: 2,
    icon: '🔮',
    effect: '突破成功率+15%',
  },
  {
    id: 'sect_material_1',
    name: '灵石',
    description: '蕴含灵气的矿石，可用于炼器。',
    type: 'material',
    contribCost: 20,
    goldCost: 50,
    stock: 50,
    maxStock: 50,
    icon: '💎',
  },
  {
    id: 'sect_material_2',
    name: '源石碎片',
    description: '源石的碎片，蕴含神秘力量。',
    type: 'material',
    contribCost: 100,
    goldCost: 300,
    requiredRank: '内门弟子',
    stock: 20,
    maxStock: 20,
    icon: '💠',
  },
  {
    id: 'sect_weapon_1',
    name: '精铁剑',
    description: '门派锻造的基础法器。',
    type: 'item',
    contribCost: 300,
    goldCost: 800,
    requiredRank: '外门弟子',
    stock: 3,
    maxStock: 3,
    icon: '⚔️',
    effect: '攻击+20',
  },
  {
    id: 'sect_armor_1',
    name: '青云袍',
    description: '门派特制的防御法衣。',
    type: 'item',
    contribCost: 300,
    goldCost: 800,
    requiredRank: '外门弟子',
    stock: 3,
    maxStock: 3,
    icon: '👘',
    effect: '防御+15',
  },
  {
    id: 'sect_book_1',
    name: '基础功法心得',
    description: '前辈修炼心得，可加速功法修炼。',
    type: 'consumable',
    contribCost: 80,
    goldCost: 200,
    stock: 10,
    maxStock: 10,
    icon: '📖',
    effect: '功法熟练度+100',
  },
  {
    id: 'sect_book_2',
    name: '高级功法心得',
    description: '高阶修士的修炼心得，极为珍贵。',
    type: 'consumable',
    contribCost: 300,
    goldCost: 800,
    requiredRank: '真传弟子',
    stock: 5,
    maxStock: 5,
    icon: '📚',
    effect: '功法熟练度+500',
  },
  {
    id: 'sect_talisman_1',
    name: '护身符',
    description: '可抵挡一次致命伤害的护身符。',
    type: 'consumable',
    contribCost: 500,
    goldCost: 1500,
    requiredRank: '真传弟子',
    stock: 1,
    maxStock: 1,
    icon: '🎴',
    effect: '死亡时自动复活，保留50%生命',
  },
];

// 摇光圣地专属物品
export const YAOGUAN_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'yg_holy_water',
    name: '圣光灵液',
    description: '摇光圣地特产，蕴含纯净圣光之力。',
    type: 'consumable',
    contribCost: 150,
    goldCost: 400,
    stock: 5,
    maxStock: 5,
    icon: '✨',
    effect: '恢复全部生命，清除负面状态',
  },
  {
    id: 'yg_scripture_fragment',
    name: '圣光经残页',
    description: '摇光圣光经的残页，可用于参悟。',
    type: 'material',
    contribCost: 1000,
    goldCost: 5000,
    requiredRank: '真传弟子',
    requiredReputation: 500,
    stock: 1,
    maxStock: 1,
    icon: '📜',
    effect: '集齐10页可合成完整功法',
  },
];

// 姬家专属物品
export const JI_FAMILY_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'ji_void_stone',
    name: '虚空石',
    description: '蕴含虚空之力的奇石。',
    type: 'material',
    contribCost: 200,
    goldCost: 600,
    stock: 10,
    maxStock: 10,
    icon: '🌌',
    effect: '修炼虚空经时效果+30%',
  },
  {
    id: 'ji_void_ring',
    name: '虚空戒指',
    description: '姬家炼制的储物法器。',
    type: 'item',
    contribCost: 800,
    goldCost: 3000,
    requiredRank: '真传弟子',
    stock: 2,
    maxStock: 2,
    icon: '💍',
    effect: '背包容量+20',
  },
];

// 太玄门专属物品
export const TAIXUAN_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'tx_speed_pill',
    name: '疾风丹',
    description: '太玄门秘制，可短暂提升速度。',
    type: 'consumable',
    contribCost: 100,
    goldCost: 300,
    stock: 8,
    maxStock: 8,
    icon: '💨',
    effect: '速度+50%，持续30分钟',
  },
  {
    id: 'tx_scripture_fragment',
    name: '行字秘残篇',
    description: '九秘之一的残篇。',
    type: 'material',
    contribCost: 2000,
    goldCost: 10000,
    requiredRank: '内门长老',
    requiredReputation: 1000,
    stock: 1,
    maxStock: 1,
    icon: '📜',
    effect: '集齐残篇可领悟行字秘',
  },
];

// 紫府圣地专属物品
export const ZIFU_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'zf_purple_qi',
    name: '紫气精华',
    description: '紫府圣地采集的紫气精华。',
    type: 'consumable',
    contribCost: 120,
    goldCost: 350,
    stock: 6,
    maxStock: 6,
    icon: '☁️',
    effect: '修炼时获得额外20%经验',
  },
];

// 姜家专属物品
export const JIANG_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'jg_body_pill',
    name: '炼体丹',
    description: '姜家秘制的炼体丹药。',
    type: 'consumable',
    contribCost: 150,
    goldCost: 400,
    stock: 8,
    maxStock: 8,
    icon: '💪',
    effect: '体质+2，持续效果',
  },
];

// 妖族专属物品
export const YAO_SHOP_ITEMS: SectShopItem[] = [
  {
    id: 'yao_blood_pill',
    name: '妖血丹',
    description: '提纯妖血炼制的丹药。',
    type: 'consumable',
    contribCost: 150,
    goldCost: 400,
    stock: 8,
    maxStock: 8,
    icon: '🩸',
    effect: '妖化状态下全属性+10%',
  },
  {
    id: 'yao_dragon_blood',
    name: '龙血',
    description: '稀释的龙族精血。',
    type: 'material',
    contribCost: 500,
    goldCost: 2000,
    requiredRank: '真传弟子',
    stock: 3,
    maxStock: 3,
    icon: '🐉',
    effect: '炼体功法效果+50%',
  },
];

// 获取门派商店物品
export function getSectShopItems(sectId: string): SectShopItem[] {
  const common = [...COMMON_SECT_SHOP_ITEMS];
  let sectSpecific: SectShopItem[] = [];
  
  switch (sectId) {
    case 'yaoguan':
      sectSpecific = YAOGUAN_SHOP_ITEMS;
      break;
    case 'ji_family':
      sectSpecific = JI_FAMILY_SHOP_ITEMS;
      break;
    case 'taixuan':
      sectSpecific = TAIXUAN_SHOP_ITEMS;
      break;
    case 'zifu':
      sectSpecific = ZIFU_SHOP_ITEMS;
      break;
    case 'jiang_family':
      sectSpecific = JIANG_SHOP_ITEMS;
      break;
    case 'yao_clan':
      sectSpecific = YAO_SHOP_ITEMS;
      break;
  }
  
  return [...common, ...sectSpecific];
}

// 检查是否可以购买
export function canBuyItem(
  item: SectShopItem,
  contribution: number,
  gold: number,
  rank: string | null,
  reputation: number
): { canBuy: boolean; reason?: string } {
  if (item.stock <= 0) {
    return { canBuy: false, reason: '该物品已售罄' };
  }
  if (contribution < item.contribCost) {
    return { canBuy: false, reason: `贡献值不足（需要${item.contribCost}）` };
  }
  if (gold < item.goldCost) {
    return { canBuy: false, reason: `金叶不足（需要${item.goldCost}）` };
  }
  if (item.requiredRank && rank) {
    const rankOrder = ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'];
    if (rankOrder.indexOf(rank) < rankOrder.indexOf(item.requiredRank)) {
      return { canBuy: false, reason: `需要职位：${item.requiredRank}` };
    }
  }
  if (item.requiredReputation && reputation < item.requiredReputation) {
    return { canBuy: false, reason: `需要声望：${item.requiredReputation}` };
  }
  return { canBuy: true };
}

// 每日刷新商店库存
export function refreshShopStock(items: SectShopItem[]): SectShopItem[] {
  return items.map(item => ({
    ...item,
    stock: item.maxStock,
  }));
}
