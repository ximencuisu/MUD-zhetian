import { PhenomenonDef } from '../types/game';

export const PHENOMENA: Record<string, PhenomenonDef> = {
  bitter_sea_golden_lotus: {
    id: 'bitter_sea_golden_lotus',
    name: '苦海种金莲',
    description: '漆黑的苦海中生出金莲，金莲璀璨，展现出生机勃勃与化生万物的无上意境。叶凡与颜如玉皆拥有此异象。',
    visualDesc: '你盘坐于苦海之畔，漆黑的海面突然泛起金色涟漪，一朵璀璨金莲自海底缓缓升起，莲瓣绽放间万物生辉！',
    rarity: 'epic',
    buff: {
      attackMult: 1.8,
      defenseMult: 1.3,
      hpMult: 1.5,
      mpMult: 1.8,
      critRateBonus: 8,
      critDmgBonus: 30,
      dodgeBonus: 5,
      hitBonus: 10,
      parryBonus: 5,
      attackSpeedBonus: 10,
      lifesteal: 5,
      debuffResist: 0,
      specialDesc: '金莲化生万物——每秒恢复气血与神力',
    },
  },

  moon_rises_over_sea: {
    id: 'moon_rises_over_sea',
    name: '海上升明月',
    description: '苍茫大海上轮明月高悬，璀璨夺目，具有极强的压制力。神体姬皓月的标志性异象。',
    visualDesc: '苦海翻涌，海天一线间，一轮皎洁明月自海面冉冉升起，月光如水，天地万物皆被银辉笼罩，万道压制！',
    rarity: 'epic',
    buff: {
      attackMult: 1.5,
      defenseMult: 1.8,
      hpMult: 1.3,
      mpMult: 1.5,
      critRateBonus: 5,
      critDmgBonus: 20,
      dodgeBonus: 10,
      hitBonus: 15,
      parryBonus: 15,
      attackSpeedBonus: 5,
      lifesteal: 3,
      debuffResist: 0,
      specialDesc: '明月压制——降低敌人攻击力与命中率',
    },
  },

  immortal_king_nine_heavens: {
    id: 'immortal_king_nine_heavens',
    name: '仙王临九天',
    description: '一位浑身笼罩仙气的仙王盘坐九天上，俯视苍生，具有无双的神威。叶凡的终极异象之一，可将人与异象合一。',
    visualDesc: '九天之上仙光万丈，一尊仙王自虚空中显现，盘坐于九重天阙之上，俯视万界，诸天万道皆为之臣服！',
    rarity: 'mythic',
    buff: {
      attackMult: 3.0,
      defenseMult: 2.5,
      hpMult: 2.5,
      mpMult: 3.0,
      critRateBonus: 20,
      critDmgBonus: 80,
      dodgeBonus: 15,
      hitBonus: 25,
      parryBonus: 20,
      attackSpeedBonus: 20,
      lifesteal: 10,
      debuffResist: 0,
      specialDesc: '仙王神威——全属性巨幅提升，人象合一',
    },
  },

  stars_shine_blue_sky: {
    id: 'stars_shine_blue_sky',
    name: '星辰耀青天',
    description: '一片青天下，星辰如巨岳坠落，威能浩大，震撼人心。叶凡与孔雀王皆有此异象。',
    visualDesc: '青天如洗，万星齐耀，一颗颗星辰如太古神山般自九天坠落，星光撕裂苍穹，天地为之震颤！',
    rarity: 'rare',
    buff: {
      attackMult: 2.2,
      defenseMult: 1.2,
      hpMult: 1.2,
      mpMult: 1.3,
      critRateBonus: 15,
      critDmgBonus: 50,
      dodgeBonus: 3,
      hitBonus: 8,
      parryBonus: 3,
      attackSpeedBonus: 15,
      lifesteal: 4,
      debuffResist: 0,
      specialDesc: '星辰坠落——暴击伤害大幅提升',
    },
  },

  splendid_mountains_rivers: {
    id: 'splendid_mountains_rivers',
    name: '锦绣山河',
    description: '展现出自然的宏伟山河，高山与河流共生，气势磅礴。叶凡的异象之一。',
    visualDesc: '苦海之上，万里山河自虚空中铺展开来，高山耸入云霄，大河奔流不息，天地造化尽在其中！',
    rarity: 'rare',
    buff: {
      attackMult: 1.5,
      defenseMult: 2.0,
      hpMult: 2.5,
      mpMult: 1.5,
      critRateBonus: 5,
      critDmgBonus: 15,
      dodgeBonus: 8,
      hitBonus: 10,
      parryBonus: 20,
      attackSpeedBonus: 5,
      lifesteal: 3,
      debuffResist: 0,
      specialDesc: '山河永固——气血与防御大幅提升',
    },
  },

  yin_yang_life_death: {
    id: 'yin_yang_life_death',
    name: '阴阳生死图',
    description: '阐述阴阳与生死大道的异象，图卷演化生死对立与轮回。叶凡的终极异象之一。',
    visualDesc: '黑白二气自苦海升腾，交织成一幅阴阳生死图，图中生死轮回，万物生灭，大道至理尽在其中！',
    rarity: 'legendary',
    buff: {
      attackMult: 2.0,
      defenseMult: 2.0,
      hpMult: 2.0,
      mpMult: 2.0,
      critRateBonus: 12,
      critDmgBonus: 40,
      dodgeBonus: 12,
      hitBonus: 12,
      parryBonus: 12,
      attackSpeedBonus: 10,
      lifesteal: 8,
      debuffResist: 0,
      specialDesc: '生死轮回——攻守兼备，全能提升',
    },
  },

  heavenly_peng_fights_dragon: {
    id: 'heavenly_peng_fights_dragon',
    name: '天鹏搏龙图',
    description: '金鹏搏杀真龙，展现无上力道。金翅小鹏王专有异象。',
    visualDesc: '苦海翻涌间，一只翼展万里的金翅大鹏自海中冲天而起，双爪撕裂苍穹，与一条太古真龙搏杀于九天之上！',
    rarity: 'epic',
    buff: {
      attackMult: 3.0,
      defenseMult: 1.5,
      hpMult: 1.8,
      mpMult: 1.2,
      critRateBonus: 18,
      critDmgBonus: 60,
      dodgeBonus: 5,
      hitBonus: 12,
      parryBonus: 5,
      attackSpeedBonus: 25,
      lifesteal: 8,
      debuffResist: 0,
      specialDesc: '天鹏之力——攻击力与攻速极致提升',
    },
  },

  nether_king_wall: {
    id: 'nether_king_wall',
    name: '冥王之墙',
    description: '冥王体的专属异象，象征禁锢与恐怖力量。一墙之隔，便是生死两界。',
    visualDesc: '苦海之上，一堵由万千亡魂凝聚的冥王之墙拔地而起，墙面上无数面孔哀嚎，所过之处万物凋零，生机断绝！',
    rarity: 'epic',
    buff: {
      attackMult: 1.5,
      defenseMult: 3.0,
      hpMult: 2.5,
      mpMult: 1.5,
      critRateBonus: 5,
      critDmgBonus: 15,
      dodgeBonus: 5,
      hitBonus: 10,
      parryBonus: 30,
      attackSpeedBonus: 0,
      lifesteal: 6,
      debuffResist: 0,
      specialDesc: '冥王禁锢——防御与格挡极致提升，敌人攻速降低',
    },
  },

  snow_dances_under_heaven: {
    id: 'snow_dances_under_heaven',
    name: '雪舞天下',
    description: '风雪漫天，冷冽刺骨。姬紫月等持有的异象，以冰寒之道冻结万物。',
    visualDesc: '苦海之上，漫天飞雪自九天飘落，每一片雪花都蕴含冰寒大道，所触之处万物冻结，连时间都仿佛凝固！',
    rarity: 'rare',
    buff: {
      attackMult: 1.5,
      defenseMult: 1.5,
      hpMult: 1.3,
      mpMult: 2.0,
      critRateBonus: 10,
      critDmgBonus: 25,
      dodgeBonus: 15,
      hitBonus: 8,
      parryBonus: 8,
      attackSpeedBonus: 10,
      lifesteal: 3,
      debuffResist: 0,
      specialDesc: '冰寒冻结——闪避与神力大幅提升',
    },
  },

  nether_sea_blood_sun: {
    id: 'nether_sea_blood_sun',
    name: '冥海悬血日',
    description: '苦海化为冥河，一轮血色烈日悬于海面之上，血光映照万界，所照之处生灵涂炭、大道崩殂。传说中冥海之主以万灵精血凝聚的终极异象。',
    visualDesc: '苦海骤然化为漆黑冥河，河面上万灵哀嚎，一轮血色烈日自冥海深处缓缓升起，血光照耀天地，万物为之战栗！',
    rarity: 'legendary',
    buff: {
      attackMult: 2.5,
      defenseMult: 1.5,
      hpMult: 2.0,
      mpMult: 1.5,
      critRateBonus: 18,
      critDmgBonus: 70,
      dodgeBonus: 5,
      hitBonus: 15,
      parryBonus: 8,
      attackSpeedBonus: 15,
      lifesteal: 15,
      debuffResist: 0,
      specialDesc: '血日吞噬——极高吸血率，暴击伤害恐怖',
    },
  },

  eternal_verdant_heaven: {
    id: 'eternal_verdant_heaven',
    name: '万古青天长',
    description: '苦海之上，一株青色古木自虚无中生长，树冠遮天蔽日，根系贯穿九幽。每一片叶子都承载着一个纪元的道韵，万古长青，不朽不灭。',
    visualDesc: '苦海中央，一株青色古木破海而出，树干粗壮如山脉，树冠遮蔽九天十地，每一片叶子上都映照着一个纪元的大道生灭！',
    rarity: 'legendary',
    buff: {
      attackMult: 1.8,
      defenseMult: 2.5,
      hpMult: 3.0,
      mpMult: 2.5,
      critRateBonus: 8,
      critDmgBonus: 20,
      dodgeBonus: 10,
      hitBonus: 12,
      parryBonus: 15,
      attackSpeedBonus: 8,
      lifesteal: 5,
      debuffResist: 0,
      specialDesc: '万古不朽——气血上限与防御极致提升，每秒恢复大量生命',
    },
  },

  chaos_first_opening: {
    id: 'chaos_first_opening',
    name: '混沌初开',
    description: '苦海化为混沌虚无，一切归于原点。随后混沌中一线光明破开黑暗，天地重开，万物始生。此异象万年难遇，唯有天命之子方能觉醒。',
    visualDesc: '苦海消失了，一切归于混沌。无尽黑暗中，一线光明骤然撕裂虚无，混沌初开，清者上升为天，浊者下沉为地，大道重演！',
    rarity: 'mythic',
    buff: {
      attackMult: 3.5,
      defenseMult: 3.0,
      hpMult: 3.0,
      mpMult: 3.5,
      critRateBonus: 25,
      critDmgBonus: 100,
      dodgeBonus: 20,
      hitBonus: 30,
      parryBonus: 25,
      attackSpeedBonus: 25,
      lifesteal: 12,
      debuffResist: 0,
      specialDesc: '混沌重演——全属性极致提升，天命之子',
    },
  },
};

