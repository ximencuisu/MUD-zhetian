import { Item } from '../types/game';

// 法宝品质：凡器/灵器/王者神兵/圣兵/帝兵
// 对应：white/green/blue/purple/orange

export const EQUIPMENT_ITEMS: Record<string, Item> = {
  // ========== 武器 ==========
  // 凡器
  iron_rod: {
    id: 'iron_rod', name: '玄铁棍', description: '普通铁矿锻造，没有什么特别之处。',
    type: 'weapon', slot: 'weapon', quality: 'white',
    attack: 15, weight: 5, value: 50,
  },
  bronze_sword: {
    id: 'bronze_sword', name: '青铜古剑', description: '不知传自何朝古剑，锋利程度尚可。',
    type: 'weapon', slot: 'weapon', quality: 'white',
    attack: 20, weight: 4, value: 80,
  },
  // 灵器
  silver_spear: {
    id: 'silver_spear', name: '银光长枪', description: '以银光矿锻造，枪尖寒光闪闪，蕴含灵性。',
    type: 'weapon', slot: 'weapon', quality: 'green',
    attack: 45, bonusStr: 3, weight: 6, value: 500, levelReq: 5,
    specialEffect: '枪击命中率+10%',
  },
  jade_staff: {
    id: 'jade_staff', name: '碧玉法杖', description: '以碧玉雕琢，内蕴源力，可放大施术者的神力。',
    type: 'weapon', slot: 'weapon', quality: 'green',
    attack: 35, bonusInt: 5, weight: 3, value: 600, levelReq: 8,
    specialEffect: '技能伤害+15%',
  },
  // 王者神兵
  black_gold_blade: {
    id: 'black_gold_blade', name: '黑金神刀', description: '以龙纹黑金打造，刀身如墨，斩铁如泥，隐隐有龙吟之声。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 120, bonusStr: 8, weight: 7, value: 5000, levelReq: 20,
    specialEffect: '攻击有概率触发龙吟，额外造成30%伤害',
  },
  phoenix_fan: {
    id: 'phoenix_fan', name: '凤凰赤羽扇', description: '凤凰族圣物，以凤凰赤羽制成，扇动时火焰喷涌。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 105, bonusAgi: 10, weight: 2, value: 5500, levelReq: 22,
    specialEffect: '攻击附带灼烧效果，每回合额外造成10点伤害',
  },
  // 圣兵
  sacred_golden_sword: {
    id: 'sacred_golden_sword', name: '圣金战剑', description: '圣地铸造的圣兵，以圣金熔铸，剑中有完整的攻伐神纹。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 280, bonusStr: 18, bonusAgi: 8, weight: 5, value: 50000, levelReq: 40,
    specialEffect: '圣兵共鸣：装备者神力+20%，暴击率+15%',
  },
  // 帝兵
  hengyu_furnace: {
    id: 'hengyu_furnace', name: '恒宇炉', description: '上古帝兵，传说中的至宝，以万年日精月华炼就，能焚化万物。',
    type: 'weapon', slot: 'weapon', quality: 'orange',
    attack: 999, bonusStr: 50, bonusCon: 30, weight: 20, value: 9999999, levelReq: 70,
    specialEffect: '帝兵·焚天：可激发上古神威，威力无可估量',
  },

  // ========== 头部 ==========
  cloth_headband: {
    id: 'cloth_headband', name: '白布头巾', description: '寻常布料制成的头巾。',
    type: 'armor', slot: 'head', quality: 'white',
    defense: 5, weight: 1, value: 20,
  },
  iron_helmet: {
    id: 'iron_helmet', name: '玄铁盔', description: '厚重的铁盔，能有效防御头部攻击。',
    type: 'armor', slot: 'head', quality: 'green',
    defense: 25, bonusCon: 3, weight: 4, value: 400, levelReq: 5,
  },
  spiritual_crown: {
    id: 'spiritual_crown', name: '灵玉冠', description: '灵玉铸造的王冠，佩戴后神识更加敏锐。',
    type: 'armor', slot: 'head', quality: 'blue',
    defense: 60, bonusInt: 8, weight: 2, value: 4000, levelReq: 18,
    specialEffect: '神识范围+30%，可提前感知危险',
  },
  sacred_helm: {
    id: 'sacred_helm', name: '圣光战盔', description: '圣地铸造的防护头盔，蕴含圣光护体之力。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 150, bonusCon: 15, hp: 200, weight: 5, value: 45000, levelReq: 38,
    specialEffect: '受到攻击时，10%概率圣光护体，吸收该次伤害',
  },

  // ========== 身体 ==========
  cloth_robe: {
    id: 'cloth_robe', name: '麻布道袍', description: '最普通的粗麻布道袍，仅能遮体。',
    type: 'armor', slot: 'body', quality: 'white',
    defense: 8, weight: 2, value: 30,
  },
  leather_armor: {
    id: 'leather_armor', name: '皮质护甲', description: '兽皮制成的护甲，轻便且有一定防护效果。',
    type: 'armor', slot: 'body', quality: 'green',
    defense: 35, bonusCon: 4, weight: 5, value: 600, levelReq: 6,
  },
  dragon_scale_robe: {
    id: 'dragon_scale_robe', name: '龙鳞护甲', description: '以上古神龙鳞片制成，坚硬异常，兼具灵活性。',
    type: 'armor', slot: 'body', quality: 'blue',
    defense: 90, bonusCon: 12, bonusAgi: 6, weight: 6, value: 8000, levelReq: 20,
    specialEffect: '龙鳞护体：受到伤害减少10%',
  },
  ancient_saint_garment: {
    id: 'ancient_saint_garment', name: '荒古圣甲', description: '以荒古神材铸造，专为圣体量身打造的护甲，护体神纹完整。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 220, bonusCon: 22, hp: 300, weight: 8, value: 60000, levelReq: 42,
    specialEffect: '圣体共鸣：气血上限+500，受伤时自动修复',
  },

  // ========== 腰部 ==========
  hemp_belt: {
    id: 'hemp_belt', name: '麻布腰带', description: '普通布制腰带。',
    type: 'armor', slot: 'waist', quality: 'white',
    defense: 3, weight: 1, value: 15,
  },
  jade_belt: {
    id: 'jade_belt', name: '玉制腰带', description: '以美玉制成，佩戴后神清气爽，有助于运转源力。',
    type: 'armor', slot: 'waist', quality: 'green',
    defense: 18, bonusInt: 4, mp: 50, weight: 2, value: 450, levelReq: 8,
  },
  source_crystal_belt: {
    id: 'source_crystal_belt', name: '源晶腰带', description: '以高品质源晶镶嵌，可持续为佩戴者补充神力。',
    type: 'armor', slot: 'waist', quality: 'blue',
    defense: 55, bonusInt: 10, mp: 150, weight: 3, value: 5000, levelReq: 22,
    specialEffect: '每回合自动恢复15点神力',
  },

  // ========== 手部 ==========
  cloth_gloves: {
    id: 'cloth_gloves', name: '布制护腕', description: '简单的布制护腕，聊胜于无。',
    type: 'armor', slot: 'hands', quality: 'white',
    defense: 4, weight: 1, value: 20,
  },
  iron_gauntlet: {
    id: 'iron_gauntlet', name: '铁拳护手', description: '包裹铁板的护手，能增强拳击力度。',
    type: 'armor', slot: 'hands', quality: 'green',
    defense: 20, bonusStr: 4, attack: 8, weight: 3, value: 350, levelReq: 6,
  },
  dragon_claw_glove: {
    id: 'dragon_claw_glove', name: '龙爪战手', description: '仿照上古神龙利爪制成，抓握力惊人。',
    type: 'armor', slot: 'hands', quality: 'blue',
    defense: 65, bonusStr: 10, attack: 25, weight: 4, value: 6000, levelReq: 20,
    specialEffect: '抓击技能伤害+20%',
  },

  // ========== 脚部 ==========
  cloth_boots: {
    id: 'cloth_boots', name: '布履', description: '最普通的布鞋，行走舒适。',
    type: 'armor', slot: 'feet', quality: 'white',
    defense: 5, weight: 2, value: 25,
  },
  wind_boots: {
    id: 'wind_boots', name: '追风靴', description: '以轻盈材料制成，穿上后轻功大增。',
    type: 'armor', slot: 'feet', quality: 'green',
    defense: 15, bonusAgi: 5, weight: 2, value: 400, levelReq: 5,
  },
  void_step_boots: {
    id: 'void_step_boots', name: '虚空步靴', description: '以虚空石制成，穿着者步伐如踏虚空，速度极快。',
    type: 'armor', slot: 'feet', quality: 'blue',
    defense: 50, bonusAgi: 14, weight: 2, value: 7000, levelReq: 22,
    specialEffect: '速度+20%，闪避率+12%',
  },

  // ========== 消耗品 ==========
  // 丹药
  qi_recovery_pill: {
    id: 'qi_recovery_pill', name: '聚元丹', description: '炼气士的入门丹药，可快速恢复气血。',
    type: 'consumable', quality: 'white',
    hp: 100, weight: 0, value: 50,
  },
  divine_power_elixir: {
    id: 'divine_power_elixir', name: '神力液', description: '苦海命泉中凝聚的纯净神力，饮用后快速恢复神力。',
    type: 'consumable', quality: 'green',
    mp: 150, weight: 0, value: 100,
  },
  golden_dragon_pill: {
    id: 'golden_dragon_pill', name: '紫金龙参丹', description: '以千年紫金龙参炼成，药力浑厚，大补气血神力。',
    type: 'consumable', quality: 'blue',
    hp: 500, mp: 200, weight: 0, value: 2000,
  },
  nine_turn_elixir: {
    id: 'nine_turn_elixir', name: '九转仙草液', description: '九转仙草的精华，传说可起死回生，服下后气血全满。',
    type: 'consumable', quality: 'purple',
    hp: 9999, mp: 500, weight: 0, value: 50000,
  },
  immortal_medicine: {
    id: 'immortal_medicine', name: '麒麟不死药', description: '上古神兽麒麟所化的不死药，服下后百毒不侵，肉身大增。',
    type: 'consumable', quality: 'orange',
    hp: 9999, mp: 9999, weight: 0, value: 999999,
  },

  // ========== 战斗丹药（提供临时 buff） ==========
  rage_pill: {
    id: 'rage_pill', name: '狂暴丹', description: '激发战斗潜能的丹药，短时间内攻击力暴涨。',
    type: 'consumable', quality: 'green',
    weight: 0, value: 200, specialEffect: '攻击+30，持续3回合',
    consumableEffects: [
      { stat: 'attack', value: 30, duration: 3, icon: '⚔️', description: '攻击+30' },
    ],
  },
  armor_pill: {
    id: 'armor_pill', name: '铁甲丹', description: '以玄铁精华为引炼制的护体丹药，短时间内大幅提升防御。',
    type: 'consumable', quality: 'green',
    weight: 0, value: 200, specialEffect: '防御+25，持续3回合',
    consumableEffects: [
      { stat: 'defense', value: 25, duration: 3, icon: '🛡️', description: '防御+25' },
    ],
  },
  speed_pill: {
    id: 'speed_pill', name: '风行丹', description: '以风灵草炼制的轻身丹药，身法如风行水上。',
    type: 'consumable', quality: 'green',
    weight: 0, value: 250, specialEffect: '闪避+25，持续3回合',
    consumableEffects: [
      { stat: 'dodge', value: 25, duration: 3, icon: '💨', description: '闪避+25' },
    ],
  },
  crit_pill: {
    id: 'crit_pill', name: '破障丹', description: '破除修行障碍的奇丹，短时间内洞察力大增，暴击率飙升。',
    type: 'consumable', quality: 'blue',
    weight: 0, value: 500, specialEffect: '暴击+20%，持续3回合',
    consumableEffects: [
      { stat: 'critRate', value: 20, duration: 3, icon: '🔮', description: '暴击+20%' },
    ],
  },
  regen_potion: {
    id: 'regen_potion', name: '回神液', description: '以多种灵药精炼而成的回复灵液，持续恢复体力。',
    type: 'consumable', quality: 'blue',
    hp: 80, weight: 0, value: 350,
    specialEffect: '立即恢复80气血+每回合恢复30气血持续3回合',
    consumableEffects: [
      { stat: 'healPerTurn', value: 30, duration: 3, icon: '🌿', description: '每回合回血+30' },
    ],
  },
  divine_pill: {
    id: 'divine_pill', name: '神力丹', description: '凝练天地神力而成的极品丹药，短时间内战力暴增。',
    type: 'consumable', quality: 'purple',
    weight: 0, value: 1500, specialEffect: '攻击+60、暴击+15%、防御+15，持续4回合',
    consumableEffects: [
      { stat: 'attack', value: 60, duration: 4, icon: '💥', description: '攻击+60' },
      { stat: 'critRate', value: 15, duration: 4, icon: '💥', description: '暴击+15%' },
      { stat: 'defense', value: 15, duration: 4, icon: '💥', description: '防御+15' },
    ],
  },
  berserk_pill: {
    id: 'berserk_pill', name: '燃血丹', description: '燃烧气血换取力量的禁忌丹药，攻击暴增但防御下降。',
    type: 'consumable', quality: 'purple',
    weight: 0, value: 1200, specialEffect: '攻击+80、防御-10，持续4回合',
    consumableEffects: [
      { stat: 'attack', value: 80, duration: 4, icon: '🔥', description: '攻击+80' },
      { stat: 'defense', value: -10, duration: 4, icon: '🔥', description: '防御-10' },
    ],
  },

  // ========== 材料/任务物品 ==========
  source_stone: {
    id: 'source_stone', name: '源石', description: '蕴含天地源力的石头，切割后可能得到源晶。',
    type: 'material', weight: 3, value: 20,
  },
  source_crystal: {
    id: 'source_crystal', name: '源晶', description: '高纯度的源力结晶，是修炼的重要资源。',
    type: 'material', weight: 1, value: 200,
  },
  dragon_blood: {
    id: 'dragon_blood', name: '龙血精华', description: '上古神龙留下的血液精华，以此淬炼肉身效果绝佳。',
    type: 'material', weight: 2, value: 5000,
  },
  ancient_scripture_fragment: {
    id: 'ancient_scripture_fragment', name: '上古经文残卷', description: '残破的上古修炼经文，辨认后可能得到修炼启迪。',
    type: 'quest', weight: 1, value: 0,
  },
  forbidden_zone_map: {
    id: 'forbidden_zone_map', name: '禁地地图残片', description: '记录某个生命禁区位置的残破地图。',
    type: 'quest', weight: 0, value: 0,
  },

  // ========== 更多武器 ==========
  // 灵器
  iron_sword: {
    id: 'iron_sword', name: '精铁长剑', description: '以精铁锻造的长剑，锋利耐用。',
    type: 'weapon', slot: 'weapon', quality: 'green',
    attack: 40, bonusStr: 2, weight: 5, value: 450, levelReq: 4,
  },
  wooden_staff: {
    id: 'wooden_staff', name: '灵木法杖', description: '以灵木制成，内蕴灵性，可增幅神力。',
    type: 'weapon', slot: 'weapon', quality: 'green',
    attack: 30, bonusInt: 6, weight: 3, value: 500, levelReq: 6,
  },
  // 王者神兵
  dragon_bone_spear: {
    id: 'dragon_bone_spear', name: '龙骨战枪', description: '以龙骨锻造的战枪，枪尖蕴含龙威。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 130, bonusStr: 10, bonusAgi: 5, weight: 7, value: 6000, levelReq: 25,
    specialEffect: '龙威：攻击时10%概率震慑敌人，使其下回合无法行动',
  },
  void_blade: {
    id: 'void_blade', name: '虚空之刃', description: '以虚空之力凝聚的刀刃，可切割空间。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 115, bonusAgi: 12, weight: 4, value: 5500, levelReq: 23,
    specialEffect: '虚空斩：攻击无视20%防御',
  },
  // 圣兵
  emperor_sword: {
    id: 'emperor_sword', name: '帝王战剑', description: '古皇遗留的战剑，蕴含帝王之气。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 300, bonusStr: 20, bonusCon: 10, weight: 6, value: 55000, levelReq: 45,
    specialEffect: '帝王之气：全属性+10%，攻击时5%概率触发帝王一击',
  },

  // ========== 更多防具 ==========
  // 头部
  dragon_helm: {
    id: 'dragon_helm', name: '龙鳞战盔', description: '以龙鳞制成的战盔，坚固异常。',
    type: 'armor', slot: 'head', quality: 'blue',
    defense: 70, bonusCon: 10, hp: 100, weight: 4, value: 4500, levelReq: 20,
    specialEffect: '龙鳞护体：受到物理伤害减少5%',
  },
  // 身体
  source_armor: {
    id: 'source_armor', name: '源力战甲', description: '以源力凝聚的战甲，可随心意变化形态。',
    type: 'armor', slot: 'body', quality: 'green',
    defense: 40, bonusCon: 5, weight: 4, value: 700, levelReq: 8,
  },
  // 腰部
  dragon_belt: {
    id: 'dragon_belt', name: '龙纹腰带', description: '以龙皮制成，上有龙纹，可增强气血。',
    type: 'armor', slot: 'waist', quality: 'blue',
    defense: 60, bonusCon: 8, hp: 120, weight: 3, value: 5500, levelReq: 20,
    specialEffect: '气血上限+150',
  },
  // 手部
  source_gloves: {
    id: 'source_gloves', name: '源力护手', description: '以源力凝聚的护手，可增强攻击力。',
    type: 'armor', slot: 'hands', quality: 'green',
    defense: 25, bonusStr: 5, attack: 12, weight: 3, value: 450, levelReq: 8,
  },
  // 脚部
  dragon_boots: {
    id: 'dragon_boots', name: '龙鳞战靴', description: '以龙鳞制成的战靴，轻便且坚固。',
    type: 'armor', slot: 'feet', quality: 'blue',
    defense: 55, bonusAgi: 10, weight: 3, value: 6500, levelReq: 20,
    specialEffect: '移动速度+15%，闪避+8%',
  },

  // ========== 套装：龙鳞套装 ==========
  dragon_scale_helm: {
    id: 'dragon_scale_helm', name: '龙鳞盔', description: '龙鳞套装部件，以龙鳞精心锻造。',
    type: 'armor', slot: 'head', quality: 'blue',
    defense: 65, bonusCon: 8, hp: 80, weight: 4, value: 4000, levelReq: 18,
    setId: 'dragon_scale',
  },
  dragon_scale_armor: {
    id: 'dragon_scale_armor', name: '龙鳞甲', description: '龙鳞套装主体，以完整龙鳞编织而成。',
    type: 'armor', slot: 'body', quality: 'blue',
    defense: 95, bonusCon: 12, hp: 150, weight: 6, value: 7500, levelReq: 18,
    setId: 'dragon_scale',
  },
  dragon_scale_belt: {
    id: 'dragon_scale_belt', name: '龙鳞腰带', description: '龙鳞套装部件，以龙皮和龙鳞制成。',
    type: 'armor', slot: 'waist', quality: 'blue',
    defense: 50, bonusCon: 6, hp: 100, weight: 3, value: 3500, levelReq: 18,
    setId: 'dragon_scale',
  },
  dragon_scale_gloves: {
    id: 'dragon_scale_gloves', name: '龙鳞护手', description: '龙鳞套装部件，以龙鳞包裹的护手。',
    type: 'armor', slot: 'hands', quality: 'blue',
    defense: 55, bonusStr: 8, attack: 20, weight: 3, value: 3800, levelReq: 18,
    setId: 'dragon_scale',
  },
  dragon_scale_boots: {
    id: 'dragon_scale_boots', name: '龙鳞战靴', description: '龙鳞套装部件，以龙鳞制成的战靴。',
    type: 'armor', slot: 'feet', quality: 'blue',
    defense: 50, bonusAgi: 8, weight: 3, value: 3600, levelReq: 18,
    setId: 'dragon_scale',
  },

  // ========== 更多消耗品 ==========
  health_pill: {
    id: 'health_pill', name: '回血丹', description: '基础丹药，可恢复少量气血。',
    type: 'consumable', quality: 'white',
    hp: 50, weight: 0, value: 30,
  },
  mp_pill: {
    id: 'mp_pill', name: '回神丹', description: '基础丹药，可恢复少量神力。',
    type: 'consumable', quality: 'white',
    mp: 50, weight: 0, value: 30,
  },
  // 材料
  iron_ore: {
    id: 'iron_ore', name: '铁矿石', description: '普通的铁矿石，可锻造武器。',
    type: 'material', weight: 3, value: 15,
  },
  steel_ore: {
    id: 'steel_ore', name: '精钢矿', description: '高品质的矿石，可锻造精良装备。',
    type: 'material', weight: 4, value: 50,
  },
  leather: {
    id: 'leather', name: '兽皮', description: '妖兽的皮，可制作护甲。',
    type: 'material', weight: 2, value: 25,
  },
  green_herb: {
    id: 'green_herb', name: '灵草', description: '常见的灵药，可炼制回血丹。',
    type: 'material', weight: 1, value: 10,
  },
  red_mushroom: {
    id: 'red_mushroom', name: '红菇', description: '稀有的灵药，可炼制高级丹药。',
    type: 'material', weight: 1, value: 30,
  },
  dao_stone: {
    id: 'dao_stone', name: '道源石', description: '蕴含道韵的源石，道宫境界突破所需。',
    type: 'material', weight: 2, value: 300,
  },
  siji_crystal: {
    id: 'siji_crystal', name: '四极晶石', description: '四极之力凝聚的晶石，四极境界突破所需。',
    type: 'material', weight: 2, value: 800,
  },
  xiantai_crystal: {
    id: 'xiantai_crystal', name: '仙台晶石', description: '仙台之力凝聚的晶石，仙台境界突破所需。',
    type: 'material', weight: 2, value: 2000,
  },

  // ── 太玄门套装物品 ──
  taixuan_sword: {
    id: 'taixuan_sword', name: '太玄剑', description: '太玄门弟子的制式长剑，蕴含太玄之力。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 100, bonusStr: 8, weight: 5, value: 5000, levelReq: 15,
    setId: 'taixuan',
  },
  taixuan_robe: {
    id: 'taixuan_robe', name: '太玄道袍', description: '太玄门弟子的制式道袍，蕴含太玄之力。',
    type: 'armor', slot: 'body', quality: 'blue',
    defense: 80, bonusCon: 10, hp: 100, weight: 4, value: 4500, levelReq: 15,
    setId: 'taixuan',
  },
  taixuan_belt: {
    id: 'taixuan_belt', name: '太玄腰带', description: '太玄门弟子的制式腰带，蕴含太玄之力。',
    type: 'armor', slot: 'waist', quality: 'blue',
    defense: 40, bonusInt: 6, mp: 80, weight: 2, value: 3000, levelReq: 15,
    setId: 'taixuan',
  },
  taixuan_boots: {
    id: 'taixuan_boots', name: '太玄靴', description: '太玄门弟子的制式靴子，蕴含太玄之力。',
    type: 'armor', slot: 'feet', quality: 'blue',
    defense: 45, bonusAgi: 8, weight: 2, value: 3200, levelReq: 15,
    setId: 'taixuan',
  },

  // ── 摇光圣地套装物品 ──
  yaoguan_staff: {
    id: 'yaoguan_staff', name: '摇光法杖', description: '摇光圣地弟子的制式法杖，蕴含圣光之力。',
    type: 'weapon', slot: 'weapon', quality: 'blue',
    attack: 90, bonusInt: 12, weight: 4, value: 5500, levelReq: 18,
    setId: 'yaoguan',
  },
  yaoguan_robe: {
    id: 'yaoguan_robe', name: '摇光圣袍', description: '摇光圣地弟子的制式圣袍，蕴含圣光之力。',
    type: 'armor', slot: 'body', quality: 'blue',
    defense: 85, bonusCon: 8, mp: 120, weight: 4, value: 5000, levelReq: 18,
    setId: 'yaoguan',
  },
  yaoguan_crown: {
    id: 'yaoguan_crown', name: '摇光圣冠', description: '摇光圣地弟子的制式圣冠，蕴含圣光之力。',
    type: 'armor', slot: 'head', quality: 'blue',
    defense: 60, bonusInt: 10, mp: 100, weight: 2, value: 4000, levelReq: 18,
    setId: 'yaoguan',
  },
  yaoguan_boots: {
    id: 'yaoguan_boots', name: '摇光圣靴', description: '摇光圣地弟子的制式圣靴，蕴含圣光之力。',
    type: 'armor', slot: 'feet', quality: 'blue',
    defense: 48, bonusAgi: 10, weight: 2, value: 3500, levelReq: 18,
    setId: 'yaoguan',
  },

  // ── 古皇套装物品 ──
  emperor_helm: {
    id: 'emperor_helm', name: '古皇战盔', description: '古皇遗留的战盔，蕴含帝王之气。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 160, bonusCon: 18, hp: 250, weight: 5, value: 50000, levelReq: 40,
    setId: 'emperor',
  },
  emperor_armor: {
    id: 'emperor_armor', name: '古皇战甲', description: '古皇遗留的战甲，蕴含帝王之气。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 250, bonusCon: 25, hp: 400, weight: 8, value: 70000, levelReq: 40,
    setId: 'emperor',
  },
  emperor_belt: {
    id: 'emperor_belt', name: '古皇腰带', description: '古皇遗留的腰带，蕴含帝王之气。',
    type: 'armor', slot: 'waist', quality: 'purple',
    defense: 100, bonusCon: 12, hp: 150, weight: 3, value: 35000, levelReq: 40,
    setId: 'emperor',
  },
  emperor_gloves: {
    id: 'emperor_gloves', name: '古皇战手', description: '古皇遗留的战手，蕴含帝王之气。',
    type: 'armor', slot: 'hands', quality: 'purple',
    defense: 120, bonusStr: 15, attack: 40, weight: 4, value: 40000, levelReq: 40,
    setId: 'emperor',
  },
  emperor_boots: {
    id: 'emperor_boots', name: '古皇战靴', description: '古皇遗留的战靴，蕴含帝王之气。',
    type: 'armor', slot: 'feet', quality: 'purple',
    defense: 110, bonusAgi: 15, weight: 4, value: 38000, levelReq: 40,
    setId: 'emperor',
  },

  // ── 龙族套装物品 ──
  dragon_crown: {
    id: 'dragon_crown', name: '龙王冠', description: '以龙骨和龙血锻造的王冠，蕴含真龙之力。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 180, bonusCon: 20, hp: 300, weight: 5, value: 60000, levelReq: 50,
    setId: 'dragon_tribe',
  },
  dragon_armor: {
    id: 'dragon_armor', name: '龙王战甲', description: '以龙骨和龙血锻造的战甲，蕴含真龙之力。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 280, bonusCon: 28, hp: 500, weight: 9, value: 80000, levelReq: 50,
    setId: 'dragon_tribe',
  },
  dragon_tribe_belt: {
    id: 'dragon_tribe_belt', name: '龙王腰带', description: '以龙皮和龙血锻造的腰带，蕴含真龙之力。',
    type: 'armor', slot: 'waist', quality: 'purple',
    defense: 120, bonusCon: 15, hp: 200, weight: 3, value: 45000, levelReq: 50,
    setId: 'dragon_tribe',
  },
  dragon_gloves: {
    id: 'dragon_gloves', name: '龙王战手', description: '以龙骨和龙血锻造的战手，蕴含真龙之力。',
    type: 'armor', slot: 'hands', quality: 'purple',
    defense: 140, bonusStr: 18, attack: 50, weight: 4, value: 50000, levelReq: 50,
    setId: 'dragon_tribe',
  },
  dragon_tribe_boots: {
    id: 'dragon_tribe_boots', name: '龙王战靴', description: '以龙骨和龙血锻造的战靴，蕴含真龙之力。',
    type: 'armor', slot: 'feet', quality: 'purple',
    defense: 130, bonusAgi: 18, weight: 4, value: 48000, levelReq: 50,
    setId: 'dragon_tribe',
  },

  // ── 帝兵套装物品 ──
  emperor_weapon_sword: {
    id: 'emperor_weapon_sword', name: '帝兵·天帝剑', description: '以帝兵碎片重铸的神剑，蕴含帝者之力。',
    type: 'weapon', slot: 'weapon', quality: 'orange',
    attack: 500, bonusStr: 40, bonusCon: 20, weight: 8, value: 500000, levelReq: 60,
    setId: 'emperor_weapon',
    specialEffect: '帝兵之威：攻击时20%概率触发帝兵之威，造成300%伤害',
  },
  emperor_weapon_armor: {
    id: 'emperor_weapon_armor', name: '帝兵·天帝甲', description: '以帝兵碎片重铸的神甲，蕴含帝者之力。',
    type: 'armor', slot: 'body', quality: 'orange',
    defense: 500, bonusCon: 40, hp: 1000, weight: 12, value: 600000, levelReq: 60,
    setId: 'emperor_weapon',
    specialEffect: '天道庇护：受到致命伤害时10%概率免疫',
  },
  emperor_weapon_crown: {
    id: 'emperor_weapon_crown', name: '帝兵·天帝冠', description: '以帝兵碎片重铸的神冠，蕴含帝者之力。',
    type: 'armor', slot: 'head', quality: 'orange',
    defense: 350, bonusInt: 30, bonusCon: 25, hp: 500, mp: 300, weight: 6, value: 550000, levelReq: 60,
    setId: 'emperor_weapon',
    specialEffect: '帝者智慧：全属性+20%',
  },

  // ── 仙台套装物品 ──
  xiantai_sword: {
    id: 'xiantai_sword', name: '仙台圣剑', description: '仙台境界强者专用的圣剑，蕴含仙台之力。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 350, bonusStr: 25, bonusInt: 15, weight: 6, value: 80000, levelReq: 50,
    setId: 'xiantai',
  },
  xiantai_robe: {
    id: 'xiantai_robe', name: '仙台圣袍', description: '仙台境界强者专用的圣袍，蕴含仙台之力。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 300, bonusCon: 25, hp: 400, mp: 200, weight: 6, value: 75000, levelReq: 50,
    setId: 'xiantai',
  },
  xiantai_crown: {
    id: 'xiantai_crown', name: '仙台圣冠', description: '仙台境界强者专用的圣冠，蕴含仙台之力。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 200, bonusInt: 20, bonusCon: 15, hp: 300, mp: 150, weight: 4, value: 65000, levelReq: 50,
    setId: 'xiantai',
  },

  // ── 圣光套装物品 ──
  sacred_light_sword: {
    id: 'sacred_light_sword', name: '圣光之剑', description: '以圣光之力锻造的神圣之剑。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 320, bonusStr: 22, bonusInt: 12, weight: 5, value: 70000, levelReq: 45,
    setId: 'sacred_light',
  },
  sacred_light_armor: {
    id: 'sacred_light_armor', name: '圣光战甲', description: '以圣光之力锻造的神圣战甲。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 270, bonusCon: 22, hp: 350, weight: 7, value: 65000, levelReq: 45,
    setId: 'sacred_light',
  },
  sacred_light_crown: {
    id: 'sacred_light_crown', name: '圣光圣冠', description: '以圣光之力锻造的神圣圣冠。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 180, bonusInt: 18, bonusCon: 12, hp: 250, mp: 120, weight: 4, value: 55000, levelReq: 45,
    setId: 'sacred_light',
  },

  // ── 虚空套装物品 ──
  void_set_blade: {
    id: 'void_set_blade', name: '虚空之刃', description: '以虚空之力凝聚的刀刃，可切割空间。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 280, bonusAgi: 20, bonusStr: 15, weight: 4, value: 60000, levelReq: 42,
    setId: 'void',
    specialEffect: '虚空斩：攻击无视20%防御',
  },
  void_armor: {
    id: 'void_armor', name: '虚空战甲', description: '以虚空之力凝聚的战甲，虚实之间。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 240, bonusCon: 20, bonusAgi: 10, hp: 300, weight: 5, value: 55000, levelReq: 42,
    setId: 'void',
  },
  void_boots: {
    id: 'void_boots', name: '虚空步靴', description: '以虚空之力凝聚的步靴，踏破虚空。',
    type: 'armor', slot: 'feet', quality: 'purple',
    defense: 150, bonusAgi: 22, weight: 3, value: 50000, levelReq: 42,
    setId: 'void',
    specialEffect: '虚空步：闪避率+15%，速度+20%',
  },

  // ── 深渊套装物品 ──
  abyss_sword: {
    id: 'abyss_sword', name: '深渊魔剑', description: '深渊之力凝聚的魔剑，蕴含黑暗之力。',
    type: 'weapon', slot: 'weapon', quality: 'purple',
    attack: 340, bonusStr: 25, bonusAgi: 10, weight: 6, value: 75000, levelReq: 48,
    setId: 'abyss',
    specialEffect: '深渊之力：攻击时10%概率使敌人陷入恐惧',
  },
  abyss_armor: {
    id: 'abyss_armor', name: '深渊魔甲', description: '深渊之力凝聚的魔甲，蕴含黑暗之力。',
    type: 'armor', slot: 'body', quality: 'purple',
    defense: 290, bonusCon: 24, hp: 380, weight: 7, value: 70000, levelReq: 48,
    setId: 'abyss',
  },
  abyss_crown: {
    id: 'abyss_crown', name: '深渊魔冠', description: '深渊之力凝聚的魔冠，蕴含黑暗之力。',
    type: 'armor', slot: 'head', quality: 'purple',
    defense: 190, bonusInt: 20, bonusCon: 14, hp: 280, mp: 150, weight: 4, value: 60000, levelReq: 48,
    setId: 'abyss',
  },

  // ── 凤凰套装物品 ──
  phoenix_sword: {
    id: 'phoenix_sword', name: '凤凰神剑', description: '以凤凰羽毛和凤凰血锻造的神剑，蕴含凤凰之力。',
    type: 'weapon', slot: 'weapon', quality: 'orange',
    attack: 450, bonusStr: 35, bonusAgi: 15, weight: 5, value: 400000, levelReq: 55,
    setId: 'phoenix',
    specialEffect: '凤火：攻击附带灼烧效果，每回合造成50点伤害',
  },
  phoenix_armor: {
    id: 'phoenix_armor', name: '凤凰神甲', description: '以凤凰羽毛和凤凰血锻造的神甲，蕴含凤凰之力。',
    type: 'armor', slot: 'body', quality: 'orange',
    defense: 420, bonusCon: 35, hp: 800, weight: 8, value: 450000, levelReq: 55,
    setId: 'phoenix',
    specialEffect: '凤凰涅槃：死亡时30%概率复活并恢复50%气血',
  },
  phoenix_crown: {
    id: 'phoenix_crown', name: '凤凰神冠', description: '以凤凰羽毛和凤凰血锻造的神冠，蕴含凤凰之力。',
    type: 'armor', slot: 'head', quality: 'orange',
    defense: 300, bonusInt: 28, bonusCon: 20, hp: 400, mp: 250, weight: 5, value: 380000, levelReq: 55,
    setId: 'phoenix',
    specialEffect: '凤凰之力：全属性+15%',
  },

  // ── 新增材料 ──
  emperor_blood: {
    id: 'emperor_blood', name: '皇血', description: '古皇遗留的血液精华，蕴含帝王之气。',
    type: 'material', weight: 1, value: 8000,
  },
  demon_blood_essence: {
    id: 'demon_blood_essence', name: '妖血精华', description: '妖族强者的血液精华，蕴含妖力。',
    type: 'material', weight: 1, value: 3000,
  },
  phoenix_feather: {
    id: 'phoenix_feather', name: '凤凰羽毛', description: '凤凰的羽毛，蕴含凤凰之力。',
    type: 'material', weight: 1, value: 15000,
  },
  ghost_essence: {
    id: 'ghost_essence', name: '亡魂精华', description: '战场亡魂的精华，蕴含幽冥之力。',
    type: 'material', weight: 1, value: 2000,
  },
  void_essence: {
    id: 'void_essence', name: '虚空精华', description: '虚空生物的精华，蕴含虚空之力。',
    type: 'material', weight: 1, value: 5000,
  },
  heaven_essence: {
    id: 'heaven_essence', name: '天道精华', description: '天道降下的精华，蕴含天道之力。',
    type: 'material', weight: 1, value: 20000,
  },
  demon_beast_core: {
    id: 'demon_beast_core', name: '妖兽内丹', description: '妖兽体内的内丹，蕴含妖力。',
    type: 'material', weight: 1, value: 1000,
  },
  emperor_artifact: {
    id: 'emperor_artifact', name: '古皇遗物', description: '古皇遗留的神秘物品，蕴含帝王之气。',
    type: 'material', weight: 2, value: 10000,
  },
  emperor_fragment: {
    id: 'emperor_fragment', name: '帝兵碎片', description: '帝兵的碎片，蕴含帝者之力。',
    type: 'material', weight: 1, value: 12000,
  },
  race_trophy: {
    id: 'race_trophy', name: '战利品', description: '万族大战中获得的战利品。',
    type: 'material', weight: 1, value: 5000,
  },
  immortal_token: {
    id: 'immortal_token', name: '仙路令牌', description: '进入仙路的凭证。',
    type: 'material', weight: 0, value: 8000,
  },
  sect_honor_medal: {
    id: 'sect_honor_medal', name: '门派荣誉勋章', description: '门派颁发的荣誉勋章。',
    type: 'material', weight: 0, value: 500,
  },

  // ── 经文碎片 ──
  scripture_shard_common: {
    id: 'scripture_shard_common', name: '经文碎片（凡品）', description: '普通的经文碎片，可用来学习技能。',
    type: 'material', weight: 0, value: 100,
  },
  scripture_shard_fine: {
    id: 'scripture_shard_fine', name: '经文碎片（良品）', description: '品质较好的经文碎片，蕴含更多修炼知识。',
    type: 'material', weight: 0, value: 300,
  },
  scripture_shard_rare: {
    id: 'scripture_shard_rare', name: '经文碎片（稀品）', description: '稀有的经文碎片，蕴含珍贵的修炼知识。',
    type: 'material', weight: 0, value: 800,
  },
  scripture_shard_epic: {
    id: 'scripture_shard_epic', name: '经文碎片（极品）', description: '极品经文碎片，蕴含上古修炼奥秘。',
    type: 'material', weight: 0, value: 2000,
  },
  gold_coin: {
    id: 'gold_coin', name: '金币', description: '通用货币，可用于交易。',
    type: 'material', weight: 0, value: 1,
  },

  // ── 炼丹产物 ──
  exp_pill: {
    id: 'exp_pill', name: '经验丹', description: '服用后可获得大量经验，加速修炼。',
    type: 'consumable', quality: 'blue',
    weight: 0, value: 500, specialEffect: '获得5000经验',
    consumableEffects: [
      { stat: 'exp', value: 5000, duration: 0, icon: '📖', description: '经验+5000' },
    ],
  },
  gold_pill: {
    id: 'gold_pill', name: '聚财丹', description: '服用后可获得大量金叶。',
    type: 'consumable', quality: 'blue',
    weight: 0, value: 400, specialEffect: '获得3000金叶',
    consumableEffects: [
      { stat: 'gold', value: 3000, duration: 0, icon: '💰', description: '金叶+3000' },
    ],
  },
  reputation_pill: {
    id: 'reputation_pill', name: '声望丹', description: '服用后可获得门派声望。',
    type: 'consumable', quality: 'blue',
    weight: 0, value: 600, specialEffect: '获得200声望',
    consumableEffects: [
      { stat: 'reputation', value: 200, duration: 0, icon: '🏅', description: '声望+200' },
    ],
  },
  breakthrough_pill: {
    id: 'breakthrough_pill', name: '突破丹', description: '服用后可大幅提升突破成功率。',
    type: 'consumable', quality: 'purple',
    weight: 0, value: 2000, specialEffect: '突破成功率+50%',
    consumableEffects: [
      { stat: 'breakthroughRate', value: 50, duration: 1, icon: '💫', description: '突破率+50%' },
    ],
  },
  marrow_wash_pill: {
    id: 'marrow_wash_pill', name: '洗髓丹', description: '服用后可洗筋伐髓，永久提升资质。',
    type: 'consumable', quality: 'purple',
    weight: 0, value: 1500, specialEffect: '全属性永久+5',
    consumableEffects: [
      { stat: 'allStats', value: 5, duration: -1, icon: '💎', description: '全属性+5（永久）' },
    ],
  },
  rebirth_pill: {
    id: 'rebirth_pill', name: '重生丹', description: '服用后可浴火重生，恢复全部状态。',
    type: 'consumable', quality: 'purple',
    weight: 0, value: 3000, specialEffect: '气血神力全满',
    consumableEffects: [
      { stat: 'hp', value: 9999, duration: 0, icon: '🔥', description: '气血全满' },
      { stat: 'mp', value: 9999, duration: 0, icon: '🔥', description: '神力全满' },
    ],
  },
  emperor_pill: {
    id: 'emperor_pill', name: '帝丹', description: '服用后可获得帝者之力，短时间内战力暴增。',
    type: 'consumable', quality: 'orange',
    weight: 0, value: 8000, specialEffect: '全属性+100%，持续5回合',
    consumableEffects: [
      { stat: 'attack', value: 200, duration: 5, icon: '👑', description: '攻击+200' },
      { stat: 'defense', value: 150, duration: 5, icon: '👑', description: '防御+150' },
      { stat: 'hp', value: 2000, duration: 5, icon: '👑', description: '气血+2000' },
    ],
  },
  heaven_dao_pill: {
    id: 'heaven_dao_pill', name: '天道丹', description: '服用后可感悟天道之力，获得无上加持。',
    type: 'consumable', quality: 'orange',
    weight: 0, value: 15000, specialEffect: '全属性+200%，持续8回合',
    consumableEffects: [
      { stat: 'attack', value: 500, duration: 8, icon: '✨', description: '攻击+500' },
      { stat: 'defense', value: 400, duration: 8, icon: '✨', description: '防御+400' },
      { stat: 'hp', value: 5000, duration: 8, icon: '✨', description: '气血+5000' },
      { stat: 'critRate', value: 30, duration: 8, icon: '✨', description: '暴击+30%' },
    ],
  },
};

