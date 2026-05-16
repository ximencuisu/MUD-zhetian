import { Skill } from '../types/game';

// 初始技能（所有人均有）
export const STARTER_SKILLS: Skill[] = [
  {
    id: 'basic_fist', name: '基础冲拳', description: '最基础的肉身攻击，以神力贯注拳劲，蛮力冲击。',
    category: 'attack', stars: 1, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 100,
    damage: 12, mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'breathing', name: '吐纳调息', description: '引导苦海源力循环，静心吐纳以恢复气血与神力。',
    category: 'heal', stars: 1, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 100,
    heal: 40, mpCost: 5, cooldown: 4, currentCooldown: 0, type: 'heal',
  },
  {
    id: 'body_tempering', name: '肉身淬炼', description: '以源力淬炼肉身，强化气血上限和防御。被动永久生效。',
    category: 'passive', stars: 1, level: 1, maxLevel: 20,
    practiceExp: 0, practiceExpMax: 150,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
  },
  {
    id: 'divine_power_surge', name: '神力冲击', description: '将苦海中的源力汇聚于拳，猛然爆发，冲击力极强。',
    category: 'attack', stars: 2, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 150,
    damage: 35, mpCost: 15, cooldown: 2, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'body_shield', name: '源力护体', description: '以苦海源力萦绕全身，形成防护层，减少受到的伤害。',
    category: 'buff', stars: 2, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 150,
    mpCost: 20, cooldown: 6, currentCooldown: 0, type: 'buff',
  },
];

// ── 八大基础功法槽（白色·天赋自带）──────────────────────────────────────
// 每个类型一个白色被动，装备到对应槽位，可被更高级功法替换
export const BASE_GONGFA: Skill[] = [
  {
    id: 'base_longevity', name: '引气纳息诀', description: '最基础的引气之法，以天地间的散逸源力滋养苦海，延年益寿。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'longevity', rarity: 'mortal', effect: '神力自然恢复+1/秒', sect: undefined,
  },
  {
    id: 'base_attack', name: '源力冲拳诀', description: '将苦海源力灌注四肢，增强拳劲，是最基础的攻伐之法。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'attack', rarity: 'mortal', effect: '攻击+5', sect: undefined,
  },
  {
    id: 'base_defense', name: '源力护体诀', description: '以苦海源力萦绕体表，形成最基础的护体罡气。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'defense', rarity: 'mortal', effect: '防御+5', sect: undefined,
  },
  {
    id: 'base_escape', name: '源力轻身诀', description: '以苦海源力轻化自身，提升移动速度，是最基础的遁术。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'escape', rarity: 'mortal', effect: '速度+3，闪避+3', sect: undefined,
  },
  {
    id: 'base_body', name: '源力淬体诀', description: '以苦海源力强化肉身，是最基础的炼体之法，增强根骨。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'body', rarity: 'mortal', effect: '气血上限+30', sect: undefined,
  },
  {
    id: 'base_soul', name: '凝神静心诀', description: '以苦海源力磨砺神魂，是最基础的神魂修炼之法，增强感知。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'soul', rarity: 'mortal', effect: '神力上限+20，感知+2', sect: undefined,
  },
  {
    id: 'base_array', name: '聚灵小阵诀', description: '以苦海源力布置最简单的聚灵阵，是最基础的阵道入门之法。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'array', rarity: 'mortal', effect: '攻击+3，防御+3', sect: undefined,
  },
  {
    id: 'base_source', name: '源力感应诀', description: '感应天地间流动的源力，是最基础的源术之法，增强源力操控。',
    category: 'passive', stars: 1, level: 1, maxLevel: 5,
    practiceExp: 0, practiceExpMax: 50,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    skillType: 'source', rarity: 'mortal', effect: '技能神力消耗-5%', sect: undefined,
  },
];

