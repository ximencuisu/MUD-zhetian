import { Room } from '../types/game';

// 摇光圣地地图
export const YAOGUAN_MAP: Record<string, Room> = {
  yg_gate: {
    id: 'yg_gate', name: '摇光圣地·山门', description: '巍峨的山门矗立于圣地山脉入口，门上"摇光"二字苍劲有力，散发着圣光。两侧守卫的弟子身着金色道袍，目光如电。传送使空行者在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'yg_outer', label: '北(外门)' }],
    npcs: ['yg_zayi', 'yg_transport_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 0, y: 0,
  },
  yg_outer: {
    id: 'yg_outer', name: '摇光圣地·外门广场', description: '外门广场宽阔无比，地面铺着白玉，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老李任务在此发布每日任务，仓库管理员仓老负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'yg_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'yg_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'yg_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'yg_shop', label: '西(商店)' },
    ],
    npcs: ['yg_waimen1', 'yg_waimen2', 'yg_quest_master', 'yg_warehouse_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 0, y: 1,
  },
  yg_shop: {
    id: 'yg_shop', name: '摇光圣地·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。金掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'yg_outer', label: '东(外门广场)' },
    ],
    npcs: ['yg_shop_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: -1, y: 1,
  },
  yg_inner: {
    id: 'yg_inner', name: '摇光圣地·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着摇光圣地的历代先祖牌位。殿内源力浓郁，内门弟子在此修炼。医仙白仙子在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'yg_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'yg_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'yg_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'yg_craft', label: '西(炼器房)' },
    ],
    npcs: ['wg_neimen1', 'wg_neimen2', 'yg_heal_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 0, y: 2,
  },
  yg_craft: {
    id: 'yg_craft', name: '摇光圣地·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师火大师正在锻造法器，火星四溅，圣光闪耀。',
    exits: [
      { direction: 'east', roomId: 'yg_inner', label: '东(内门大殿)' },
    ],
    npcs: ['yg_craft_master', 'yg_alchemy_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: -1, y: 2,
  },
  yg_library: {
    id: 'yg_library', name: '摇光圣地·藏经阁', description: '藏经阁共九层，收藏着摇光圣地历代传承的功法秘籍。阁中弥漫着淡淡的圣光，每一层都有强大的禁制守护。杂役弟子在此打扫。',
    exits: [{ direction: 'west', roomId: 'yg_outer', label: '西(外门广场)' }],
    npcs: ['yg_zayi'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 1,
  },
  yg_zhenchuan: {
    id: 'yg_zhenchuan', name: '摇光圣地·真传峰', description: '真传峰高耸入云，峰顶圣光缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的圣光祭坛。竞技长老战长老在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'yg_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'yg_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'yg_arena', label: '东(竞技场)' },
    ],
    npcs: ['wg_zhenchuan', 'yg_arena_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 0, y: 3,
  },
  yg_arena: {
    id: 'yg_arena', name: '摇光圣地·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'yg_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['yg_arena_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 3,
  },
  yg_elder_hall: {
    id: 'yg_elder_hall', name: '摇光圣地·长老殿', description: '长老殿庄严肃穆，殿中坐着摇光圣地的各位长老。殿内源力浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'yg_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'yg_taishang', label: '北(太上殿)' },
    ],
    npcs: ['wg_wailao1', 'wg_neilao1'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 2,
  },
  yg_daozi: {
    id: 'yg_daozi', name: '摇光圣地·道子殿', description: '道子殿位于真传峰顶，殿中圣光璀璨。道子姬长空在此闭关修炼，殿外有强大的圣光禁制守护。',
    exits: [
      { direction: 'south', roomId: 'yg_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'yg_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['wg_daozi'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 0, y: 4,
  },
  yg_shengnv: {
    id: 'yg_shengnv', name: '摇光圣地·圣女殿', description: '圣女殿位于真传峰东侧，殿中圣光柔和。圣女月婵在此修炼，殿外种满了圣光莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'yg_daozi', label: '西(道子殿)' }],
    npcs: ['wg_shengnv'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 4,
  },
  yg_taishang: {
    id: 'yg_taishang', name: '摇光圣地·太上殿', description: '太上殿位于圣地最高处，殿中弥漫着古老的气息。太上长老古皇在此闭关，殿外有强大的圣光禁制守护。秘境守护者境老在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'yg_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'yg_zongzhu', label: '北(圣主殿)' },
      { direction: 'east', roomId: 'yg_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['wg_taishang', 'yg_dungeon_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 3,
  },
  yg_dungeon: {
    id: 'yg_dungeon', name: '摇光圣地·秘境入口', description: '秘境入口被强大的圣光禁制守护，只有通过试炼的弟子才能进入。里面藏有摇光圣地历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'yg_taishang', label: '西(太上殿)' },
    ],
    npcs: ['yg_dungeon_master'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 2, y: 3,
  },
  yg_zongzhu: {
    id: 'yg_zongzhu', name: '摇光圣地·圣主殿', description: '圣主殿位于摇光圣地最高处，殿中圣光璀璨，龙纹黑金鼎的虚影若隐若现。圣主摇光在此坐镇，殿外有最强的圣光禁制守护。',
    exits: [{ direction: 'south', roomId: 'yg_taishang', label: '南(太上殿)' }],
    npcs: ['wg_zongzhu'], items: [], isCity: false, isSafe: true, region: '摇光圣地', x: 1, y: 4,
  },
};

// 姬家地图
export const JI_FAMILY_MAP: Record<string, Room> = {
  ji_gate: {
    id: 'ji_gate', name: '姬家祖地·山门', description: '姬家祖地的山门庄严肃穆，门上"姬"字散发着虚空之力。两侧守卫的弟子身着紫色道袍，目光如电。传送使姬空在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'ji_outer', label: '北(外门)' }],
    npcs: ['ji_zayi', 'ji_transport_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 0, y: 0,
  },
  ji_outer: {
    id: 'ji_outer', name: '姬家祖地·外门广场', description: '外门广场宽阔无比，地面铺着虚空石，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老姬任务在此发布每日任务，仓库管理员姬仓负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'ji_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'ji_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'ji_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'ji_shop', label: '西(商店)' },
    ],
    npcs: ['ji_waimen1', 'ji_waimen2', 'ji_quest_master', 'ji_warehouse_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 0, y: 1,
  },
  ji_shop: {
    id: 'ji_shop', name: '姬家祖地·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。姬掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'ji_outer', label: '东(外门广场)' },
    ],
    npcs: ['ji_shop_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: -1, y: 1,
  },
  ji_inner: {
    id: 'ji_inner', name: '姬家祖地·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着姬家历代先祖牌位。殿内虚空之力浓郁，内门弟子在此修炼。医仙姬白在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'ji_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'ji_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'ji_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'ji_craft', label: '西(炼器房)' },
    ],
    npcs: ['ji_neimen1', 'ji_neimen2', 'ji_heal_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 0, y: 2,
  },
  ji_craft: {
    id: 'ji_craft', name: '姬家祖地·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师姬火正在锻造法器，虚空之力环绕，神秘莫测。',
    exits: [
      { direction: 'east', roomId: 'ji_inner', label: '东(内门大殿)' },
    ],
    npcs: ['ji_craft_master', 'ji_alchemy_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: -1, y: 2,
  },
  ji_library: {
    id: 'ji_library', name: '姬家祖地·藏经阁', description: '藏经阁共九层，收藏着姬家历代传承的功法秘籍。阁中弥漫着淡淡的虚空之力，每一层都有强大的禁制守护。',
    exits: [{ direction: 'west', roomId: 'ji_outer', label: '西(外门广场)' }],
    npcs: ['ji_zayi'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 1,
  },
  ji_zhenchuan: {
    id: 'ji_zhenchuan', name: '姬家祖地·真传峰', description: '真传峰高耸入云，峰顶虚空之力缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的虚空祭坛。竞技长老姬战在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'ji_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'ji_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'ji_arena', label: '东(竞技场)' },
    ],
    npcs: ['ji_zhenchuan', 'ji_arena_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 0, y: 3,
  },
  ji_arena: {
    id: 'ji_arena', name: '姬家祖地·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'ji_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['ji_arena_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 3,
  },
  ji_elder_hall: {
    id: 'ji_elder_hall', name: '姬家祖地·长老殿', description: '长老殿庄严肃穆，殿中坐着姬家的各位长老。殿内虚空之力浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'ji_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'ji_taishang', label: '北(太上殿)' },
    ],
    npcs: ['ji_wailao', 'ji_neilao'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 2,
  },
  ji_daozi: {
    id: 'ji_daozi', name: '姬家祖地·道子殿', description: '道子殿位于真传峰顶，殿中虚空之力璀璨。道子姬昊在此闭关修炼，殿外有强大的虚空禁制守护。',
    exits: [
      { direction: 'south', roomId: 'ji_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'ji_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['ji_daozi'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 0, y: 4,
  },
  ji_shengnv: {
    id: 'ji_shengnv', name: '姬家祖地·圣女殿', description: '圣女殿位于真传峰东侧，殿中虚空之力柔和。圣女姬月在此修炼，殿外种满了虚空莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'ji_daozi', label: '西(道子殿)' }],
    npcs: ['ji_shengnv'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 4,
  },
  ji_taishang: {
    id: 'ji_taishang', name: '姬家祖地·太上殿', description: '太上殿位于祖地最高处，殿中弥漫着古老的气息。太上长老姬古在此闭关，殿外有强大的虚空禁制守护。秘境守护者姬境在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'ji_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'ji_zongzhu', label: '北(家主殿)' },
      { direction: 'east', roomId: 'ji_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['ji_taishang', 'ji_dungeon_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 3,
  },
  ji_dungeon: {
    id: 'ji_dungeon', name: '姬家祖地·秘境入口', description: '秘境入口被强大的虚空禁制守护，只有通过试炼的弟子才能进入。里面藏有姬家历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'ji_taishang', label: '西(太上殿)' },
    ],
    npcs: ['ji_dungeon_master'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 2, y: 3,
  },
  ji_zongzhu: {
    id: 'ji_zongzhu', name: '姬家祖地·家主殿', description: '家主殿位于姬家祖地最高处，殿中虚空之力璀璨，虚空镜的虚影若隐若现。家主姬长空在此坐镇，殿外有最强的虚空禁制守护。',
    exits: [{ direction: 'south', roomId: 'ji_taishang', label: '南(太上殿)' }],
    npcs: ['ji_zongzhu'], items: [], isCity: false, isSafe: true, region: '姬家祖地', x: 1, y: 4,
  },
};

// 太玄门地图
export const TAIXUAN_MAP: Record<string, Room> = {
  tx_gate: {
    id: 'tx_gate', name: '太玄门·山门', description: '太玄门的山门矗立于太玄山脉入口，门上"太玄"二字苍劲有力。两侧守卫的弟子身着青色道袍，目光如电。传送使风行在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'tx_outer', label: '北(外门)' }],
    npcs: ['tx_zayi', 'tx_transport_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 0, y: 0,
  },
  tx_outer: {
    id: 'tx_outer', name: '太玄门·外门广场', description: '外门广场宽阔无比，地面铺着行字石，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老李速在此发布每日任务，仓库管理员风仓负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'tx_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'tx_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'tx_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'tx_shop', label: '西(商店)' },
    ],
    npcs: ['tx_waimen1', 'tx_waimen2', 'tx_quest_master', 'tx_warehouse_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 0, y: 1,
  },
  tx_shop: {
    id: 'tx_shop', name: '太玄门·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。风掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'tx_outer', label: '东(外门广场)' },
    ],
    npcs: ['tx_shop_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: -1, y: 1,
  },
  tx_inner: {
    id: 'tx_inner', name: '太玄门·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着太玄门历代先祖牌位。殿内行字之力浓郁，内门弟子在此修炼。医仙风白在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'tx_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'tx_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'tx_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'tx_craft', label: '西(炼器房)' },
    ],
    npcs: ['tx_neimen1', 'tx_neimen2', 'tx_heal_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 0, y: 2,
  },
  tx_craft: {
    id: 'tx_craft', name: '太玄门·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师风大师正在锻造法器，行字之力环绕，速度极快。',
    exits: [
      { direction: 'east', roomId: 'tx_inner', label: '东(内门大殿)' },
    ],
    npcs: ['tx_craft_master', 'tx_alchemy_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: -1, y: 2,
  },
  tx_library: {
    id: 'tx_library', name: '太玄门·藏经阁', description: '藏经阁共九层，收藏着太玄门历代传承的功法秘籍。阁中弥漫着淡淡的行字之力，每一层都有强大的禁制守护。',
    exits: [{ direction: 'west', roomId: 'tx_outer', label: '西(外门广场)' }],
    npcs: ['tx_zayi'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 1,
  },
  tx_zhenchuan: {
    id: 'tx_zhenchuan', name: '太玄门·真传峰', description: '真传峰高耸入云，峰顶行字之力缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的行字祭坛。竞技长老风战在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'tx_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'tx_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'tx_arena', label: '东(竞技场)' },
    ],
    npcs: ['tx_zhenchuan', 'tx_arena_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 0, y: 3,
  },
  tx_arena: {
    id: 'tx_arena', name: '太玄门·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'tx_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['tx_arena_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 3,
  },
  tx_elder_hall: {
    id: 'tx_elder_hall', name: '太玄门·长老殿', description: '长老殿庄严肃穆，殿中坐着太玄门的各位长老。殿内行字之力浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'tx_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'tx_taishang', label: '北(太上殿)' },
    ],
    npcs: ['tx_wailao', 'tx_neilao'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 2,
  },
  tx_daozi: {
    id: 'tx_daozi', name: '太玄门·道子殿', description: '道子殿位于真传峰顶，殿中行字之力璀璨。道子风行在此闭关修炼，殿外有强大的行字禁制守护。',
    exits: [
      { direction: 'south', roomId: 'tx_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'tx_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['tx_daozi'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 0, y: 4,
  },
  tx_shengnv: {
    id: 'tx_shengnv', name: '太玄门·圣女殿', description: '圣女殿位于真传峰东侧，殿中行字之力柔和。圣女云影在此修炼，殿外种满了行字莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'tx_daozi', label: '西(道子殿)' }],
    npcs: ['tx_shengnv'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 4,
  },
  tx_taishang: {
    id: 'tx_taishang', name: '太玄门·太上殿', description: '太上殿位于太玄门最高处，殿中弥漫着古老的气息。太上长老古行在此闭关，殿外有强大的行字禁制守护。秘境守护者风境在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'tx_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'tx_zongzhu', label: '北(掌门殿)' },
      { direction: 'east', roomId: 'tx_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['tx_taishang', 'tx_dungeon_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 3,
  },
  tx_dungeon: {
    id: 'tx_dungeon', name: '太玄门·秘境入口', description: '秘境入口被强大的行字禁制守护，只有通过试炼的弟子才能进入。里面藏有太玄门历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'tx_taishang', label: '西(太上殿)' },
    ],
    npcs: ['tx_dungeon_master'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 2, y: 3,
  },
  tx_zongzhu: {
    id: 'tx_zongzhu', name: '太玄门·掌门殿', description: '掌门殿位于太玄门最高处，殿中行字之力璀璨，行字秘的虚影若隐若现。掌门太玄在此坐镇，殿外有最强的行字禁制守护。',
    exits: [{ direction: 'south', roomId: 'tx_taishang', label: '南(太上殿)' }],
    npcs: ['tx_zongzhu'], items: [], isCity: false, isSafe: true, region: '太玄门', x: 1, y: 4,
  },
};

// 紫府圣地地图
export const ZIFU_MAP: Record<string, Room> = {
  zf_gate: {
    id: 'zf_gate', name: '紫府圣地·山门', description: '紫府圣地的山门矗立于紫府山入口，门上"紫府"二字苍劲有力，散发着紫色源力。两侧守卫的弟子身着紫色道袍，目光如电。传送使紫空在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'zf_outer', label: '北(外门)' }],
    npcs: ['zf_zayi', 'zf_transport_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 0, y: 0,
  },
  zf_outer: {
    id: 'zf_outer', name: '紫府圣地·外门广场', description: '外门广场宽阔无比，地面铺着紫色源石，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老紫任务在此发布每日任务，仓库管理员紫仓负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'zf_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'zf_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'zf_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'zf_shop', label: '西(商店)' },
    ],
    npcs: ['zf_waimen1', 'zf_waimen2', 'zf_quest_master', 'zf_warehouse_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 0, y: 1,
  },
  zf_shop: {
    id: 'zf_shop', name: '紫府圣地·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。紫掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'zf_outer', label: '东(外门广场)' },
    ],
    npcs: ['zf_shop_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: -1, y: 1,
  },
  zf_inner: {
    id: 'zf_inner', name: '紫府圣地·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着紫府圣地历代先祖牌位。殿内紫色源力浓郁，内门弟子在此修炼。医仙紫白在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'zf_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'zf_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'zf_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'zf_craft', label: '西(炼器房)' },
    ],
    npcs: ['zf_neimen1', 'zf_neimen2', 'zf_heal_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 0, y: 2,
  },
  zf_craft: {
    id: 'zf_craft', name: '紫府圣地·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师紫火正在锻造法器，紫色源力环绕，攻防一体。',
    exits: [
      { direction: 'east', roomId: 'zf_inner', label: '东(内门大殿)' },
    ],
    npcs: ['zf_craft_master', 'zf_alchemy_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: -1, y: 2,
  },
  zf_library: {
    id: 'zf_library', name: '紫府圣地·藏经阁', description: '藏经阁共九层，收藏着紫府圣地历代传承的功法秘籍。阁中弥漫着淡淡的紫色源力，每一层都有强大的禁制守护。',
    exits: [{ direction: 'west', roomId: 'zf_outer', label: '西(外门广场)' }],
    npcs: ['zf_zayi'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 1,
  },
  zf_zhenchuan: {
    id: 'zf_zhenchuan', name: '紫府圣地·真传峰', description: '真传峰高耸入云，峰顶紫色源力缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的紫色祭坛。竞技长老紫战在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'zf_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'zf_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'zf_arena', label: '东(竞技场)' },
    ],
    npcs: ['zf_zhenchuan', 'zf_arena_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 0, y: 3,
  },
  zf_arena: {
    id: 'zf_arena', name: '紫府圣地·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'zf_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['zf_arena_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 3,
  },
  zf_elder_hall: {
    id: 'zf_elder_hall', name: '紫府圣地·长老殿', description: '长老殿庄严肃穆，殿中坐着紫府圣地的各位长老。殿内紫色源力浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'zf_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'zf_taishang', label: '北(太上殿)' },
    ],
    npcs: ['zf_wailao', 'zf_neilao'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 2,
  },
  zf_daozi: {
    id: 'zf_daozi', name: '紫府圣地·道子殿', description: '道子殿位于真传峰顶，殿中紫色源力璀璨。道子紫天在此闭关修炼，殿外有强大的紫色禁制守护。',
    exits: [
      { direction: 'south', roomId: 'zf_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'zf_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['zf_daozi'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 0, y: 4,
  },
  zf_shengnv: {
    id: 'zf_shengnv', name: '紫府圣地·圣女殿', description: '圣女殿位于真传峰东侧，殿中紫色源力柔和。圣女紫月在此修炼，殿外种满了紫色莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'zf_daozi', label: '西(道子殿)' }],
    npcs: ['zf_shengnv'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 4,
  },
  zf_taishang: {
    id: 'zf_taishang', name: '紫府圣地·太上殿', description: '太上殿位于紫府圣地最高处，殿中弥漫着古老的气息。太上长老紫皇在此闭关，殿外有强大的紫色禁制守护。秘境守护者紫境在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'zf_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'zf_zongzhu', label: '北(圣主殿)' },
      { direction: 'east', roomId: 'zf_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['zf_taishang', 'zf_dungeon_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 3,
  },
  zf_dungeon: {
    id: 'zf_dungeon', name: '紫府圣地·秘境入口', description: '秘境入口被强大的紫色禁制守护，只有通过试炼的弟子才能进入。里面藏有紫府圣地历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'zf_taishang', label: '西(太上殿)' },
    ],
    npcs: ['zf_dungeon_master'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 2, y: 3,
  },
  zf_zongzhu: {
    id: 'zf_zongzhu', name: '紫府圣地·圣主殿', description: '圣主殿位于紫府圣地最高处，殿中紫色源力璀璨，紫府帝经的虚影若隐若现。圣主紫府在此坐镇，殿外有最强的紫色禁制守护。',
    exits: [{ direction: 'south', roomId: 'zf_taishang', label: '南(太上殿)' }],
    npcs: ['zf_zongzhu'], items: [], isCity: false, isSafe: true, region: '紫府圣地', x: 1, y: 4,
  },
};

// 姜家地图
export const JIANG_MAP: Record<string, Room> = {
  jg_gate: {
    id: 'jg_gate', name: '姜家祖地·山门', description: '姜家祖地的山门庄严肃穆，门上"姜"字散发着柔和的源力。两侧守卫的弟子身着蓝色道袍，目光如电。传送使姜空在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'jg_outer', label: '北(外门)' }],
    npcs: ['jg_zayi', 'jg_transport_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 0, y: 0,
  },
  jg_outer: {
    id: 'jg_outer', name: '姜家祖地·外门广场', description: '外门广场宽阔无比，地面铺着柔劲石，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老姜任务在此发布每日任务，仓库管理员姜仓负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'jg_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'jg_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'jg_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'jg_shop', label: '西(商店)' },
    ],
    npcs: ['jg_waimen1', 'jg_waimen2', 'jg_quest_master', 'jg_warehouse_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 0, y: 1,
  },
  jg_shop: {
    id: 'jg_shop', name: '姜家祖地·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。姜掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'jg_outer', label: '东(外门广场)' },
    ],
    npcs: ['jg_shop_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: -1, y: 1,
  },
  jg_inner: {
    id: 'jg_inner', name: '姜家祖地·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着姜家历代先祖牌位。殿内柔劲之力浓郁，内门弟子在此修炼。医仙姜白在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'jg_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'jg_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'jg_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'jg_craft', label: '西(炼器房)' },
    ],
    npcs: ['jg_neimen1', 'jg_neimen2', 'jg_heal_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 0, y: 2,
  },
  jg_craft: {
    id: 'jg_craft', name: '姜家祖地·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师姜火正在锻造法器，柔劲之力环绕，以柔克刚。',
    exits: [
      { direction: 'east', roomId: 'jg_inner', label: '东(内门大殿)' },
    ],
    npcs: ['jg_craft_master', 'jg_alchemy_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: -1, y: 2,
  },
  jg_library: {
    id: 'jg_library', name: '姜家祖地·藏经阁', description: '藏经阁共九层，收藏着姜家历代传承的功法秘籍。阁中弥漫着淡淡的柔劲之力，每一层都有强大的禁制守护。',
    exits: [{ direction: 'west', roomId: 'jg_outer', label: '西(外门广场)' }],
    npcs: ['jg_zayi'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 1,
  },
  jg_zhenchuan: {
    id: 'jg_zhenchuan', name: '姜家祖地·真传峰', description: '真传峰高耸入云，峰顶柔劲之力缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的柔劲祭坛。竞技长老姜战在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'jg_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'jg_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'jg_arena', label: '东(竞技场)' },
    ],
    npcs: ['jg_zhenchuan', 'jg_arena_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 0, y: 3,
  },
  jg_arena: {
    id: 'jg_arena', name: '姜家祖地·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'jg_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['jg_arena_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 3,
  },
  jg_elder_hall: {
    id: 'jg_elder_hall', name: '姜家祖地·长老殿', description: '长老殿庄严肃穆，殿中坐着姜家的各位长老。殿内柔劲之力浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'jg_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'jg_taishang', label: '北(太上殿)' },
    ],
    npcs: ['jg_wailao', 'jg_neilao'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 2,
  },
  jg_daozi: {
    id: 'jg_daozi', name: '姜家祖地·道子殿', description: '道子殿位于真传峰顶，殿中柔劲之力璀璨。道子姜天在此闭关修炼，殿外有强大的柔劲禁制守护。',
    exits: [
      { direction: 'south', roomId: 'jg_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'jg_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['jg_daozi'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 0, y: 4,
  },
  jg_shengnv: {
    id: 'jg_shengnv', name: '姜家祖地·圣女殿', description: '圣女殿位于真传峰东侧，殿中柔劲之力柔和。圣女姜月在此修炼，殿外种满了柔劲莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'jg_daozi', label: '西(道子殿)' }],
    npcs: ['jg_shengnv'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 4,
  },
  jg_taishang: {
    id: 'jg_taishang', name: '姜家祖地·太上殿', description: '太上殿位于姜家祖地最高处，殿中弥漫着古老的气息。太上长老姜皇在此闭关，殿外有强大的柔劲禁制守护。秘境守护者姜境在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'jg_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'jg_zongzhu', label: '北(家主殿)' },
      { direction: 'east', roomId: 'jg_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['jg_taishang', 'jg_dungeon_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 3,
  },
  jg_dungeon: {
    id: 'jg_dungeon', name: '姜家祖地·秘境入口', description: '秘境入口被强大的柔劲禁制守护，只有通过试炼的弟子才能进入。里面藏有姜家历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'jg_taishang', label: '西(太上殿)' },
    ],
    npcs: ['jg_dungeon_master'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 2, y: 3,
  },
  jg_zongzhu: {
    id: 'jg_zongzhu', name: '姜家祖地·家主殿', description: '家主殿位于姜家祖地最高处，殿中柔劲之力璀璨，姜家帝诀的虚影若隐若现。家主姜帝在此坐镇，殿外有最强的柔劲禁制守护。',
    exits: [{ direction: 'south', roomId: 'jg_taishang', label: '南(太上殿)' }],
    npcs: ['jg_zongzhu'], items: [], isCity: false, isSafe: true, region: '姜家祖地', x: 1, y: 4,
  },
};

// 妖族地图
export const YAO_MAP: Record<string, Room> = {
  yao_gate: {
    id: 'yao_gate', name: '妖族圣山·山门', description: '妖族圣山的山门矗立于圣山入口，门上"妖"字散发着青莲圣火。两侧守卫的妖族弟子身着青色妖袍，目光如电。传送使妖空在此驻守，可为弟子提供传送服务。',
    exits: [{ direction: 'north', roomId: 'yao_outer', label: '北(外门)' }],
    npcs: ['yao_zayi', 'yao_transport_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 0, y: 0,
  },
  yao_outer: {
    id: 'yao_outer', name: '妖族圣山·外门广场', description: '外门广场宽阔无比，地面铺着青莲石，中央有一座巨大的演武台。四周是外门弟子的居所，远处可见内门山峰云雾缭绕。任务长老妖任务在此发布每日任务，仓库管理员妖仓负责物品存放。',
    exits: [
      { direction: 'south', roomId: 'yao_gate', label: '南(山门)' },
      { direction: 'north', roomId: 'yao_inner', label: '北(内门)' },
      { direction: 'east', roomId: 'yao_library', label: '东(藏经阁)' },
      { direction: 'west', roomId: 'yao_shop', label: '西(商店)' },
    ],
    npcs: ['yao_waimen1', 'yao_waimen2', 'yao_quest_master', 'yao_warehouse_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 0, y: 1,
  },
  yao_shop: {
    id: 'yao_shop', name: '妖族圣山·门派商店', description: '门派商店宽敞明亮，货架上摆满了各种丹药、法器和材料。妖掌柜正在柜台后忙碌，为弟子们兑换所需物品。',
    exits: [
      { direction: 'east', roomId: 'yao_outer', label: '东(外门广场)' },
    ],
    npcs: ['yao_shop_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: -1, y: 1,
  },
  yao_inner: {
    id: 'yao_inner', name: '妖族圣山·内门大殿', description: '内门大殿金碧辉煌，殿中供奉着妖族历代先祖牌位。殿内青莲圣火浓郁，内门弟子在此修炼。医仙妖白在此为弟子疗伤。',
    exits: [
      { direction: 'south', roomId: 'yao_outer', label: '南(外门)' },
      { direction: 'north', roomId: 'yao_zhenchuan', label: '北(真传峰)' },
      { direction: 'east', roomId: 'yao_elder_hall', label: '东(长老殿)' },
      { direction: 'west', roomId: 'yao_craft', label: '西(炼器房)' },
    ],
    npcs: ['yao_neimen1', 'yao_neimen2', 'yao_heal_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 0, y: 2,
  },
  yao_craft: {
    id: 'yao_craft', name: '妖族圣山·炼器房', description: '炼器房内炉火熊熊，各种炼器材料整齐摆放。炼器师妖火正在锻造法器，青莲圣火环绕，血脉之力融入法器。',
    exits: [
      { direction: 'east', roomId: 'yao_inner', label: '东(内门大殿)' },
    ],
    npcs: ['yao_craft_master', 'yao_alchemy_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: -1, y: 2,
  },
  yao_library: {
    id: 'yao_library', name: '妖族圣山·藏经阁', description: '藏经阁共九层，收藏着妖族历代传承的功法秘籍。阁中弥漫着淡淡的青莲圣火，每一层都有强大的禁制守护。',
    exits: [{ direction: 'west', roomId: 'yao_outer', label: '西(外门广场)' }],
    npcs: ['yao_zayi'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 1,
  },
  yao_zhenchuan: {
    id: 'yao_zhenchuan', name: '妖族圣山·真传峰', description: '真传峰高耸入云，峰顶青莲圣火缭绕。真传弟子在此闭关修炼，峰顶有一座巨大的青莲祭坛。竞技长老妖战在此组织比武切磋。',
    exits: [
      { direction: 'south', roomId: 'yao_inner', label: '南(内门大殿)' },
      { direction: 'north', roomId: 'yao_daozi', label: '北(道子殿)' },
      { direction: 'east', roomId: 'yao_arena', label: '东(竞技场)' },
    ],
    npcs: ['yao_zhenchuan', 'yao_arena_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 0, y: 3,
  },
  yao_arena: {
    id: 'yao_arena', name: '妖族圣山·竞技场', description: '竞技场占地广阔，四周看台环绕，中央是比武擂台。这里每日都有弟子切磋武艺，争夺排名。',
    exits: [
      { direction: 'west', roomId: 'yao_zhenchuan', label: '西(真传峰)' },
    ],
    npcs: ['yao_arena_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 3,
  },
  yao_elder_hall: {
    id: 'yao_elder_hall', name: '妖族圣山·长老殿', description: '长老殿庄严肃穆，殿中坐着妖族的各位长老。殿内青莲圣火浓郁到几乎液化，非内门以上弟子不得入内。',
    exits: [
      { direction: 'west', roomId: 'yao_inner', label: '西(内门大殿)' },
      { direction: 'north', roomId: 'yao_taishang', label: '北(太上殿)' },
    ],
    npcs: ['yao_wailao', 'yao_neilao'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 2,
  },
  yao_daozi: {
    id: 'yao_daozi', name: '妖族圣山·道子殿', description: '道子殿位于真传峰顶，殿中青莲圣火璀璨。道子妖天在此闭关修炼，殿外有强大的青莲禁制守护。',
    exits: [
      { direction: 'south', roomId: 'yao_zhenchuan', label: '南(真传峰)' },
      { direction: 'east', roomId: 'yao_shengnv', label: '东(圣女殿)' },
    ],
    npcs: ['yao_daozi'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 0, y: 4,
  },
  yao_shengnv: {
    id: 'yao_shengnv', name: '妖族圣山·圣女殿', description: '圣女殿位于真传峰东侧，殿中青莲圣火柔和。圣女颜如玉在此修炼，殿外种满了青莲，美丽非凡。',
    exits: [{ direction: 'west', roomId: 'yao_daozi', label: '西(道子殿)' }],
    npcs: ['yao_shengnv'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 4,
  },
  yao_taishang: {
    id: 'yao_taishang', name: '妖族圣山·太上殿', description: '太上殿位于妖族圣山最高处，殿中弥漫着古老的气息。太上长老妖皇在此闭关，殿外有强大的青莲禁制守护。秘境守护者妖境在此守护门派秘境入口。',
    exits: [
      { direction: 'south', roomId: 'yao_elder_hall', label: '南(长老殿)' },
      { direction: 'north', roomId: 'yao_zongzhu', label: '北(圣主殿)' },
      { direction: 'east', roomId: 'yao_dungeon', label: '东(秘境入口)' },
    ],
    npcs: ['yao_taishang', 'yao_dungeon_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 3,
  },
  yao_dungeon: {
    id: 'yao_dungeon', name: '妖族圣山·秘境入口', description: '秘境入口被强大的青莲禁制守护，只有通过试炼的弟子才能进入。里面藏有妖族历代积累的宝藏和功法。',
    exits: [
      { direction: 'west', roomId: 'yao_taishang', label: '西(太上殿)' },
    ],
    npcs: ['yao_dungeon_master'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 2, y: 3,
  },
  yao_zongzhu: {
    id: 'yao_zongzhu', name: '妖族圣山·圣主殿', description: '圣主殿位于妖族圣山最高处，殿中青莲圣火璀璨，青帝经的虚影若隐若现。圣主青帝后裔在此坐镇，殿外有最强的青莲禁制守护。',
    exits: [{ direction: 'south', roomId: 'yao_taishang', label: '南(太上殿)' }],
    npcs: ['yao_zongzhu'], items: [], isCity: false, isSafe: true, region: '妖族圣山', x: 1, y: 4,
  },
};

// All sect maps
export const SECT_MAPS: Record<string, Record<string, Room>> = {
  yaoguan: YAOGUAN_MAP,
  ji_family: JI_FAMILY_MAP,
  taixuan: TAIXUAN_MAP,
  zifu: ZIFU_MAP,
  jiang_family: JIANG_MAP,
  yao_clan: YAO_MAP,
};

// Flat room lookup across all sect maps (for RoomGrid / EntityPanel)
export const ALL_SECT_ROOMS: Record<string, Room> = Object.values(SECT_MAPS).reduce(
  (acc, map) => ({ ...acc, ...map }),
  {}
);

// First room ID for each sect (used by enterSectMap to place the player)
export const SECT_GATE_ROOMS: Record<string, string> = {
  yaoguan:      'yg_gate',
  ji_family:    'ji_gate',
  taixuan:      'tx_gate',
  zifu:         'zf_gate',
  jiang_family: 'jg_gate',
  yao_clan:     'yao_gate',
};
