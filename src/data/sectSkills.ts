import { Skill, SkillStats, ActiveSkillEffect, SkillMasteryLevel } from '../types/game';

export type SkillRarity = 'mortal' | 'sect' | 'king' | 'sage' | 'sect_secret' | 'emperor';
export type SkillType = 'longevity' | 'attack' | 'defense' | 'escape' | 'body' | 'soul' | 'array' | 'source';

export const RARITY_NAMES: Record<SkillRarity, string> = {
  mortal: '凡俗道功',
  sect: '宗门正法',
  king: '王侯秘传',
  sage: '圣贤古诀',
  sect_secret: '镇教秘术',
  emperor: '极道帝经',
};

export const RARITY_COLORS: Record<SkillRarity, string> = {
  mortal: '#44cc44',
  sect: '#4488ff',
  king: '#ffcc00',
  sage: '#cc66ff',
  sect_secret: '#ff9900',
  emperor: '#ff3333',
};

export const TYPE_NAMES: Record<SkillType, string> = {
  longevity: '长生',
  attack: '攻伐',
  defense: '护体',
  escape: '遁术',
  body: '炼体',
  soul: '神魂',
  array: '阵道',
  source: '源术',
};

export const TYPE_ICONS: Record<SkillType, string> = {
  longevity: '☯',
  attack: '⚔',
  defense: '🛡',
  escape: '💨',
  body: '💪',
  soul: '🧠',
  array: '🔮',
  source: '💎',
};

// NPC ranks that can teach skills
export const NPC_RANKS = [
  '杂役弟子', '外门弟子', '内门弟子', '真传弟子',
  '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'
] as const;

export type NpcRank = typeof NPC_RANKS[number];

// Which rarities each NPC rank teaches (strictly their own tier only)
export const RANK_TEACHES: Record<NpcRank, SkillRarity[]> = {
  '杂役弟子': [],
  '外门弟子': ['mortal'],
  '内门弟子': ['mortal'],
  '真传弟子': ['sect'],
  '外门长老': ['sect'],
  '内门长老': ['king'],
  '道子':     ['sage'],
  '圣女':     ['sage'],
  '太上长老': ['sage'],
  // 宗主 teaches sect_secret; emperor is never taught but hints are shown separately
  '宗主':     ['sect_secret'],
};

// 熟练度层次
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

// 获取当前熟练度层次
export function getMasteryLevel(exp: number): SkillMasteryLevel {
  if (exp >= 3000) return '通神';
  if (exp >= 2200) return '化境';
  if (exp >= 1500) return '圆满';
  if (exp >= 1000) return '大成';
  if (exp >= 600) return '小成';
  if (exp >= 300) return '精通';
  if (exp >= 100) return '熟练';
  return '入门';
}

// 计算属性加成（基于熟练度）
export function calculateSkillStats(baseStats: SkillStats | undefined, masteryExp: number): SkillStats {
  if (!baseStats) return {};
  const multiplier = 1 + (masteryExp / 3000) * 2; // 最高3倍加成
  return {
    attack: baseStats.attack ? Math.floor(baseStats.attack * multiplier) : undefined,
    defense: baseStats.defense ? Math.floor(baseStats.defense * multiplier) : undefined,
    hp: baseStats.hp ? Math.floor(baseStats.hp * multiplier) : undefined,
    mp: baseStats.mp ? Math.floor(baseStats.mp * multiplier) : undefined,
    speed: baseStats.speed ? Math.floor(baseStats.speed * multiplier) : undefined,
    critRate: baseStats.critRate ? baseStats.critRate * multiplier : undefined,
    critDamage: baseStats.critDamage ? baseStats.critDamage * multiplier : undefined,
    dodge: baseStats.dodge ? Math.floor(baseStats.dodge * multiplier) : undefined,
    block: baseStats.block ? Math.floor(baseStats.block * multiplier) : undefined,
    perception: baseStats.perception ? Math.floor(baseStats.perception * multiplier) : undefined,
    physique: baseStats.physique ? Math.floor(baseStats.physique * multiplier) : undefined,
    damageReduction: baseStats.damageReduction ? baseStats.damageReduction * multiplier : undefined,
  };
}