// 九秘（顶级秘术，需特殊解锁）
export const NINE_SECRETS: Skill[] = [
  {
    id: 'secret_zhe', name: '者字秘', description: '九秘之一。以源力催动疗伤神通，治愈重伤如初。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    heal: 200, mpCost: 80, cooldown: 8, currentCooldown: 0, type: 'heal',
    secretType: 'zhe',
  },
  {
    id: 'secret_lin', name: '临字秘', description: '九秘之一。以秘字加持全身战力，神力暴涨，战斗力提升数倍。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 100, cooldown: 12, currentCooldown: 0, type: 'buff',
    secretType: 'lin',
  },
  {
    id: 'secret_dou', name: '斗字秘', description: '九秘之一。越战越强，战斗中神力自动增长，越打越猛。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 60, cooldown: 0, currentCooldown: 0, type: 'buff',
    secretType: 'dou',
  },
  {
    id: 'secret_jie', name: '皆字秘', description: '九秘之一。速度秘字，身如流光，近乎瞬移，敌人难以捕捉身影。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 70, cooldown: 6, currentCooldown: 0, type: 'buff',
    secretType: 'jie',
  },
  {
    id: 'secret_bing', name: '兵字秘', description: '九秘之一。操控法宝如臂使指，神兵自动攻击，威力倍增。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    damage: 150, mpCost: 90, cooldown: 10, currentCooldown: 0, type: 'attack',
    secretType: 'bing',
  },
  {
    id: 'secret_xing', name: '行字秘', description: '九秘之一。太玄门绝学，速度超光，一步跨越万里。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 120, cooldown: 20, currentCooldown: 0, type: 'buff',
    secretType: 'xing',
  },
];

// 通用修炼功法
export const COMMON_SKILLS: Skill[] = [
  {
    id: 'divine_power_surge', name: '神力冲击', description: '将苦海中的源力汇聚于拳，猛然爆发，冲击力极强。',
    category: 'attack', stars: 2, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 150,
    damage: 35, mpCost: 15, cooldown: 2, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'body_shield', name: '源力护体', description: '以苦海源力萦绕全身，形成防护层，减少受到的伤害。',
    category: 'buff', stars: 2, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 150,
    mpCost: 20, cooldown: 6, currentCooldown: 0, type: 'buff',
  },
  {
    id: 'spring_burst', name: '命泉爆发', description: '激发命泉之力，瞬间恢复大量神力，并短暂强化战力。',
    category: 'buff', stars: 3, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 200,
    mpCost: 0, cooldown: 15, currentCooldown: 0, type: 'buff',
  },
  {
    id: 'ancient_dragon_fist', name: '龙战虚空', description: '模仿上古神龙之姿，拳劲如龙，气势磅礴。',
    category: 'attack', stars: 3, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 200,
    damage: 70, mpCost: 35, cooldown: 5, currentCooldown: 0, type: 'attack',
  },
];

// 摇光圣地功法
export const YAOGUAN_SKILLS: Skill[] = [
  {
    id: 'ancient_king_fist', name: '古皇拳经', description: '摇光圣地传承，古皇时代的拳经，蕴含上古强者的战斗意志。',
    category: 'attack', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    damage: 90, mpCost: 45, cooldown: 4, currentCooldown: 0, type: 'attack',
    sectId: 'yaoguan',
  },
  {
    id: 'holy_light_palm', name: '圣光手', description: '摇光特有神通，以神力凝聚光芒掌击，光明之力可破阴邪。',
    category: 'attack', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    damage: 75, mpCost: 40, cooldown: 6, currentCooldown: 0, type: 'attack',
    sectId: 'yaoguan',
  },
  {
    id: 'holy_body_technique', name: '圣体锻造', description: '摇光秘传，专门淬炼圣体的功法，强化肉身至极致。被动生效。',
    category: 'passive', stars: 5, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    sectId: 'yaoguan',
  },
];

