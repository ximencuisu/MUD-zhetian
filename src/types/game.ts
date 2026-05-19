export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

export interface Exit {
  direction: Direction;
  roomId: string;
  label: string;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue: string[];
  isHostile: boolean;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  drops: string[];
  level?: number;
  realm?: string;
  shop?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  exits: Exit[];
  npcs: string[];
  items: string[];
  isCity: boolean;
  isSafe: boolean;
  region?: string;
  danger?: number; // 危险等级 1-10
  x?: number;
  y?: number;
}

// 法宝品质：凡器/灵器/王者神兵/圣兵/帝兵
export type ItemQuality = 'white' | 'green' | 'blue' | 'purple' | 'orange';
export type EquipSlot = 'weapon' | 'head' | 'body' | 'waist' | 'hands' | 'feet';

/** Defines a temporary buff effect from a consumable item */
export interface ConsumableEffect {
  stat: string;       // 'attack' | 'defense' | 'critRate' | 'critDmg' | 'dodge' | 'hit' | 'healPerTurn'
  value: number;       // buff value
  duration: number;    // number of turns
  icon?: string;       // display icon
  description?: string; // display description
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'material';
  slot?: EquipSlot;
  quality?: ItemQuality;
  attack?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  bonusStr?: number;   // 神力加成
  bonusCon?: number;   // 根骨加成
  bonusAgi?: number;   // 速度加成
  bonusInt?: number;   // 感知加成
  weight: number;
  value: number;
  levelReq?: number;
  specialEffect?: string; // 特殊词条描述
  goldPrice?: number;     // 金叶价格（商店）
  yuankuaiPrice?: number; // 源块价格（商店）
  setId?: string;         // 套装ID
  /** Temporary buff effects applied when this consumable is used */
  consumableEffects?: ConsumableEffect[];
}

export type SkillCategory = 'attack' | 'passive' | 'heal' | 'buff' | 'secret';
export type SkillRarity = 'mortal' | 'sect' | 'king' | 'sage' | 'sect_secret' | 'emperor';
export type SkillType = 'longevity' | 'attack' | 'defense' | 'escape' | 'body' | 'soul' | 'array' | 'source';

// 门派职位（从低到高）
export type SectRank =
  | '外门弟子'
  | '内门弟子'
  | '真传弟子'
  | '外门长老'
  | '内门长老'
  | '道子'
  | '圣女'
  | '太上长老'
  | '宗主';

export const SECT_RANK_ORDER: SectRank[] = [
  '外门弟子', '内门弟子', '真传弟子', '外门长老',
  '内门长老', '道子', '圣女', '太上长老', '宗主',
];

// 玩家该职位可接受传授的功法稀有度（累积解锁：高职位可学所有低级功法）
export const RANK_LEARN_LIMIT: Record<SectRank, SkillRarity[]> = {
  '外门弟子': ['mortal'],
  '内门弟子': ['mortal'],
  '真传弟子': ['mortal', 'sect'],
  '外门长老': ['mortal', 'sect'],
  '内门长老': ['mortal', 'sect', 'king'],
  '道子':     ['mortal', 'sect', 'king', 'sage'],
  '圣女':     ['mortal', 'sect', 'king', 'sage'],
  '太上长老': ['mortal', 'sect', 'king', 'sage'],
  '宗主':     ['mortal', 'sect', 'king', 'sage', 'sect_secret'],
};

// 晋升下一职位需要的最低境界和贡献值
export interface RankPromoReq { 
  minRealm: RealmStage; 
  minContrib: number;
  minSectSkills?: number; // 需要学会的门派功法数量
  minReputation?: number; // 需要的声望值
}
export const RANK_PROMO_REQS: Partial<Record<SectRank, RankPromoReq>> = {
  '外门弟子': { minRealm: 'spring_early',    minContrib: 100,  minSectSkills: 2 },   // → 内门
  '内门弟子': { minRealm: 'bridge_early',    minContrib: 500,  minSectSkills: 4 },   // → 真传
  '真传弟子': { minRealm: 'farshore_early',  minContrib: 2000, minSectSkills: 6, minReputation: 500 },  // → 外门长老
  '外门长老': { minRealm: 'daogong_early',   minContrib: 5000, minSectSkills: 8, minReputation: 1000 }, // → 内门长老
  '内门长老': { minRealm: 'siji_early',      minContrib: 15000, minSectSkills: 10, minReputation: 2000 }, // → 道子/圣女
};

