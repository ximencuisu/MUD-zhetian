import { Dungeon, DungeonPuzzle, BossMechanic } from '../types/game';

// ── Puzzle pools per dungeon ──

const MINE_PUZZLES: DungeonPuzzle[] = [
  { type: 'riddle', question: '「万物之源，始于一点，终于虚无」此符文暗示何意？', options: ['天地初开', '生命轮回', '源力聚散', '大道归一'], answer: 2, hint: '符文上的源力在聚散之间变化……', rewardExp: 60, rewardItems: ['scripture_shard_common'] },
  { type: 'sequence', question: '按源力由弱到强排列：①紫晶 ②蓝石 ③白矿 ④黄石', options: ['③②④①', '③④②①', '④③②①', '②③④①'], answer: 1, hint: '白矿最弱，紫晶最强……', rewardExp: 80, rewardItems: ['scripture_shard_common', 'scripture_shard_common'] },
  { type: 'math', question: '封印上显示：三三归一，七七归二，九九归？', options: ['一', '三', '九', '零'], answer: 1, hint: '数字的数根……', rewardExp: 100, rewardItems: ['scripture_shard_common'] },
];

const FOREST_PUZZLES: DungeonPuzzle[] = [
  { type: 'riddle', question: '「月圆之夜，百兽俯首」妖文中描述的是什么力量？', options: ['妖王威压', '天地法则', '月华灵力', '血脉压制'], answer: 2, hint: '月华之力是妖族修炼的根本……', rewardExp: 120, rewardItems: ['scripture_shard_common'] },
  { type: 'match', question: '将妖兽与其守护方位对应：①青龙 ②白虎 ③朱雀 ④玄武', options: ['东·西·南·北', '南·北·东·西', '东·北·南·西', '北·东·西·南'], answer: 0, hint: '古语有云：左青龙、右白虎……', rewardExp: 150, rewardItems: ['scripture_shard_common', 'scripture_shard_common'] },
  { type: 'riddle', question: '「千年修炼，一朝得道，万兽来朝」妖王追求的终极是什么？', options: ['力量', '长生', '自由', '传承'], answer: 1, hint: '所有妖族修炼者的终极追求……', rewardExp: 180, rewardItems: ['scripture_shard_fine'] },
];

const TOMB_PUZZLES: DungeonPuzzle[] = [
  { type: 'riddle', question: '「天地玄黄，宇宙洪荒，日月盈昃，辰宿列张」此经开篇暗示什么？', options: ['天地之道', '帝王之术', '修炼之法', '万物之始'], answer: 3, hint: '千字文开篇，说的是宇宙起源……', rewardExp: 300, rewardItems: ['scripture_shard_fine'] },
  { type: 'match', question: '北斗七星中，哪颗星指向北极？', options: ['天枢', '天璇', '摇光', '开阳'], answer: 0, hint: '北斗之首，指极之星……', rewardExp: 350, rewardItems: ['scripture_shard_fine', 'scripture_shard_fine'] },
  { type: 'sequence', question: '按修炼境界由低到高排列：①彼岸 ②苦海 ③神桥 ④命泉', options: ['②④③①', '②③④①', '④②③①', '①②③④'], answer: 0, hint: '轮海四境，苦海为基……', rewardExp: 400, rewardItems: ['ancient_scripture_fragment'] },
];

const TAICHU_PUZZLES: DungeonPuzzle[] = [
  { type: 'riddle', question: '「太初有道，道生一，一生二，二生三，三生万物」此处的「道」指的是？', options: ['天地规则', '源力本源', '修炼心法', '万物之母'], answer: 1, hint: '太初古矿的源力……', rewardExp: 1000, rewardItems: ['scripture_shard_rare'] },
  { type: 'riddle', question: '龙语铭文：「吾之血脉，以力为尊，以智为辅，以德为本」龙王为何以德为本？', options: ['教化子嗣', '凝聚龙族', '抵御外敌', '修炼龙诀'], answer: 1, hint: '德者，聚人心也……', rewardExp: 1200, rewardItems: ['scripture_shard_rare', 'scripture_shard_rare'] },
  { type: 'math', question: '龙王试炼：天地之数五十有五，去其一不用，余者几何？', options: ['五十四', '五十三', '五十二', '五十五'], answer: 0, hint: '大衍之数五十，其用四十有九……', rewardExp: 1500, rewardItems: ['scripture_shard_epic'] },
];

const ABYSS_PUZZLES: DungeonPuzzle[] = [
  { type: 'riddle', question: '「虚无之中，万物归寂，唯有一念，可破虚空」深渊心法开篇之意？', options: ['破而后立', '以念破虚', '归于虚无', '心随意动'], answer: 1, hint: '深渊修炼，意志为先……', rewardExp: 2000, rewardItems: ['scripture_shard_epic'] },
  { type: 'match', question: '深渊七层对应七罪：①暴食 ②贪婪 ③懒惰 ④嫉妒', options: ['①②④③', '③①②④', '④③②①', '②①③④'], answer: 0, hint: '深渊最底层是……', rewardExp: 2500, rewardItems: ['scripture_shard_epic', 'scripture_shard_epic'] },
  { type: 'sequence', question: '按虚空之力排序：①虚空裂缝 ②次元断层 ③混沌深渊 ④虚无之海', options: ['①②③④', '④③②①', '②①④③', '③④①②'], answer: 0, hint: '从小到大的虚空之力……', rewardExp: 3000, rewardItems: ['scripture_shard_epic', 'ancient_scripture_fragment'] },
];

