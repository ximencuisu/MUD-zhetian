import { NpcRank } from './sectSkills';

// 功能NPC类型
export type FunctionNpcType = 'quest' | 'shop' | 'warehouse' | 'craft' | 'heal' | 'transport' | 'arena' | 'dungeon' | 'alchemy';

export interface FunctionNpcDef {
  id: string;
  name: string;
  rank: NpcRank;
  description: string;
  sect: string;
  functionType: FunctionNpcType;
  dialogue: string[];
  services: string[];
}

// 摇光圣地功能NPC
export const YAOGUAN_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'yg_quest_master',
    name: '摇光任务长老·李任务',
    rank: '外门长老',
    description: '负责发布门派任务的资深长老，每日都有新的任务发布。',
    sect: 'yaoguan',
    functionType: 'quest',
    dialogue: [
      '今日门派任务已更新，你可有兴趣接取？',
      '完成任务可获得丰厚的贡献值和奖励。',
      '门派任务分为每日任务、贡献任务和特殊任务。'
    ],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'yg_shop_master',
    name: '摇光商店掌柜·金掌柜',
    rank: '内门弟子',
    description: '管理门派商店的掌柜，出售各种丹药、法器和材料。',
    sect: 'yaoguan',
    functionType: 'shop',
    dialogue: [
      '欢迎光临摇光商店，这里有各种珍稀物品。',
      '门派弟子可用贡献值兑换物品。',
      '每日都有新货上架，记得常来看看。'
    ],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'yg_warehouse_master',
    name: '摇光仓库管理员·仓老',
    rank: '外门弟子',
    description: '管理门派公共仓库的老者，可以帮助弟子存放物品。',
    sect: 'yaoguan',
    functionType: 'warehouse',
    dialogue: [
      '需要存放物品吗？门派仓库很安全。',
      '每个弟子都有专属的储物空间。',
      '存放在仓库的物品不会丢失。'
    ],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'yg_craft_master',
    name: '摇光炼器师·火大师',
    rank: '内门长老',
    description: '门派炼器大师，可以锻造和强化法器。',
    sect: 'yaoguan',
    functionType: 'craft',
    dialogue: [
      '想要打造法器吗？需要准备材料。',
      '圣光之力可以强化法器的属性。',
      '炼器有风险，但成功后的收益也很大。'
    ],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'yg_alchemy_master',
    name: '摇光炼丹师·药圣',
    rank: '内门长老',
    description: '摇光圣地首席炼丹师，精通各种丹药炼制，可为你炼制高级丹药。',
    sect: 'yaoguan',
    functionType: 'alchemy',
    dialogue: [
      '想炼丹？准备好材料来找老夫。',
      '圣光之力加持，丹药品质更有保障。',
      '丹方都在这里，选一个开始吧。'
    ],
    services: ['craftPill']
  },
  {
    id: 'yg_heal_master',
    name: '摇光医仙·白仙子',
    rank: '真传弟子',
    description: '门派医仙，精通治疗之术，可以为弟子疗伤。',
    sect: 'yaoguan',
    functionType: 'heal',
    dialogue: [
      '受伤了吗？让我为你治疗。',
      '圣光之力可以快速恢复伤势。',
      '还可以为你炼制疗伤丹药。'
    ],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'yg_transport_master',
    name: '摇光传送使·空行者',
    rank: '真传弟子',
    description: '掌握空间传送之术，可以将弟子传送到各个重要地点。',
    sect: 'yaoguan',
    functionType: 'transport',
    dialogue: [
      '需要传送到其他地方吗？',
      '门派弟子可以免费传送到东荒各地。',
      '想去秘境探险吗？我可以送你一程。'
    ],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'yg_arena_master',
    name: '摇光竞技长老·战长老',
    rank: '内门长老',
    description: '管理门派竞技场的长老，负责组织门派切磋和比武。',
    sect: 'yaoguan',
    functionType: 'arena',
    dialogue: [
      '想要切磋武艺吗？竞技场随时开放。',
      '胜利可以获得贡献值和声望。',
      '每月还有门派大比，奖励丰厚！'
    ],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'yg_dungeon_master',
    name: '摇光秘境守护者·境老',
    rank: '太上长老',
    description: '守护门派秘境的古老存在，可以开启各种秘境试炼。',
    sect: 'yaoguan',
    functionType: 'dungeon',
    dialogue: [
      '想要挑战秘境吗？需要足够的实力。',
      '秘境中有各种珍稀材料和功法。',
      '越深的层次，奖励越丰厚，但也越危险。'
    ],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 姬家功能NPC
export const JI_FAMILY_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'ji_quest_master',
    name: '姬家任务长老·姬任务',
    rank: '外门长老',
    description: '负责发布姬家任务的资深长老。',
    sect: 'ji_family',
    functionType: 'quest',
    dialogue: ['姬家任务每日更新，不可错过。', '完成任务可获得虚空石等珍稀材料。'],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'ji_shop_master',
    name: '姬家商店掌柜·姬掌柜',
    rank: '内门弟子',
    description: '管理姬家商店，出售虚空相关物品。',
    sect: 'ji_family',
    functionType: 'shop',
    dialogue: ['虚空石、虚空戒指，应有尽有。', '姬家弟子可用贡献值兑换。'],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'ji_warehouse_master',
    name: '姬家仓库管理员·姬仓',
    rank: '外门弟子',
    description: '管理姬家仓库。',
    sect: 'ji_family',
    functionType: 'warehouse',
    dialogue: ['虚空之力保护着仓库中的每一件物品。'],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'ji_craft_master',
    name: '姬家炼器师·姬火',
    rank: '内门长老',
    description: '精通虚空炼器之术。',
    sect: 'ji_family',
    functionType: 'craft',
    dialogue: ['虚空之力可以锻造出空间法器。', '虚空戒指就是我打造的。'],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'ji_alchemy_master',
    name: '姬家炼丹师·丹老',
    rank: '内门长老',
    description: '姬家资深炼丹师，可为你炼制各种丹药。',
    sect: 'ji_family',
    functionType: 'alchemy',
    dialogue: ['虚空之力亦可入丹。', '想要炼制什么丹药？'],
    services: ['craftPill']
  },
  {
    id: 'ji_heal_master',
    name: '姬家医仙·姬白',
    rank: '真传弟子',
    description: '姬家医仙，精通治疗。',
    sect: 'ji_family',
    functionType: 'heal',
    dialogue: ['虚空之力亦可疗伤。', '让我为你治疗。'],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'ji_transport_master',
    name: '姬家传送使·姬空',
    rank: '真传弟子',
    description: '掌握虚空传送之术。',
    sect: 'ji_family',
    functionType: 'transport',
    dialogue: ['虚空传送，瞬息千里。', '想去哪里？'],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'ji_arena_master',
    name: '姬家竞技长老·姬战',
    rank: '内门长老',
    description: '管理姬家竞技场。',
    sect: 'ji_family',
    functionType: 'arena',
    dialogue: ['姬家弟子当勇武善战。', '来切磋一番？'],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'ji_dungeon_master',
    name: '姬家秘境守护者·姬境',
    rank: '太上长老',
    description: '守护姬家秘境。',
    sect: 'ji_family',
    functionType: 'dungeon',
    dialogue: ['姬家秘境藏有虚空经残篇。', '敢来挑战吗？'],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 太玄门功能NPC
export const TAIXUAN_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'tx_quest_master',
    name: '太玄任务长老·李速',
    rank: '外门长老',
    description: '负责发布太玄门任务的长老，速度极快。',
    sect: 'taixuan',
    functionType: 'quest',
    dialogue: ['太玄门任务讲究速度。', '快去接任务吧！'],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'tx_shop_master',
    name: '太玄商店掌柜·风掌柜',
    rank: '内门弟子',
    description: '管理太玄门商店。',
    sect: 'taixuan',
    functionType: 'shop',
    dialogue: ['疾风丹，速度提升50%！', '还有行字秘残篇出售。'],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'tx_warehouse_master',
    name: '太玄仓库管理员·风仓',
    rank: '外门弟子',
    description: '管理太玄门仓库。',
    sect: 'taixuan',
    functionType: 'warehouse',
    dialogue: ['存放物品，安全快捷。'],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'tx_craft_master',
    name: '太玄炼器师·风大师',
    rank: '内门长老',
    description: '精通速度类法器炼制。',
    sect: 'taixuan',
    functionType: 'craft',
    dialogue: ['速度型法器，天下无双。', '想要飞得更快吗？'],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'tx_alchemy_master',
    name: '太玄炼丹师·风药',
    rank: '内门长老',
    description: '太玄门炼丹大师，以疾风之法催动丹炉，炼丹速度极快。',
    sect: 'taixuan',
    functionType: 'alchemy',
    dialogue: ['疾风炼丹，快速成丹！', '丹药品质取决于火候与速度。'],
    services: ['craftPill']
  },
  {
    id: 'tx_heal_master',
    name: '太玄医仙·风白',
    rank: '真传弟子',
    description: '太玄门医仙。',
    sect: 'taixuan',
    functionType: 'heal',
    dialogue: ['行字秘亦可疗伤，速度极快。'],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'tx_transport_master',
    name: '太玄传送使·风行',
    rank: '真传弟子',
    description: '传送速度最快的使者。',
    sect: 'taixuan',
    functionType: 'transport',
    dialogue: ['想去哪里？瞬息即达！'],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'tx_arena_master',
    name: '太玄竞技长老·风战',
    rank: '内门长老',
    description: '管理太玄门竞技场。',
    sect: 'taixuan',
    functionType: 'arena',
    dialogue: ['速度决定胜负！', '来比试谁更快？'],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'tx_dungeon_master',
    name: '太玄秘境守护者·风境',
    rank: '太上长老',
    description: '守护太玄门秘境。',
    sect: 'taixuan',
    functionType: 'dungeon',
    dialogue: ['秘境中藏有行字秘完整版线索。', '速度够快才能通过试炼。'],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 紫府圣地功能NPC
export const ZIFU_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'zf_quest_master',
    name: '紫府任务长老·紫任务',
    rank: '外门长老',
    description: '负责发布紫府圣地任务。',
    sect: 'zifu',
    functionType: 'quest',
    dialogue: ['紫气东来，任务更新。', '完成任务，紫气加身。'],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'zf_shop_master',
    name: '紫府商店掌柜·紫掌柜',
    rank: '内门弟子',
    description: '管理紫府圣地商店。',
    sect: 'zifu',
    functionType: 'shop',
    dialogue: ['紫气精华，攻防兼备。', '紫府大阵材料，应有尽有。'],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'zf_warehouse_master',
    name: '紫府仓库管理员·紫仓',
    rank: '外门弟子',
    description: '管理紫府圣地仓库。',
    sect: 'zifu',
    functionType: 'warehouse',
    dialogue: ['紫色源力保护着仓库。'],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'zf_craft_master',
    name: '紫府炼器师·紫火',
    rank: '内门长老',
    description: '精通攻防兼备法器炼制。紫府炼器，攻防一体。',
    sect: 'zifu',
    functionType: 'craft',
    dialogue: ['紫府炼器，攻防一体。', '想要打造攻防兼备的法器吗？'],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'zf_alchemy_master',
    name: '紫府炼丹师·紫丹',
    rank: '内门长老',
    description: '紫府圣地炼丹大师，以紫气入丹，丹药品质上乘。',
    sect: 'zifu',
    functionType: 'alchemy',
    dialogue: ['紫气化丹，药效倍增。', '想要炼制什么丹药？'],
    services: ['craftPill']
  },
  {
    id: 'zf_heal_master',
    name: '紫府医仙·紫白',
    rank: '真传弟子',
    description: '紫府圣地医仙。',
    sect: 'zifu',
    functionType: 'heal',
    dialogue: ['紫气疗伤，效果极佳。'],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'zf_transport_master',
    name: '紫府传送使·紫空',
    rank: '真传弟子',
    description: '紫府圣地传送使。',
    sect: 'zifu',
    functionType: 'transport',
    dialogue: ['紫气传送，安全快捷。'],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'zf_arena_master',
    name: '紫府竞技长老·紫战',
    rank: '内门长老',
    description: '管理紫府圣地竞技场。',
    sect: 'zifu',
    functionType: 'arena',
    dialogue: ['紫府弟子，攻防无双。', '来战一场？'],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'zf_dungeon_master',
    name: '紫府秘境守护者·紫境',
    rank: '太上长老',
    description: '守护紫府圣地秘境。',
    sect: 'zifu',
    functionType: 'dungeon',
    dialogue: ['紫府秘境，紫气浓郁。', '攻防试炼，等你挑战。'],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 姜家功能NPC
export const JIANG_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'jg_quest_master',
    name: '姜家任务长老·姜任务',
    rank: '外门长老',
    description: '负责发布姜家任务。',
    sect: 'jiang_family',
    functionType: 'quest',
    dialogue: ['姜家任务，以柔克刚。', '完成任务，柔劲提升。'],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'jg_shop_master',
    name: '姜家商店掌柜·姜掌柜',
    rank: '内门弟子',
    description: '管理姜家商店。',
    sect: 'jiang_family',
    functionType: 'shop',
    dialogue: ['炼体丹，增强体质。', '源术材料，应有尽有。'],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'jg_warehouse_master',
    name: '姜家仓库管理员·姜仓',
    rank: '外门弟子',
    description: '管理姜家仓库。',
    sect: 'jiang_family',
    functionType: 'warehouse',
    dialogue: ['柔劲保护，安全可靠。'],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'jg_craft_master',
    name: '姜家炼器师·姜火',
    rank: '内门长老',
    description: '精通柔劲法器炼制。',
    sect: 'jiang_family',
    functionType: 'craft',
    dialogue: ['以柔克刚，法器亦然。', '柔劲法器，防御无双。'],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'jg_alchemy_master',
    name: '姜家炼丹师·姜药',
    rank: '内门长老',
    description: '姜家炼丹大师，以柔劲控火，丹药温和而效力持久。',
    sect: 'jiang_family',
    functionType: 'alchemy',
    dialogue: ['柔劲炼丹，药力持久。', '想要什么丹药？'],
    services: ['craftPill']
  },
  {
    id: 'jg_heal_master',
    name: '姜家医仙·姜白',
    rank: '真传弟子',
    description: '姜家医仙。',
    sect: 'jiang_family',
    functionType: 'heal',
    dialogue: ['柔劲疗伤，温和有效。'],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'jg_transport_master',
    name: '姜家传送使·姜空',
    rank: '真传弟子',
    description: '姜家传送使。',
    sect: 'jiang_family',
    functionType: 'transport',
    dialogue: ['想去哪里？'],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'jg_arena_master',
    name: '姜家竞技长老·姜战',
    rank: '内门长老',
    description: '管理姜家竞技场。',
    sect: 'jiang_family',
    functionType: 'arena',
    dialogue: ['以柔克刚，以弱胜强。', '姜家弟子，来战！'],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'jg_dungeon_master',
    name: '姜家秘境守护者·姜境',
    rank: '太上长老',
    description: '守护姜家秘境。',
    sect: 'jiang_family',
    functionType: 'dungeon',
    dialogue: ['姜家秘境，柔劲试炼。', '以弱胜强，方得真传。'],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 妖族功能NPC
export const YAO_FUNCTION_NPCS: FunctionNpcDef[] = [
  {
    id: 'yao_quest_master',
    name: '妖族任务长老·妖任务',
    rank: '外门长老',
    description: '负责发布妖族任务。',
    sect: 'yao_clan',
    functionType: 'quest',
    dialogue: ['妖族任务，血脉觉醒。', '完成任务，妖力提升。'],
    services: ['refreshQuests', 'acceptQuest', 'completeQuest']
  },
  {
    id: 'yao_shop_master',
    name: '妖族商店掌柜·妖掌柜',
    rank: '内门弟子',
    description: '管理妖族商店。',
    sect: 'yao_clan',
    functionType: 'shop',
    dialogue: ['妖血丹，激发血脉。', '龙血，肉身成圣。'],
    services: ['buyItem', 'sellItem', 'refreshShop']
  },
  {
    id: 'yao_warehouse_master',
    name: '妖族仓库管理员·妖仓',
    rank: '外门弟子',
    description: '管理妖族仓库。',
    sect: 'yao_clan',
    functionType: 'warehouse',
    dialogue: ['妖力保护，安全可靠。'],
    services: ['deposit', 'withdraw', 'expandStorage']
  },
  {
    id: 'yao_craft_master',
    name: '妖族炼器师·妖火',
    rank: '内门长老',
    description: '精通妖族法器炼制。',
    sect: 'yao_clan',
    functionType: 'craft',
    dialogue: ['妖族法器，天生神通。', '血脉之力，融入法器。'],
    services: ['forgeWeapon', 'forgeArmor', 'enhanceEquipment', 'refineMaterial']
  },
  {
    id: 'yao_alchemy_master',
    name: '妖族炼丹师·妖药',
    rank: '内门长老',
    description: '妖族炼丹大师，以血脉之力炼丹，丹药蕴含妖力精华。',
    sect: 'yao_clan',
    functionType: 'alchemy',
    dialogue: ['血脉入丹，药力非凡。', '妖族丹药，天下无双。'],
    services: ['craftPill']
  },
  {
    id: 'yao_heal_master',
    name: '妖族医仙·妖白',
    rank: '真传弟子',
    description: '妖族医仙。',
    sect: 'yao_clan',
    functionType: 'heal',
    dialogue: ['妖血沸腾，伤势自愈。', '青莲圣火，疗伤圣品。'],
    services: ['heal', 'cureStatus', 'buyPotion']
  },
  {
    id: 'yao_transport_master',
    name: '妖族传送使·妖空',
    rank: '真传弟子',
    description: '妖族传送使。',
    sect: 'yao_clan',
    functionType: 'transport',
    dialogue: ['想去哪里？妖力传送！'],
    services: ['teleportToWorld', 'teleportToDungeon', 'teleportToZone']
  },
  {
    id: 'yao_arena_master',
    name: '妖族竞技长老·妖战',
    rank: '内门长老',
    description: '管理妖族竞技场。',
    sect: 'yao_clan',
    functionType: 'arena',
    dialogue: ['妖族好战，来战一场！', '血脉之力，战斗觉醒。'],
    services: ['startDuel', 'startTournament', 'viewRankings']
  },
  {
    id: 'yao_dungeon_master',
    name: '妖族秘境守护者·妖境',
    rank: '太上长老',
    description: '守护妖族秘境。',
    sect: 'yao_clan',
    functionType: 'dungeon',
    dialogue: ['妖族秘境，血脉试炼。', '青帝传承，等你发掘。'],
    services: ['enterSectDungeon', 'enterTreasury', 'enterTrainingGround']
  },
];

// 所有功能NPC
export const ALL_FUNCTION_NPCS: FunctionNpcDef[] = [
  ...YAOGUAN_FUNCTION_NPCS,
  ...JI_FAMILY_FUNCTION_NPCS,
  ...TAIXUAN_FUNCTION_NPCS,
  ...ZIFU_FUNCTION_NPCS,
  ...JIANG_FUNCTION_NPCS,
  ...YAO_FUNCTION_NPCS,
];

// 按门派分类的功能NPC
export const SECT_FUNCTION_NPCS: Record<string, FunctionNpcDef[]> = {
  yaoguan: YAOGUAN_FUNCTION_NPCS,
  ji_family: JI_FAMILY_FUNCTION_NPCS,
  taixuan: TAIXUAN_FUNCTION_NPCS,
  zifu: ZIFU_FUNCTION_NPCS,
  jiang_family: JIANG_FUNCTION_NPCS,
  yao_clan: YAO_FUNCTION_NPCS,
};

// 功能类型名称映射
export const FUNCTION_TYPE_NAMES: Record<FunctionNpcType, string> = {
  quest: '任务发布',
  shop: '商店',
  warehouse: '仓库',
  craft: '炼器',
  alchemy: '炼丹',
  heal: '治疗',
  transport: '传送',
  arena: '竞技场',
  dungeon: '秘境',
};

// 功能类型图标映射
export const FUNCTION_TYPE_ICONS: Record<FunctionNpcType, string> = {
  quest: '📜',
  shop: '🏪',
  warehouse: '📦',
  craft: '🔨',
  alchemy: '⚗️',
  heal: '💊',
  transport: '🌀',
  arena: '⚔️',
  dungeon: '🏰',
};