// 门派贡献值获取途径配置
export const CONTRIB_SOURCES = {
  dailyLogin: 10,           // 每日登录
  completeSectQuest: 50,    // 完成门派任务
  practiceSkill: 5,         // 修炼门派功法一次
  winSectDuel: 30,          // 门派切磋胜利
  donateGold: 0.1,          // 捐献金叶比例 (1金叶 = 0.1贡献)
  donateYuankuai: 2,        // 捐献源块比例 (1源块 = 2贡献)
  clearSectDungeon: 100,    // 通关门派秘境
  teachJunior: 20,          // 指点后辈
};

// 职位对应俸禄（每日可领取）
export const RANK_SALARY: Partial<Record<SectRank, { gold: number; yuankuai: number; sectPoints: number }>> = {
  '外门弟子': { gold: 50, yuankuai: 0, sectPoints: 5 },
  '内门弟子': { gold: 150, yuankuai: 1, sectPoints: 10 },
  '真传弟子': { gold: 400, yuankuai: 3, sectPoints: 20 },
  '外门长老': { gold: 1000, yuankuai: 10, sectPoints: 50 },
  '内门长老': { gold: 2500, yuankuai: 25, sectPoints: 100 },
  '道子':     { gold: 5000, yuankuai: 50, sectPoints: 200 },
  '圣女':     { gold: 5000, yuankuai: 50, sectPoints: 200 },
  '太上长老': { gold: 10000, yuankuai: 100, sectPoints: 500 },
  '宗主':     { gold: 50000, yuankuai: 500, sectPoints: 1000 },
};

// 功法熟练度层次（遮天世界观）
export type SkillMasteryLevel =
  | '入门'      // 初窥门径
  | '熟练'      // 略有小成
  | '精通'      // 炉火纯青
  | '小成'      // 登堂入室
  | '大成'      // 出神入化
  | '圆满'      // 返璞归真
  | '化境'      // 超凡入圣
  | '通神';     // 技近乎道

// 熟练度层次配置
export const MASTERY_LEVELS: SkillMasteryLevel[] = [
  '入门', '熟练', '精通', '小成', '大成', '圆满', '化境', '通神'
];

// 熟练度层次颜色
export const MASTERY_COLORS: Record<SkillMasteryLevel, string> = {
  '入门': '#888888',
  '熟练': '#44cc44',
  '精通': '#44aaff',
  '小成': '#ffcc00',
  '大成': '#ff9900',
  '圆满': '#cc66ff',
  '化境': '#ff66cc',
  '通神': '#ff3333',
};

// 熟练度经验需求（累计）
export const MASTERY_EXP_REQ: Record<SkillMasteryLevel, number> = {
  '入门': 0,
  '熟练': 100,
  '精通': 300,
  '小成': 600,
  '大成': 1000,
  '圆满': 1500,
  '化境': 2200,
  '通神': 3000,
};

// 主动技能效果
export interface ActiveSkillEffect {
  name: string;           // 技能名称
  description: string;    // 技能描述
  damageType?: 'physical' | 'magical' | 'true';  // 伤害类型
  damageMultiplier?: number;  // 伤害倍率（基于攻击力）
  healAmount?: number;    // 治疗量
  buffEffect?: {          // 增益效果
    stat: string;         // 属性名
    value: number;        // 增加值
    duration: number;     // 持续回合
  };
  debuffEffect?: {        // 减益效果
    stat: string;
    value: number;
    duration: number;
  };
  specialEffect?: string; // 特殊效果描述
}