// ── Boss mechanics ──

const MINE_BOSS_MECHANICS: BossMechanic[] = [
  { name: '源力爆发', description: '矿魂凝聚源力，每3回合造成一次范围伤害', effect: '造成150%攻击力的范围伤害', phase: 1 },
  { name: '晶体护盾', description: '矿魂召唤源晶形成护盾，大幅提升防御', effect: '防御提升200%，持续2回合', phase: 2 },
];

const FOREST_BOSS_MECHANICS: BossMechanic[] = [
  { name: '巨灵拍击', description: '熊妖巨掌拍击地面，造成范围震荡', effect: '造成200%攻击力的伤害，眩晕1回合', phase: 1 },
  { name: '妖王怒吼', description: '发出震天怒吼，削弱敌人的战力', effect: '降低玩家攻击力30%，持续3回合', phase: 2 },
];

const EMPEROR_BOSS_MECHANICS: BossMechanic[] = [
  { name: '帝威镇压', description: '古帝残念释放帝威，压制一切生灵', effect: '每回合造成持续伤害，不可闪避', phase: 1 },
  { name: '英灵召唤', description: '召唤古代英灵助战，形成夹击之势', effect: '召唤2个英灵分身，各有50%本体属性', phase: 2 },
  { name: '帝魂一剑', description: '凝聚残念之力发出致命一击', effect: '造成300%攻击力的真实伤害', phase: 3 },
];

const DRAGON_BOSS_MECHANICS: BossMechanic[] = [
  { name: '龙威', description: '上古神龙释放龙威，令敌人战力大减', effect: '降低玩家全属性20%', phase: 1 },
  { name: '龙息', description: '神龙吐息，焚烧一切', effect: '造成250%攻击力的火焰伤害', phase: 1 },
  { name: '龙鳞守护', description: '龙鳞翻涌，防御力暴增', effect: '防御提升300%，每回合恢复5%HP', phase: 2 },
  { name: '真龙降世', description: '神龙显露真身，攻击力大幅提升', effect: '攻击力提升200%，持续5回合', phase: 3 },
];

const ABYSS_BOSS_MECHANICS: BossMechanic[] = [
  { name: '虚空吞噬', description: '深渊魔主吞噬虚空，回复大量气血', effect: '恢复20%最大气血', phase: 1 },
  { name: '混沌之力', description: '释放混沌之力，随机造成负面效果', effect: '随机附加眩晕/沉默/虚弱之一', phase: 1 },
  { name: '深渊凝视', description: '深渊的凝视令人绝望，持续造成精神伤害', effect: '每回合损失8%当前气血', phase: 2 },
  { name: '末日降临', description: '召唤虚空裂缝，对所有敌人造成毁灭打击', effect: '造成500%攻击力的毁灭伤害', phase: 3 },
];

const BEAST_BOSS_MECHANICS: BossMechanic[] = [
  { name: '狂暴化', description: '妖王陷入狂暴，攻击力大幅提升', effect: '攻击力提升150%，持续3回合', phase: 1 },
  { name: '妖力护体', description: '妖力凝聚形成护盾', effect: '获得护盾吸收30%最大HP伤害', phase: 2 },
  { name: '天妖一击', description: '凝聚全部妖力发出致命一击', effect: '造成400%攻击力的伤害', phase: 3 },
];

const SHRINE_BOSS_MECHANICS: BossMechanic[] = [
  { name: '虚空领域', description: '皇魂展开虚空领域，压制一切法则', effect: '每回合造成10%当前气血伤害', phase: 1 },
  { name: '皇者威仪', description: '古皇威仪不可侵犯，反击一切攻击', effect: '受到攻击时50%概率反击150%伤害', phase: 2 },
];

// ── Rating thresholds ──
const RATING_BASE = { bronze: 0, silver: 500, gold: 1200, platinum: 2500, diamond: 4000 };
const RATING_HIGH = { bronze: 0, silver: 1000, gold: 2500, platinum: 5000, diamond: 8000 };
const RATING_ULTRA = { bronze: 0, silver: 2000, gold: 5000, platinum: 10000, diamond: 15000 };