// 异象稀有度权重（决定觉醒概率）
export const PHENOMENON_WEIGHTS: Record<string, number> = {
  bitter_sea_golden_lotus:    15,  // epic
  moon_rises_over_sea:        15,  // epic
  immortal_king_nine_heavens: 1,   // mythic (极稀有)
  stars_shine_blue_sky:       25,  // rare
  splendid_mountains_rivers:  25,  // rare
  yin_yang_life_death:        5,   // legendary
  heavenly_peng_fights_dragon:12,  // epic
  nether_king_wall:           12,  // epic
  snow_dances_under_heaven:   25,  // rare
  nether_sea_blood_sun:       4,   // legendary
  eternal_verdant_heaven:     4,   // legendary
  chaos_first_opening:        1,   // mythic (极稀有)
};

// 稀有度标签
export const RARITY_LABELS: Record<string, string> = {
  common:    '普通',
  rare:      '稀有',
  epic:      '史诗',
  legendary: '传说',
  mythic:    '神话',
};

export const RARITY_COLORS: Record<string, string> = {
  common:    '#888888',
  rare:      '#44aaff',
  epic:      '#cc66ff',
  legendary: '#ff9900',
  mythic:    '#ff3300',
};

// 随机觉醒异象（根据权重）
export function rollPhenomenon(): string {
  const entries = Object.entries(PHENOMENON_WEIGHTS);
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * totalWeight;
  for (const [id, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return id;
  }
  return entries[0][0]; // fallback
}