// ── 套装定义 ──
export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  pieces: string[];
  bonuses: { count: number; effects: string[] }[];
}

export const EQUIPMENT_SETS: Record<string, EquipmentSet> = {
  dragon_scale: {
    id: 'dragon_scale',
    name: '龙鳞套装',
    description: '以龙鳞打造的完整套装，集齐后可获得龙族之力。',
    pieces: ['dragon_scale_helm', 'dragon_scale_armor', 'dragon_scale_belt', 'dragon_scale_gloves', 'dragon_scale_boots'],
    bonuses: [
      { count: 3, effects: ['防御+50', '气血上限+200'] },
      { count: 5, effects: ['全属性+15%', '龙鳞护体：受到伤害减少10%', '龙威：攻击时5%概率震慑敌人'] },
    ],
  },

  // ── 太玄门套装 ──
  taixuan: {
    id: 'taixuan',
    name: '太玄门套装',
    description: '太玄门弟子的制式装备，集齐后可获得门派之力。',
    pieces: ['taixuan_sword', 'taixuan_robe', 'taixuan_belt', 'taixuan_boots'],
    bonuses: [
      { count: 2, effects: ['攻击+30', '防御+20'] },
      { count: 4, effects: ['全属性+10%', '太玄心法：每回合恢复10点神力'] },
    ],
  },

  // ── 摇光圣地套装 ──
  yaoguan: {
    id: 'yaoguan',
    name: '摇光圣地套装',
    description: '摇光圣地弟子的制式装备，集齐后可获得圣光之力。',
    pieces: ['yaoguan_staff', 'yaoguan_robe', 'yaoguan_crown', 'yaoguan_boots'],
    bonuses: [
      { count: 2, effects: ['攻击+40', '神力上限+100'] },
      { count: 4, effects: ['全属性+12%', '圣光护体：受到攻击时10%概率免疫伤害'] },
    ],
  },

  // ── 古皇套装 ──
  emperor: {
    id: 'emperor',
    name: '古皇套装',
    description: '古皇遗留的战甲，蕴含帝王之气，集齐后可获得古皇之力。',
    pieces: ['emperor_helm', 'emperor_armor', 'emperor_belt', 'emperor_gloves', 'emperor_boots'],
    bonuses: [
      { count: 3, effects: ['攻击+80', '防御+60', '气血上限+500'] },
      { count: 5, effects: ['全属性+25%', '帝王之气：攻击时10%概率触发帝王一击', '皇威：降低周围敌人15%攻击力'] },
    ],
  },

  // ── 龙族套装 ──
  dragon_tribe: {
    id: 'dragon_tribe',
    name: '龙族套装',
    description: '以龙血和龙骨打造的终极套装，集齐后可获得真龙之力。',
    pieces: ['dragon_crown', 'dragon_armor', 'dragon_tribe_belt', 'dragon_gloves', 'dragon_tribe_boots'],
    bonuses: [
      { count: 3, effects: ['攻击+100', '防御+80', '气血上限+800'] },
      { count: 5, effects: ['全属性+30%', '真龙降世：攻击时15%概率触发龙息', '龙鳞护体：受到伤害减少20%'] },
    ],
  },

  // ── 帝兵套装 ──
  emperor_weapon: {
    id: 'emperor_weapon',
    name: '帝兵套装',
    description: '以帝兵碎片重铸的终极装备，集齐后可获得帝者之力。',
    pieces: ['emperor_weapon_sword', 'emperor_weapon_armor', 'emperor_weapon_crown'],
    bonuses: [
      { count: 2, effects: ['攻击+150', '防御+100'] },
      { count: 3, effects: ['全属性+40%', '帝兵共鸣：攻击时20%概率触发帝兵之威', '天道庇护：受到致命伤害时10%概率免疫'] },
    ],
  },

  // ── 仙台套装 ──
  xiantai: {
    id: 'xiantai',
    name: '仙台套装',
    description: '仙台境界强者专用的装备，蕴含仙台之力。',
    pieces: ['xiantai_sword', 'xiantai_robe', 'xiantai_crown'],
    bonuses: [
      { count: 2, effects: ['攻击+120', '防御+90'] },
      { count: 3, effects: ['全属性+20%', '仙台之力：每回合恢复5%气血和神力'] },
    ],
  },

  // ── 圣光套装 ──
  sacred_light: {
    id: 'sacred_light',
    name: '圣光套装',
    description: '以圣光之力锻造的神圣装备，集齐后可获得圣光庇护。',
    pieces: ['sacred_light_sword', 'sacred_light_armor', 'sacred_light_crown'],
    bonuses: [
      { count: 2, effects: ['攻击+90', '防御+70'] },
      { count: 3, effects: ['全属性+18%', '圣光庇护：受到攻击时15%概率反弹50%伤害'] },
    ],
  },

  // ── 虚空套装 ──
  void: {
    id: 'void',
    name: '虚空套装',
    description: '以虚空之力凝聚的神秘装备，集齐后可获得虚空之力。',
    pieces: ['void_set_blade', 'void_armor', 'void_boots'],
    bonuses: [
      { count: 2, effects: ['攻击+100', '速度+20'] },
      { count: 3, effects: ['全属性+15%', '虚空步：闪避率+20%', '虚空斩：攻击无视30%防御'] },
    ],
  },

  // ── 深渊套装 ──
  abyss: {
    id: 'abyss',
    name: '深渊套装',
    description: '深渊之力凝聚的黑暗装备，集齐后可获得深渊之力。',
    pieces: ['abyss_sword', 'abyss_armor', 'abyss_crown'],
    bonuses: [
      { count: 2, effects: ['攻击+110', '暴击率+10%'] },
      { count: 3, effects: ['全属性+22%', '深渊凝视：攻击时10%概率使敌人陷入恐惧', '黑暗之力：暴击伤害+50%'] },
    ],
  },

  // ── 凤凰套装 ──
  phoenix: {
    id: 'phoenix',
    name: '凤凰套装',
    description: '以凤凰羽毛和凤凰血锻造的神装，集齐后可获得凤凰之力。',
    pieces: ['phoenix_sword', 'phoenix_armor', 'phoenix_crown'],
    bonuses: [
      { count: 2, effects: ['攻击+130', '防御+90'] },
      { count: 3, effects: ['全属性+25%', '凤凰涅槃：死亡时30%概率复活并恢复50%气血', '凤火：攻击附带灼烧效果'] },
    ],
  },
};