// 属性加成倍率（基于稀有度）
const RARITY_STAT_MULTIpliers: Record<SkillRarity, number> = {
  mortal: 1,
  sect: 2,
  king: 4,
  sage: 8,
  sect_secret: 15,
  emperor: 30,
};

// Base skills per type and rarity for each sect
const makeSkill = (
  id: string, name: string, rarity: SkillRarity, type: SkillType,
  desc: string, mpCost: number, cooldown: number,
  baseStats: SkillStats, sect: string,
  activeSkill?: ActiveSkillEffect
): Skill => {
  const rarityStars: Record<SkillRarity, number> = { mortal: 1, sect: 2, king: 3, sage: 4, sect_secret: 5, emperor: 6 };
  const multiplier = RARITY_STAT_MULTIpliers[rarity];

  // 根据稀有度调整属性
  const adjustedStats: SkillStats = {
    attack: baseStats.attack ? Math.floor(baseStats.attack * multiplier) : undefined,
    defense: baseStats.defense ? Math.floor(baseStats.defense * multiplier) : undefined,
    hp: baseStats.hp ? Math.floor(baseStats.hp * multiplier) : undefined,
    mp: baseStats.mp ? Math.floor(baseStats.mp * multiplier) : undefined,
    speed: baseStats.speed ? Math.floor(baseStats.speed * multiplier) : undefined,
    critRate: baseStats.critRate ? baseStats.critRate * multiplier : undefined,
    critDamage: baseStats.critDamage ? baseStats.critDamage * multiplier : undefined,
    dodge: baseStats.dodge ? Math.floor(baseStats.dodge * multiplier) : undefined,
    block: baseStats.block ? Math.floor(baseStats.block * multiplier) : undefined,
    perception: baseStats.perception ? Math.floor(baseStats.perception * multiplier) : undefined,
    physique: baseStats.physique ? Math.floor(baseStats.physique * multiplier) : undefined,
    damageReduction: baseStats.damageReduction ? baseStats.damageReduction * multiplier : undefined,
  };

  // 生成效果描述
  const effectParts: string[] = [];
  if (adjustedStats.attack) effectParts.push(`攻击+${adjustedStats.attack}`);
  if (adjustedStats.defense) effectParts.push(`防御+${adjustedStats.defense}`);
  if (adjustedStats.hp) effectParts.push(`气血+${adjustedStats.hp}`);
  if (adjustedStats.mp) effectParts.push(`神力+${adjustedStats.mp}`);
  if (adjustedStats.speed) effectParts.push(`速度+${adjustedStats.speed}`);
  if (adjustedStats.critRate) effectParts.push(`暴击率+${adjustedStats.critRate.toFixed(1)}%`);
  if (adjustedStats.critDamage) effectParts.push(`暴击伤害+${adjustedStats.critDamage.toFixed(1)}%`);
  if (adjustedStats.dodge) effectParts.push(`闪避+${adjustedStats.dodge}`);
  if (adjustedStats.block) effectParts.push(`格挡+${adjustedStats.block}`);
  if (adjustedStats.perception) effectParts.push(`感知+${adjustedStats.perception}`);
  if (adjustedStats.physique) effectParts.push(`根骨+${adjustedStats.physique}`);
  if (adjustedStats.damageReduction) effectParts.push(`减伤+${adjustedStats.damageReduction.toFixed(1)}%`);

  return {
    id, name, description: desc, type: activeSkill ? 'attack' : 'passive' as const,
    category: type === 'attack' ? 'attack' : type === 'defense' ? 'buff' : 'passive',
    rarity, skillType: type,
    mpCost, cooldown, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 100,
    currentCooldown: 0, stars: rarityStars[rarity] || 1,
    effect: effectParts.join('，'),
    sect,
    slots: rarity === 'emperor' ? 3 : rarity === 'sect_secret' ? 2 : 1,
    // 熟练度系统
    masteryLevel: '入门',
    masteryExp: 0,
    // 属性加成
    baseStats: adjustedStats,
    // 主动技能
    activeSkill,
  };
};

