import { Zone, ZoneRoom, NPC } from '../types/game';

// =================== 门派Zone ===================

// 太玄门Zone（门派）
const TAIXUAN_ROOMS: ZoneRoom[] = [
  {
    id: 'taixuan_z_entrance', name: '太玄门·山门广场',
    description: '太玄门山门内的广场，数位弟子在此以超常速度演练步法，身影残影叠叠。广场中央有一块刻着行字的石碑，是太玄门祖师留下的真迹。',
    npcs: ['tz_gate_elder'], items: [],
    exits: [{ roomId: 'taixuan_z_training', label: '入(训练场)', direction: 'north' }],
    isSafe: true, isEntrance: true,
  },
  {
    id: 'taixuan_z_training', name: '太玄门·速度训练场',
    description: '专门用于修炼行字秘的训练场，地面上镶嵌着感应阵法，能记录弟子的速度数值。最快的纪录据说是掌门在三十年前留下的，至今无人打破。',
    npcs: ['tz_trainer'], items: ['ancient_scripture_fragment'],
    exits: [
      { roomId: 'taixuan_z_entrance', label: '出(山门)', direction: 'south' },
      { roomId: 'taixuan_z_archive', label: '进(秘籍阁)', direction: 'north' },
    ],
    isSafe: true,
  },
  {
    id: 'taixuan_z_archive', name: '太玄门·秘籍阁',
    description: '收藏太玄门历代修炼心得的秘籍阁，行字秘的部分章节封存于此。每逢弟子达到一定修为，方可借阅对应的章节。',
    npcs: ['tz_archive_keeper'], items: [],
    exits: [{ roomId: 'taixuan_z_training', label: '出(训练场)', direction: 'south' }],
    isSafe: true,
  },
];

// 摇光圣地Zone（门派）
const YAOGUAN_ROOMS: ZoneRoom[] = [
  {
    id: 'yaoguan_z_entrance', name: '摇光圣地·白玉广场',
    description: '以白玉铺就的宏大广场，四周矗立着数百根玉石神柱，其上雕刻着古皇时代的战斗图腾。广场中央有一株参天神树，树龄超万年，是圣地开创时即已存在的见证。',
    npcs: ['yg_greeter'], items: [],
    exits: [{ roomId: 'yaoguan_z_inner', label: '入(内院)', direction: 'north' }],
    isSafe: true, isEntrance: true,
  },
  {
    id: 'yaoguan_z_inner', name: '摇光圣地·修炼内院',
    description: '圣地弟子真正修炼之处。此处源力浓郁百倍于外界，每修炼一天相当于外界十天之功。院中有大量珍贵灵药，以及圣地专属的修炼神器辅助弟子锻炼。',
    npcs: ['yg_elder', 'yg_female_disciple'], items: ['source_crystal', 'divine_power_elixir'],
    exits: [
      { roomId: 'yaoguan_z_entrance', label: '出(广场)', direction: 'south' },
      { roomId: 'yaoguan_z_treasury', label: '进(宝库)', direction: 'east' },
    ],
    isSafe: true,
  },
  {
    id: 'yaoguan_z_treasury', name: '摇光圣地·宝库外厅',
    description: '圣地宝库的外厅，存放着历代弟子上缴的珍贵法宝和灵材。正式弟子每月可凭战功兑换相应的物资。宝库内层据说存放着圣地镇压气运的龙纹黑金鼎。',
    npcs: ['yg_treasury_guard'], items: ['golden_dragon_pill'],
    exits: [{ roomId: 'yaoguan_z_inner', label: '返(内院)', direction: 'west' }],
    isSafe: true,
  },
];

// 姬家Zone（门派）
const JI_FAMILY_ROOMS: ZoneRoom[] = [
  {
    id: 'ji_z_entrance', name: '姬家祖地·门廊',
    description: '姬家祖地的大门廊，空间似乎有些扭曲，这是长期施展虚空神通留下的影响。走廊两侧挂有姬家历代强者的画像，每一位都有着深邃而神秘的眼神。',
    npcs: ['ji_doorkeeper'], items: [],
    exits: [{ roomId: 'ji_z_void_training', label: '入(虚空训练场)', direction: 'north' }],
    isSafe: true, isEntrance: true,
  },
  {
    id: 'ji_z_void_training', name: '姬家祖地·虚空修炼台',
    description: '专门用于修炼虚空经的特殊区域，此处的空间被特意削薄，更容易感悟虚空之力。修炼者在此施展虚空神通，时常会看到空间裂缝闪烁。',
    npcs: ['ji_elder'], items: ['void_step_boots', 'source_crystal'],
    exits: [
      { roomId: 'ji_z_entrance', label: '出(门廊)', direction: 'south' },
      { roomId: 'ji_z_mirror_room', label: '进(虚空镜室)', direction: 'east' },
    ],
    isSafe: true,
  },
  {
    id: 'ji_z_mirror_room', name: '姬家祖地·虚空镜室',
    description: '存放姬家传世帝兵——虚空镜的密室。虚空镜以特殊阵法封印，只有得到家主认可的人才能接近。镜面上倒映着时间流逝的光景，神秘莫测。',
    npcs: ['ji_patriarch_guard'], items: [],
    exits: [{ roomId: 'ji_z_void_training', label: '返(修炼台)', direction: 'west' }],
    isSafe: false,
  },
];