// 功法属性加成
export interface SkillStats {
  attack?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  speed?: number;
  critRate?: number;      // 暴击率
  critDamage?: number;    // 暴击伤害
  dodge?: number;         // 闪避
  block?: number;         // 格挡
  perception?: number;    // 感知
  physique?: number;      // 根骨
  damageReduction?: number; // 减伤百分比
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  stars: number;
  level: number;
  maxLevel: number;
  practiceExp: number;
  practiceExpMax: number;
  damage?: number;
  heal?: number;
  mpCost: number;
  cooldown: number;
  currentCooldown: number;
  type: 'attack' | 'passive' | 'heal' | 'buff';
  sectId?: string;
  secretType?: string;
  // 新字段
  rarity?: SkillRarity;
  skillType?: SkillType;
  sect?: string;
  slots?: number;
  effect?: string;
  // 熟练度系统
  masteryLevel?: SkillMasteryLevel;  // 当前熟练度层次
  masteryExp?: number;               // 当前熟练度经验
  // 属性加成（基础值，随熟练度提升）
  baseStats?: SkillStats;
  // 主动技能
  activeSkill?: ActiveSkillEffect;
}

// 功法装备槽位（8种类型各一个槽位）
export type SkillEquipSlot = SkillType;

export interface SkillEquipment {
  longevity: string | null;
  attack: string | null;
  defense: string | null;
  escape: string | null;
  body: string | null;
  soul: string | null;
  array: string | null;
  source: string | null;
}

// 遮天修炼境界 — 每个大境界分 前/中/后/圆满 四个小境界
export type RealmStage =
  // 轮海
  | 'bitterness_early'   | 'bitterness_mid'   | 'bitterness_late'   | 'bitterness_perfect'
  | 'spring_early'       | 'spring_mid'       | 'spring_late'       | 'spring_perfect'
  | 'bridge_early'       | 'bridge_mid'       | 'bridge_late'       | 'bridge_perfect'
  | 'farshore_early'     | 'farshore_mid'     | 'farshore_late'     | 'farshore_perfect'
  // 道宫
  | 'daogong_early'      | 'daogong_mid'      | 'daogong_late'      | 'daogong_perfect'
  // 四极
  | 'siji_early'         | 'siji_mid'         | 'siji_late'         | 'siji_perfect'
  // 化龙
  | 'hualong_1' | 'hualong_2' | 'hualong_3' | 'hualong_4' | 'hualong_5'
  | 'hualong_6' | 'hualong_7' | 'hualong_8' | 'hualong_9'
  // 仙台
  | 'xiantai_early'      | 'xiantai_mid'      | 'xiantai_late'      | 'xiantai_perfect'
  | 'xiantai_5'          | 'xiantai_6'
  // 准帝
  | 'zhundi_1' | 'zhundi_2' | 'zhundi_3' | 'zhundi_4' | 'zhundi_5'
  | 'zhundi_6' | 'zhundi_7' | 'zhundi_8' | 'zhundi_9'
  // 大帝
  | 'dadi_1' | 'dadi_2' | 'dadi_3' | 'dadi_4' | 'dadi_5'
  | 'dadi_6' | 'dadi_7' | 'dadi_8' | 'dadi_9'
  // 红尘仙
  | 'hongchen_xian';