// 创建主动技能
const makeActiveSkill = (
  name: string,
  description: string,
  damageMultiplier: number,
  _mpCost: number,
  _cooldown: number,
  specialEffect?: string
): ActiveSkillEffect => ({
  name,
  description,
  damageType: 'physical',
  damageMultiplier,
  specialEffect,
});

// ── 摇光圣地功法 ──────────────────────────────────────────────────────────
export const YAOGUAN_SKILLS: Skill[] = [
  // 凡俗道功
  makeSkill('yg_mortal_longevity', '摇光引气诀', 'mortal', 'longevity',
    '摇光圣地入门引气之法，可延年益寿。', 5, 0,
    { mp: 5 }, 'yaoguan'),
  makeSkill('yg_mortal_attack', '摇光拳', 'mortal', 'attack',
    '摇光弟子基础拳法。', 10, 3,
    { attack: 10 }, 'yaoguan',
    makeActiveSkill('摇光拳·破', '以摇光圣力打出破空一拳', 1.5, 10, 3)),
  makeSkill('yg_mortal_defense', '摇光护身劲', 'mortal', 'defense',
    '摇光基础护体功法。', 8, 5,
    { defense: 8 }, 'yaoguan'),
  makeSkill('yg_mortal_body', '摇光锻体术', 'mortal', 'body',
    '摇光基础炼体之法。', 12, 0,
    { physique: 3, hp: 50 }, 'yaoguan'),
  // 宗门正法
  makeSkill('yg_sect_attack', '古皇拳', 'sect', 'attack',
    '摇光圣地镇宗古皇拳经，拳出如皇者降临。', 30, 5,
    { attack: 25, critRate: 5 }, 'yaoguan',
    makeActiveSkill('古皇拳·皇威', '拳出如古皇降世，威压四方', 2.5, 30, 5, '30%几率眩晕目标1回合')),
  makeSkill('yg_sect_defense', '圣光护体', 'sect', 'defense',
    '摇光圣光凝聚护体神罡。', 25, 8,
    { defense: 20, block: 10 }, 'yaoguan'),
  makeSkill('yg_sect_body', '圣体锻造', 'sect', 'body',
    '以圣光淬炼肉身。', 20, 0,
    { hp: 100, physique: 5 }, 'yaoguan'),
  makeSkill('yg_sect_soul', '圣光神念', 'sect', 'soul',
    '圣光淬炼神魂。', 20, 0,
    { perception: 8, mp: 30 }, 'yaoguan'),
  // 王侯秘传
  makeSkill('yg_king_attack', '皇极惊世拳', 'king', 'attack',
    '摇光圣地王侯秘传，拳出惊世。', 60, 8,
    { attack: 60, critDamage: 30 }, 'yaoguan',
    makeActiveSkill('皇极惊世·破苍穹', '一拳破苍穹，惊世骇俗', 4, 60, 8, '无视目标30%防御')),
  makeSkill('yg_king_defense', '不灭圣光甲', 'king', 'defense',
    '圣光凝聚不灭甲胄。', 50, 10,
    { defense: 50, damageReduction: 15 }, 'yaoguan'),
  makeSkill('yg_king_body', '皇体不灭', 'king', 'body',
    '皇者之体，万法不侵。', 40, 0,
    { hp: 250, defense: 25, physique: 8 }, 'yaoguan'),
  makeSkill('yg_king_escape', '圣光遁', 'king', 'escape',
    '以圣光包裹身形遁走。', 35, 6,
    { speed: 30, dodge: 15 }, 'yaoguan',
    makeActiveSkill('圣光遁·瞬', '化作圣光瞬间遁走', 0, 35, 6, '立即脱离战斗，闪避+50%持续2回合')),
  // 圣贤古诀
  makeSkill('yg_sage_attack', '古皇灭世拳', 'sage', 'attack',
    '古皇灭世一击，天地变色。', 100, 12,
    { attack: 150, critRate: 15 }, 'yaoguan',
    makeActiveSkill('古皇灭世·天地崩', '一拳出，天地崩灭', 7, 100, 12, '对周围所有敌人造成伤害，50%几率恐惧')),
  makeSkill('yg_sage_defense', '圣光不灭域', 'sage', 'defense',
    '圣光领域，万法不侵。', 80, 15,
    { defense: 100, damageReduction: 30 }, 'yaoguan'),
  makeSkill('yg_sage_soul', '圣光神照', 'sage', 'soul',
    '圣光普照，神魂不灭。', 70, 0,
    { perception: 20, mp: 150 }, 'yaoguan'),
  makeSkill('yg_sage_array', '圣光星阵', 'sage', 'array',
    '以圣光布阵，引动星辰之力。', 60, 10,
    { attack: 50, defense: 50 }, 'yaoguan',
    makeActiveSkill('圣光星阵·陨星', '引动星辰之力轰击敌人', 5, 60, 10, '召唤陨星攻击，伤害随境界提升')),
  // 镇教秘术
  makeSkill('yg_secret_attack', '摇光圣皇诀', 'sect_secret', 'attack',
    '摇光圣地镇教秘术，圣皇之力。', 150, 15,
    { attack: 250, critDamage: 80 }, 'yaoguan',
    makeActiveSkill('圣皇诀·皇道无极', '圣皇之力，皇道无极', 10, 150, 15, '必定暴击，暴击伤害翻倍')),
  makeSkill('yg_secret_defense', '不灭圣皇体', 'sect_secret', 'defense',
    '圣皇不灭之体，万劫不磨。', 120, 20,
    { defense: 200, hp: 500, damageReduction: 20 }, 'yaoguan'),
  makeSkill('yg_secret_body', '皇极不灭身', 'sect_secret', 'body',
    '皇极不灭之身，肉身成圣。', 100, 0,
    { hp: 400, attack: 40, defense: 40, physique: 10 }, 'yaoguan'),
  makeSkill('yg_secret_soul', '圣皇神念', 'sect_secret', 'soul',
    '圣皇神念，一念之间天地变色。', 90, 0,
    { perception: 40, mp: 400 }, 'yaoguan'),
];