export const DUNGEONS: Record<string, Dungeon> = {
  // ═══════════════════════════════════════════════════════════════
  // 1. 源石矿·禁区（初级副本，Lv1-15）
  // ═══════════════════════════════════════════════════════════════
  source_mine_forbidden: {
    id: 'source_mine_forbidden',
    name: '源石矿·禁区',
    description: '源石矿最深处的封禁区域，上古矿工发现此处有异常现象后紧急封闭。禁区内源力浓郁异常，孕育了大量变异妖兽，还有不知何人设置的古代傀儡守卫。',
    levelMin: 1, levelMax: 15,
    roomCount: 20,
    bossName: '源石矿·矿魂',
    dailyLimit: 3,
    dangerBase: 1,
    roomPrefixes: ['矿道', '矿洞', '矿井', '坑道', '深坑', '矿壁', '暗道', '矿室'],
    roomSuffixes: ['入口', '内部', '深处', '底层', '分叉', '主道', '支道', '末端'],
    combatNpcTags: ['变异矿鼠', '小石傀', '石傀儡', '矿道妖兽', '变异洞虫', '矿道傀儡', '变异矿鼠王', '古代战傀', '源晶傀儡', '矿魂卫士'],
    eliteNpcTags: ['精英矿鼠王', '古代石傀·将', '源晶巨兽'],
    bossEnemy: { name: '源石矿·矿魂', hp: 1500, maxHp: 1500, attack: 80, defense: 60, expReward: 500, goldReward: 80, drops: ['source_crystal', 'source_crystal', 'iron_helmet', 'qi_recovery_pill', 'rage_pill'], isBoss: true },
    bossMechanics: MINE_BOSS_MECHANICS,
    puzzlePool: MINE_PUZZLES,
    lootPool: [
      { items: ['qi_recovery_pill', 'source_stone'], gold: 10 },
      { items: ['source_crystal', 'source_stone', 'source_stone'], gold: 25 },
      { items: ['qi_recovery_pill', 'qi_recovery_pill', 'iron_rod'], gold: 30 },
      { items: ['source_crystal', 'scripture_shard_common'], gold: 40 },
    ],
    rewards: { exp: 1500, gold: 200, items: ['source_crystal', 'iron_rod', 'scripture_shard_common'] },
    sweepRewards: { exp: 500, gold: 70, items: ['source_crystal', 'source_stone'] },
    ratingThresholds: RATING_BASE,
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. 上古神木林·妖王洞穴（中级副本，Lv10-30）
  // ═══════════════════════════════════════════════════════════════
  demon_forest_cave: {
    id: 'demon_forest_cave',
    name: '上古神木林·妖王洞穴',
    description: '藏于上古神木林深处的妖王洞穴，千年妖王盘踞于此，以古林的天地精华滋养自身。洞穴中聚集了大量强力妖兽，是中等修炼者磨砺自身的绝佳之地。',
    levelMin: 10, levelMax: 30,
    roomCount: 22,
    bossName: '千年熊妖·巨灵',
    dailyLimit: 2,
    prerequisite: 'source_mine_forbidden',
    dangerBase: 2,
    roomPrefixes: ['洞穴', '兽道', '菌丝', '妖兽', '妖将', '灵泉', '兽潮', '毒蛇'],
    roomSuffixes: ['前厅', '深处', '巢穴', '通道', '密室', '走廊', '大厅', '禁区'],
    combatNpcTags: ['妖狼', '幻影妖狐', '毒菌妖', '银毛妖猿', '妖虎', '妖将·赤瞳', '妖狼精英', '铁甲妖蜥', '妖王近卫·铜锤', '妖王近卫·银枪'],
    eliteNpcTags: ['妖狼王', '银月妖狐', '千年树妖', '妖将·紫瞳'],
    bossEnemy: { name: '千年熊妖·巨灵', hp: 4000, maxHp: 4000, attack: 120, defense: 90, expReward: 1500, goldReward: 200, drops: ['dragon_blood', 'dragon_blood', 'silver_spear', 'jade_belt', 'source_crystal', 'berserk_pill'], isBoss: true },
    bossMechanics: FOREST_BOSS_MECHANICS,
    puzzlePool: FOREST_PUZZLES,
    lootPool: [
      { items: ['qi_recovery_pill', 'leather_armor'], gold: 20 },
      { items: ['source_crystal', 'dragon_blood'], gold: 40 },
      { items: ['scripture_shard_common', 'dragon_blood', 'silver_spear'], gold: 60 },
      { items: ['dragon_blood', 'qi_recovery_pill', 'qi_recovery_pill'], gold: 50 },
    ],
    rewards: { exp: 3000, gold: 500, items: ['dragon_blood', 'silver_spear', 'scripture_shard_fine'] },
    sweepRewards: { exp: 1000, gold: 170, items: ['dragon_blood', 'source_crystal'] },
    ratingThresholds: RATING_BASE,
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. 荒古遗迹·帝陵探索（高级副本，Lv25-50）
  // ═══════════════════════════════════════════════════════════════
  ancient_emperor_dungeon: {
    id: 'ancient_emperor_dungeon',
    name: '荒古遗迹·帝陵探索',
    description: '深入荒古帝陵内部的危险探索。帝陵中蕴含着上古强者的战斗意志，封存着大量绝世神材和经文。强大的禁制守卫轮番出击，非有相当实力者不可入。',
    levelMin: 25, levelMax: 50,
    roomCount: 25,
    bossName: '古帝残念·帝魂',
    dailyLimit: 1,
    prerequisite: 'demon_forest_cave',
    dangerBase: 3,
    roomPrefixes: ['前殿', '神柱', '铭文', '偏殿', '将军', '崩塌', '兵马', '星象', '内殿'],
    roomSuffixes: ['长廊', '墓室', '大厅', '通道', '密室', '机关', '宝库', '祭坛', '核心'],
    combatNpcTags: ['禁制战甲', '古代僵尸', '帝陵将军·英灵', '兵马俑·弓手', '兵马俑·枪兵', '宝藏守卫傀儡', '帝陵灵魂', '守墓灵兽·玄龟', '帝卫精锐·剑灵', '帝卫精锐·盾灵'],
    eliteNpcTags: ['帝陵将军·战魂', '玄龟王', '帝卫统领', '古帝禁卫'],
    bossEnemy: { name: '古帝残念·帝魂', hp: 10000, maxHp: 10000, attack: 200, defense: 160, expReward: 5000, goldReward: 800, drops: ['ancient_scripture_fragment', 'ancient_scripture_fragment', 'dragon_blood', 'black_gold_blade', 'forbidden_zone_map', 'golden_dragon_pill', 'divine_pill'], isBoss: true },
    bossMechanics: EMPEROR_BOSS_MECHANICS,
    puzzlePool: TOMB_PUZZLES,
    lootPool: [
      { items: ['scripture_shard_fine', 'source_crystal'], gold: 60 },
      { items: ['ancient_scripture_fragment', 'dragon_blood'], gold: 100 },
      { items: ['golden_dragon_pill', 'dragon_blood'], gold: 120 },
      { items: ['ancient_scripture_fragment', 'black_gold_blade'], gold: 200 },
    ],
    rewards: { exp: 12000, gold: 1500, items: ['ancient_scripture_fragment', 'dragon_blood', 'golden_dragon_pill', 'scripture_shard_rare'] },
    sweepRewards: { exp: 4000, gold: 500, items: ['ancient_scripture_fragment', 'source_crystal'] },
    ratingThresholds: RATING_HIGH,
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. 太初古矿·禁区深层（顶级副本，Lv50-99）
  // ═══════════════════════════════════════════════════════════════
  taichu_ancient_mine: {
    id: 'taichu_ancient_mine',
    name: '太初古矿·禁区深层',
    description: '七大生命禁区之一——太初古矿的深层区域。此处沉睡着上古神兽，积聚了数万年的天地精华。传说其中有一头上古神龙沉睡，龙血可使修炼者肉身飞跃。',
    levelMin: 50, levelMax: 99,
    roomCount: 28,
    bossName: '太初龙王·古羲',
    dailyLimit: 1,
    prerequisite: 'ancient_emperor_dungeon',
    dangerBase: 5,
    roomPrefixes: ['禁区', '古矿', '源力', '岩甲', '古龙', '龙语', '龙王', '龙脉'],
    roomSuffixes: ['外层', '裂隙', '巢穴', '深处', '灵穴', '禁地', '走廊', '龙穴'],
    combatNpcTags: ['古矿血兽', '源力变异体', '上古岩甲龟', '古龙子嗣', '龙王护卫', '太初守护兽', '龙魂守卫', '龙族长老·烛龙'],
    eliteNpcTags: ['上古岩甲龟王', '龙王亲卫', '烛龙长老', '龙魂战将'],
    bossEnemy: { name: '太初龙王·古羲', hp: 50000, maxHp: 50000, attack: 400, defense: 350, expReward: 20000, goldReward: 3000, drops: ['dragon_blood', 'dragon_blood', 'dragon_blood', 'sacred_golden_sword', 'ancient_saint_garment', 'nine_turn_elixir', 'forbidden_zone_map', 'divine_pill'], isBoss: true },
    bossMechanics: DRAGON_BOSS_MECHANICS,
    puzzlePool: TAICHU_PUZZLES,
    lootPool: [
      { items: ['source_crystal', 'source_crystal', 'source_crystal'], gold: 200 },
      { items: ['dragon_blood', 'dragon_blood', 'sacred_golden_sword'], gold: 400 },
      { items: ['ancient_scripture_fragment', 'ancient_scripture_fragment', 'nine_turn_elixir'], gold: 600 },
      { items: ['nine_turn_elixir', 'sacred_golden_sword', 'ancient_saint_garment'], gold: 800 },
    ],
    rewards: { exp: 50000, gold: 8000, items: ['dragon_blood', 'ancient_scripture_fragment', 'sacred_golden_sword', 'scripture_shard_epic'] },
    sweepRewards: { exp: 17000, gold: 2700, items: ['dragon_blood', 'source_crystal'] },
    ratingThresholds: RATING_ULTRA,
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. 天妖山脉·妖王巢穴（高级副本，Lv25-40）
  // ═══════════════════════════════════════════════════════════════
  demon_beast_lair: {
    id: 'demon_beast_lair',
    name: '天妖山脉·妖王巢穴',
    description: '天妖山脉深处妖王的巢穴，盘踞着大量妖兽。妖王凭借山脉的天地精华修炼，实力恐怖。挑战妖王，夺取妖帝传承的秘密。',
    levelMin: 25, levelMax: 40,
    roomCount: 24,
    bossName: '千年熊妖·霸天',
    dailyLimit: 2,
    prerequisite: 'demon_forest_cave',
    dangerBase: 4,
    roomPrefixes: ['妖巢', '妖道', '妖林', '妖洞', '妖穴', '妖域', '妖殿', '妖渊'],
    roomSuffixes: ['入口', '深处', '巢穴', '通道', '密室', '禁地', '深处', '核心'],
    combatNpcTags: ['山道妖兽', '金翅大鹏', '洞穴守护灵', '妖狼精英', '铁甲妖蜥', '妖王近卫', '远古恶魔之魂', '千年熊妖手下', '妖凤雏鸟', '妖龙幼崽'],
    eliteNpcTags: ['金翅大鹏王', '远古恶魔统领', '妖凤', '妖龙王'],
    bossEnemy: { name: '千年熊妖·霸天', hp: 15000, maxHp: 15000, attack: 280, defense: 220, expReward: 8000, goldReward: 1500, drops: ['demon_beast_core', 'demon_beast_core', 'bear_paw', 'dragon_blood', 'demon_blood_essence', 'ancient_scripture_fragment', 'berserk_pill'], isBoss: true },
    bossMechanics: BEAST_BOSS_MECHANICS,
    puzzlePool: FOREST_PUZZLES,
    lootPool: [
      { items: ['demon_beast_core', 'source_crystal'], gold: 100 },
      { items: ['demon_blood_essence', 'dragon_blood'], gold: 150 },
      { items: ['ancient_scripture_fragment', 'demon_beast_core'], gold: 200 },
      { items: ['bear_paw', 'demon_beast_core', 'demon_beast_core'], gold: 250 },
    ],
    rewards: { exp: 20000, gold: 3000, items: ['demon_beast_core', 'ancient_scripture_fragment', 'demon_blood_essence'] },
    sweepRewards: { exp: 7000, gold: 1000, items: ['demon_beast_core', 'source_crystal'] },
    ratingThresholds: RATING_HIGH,
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. 古皇战场·皇陵神殿（顶级副本，Lv35-50）
  // ═══════════════════════════════════════════════════════════════
  ancient_emperor_shrine: {
    id: 'ancient_emperor_shrine',
    name: '古皇战场·皇陵神殿',
    description: '古皇陨落后残躯化为神殿，蕴含着古皇的传承。战场深处埋葬着历代战死的皇者，散发镇压天地的威压。是东荒最神秘的禁地之一。',
    levelMin: 35, levelMax: 50,
    roomCount: 26,
    bossName: '皇魂·虚空',
    dailyLimit: 1,
    prerequisite: 'demon_beast_lair',
    dangerBase: 5,
    roomPrefixes: ['皇陵', '战场', '古殿', '皇魂', '皇威', '皇道', '皇陵', '皇血'],
    roomSuffixes: ['外围', '深处', '核心', '禁地', '传承', '大殿', '祭坛', '神殿'],
    combatNpcTags: ['战场亡魂', '禁制守卫', '皇陵战魂', '将军亡魂', '古皇护卫', '皇魂战士', '先贤残魂', '皇陵守护神', '战魂统领', '皇血守卫'],
    eliteNpcTags: ['将军亡魂·烈', '皇魂战士长', '先贤残魂·圣', '皇陵守护神·虚'],
    bossEnemy: { name: '皇魂·虚空', hp: 30000, maxHp: 30000, attack: 380, defense: 300, expReward: 15000, goldReward: 4000, drops: ['emperor_blood', 'emperor_blood', 'emperor_artifact', 'ancient_scripture_fragment', 'ancient_scripture_fragment', 'ghost_emperor_weapon', 'divine_pill'], isBoss: true },
    bossMechanics: SHRINE_BOSS_MECHANICS,
    puzzlePool: TOMB_PUZZLES,
    lootPool: [
      { items: ['emperor_blood', 'source_crystal'], gold: 200 },
      { items: ['ancient_scripture_fragment', 'ghost_essence'], gold: 300 },
      { items: ['emperor_artifact', 'emperor_blood'], gold: 500 },
      { items: ['ancient_scripture_fragment', 'ancient_scripture_fragment', 'emperor_blood'], gold: 800 },
    ],
    rewards: { exp: 40000, gold: 6000, items: ['emperor_blood', 'emperor_artifact', 'ancient_scripture_fragment', 'ghost_emperor_weapon'] },
    sweepRewards: { exp: 13000, gold: 2000, items: ['emperor_blood', 'ancient_scripture_fragment'] },
    ratingThresholds: RATING_ULTRA,
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. 🆕 虚空深渊·魔域（终极副本，Lv60-99）
  // ═══════════════════════════════════════════════════════════════
  void_abyss: {
    id: 'void_abyss',
    name: '虚空深渊·魔域',
    description: '七大生命禁区中最神秘的存在——虚空深渊。这里连接着异次元的裂缝，无穷无尽的深渊魔物从裂缝中涌出。传说深渊最深处沉睡着一尊远古魔主，其力量足以撕裂星空。',
    levelMin: 60, levelMax: 99,
    roomCount: 30,
    bossName: '深渊魔主·噬天',
    dailyLimit: 1,
    dungeonType: 'secret',
    prerequisite: 'taichu_ancient_mine',
    dangerBase: 5,
    eliteChance: 0.25,
    entryCost: { itemId: 'secret_realm_token_epic', amount: 1 },
    roomPrefixes: ['虚空', '深渊', '裂缝', '混沌', '魔域', '暗影', '虚无', '湮灭'],
    roomSuffixes: ['裂隙', '边缘', '深处', '核心', '祭坛', '深渊', '魔殿', '领域'],
    combatNpcTags: ['虚空魔物', '深渊魅魔', '混沌魔像', '暗影刺客', '湮灭守卫', '虚空吞噬者', '深渊领主', '混沌之源'],
    eliteNpcTags: ['虚空领主', '深渊魔王', '混沌之源·核', '湮灭之主'],
    bossEnemy: { name: '深渊魔主·噬天', hp: 80000, maxHp: 80000, attack: 500, defense: 450, expReward: 35000, goldReward: 8000, drops: ['nine_turn_elixir', 'nine_turn_elixir', 'emperor_blood', 'ancient_scripture_fragment', 'ancient_scripture_fragment', 'ghost_emperor_weapon', 'secret_realm_token_epic', 'berserk_pill'], isBoss: true },
    bossMechanics: ABYSS_BOSS_MECHANICS,
    puzzlePool: ABYSS_PUZZLES,
    lootPool: [
      { items: ['ancient_scripture_fragment', 'emperor_blood', 'nine_turn_elixir'], gold: 500 },
      { items: ['emperor_blood', 'emperor_blood', 'ghost_emperor_weapon'], gold: 800 },
      { items: ['nine_turn_elixir', 'nine_turn_elixir', 'ancient_scripture_fragment'], gold: 1200 },
      { items: ['ancient_scripture_fragment', 'emperor_artifact', 'emperor_blood'], gold: 1500 },
    ],
    rewards: { exp: 80000, gold: 15000, items: ['nine_turn_elixir', 'emperor_blood', 'ancient_scripture_fragment', 'rating_reward_box_diamond', 'ghost_emperor_weapon'] },
    sweepRewards: { exp: 27000, gold: 5000, items: ['emperor_blood', 'ancient_scripture_fragment'] },
    ratingThresholds: { bronze: 0, silver: 3000, gold: 7000, platinum: 14000, diamond: 20000 },
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. 🆕 万古龙窟·龙帝遗迹（秘境副本，Lv40-80）
  // ═══════════════════════════════════════════════════════════════
  ancient_dragon_lair: {
    id: 'ancient_dragon_lair',
    name: '万古龙窟·龙帝遗迹',
    description: '传说中龙帝飞升前留下的最后遗迹，隐藏在无尽山脉的龙脉交汇之处。龙窟中遍布龙族秘宝和上古禁制，非有龙族血脉者难以深入。但若能通过考验，可获得龙帝的传承之力。',
    levelMin: 40, levelMax: 80,
    roomCount: 28,
    bossName: '龙帝残魂·太虚',
    dailyLimit: 1,
    dungeonType: 'secret',
    prerequisite: 'ancient_emperor_dungeon',
    dangerBase: 4,
    eliteChance: 0.20,
    entryCost: { itemId: 'secret_realm_token_rare', amount: 1 },
    roomPrefixes: ['龙窟', '龙脉', '龙道', '龙骨', '龙魂', '龙殿', '龙渊', '龙门'],
    roomSuffixes: ['入口', '长廊', '大殿', '密室', '祭坛', '深渊', '禁地', '传承殿'],
    combatNpcTags: ['龙族守卫', '龙骨战将', '龙魂剑士', '龙血战士', '龙族长老', '龙殿护卫', '龙渊巨兽', '龙门守护者'],
    eliteNpcTags: ['龙族长老·金', '龙殿统领', '龙渊之主', '龙门守护神'],
    bossEnemy: { name: '龙帝残魂·太虚', hp: 60000, maxHp: 60000, attack: 450, defense: 380, expReward: 28000, goldReward: 6000, drops: ['dragon_blood', 'dragon_blood', 'dragon_blood', 'sacred_golden_sword', 'ancient_saint_garment', 'nine_turn_elixir', 'secret_realm_token_rare', 'divine_pill'], isBoss: true },
    bossMechanics: DRAGON_BOSS_MECHANICS,
    puzzlePool: TAICHU_PUZZLES,
    lootPool: [
      { items: ['dragon_blood', 'source_crystal'], gold: 300 },
      { items: ['dragon_blood', 'dragon_blood', 'ancient_scripture_fragment'], gold: 500 },
      { items: ['ancient_scripture_fragment', 'sacred_golden_sword'], gold: 800 },
      { items: ['nine_turn_elixir', 'dragon_blood', 'dragon_blood'], gold: 1000 },
    ],
    rewards: { exp: 65000, gold: 12000, items: ['dragon_blood', 'dragon_blood', 'ancient_scripture_fragment', 'ancient_saint_garment', 'rating_reward_box_gold'] },
    sweepRewards: { exp: 22000, gold: 4000, items: ['dragon_blood', 'ancient_scripture_fragment'] },
    ratingThresholds: { bronze: 0, silver: 2000, gold: 5000, platinum: 10000, diamond: 16000 },
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. 灵药园·仙草秘境（初级副本，Lv5-20）
  // ═══════════════════════════════════════════════════════════════
  spirit_herb_garden: {
    id: 'spirit_herb_garden',
    name: '灵药园·仙草秘境',
    description: '传说中仙人遗留的灵药园，园中遍地珍稀灵药。但灵药园有守护灵兽看守，只有通过考验才能采摘仙草。',
    levelMin: 5, levelMax: 20,
    roomCount: 18,
    bossName: '灵药园守护者',
    dailyLimit: 3,
    dangerBase: 1,
    roomPrefixes: ['灵药', '仙草', '灵泉', '灵田', '灵木', '灵花', '灵果', '灵池'],
    roomSuffixes: ['园地', '小径', '花丛', '药田', '泉眼', '树下', '池边', '深处'],
    combatNpcTags: ['灵药守护虫', '仙草精灵', '灵泉蛙', '灵田鼠', '灵木妖', '灵花蝶', '灵果兽', '灵池鱼'],
    eliteNpcTags: ['灵药园守卫', '仙草精灵王', '灵泉蛟龙'],
    bossEnemy: { name: '灵药园守护者', hp: 2500, maxHp: 2500, attack: 100, defense: 80, expReward: 800, goldReward: 150, drops: ['green_herb', 'red_mushroom', 'source_crystal', 'health_pill', 'qi_recovery_pill'], isBoss: true },
    bossMechanics: MINE_BOSS_MECHANICS,
    puzzlePool: MINE_PUZZLES,
    lootPool: [
      { items: ['green_herb', 'green_herb', 'green_herb'], gold: 15 },
      { items: ['red_mushroom', 'source_crystal'], gold: 25 },
      { items: ['health_pill', 'green_herb', 'red_mushroom'], gold: 35 },
      { items: ['source_crystal', 'scripture_shard_common'], gold: 45 },
    ],
    rewards: { exp: 1200, gold: 180, items: ['green_herb', 'red_mushroom', 'health_pill', 'scripture_shard_common'] },
    sweepRewards: { exp: 400, gold: 60, items: ['green_herb', 'source_crystal'] },
    ratingThresholds: RATING_BASE,
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. 剑冢·万剑归宗（中级副本，Lv15-35）
  // ═══════════════════════════════════════════════════════════════
  sword_tomb: {
    id: 'sword_tomb',
    name: '剑冢·万剑归宗',
    description: '上古剑修的埋骨之地，万柄神剑插于大地，剑气纵横。传说剑冢深处有剑仙遗留的绝世剑诀，吸引无数剑修前来探寻。',
    levelMin: 15, levelMax: 35,
    roomCount: 22,
    bossName: '剑仙残魂',
    dailyLimit: 2,
    prerequisite: 'source_mine_forbidden',
    dangerBase: 2,
    roomPrefixes: ['剑冢', '剑道', '剑林', '剑池', '剑意', '剑气', '剑魂', '剑殿'],
    roomSuffixes: ['入口', '长廊', '剑阵', '密室', '祭坛', '深处', '核心', '禁地'],
    combatNpcTags: ['剑气傀儡', '剑魂守卫', '剑意战士', '剑气飞剑', '剑冢亡魂', '剑道修士', '剑阵守卫', '剑仙弟子'],
    eliteNpcTags: ['剑冢统领', '剑意大师', '剑魂将军', '剑仙传承者'],
    bossEnemy: { name: '剑仙残魂', hp: 6000, maxHp: 6000, attack: 160, defense: 120, expReward: 2500, goldReward: 400, drops: ['iron_sword', 'silver_spear', 'source_crystal', 'scripture_shard_fine', 'rage_pill'], isBoss: true },
    bossMechanics: FOREST_BOSS_MECHANICS,
    puzzlePool: FOREST_PUZZLES,
    lootPool: [
      { items: ['iron_sword', 'source_crystal'], gold: 30 },
      { items: ['silver_spear', 'scripture_shard_common'], gold: 50 },
      { items: ['source_crystal', 'scripture_shard_fine'], gold: 70 },
      { items: ['iron_sword', 'silver_spear', 'scripture_shard_common'], gold: 90 },
    ],
    rewards: { exp: 2500, gold: 350, items: ['iron_sword', 'silver_spear', 'scripture_shard_fine'] },
    sweepRewards: { exp: 800, gold: 120, items: ['source_crystal', 'scripture_shard_common'] },
    ratingThresholds: RATING_BASE,
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. 幽冥地府·鬼门关（高级副本，Lv30-55）
  // ═══════════════════════════════════════════════════════════════
  ghost_gate: {
    id: 'ghost_gate',
    name: '幽冥地府·鬼门关',
    description: '传说中的幽冥入口，阴气弥漫，亡魂游荡。地府深处有判官殿，掌管生死簿。只有通过鬼门关的考验，才能获得地府的秘宝。',
    levelMin: 30, levelMax: 55,
    roomCount: 26,
    bossName: '判官·崔珏',
    dailyLimit: 1,
    prerequisite: 'ancient_emperor_dungeon',
    dangerBase: 4,
    roomPrefixes: ['幽冥', '鬼道', '黄泉', '忘川', '奈何', '轮回', '判官', '阎罗'],
    roomSuffixes: ['入口', '长廊', '大殿', '密室', '祭坛', '深渊', '禁地', '核心'],
    combatNpcTags: ['幽冥鬼卒', '黄泉亡魂', '忘川水鬼', '奈何桥守卫', '轮回使者', '判官护卫', '阎罗殿卫', '幽冥将军'],
    eliteNpcTags: ['幽冥鬼王', '黄泉领主', '判官亲卫', '阎罗使者'],
    bossEnemy: { name: '判官·崔珏', hp: 20000, maxHp: 20000, attack: 300, defense: 250, expReward: 10000, goldReward: 2500, drops: ['ghost_essence', 'ghost_essence', 'ancient_scripture_fragment', 'divine_pill', 'nine_turn_elixir'], isBoss: true },
    bossMechanics: EMPEROR_BOSS_MECHANICS,
    puzzlePool: TOMB_PUZZLES,
    lootPool: [
      { items: ['ghost_essence', 'source_crystal'], gold: 150 },
      { items: ['ancient_scripture_fragment', 'ghost_essence'], gold: 250 },
      { items: ['divine_pill', 'ghost_essence'], gold: 350 },
      { items: ['ancient_scripture_fragment', 'ghost_essence', 'ghost_essence'], gold: 500 },
    ],
    rewards: { exp: 25000, gold: 4000, items: ['ghost_essence', 'ancient_scripture_fragment', 'divine_pill'] },
    sweepRewards: { exp: 8000, gold: 1300, items: ['ghost_essence', 'source_crystal'] },
    ratingThresholds: RATING_HIGH,
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. 天宫遗址·仙人遗迹（终极副本，Lv70-99）
  // ═══════════════════════════════════════════════════════════════
  celestial_ruins: {
    id: 'celestial_ruins',
    name: '天宫遗址·仙人遗迹',
    description: '传说中天宫坠落后的遗址，仙气缭绕，处处是仙人遗留的禁制和宝藏。遗址深处有仙人残魂守护，只有最强大的修炼者才能挑战。',
    levelMin: 70, levelMax: 99,
    roomCount: 32,
    bossName: '仙人残魂·太上',
    dailyLimit: 1,
    dungeonType: 'secret',
    prerequisite: 'void_abyss',
    dangerBase: 5,
    eliteChance: 0.30,
    entryCost: { itemId: 'secret_realm_token_epic', amount: 2 },
    roomPrefixes: ['天宫', '仙殿', '仙池', '仙园', '仙阁', '仙台', '仙道', '仙境'],
    roomSuffixes: ['入口', '长廊', '大殿', '密室', '祭坛', '深处', '核心', '禁地'],
    combatNpcTags: ['天宫守卫', '仙鹤', '仙童', '仙将', '仙女', '仙兽', '仙兵', '仙官'],
    eliteNpcTags: ['天宫统领', '仙将·真', '仙兽王', '仙官·大'],
    bossEnemy: { name: '仙人残魂·太上', hp: 120000, maxHp: 120000, attack: 600, defense: 500, expReward: 50000, goldReward: 12000, drops: ['nine_turn_elixir', 'nine_turn_elixir', 'emperor_blood', 'ancient_scripture_fragment', 'ghost_emperor_weapon', 'sacred_golden_sword', 'divine_pill'], isBoss: true },
    bossMechanics: ABYSS_BOSS_MECHANICS,
    puzzlePool: ABYSS_PUZZLES,
    lootPool: [
      { items: ['nine_turn_elixir', 'emperor_blood'], gold: 800 },
      { items: ['ancient_scripture_fragment', 'ghost_emperor_weapon'], gold: 1200 },
      { items: ['sacred_golden_sword', 'nine_turn_elixir'], gold: 1600 },
      { items: ['ancient_scripture_fragment', 'emperor_blood', 'nine_turn_elixir'], gold: 2000 },
    ],
    rewards: { exp: 120000, gold: 25000, items: ['nine_turn_elixir', 'emperor_blood', 'ancient_scripture_fragment', 'ghost_emperor_weapon', 'sacred_golden_sword'] },
    sweepRewards: { exp: 40000, gold: 8000, items: ['emperor_blood', 'ancient_scripture_fragment'] },
    ratingThresholds: { bronze: 0, silver: 5000, gold: 12000, platinum: 25000, diamond: 40000 },
  },
};
