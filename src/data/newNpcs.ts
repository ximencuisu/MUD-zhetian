import { NPC } from '../types/game';

export const NEW_NPCS: Record<string, NPC> = {
  // ──────────────────────────────────────────────
  // 中州神城NPC
  // ──────────────────────────────────────────────
  city_guard: {
    id: 'city_guard',
    name: '神城卫兵·铁山',
    description: '身穿神金铠甲的卫兵，目光如炬，守护着神城的安宁。他是神城卫队的精锐，修为已达化龙境界。',
    dialogue: [
      '站住！中州神城严禁私斗，违者将被处以极刑。',
      '神城内禁止飞行，请步行前往。',
      '若想参加竞技场比赛，请前往中央广场东侧的竞技场。',
      '城主府每三日发布一次悬赏任务，报酬丰厚。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 500, defense: 500,
    expReward: 0, goldReward: 0, drops: [], level: 60,
    realm: '化龙秘境',
  },

  city_merchant: {
    id: 'city_merchant',
    name: '杂货商人·钱通',
    description: '精明的商人，在神城经营各类日常用品。他消息灵通，对神城的各行各业都了如指掌。',
    dialogue: [
      '这位客官，需要些什么？我这里应有尽有！',
      '刚从东荒南域进了一批源石，价格公道！',
      '听说天妖山脉最近有妖兽出没，要小心啊！',
      '古皇战场？那地方邪门得很，劝您别去。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
    realm: '道宫秘境',
    shop: 'general_store',
  },

  city_official: {
    id: 'city_official',
    name: '城主府官员·李墨',
    description: '城主府的文官，负责处理神城的日常事务。他待人和善，乐于助人。',
    dialogue: [
      '欢迎来到中州神城，我是城主府官员李墨。',
      '城主大人每三日会在城主府接见民众，有要事可前往禀报。',
      '神城正在举办年度拍卖会，届时会有诸多珍稀物品拍卖。',
      '竞技场每周末举行争霸赛，冠军可获得丰厚奖励。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '四极秘境',
  },

  traveling_sage: {
    id: 'traveling_sage',
    name: '游方散人·云游子',
    description: '一位白发苍苍的老者，据说是某大宗门的隐退长老。他云游天下，见多识广。',
    dialogue: [
      '老夫游历天下数十载，见过的奇人异事不计其数。',
      '年轻人，修炼之道在于心境，心境不到，再怎么苦修也是枉然。',
      '古皇战场有古皇残躯，蕴含无上大道，有缘者或可获得传承。',
      '天妖山脉的妖帝遗迹，是上古妖帝的道场，危险与机遇并存。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（不可测）',
  },

  exchange_master: {
    id: 'exchange_master',
    name: '交易所主管·孙易',
    description: '交易所的管理者，眼光独到，交易公平。他掌控着神城最大的交易市场。',
    dialogue: [
      '欢迎光临交易所，这里是神城最大的交易市场！',
      '我们可以收购各种珍稀材料，价格公道。',
      '若要购买稀有物品，请查看展示柜中的商品。',
      '每周会有一次限时特卖，届时优惠多多。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 40,
    realm: '化龙秘境',
    shop: 'exchange',
  },

  rare_item_merchant: {
    id: 'rare_item_merchant',
    name: '稀有商人·凤九天',
    description: '一位神秘的女商人，专门经营稀有物品。她身份成谜，据说与某个圣地有深厚渊源。',
    dialogue: [
      '稀有之物，只售有缘人。',
      '我这儿的货，可不是有钱就能买到的。',
      '年轻人，我看你资质不凡，或许能入我法眼。',
      '每件物品都有其命定的归属，缘分到了，自然会来到你手中。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 80,
    realm: '仙台秘境',
    shop: 'rare_items',
  },

  auction_master: {
    id: 'auction_master',
    name: '拍卖师·玉玲珑',
    description: '神城拍卖行的首席拍卖师，容颜绝世，声音能传遍整个大厅。她的一颦一笑都蕴含魅惑之力。',
    dialogue: [
      '欢迎来到神城拍卖行，今日拍品精彩纷呈！',
      '每件拍品都是万里挑一的珍品，错过可惜。',
      '下一场大型拍卖会将在三日后举行，届时会有圣级物品登场。',
      '若想寄售物品，请提供物品和底价，我会为您安排。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 70,
    realm: '仙台秘境',
  },

  wealthy_collector: {
    id: 'wealthy_collector',
    name: '收藏家·钱多多',
    description: '神城首富之子，酷爱收藏各类奇珍异宝。他出手阔绰，但眼光也极为挑剔。',
    dialogue: [
      '在下钱多多，喜好收藏天下奇珍。',
      '若你有稀世珍品，不妨拿给我看看。',
      '价格好商量，只要东西够稀有，我不差钱。',
      '最近在收集古皇战场的相关物品，有线索吗？',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '道宫秘境',
  },

  arena_master: {
    id: 'arena_master',
    name: '竞技场总管·战无痕',
    description: '竞技场的负责人，曾是东荒有名的强者。他主持竞技场多年，阅人无数。',
    dialogue: [
      '欢迎来到竞技场！这里是强者的舞台！',
      '每周的周赛和每月的月赛，冠军可获得丰厚奖励。',
      '切磋是友好的比武，生死战则是解决恩怨的方式。',
      '报名参加比赛需要一定修为，请先提升实力再来。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 75,
    realm: '仙台秘境',
  },

  pvp_champion: {
    id: 'pvp_champion',
    name: '上届冠军·不败战神',
    description: '竞技场的传奇人物，连续三届获得冠军。他的战绩至今无人能破。',
    dialogue: [
      '想要挑战我？先打赢其他人再说吧。',
      '战斗之道，在于快、准、狠！',
      '年轻人，你的眼神不错，有成为强者的潜质。',
      '若要切磋，随时奉陪。但要记住，点到为止。',
    ],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 1000, defense: 800,
    expReward: 0, goldReward: 0, drops: [], level: 90,
    realm: '圣人',
  },

  arena_registration_npc: {
    id: 'arena_registration_npc',
    name: '竞技场登记员·小武',
    description: '负责竞技场报名工作的年轻人，虽然修为不高，但办事认真。',
    dialogue: [
      '您好，请问你想要参加哪种比赛？',
      '周赛每周六举行，月赛每月初一举行。',
      '报名费1000金币，获胜者可得双倍奖金和声望。',
      '请确保您的修为足够再参赛，否则可能会有生命危险。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 20,
    realm: '苦海秘境',
  },

  city_lord: {
    id: 'city_lord',
    name: '城主·轩辕无敌',
    description: '中州神城的城主，传闻是轩辕大帝的后裔，实力深不可测。他治理神城数百年，威望极高。',
    dialogue: [
      '年轻人，你来找我是有何要事？',
      '神城的和平需要众人维护，若有扰乱秩序者，严惩不贷。',
      '每三日我会发布悬赏任务，完成者可获得神城贡献值。',
      '古皇战场近期有异动，或许与即将到来的大世有关。',
    ],
    isHostile: false, hp: 999999, maxHp: 999999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 100,
    realm: '大圣',
  },

  mission_board_npc: {
    id: 'mission_board_npc',
    name: '任务板管理员·张榜',
    description: '城主府的任务管理员，负责发布和更新悬赏任务。他对神城的大小事务了如指掌。',
    dialogue: [
      '欢迎查看悬赏任务板！今日有多个高奖励任务。',
      '任务分为不同等级，等级越高奖励越丰厚，但风险也越大。',
      '每周刷新一次任务，请及时完成。',
      '组队完成任务可获得额外奖励，建议找几个帮手。',
    ],
    isHostile: false, hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '四极秘境',
  },

  // ──────────────────────────────────────────────
  // 天妖山脉NPC
  // ──────────────────────────────────────────────
  demon_merchant: {
    id: 'demon_merchant',
    name: '妖界商人·狐媚娘',
    description: '半人半妖的女商人，在妖界集市经营各种妖族特有的物品。她与人类和妖族都有生意往来。',
    dialogue: [
      '哎呀，这位客官，欢迎来到妖界集市！',
      '我们这里有妖族特有的材料，人类世界可买不到哦。',
      '天妖山脉深处危险重重，没有准备可不能贸然前往。',
      '妖晶是山中妖兽的力量结晶，用处可大了。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '化龙秘境',
    shop: 'demon_market',
  },

  mountain_guide: {
    id: 'mountain_guide',
    name: '山中向导·狼行',
    description: '在天妖山脉生活多年的狼妖，对山中地形极为熟悉。他经常为人类修炼者提供向导服务。',
    dialogue: [
      '我是这山里的活地图，有我在，保证你不会迷路。',
      '往东走有个洞穴，里面住着一只千年熊妖，非常厉害。',
      '山深处的妖帝遗迹是上古妖帝的道场，传说得到传承就能成为绝顶强者。',
      '小心山道上的妖禽，它们最喜欢偷袭落单的人。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 45,
    realm: '化龙秘境',
  },

  mountain_demon: {
    id: 'mountain_demon',
    name: '山道妖兽·黑豹精',
    description: '盘踞在山道上的豹妖，速度极快，专门袭击过往的修炼者。',
    dialogue: ['（发出低沉的咆哮，眼中闪烁着凶光）'],
    isHostile: true, hp: 3000, maxHp: 3000, attack: 120, defense: 80,
    expReward: 150, goldReward: 50,    drops: ['demon_beast_core', 'rage_pill'],
    level: 28,
    realm: '道宫秘境',
  },

  demon_eagle: {
    id: 'demon_eagle',
    name: '妖禽·金翅大鹏',
    description: '栖息在古树上的金色大鹏鸟，双翅展开可达数丈。它是天空的霸主，鲜有敌手。',
    dialogue: ['（发出尖锐的鸣叫，展翅俯冲！）'],
    isHostile: true, hp: 4000, maxHp: 4000, attack: 150, defense: 100,
    expReward: 200, goldReward: 80,    drops: ['demon_feather', 'source_crystal', 'speed_pill'],
    level: 35,
    realm: '四极秘境',
  },

  cave_guardian_spirit: {
    id: 'cave_guardian_spirit',
    name: '洞穴守护灵',
    description: '守护妖王洞穴入口的灵体，由阵法凝聚而成。它会阻止一切未经许可的入侵者。',
    dialogue: ['（灵体发出警告：外来者，速速退去！）'],
    isHostile: true, hp: 5000, maxHp: 5000, attack: 180, defense: 120,
    expReward: 300, goldReward: 100,    drops: ['spirit_essence', 'armor_pill'],
    level: 38,
    realm: '四极秘境',
  },

  thousand_year_bear_demon: {
    id: 'thousand_year_bear_demon',
    name: '千年熊妖·霸天',
    description: '修炼千年的熊妖，体型如小山，力大无穷。它盘踞在洞穴最深处，吸收天地精华。',
    dialogue: [
      '（熊妖发出震天的咆哮：谁敢闯入我的领地！）',
      '愚蠢的人类，你们的气息真是美味。',
      '既然来了，就别想活着离开！',
    ],
    isHostile: true, hp: 20000, maxHp: 20000, attack: 300, defense: 250,
    expReward: 1000, goldReward: 500,    drops: ['bear_paw', 'demon_beast_core', 'dragon_blood', 'armor_pill', 'regen_potion'],
    level: 45,
    realm: '化龙秘境',
  },

  ancient_demon_spirit: {
    id: 'ancient_demon_spirit',
    name: '远古恶魔之魂',
    description: '远古时代的恶魔留下的意志碎片。虽然只是一缕残魂，依然蕴含着恐怖的力量。',
    dialogue: ['（残魂发出低沉的呢喃：后辈...接受传承...）'],
    isHostile: true, hp: 15000, maxHp: 15000, attack: 250, defense: 200,
    expReward: 800, goldReward: 300,    drops: ['demon_blood', 'ancient_scripture_fragment', 'berserk_pill'],
    level: 50,
    realm: '化龙秘境',
  },

  demon_phoenix: {
    id: 'demon_phoenix',
    name: '妖凤凰·赤焰',
    description: '传说中的妖凤凰，掌控火焰之力。它是天妖山脉最强大的妖兽之一。',
    dialogue: [
      '（凤凰发出凤鸣，周身火焰缭绕）',
      '能见到本座，是你三生修来的福气。',
      '想要通过此地，先证明你的实力！',
    ],
    isHostile: true, hp: 25000, maxHp: 25000, attack: 350, defense: 280,
    expReward: 1500, goldReward: 800,    drops: ['phoenix_feather', 'demon_beast_core', 'emperor_blood', 'divine_pill'],
    level: 55,
    realm: '仙台秘境',
  },

  emperor_spirit_remnant: {
    id: 'emperor_spirit_remnant',
    name: '妖帝残魂',
    description: '上古妖帝陨落后留下的一缕残魂，蕴含着妖帝的部分传承。它在等待有缘人接受传承。',
    dialogue: [
      '（残魂发出苍老的声音：吾之传承，等待有缘人...）',
      '欲得吾之传承，需通过吾设下的考验。',
      '接受传承者，将成为新一代的妖帝。',
    ],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '妖帝',
  },

  // ──────────────────────────────────────────────
  // 古皇战场NPC
  // ──────────────────────────────────────────────
  battlefield_scout: {
    id: 'battlefield_scout',
    name: '战场斥候·影',
    description: '常年在古皇战场活动的斥候，对战场的情况了如指掌。他身手敏捷，来去如风。',
    dialogue: [
      '古皇战场是东荒最危险的地方之一，没有足够实力最好别去。',
      '战场核心区域有古皇残躯，蕴含无上大道，但也有恐怖的危险。',
      '我曾见过有人在战场深处获得古皇传承，一夜之间成为绝顶强者。',
      '但更多人是在那里陨落的，连尸骨都找不到。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '化龙秘境',
  },

  ghost_warrior: {
    id: 'ghost_warrior',
    name: '战场亡魂·将军',
    description: '古皇战场上战死的将士，化为亡魂守护战场。他们虽已身死，但战意犹存。',
    dialogue: ['（亡魂发出嘶哑的声音：战...继续战斗...）'],
    isHostile: true, hp: 8000, maxHp: 8000, attack: 200, defense: 150,
    expReward: 400, goldReward: 150,    drops: ['ghost_essence', 'emperor_blood', 'crit_pill'],
    level: 40,
    realm: '四极秘境',
  },

  ghost_emperor: {
    id: 'ghost_emperor',
    name: '皇魂·虚空',
    description: '古皇战场核心区域的皇魂，由历代战死的皇者残留意志凝聚而成。它极为强大，几乎不可战胜。',
    dialogue: [
      '（皇魂散发出镇压天地的威压）',
      '又一个挑战者...来吧，让本皇看看你的实力。',
      '若能战胜本皇，你可进入神殿，接受古皇传承。',
    ],
    isHostile: true, hp: 50000, maxHp: 50000, attack: 500, defense: 400,
    expReward: 3000, goldReward: 2000,    drops: ['emperor_blood', 'ancient_scripture_fragment', 'emperor_artifact', 'divine_pill'],
    level: 65,
    realm: '圣人王',
  },

  ancient_sage_spirit: {
    id: 'ancient_sage_spirit',
    name: '上古先贤残魂',
    description: '上古时代陨落的先贤留下的残魂，虽已失去大部分力量，但依然蕴含着珍贵的感悟。',
    dialogue: ['（残魂发出低沉的声音：后人...珍惜...传承...）'],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: ['ancient_scripture_fragment'],
    level: 80,
    realm: '大圣',
  },

  emperor_guardian_spirit: {
    id: 'emperor_guardian_spirit',
    name: '皇陵守护神',
    description: '守护古皇神殿的神灵，由古皇生前设下。它会考验每一个试图进入神殿的修炼者。',
    dialogue: [
      '（神灵发出威严的声音：凡人，欲入神殿，先过本座这一关！）',
      '古皇传承，非有缘者不可得。',
      '展现你的实力，证明你有资格继承古皇衣钵！',
    ],
    isHostile: true, hp: 80000, maxHp: 80000, attack: 600, defense: 500,
    expReward: 5000, goldReward: 5000,    drops: ['emperor_artifact', 'emperor_blood', 'ancient_scripture_fragment', 'berserk_pill'],
    level: 70,
    realm: '大圣',
  },

  // ──────────────────────────────────────────────
  // 隐世高手NPC
  // ──────────────────────────────────────────────
  hidden_sword_master: {
    id: 'hidden_sword_master',
    name: '隐世剑仙·青莲',
    description: '传说中的剑仙，隐居于古林深处。他的剑术已臻化境，一剑可破万法。',
    dialogue: [
      '（老者睁开双眼，剑气纵横）',
      '你的剑意尚浅，需要更多磨砺。',
      '剑道在于心，心到则剑到。',
      '若你能接住我三招，便传你一式绝学。',
    ],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 80,
    realm: '大圣',
  },

  hidden_alchemy_sage: {
    id: 'hidden_alchemy_sage',
    name: '丹道圣手·药老',
    description: '炼丹界的传奇人物，据说能炼制出起死回生的神丹。他云游四方，寻找有缘弟子。',
    dialogue: [
      '年轻人，你对丹道有兴趣？',
      '炼丹之道，在于火候与药材的完美配合。',
      '我这里有一些珍稀配方，若你有缘，便传于你。',
      '丹道的最高境界，是以天地为炉，以万物为药。',
    ],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 90,
    realm: '准帝',
  },

  hidden_array_master: {
    id: 'hidden_array_master',
    name: '阵道宗师·玄机子',
    description: '精通天下阵法的奇人，据说能以阵法困住大圣级别的强者。',
    dialogue: [
      '阵法之道，博大精深。',
      '一阵在手，可敌千军。',
      '你的阵法天赋不错，若有兴趣，可随我学习。',
      '天下阵法，皆出同源，悟透根源，万阵皆通。',
    ],
    isHostile: false, hp: 99999, maxHp: 99999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 85,
    realm: '大圣',
  },

  // ──────────────────────────────────────────────
  // 特殊商人NPC
  // ──────────────────────────────────────────────
  mount_merchant: {
    id: 'mount_merchant',
    name: '坐骑商人·龙马',
    description: '专门经营坐骑的商人，据说与龙族有渊源。他的坐骑都是精心培育的良驹。',
    dialogue: [
      '欢迎光临龙马阁！这里的坐骑都是精心培育的良驹。',
      '好的坐骑能大大提升修炼者的移动速度和战斗力。',
      '坐骑需要精心喂养，才能发挥最大潜力。',
      '高级坐骑可遇不可求，需要缘分。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '化龙秘境',
    shop: 'mount_shop',
  },

  pet_merchant: {
    id: 'pet_merchant',
    name: '灵宠商人·小凤',
    description: '一位可爱的少女，专门经营灵宠。她对灵宠极为了解，能与灵宠心灵相通。',
    dialogue: [
      '欢迎来到灵宠乐园！这里的灵宠都很可爱哦！',
      '灵宠可以帮你战斗，也可以陪伴你修炼。',
      '灵宠需要喂养和训练，才能变得更强。',
      '每只灵宠都有独特的技能，要好好培养。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 40,
    realm: '四极秘境',
    shop: 'pet_shop',
  },

  material_merchant: {
    id: 'material_merchant',
    name: '材料商人·铁锤',
    description: '一位粗犷的大汉，专门经营各种修炼材料。他的材料都是亲自采集的上品。',
    dialogue: [
      '嘿！需要什么材料？我这里应有尽有！',
      '源石、源晶、龙血，只要你出得起价！',
      '材料的品质很重要，差的材料炼不出好东西。',
      '大批量购买有优惠哦！',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '道宫秘境',
    shop: 'material_shop',
  },

  // ──────────────────────────────────────────────
  // 剧情NPC
  // ──────────────────────────────────────────────
  guide_elder: {
    id: 'guide_elder',
    name: '引路老人',
    description: '归元村的长者，引导初入修炼之路的年轻人。他似乎知道很多关于修炼界的事情。',
    dialogue: [
      '年轻人，你终于踏上了修炼之路。',
      '修炼之道，贵在坚持。不要急于求成。',
      '先去东荒旷野历练一番，熟悉战斗。',
      '等你实力足够了，可以去太玄门拜师。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（不可测）',
  },

  herb_boy: {
    id: 'herb_boy',
    name: '药童·小草',
    description: '药师的学徒，进山采药时被妖兽围困。他虽然修为不高，但对草药极为了解。',
    dialogue: [
      '谢谢您救了我！这些妖兽太可怕了。',
      '我是药师的学徒，进山采药时迷路了。',
      '这些灵草是我采的，送给您作为感谢。',
      '师父说修炼需要灵药辅助，您需要什么药？',
    ],
    isHostile: false, hp: 200, maxHp: 200, attack: 10, defense: 5,
    expReward: 0, goldReward: 0, drops: [], level: 5,
    realm: '轮海秘境',
  },

  wandering_swordsman: {
    id: 'wandering_swordsman',
    name: '流浪剑客·风无痕',
    description: '一位流浪天下的剑客，剑术高超，性格孤傲。他似乎在寻找某个人。',
    dialogue: [
      '在下风无痕，四处游历，寻找剑道真谛。',
      '剑者，当以剑心通明，一剑破万法。',
      '你若有兴趣，可与我切磋几招。',
      '山贼为祸百姓，正合我意，一起去除了他们！',
    ],
    isHostile: false, hp: 5000, maxHp: 5000, attack: 200, defense: 100,
    expReward: 0, goldReward: 0, drops: [], level: 25,
    realm: '道宫秘境',
  },

  sect_leader: {
    id: 'sect_leader',
    name: '太玄门掌门·玄天',
    description: '太玄门的掌门人，修为通天，德高望重。他统领太玄门数百年，培养了无数强者。',
    dialogue: [
      '年轻人，你来太玄门有何事？',
      '太玄门以道为本，以德为先。',
      '门派之间的纷争，需要用智慧来解决。',
      '若你有心向道，可拜入太玄门下。',
    ],
    isHostile: false, hp: 999999, maxHp: 999999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 100,
    realm: '准帝',
  },

  dragon_elder: {
    id: 'dragon_elder',
    name: '龙族长老·烛龙',
    description: '龙族的长老，据说活了数万年。他掌握着龙族的古老秘密。',
    dialogue: [
      '（龙族长老睁开双眼，龙威四溢）',
      '年轻人，你体内的龙脉已经觉醒。',
      '化龙之道，在于血脉与意志的融合。',
      '收集足够的龙血，你就能真正化龙。',
    ],
    isHostile: false, hp: 999999, maxHp: 999999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 100,
    realm: '大圣',
  },

  // ──────────────────────────────────────────────
  // 门派NPC
  // ──────────────────────────────────────────────
  taixuan_senior_disciple: {
    id: 'taixuan_senior_disciple',
    name: '太玄门大师兄·剑心',
    description: '太玄门的大师兄，修为高深，为人正直。他是所有师弟师妹的榜样。',
    dialogue: [
      '师弟/师妹，有什么需要帮忙的吗？',
      '修炼之道，贵在持之以恒。',
      '切磋是提升实力的好方法，来吧！',
      '门派试炼即将开始，准备好迎接挑战了吗？',
    ],
    isHostile: false, hp: 10000, maxHp: 10000, attack: 300, defense: 200,
    expReward: 0, goldReward: 0, drops: [], level: 40,
    realm: '化龙秘境',
  },

  outer_door_disciple: {
    id: 'outer_door_disciple',
    name: '太玄门外门弟子',
    description: '太玄门的外门弟子，负责看守山门。他虽然修为不高，但对门派极为忠诚。',
    dialogue: [
      '站住！你是来拜师的吗？',
      '太玄门是东荒最大的门派之一。',
      '想要加入太玄门，需要通过入门考核。',
      '山门内禁止喧哗，请保持安静。',
    ],
    isHostile: false, hp: 1000, maxHp: 1000, attack: 50, defense: 30,
    expReward: 0, goldReward: 0, drops: [], level: 15,
    realm: '苦海秘境',
  },

  inner_elder: {
    id: 'inner_elder',
    name: '太玄门内门长老',
    description: '太玄门的内门长老，负责教导内门弟子。他修为深厚，学识渊博。',
    dialogue: [
      '年轻人，你来找我有何事？',
      '突破境界需要足够的积累和机缘。',
      '源石是突破的关键材料，要多收集。',
      '修炼之道，在于悟性与勤奋的结合。',
    ],
    isHostile: false, hp: 50000, maxHp: 50000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 60,
    realm: '仙台秘境',
  },

  daogong_elder: {
    id: 'daogong_elder',
    name: '道宫长老',
    description: '专门指导道宫境界修炼的长老，对道宫的奥秘了如指掌。',
    dialogue: [
      '道宫境界，是修炼的重要转折点。',
      '道宫的开辟需要大量的道源石。',
      '道宫之内，蕴含着天地大道的奥秘。',
      '突破道宫后，你的实力将大幅提升。',
    ],
    isHostile: false, hp: 80000, maxHp: 80000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 70,
    realm: '仙台秘境',
  },

  // ──────────────────────────────────────────────
  // 世界NPC
  // ──────────────────────────────────────────────
  mysterious_old_man: {
    id: 'mysterious_old_man',
    name: '神秘老者',
    description: '一位行踪不定的神秘老者，总是在关键时刻出现。他的身份成谜，实力深不可测。',
    dialogue: [
      '（老者微微一笑）年轻人，我们又见面了。',
      '修炼之路，充满了未知与挑战。',
      '保持本心，方能走得更远。',
      '（老者说完便消失不见了）',
    ],
    isHostile: false, hp: 999999, maxHp: 999999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 99,
    realm: '（不可测）',
  },

  wandering_merchant: {
    id: 'wandering_merchant',
    name: '流浪商人',
    description: '一位四处游历的商人，他的货物种类繁多，价格公道。',
    dialogue: [
      '客官，需要些什么？我这里什么都有！',
      '刚从外地进货，有很多新鲜玩意儿。',
      '价格好商量，老顾客有优惠。',
      '下次再来，我给您留好货。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '道宫秘境',
    shop: 'wandering_shop',
  },

  fortune_teller: {
    id: 'fortune_teller',
    name: '算命先生·天机子',
    description: '自称能窥探天机的算命先生，他的预言有时奇准无比。',
    dialogue: [
      '年轻人，要算一卦吗？',
      '我看你印堂发亮，近日必有好运。',
      '修炼之道，天时地利人和缺一不可。',
      '小心近日的劫难，但不必害怕，自有贵人相助。',
    ],
    isHostile: false, hp: 9999, maxHp: 9999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '化龙秘境',
  },

  // ──────────────────────────────────────────────
  // 敌对NPC（新增怪物）
  // ──────────────────────────────────────────────
  wild_beast: {
    id: 'wild_beast',
    name: '野兽',
    description: '东荒旷野中的普通野兽，虽然不强，但数量众多。',
    dialogue: ['（发出低沉的咆哮）'],
    isHostile: true, hp: 200, maxHp: 200, attack: 20, defense: 10,
    expReward: 30, goldReward: 10, drops: ['beast_fur', 'beast_bone'],
    level: 3,
    realm: '轮海秘境',
  },

  bandit: {
    id: 'bandit',
    name: '山贼',
    description: '在山道上打劫的山贼，专门欺负弱小的修炼者。',
    dialogue: ['此路是我开，此树是我栽，要想从此过，留下买路财！'],
    isHostile: true, hp: 500, maxHp: 500, attack: 40, defense: 20,
    expReward: 60, goldReward: 30, drops: ['bandit_sword', 'gold_coin'],
    level: 8,
    realm: '轮海秘境',
  },

  abyss_creature: {
    id: 'abyss_creature',
    name: '深渊生物',
    description: '从深渊裂缝中涌出的虚空生物，形态诡异，力量强大。',
    dialogue: ['（发出诡异的嘶吼声）'],
    isHostile: true, hp: 8000, maxHp: 8000, attack: 250, defense: 180,
    expReward: 500, goldReward: 200, drops: ['void_essence', 'ghost_essence'],
    level: 45,
    realm: '化龙秘境',
  },

  sect_enemy: {
    id: 'sect_enemy',
    name: '敌对门派弟子',
    description: '敌对门派的弟子，在门派大战中出现。',
    dialogue: ['你们太玄门的时代结束了！'],
    isHostile: true, hp: 5000, maxHp: 5000, attack: 180, defense: 120,
    expReward: 300, goldReward: 150, drops: ['sect_honor_medal', 'source_crystal'],
    level: 35,
    realm: '四极秘境',
  },

  immortal_competitor: {
    id: 'immortal_competitor',
    name: '仙路竞争者',
    description: '来自各方势力的强者，都在争夺仙路的入场资格。',
    dialogue: ['仙路只属于最强者！'],
    isHostile: true, hp: 15000, maxHp: 15000, attack: 400, defense: 300,
    expReward: 800, goldReward: 400, drops: ['immortal_token', 'source_crystal'],
    level: 55,
    realm: '仙台秘境',
  },

  heaven_trial_enemy: {
    id: 'heaven_trial_enemy',
    name: '天道试炼者',
    description: '天道降下的试炼敌人，实力强大，不可轻敌。',
    dialogue: ['（天道之力凝聚成形）'],
    isHostile: true, hp: 20000, maxHp: 20000, attack: 500, defense: 350,
    expReward: 1000, goldReward: 500, drops: ['heaven_essence', 'scripture_shard_rare'],
    level: 60,
    realm: '仙台秘境',
  },

  race_enemy: {
    id: 'race_enemy',
    name: '异族战士',
    description: '来自异族的强大战士，实力不容小觑。',
    dialogue: ['（异族语言：消灭人类！）'],
    isHostile: true, hp: 25000, maxHp: 25000, attack: 600, defense: 400,
    expReward: 1200, goldReward: 600, drops: ['race_trophy', 'demon_beast_core'],
    level: 65,
    realm: '仙台秘境',
  },

  // ── 任务需要的NPC ──
  sect_elder: {
    id: 'sect_elder',
    name: '门派长老',
    description: '门派中的资深长老，负责处理门派内外事务。他德高望重，深受弟子敬仰。',
    dialogue: [
      '年轻人，你来找老夫有何事？',
      '门派的荣耀需要每一位弟子来维护。',
      '若有叛徒出现，必须立即清除。',
      '门派的未来掌握在你们手中。',
    ],
    isHostile: false, hp: 50000, maxHp: 50000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 70,
    realm: '仙台秘境',
  },

  sect_quest_master: {
    id: 'sect_quest_master',
    name: '门派任务长老',
    description: '负责发布门派日常任务的长老，每天都有新的任务等待完成。',
    dialogue: [
      '今日的门派任务已经准备好了。',
      '完成任务可以获得门派贡献和声望。',
      '每日任务会在凌晨重置，请及时完成。',
      '组队完成任务可获得额外奖励。',
    ],
    isHostile: false, hp: 20000, maxHp: 20000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 50,
    realm: '化龙秘境',
  },

  mount_master: {
    id: 'mount_master',
    name: '坐骑管理员',
    description: '专门负责坐骑照料和训练的管理员，对各种坐骑了如指掌。',
    dialogue: [
      '欢迎来到坐骑管理处！',
      '坐骑需要定期喂养和训练，才能保持最佳状态。',
      '好的坐骑能大大提升你的移动速度。',
      '坐骑进化需要特定的材料，要提前准备好。',
    ],
    isHostile: false, hp: 5000, maxHp: 5000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '道宫秘境',
  },

  pet_master: {
    id: 'pet_master',
    name: '灵宠训练师',
    description: '专门负责灵宠训练的师傅，能帮助灵宠提升实力。',
    dialogue: [
      '欢迎来到灵宠训练场！',
      '灵宠可以通过训练来提升等级和技能。',
      '每只灵宠都有独特的天赋，要善于培养。',
      '灵宠进化后会变得更强，但需要特定材料。',
    ],
    isHostile: false, hp: 5000, maxHp: 5000, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [], level: 30,
    realm: '道宫秘境',
  },
};

export default NEW_NPCS;