// ── 姬家功法 ──────────────────────────────────────────────────────────
export const JI_FAMILY_SKILLS: Skill[] = [
  makeSkill('ji_mortal_longevity', '姬家引气诀', 'mortal', 'longevity',
    '姬家入门引气之法。', 5, 0,
    { mp: 5 }, 'ji_family'),
  makeSkill('ji_mortal_attack', '姬家掌', 'mortal', 'attack',
    '姬家基础掌法。', 10, 3,
    { attack: 10 }, 'ji_family',
    makeActiveSkill('姬家掌·虚', '虚空之力融入掌法', 1.5, 10, 3)),
  makeSkill('ji_mortal_escape', '虚空步', 'mortal', 'escape',
    '姬家基础步法。', 8, 4,
    { speed: 5 }, 'ji_family'),
  makeSkill('ji_mortal_defense', '姬家护体', 'mortal', 'defense',
    '姬家基础护体之法。', 8, 5,
    { defense: 8 }, 'ji_family'),
  makeSkill('ji_sect_attack', '虚空掌', 'sect', 'attack',
    '以虚空之力出掌，虚实难辨。', 30, 5,
    { attack: 25 }, 'ji_family',
    makeActiveSkill('虚空掌·虚实', '虚实难辨，防不胜防', 2.5, 30, 5, '攻击无视目标闪避')),
  makeSkill('ji_sect_escape', '虚空遁影', 'sect', 'escape',
    '融入虚空遁走。', 25, 6,
    { speed: 25, dodge: 20 }, 'ji_family',
    makeActiveSkill('虚空遁·影', '融入虚空，无影无踪', 0, 25, 6, '进入隐身状态1回合，下次攻击暴击')),
  makeSkill('ji_sect_defense', '虚空护罩', 'sect', 'defense',
    '虚空之力凝聚护罩。', 25, 8,
    { defense: 20, damageReduction: 10 }, 'ji_family'),
  makeSkill('ji_sect_soul', '虚空神念', 'sect', 'soul',
    '虚空淬炼神魂。', 20, 0,
    { perception: 8 }, 'ji_family'),
  makeSkill('ji_king_attack', '虚空灭世掌', 'king', 'attack',
    '虚空之力灭世一击。', 60, 8,
    { attack: 60, critRate: 10 }, 'ji_family',
    makeActiveSkill('虚空灭世·碎空', '一掌碎裂虚空', 4, 60, 8, '无视目标50%防御')),
];

