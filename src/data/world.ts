import { Room, NPC, Item } from '../types/game';
import { EQUIPMENT_ITEMS } from './equipment';
import { DUNGEON_ITEMS } from './dungeonItems';

// 神药商店物品
export const SHOP_ITEMS: Record<string, Item> = {
  // ── 普通消耗品（金叶购买）──
  shop_qi_pill: {
    id: 'shop_qi_pill', name: '聚元丹（商售）',
    description: '炼气士的常备丹药，服下后快速回复气血。',
    type: 'consumable', quality: 'white',
    hp: 120, goldPrice: 30, weight: 0, value: 30,
  },
  shop_mp_elixir: {
    id: 'shop_mp_elixir', name: '还神液（商售）',
    description: '以灵泉炼制，可快速补充神力。',
    type: 'consumable', quality: 'white',
    mp: 120, goldPrice: 35, weight: 0, value: 35,
  },
  shop_golden_pill: {
    id: 'shop_golden_pill', name: '紫金丹（商售）',
    description: '品质较高的回复丹药，气血神力双补。',
    type: 'consumable', quality: 'green',
    hp: 400, mp: 150, goldPrice: 200, weight: 0, value: 200,
  },
  shop_source_crystal: {
    id: 'shop_source_crystal', name: '源晶（商售）',
    description: '高纯度源力结晶，可作为修炼材料。',
    type: 'material', quality: 'white',
    goldPrice: 500, weight: 1, value: 200,
  },
  // ── 神药（源块购买）──
  phenomenon_reroll_pill: {
    id: 'phenomenon_reroll_pill',
    name: '混沌洗象丹',
    description: '传说中的神药，以混沌源石和万年灵乳炼制。服下后可散去当前苦海异象，重新觉醒新的异象。十次重修后仍不满意，可自行选择一次异象。',
    type: 'consumable',
    quality: 'orange',
    goldPrice: 0,
    yuankuaiPrice: 50,
    weight: 0,
    value: 0,
    specialEffect: '洗练苦海异象，重新随机觉醒',
  },
  phenomenon_choice_pill: {
    id: 'phenomenon_choice_pill',
    name: '天命择象丹',
    description: '天道所钟的神药，唯有完成十次散功重修者方可服用。服下后可自行选择一种苦海异象，终生不变。',
    type: 'consumable',
    quality: 'orange',
    goldPrice: 0,
    yuankuaiPrice: 200,
    weight: 0,
    value: 0,
    specialEffect: '解锁异象自选功能（需10次重修）',
  },
  protect_stone: {
    id: 'protect_stone', name: '保护符',
    description: '装备强化时使用，+4以上强化失败可防止降级。',
    type: 'consumable', quality: 'green',
    goldPrice: 2000, weight: 0, value: 500,
  },

  // ── 战斗丹药（金叶购买）──
  rage_pill: {
    id: 'rage_pill', name: '狂暴丹',
    description: '激发战斗潜能的丹药，短时间内攻击力暴涨。',
    type: 'consumable', quality: 'green',
    goldPrice: 100, weight: 0, value: 200,
    specialEffect: '攻击+30，持续3回合',
    consumableEffects: [
      { stat: 'attack', value: 30, duration: 3, icon: '⚔️', description: '攻击+30' },
    ],
  },
  armor_pill: {
    id: 'armor_pill', name: '铁甲丹',
    description: '以玄铁精华为引炼制的护体丹药，短时间内大幅提升防御。',
    type: 'consumable', quality: 'green',
    goldPrice: 100, weight: 0, value: 200,
    specialEffect: '防御+25，持续3回合',
    consumableEffects: [
      { stat: 'defense', value: 25, duration: 3, icon: '🛡️', description: '防御+25' },
    ],
  },
  speed_pill: {
    id: 'speed_pill', name: '风行丹',
    description: '以风灵草炼制的轻身丹药，身法如风行水上。',
    type: 'consumable', quality: 'green',
    goldPrice: 100, weight: 0, value: 250,
    specialEffect: '闪避+25，持续3回合',
    consumableEffects: [
      { stat: 'dodge', value: 25, duration: 3, icon: '💨', description: '闪避+25' },
    ],
  },
  crit_pill: {
    id: 'crit_pill', name: '破障丹',
    description: '破除修行障碍的奇丹，短时间内洞察力大增，暴击率飙升。',
    type: 'consumable', quality: 'blue',
    goldPrice: 300, weight: 0, value: 500,
    specialEffect: '暴击+20%，持续3回合',
    consumableEffects: [
      { stat: 'critRate', value: 20, duration: 3, icon: '🔮', description: '暴击+20%' },
    ],
  },
  regen_potion: {
    id: 'regen_potion', name: '回神液',
    description: '以多种灵药精炼而成的回复灵液，持续恢复体力。',
    type: 'consumable', quality: 'blue',
    goldPrice: 350, weight: 0, value: 350,
    hp: 80,
    specialEffect: '立即恢复80气血+每回合恢复30气血持续3回合',
    consumableEffects: [
      { stat: 'healPerTurn', value: 30, duration: 3, icon: '🌿', description: '每回合回血+30' },
    ],
  },
  divine_pill: {
    id: 'divine_pill', name: '神力丹',
    description: '凝练天地神力而成的极品丹药，短时间内战力暴增。',
    type: 'consumable', quality: 'purple',
    goldPrice: 800, weight: 0, value: 1500,
    specialEffect: '攻击+60、暴击+15%、防御+15，持续4回合',
    consumableEffects: [
      { stat: 'attack', value: 60, duration: 4, icon: '💥', description: '攻击+60' },
      { stat: 'critRate', value: 15, duration: 4, icon: '💥', description: '暴击+15%' },
      { stat: 'defense', value: 15, duration: 4, icon: '💥', description: '防御+15' },
    ],
  },
  berserk_pill: {
    id: 'berserk_pill', name: '燃血丹',
    description: '燃烧气血换取力量的禁忌丹药，攻击暴增但防御下降。',
    type: 'consumable', quality: 'purple',
    goldPrice: 800, weight: 0, value: 1200,
    specialEffect: '攻击+80、防御-10，持续4回合',
    consumableEffects: [
      { stat: 'attack', value: 80, duration: 4, icon: '🔥', description: '攻击+80' },
      { stat: 'defense', value: -10, duration: 4, icon: '🔥', description: '防御-10' },
    ],
  },
};

// 合并所有物品
export const ITEMS: Record<string, Item> = { ...EQUIPMENT_ITEMS, ...SHOP_ITEMS, ...DUNGEON_ITEMS };