// =================== 副本Zone ===================

// 源石矿禁区Zone
const SOURCE_MINE_ZONE_ROOMS: ZoneRoom[] = [
  {
    id: 'smz_entrance', name: '禁区入口',
    description: '源石矿禁区的入口，封印符文已被破解，散发出浑浊的源力。四周的矿石散发着异常的光芒。',
    npcs: ['smz_guard_beast'], items: ['source_stone'],
    exits: [{ roomId: 'smz_mid', label: '深入(矿道)', direction: 'north' }],
    isSafe: false, isEntrance: true,
  },
  {
    id: 'smz_mid', name: '矿道深层',
    description: '矿道越来越窄，四壁的源石越来越密集，散发的光芒也越来越强烈。地上有战斗留下的痕迹。',
    npcs: ['smz_stone_golem', 'smz_mine_beast'], items: ['source_crystal'],
    exits: [
      { roomId: 'smz_entrance', label: '返(入口)', direction: 'south' },
      { roomId: 'smz_boss', label: '继续(祭坛)', direction: 'north' },
    ],
    isSafe: false,
  },
  {
    id: 'smz_boss', name: '矿魂祭坛',
    description: '矿道尽头的巨大祭坛，一个由源石精华凝聚成的矿魂盘旋于祭坛之上，对入侵者充满敌意。',
    npcs: ['smz_boss_enemy'], items: [],
    exits: [{ roomId: 'smz_mid', label: '退(矿道)', direction: 'south' }],
    isSafe: false,
  },
];

// 帝陵副本Zone
const EMPEROR_DUNGEON_ZONE_ROOMS: ZoneRoom[] = [
  {
    id: 'edz_entrance', name: '帝陵前殿',
    description: '古帝陵的前殿，高大宏伟，神柱林立。禁制战甲在此自动巡逻，对任何入侵者发动攻击。',
    npcs: ['edz_armor_guard'], items: ['ancient_scripture_fragment'],
    exits: [{ roomId: 'edz_treasury', label: '深入(宝藏室)', direction: 'north' }],
    isSafe: false, isEntrance: true,
  },
  {
    id: 'edz_treasury', name: '宝藏储藏室',
    description: '帝陵的宝藏室，虽已被盗墓者多次光顾，仍有强力守卫护佑的珍宝留存。',
    npcs: ['edz_treasure_golem', 'edz_spirit'], items: ['source_crystal', 'dragon_blood'],
    exits: [
      { roomId: 'edz_entrance', label: '退(前殿)', direction: 'south' },
      { roomId: 'edz_main_tomb', label: '继续(主墓室)', direction: 'north' },
    ],
    isSafe: false,
  },
  {
    id: 'edz_main_tomb', name: '帝陵主墓室',
    description: '帝陵最深处，古帝棺椁高悬于此。古帝残留的意志凝聚成帝魂，以无尽的力量守护这里。',
    npcs: ['edz_emperor_soul'], items: [],
    exits: [{ roomId: 'edz_treasury', label: '退(宝藏室)', direction: 'south' }],
    isSafe: false,
  },
];