// 继续添加其他门派的功法...
// 太玄门功法
export const TAIXUAN_SKILLS: Skill[] = [
  makeSkill('tx_mortal_longevity', '太玄引气诀', 'mortal', 'longevity',
    '太玄门入门引气之法。', 5, 0,
    { mp: 5 }, 'taixuan'),
  makeSkill('tx_mortal_attack', '太玄掌', 'mortal', 'attack',
    '太玄门基础掌法。', 10, 3,
    { attack: 10 }, 'taixuan',
    makeActiveSkill('太玄掌·玄', '以太玄之力出掌', 1.5, 10, 3)),
  makeSkill('tx_mortal_escape', '太玄步', 'mortal', 'escape',
    '太玄门基础步法。', 8, 4,
    { speed: 5 }, 'taixuan'),
  makeSkill('tx_mortal_defense', '太玄护体', 'mortal', 'defense',
    '太玄门基础护体之法。', 8, 5,
    { defense: 8 }, 'taixuan'),
  makeSkill('tx_sect_attack', '太玄行字拳', 'sect', 'attack',
    '太玄门行字秘基础拳法。', 30, 5,
    { attack: 25, speed: 10 }, 'taixuan',
    makeActiveSkill('行字拳·速', '速度即是力量', 2.5, 30, 5, '速度越快伤害越高')),
  makeSkill('tx_sect_escape', '行字秘·初', 'sect', 'escape',
    '行字秘入门，速度无双。', 25, 4,
    { speed: 30, dodge: 15 }, 'taixuan',
    makeActiveSkill('行字秘·闪', '一闪即逝', 0, 25, 4, '立即行动，闪避+30%持续2回合')),
  makeSkill('tx_sect_defense', '太玄行光盾', 'sect', 'defense',
    '以行字秘速度凝聚光盾。', 25, 8,
    { defense: 20, dodge: 10 }, 'taixuan'),
  makeSkill('tx_sect_body', '行字淬体', 'sect', 'body',
    '以行字秘速度淬炼肉身。', 20, 0,
    { speed: 15, physique: 5 }, 'taixuan'),
  makeSkill('tx_king_attack', '行字秘·破', 'king', 'attack',
    '行字秘进阶，破空一击。', 60, 8,
    { attack: 60, speed: 20 }, 'taixuan',
    makeActiveSkill('行字秘·破空', '破空一击，速度突破极限', 4, 60, 8, '必定命中，无法闪避')),
  makeSkill('tx_king_escape', '行字秘·极', 'king', 'escape',
    '行字秘极致，超越光速。', 50, 3,
    { speed: 60, dodge: 30 }, 'taixuan',
    makeActiveSkill('行字秘·超越', '超越光速，时间静止', 0, 50, 3, '额外行动一回合')),
  makeSkill('tx_king_defense', '行光不灭甲', 'king', 'defense',
    '行光凝聚不灭甲胄。', 50, 10,
    { defense: 50, dodge: 15 }, 'taixuan'),
  makeSkill('tx_king_body', '行字炼体', 'king', 'body',
    '以行字秘极致速度炼体。', 40, 0,
    { speed: 30, hp: 200 }, 'taixuan'),
  makeSkill('tx_sage_attack', '行字秘·灭', 'sage', 'attack',
    '行字秘灭世一击。', 100, 12,
    { attack: 150, speed: 40 }, 'taixuan',
    makeActiveSkill('行字秘·灭世', '灭世一击，时空破碎', 7, 100, 12, '对全体敌人造成伤害')),
];