export const REALM_NAMES: Record<RealmStage, string> = {
  bitterness_early: '轮海·苦海·前期', bitterness_mid: '轮海·苦海·中期', bitterness_late: '轮海·苦海·后期', bitterness_perfect: '轮海·苦海·圆满',
  spring_early:     '轮海·命泉·前期', spring_mid:     '轮海·命泉·中期', spring_late:     '轮海·命泉·后期', spring_perfect:     '轮海·命泉·圆满',
  bridge_early:     '轮海·神桥·前期', bridge_mid:     '轮海·神桥·中期', bridge_late:     '轮海·神桥·后期', bridge_perfect:     '轮海·神桥·圆满',
  farshore_early:   '轮海·彼岸·前期', farshore_mid:   '轮海·彼岸·中期', farshore_late:   '轮海·彼岸·后期', farshore_perfect:   '轮海·彼岸·圆满',
  daogong_early:    '道宫·前期', daogong_mid:    '道宫·中期', daogong_late:    '道宫·后期', daogong_perfect:    '道宫·圆满',
  siji_early:       '四极·前期', siji_mid:       '四极·中期', siji_late:       '四极·后期', siji_perfect:       '四极·圆满',
  // 化龙秘境 - 九变
  hualong_1: '化龙·一变', hualong_2: '化龙·二变', hualong_3: '化龙·三变', hualong_4: '化龙·四变', hualong_5: '化龙·五变',
  hualong_6: '化龙·六变', hualong_7: '化龙·七变', hualong_8: '化龙·八变', hualong_9: '化龙·九变',
  // 仙台秘境 - 六层天
  xiantai_early:    '仙台·一层天', xiantai_mid:    '仙台·二层天', xiantai_late:    '仙台·三层天', xiantai_perfect:    '仙台·四层天',
  xiantai_5:        '仙台·五层天', xiantai_6:      '仙台·六层天',
  // 准帝境
  zhundi_1: '准帝·一重天', zhundi_2: '准帝·二重天', zhundi_3: '准帝·三重天', zhundi_4: '准帝·四重天', zhundi_5: '准帝·五重天',
  zhundi_6: '准帝·六重天', zhundi_7: '准帝·七重天', zhundi_8: '准帝·八重天', zhundi_9: '准帝·九重天',
  // 大帝境
  dadi_1: '大帝·第一世', dadi_2: '大帝·第二世', dadi_3: '大帝·第三世', dadi_4: '大帝·第四世', dadi_5: '大帝·第五世',
  dadi_6: '大帝·第六世', dadi_7: '大帝·第七世', dadi_8: '大帝·第八世', dadi_9: '大帝·第九世',
  // 红尘仙
  hongchen_xian: '红尘仙',
};

export const REALM_ORDER: RealmStage[] = [
  // 轮海秘境
  'bitterness_early', 'bitterness_mid', 'bitterness_late', 'bitterness_perfect',
  'spring_early', 'spring_mid', 'spring_late', 'spring_perfect',
  'bridge_early', 'bridge_mid', 'bridge_late', 'bridge_perfect',
  'farshore_early', 'farshore_mid', 'farshore_late', 'farshore_perfect',
  // 道宫秘境
  'daogong_early', 'daogong_mid', 'daogong_late', 'daogong_perfect',
  // 四极秘境
  'siji_early', 'siji_mid', 'siji_late', 'siji_perfect',
  // 化龙秘境
  'hualong_1', 'hualong_2', 'hualong_3', 'hualong_4', 'hualong_5',
  'hualong_6', 'hualong_7', 'hualong_8', 'hualong_9',
  // 仙台秘境
  'xiantai_early', 'xiantai_mid', 'xiantai_late', 'xiantai_perfect',
  'xiantai_5', 'xiantai_6',
  // 准帝境
  'zhundi_1', 'zhundi_2', 'zhundi_3', 'zhundi_4', 'zhundi_5',
  'zhundi_6', 'zhundi_7', 'zhundi_8', 'zhundi_9',
  // 大帝境
  'dadi_1', 'dadi_2', 'dadi_3', 'dadi_4', 'dadi_5',
  'dadi_6', 'dadi_7', 'dadi_8', 'dadi_9',
  // 红尘仙
  'hongchen_xian',
];

// 特殊体质
export type Physique = 'mortal' | 'ancient_saint' | 'dao_womb' | 'divine_king' | 'overlord' | 'yin_body' | 'yang_body';
export const PHYSIQUE_NAMES: Record<Physique, string> = {
  mortal:       '凡人之躯',
  ancient_saint:'荒古圣体',
  dao_womb:     '先天道胎',
  divine_king:  '神王体',
  overlord:     '霸体',
  yin_body:     '太阴之体',
  yang_body:    '太阳之体',
};

export interface CharacterAttributes {
  shenli: number;        // 神力（决定攻击）
  gengu: number;         // 根骨（决定气血上限）
  sudu: number;          // 速度（决定闪避/先手）
  ganzhi: number;        // 感知（决定暴击/神识）
  mianrong: number;      // 容貌
  qiyun: number;         // 气运（决定掉落/暴击率）
}