// 姬家功法（虚空系）
export const JI_FAMILY_SKILLS: Skill[] = [
  {
    id: 'void_scripture', name: '虚空经', description: '姬家传承的至高功法，掌控虚空之力，可裂空穿行。',
    category: 'attack', stars: 5, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 400,
    damage: 110, mpCost: 60, cooldown: 8, currentCooldown: 0, type: 'attack',
    sectId: 'ji_family',
  },
  {
    id: 'void_mirror_gaze', name: '虚空镜映', description: '以虚空大帝遗留的虚空镜之力，映照敌方弱点，暴击大增。',
    category: 'buff', stars: 4, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 300,
    mpCost: 50, cooldown: 10, currentCooldown: 0, type: 'buff',
    sectId: 'ji_family',
  },
];

// 太玄门功法（行字秘系）
export const TAIXUAN_SKILLS: Skill[] = [
  {
    id: 'taixuan_xing_zi', name: '太玄行字秘', description: '太玄门镇派绝学，行字秘经之精要，速度无双，如流光掠影。',
    category: 'secret', stars: 5, level: 1, maxLevel: 9,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 80, cooldown: 8, currentCooldown: 0, type: 'buff',
    sectId: 'taixuan',
    secretType: 'xing',
  },
  {
    id: 'taixuan_void_step', name: '虚影残形', description: '太玄门身法，以极速留下残影迷惑敌人，大幅提升闪避。',
    category: 'buff', stars: 3, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 200,
    mpCost: 30, cooldown: 6, currentCooldown: 0, type: 'buff',
    sectId: 'taixuan',
  },
];

// 青帝神通（颜如玉/妖族系）
export const GREEN_EMPEROR_SKILLS: Skill[] = [
  {
    id: 'green_lotus_fire', name: '青莲圣火', description: '青帝后裔神通，以青莲之火焚烧敌人，火焰永不熄灭。',
    category: 'attack', stars: 5, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 400,
    damage: 130, mpCost: 70, cooldown: 10, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'wood_divine_power', name: '木之神通', description: '青帝系神通，以木之神力快速治愈伤势，生机勃勃。',
    category: 'heal', stars: 4, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 300,
    heal: 150, mpCost: 60, cooldown: 8, currentCooldown: 0, type: 'heal',
  },
];

// 紫府圣地功法
export const ZIFU_SKILLS: Skill[] = [
  {
    id: 'zifu_purple_source', name: '紫府源力', description: '紫府圣地传承，以紫府源力强化全身，攻防一体。',
    category: 'buff', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    mpCost: 50, cooldown: 10, currentCooldown: 0, type: 'buff',
    sectId: 'zifu',
  },
  {
    id: 'zifu_sword_art', name: '紫府剑诀', description: '紫府圣地剑法，以紫府源力凝聚剑气，锋锐无匹。',
    category: 'attack', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    damage: 85, mpCost: 45, cooldown: 5, currentCooldown: 0, type: 'attack',
    sectId: 'zifu',
  },
  {
    id: 'zifu_body_refine', name: '紫府锻体', description: '紫府圣地炼体功法，以紫府源力淬炼肉身，强韧无比。',
    category: 'passive', stars: 5, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 500,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
    sectId: 'zifu',
  },
];

// 姜氏世家功法
export const JIANG_SKILLS: Skill[] = [
  {
    id: 'jiang_mystery_art', name: '姜氏秘术', description: '姜氏世家传承，以弱胜强，以柔克刚的战斗哲学。',
    category: 'attack', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    damage: 95, mpCost: 50, cooldown: 6, currentCooldown: 0, type: 'attack',
    sectId: 'jiang_family',
  },
  {
    id: 'jiang_counter', name: '以弱胜强', description: '姜氏世家绝学，敌人越强，反击越猛。',
    category: 'buff', stars: 5, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 400,
    mpCost: 60, cooldown: 12, currentCooldown: 0, type: 'buff',
    sectId: 'jiang_family',
  },
];