// 紫府圣地功法
export const ZIFU_SKILLS: Skill[] = [
  makeSkill('zf_mortal_longevity', '紫府引气诀', 'mortal', 'longevity',
    '紫府圣地入门引气之法。', 5, 0,
    { mp: 5 }, 'zifu'),
  makeSkill('zf_mortal_attack', '紫府拳', 'mortal', 'attack',
    '紫府基础拳法。', 10, 3,
    { attack: 10 }, 'zifu',
    makeActiveSkill('紫府拳·紫气', '紫气东来，拳出如虹', 1.5, 10, 3)),
  makeSkill('zf_mortal_defense', '紫府护体', 'mortal', 'defense',
    '紫府基础护体之法。', 8, 5,
    { defense: 8 }, 'zifu'),
  makeSkill('zf_mortal_body', '紫府锻体', 'mortal', 'body',
    '紫府基础炼体之法。', 12, 0,
    { physique: 3 }, 'zifu'),
  makeSkill('zf_sect_attack', '紫府神拳', 'sect', 'attack',
    '紫府圣地紫色源力拳法。', 30, 5,
    { attack: 25, defense: 10 }, 'zifu',
    makeActiveSkill('紫府神拳·源力', '紫色源力爆发', 2.5, 30, 5, '攻击时恢复5%神力')),
  makeSkill('zf_sect_defense', '紫府神罡', 'sect', 'defense',
    '紫色源力凝聚神罡。', 25, 8,
    { defense: 20, block: 10 }, 'zifu'),
  makeSkill('zf_sect_body', '紫府淬体', 'sect', 'body',
    '紫色源力淬炼肉身。', 20, 0,
    { hp: 100 }, 'zifu'),
  makeSkill('zf_sect_array', '紫府小阵', 'sect', 'array',
    '紫府基础阵法。', 20, 10,
    { attack: 10, defense: 10 }, 'zifu',
    makeActiveSkill('紫府小阵·困', '小阵困敌', 2, 20, 10, '使目标无法行动1回合')),
  makeSkill('zf_king_attack', '紫府灭世拳', 'king', 'attack',
    '紫府王侯秘传拳法。', 60, 8,
    { attack: 60, defense: 30 }, 'zifu',
    makeActiveSkill('紫府灭世·紫雷', '紫雷灭世', 4, 60, 8, '附加雷属性伤害')),
];

// 姜家功法
export const JIANG_SKILLS: Skill[] = [
  makeSkill('jg_mortal_longevity', '姜家引气诀', 'mortal', 'longevity',
    '姜家入门引气之法。', 5, 0,
    { mp: 5 }, 'jiang_family'),
  makeSkill('jg_mortal_attack', '姜家掌', 'mortal', 'attack',
    '姜家基础掌法。', 10, 3,
    { attack: 10 }, 'jiang_family',
    makeActiveSkill('姜家掌·柔', '以柔克刚', 1.5, 10, 3)),
  makeSkill('jg_mortal_defense', '姜家柔劲', 'mortal', 'defense',
    '姜家以柔克刚之法。', 8, 5,
    { defense: 8, block: 3 }, 'jiang_family'),
  makeSkill('jg_mortal_soul', '姜家凝神', 'mortal', 'soul',
    '姜家基础凝神之法。', 8, 0,
    { perception: 3 }, 'jiang_family'),
  makeSkill('jg_sect_attack', '姜家柔掌', 'sect', 'attack',
    '以柔克刚的掌法。', 30, 5,
    { attack: 25, block: 10 }, 'jiang_family',
    makeActiveSkill('姜家柔掌·化劲', '化敌劲力为己用', 2.5, 30, 5, '反弹30%受到伤害')),
  makeSkill('jg_sect_defense', '姜家柔罡', 'sect', 'defense',
    '以柔劲凝聚护体神罡。', 25, 8,
    { defense: 20, block: 15 }, 'jiang_family'),
  makeSkill('jg_sect_soul', '姜家神念', 'sect', 'soul',
    '姜家独特神念之法。', 20, 0,
    { perception: 8 }, 'jiang_family'),
  makeSkill('jg_sect_source', '姜家源术', 'sect', 'source',
    '姜家基础源术。', 25, 10,
    { attack: 10, defense: 10 }, 'jiang_family',
    makeActiveSkill('姜家源术·探', '探测周围源力波动', 0, 25, 10, '显示周围隐藏敌人')),
];