export interface CharacterStats {
  attack: number;
  defense: number;
  hit: number;
  dodge: number;
  parry: number;
  critRate: number;
  critDmg: number;
  attackSpeed: number;
  maxHpBonus: number;
  maxMpBonus: number;
  finalDamage: number;
  defIgnore: number;
  critResist: number;
  cdReduction: number;
  mpCostReduction: number;
  debuffResist: number;
  castSpeed: number;
  lifesteal: number;
  dmgReduction: number;
  expBonus: number;
  practiceEfficiency: number;
  meditationEfficiency: number;
}

export interface EquipmentSlots {
  weapon: string | null;
  head: string | null;
  body: string | null;
  waist: string | null;
  hands: string | null;
  feet: string | null;
}

export interface AutoSettings {
  autoCombat: boolean;
  autoLoot: boolean;
  autoPotion: boolean;
  autoPotionThreshold: number;
}

// ── 苦海异象系统 ──────────────────────────────────────────────────────────
// 苦海圆满突破时随机觉醒，每种异象拥有独特的数倍属性加成

export type PhenomenonId =
  | 'bitter_sea_golden_lotus'   // 苦海种金莲
  | 'moon_rises_over_sea'       // 海上升明月
  | 'immortal_king_nine_heavens'// 仙王临九天
  | 'stars_shine_blue_sky'      // 星辰耀青天
  | 'splendid_mountains_rivers' // 锦绣山河
  | 'yin_yang_life_death'       // 阴阳生死图
  | 'heavenly_peng_fights_dragon'// 天鹏搏龙图
  | 'nether_king_wall'          // 冥王之墙
  | 'snow_dances_under_heaven'  // 雪舞天下
  | 'nether_sea_blood_sun'      // 冥海悬血日（自创）
  | 'eternal_verdant_heaven'    // 万古青天长（自创）
  | 'chaos_first_opening'       // 混沌初开（自创·极稀有）
  ;

export interface PhenomenonBuff {
  attackMult: number;       // 攻击倍率 (1.0 = 无加成)
  defenseMult: number;      // 防御倍率
  hpMult: number;           // 气血倍率
  mpMult: number;           // 神力倍率
  critRateBonus: number;    // 暴击率加成（百分比）
  critDmgBonus: number;     // 暴击伤害加成（百分比）
  dodgeBonus: number;       // 闪避加成
  hitBonus: number;         // 命中加成
  parryBonus: number;       // 格挡加成
  attackSpeedBonus: number; // 攻速加成
  lifesteal: number;        // 吸血率（百分比）
  debuffResist: number;     // 负面抵抗（百分比）
  specialDesc: string;      // 特殊效果描述
}

export interface PhenomenonDef {
  id: PhenomenonId;
  name: string;
  description: string;      // 异象觉醒时的描述文字
  visualDesc: string;       // 异象显现时的画面描述
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  buff: PhenomenonBuff;
}

// 挂机修炼状态
export type CultivationMode = 'none' | 'cultivate' | 'meditate';