// 妖族圣山功法
export const YAO_SKILLS: Skill[] = [
  {
    id: 'yao_beast_transform', name: '妖化变身', description: '妖族圣山秘术，可短暂妖化，获得妖兽之力。',
    category: 'buff', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    mpCost: 55, cooldown: 10, currentCooldown: 0, type: 'buff',
    sectId: 'yao_clan',
  },
  {
    id: 'yao_demon_claw', name: '妖爪裂空', description: '妖族圣山攻击技，以妖力凝聚利爪，撕裂敌人。',
    category: 'attack', stars: 4, level: 1, maxLevel: 15,
    practiceExp: 0, practiceExpMax: 300,
    damage: 80, mpCost: 40, cooldown: 4, currentCooldown: 0, type: 'attack',
    sectId: 'yao_clan',
  },
  {
    id: 'yao_soul_cry', name: '妖魂啸', description: '妖族圣山神魂攻击，以妖魂之力震慑敌人，使其短暂失神。',
    category: 'attack', stars: 5, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 400,
    damage: 100, mpCost: 70, cooldown: 8, currentCooldown: 0, type: 'attack',
    sectId: 'yao_clan',
  },
];

// 更多通用高级技能
export const ADVANCED_SKILLS: Skill[] = [
  {
    id: 'heaven_earth_swap', name: '天地翻转', description: '以源力颠倒天地法则，使敌人陷入混乱。',
    category: 'attack', stars: 4, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 300,
    damage: 120, mpCost: 65, cooldown: 8, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'source_shield', name: '源力天幕', description: '以源力凝聚天幕，大幅减少受到的伤害。',
    category: 'buff', stars: 4, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 300,
    mpCost: 55, cooldown: 12, currentCooldown: 0, type: 'buff',
  },
  {
    id: 'life_drain', name: '吞噬生命', description: '以邪术吸取敌人生命力，化为己用。',
    category: 'attack', stars: 4, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 300,
    damage: 80, mpCost: 50, cooldown: 8, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'rage_burst', name: '狂暴爆发', description: '激发体内潜力，短时间内攻击力暴增。',
    category: 'buff', stars: 3, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 200,
    mpCost: 40, cooldown: 15, currentCooldown: 0, type: 'buff',
  },
  {
    id: 'iron_body', name: '金刚不坏', description: '以源力强化肉身至极致，刀枪不入。',
    category: 'passive', stars: 4, level: 1, maxLevel: 10,
    practiceExp: 0, practiceExpMax: 300,
    mpCost: 0, cooldown: 0, currentCooldown: 0, type: 'passive',
  },
  {
    id: 'swift_strike', name: '闪电一击', description: '以极速接近敌人，发出致命一击。',
    category: 'attack', stars: 3, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 200,
    damage: 60, mpCost: 30, cooldown: 4, currentCooldown: 0, type: 'attack',
  },
  {
    id: 'healing_light', name: '治愈之光', description: '以源力凝聚治愈之光，恢复大量气血。',
    category: 'heal', stars: 3, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 200,
    heal: 100, mpCost: 40, cooldown: 6, currentCooldown: 0, type: 'heal',
  },
  {
    id: 'soul_attack', name: '神魂冲击', description: '以神魂之力直接攻击敌人神魂，无视防御。',
    category: 'attack', stars: 4, level: 1, maxLevel: 12,
    practiceExp: 0, practiceExpMax: 300,
    damage: 90, mpCost: 55, cooldown: 7, currentCooldown: 0, type: 'attack',
  },
];

export const ALL_SKILLS: Record<string, Skill> = {};
[
  ...STARTER_SKILLS,
  ...BASE_GONGFA,
  ...NINE_SECRETS,
  ...COMMON_SKILLS,
  ...YAOGUAN_SKILLS,
  ...JI_FAMILY_SKILLS,
  ...TAIXUAN_SKILLS,
  ...GREEN_EMPEROR_SKILLS,
  ...ZIFU_SKILLS,
  ...JIANG_SKILLS,
  ...YAO_SKILLS,
  ...ADVANCED_SKILLS,
].forEach(s => { ALL_SKILLS[s.id] = s; });

// 旧名称兼容
export const KILLER_BUILDING_SKILLS = COMMON_SKILLS;