// 妖族功法
export const YAO_SKILLS: Skill[] = [
  makeSkill('yao_mortal_longevity', '妖族引气诀', 'mortal', 'longevity',
    '妖族入门引气之法。', 5, 0,
    { mp: 5 }, 'yao_clan'),
  makeSkill('yao_mortal_attack', '妖爪', 'mortal', 'attack',
    '妖族基础爪法。', 10, 3,
    { attack: 10 }, 'yao_clan',
    makeActiveSkill('妖爪·撕裂', '撕裂敌人', 1.5, 10, 3, '造成流血效果')),
  makeSkill('yao_mortal_defense', '妖皮', 'mortal', 'defense',
    '妖族基础护体之法。', 8, 5,
    { defense: 8 }, 'yao_clan'),
  makeSkill('yao_mortal_body', '妖血', 'mortal', 'body',
    '妖族基础炼体之法。', 12, 0,
    { physique: 3 }, 'yao_clan'),
  makeSkill('yao_sect_attack', '青莲妖火', 'sect', 'attack',
    '青帝后裔的青莲圣火。', 30, 5,
    { attack: 25, critRate: 5 }, 'yao_clan',
    makeActiveSkill('青莲妖火·焚', '青莲圣火焚尽一切', 2.5, 30, 5, '附加燃烧效果，持续3回合')),
  makeSkill('yao_sect_defense', '青莲护体', 'sect', 'defense',
    '青莲圣火护体。', 25, 8,
    { defense: 20, block: 10 }, 'yao_clan'),
  makeSkill('yao_sect_body', '妖血淬体', 'sect', 'body',
    '以妖血淬炼肉身。', 20, 0,
    { hp: 100 }, 'yao_clan'),
  makeSkill('yao_sect_soul', '妖魂', 'sect', 'soul',
    '妖族天生神魂强大。', 20, 0,
    { perception: 8 }, 'yao_clan'),
  makeSkill('yao_king_attack', '青莲灭世火', 'king', 'attack',
    '青莲圣火灭世一击。', 60, 8,
    { attack: 60, critDamage: 30 }, 'yao_clan',
    makeActiveSkill('青莲灭世·火海', '火海滔天', 4, 60, 8, '对全体敌人造成燃烧伤害')),
];

// All sect skills combined
export const ALL_SECT_SKILLS: Skill[] = [
  ...YAOGUAN_SKILLS,
  ...JI_FAMILY_SKILLS,
  ...TAIXUAN_SKILLS,
  ...ZIFU_SKILLS,
  ...JIANG_SKILLS,
  ...YAO_SKILLS,
];

