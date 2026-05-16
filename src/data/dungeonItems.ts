import { Item } from '../types/game';

// 副本相关物品：秘籍残页、源石、龙血等
export const DUNGEON_ITEMS: Record<string, Item> = {
  // ── 秘籍残页 ──
  scripture_shard_common: {
    id: 'scripture_shard_common', name: '秘籍残页·凡',
    description: '泛黄的修炼残页，10页可合成一部凡俗道功。品质较低但积少成多。',
    type: 'material', quality: 'white', weight: 0, value: 10,
    specialEffect: '10页合成一部凡俗功法',
  },
  scripture_shard_fine: {
    id: 'scripture_shard_fine', name: '秘籍残页·精',
    description: '品相较好的修炼残页，8页可合成一部宗门正法。蕴含一定的修炼心得。',
    type: 'material', quality: 'green', weight: 0, value: 50,
    specialEffect: '8页合成一部宗门正法',
  },
  scripture_shard_rare: {
    id: 'scripture_shard_rare', name: '秘籍残页·珍',
    description: '珍贵的修炼残页，5页可合成一部王侯秘传。残页上残留着强者的意志。',
    type: 'material', quality: 'blue', weight: 0, value: 200,
    specialEffect: '5页合成一部王侯秘传',
  },
  scripture_shard_epic: {
    id: 'scripture_shard_epic', name: '秘籍残页·极',
    description: '极其珍贵的修炼残页，3页可合成一部圣贤古诀。残页散发着远古气息。',
    type: 'material', quality: 'purple', weight: 0, value: 800,
    specialEffect: '3页合成一部圣贤古诀',
  },

  // ── 古经残卷 ──
  ancient_scripture_fragment: {
    id: 'ancient_scripture_fragment', name: '古经残卷',
    description: '上古修炼经文的残卷碎片，蕴含着远古强者的修炼感悟。集齐一定数量可领悟上古功法。',
    type: 'material', quality: 'blue', weight: 0, value: 150,
    specialEffect: '集齐5卷可领悟一部上古功法',
  },

  // ── 源力材料 ──
  source_stone: {
    id: 'source_stone', name: '源石',
    description: '蕴含微弱源力的矿石，是修炼的基础材料。',
    type: 'material', quality: 'white', weight: 1, value: 5,
  },
  source_crystal: {
    id: 'source_crystal', name: '源晶',
    description: '高纯度源力结晶，修炼的上等材料。可兑换大量修为。',
    type: 'material', quality: 'green', weight: 1, value: 50,
  },

  // ── 灵药 ──
  qi_recovery_pill: {
    id: 'qi_recovery_pill', name: '回气丹',
    description: '最常见的恢复丹药，服下后回复气血。',
    type: 'consumable', quality: 'white', hp: 150, weight: 0, value: 20,
  },
  dragon_blood: {
    id: 'dragon_blood', name: '龙血',
    description: '真龙之血，蕴含龙族力量。服用后可大幅提升根骨与气血。',
    type: 'consumable', quality: 'purple', hp: 800, bonusCon: 2, weight: 0, value: 500,
    specialEffect: '永久提升根骨+2',
  },
  golden_dragon_pill: {
    id: 'golden_dragon_pill', name: '金龙丹',
    description: '以龙血为主药炼制的极品丹药，可大幅提升实力。',
    type: 'consumable', quality: 'orange', hp: 2000, mp: 500, bonusStr: 2, bonusCon: 2, weight: 0, value: 2000,
    specialEffect: '永久提升神力+2、根骨+2',
  },
  nine_turn_elixir: {
    id: 'nine_turn_elixir', name: '九转金丹',
    description: '传说中的极品丹药，九转而成，服用后可脱胎换骨。',
    type: 'consumable', quality: 'orange', hp: 5000, mp: 2000, bonusStr: 3, bonusCon: 3, bonusAgi: 2, bonusInt: 2, weight: 0, value: 10000,
    specialEffect: '永久提升全属性',
  },

  // ── 特殊物品 ──
  forbidden_zone_map: {
    id: 'forbidden_zone_map', name: '禁区地图',
    description: '标注了生命禁区入口的古老地图，持有者可进入更深层的禁区。',
    type: 'quest', quality: 'purple', weight: 0, value: 1000,
    specialEffect: '解锁更高等级的禁区探索',
  },

  // ── 秘境令牌 ──
  secret_realm_token_common: {
    id: 'secret_realm_token_common', name: '秘境令牌·凡',
    description: '刻有符文的一次性令牌，可在特定秘境入口激活传送。限Lv.30以下使用。',
    type: 'consumable', quality: 'green', weight: 0, value: 200,
    specialEffect: '消耗品，进入秘境副本需消耗1枚',
  },
  secret_realm_token_rare: {
    id: 'secret_realm_token_rare', name: '秘境令牌·珍',
    description: '散发着灵光的古老令牌，可开启高级秘境入口。限Lv.50以下使用。',
    type: 'consumable', quality: 'blue', weight: 0, value: 800,
    specialEffect: '消耗品，进入高级秘境副本需消耗1枚',
  },
  secret_realm_token_epic: {
    id: 'secret_realm_token_epic', name: '秘境令牌·极',
    description: '散发着远古气息的至尊令牌，可开启生命禁区秘境。',
    type: 'consumable', quality: 'purple', weight: 0, value: 5000,
    specialEffect: '消耗品，进入顶级秘境副本需消耗1枚',
  },

  // ── 评分奖励 ──
  rating_reward_box_silver: {
    id: 'rating_reward_box_silver', name: '评级宝箱·银',
    description: '副本评级达到白银以上时获得的奖励宝箱，内含丰富的修炼资源。',
    type: 'chest', quality: 'green', weight: 0, value: 500,
    specialEffect: '使用后获得随机奖励: 源晶×3~5、回气丹×2',
  },
  rating_reward_box_gold: {
    id: 'rating_reward_box_gold', name: '评级宝箱·金',
    description: '副本评级达到黄金以上时获得的奖励宝箱，内含珍稀材料。',
    type: 'chest', quality: 'blue', weight: 0, value: 2000,
    specialEffect: '使用后获得随机奖励: 龙血×1~2、古经残卷×1',
  },
  rating_reward_box_diamond: {
    id: 'rating_reward_box_diamond', name: '评级宝箱·钻石',
    description: '副本评级达到钻石以上时获得的至尊宝箱，内含绝世宝物。',
    type: 'chest', quality: 'purple', weight: 0, value: 10000,
    specialEffect: '使用后获得随机奖励: 九转金丹×1、源晶×10',
  },
};