export interface Character {
  name: string;
  gender: 'male' | 'female';
  realm: RealmStage;     // 修炼境界（替代 level）
  realmLevel: number;    // 境界内的等级（1-100，用于战斗强度）
  age: number;
  exp: number;
  expToNext: number;
  potential: number;     // 潜力值
  physique: Physique;    // 体质
  reputation: number;
  kills: number;
  deathCount: number;    // 死亡次数
  hp: number;
  maxHp: number;
  mp: number;            // 神力（源力）
  maxMp: number;
  energy: number;        // 精力
  maxEnergy: number;
  // 资源
  yuankuai: number;      // 源块（高级货币）
  gold: number;          // 金叶（普通货币）
  silver: number;
  attributes: CharacterAttributes;
  stats: CharacterStats;
  // 秘境进度
  luohai: number;        // 苦海广度（0-100）
  mingyuan: number;      // 命泉品质（0-100）
  shengqiao: number;     // 神桥坚固度（0-100）
  wuzang: number[];      // 五脏神觉醒状态（道宫5脏神，0=未开 1=已开）
  sect: string | null;
  sectRank: SectRank | null;
  contribution: number;   // 门派贡献值（晋升资本）
  master: string | null;
  guildId: string | null;
  guildRank: 'leader' | 'vice_leader' | 'elder' | 'elite' | 'member' | null;
  partyId: string | null;
  inventory: string[];
  equipment: EquipmentSlots;
  enhanceLevels: Record<string, number>; // 装备强化等级 { slot: level }
  skills: Skill[];
  currentRoomId: string;
  dungeonProgress: Record<string, DungeonProgress>;
  // Daily sweep tracking
  dungeonSweepCounts: Record<string, number>; // dungeonId -> sweeps done today
  pkMode: boolean;
  autoSettings: AutoSettings;
  autoCastSkills: string[];
  skillEquipment: SkillEquipment;
  // 挂机系统
  cultivationMode: CultivationMode;
  cultivationStartMs: number;  // 挂机开始时间戳
  bonusHpCap: number;          // 额外气血上限（打坐超出积累）
  bonusMpCap: number;          // 额外神力上限
  lastSaveMs: number;          // 最后存档时间戳
  lastSalaryClaim?: string;    // 每日门派俸禄领取日期
  // 苦海异象
  phenomenon: PhenomenonId | null;  // 觉醒的苦海异象
  phenomenonUnlocked: boolean;      // 是否已觉醒异象
  phenomenonRerollCount: number;    // 散功重修次数
  chosenPhenomenon: PhenomenonId | null; // 10次重修后自行选择的异象
}

export interface Sect {
  id: string;
  name: string;
  fullName: string;
  description: string;
  location: string;
  masterNpc: string;
  specialty: string;
  joinRequirement: string;
  skillTree: string[];
  color: string;
  emblem: string;
}

export interface DungeonRoom {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'boss' | 'puzzle' | 'treasure' | 'rest' | 'trap' | 'empty';
  // Combat rooms
  enemies?: DungeonEnemy[];
  // Puzzle rooms
  puzzle?: DungeonPuzzle;
  // Treasure rooms
  lootItems?: string[];
  lootGold?: number;
}

export type PuzzleType = 'riddle' | 'sequence' | 'match' | 'math';

export interface DungeonPuzzle {
  type: PuzzleType;
  question: string;
  options: string[];
  answer: number; // index of correct option
  hint?: string;
  rewardExp: number;
  rewardItems?: string[];
}

// Grid-based dungeon room (generated at runtime)
export interface DungeonGenRoom {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  exits: { dir: string; toId: string; label: string }[];
  type: 'combat' | 'boss' | 'puzzle' | 'treasure' | 'rest' | 'trap' | 'entrance' | 'empty' | 'elite_combat';
  enemies?: DungeonEnemy[];
  puzzle?: DungeonPuzzle;
  lootItems?: string[];
  lootGold?: number;
  isEntrance?: boolean;
  isBoss?: boolean;
  isElite?: boolean;
  dangerLevel: number; // 1-5
  // 怪物追踪：已死亡的怪物
  deadNpcs?: string[];
  // 尸体：显示在房间中的尸体
  corpses?: { name: string; looted: boolean }[];
}

export interface DungeonEnemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  drops: string[];
  isBoss?: boolean;
  level?: number;
}

export type DungeonType = 'normal' | 'secret' | 'endless';