// =================== 东荒南域地图 ===================
export const ROOMS: Record<string, Room> = {

  // ══════════════════════════════════════════════════
  // 新手区域：归元村（安全区·无怪物）
  // ══════════════════════════════════════════════════

  guiyuan_village: {
    id: 'guiyuan_village',
    name: '村口',
    description:
      '东荒南域深处一座宁静的小村庄，名曰归元村，是无数修炼者踏上大道的起点。村口立着一块古朴石碑，上书"道可道，非常道"。引路老人守在村口，专门迎接初入修炼界的新人。村中炊烟袅袅，偶有孩童追逐嬉戏，一派安宁祥和。',
    exits: [
      { direction: 'north', roomId: 'guiyuan_square', label: '北(村中广场)' },
      { direction: 'east', roomId: 'guiyuan_east_road', label: '东(村东小路)' },
      { direction: 'south', roomId: 'guiyuan_ferry', label: '南(渡口)' },
      { direction: 'west', roomId: 'guiyuan_west_field', label: '西(西侧田野)' },
      { direction: 'northeast', roomId: 'village_training_ground', label: '东北(野外练功)' },
    ],
    npcs: ['guide_elder', 'village_child'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 5, y: 8,
  },

  guiyuan_square: {
    id: 'guiyuan_square',
    name: '中央广场',
    description:
      '村庄中心的开阔广场，铺着青石板，中间有一口古井，井水清澈甘甜，据说饮之可安神定气。广场四周挂着各式告示，记录着村中大事、任务与外界消息。偶尔有修炼者在此盘膝而坐，感悟天地源力的流动。广场北侧可见一座简朴的宗祠。',
    exits: [
      { direction: 'south', roomId: 'guiyuan_village', label: '南(村口)' },
      { direction: 'north', roomId: 'guiyuan_ancestral_hall', label: '北(宗祠)' },
      { direction: 'east', roomId: 'guiyuan_grocery', label: '东(杂货铺)' },
      { direction: 'west', roomId: 'guiyuan_inn', label: '西(客栈)' },
    ],
    npcs: ['task_board_npc', 'wandering_elder_xu'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 5, y: 7,
  },

  guiyuan_ancestral_hall: {
    id: 'guiyuan_ancestral_hall',
    name: '宗祠',
    description:
      '归元村历代先祖的牌位供奉于此，香烟缭绕，庄严肃穆。宗祠内有一位年迈的修炼导师，专门为初入修炼界的新人传授基本功法与心得。墙上挂着一幅《东荒南域全图》，详细标注了各处要地。窗外微风轻抚，送来清新的草木气息。',
    exits: [
      { direction: 'south', roomId: 'guiyuan_square', label: '南(广场)' },
      { direction: 'east', roomId: 'guiyuan_training_ground', label: '东(演武场)' },
    ],
    npcs: ['cultivation_mentor', 'old_swordsman'],
    items: ['ancient_scripture_fragment'],
    isCity: true, isSafe: true, region: '归元村',
    x: 5, y: 6,
  },

  guiyuan_training_ground: {
    id: 'guiyuan_training_ground',
    name: '演武场',
    description:
      '村中供修炼者切磋演练的场地，地面留有各种交手痕迹，木桩上绑满了草靶。一位年轻武师在此指导村民练习基本拳脚功夫。演武场旁有兵器架，陈列着一些普通刀剑，供人取用练习。空气中弥漫着淡淡的血气与汗水的味道，这里见证了无数人踏上修炼之路的第一步。',
    exits: [
      { direction: 'west', roomId: 'guiyuan_ancestral_hall', label: '西(宗祠)' },
      { direction: 'north', roomId: 'guiyuan_blacksmith', label: '北(铁匠铺)' },
      { direction: 'south', roomId: 'guiyuan_east_road', label: '南(村东小路)' },
    ],
    npcs: ['wu_instructor', 'practice_dummy_guardian'],
    items: ['iron_rod'],
    isCity: true, isSafe: true, region: '归元村',
    x: 6, y: 6,
  },

  guiyuan_blacksmith: {
    id: 'guiyuan_blacksmith',
    name: '铁匠铺',
    description:
      '铁锤叮当之声不绝于耳，炉火熊熊燃烧，将整间铺子映得通红。铁匠老关是归元村最受欢迎的手艺人，打制的法器虽谈不上顶级，却结实耐用，适合初学者使用。铺子里挂满了各式工具和武器，墙角堆放着各种矿石原料。',
    exits: [
      { direction: 'south', roomId: 'guiyuan_training_ground', label: '南(演武场)' },
      { direction: 'west', roomId: 'guiyuan_medical_hall', label: '西(医馆)' },
    ],
    npcs: ['blacksmith_guan', 'ore_collector_npc'],
    items: ['iron_rod'],
    isCity: true, isSafe: true, region: '归元村',
    x: 6, y: 5,
  },

  guiyuan_medical_hall: {
    id: 'guiyuan_medical_hall',
    name: '草药医馆',
    description:
      '医馆内草药清香扑鼻，架上摆满了各式瓶瓶罐罐。坐诊的大夫是位白发老妪，人称"药婆"，精通草药之道，常年为村民免费诊治。她也兼售一些基础丹药，价格公道，是新人补给的最佳去处。壁上挂着一幅《本草图鉴》，记录了东荒常见灵药的特征与效用。',
    exits: [
      { direction: 'east', roomId: 'guiyuan_blacksmith', label: '东(铁匠铺)' },
      { direction: 'south', roomId: 'guiyuan_ancestral_hall', label: '南(宗祠)' },
      { direction: 'west', roomId: 'guiyuan_herb_garden', label: '西(药圃)' },
    ],
    npcs: ['medicine_granny', 'herb_apprentice'],
    items: ['qi_recovery_pill', 'qi_recovery_pill'],
    isCity: true, isSafe: true, region: '归元村',
    x: 5, y: 5,
  },

  guiyuan_herb_garden: {
    id: 'guiyuan_herb_garden',
    name: '药圃',
    description:
      '医馆后方的草药种植园，种植着数十种常见灵药。一排排整齐的药畦延伸至远处，嫩绿的草叶上还挂着晨露。偶尔有蝴蝶飞过，留下一缕清香。药圃旁有一处清泉，泉水中含有微量源力，是天然的灵水，据说用于浇灌灵药效果极佳，修炼者喝了也能神清气爽。',
    exits: [
      { direction: 'east', roomId: 'guiyuan_medical_hall', label: '东(医馆)' },
      { direction: 'north', roomId: 'guiyuan_west_field', label: '北(西侧田野)' },
    ],
    npcs: ['herb_tender', 'spring_spirit_npc'],
    items: ['qi_recovery_pill'],
    isCity: true, isSafe: true, region: '归元村',
    x: 4, y: 5,
  },

  guiyuan_grocery: {
    id: 'guiyuan_grocery',
    name: '杂货铺',
    description:
      '归元村最热闹的商铺，店主王婶是个爽朗的中年妇人，经营着从生活用品到基本修炼材料的各类杂货。货架上琳琅满目，从普通草药到简单的修炼材料应有尽有，价格亲民，是新人采购的首选。店内常有修炼者聚集聊天，交流各类消息。',
    exits: [
      { direction: 'west', roomId: 'guiyuan_square', label: '西(广场)' },
      { direction: 'north', roomId: 'guiyuan_inn', label: '北→(客栈方向绕道)' },
      { direction: 'east', roomId: 'guiyuan_east_road', label: '东(村东小路)' },
    ],
    npcs: ['shopkeeper_wang', 'traveling_merchant'],
    items: ['qi_recovery_pill', 'source_stone', 'iron_rod'],
    isCity: true, isSafe: true, region: '归元村',
    x: 6, y: 7,
  },

  guiyuan_inn: {
    id: 'guiyuan_inn',
    name: '归元客栈',
    description:
      '村中唯一的客栈，名为"归元"，取归根复命之意。客栈内部布置简朴却温馨，修炼者可在此休息恢复，也可与来自各地的过路人交流见闻。掌柜是个中年男人，见多识广，手边常备一壶好茶，总愿意和客人侃上几句东荒的奇闻异事。',
    exits: [
      { direction: 'east', roomId: 'guiyuan_square', label: '东(广场)' },
      { direction: 'north', roomId: 'guiyuan_teahouse', label: '北(茶室)' },
      { direction: 'south', roomId: 'guiyuan_west_field', label: '南(西侧田野方向)' },
    ],
    npcs: ['innkeeper_li', 'resting_cultivator'],
    items: ['qi_recovery_pill'],
    isCity: true, isSafe: true, region: '归元村',
    x: 4, y: 7,
  },

  guiyuan_teahouse: {
    id: 'guiyuan_teahouse',
    name: '天地茶室',
    description:
      '客栈顶楼的雅室，推窗可见连绵山脉与茫茫平原，景色开阔。茶室内飘着淡淡的灵茶香气，据说用天泉水泡制，能安神定志，辅助修炼。一位颇有来历的说书先生常驻于此，为往来之人讲述东荒历史与遮天世界的传奇人物，口才极佳，令听者如身临其境。',
    exits: [
      { direction: 'south', roomId: 'guiyuan_inn', label: '南(客栈)' },
    ],
    npcs: ['storyteller_bard', 'tea_master'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 4, y: 6,
  },

  guiyuan_east_road: {
    id: 'guiyuan_east_road',
    name: '村东小路',
    description:
      '连接归元村与外界的主要道路，路边种植着高大的古树，枝叶茂盛，为行人遮挡风雨。小路延伸向东，隐约可见远处的修炼者在赶路。路旁有一块刻满文字的界碑，标注着归元村安全范围的边界。老猎人常在此处坐守，向来人介绍外界的危险与注意事项。',
    exits: [
      { direction: 'west', roomId: 'guiyuan_village', label: '西(村口)' },
      { direction: 'north', roomId: 'guiyuan_grocery', label: '北(杂货铺)' },
      { direction: 'south', roomId: 'guiyuan_training_ground', label: '南(演武场方向)' },
      { direction: 'east', roomId: 'donghuang_plain', label: '东(出发→东荒旷野)' },
    ],
    npcs: ['veteran_hunter', 'boundary_guard'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 6, y: 8,
  },

  guiyuan_west_field: {
    id: 'guiyuan_west_field',
    name: '西侧田野',
    description:
      '归元村西边的一片宽阔田野，微风吹过，绿浪翻涌。远处有几位村民在耕作，偶尔抬头望向天空，神色安然。田野边缘有一棵数百年的大槐树，树荫浓密，常有老人在树下打坐调息。据说这棵槐树根植于一处天然灵脉之上，在树下修炼效果比平常更佳。',
    exits: [
      { direction: 'east', roomId: 'guiyuan_village', label: '东(村口)' },
      { direction: 'north', roomId: 'guiyuan_inn', label: '北(客栈方向)' },
      { direction: 'south', roomId: 'guiyuan_herb_garden', label: '南(药圃)' },
    ],
    npcs: ['meditating_elder_tree', 'farm_cultivator'],
    items: ['source_stone'],
    isCity: true, isSafe: true, region: '归元村',
    x: 4, y: 8,
  },

  guiyuan_ferry: {
    id: 'guiyuan_ferry',
    name: '归元渡口',
    description:
      '村南的一处渡口，清澈的溪流在此缓缓流淌，水面倒映着天光云影。一艘古朴的木船停在岸边，船夫是个头戴斗笠的老人，据说在此摆渡已有数十年。渡口旁有一面石壁，布满了历代过客的题刻留言，记录着无数修炼者离开归元村、踏上征途时的感慨。',
    exits: [
      { direction: 'north', roomId: 'guiyuan_village', label: '北(村口)' },
      { direction: 'east', roomId: 'guiyuan_south_pavilion', label: '东(南岸凉亭)' },
    ],
    npcs: ['ferryman_old', 'departing_adventurer'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 5, y: 9,
  },

  guiyuan_south_pavilion: {
    id: 'guiyuan_south_pavilion',
    name: '送别亭',
    description:
      '渡口东岸矗立着一座六角凉亭，名曰"送别亭"，是历来修炼者辞别师友、踏入东荒之前的最后一处安歇之所。亭中有石桌石凳，桌上常置一壶免费的茶水，供行人歇脚。亭柱上刻着前人留下的诗句："归元一别路漫漫，此去东荒莫回头。"亭外即是荒野，可隐约看见东荒南域的苍茫大地向远处延伸。',
    exits: [
      { direction: 'west', roomId: 'guiyuan_ferry', label: '西(渡口)' },
      { direction: 'north', roomId: 'guiyuan_east_road', label: '北(村东小路)' },
    ],
    npcs: ['pavilion_hermit', 'sect_recruiter'],
    items: [],
    isCity: true, isSafe: true, region: '归元村',
    x: 6, y: 9,
  },

  // 新手练功区：村外野外（低危险）
  village_training_ground: {
    id: 'village_training_ground',
    name: '练功场',
    description:
      '归元村东北方向的野外空地，是新修炼者理想的练功场所。这里栖息着一些温顺的小型妖兽，虽然具有攻击性但实力不强，非常适合初入修炼界的新人练手。空地上有几块被击碎的大石，显然曾有修炼者在此练功。',
    exits: [
      { direction: 'southwest', roomId: 'guiyuan_village', label: '西南(归元村)' },
    ],
    npcs: ['wild_rabbit', 'plain_chicken', 'forest_goblin'],
    items: ['qi_recovery_pill'],
    isCity: false, isSafe: false, region: '东荒南域', danger: 1,
    x: 6, y: 7,
  },

  // 起始区域：太玄门外围（原第一个区域，现作为进阶区）
  donghuang_plain: {
    id: 'donghuang_plain',
    name: '旷野',
    description:
      '东荒大地，天地磅礴。眼前是一片苍茫旷野，远处隐约可见太玄山脉的轮廓。脚下的土地散发着浓郁的天地源力，修炼者踏上此地便能感受到源力涌动。天边有几只妖鸟盘旋，羽翼张开时遮天蔽日。',
    exits: [
      { direction: 'north', roomId: 'taixuan_gate', label: '北(太玄门外)' },
      { direction: 'east', roomId: 'market_town', label: '东(集镇)' },
      { direction: 'south', roomId: 'ancient_forest', label: '南(古林)' },
      { direction: 'west', roomId: 'source_mine', label: '西(源石矿)' },
    ],
    npcs: ['wandering_cultivator', 'mortal_traveler'],
    items: ['source_stone'],
    isCity: false, isSafe: true, region: '东荒南域',
    x: 5, y: 5,
  },

  taixuan_gate: {
    id: 'taixuan_gate',
    name: '山门',
    description:
      '巍峨的山门矗立于此，门上"太玄"二字苍劲有力。山门两侧守卫的弟子身着灰色道袍，目光如电。远处山峰云雾缭绕，隐约传来风字秘的呼啸之声，速度之快令人难以置信。这里是太玄门的大本营，行字秘的发源地。',
    exits: [
      { direction: 'south', roomId: 'donghuang_plain', label: '南(旷野)' },
      { direction: 'north', roomId: 'taixuan_inner', label: '北(太玄内院)' },
      { direction: 'east', roomId: 'market_town', label: '东(集镇)' },
    ],
    npcs: ['taixuan_disciple', 'taixuan_gate_guard'],
    items: [],
    isCity: false, isSafe: true, region: '东荒南域',
    x: 5, y: 4,
  },

  taixuan_inner: {
    id: 'taixuan_inner',
    name: '内院',
    description:
      '内院是太玄门真正传授行字秘之处。院中有几位弟子以超凡之速演练步法，身影残影叠叠，如闪电穿梭。一位面容清矍的长老端坐于石台之上，闭目运功，身周隐有流光萦绕。',
    exits: [
      { direction: 'south', roomId: 'taixuan_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'taixuan_forbidden', label: '北(禁地)' },
    ],
    npcs: ['taixuan_elder', 'taixuan_senior_disciple'],
    items: ['ancient_scripture_fragment'],
    isCity: false, isSafe: true, region: '东荒南域',
    x: 5, y: 3,
  },

  taixuan_forbidden: {
    id: 'taixuan_forbidden',
    name: '太玄禁地',
    description:
      '太玄门最深处的禁地，行字秘完整版本据说封存于此。空气中充斥着难以言喻的压迫感，仿佛时间在此流动得更快。一道道残影在虚空中闪烁，那是历代太玄门强者留下的意志。',
    exits: [
      { direction: 'south', roomId: 'taixuan_inner', label: '南(内院)' },
    ],
    npcs: ['taixuan_zhangmen_npc', 'spirit_beast_guardian'],
    items: [],
    isCity: false, isSafe: false, region: '东荒南域', danger: 5,
    x: 5, y: 2,
  },

  market_town: {
    id: 'market_town',
    name: '源石坊',
    description:
      '东荒南域唯一的大型集散地，各地修炼者汇聚于此交流，买卖源石、丹药、法宝。街道两旁的摊位鳞次栉比，有人高声叫卖，有人低头鉴别源石。偶尔传来的爆鸣声是有人当场切割源石，引得周围一阵叫好。',
    exits: [
      { direction: 'west', roomId: 'donghuang_plain', label: '西(旷野)' },
      { direction: 'north', roomId: 'taixuan_gate', label: '北(太玄门)' },
      { direction: 'east', roomId: 'yaoguan_road', label: '东(摇光圣地方向)' },
      { direction: 'south', roomId: 'ancient_forest_edge', label: '南(古林边缘)' },
    ],
    npcs: ['stone_merchant_duan', 'alchemy_master', 'weapon_dealer', 'info_broker'],
    items: ['qi_recovery_pill', 'source_stone', 'iron_rod'],
    isCity: true, isSafe: true, region: '东荒南域',
    x: 6, y: 4,
  },

  ancient_forest: {
    id: 'ancient_forest',
    name: '神木深处',
    description:
      '这片古林存在了数万年，树木高耸入云，遮天蔽日。林中积聚着大量的天地精华，吸引了众多妖兽栖居。时常有修炼者在此历练，但也时常有人一去不返。林中深处据说有一株九转仙草，众多强者争夺。',
    exits: [
      { direction: 'north', roomId: 'donghuang_plain', label: '北(旷野)' },
      { direction: 'south', roomId: 'forbidden_zone_ruins', label: '南(禁地遗迹)' },
      { direction: 'east', roomId: 'ancient_forest_edge', label: '东(林边)' },
    ],
    npcs: ['forest_demon_beast', 'ancient_tree_spirit', 'grave_robber_npc'],
    items: ['dragon_blood', 'source_crystal'],
    isCity: false, isSafe: false, region: '东荒南域', danger: 3,
    x: 5, y: 6,
  },

  ancient_forest_edge: {
    id: 'ancient_forest_edge',
    name: '神木边缘',
    description:
      '神木林的边缘地带，时常有胆大的年轻修炼者在此附近历练。林边有几株千年古树，树身周围有淡淡的光芒流动，那是天地精华积聚的表现。几只小妖兽在草丛中打闹嬉戏，并不害怕人类。',
    exits: [
      { direction: 'north', roomId: 'market_town', label: '北(集镇)' },
      { direction: 'west', roomId: 'ancient_forest', label: '西(古林深处)' },
      { direction: 'east', roomId: 'yaoguan_road', label: '东(摇光圣地方向)' },
    ],
    npcs: ['young_demon_fox', 'herb_collector'],
    items: ['source_stone', 'qi_recovery_pill'],
    isCity: false, isSafe: true, region: '东荒南域', danger: 1,
    x: 6, y: 5,
  },

  source_mine: {
    id: 'source_mine',
    name: '源矿外围',
    description:
      '此地地表裸露着大量源石，是东荒南域著名的矿脉所在。每日都有无数修炼者和采矿者在此劳作。偶尔深挖下去，会发现品质极佳的源晶，甚至有人在此挖出过蕴含古生物的绝世源石。矿道四通八达，通向更深处。',
    exits: [
      { direction: 'east', roomId: 'donghuang_plain', label: '东(旷野)' },
      { direction: 'west', roomId: 'source_mine_deep', label: '西(矿道深处)' },
      { direction: 'north', roomId: 'desolate_ruins', label: '北(荒古遗迹)' },
    ],
    npcs: ['mine_worker', 'source_stone_thief'],
    items: ['source_stone', 'source_stone', 'source_crystal'],
    isCity: false, isSafe: true, region: '东荒南域', danger: 1,
    x: 4, y: 5,
  },

  source_mine_deep: {
    id: 'source_mine_deep',
    name: '深层矿道',
    description:
      '矿道延伸向地下深处，四壁嵌满了品质不一的源石，散发着微弱的光芒。越往深处，天地源力越浓郁，但也越危险。有些修炼者在此遭遇了地下妖兽的袭击，尸骨至今仍留在矿道中。',
    exits: [
      { direction: 'east', roomId: 'source_mine', label: '东(矿道出口)' },
    ],
    npcs: ['underground_beast', 'stone_golem', 'trapped_cultivator'],
    items: ['source_crystal', 'dragon_blood', 'source_stone'],
    isCity: false, isSafe: false, region: '东荒南域', danger: 4,
    x: 3, y: 5,
  },

  desolate_ruins: {
    id: 'desolate_ruins',
    name: '遗迹外围',
    description:
      '不知何年留下的古代遗迹，断壁残垣之中还留有古代文字。此处曾是一个繁荣的古代王朝，后来在一场惊天大战中覆灭。遗迹中偶有强者的印记留存，每逢特定时机会浮现出来。',
    exits: [
      { direction: 'south', roomId: 'source_mine', label: '南(源石矿)' },
      { direction: 'north', roomId: 'ancient_emperor_tomb', label: '北(古帝陵)' },
    ],
    npcs: ['ruins_ghost', 'ruin_keeper_beast'],
    items: ['ancient_scripture_fragment', 'source_crystal'],
    isCity: false, isSafe: false, region: '东荒南域', danger: 6,
    x: 4, y: 4,
  },

  ancient_emperor_tomb: {
    id: 'ancient_emperor_tomb',
    name: '帝陵外围',
    description:
      '上古帝王的陵寝，外围已有无数盗墓者光顾，但内部的封印依然完好。陵寝外围弥漫着死气，偶尔有古代强者残留的战斗意志在虚空中显化，令弱者肝胆俱裂。据说段德曾多次光顾此地。',
    exits: [
      { direction: 'south', roomId: 'desolate_ruins', label: '南(荒古遗迹)' },
    ],
    npcs: ['emperor_tomb_guardian', 'ancient_zombie'],
    items: ['forbidden_zone_map', 'ancient_scripture_fragment'],
    isCity: false, isSafe: false, region: '东荒南域', danger: 8,
    x: 4, y: 3,
  },

  yaoguan_road: {
    id: 'yaoguan_road',
    name: '圣地山道',
    description:
      '通往摇光圣地的山道，两侧是高耸入云的山峰，路途险峻。山道上不时有圣地弟子巡逻，外人轻易不得进入。云雾中隐约可见圣地建筑的金顶，散发着神圣的光芒。道路旁有石碑，上书"摇光圣地，外人止步"。',
    exits: [
      { direction: 'west', roomId: 'market_town', label: '西(集镇)' },
      { direction: 'east', roomId: 'yaoguan_outer', label: '东(圣地外围)' },
    ],
    npcs: ['yaoguan_patrol', 'yaoguan_shengzi_npc'],
    items: [],
    isCity: false, isSafe: true, region: '东荒南域', danger: 2,
    x: 7, y: 4,
  },

  yaoguan_outer: {
    id: 'yaoguan_outer',
    name: '圣地广场',
    description:
      '摇光圣地外围的宏大广场，以白玉铺就，洁白如雪。圣地弟子在此修炼，个个气度不凡，散发着强大的气息。广场中央有一棵参天神木，据说是圣地开创之时即已存在，树龄已逾万年。',
    exits: [
      { direction: 'west', roomId: 'yaoguan_road', label: '西(山道)' },
      { direction: 'north', roomId: 'forbidden_zone_ruins', label: '北(禁区遗迹)' },
    ],
    npcs: ['yaoguan_inner_disciple', 'yaoguan_female_cultivator'],
    items: ['source_crystal'],
    isCity: false, isSafe: true, region: '东荒南域', danger: 3,
    x: 8, y: 4,
  },

  forbidden_zone_ruins: {
    id: 'forbidden_zone_ruins',
    name: '古矿外围',
    description:
      '七大生命禁区之一——太初古矿的外围区域。此地弥漫着怪异的气息，连天地源力都显得扭曲异常。强大的存在在矿中沉睡，轻易激怒它们可能引来灭顶之灾。许多圣体修炼者专程来此寻找淬炼肉身的神材。',
    exits: [
      { direction: 'south', roomId: 'ancient_forest', label: '南(古林)' },
      { direction: 'east', roomId: 'yaoguan_outer', label: '东(摇光圣地)' },
    ],
    npcs: ['forbidden_zone_creature', 'saint_body_seeker'],
    items: ['dragon_blood', 'source_crystal'],
    isCity: false, isSafe: false, region: '东荒南域·禁区', danger: 7,
    x: 7, y: 6,
  },

  // ──────────────────────────────────────────────
  // 中州神城区域
  // ──────────────────────────────────────────────
  central_city_entrance: {
    id: 'central_city_entrance',
    name: '神城南门',
    description: '中州神城是东荒最繁华的城池，城墙高耸入云，以神金铸就，散发着不朽的光芒。南门处人来人往，各色商旅、修炼者络绎不绝。城门口有卫兵把守，严格检查进出者的身份。',
    exits: [
      { direction: 'north', roomId: 'central_city_square', label: '北(中央广场)' },
      { direction: 'south', roomId: 'donghuang_plain', label: '南(东荒旷野)' },
    ],
    npcs: ['city_guard', 'city_merchant'],
    items: [],
    isCity: true, isSafe: true, region: '中州神城',
    x: 10, y: 8,
  },

  central_city_square: {
    id: 'central_city_square',
    name: '神城广场',
    description: '神城的核心区域，一座巨大的喷泉矗立于广场中央，泉水呈现出淡淡的金色，据说是用源液浇灌而成。广场四周店铺林立，各大宗门的产业在此都能找到。远处可见拍卖行、竞技场、交易所等重要建筑。',
    exits: [
      { direction: 'south', roomId: 'central_city_entrance', label: '南(南门)' },
      { direction: 'east', roomId: 'central_city_arena', label: '东(竞技场)' },
      { direction: 'west', roomId: 'central_city_auction', label: '西(拍卖行)' },
      { direction: 'north', roomId: 'central_city_temple', label: '北(城主府)' },
      { direction: 'up', roomId: 'central_city_market', label: '上(交易所)' },
    ],
    npcs: ['city_official', 'traveling_sage'],
    items: [],
    isCity: true, isSafe: true, region: '中州神城',
    x: 10, y: 7,
  },

  central_city_market: {
    id: 'central_city_market',
    name: '交易所',
    description: '三楼是神城最热闹的交易所，无数商人在此叫卖，各类珍稀物品应有尽有。从基础丹药到顶级功法，从普通装备到圣兵碎片，只要出得起价，没有买不到的东西。交易所中央有一块巨大的公示板，实时更新着各类物品的成交价格。',
    exits: [
      { direction: 'down', roomId: 'central_city_square', label: '下(广场)' },
    ],
    npcs: ['exchange_master', 'rare_item_merchant'],
    items: ['source_crystal', 'golden_dragon_pill'],
    isCity: true, isSafe: true, region: '中州神城',
    x: 10, y: 6,
  },

  central_city_auction: {
    id: 'central_city_auction',
    name: '拍卖行',
    description: '神城最大的拍卖行，每日举办小型拍卖会，定期举办大型拍卖盛会。内部装饰奢华，以神玉铺地，以源晶为灯。拍卖师是位绝代佳人，声音能传遍整个大厅，据说她的声音本身也蕴含着某种魅惑之力。',
    exits: [
      { direction: 'east', roomId: 'central_city_square', label: '东(广场)' },
    ],
    npcs: ['auction_master', 'wealthy_collector'],
    items: ['ancient_scripture_fragment'],
    isCity: true, isSafe: true, region: '中州神城',
    x: 9, y: 7,
  },

  central_city_arena: {
    id: 'central_city_arena',
    name: '竞技场',
    description: '神城最热血沸腾的地方，一座巨大的圆形竞技场矗立于此。竞技场四周设有看台，可容纳十万观众。每逢比赛日，各路高手在此对决，胜者可获得丰厚奖励和赫赫威名。场中央的沙地上，还残留着历代强者的战斗痕迹。',
    exits: [
      { direction: 'west', roomId: 'central_city_square', label: '西(广场)' },
    ],
    npcs: ['arena_master', 'pvp_champion', 'arena_registration_npc'],
    items: [],
    isCity: true, isSafe: true, region: '中州神城',
    x: 11, y: 7,
  },

  central_city_temple: {
    id: 'central_city_temple',
    name: '城主府',
    description: '城主府是神城最高的建筑，俯瞰全城。府内供奉着历代城主的神像，他们都是东荒赫赫有名的强者。城主府也是发布大型悬赏任务的地方，完成了这些任务，不仅能获得丰厚奖励，还能获得神城的官方认可。',
    exits: [
      { direction: 'south', roomId: 'central_city_square', label: '南(广场)' },
    ],
    npcs: ['city_lord', 'mission_board_npc'],
    items: [],
    isCity: true, isSafe: true, region: '中州神城',
    x: 10, y: 6,
  },

  // ──────────────────────────────────────────────
  // 天妖山脉区域
  // ──────────────────────────────────────────────
  demon_beast_mountain_entrance: {
    id: 'demon_beast_mountain_entrance',
    name: '妖山山脚',
    description: '天妖山脉横亘于东荒中部，山势险峻，常年云雾缭绕。此地是妖族聚集之地，无数妖兽在此繁衍生息。修炼者来此历练需格外小心，但若能活着回去，实力必有长进。山脚下有一座妖界集市，妖与人在此交易，颇为奇特。',
    exits: [
      { direction: 'north', roomId: 'demon_beast_mountain_trail', label: '北(山道)' },
      { direction: 'south', roomId: 'donghuang_plain', label: '南(东荒旷野)' },
    ],
    npcs: ['demon_merchant', 'mountain_guide'],
    items: [],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 5,
    x: 12, y: 5,
  },

  demon_beast_mountain_trail: {
    id: 'demon_beast_mountain_trail',
    name: '蜿蜒山道',
    description: '山道蜿蜒曲折，两侧是茂密的古林，不时有妖兽的嚎叫声传来。林间古树上盘踞着各色妖禽，时不时俯冲下来袭击路人。据说山中深处藏有上古妖帝的遗迹，无数强者为此趋之若鹜。',
    exits: [
      { direction: 'south', roomId: 'demon_beast_mountain_entrance', label: '南(山脚)' },
      { direction: 'north', roomId: 'demon_beast_mountain_depths', label: '北(山脉深处)' },
      { direction: 'east', roomId: 'demon_beast_cavern_entrance', label: '东(妖王洞穴)' },
    ],
    npcs: ['mountain_demon', 'demon_eagle'],
    items: ['source_stone', 'dragon_blood'],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 6,
    x: 12, y: 4,
  },

  demon_beast_cavern_entrance: {
    id: 'demon_beast_cavern_entrance',
    name: '洞穴入口',
    description: '一座巨大的天然洞穴，洞口刻满了妖文，散发着恐怖的气息。洞穴深处盘踞着一位千年妖王，以山脉中的天地精华滋养自身。无数挑战者进入洞穴，能活着出来的寥寥无几。',
    exits: [
      { direction: 'west', roomId: 'demon_beast_mountain_trail', label: '西(山道)' },
      { direction: 'north', roomId: 'demon_beast_cavern_depths', label: '北(洞穴深处)' },
    ],
    npcs: ['cave_guardian_spirit'],
    items: [],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 7,
    x: 13, y: 4,
  },

  demon_beast_cavern_depths: {
    id: 'demon_beast_cavern_depths',
    name: '洞穴深处',
    description: '洞穴越往深处越宽阔，岩壁上镶嵌着散发幽光的源晶。空气中弥漫着浓郁的妖气，令人窒息。洞穴最深处，一只巨大的熊妖盘踞于此，它的身躯堪比小山，眼中闪烁着智慧的光芒。',
    exits: [
      { direction: 'south', roomId: 'demon_beast_cavern_entrance', label: '南(洞穴入口)' },
    ],
    npcs: ['thousand_year_bear_demon'],
    items: ['dragon_blood', 'demon_beast_core'],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 9,
    x: 13, y: 3,
  },

  demon_beast_mountain_depths: {
    id: 'demon_beast_mountain_depths',
    name: '妖山核心',
    description: '山脉最深处，天地源力浓郁得几乎凝成实质。此地的妖兽都是远古异种，实力惊人。据说山脉深处藏有一处上古妖帝的道场，无数强者来此探险，希望能获得妖帝传承。',
    exits: [
      { direction: 'south', roomId: 'demon_beast_mountain_trail', label: '南(山道)' },
      { direction: 'north', roomId: 'demon_emperor_site', label: '北(妖帝遗迹)' },
    ],
    npcs: ['ancient_demon_spirit', 'demon_phoenix'],
    items: ['demon_beast_core', 'source_crystal'],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 8,
    x: 12, y: 3,
  },

  demon_emperor_site: {
    id: 'demon_emperor_site',
    name: '妖帝遗迹',
    description: '上古妖帝的道场遗址，散发着亘古的气息。虽已荒废多年，但残留的阵法依然强大，阻挡着一切入侵者。遗迹中偶有强者留下的感悟，对修炼妖道功法的修炼者大有裨益。',
    exits: [
      { direction: 'south', roomId: 'demon_beast_mountain_depths', label: '南(核心区域)' },
    ],
    npcs: ['emperor_spirit_remnant'],
    items: ['ancient_scripture_fragment', 'demon_beast_core'],
    isCity: false, isSafe: false, region: '天妖山脉', danger: 10,
    x: 12, y: 2,
  },

  // ──────────────────────────────────────────────
  // 古皇战场区域
  // ──────────────────────────────────────────────
  ancient_emperor_battlefield_entrance: {
    id: 'ancient_emperor_battlefield_entrance',
    name: '战场外围',
    description: '古皇战场是遮天世界最神秘的地方之一，传说这里埋葬着数位古皇的残躯。战场上空乌云密布，电闪雷鸣，残留的战斗意志在虚空中激荡。无数强者来此寻觅古皇传承，但大多葬身于此。',
    exits: [
      { direction: 'north', roomId: 'ancient_emperor_battlefield_core', label: '北(战场核心)' },
      { direction: 'south', roomId: 'donghuang_plain', label: '南(东荒旷野)' },
    ],
    npcs: ['battlefield_scout', 'ghost_warrior'],
    items: [],
    isCity: false, isSafe: false, region: '古皇战场', danger: 7,
    x: 8, y: 2,
  },

  ancient_emperor_battlefield_core: {
    id: 'ancient_emperor_battlefield_core',
    name: '战场核心',
    description: '战场最深处，古皇的残躯散发出镇压天地的威压。这里的天地规则都已扭曲，弱者根本无法生存。偶尔能见到古皇生前留下的战斗痕迹，每一道痕迹都蕴含着毁天灭地的力量。',
    exits: [
      { direction: 'south', roomId: 'ancient_emperor_battlefield_entrance', label: '南(外围)' },
      { direction: 'north', roomId: 'emperor_remains_shrine', label: '北(皇陵神殿)' },
    ],
    npcs: ['ghost_emperor', 'ancient_sage_spirit'],
    items: ['emperor_blood', 'ancient_scripture_fragment'],
    isCity: false, isSafe: false, region: '古皇战场', danger: 9,
    x: 8, y: 1,
  },

  emperor_remains_shrine: {
    id: 'emperor_remains_shrine',
    name: '陵寝神殿',
    description: '古皇陨落后，残躯化为一座神殿，散发着永恒不朽的气息。神殿中供奉着古皇的遗物和传承，每隔万年会有一次显化，能有缘获得传承者，必将成为新一代的绝顶强者。',
    exits: [
      { direction: 'south', roomId: 'ancient_emperor_battlefield_core', label: '南(战场核心)' },
    ],
    npcs: ['emperor_guardian_spirit'],
    items: ['emperor_blood', 'ancient_scripture_fragment', 'emperor_artifact'],
    isCity: false, isSafe: false, region: '古皇战场', danger: 10,
    x: 8, y: 0,
  },
};

// =================== NPC数据 ===================
export const NPCS: Record<string, NPC> = {

  // ──────────────────────────────────────────────
  // 归元村·功能性NPC
  // ──────────────────────────────────────────────

  guide_elder: {
    id: 'guide_elder',
    name: '引路老人·玄通',
    description: '守在村口数十年的白须老人，眼神慈祥而深邃，专门迎接初涉修炼之道的年轻人。据说他年轻时也是一方豪杰，如今甘愿在此引导后辈。',
    dialogue: [
      '孩子，欢迎来到归元村。这里是东荒南域许多修炼者踏上大道的起点。',
      '修炼之道，第一步是开辟苦海，打通命泉，往后才有飞升成仙的可能。',
      '村中有许多长辈可以指点你：广场上有任务布告栏，宗祠里有修炼导师，杂货铺可以购置物资。',
      '往东的小路出了村子，便是东荒南域的旷野，那里有妖兽出没，准备好了再去。',
      '切记：归元村是安全之地，村外则处处险机。量力而行，方能走得长远。',
      '如若迷路，回到村中找我，我为你指引方向。祝你道途顺遂，小友。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（境界不可测）',
  },

  village_child: {
    id: 'village_child',
    name: '村中顽童',
    description: '在村口玩耍的孩子，好奇心旺盛，见到陌生的修炼者便跑过来打招呼。',
    dialogue: [
      '哇，你是来修炼的吗？我长大了也要修炼！',
      '引路爷爷说，修炼的人都很厉害，能飞天遁地！',
      '村里的药婆说，向南走到渡口，对面就是大世界。好想去看看啊！',
      '铁匠老关叔叔打的刀最好看了，闪闪发光的！',
    ],
    isHostile: false, hp: 20, maxHp: 20, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [],
  },

  task_board_npc: {
    id: 'task_board_npc',
    name: '告示栏管理员·小吴',
    description: '负责管理广场告示栏的年轻人，总是忙忙碌碌地整理各种布告与任务委托。',
    dialogue: [
      '告示栏上贴着各种委托，有收集草药的、探查地形的，完成后都有金叶报酬。',
      '最近东荒旷野上出现了一种新型妖兽，有人出高价委托强者前去讨伐。',
      '想要接任务？先熟悉村子，把基本功练扎实了再说。',
      '告示栏每天更新，重要消息我都会贴出来，别忘了常来看看。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 3,
  },

  wandering_elder_xu: {
    id: 'wandering_elder_xu',
    name: '游历前辈·徐老',
    description: '一位走遍东荒大地的老修炼者，修为深厚却从不张扬，常在广场边的石凳上静坐，乐于和后辈分享经验。',
    dialogue: [
      '东荒南域虽然危机四伏，却也是机遇最多的地方，自古多少天骄从此崛起。',
      '我年轻时也是从归元村出发，一路历经无数磨难，方才到达今日境界。',
      '修炼切忌急于求成，基础功法要打牢，根基深厚才能走得更远。',
      '遮天世界，强者如林。哪怕你现在微不足道，只要坚持道心不灭，终有一日可问鼎苍穹。',
      '轮海、道宫、四极、化龙、仙台——每一步都是蜕变。记住，突破前务必做足准备。',
    ],
    isHostile: false, hp: 800, maxHp: 800, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 60,
    realm: '化龙·中期',
  },

  cultivation_mentor: {
    id: 'cultivation_mentor',
    name: '修炼导师·苦行僧',
    description: '驻守宗祠的修炼导师，是一位在苦海境界打坐冥想数十年的老僧，精通各种初级修炼之法，免费为新人传授修炼心得。',
    dialogue: [
      '修炼之始，先开苦海。你的苦海就是你的根基，根基越稳，日后成就越高。',
      '打坐冥想是最基本的修炼方式。心静则源力自来，急躁则事倍功半。',
      '你的苦海异象决定了你修炼的天赋特性，每个人的异象都是独一无二的，珍视它。',
      '轮海境界分为：苦海、命泉、神桥、彼岸四小境，圆满之后才能突破到道宫境界。',
      '若想加速修炼，可服用丹药，或在天地源力充沛之处打坐，事半功倍。',
      '记住：功法是外力，悟道才是真谛。死记功法，不如体悟天地之道。',
    ],
    isHostile: false, hp: 500, maxHp: 500, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 40,
    realm: '道宫·后期',
  },

  old_swordsman: {
    id: 'old_swordsman',
    name: '老剑客·云行',
    description: '曾游历四方的剑客，如今在宗祠颐养天年，偶尔向有缘人传授一招半式。手边的古剑已不出鞘，但那股剑意仍然凌厉。',
    dialogue: [
      '剑道无巅，唯有不断前行。我这一把剑，见过东荒三百年的风云变幻。',
      '孩子，你初来修炼，先把基础夯实，别想着一步登天。',
      '战斗中，攻防要兼顾。一味猛攻容易被反制，一味防守则坐以待毙。',
      '我这把剑已经很久没见过足以令它出鞘的对手了……也罢，且等着吧。',
    ],
    isHostile: false, hp: 3000, maxHp: 3000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 80,
    realm: '仙台·中期',
  },

  wu_instructor: {
    id: 'wu_instructor',
    name: '武术教头·铁牛',
    description: '归元村演武场的武术教头，身材魁梧，肌肉虬结，声如洪钟。虽然修为普通，但拳脚功夫扎实，专门指导新人练习基础战斗技巧。',
    dialogue: [
      '来来来，先练基础拳！修炼者打架不只靠源力，基础的战斗意识同样重要！',
      '战斗时注意观察对手的规律，找到破绽再出手，盲目出击往往吃亏。',
      '妖兽一般有攻击前摇，看准时机闪避或格挡，能大幅减少伤害。',
      '体力是一切的基础，每天坚持练习，你会发现自己越来越强。',
      '想用技能？先把基础功法修炼扎实。功法熟练了，技能威力才能最大化。',
    ],
    isHostile: false, hp: 300, maxHp: 300, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 12,
    realm: '轮海·神桥·中期',
  },

  practice_dummy_guardian: {
    id: 'practice_dummy_guardian',
    name: '看场弟子·阿虎',
    description: '负责看管演武场器械的少年，热情活泼，总是跃跃欲试地想和人切磋。',
    dialogue: [
      '要借木桩练拳吗？随便用！不过用完了记得把草靶修好啊。',
      '教头的拳法可厉害了，我跟他学了三年，感觉才入了点门。',
      '那边的兵器架上有普通铁剑和木棍，新人可以直接取用练习。',
    ],
    isHostile: false, hp: 150, maxHp: 150, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 5,
  },

  blacksmith_guan: {
    id: 'blacksmith_guan',
    name: '铁匠·老关',
    description: '归元村的铁匠，手艺精湛，能将普通铁矿打造成堪用的法器。虽不及大城市的法宝铺，但物美价廉，深受修炼者喜爱。',
    dialogue: [
      '打铁需趁热，修炼也一样，趁年轻打好基础，老了就来不及咯。',
      '你带着矿石来？好说好说，我给你打一件趁手的家伙什儿。',
      '我打了一辈子铁，见过的法器不计其数。真正好的法宝，得靠修炼者自己和它产生共鸣。',
      '武器磨损了记得来找我修缮，价格公道，童叟无欺。',
    ],
    isHostile: false, hp: 200, maxHp: 200, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 15,
  },

  ore_collector_npc: {
    id: 'ore_collector_npc',
    name: '矿石收购商·大柱',
    description: '专门收购矿石原料的商人，常驻铁匠铺旁边，对各类矿石都有所了解。',
    dialogue: [
      '源石、铁矿、铜矿，我都收！价格绝对公道，比集镇那边还实在！',
      '东边旷野上有不少源石，有胆子去捡的话，带回来我都收。',
      '品质好的源晶可值钱了，要是挖到了别贱卖，先来问我价格。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 3,
  },

  medicine_granny: {
    id: 'medicine_granny',
    name: '药婆·陈氏',
    description: '白发苍苍的草药大夫，在归元村行医数十年，经验丰富，慈眉善目。免费为村民诊治，也向修炼者售卖基础丹药。',
    dialogue: [
      '孩子，初次修炼最容易气血紊乱，多备几粒聚元丹以备不时之需。',
      '草药不比丹药那般猛烈，胜在稳当。有些草药泡水喝，修炼效果也不错。',
      '身体是修炼的本钱，别为了快速突破而强行催逼，伤了根基得不偿失。',
      '有受伤的话来找我，皮外伤我都能处理，不收钱。',
      '西边药圃里的灵泉，喝了能神清气爽，每日可去喝一杯，对修炼有益。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '道宫·中期',
  },

  herb_apprentice: {
    id: 'herb_apprentice',
    name: '药童·小莲',
    description: '跟随药婆学习草药知识的年轻女孩，眼神灵动，对草药充满热情。',
    dialogue: [
      '药婆说，认识草药是修炼者的基本功，找对药材事半功倍。',
      '我正在学习分辨东荒的灵草，好多种类都长得很像，真难区分呢。',
      '聚元丹是用聚元草提炼的，村西边的药圃就种了不少，你可以去看看。',
    ],
    isHostile: false, hp: 60, maxHp: 60, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 2,
  },

  herb_tender: {
    id: 'herb_tender',
    name: '药圃看守·老伯',
    description: '负责照料药圃的老农，对草药的种植之道颇有心得，性格憨厚。',
    dialogue: [
      '药圃里的灵草都是药婆的心血，不可随意采摘，有需要找药婆购买。',
      '这边的土地下面有天然灵脉，种出来的草药比外面野生的品质好上一截。',
      '西边那口清泉是天然灵水，修炼者可以来喝，但别污染它。',
    ],
    isHostile: false, hp: 80, maxHp: 80, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 2,
  },

  spring_spirit_npc: {
    id: 'spring_spirit_npc',
    name: '灵泉精怪',
    description: '药圃灵泉中孕育的小精怪，通体晶莹剔透，如同一捧流动的泉水。它从不伤人，只是在灵泉旁嬉戏，为来汲水的修炼者带来好运。',
    dialogue: [
      '叮咚叮咚——（灵泉精怪欢快地跳动，似乎在欢迎你。）',
      '（精怪凑近你，好奇地用水做的小手指戳了戳你，随即吐出一串水泡。）',
      '叮——（精怪指了指灵泉，似乎在邀请你喝水。）',
    ],
    isHostile: false, hp: 50, maxHp: 50, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [],
  },

  shopkeeper_wang: {
    id: 'shopkeeper_wang',
    name: '杂货铺主·王婶',
    description: '归元村杂货铺的老板娘，精明能干，笑容爽朗。经营着修炼者日常所需的各类物资，价格公道，从不坑骗新人。',
    dialogue: [
      '来来来，新到货的聚元丹，品质上乘！',
      '修炼者出门在外，多备些消耗品才安心，万一遇上强敌，能救命的！',
      '源石这东西，我们村收购价比集镇稍低，但胜在方便，不用跑那么远。',
      '你是新来的吧？头几次出门别走太远，先在村子附近熟悉熟悉，稳健才是长久之道。',
      '有什么需要尽管说，我这里基本上什么都有，价格绝对实惠。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 5,
  },

  traveling_merchant: {
    id: 'traveling_merchant',
    name: '过路商人·方老爷',
    description: '走南闯北的行脚商人，带着满满一驼车的货物路过归元村，顺便在此歇脚售货。见多识广，常带来外界最新的消息。',
    dialogue: [
      '我刚从中州那边过来，听说东荒最近有大事要发生，各方圣地都蠢蠢欲动。',
      '摇光圣地传来消息，圣子下山历练，所经之处天骄纷纷折服，了不得！',
      '叶凡那个小子……哎呀，不得了，荒古圣体，这可是远古时代才有的体质啊。',
      '我这里有些从外地带来的稀罕货，感兴趣的话可以看看，数量不多，卖完就没了。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 8,
  },

  innkeeper_li: {
    id: 'innkeeper_li',
    name: '客栈掌柜·老李',
    description: '归元客栈的掌柜，人到中年，性格豪爽，见多识广。常年经营客栈，接待过各方来客，肚子里装满了东荒各地的奇闻异事。',
    dialogue: [
      '客官，要住店还是就此歇歇脚？茶水免费，住宿另收金叶。',
      '我这客栈开了二十年，见过的修炼者多了去了。有些人来时还是懵懂少年，走时已是一方豪杰。',
      '东荒南域的修炼圣地，除了摇光圣地和太玄门，还有姬家、紫府、蒋家、妖族等势力，个个底蕴深厚。',
      '你若疲惫了，在此歇息片刻，养足精神再出发。心急是修炼者最大的敌人。',
      '楼上茶室的老说书先生今天又要讲故事了，感兴趣可以上去听听，他口才极好。',
    ],
    isHostile: false, hp: 150, maxHp: 150, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 10,
  },

  resting_cultivator: {
    id: 'resting_cultivator',
    name: '歇脚修炼者',
    description: '在客栈内休息的修炼者，看样子刚从外面历练归来，神色疲惫但满足。',
    dialogue: [
      '外面妖兽真不少，我在旷野上转了一圈，打了好几场架，总算安全回来了。',
      '修炼这条路，必须要经历磨砺，光在安全区打坐可成不了强者。',
      '不过也别急，先把修为打牢，有把握了再往危险的地方去。',
    ],
    isHostile: false, hp: 200, maxHp: 200, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 8,
    realm: '轮海·命泉·后期',
  },

  storyteller_bard: {
    id: 'storyteller_bard',
    name: '说书先生·云游子',
    description: '游历天下的说书人，据说曾亲历遮天世界的无数大事，将其化为故事讲给世人听。声音浑厚，口才极佳，听其讲述，如身临其境。',
    dialogue: [
      '话说那荒古时代，有位先古圣体，以一己之力镇压八方，开创了一个时代……',
      '叶凡，从地球而来的普通少年，却觉醒了荒古圣体，从此踏上了一条震古烁今的修炼之路。',
      '东荒南域，古往今来不知孕育了多少天骄。而今日，或许轮到你了，年轻人。',
      '遮天大世界，宏观则有无数星辰大陆，微观则有无数修炼体系，每一种皆可成就无上强者。',
      '想听哪段故事？我这肚子里装着几百年的传说与历史，讲个三天三夜也不带重样的。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（境界不明）',
  },

  tea_master: {
    id: 'tea_master',
    name: '茶道师·静心',
    description: '茶室的泡茶师傅，一袭素衣，举止优雅，据说他泡的灵茶有助于修炼者平复心境、提升感悟。',
    dialogue: [
      '一杯灵茶，可安浮躁之心。修炼者最忌心浮气躁，茶可平之。',
      '天地茶室用的是山中清泉与灵叶，每日限量供应，请慢用。',
      '修炼如品茶，须细细感悟，急于求成则如牛饮，失了滋味。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
  },

  veteran_hunter: {
    id: 'veteran_hunter',
    name: '老猎人·赵七',
    description: '在归元村东小路守了多年的老猎人，走遍了附近山林，对东荒南域的地形与妖兽习性了如指掌，常向新人介绍外界情况。',
    dialogue: [
      '出了这条界碑，就是东荒南域的旷野，妖兽随处可见，别大意。',
      '旷野上最常见的是低阶妖兽，对初入修炼的人有些威胁，但不至于致命，小心应对就行。',
      '别小看那些小妖兽，它们往往成群出现，单只好对付，多了就麻烦了。',
      '往东是集镇，那儿有专业的药师和武器商，东西比村里齐全，就是得走上一段路。',
      '我年轻时进过太初古矿的外围，差点没命……那地方，没到道宫境界别去。',
    ],
    isHostile: false, hp: 300, maxHp: 300, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 18,
    realm: '轮海·彼岸·中期',
  },

  boundary_guard: {
    id: 'boundary_guard',
    name: '界碑守卫',
    description: '驻守归元村边界的年轻守卫，尽职尽责，提醒每一个出村的人注意安全。',
    dialogue: [
      '出村请注意安全，村外的妖兽可不会客气。',
      '若遇到太危险的情况，立刻返回村中，硬撑只会送命。',
      '界碑以内是安全区域，妖兽不会进来。界碑以外……就靠你自己了。',
    ],
    isHostile: false, hp: 250, maxHp: 250, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 10,
  },

  meditating_elder_tree: {
    id: 'meditating_elder_tree',
    name: '槐树下老修士',
    description: '在大槐树下打坐冥想的老修士，几乎常年如此，有人走近时才缓缓睁眼，神色平和如水。',
    dialogue: [
      '这棵槐树下天地源力汇聚，在此打坐修炼，比一般地方快上三成。',
      '修炼不必急于求成，坐于此处，感悟天地，心中自有答案。',
      '你若愿意，可在此树下打坐修炼，老夫不介意做个伴。',
      '日月轮转，源力流动，修炼者须与天地同呼吸，方能事半功倍。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 70,
    realm: '化龙·圆满',
  },

  farm_cultivator: {
    id: 'farm_cultivator',
    name: '田间修炼者·阿春',
    description: '一边耕作一边修炼的年轻人，认为劳作与修炼并不矛盾，脸上总带着憨厚的笑容。',
    dialogue: [
      '修炼嘛，哪里不能修炼？我锄地的时候也在感悟大地源力。',
      '田野里的源力虽然稀薄，但胜在纯净，适合打基础。',
      '有时候我也去旷野历练，但我更喜欢这里。安静，踏实。',
    ],
    isHostile: false, hp: 150, maxHp: 150, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 6,
    realm: '轮海·命泉·中期',
  },

  ferryman_old: {
    id: 'ferryman_old',
    name: '摆渡老船夫',
    description: '在归元渡口撑船数十年的老人，斗笠遮面，言语不多，但每一句都耐人寻味。据说他年轻时也是一代豪杰，如今甘心在此摆渡，送人远行。',
    dialogue: [
      '要渡河吗？上船便是，老夫送你过去。',
      '这条溪流看似平静，实则下面暗流涌动，就像修炼之道，外表平稳，内里险象环生。',
      '多少英雄豪杰从这渡口出发，有人名震天下，有人再也没有回来。',
      '无论你将来去往何处，记住归元村永远是你的起点，也是你心中的归处。',
      '年轻人，去吧。修炼之路，非走不可。老夫在此等你衣锦还乡。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（深不可测）',
  },

  departing_adventurer: {
    id: 'departing_adventurer',
    name: '即将出发的冒险者',
    description: '整装待发、即将离开归元村的年轻修炼者，眼神中充满期待与忐忑。',
    dialogue: [
      '我终于决定出发了！在村子里待了够久了，是时候去外面闯荡。',
      '听说摇光圣地最近在招募弟子，我想去碰碰运气。',
      '你也是刚到的吧？好好准备，等你准备好了，我们也许会在东荒某处再见。',
      '村里的老人说，出了归元村就没有退路了……但我不信，路是自己走出来的！',
    ],
    isHostile: false, hp: 150, maxHp: 150, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 5,
    realm: '轮海·苦海·圆满',
  },

  pavilion_hermit: {
    id: 'pavilion_hermit',
    name: '送别亭·隐士',
    description: '常驻送别亭的神秘隐士，年龄难以判断，总是静静地坐在亭中，凝视着远方的东荒大地，偶尔对过往的修炼者留下一两句意味深长的话语。',
    dialogue: [
      '每一个从此亭离去的人，都带走了不同的梦想与决心。',
      '东荒南域，前方或是荣耀，或是死亡。你准备好了吗？',
      '别急着离开，多看看这片土地。也许将来回望，这才是你最美好的时光。',
      '道阻且长，行则将至。去吧，年轻人，属于你的时代正在等待。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（不可窥测）',
  },

  sect_recruiter: {
    id: 'sect_recruiter',
    name: '门派招募使者',
    description: '代表各大门派在送别亭设点招募弟子的使者，手持六面旗帜，分别绘着摇光、太玄、姬家、紫府、蒋家、妖族的徽记。',
    dialogue: [
      '有志于加入门派的修炼者，可来与我谈谈。六大势力各有千秋，适合不同天赋的修炼者。',
      '摇光圣地以神通秘术闻名，太玄门以行字秘速度著称，各有所长。',
      '姬家以龙华圣功传世，紫府秘境以阵法见长，蒋家以肉身淬炼立威，妖族以妖功独步东荒。',
      '想加入哪个门派，你自己想清楚。选择了便要全力修炼，莫要三心二意。',
      '当然，先达到足够的修为，各门派才会正式收你。初来乍到，先把基础修炼好。',
    ],
    isHostile: false, hp: 200, maxHp: 200, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
    realm: '轮海·彼岸·后期',
  },

  // 友善NPC
  // 新手练功区怪物
  wild_rabbit: {
    id: 'wild_rabbit',
    name: '野兔',
    description: '村外草丛中的一只野兔，肉质鲜嫩。',
    dialogue: ['（兔子蹦跳着逃跑）'],
    isHostile: true, hp: 20, maxHp: 20, attack: 5, defense: 2,
    expReward: 8, goldReward: 1,
    drops: ['qi_recovery_pill'],
    level: 1,
  },

  plain_chicken: {
    id: 'plain_chicken',
    name: '山鸡',
    description: '东荒旷野中常见的一种野鸡，羽毛华丽。',
    dialogue: ['（山鸡扑棱着翅膀）'],
    isHostile: true, hp: 30, maxHp: 30, attack: 8, defense: 3,
    expReward: 15, goldReward: 2,
    drops: ['qi_recovery_pill', 'source_stone'],
    level: 1,
  },

  forest_goblin: {
    id: 'forest_goblin',
    name: '林间小妖',
    description: '刚刚开启灵智的低级小妖，喜欢捉弄过路人。',
    dialogue: ['嘿嘿，送上门的猎物！'],
    isHostile: true, hp: 50, maxHp: 50, attack: 12, defense: 5,
    expReward: 25, goldReward: 5,
    drops: ['qi_recovery_pill', 'source_stone', 'iron_rod'],
    level: 2,
  },

  wandering_cultivator: {
    id: 'wandering_cultivator',
    name: '游历修炼者',
    description: '一位看起来资历不浅的修炼者，眼神中透着对道的追求。',
    dialogue: [
      '东荒的天地源力极为浑厚，是修炼的绝佳之地。',
      '我在轮海境界已停留多年，一直无法突破命泉，唉。',
      '听说摇光圣地最近招收外门弟子，不知你是否有意？',
      '太玄门的行字秘确实名不虚传，我曾见过太玄门弟子施展，快得像一道闪电。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 5,
    realm: '轮海·命泉·中期',
  },

  mortal_traveler: {
    id: 'mortal_traveler',
    name: '凡人旅人',
    description: '一个普通的旅行商人，对修炼世界知之甚少。',
    dialogue: [
      '这东荒之地，修炼者多如牛毛，凡人只能小心行事啊。',
      '源石坊的东西越来越贵了，寻常百姓哪里买得起。',
      '我是从中州来的，带些货物来卖。听说东荒的源石最好，是真的吗？',
    ],
    isHostile: false, hp: 50, maxHp: 50, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [],
  },

  taixuan_disciple: {
    id: 'taixuan_disciple',
    name: '太玄弟子',
    description: '太玄门的普通外门弟子，修炼着基础行字秘。',
    dialogue: [
      '行字秘入门第一步，便是感悟速度之极限。想象自己化为一道光，无形无相。',
      '太玄门弟子以速度著称，但速度不是目的，速度是手段。真正的强者，一剑便已定胜负。',
      '修炼行字秘需要极高的感知和速度资质，师兄说我悟性还差一截。',
      '段德那个混蛋，居然盗取了我太玄门的行字秘残卷，此仇不共戴天！',
    ],
    isHostile: false, hp: 200, maxHp: 200, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 8,
    realm: '轮海·神桥·初期',
  },

  taixuan_gate_guard: {
    id: 'taixuan_gate_guard',
    name: '太玄门守卫',
    description: '镇守山门的太玄门弟子，武功不弱。',
    dialogue: [
      '外来者止步。非太玄门弟子，不得擅入内院。',
      '想拜入太玄门？去找山门登记，证明你有足够的速度天赋。',
      '这里是太玄门山门，闲人勿扰。',
    ],
    isHostile: false, hp: 350, maxHp: 350, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 12,
  },

  taixuan_elder: {
    id: 'taixuan_elder',
    name: '太玄门长老·风行',
    description: '太玄门德高望重的长老，精通行字秘，速度已达化境。',
    dialogue: [
      '行字秘，一字一法，九九归一，速度之极乃是行字之真谛。',
      '年轻人，你来此是想修行速度之道吗？先证明你的诚意。',
      '我太玄门立于东荒数千年，靠的不是外物，是行字秘那一字之奥妙。',
    ],
    isHostile: false, hp: 2000, maxHp: 2000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 45,
    realm: '四极·后期',
  },

  taixuan_senior_disciple: {
    id: 'taixuan_senior_disciple',
    name: '太玄大师兄',
    description: '太玄门首席弟子，行字秘已得七分真谛，速度惊人。',
    dialogue: [
      '我在太玄内院十年，行字秘已修炼至第七层，但距离至高境界仍差之甚远。',
      '外来弟子若想修炼行字秘，先通过我的考验再说。',
    ],
    isHostile: false, hp: 800, maxHp: 800, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 25,
  },

  stone_merchant_duan: {
    id: 'stone_merchant_duan',
    name: '段德',
    description: '江湖中臭名昭著的盗墓贼，自称"阴阳师"，实则精通盗墓之术。一脸贪婪笑容，手里摩挲着一块源石，眼神精明狡诈。',
    dialogue: [
      '嘿嘿，小友，我段某人虽然名声不好听，但做买卖绝对公道。',
      '源石鉴定？这是我的专长！给五枚金叶，保证给你鉴定出原石中有没有宝贝。',
      '太玄门那边最近查得很严，行字秘的事……咳咳，我啥也不知道。',
      '听说不死山最近有异动，估计那边有好东西。有胆子的可以去看看，当然，能不能活着回来就不保证了。',
      '哎，我悄悄告诉你，东边有个古帝陵，里面的东西……那可是价值连城啊！',
    ],
    isHostile: false, hp: 500, maxHp: 500, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
    realm: '轮海·彼岸·后期',
  },

  alchemy_master: {
    id: 'alchemy_master',
    name: '炼丹师·药老',
    description: '须发皆白的老炼丹师，手边摆着各式丹药，丹炉不停燃烧。',
    dialogue: [
      '老夫炼丹六十年，见过的灵药多了去了，你想要什么丹药，说来听听。',
      '聚元丹是入门丹药，年轻人服之可加快修炼速度，价格公道。',
      '真正好的丹药，需要上等灵药为引，那种灵药可不是寻常地方能找到的。',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 60,
  },

  weapon_dealer: {
    id: 'weapon_dealer',
    name: '法宝商人',
    description: '专门买卖各级法宝的商人，眼力极好，一眼便能看出法宝品质。',
    dialogue: [
      '上好的法宝，价格公道。从凡器到王者神兵，应有尽有。',
      '圣兵和帝兵？那种东西不是买卖的，都是传承宝物，哪里轻易出现在市面上。',
      '你手里那件法宝……嗯，成色不错，我出个好价格收了如何？',
    ],
    isHostile: false, hp: 100, maxHp: 100, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 15,
  },

  info_broker: {
    id: 'info_broker',
    name: '消息贩子',
    description: '游走于集镇各处的消息贩子，什么情报都卖。',
    dialogue: [
      '消息！最新消息！摇光圣地圣子现身东荒，据说在寻找什么上古传承！',
      '姬家的龙华圣子正在周游东荒，听说是来这边寻找大机缘的。',
      '叶凡！地球来的那个叶凡！就在东荒！据说他修炼了荒古圣体，正横扫天骄！',
      '太初古矿最近有异动，里面沉睡的古代生物好像有苏醒的迹象，各大圣地都派人监视了。',
    ],
    isHostile: false, hp: 50, maxHp: 50, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 5,
  },

  yaoguan_patrol: {
    id: 'yaoguan_patrol',
    name: '摇光巡逻弟子',
    description: '摇光圣地的巡逻队成员，个个修为不低。',
    dialogue: [
      '摇光圣地的山道，外来者不可随意进入。',
      '若有事要拜访圣地，先去集镇登记，圣地自有人接待。',
      '我等奉命巡逻山道，闲人勿扰。',
    ],
    isHostile: false, hp: 400, maxHp: 400, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 15,
  },

  yaoguan_shengzi_npc: {
    id: 'yaoguan_shengzi_npc',
    name: '摇光圣子',
    description: '摇光圣地的圣子，气质出众，眼神深邃而神秘。据传他还有另一个身份，是各方势力争相结交的对象。',
    dialogue: [
      '东荒天地，强者如林。能在此间立足，须有过人之处才行。',
      '荒古圣体……这样的体质，在上古也是绝世存在。',
      '我摇光圣地，向来只看实力，不论出身。若有真本事，自然有机会结交。',
    ],
    isHostile: false, hp: 5000, maxHp: 5000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '四极·后期',
  },

  yaoguan_inner_disciple: {
    id: 'yaoguan_inner_disciple',
    name: '摇光内门弟子',
    description: '摇光圣地内门弟子，修炼古皇拳经，气血浑厚。',
    dialogue: [
      '圣地的内门弟子每日修炼时间都排得满满当当，连睡觉的时间都少。',
      '这里的修炼资源比外界多出百倍，难怪圣地弟子修炼速度那么快。',
    ],
    isHostile: false, hp: 600, maxHp: 600, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
  },

  yaoguan_female_cultivator: {
    id: 'yaoguan_female_cultivator',
    name: '摇光女修',
    description: '摇光圣地的女弟子，容貌绝美，气质高雅，实力却不容小觑。',
    dialogue: [
      '摇光圣地对女弟子同样严格，若无真才实学，在圣地是混不下去的。',
      '东荒的这场盛会，各方天骄都会现身，届时必有一番龙争虎斗。',
    ],
    isHostile: false, hp: 500, maxHp: 500, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 18,
  },

  herb_collector: {
    id: 'herb_collector',
    name: '草药采集者',
    description: '一位在林边采集草药的年轻人，神色有些惶恐。',
    dialogue: [
      '林子里今天有妖兽出没，大家最好小心一点。',
      '我在这里采药已经三年了，林边的草药快被我采光了，得往里面走走。',
    ],
    isHostile: false, hp: 80, maxHp: 80, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 3,
  },

  mine_worker: {
    id: 'mine_worker',
    name: '采矿者',
    description: '在源石矿劳作的普通人，满身尘土。',
    dialogue: [
      '今天运气不错，挖到了几块中等品质的源石。',
      '矿道深处最近有动静，听说有妖兽出现，不少人不敢进去了。',
    ],
    isHostile: false, hp: 60, maxHp: 60, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: ['source_stone'], level: 2,
  },

  grave_robber_npc: {
    id: 'grave_robber_npc',
    name: '盗墓者',
    description: '鬼鬼祟祟的盗墓者，背着沉重的包袱，神色紧张。',
    dialogue: [
      '嘘！别出声，我刚从古帝陵里出来，后面有守墓的妖兽追着。',
      '这古林里据说埋着一位上古强者，我来找传承，没想到差点丢了性命。',
    ],
    isHostile: false, hp: 120, maxHp: 120, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: ['ancient_scripture_fragment'], level: 7,
  },

  trapped_cultivator: {
    id: 'trapped_cultivator',
    name: '被困修炼者',
    description: '一位深陷矿道，被妖兽所困的修炼者，神色狼狈。',
    dialogue: [
      '快帮帮我！我在深层矿道遭遇了石傀，跑不掉了！',
      '我有源晶，只要你帮我脱困，我全给你！',
    ],
    isHostile: false, hp: 150, maxHp: 150, attack: 0, defense: 0,
    expReward: 100, goldReward: 50, drops: ['source_crystal'], level: 8,
  },

  saint_body_seeker: {
    id: 'saint_body_seeker',
    name: '圣体修炼者·叶凡',
    description: '一个看似普通却气质特殊的年轻人，眼神沉静而深邃。肌肤隐隐散发着金色光芒，传说他拥有荒古圣体。',
    dialogue: [
      '禁区中蕴含着上古强者留下的修炼资源，危险与机缘并存。',
      '荒古圣体，以肉身为道……我还有很长的路要走。',
      '太初古矿中，我感受到了一股熟悉的气息，难道是……',
    ],
    isHostile: false, hp: 3000, maxHp: 3000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '轮海·彼岸·后期',
  },

  // =================== 敌对NPC ===================
  forest_demon_beast: {
    id: 'forest_demon_beast',
    name: '林中妖兽',
    description: '一头体型庞大的妖兽，皮糙肉厚，在古林中横行。',
    dialogue: ['（妖兽怒吼！）'],
    isHostile: true, hp: 200, maxHp: 200, attack: 35, defense: 20,
    expReward: 80, goldReward: 10,
    drops: ['dragon_blood', 'source_stone', 'qi_recovery_pill'],
    level: 5,
  },

  ancient_tree_spirit: {
    id: 'ancient_tree_spirit',
    name: '千年树精',
    description: '在古林中孕育千年的树灵，化为人形，守护着这片古林。',
    dialogue: ['（树精怒目而视，以树根攻击！）'],
    isHostile: true, hp: 500, maxHp: 500, attack: 55, defense: 40,
    expReward: 200, goldReward: 30,
    drops: ['source_crystal', 'dragon_blood', 'wood_divine_power'],
    level: 12,
  },

  young_demon_fox: {
    id: 'young_demon_fox',
    name: '幼年妖狐',
    description: '刚刚化形不久的小妖狐，战斗力弱，但速度不慢。',
    dialogue: ['（妖狐嗥叫！）'],
    isHostile: true, hp: 80, maxHp: 80, attack: 20, defense: 8,
    expReward: 30, goldReward: 5,
    drops: ['source_stone', 'qi_recovery_pill'],
    level: 2,
  },

  source_stone_thief: {
    id: 'source_stone_thief',
    name: '源石盗贼',
    description: '在矿场附近打劫的盗贼，趁机抢夺矿工的劳动成果。',
    dialogue: ['把源石留下，不然别怪我动手！'],
    isHostile: true, hp: 150, maxHp: 150, attack: 30, defense: 15,
    expReward: 60, goldReward: 20,
    drops: ['source_stone', 'iron_rod'],
    level: 4,
  },

  underground_beast: {
    id: 'underground_beast',
    name: '地底岩兽',
    description: '在矿道深层生活的岩石妖兽，皮肤坚硬如铁，攻击力惊人。',
    dialogue: ['（岩兽发出低沉的咆哮！）'],
    isHostile: true, hp: 400, maxHp: 400, attack: 60, defense: 50,
    expReward: 150, goldReward: 25,
    drops: ['source_crystal', 'dragon_blood'],
    level: 10,
  },

  stone_golem: {
    id: 'stone_golem',
    name: '石傀儡',
    description: '不知何人以上古神法驱动的石质傀儡，守卫着矿道内的宝藏。',
    dialogue: ['（傀儡沉默地举起石拳！）'],
    isHostile: true, hp: 600, maxHp: 600, attack: 70, defense: 65,
    expReward: 250, goldReward: 40,
    drops: ['source_crystal', 'source_crystal', 'ancient_scripture_fragment'],
    level: 15,
  },

  ruins_ghost: {
    id: 'ruins_ghost',
    name: '古遗迹之灵',
    description: '遗迹中残留的强者意志，以怨气凝聚成形，对入侵者发动攻击。',
    dialogue: ['（遗迹之灵发出怒嚎！）'],
    isHostile: true, hp: 350, maxHp: 350, attack: 80, defense: 30,
    expReward: 180, goldReward: 35,
    drops: ['ancient_scripture_fragment', 'source_crystal'],
    level: 12,
  },

  ruin_keeper_beast: {
    id: 'ruin_keeper_beast',
    name: '遗迹守卫妖兽',
    description: '驻守荒古遗迹的妖兽，被上古阵法束缚于此，代代相传守卫遗迹。',
    dialogue: ['（守卫妖兽低吼，挡住去路！）'],
    isHostile: true, hp: 700, maxHp: 700, attack: 90, defense: 70,
    expReward: 350, goldReward: 60,
    drops: ['dragon_blood', 'source_crystal', 'ancient_scripture_fragment'],
    level: 18,
  },

  emperor_tomb_guardian: {
    id: 'emperor_tomb_guardian',
    name: '古帝陵守卫者',
    description: '以古法驱动的陵寝守卫，使用强大的禁制神通，任何擅入者皆会遭到攻击。',
    dialogue: ['（禁制激活，守卫者化身战甲，攻向入侵者！）'],
    isHostile: true, hp: 1500, maxHp: 1500, attack: 130, defense: 100,
    expReward: 600, goldReward: 100,
    drops: ['ancient_scripture_fragment', 'forbidden_zone_map', 'source_crystal'],
    level: 28,
  },

  ancient_zombie: {
    id: 'ancient_zombie',
    name: '古帝陵僵尸',
    description: '被特殊方法保存的古代修炼者遗体，千年不腐，经陵中阵法驱动后发动攻击。',
    dialogue: ['（古尸睁开双眸，源力在其体内疯狂涌动！）'],
    isHostile: true, hp: 1200, maxHp: 1200, attack: 110, defense: 80,
    expReward: 500, goldReward: 80,
    drops: ['source_crystal', 'forbidden_zone_map'],
    level: 25,
  },

  forbidden_zone_creature: {
    id: 'forbidden_zone_creature',
    name: '太初古矿异兽',
    description: '从太初古矿深处游荡出来的古代异兽，身上有古纹，极为凶猛。',
    dialogue: ['（异兽发出刺耳的嚎叫！）'],
    isHostile: true, hp: 2000, maxHp: 2000, attack: 160, defense: 120,
    expReward: 800, goldReward: 120,
    drops: ['dragon_blood', 'source_crystal', 'source_crystal', 'forbidden_zone_map'],
    level: 35,
  },

  taixuan_zhangmen_npc: {
    id: 'taixuan_zhangmen_npc',
    name: '太玄门掌门',
    description: '太玄门第三十七代掌门，精通行字秘至第九层，修为深不可测。',
    dialogue: [
      '擅入禁地，是你的不对。不过，你能来到此地，也算有几分本事。',
      '行字秘不是靠强取豪夺能得的，需要与它有缘，天资亦要匹配。',
    ],
    isHostile: true, hp: 8000, maxHp: 8000, attack: 250, defense: 200,
    expReward: 3000, goldReward: 500,
    drops: ['ancient_scripture_fragment', 'source_crystal'],
    level: 55,
    realm: '仙台·初期',
  },

  spirit_beast_guardian: {
    id: 'spirit_beast_guardian',
    name: '行字秘守护灵兽',
    description: '太玄门以特殊阵法召唤的守护灵兽，专门守卫禁地。体型巨大，速度堪称极限。',
    dialogue: ['（灵兽以超越音速的速度冲向入侵者！）'],
    isHostile: true, hp: 3000, maxHp: 3000, attack: 180, defense: 150,
    expReward: 1200, goldReward: 200,
    drops: ['source_crystal', 'dragon_blood', 'ancient_scripture_fragment'],
    level: 40,
  },
};