// Emperor scriptures - cannot be learned in sect, only hints from sect leader
export const EMPEROR_SCRIPTURES: Skill[] = [
  {
    id: 'emperor_taixuan_xing', name: '行字秘·完整版', description: '太玄门传承的行字秘完整版，超越时空的无上遁术。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'passive', rarity: 'emperor' as const, skillType: 'escape' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '速度+200，闪避+60，可穿越空间', sect: 'taixuan', slots: 2,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { speed: 200, dodge: 60 },
    activeSkill: {
      name: '行字秘·时空穿越',
      description: '超越时空，瞬间移动到任意位置',
      damageType: 'true',
      damageMultiplier: 0,
      specialEffect: '无视距离瞬移，无法被拦截',
    },
  },
  {
    id: 'emperor_yaoguan_huang', name: '古皇经', description: '摇光圣地传承的古皇经完整版，皇者之道的极致。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'attack', rarity: 'emperor' as const, skillType: 'attack' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '攻击+800，暴击率+30%，暴击伤害+150%', sect: 'yaoguan', slots: 3,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { attack: 800, critRate: 30, critDamage: 150 },
    activeSkill: {
      name: '古皇经·皇道无极',
      description: '古皇之力，皇道无极，一击灭世',
      damageType: 'physical',
      damageMultiplier: 15,
      specialEffect: '必定暴击，伤害无视防御',
    },
  },
  {
    id: 'emperor_ji_void', name: '虚空经', description: '姬家传承的虚空经完整版，掌控虚空的无上大道。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'passive', rarity: 'emperor' as const, skillType: 'escape' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '速度+150，闪避+50，可融入虚空', sect: 'ji_family', slots: 2,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { speed: 150, dodge: 50 },
    activeSkill: {
      name: '虚空经·虚空放逐',
      description: '将敌人放逐到虚空之中',
      damageType: 'true',
      damageMultiplier: 8,
      specialEffect: '将目标放逐3回合，期间无法行动',
    },
  },
  {
    id: 'emperor_zifu_purple', name: '紫府帝经', description: '紫府圣地传承的帝经，紫色源力的极致。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'passive', rarity: 'emperor' as const, skillType: 'array' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '攻击+400，防御+400，可布帝级大阵', sect: 'zifu', slots: 2,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { attack: 400, defense: 400 },
    activeSkill: {
      name: '紫府帝经·紫气东来',
      description: '紫气东来三万里，帝级大阵困敌',
      damageType: 'magical',
      damageMultiplier: 10,
      specialEffect: '布下帝级大阵，困敌并持续造成伤害',
    },
  },
  {
    id: 'emperor_jiang_soft', name: '姜家帝诀', description: '姜家传承的帝诀，以柔克刚的极致。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'passive', rarity: 'emperor' as const, skillType: 'source' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '攻击+400，防御+400，格挡+50', sect: 'jiang_family', slots: 2,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { attack: 400, defense: 400, block: 50 },
    activeSkill: {
      name: '姜家帝诀·四两拨千斤',
      description: '以柔克刚，四两拨千斤',
      damageType: 'physical',
      damageMultiplier: 5,
      specialEffect: '反弹200%受到伤害',
    },
  },
  {
    id: 'emperor_yao_green', name: '青帝经', description: '妖族传承的青帝经完整版，青帝大道的极致。传说唯有大帝方能完全领悟。',
    type: 'passive' as const, category: 'attack', rarity: 'emperor' as const, skillType: 'attack' as const,
    mpCost: 200, cooldown: 10, level: 1, maxLevel: 10, practiceExp: 0, practiceExpMax: 1000, currentCooldown: 0, stars: 6,
    effect: '攻击+800，暴击率+25%，暴击伤害+120%', sect: 'yao_clan', slots: 3,
    masteryLevel: '入门', masteryExp: 0,
    baseStats: { attack: 800, critRate: 25, critDamage: 120 },
    activeSkill: {
      name: '青帝经·青莲创世',
      description: '青莲创世，万物复苏',
      damageType: 'magical',
      damageMultiplier: 12,
      specialEffect: '造成伤害的同时恢复自身50%生命值',
    },
  },
];

// 修炼功法获得熟练度经验
export function practiceSkill(skill: Skill): { newExp: number; leveledUp: boolean; newMasteryLevel?: SkillMasteryLevel } {
  const expGain = 10; // 每次修炼获得10点经验
  const newExp = (skill.masteryExp || 0) + expGain;
  const newMasteryLevel = getMasteryLevel(newExp);
  const leveledUp = newMasteryLevel !== (skill.masteryLevel || '入门');

  return {
    newExp,
    leveledUp,
    newMasteryLevel: leveledUp ? newMasteryLevel : undefined,
  };
}