export interface BossMechanic {
  name: string;
  description: string;
  effect: string;
  phase?: number; // which phase (0=always, 1=first phase, 2=second phase, etc.)
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  dungeonType?: DungeonType; // normal (default), secret (consumable entry), endless (infinite floors)
  levelMin: number;
  levelMax: number;
  roomCount: number;
  dailyLimit: number;
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  bossName: string;
  // Boss special mechanics (displayed during boss fight)
  bossMechanics?: BossMechanic[];
  // Sweep rewards (scaled down from full clear)
  sweepRewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  // Previous dungeon that must be cleared to unlock this one
  prerequisite?: string;
  // Room generation config
  dangerBase: number;
  eliteChance?: number; // chance (0-1) for elite room variant, default 0.15
  roomPrefixes: string[];
  roomSuffixes: string[];
  combatNpcTags: string[];
  eliteNpcTags?: string[]; // tags for elite combat rooms
  bossEnemy: DungeonEnemy;
  puzzlePool: DungeonPuzzle[];
  lootPool: { items: string[]; gold: number }[];
  // Rating thresholds (score needed for each rank)
  ratingThresholds?: { bronze: number; silver: number; gold: number; platinum: number; diamond: number };
  // Secret realm entry cost (consumed on entry)
  entryCost?: { itemId: string; amount: number };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  status?: 'available' | 'active' | 'completed';
  objectives: QuestObjective[];
  rewards: {
    exp: number;
    gold: number;
    items?: string[];
    reputation?: Record<string, number>;
  };
  giver?: string;
  type?: 'main' | 'side' | 'daily' | 'sect';
}

export interface QuestObjective {
  type?: string;
  description: string;
  current?: number;
  required?: number;
  completed?: boolean;
  targetId?: string;
}

export type ChatChannel = 'world' | 'sect' | 'room' | 'system' | 'combat' | 'say' | 'whisper' | 'team';

export interface ChatMessage {
  id?: string;
  channel: string;
  sender: string;
  content: string;
  timestamp?: number | Date;
  color?: string;
  isAnnouncement?: boolean;
}

export type GameTab = 'combat' | 'skills' | 'bag' | 'attributes' | 'tasks' | 'social' | 'rankings' | 'map' | 'sect' | 'dungeon';
export type FloatWindowId = 'skills' | 'bag' | 'attributes' | 'tasks' | 'social' | 'rankings' | 'sect' | 'dungeon' | 'map' | 'combat' | 'cultivation' | 'shop' | 'alchemy' | 'arena' | 'enhance';

export interface FloatWindowState {
  id: FloatWindowId;
  open: boolean;
}

export interface ZoneRoom {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  items: string[];
  exits: { roomId: string; label: string; direction: string }[];
  isSafe: boolean;
  isEntrance?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  rooms: ZoneRoom[];
  entryRoomId: string;
  exitRoomId: string;
  type: 'dungeon' | 'sect' | 'city';
  minLevel?: number;
}

export interface CombatState {
  isInCombat: boolean;
  inDungeon: boolean;
  dungeonId: string | null;
  dungeonRoom: number;
  // Dungeon rating tracking (reset on enter)
  dungeonScore: number;
  dungeonDeaths: number;
  dungeonSteps: number;
  targetId: string | null;
  targetName: string;
  targetHp: number;
  targetMaxHp: number;
  targetLevel: number;
  autoCombat: boolean;
  autoLoot: boolean;
  combatLog: string[];
  turnCount: number;
  /** Combat combo system */
  comboCount: number;
  maxComboCount: number;
  /** Active status effects on player */
  playerBuffs: CombatBuff[];
  /** Active status effects on target */
  targetDebuffs: CombatBuff[];
}

/** A temporary buff or debuff active during combat */
export interface CombatBuff {
  id: string;
  name: string;
  description: string;
  type: 'buff' | 'debuff';
  stat: string; // which stat it affects
  value: number;
  duration: number; // turns remaining
  sourceSkill?: string;
  icon: string;
  dotDamage?: number; // damage per turn for DoT effects
  /** Special effect type for unique processing: 'stun' | 'freeze' | 'silence' | 'poison' | 'bleed' | 'fear' */
  effectType?: 'stun' | 'freeze' | 'silence' | 'poison' | 'bleed' | 'fear';
  /** Lifesteal: heal % of damage dealt (buff on self) */
  lifestealPercent?: number;
  /** Heal per turn (buff) */
  healPerTurn?: number;
  /** Bonus damage multiplier from next hit (freeze) */
  bonusDmgOnHit?: number;
}

export interface DungeonProgress {
  cleared: boolean;
  totalRuns: number;
  bestRating?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  bestScore?: number;
  bestTime?: number; // in room steps
}

export interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  region: string;
  connections: string[];
  isCurrent?: boolean;
}