// =================== Zone NPC数据 ===================
export const ZONE_NPCS: Record<string, NPC> = {
  // 太玄门Zone NPC
  tz_gate_elder: {
    id: 'tz_gate_elder', name: '太玄门·守门长老',
    description: '守卫山门广场的太玄门长老，修炼行字秘已有数十年。',
    dialogue: ['欢迎来到太玄门，行字秘之道，在于极速之中领悟无极。', '想在太玄门修炼，先在训练场展示你的速度天赋。'],
    isHostile: false, hp: 1000, maxHp: 1000, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  tz_trainer: {
    id: 'tz_trainer', name: '太玄门·训练师',
    description: '专职训练新晋弟子速度的太玄门中层弟子，性格严厉。',
    dialogue: ['行字秘的第一层，先从感悟"迅"字开始，想象自己是一阵风。', '修炼速度神通，首先要放空心神，感受天地间速度的本质。'],
    isHostile: false, hp: 500, maxHp: 500, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  tz_archive_keeper: {
    id: 'tz_archive_keeper', name: '太玄门·秘籍阁守护者',
    description: '守护秘籍阁的老弟子，记忆力惊人，熟知每一本秘籍的位置和内容。',
    dialogue: ['行字秘共分九层，每一层的内容都由祖师以心血凝就，弥足珍贵。', '达到相应修为方可借阅，此乃规矩，不可破。'],
    isHostile: false, hp: 300, maxHp: 300, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },

  // 摇光圣地Zone NPC
  yg_greeter: {
    id: 'yg_greeter', name: '摇光圣地·迎宾弟子',
    description: '专门负责接待外来访客的圣地弟子，态度友善，举止优雅。',
    dialogue: ['欢迎来到摇光圣地，此乃东荒南域第一圣地，请举止端正，勿乱闯。', '若有意拜入圣地，需通过圣地考核方可。'],
    isHostile: false, hp: 200, maxHp: 200, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  yg_elder: {
    id: 'yg_elder', name: '摇光圣地·修炼长老',
    description: '负责指导弟子修炼的圣地长老，修为高深，古皇拳经已臻化境。',
    dialogue: ['古皇拳经，蕴含上古强者的战斗意志，修炼时需以心感悟，而非以力驱动。', '圣地弟子每日修炼两个时辰，坚持十年，定可有所成就。'],
    isHostile: false, hp: 3000, maxHp: 3000, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  yg_female_disciple: {
    id: 'yg_female_disciple', name: '摇光弟子·月华',
    description: '摇光圣地的优秀弟子，容貌绝美，修炼古皇拳经成就斐然。',
    dialogue: ['圣地的修炼资源是外界百倍，所以我们更要珍惜每一次修炼机会。', '听说叶凡出现在东荒……荒古圣体，那样的体质实在令人羡慕。'],
    isHostile: false, hp: 800, maxHp: 800, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  yg_treasury_guard: {
    id: 'yg_treasury_guard', name: '摇光宝库守卫',
    description: '守卫圣地宝库的强力弟子，无论何时都保持警惕。',
    dialogue: ['宝库非弟子不得随意进入，请出示你的弟子令牌。'],
    isHostile: false, hp: 1500, maxHp: 1500, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },

  // 姬家Zone NPC
  ji_doorkeeper: {
    id: 'ji_doorkeeper', name: '姬家·门廊守卫',
    description: '守卫姬家祖地大门的家族成员，能感知任何虚空波动。',
    dialogue: ['姬家祖地，非经允许不得擅入。', '虚空大帝的传承在此守护，任何企图盗取者皆难逃惩处。'],
    isHostile: false, hp: 800, maxHp: 800, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  ji_elder: {
    id: 'ji_elder', name: '姬家长老',
    description: '姬家的重要长老，虚空经修炼颇有成就，能随意撕裂空间。',
    dialogue: ['虚空经的修炼，在于理解空间的本质，空间并非不可穿越，而是需要找到缝隙。', '虚空大帝留下的传承，我等子孙有责任守护并发扬光大。'],
    isHostile: false, hp: 2500, maxHp: 2500, attack: 0, defense: 0, expReward: 0, goldReward: 0, drops: [],
  },
  ji_patriarch_guard: {
    id: 'ji_patriarch_guard', name: '姬家·虚空镜守卫',
    description: '守护虚空镜的精锐家族成员，使用虚空秘技，能瞬间移动应对威胁。',
    dialogue: ['虚空镜是家族至宝，未经家主许可，任何人不得接近！'],
    isHostile: true, hp: 3000, maxHp: 3000, attack: 180, defense: 150,
    expReward: 1000, goldReward: 200, drops: ['source_crystal', 'ancient_scripture_fragment'],
  },

  // 副本Zone NPC（敌对）
  smz_guard_beast: {
    id: 'smz_guard_beast', name: '禁区入口守卫兽',
    description: '体型庞大的矿石妖兽，守卫在禁区入口。',
    dialogue: ['（妖兽咆哮！）'],
    isHostile: true, hp: 180, maxHp: 180, attack: 32, defense: 25,    expReward: 60, goldReward: 12, drops: ['source_stone', 'qi_recovery_pill', 'rage_pill'],
   },
   smz_stone_golem: {
    id: 'smz_stone_golem', name: '矿道石傀',
    description: '由矿道中的源石精华凝聚成的傀儡，防御力惊人。',
    dialogue: ['（石傀沉默地举起石拳！）'],
    isHostile: true, hp: 350, maxHp: 350, attack: 50, defense: 45,    expReward: 120, goldReward: 25, drops: ['source_crystal', 'armor_pill'],
   },
   smz_mine_beast: {
    id: 'smz_mine_beast', name: '变异矿道妖兽',
    description: '吸收了大量源力，产生变异的矿道妖兽。',
    dialogue: ['（妖兽嚎叫！）'],
    isHostile: true, hp: 280, maxHp: 280, attack: 45, defense: 30,    expReward: 95, goldReward: 18, drops: ['source_stone', 'qi_recovery_pill', 'speed_pill'],
   },
   smz_boss_enemy: {
    id: 'smz_boss_enemy', name: '源石矿·矿魂',
    description: '数万年源力积聚而成的矿魂，有了意识，对外来入侵者极为敌视。',
    dialogue: ['（矿魂发出刺耳的鸣叫！）'],
    isHostile: true, hp: 1500, maxHp: 1500, attack: 80, defense: 60,    expReward: 500, goldReward: 80, drops: ['source_crystal', 'source_crystal', 'iron_helmet', 'qi_recovery_pill', 'crit_pill'],
   },
   edz_armor_guard: {
    id: 'edz_armor_guard', name: '禁制战甲',
    description: '以古代禁制驱动的铁甲守卫，自动攻击任何进入前殿的生物。',
    dialogue: ['（战甲自动激活！）'],
    isHostile: true, hp: 600, maxHp: 600, attack: 95, defense: 80,    expReward: 250, goldReward: 50, drops: ['ancient_scripture_fragment', 'armor_pill'],
   },
   edz_treasure_golem: {
    id: 'edz_treasure_golem', name: '宝藏守卫傀儡',
    description: '守护宝藏室的古代傀儡，以帝陵中残留的源力维持运转。',
    dialogue: ['（傀儡沉默地挡住去路！）'],
    isHostile: true, hp: 900, maxHp: 900, attack: 110, defense: 95,    expReward: 400, goldReward: 70, drops: ['source_crystal', 'ancient_scripture_fragment', 'regen_potion'],
   },
   edz_spirit: {
    id: 'edz_spirit', name: '帝陵守灵',
    description: '古代强者的意志残留，为守护主人的陵寝而战。',
    dialogue: ['（守灵对入侵者发出怒嚎！）'],
    isHostile: true, hp: 700, maxHp: 700, attack: 130, defense: 60,    expReward: 350, goldReward: 65, drops: ['dragon_blood', 'ancient_scripture_fragment', 'divine_pill'],
   },
   edz_emperor_soul: {
    id: 'edz_emperor_soul', name: '古帝残念·帝魂',
    description: '古帝生前修为的残留，凝聚成帝魂，守护主墓室。其中蕴含着古帝一生的修炼感悟，无比珍贵。',
    dialogue: ['敢入吾陵者，皆为吾之敌！（帝魂张目，神威浩荡！）'],
    isHostile: true, hp: 10000, maxHp: 10000, attack: 200, defense: 160,    expReward: 5000, goldReward: 800, drops: ['ancient_scripture_fragment', 'dragon_blood', 'black_gold_blade', 'forbidden_zone_map', 'berserk_pill'],
   },
};

// =================== Zone定义 ===================
export const ZONES: Record<string, Zone> = {
  taixuan_sect: {
    id: 'taixuan_sect', name: '太玄门', description: '行字秘传承之地，东荒速度第一门派。',
    rooms: TAIXUAN_ROOMS, entryRoomId: 'taixuan_z_entrance', exitRoomId: 'taixuan_z_entrance', type: 'sect',
  },
  yaoguan_sect: {
    id: 'yaoguan_sect', name: '摇光圣地', description: '东荒南域第一圣地，古皇传承所在。',
    rooms: YAOGUAN_ROOMS, entryRoomId: 'yaoguan_z_entrance', exitRoomId: 'yaoguan_z_entrance', type: 'sect',
  },
  ji_family_sect: {
    id: 'ji_family_sect', name: '姬家祖地', description: '虚空大帝传承，虚空经发源地。',
    rooms: JI_FAMILY_ROOMS, entryRoomId: 'ji_z_entrance', exitRoomId: 'ji_z_entrance', type: 'sect',
  },
  source_mine_dungeon: {
    id: 'source_mine_dungeon', name: '源石矿·禁区', description: '源石矿禁区副本，适合初级修炼者。',
    rooms: SOURCE_MINE_ZONE_ROOMS, entryRoomId: 'smz_entrance', exitRoomId: 'smz_entrance', type: 'dungeon', minLevel: 1,
  },
  emperor_dungeon: {
    id: 'emperor_dungeon', name: '荒古帝陵', description: '荒古帝王陵寝副本，适合高级修炼者。',
    rooms: EMPEROR_DUNGEON_ZONE_ROOMS, entryRoomId: 'edz_entrance', exitRoomId: 'edz_entrance', type: 'dungeon', minLevel: 25,
  },
};
