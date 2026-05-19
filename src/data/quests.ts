import { Quest, QuestObjective } from '../types/game';

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: {
    exp: number;
    gold: number;
    items?: string[];
    reputation?: Record<string, number>;
  };
  levelRequirement: number;
  questType: 'main' | 'side' | 'daily';
  prerequisite?: string[];
  autoComplete?: boolean;
  sectExclusive?: string;
  giverId?: string; // 任务发布者 NPC ID
}

export const QUESTS: Record<string, QuestDefinition> = {
  // ──────────────────────────────────────────────
  // 主线任务
  // ──────────────────────────────────────────────
  main_awakening: {
    id: 'main_awakening',
    title: '觉醒：踏上修炼之路',
    description: '在引路老人的指引下，正式开始你的修炼之路。',
    objectives: [
      { type: 'talk', targetId: 'guide_elder', description: '与引路老人交谈', current: 0, required: 1 },
      { type: 'explore', targetId: 'guiyuan_village_square', description: '前往归元村广场', current: 0, required: 1 },
    ],
    rewards: {
      exp: 100,
      gold: 50,
      items: ['primary_pill'],
    },
    levelRequirement: 1,
    questType: 'main',
    autoComplete: true,
    giverId: 'guide_elder',
  },

  main_first_combat: {
    id: 'main_first_combat',
    title: '初战：击败山鸡',
    description: '在归元村东边的树林中，有许多低级妖兽出没，是修炼者练手的好去处。',
    objectives: [
      { type: 'travel', targetId: 'donghuang_plain', description: '前往东荒旷野', current: 0, required: 1 },
      { type: 'kill', targetId: 'plain_chicken', description: '击败山鸡', current: 0, required: 5 },
    ],
    rewards: {
      exp: 300,
      gold: 100,
      items: ['basic_equipment_box'],
    },
    levelRequirement: 1,
    questType: 'main',
  },

  main_join_sect: {
    id: 'main_join_sect',
    title: '入门：加入门派',
    description: '在东荒旷野历练后，是时候选择一个门派，加入修炼者的行列了。',
    objectives: [
      { type: 'reach_level', targetId: '10', description: '等级达到10级', current: 0, required: 1 },
      { type: 'travel', targetId: 'taixuan_outer', description: '前往太玄门', current: 0, required: 1 },
      { type: 'talk', targetId: 'outer_door_disciple', description: '与山门弟子交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 500,
      gold: 200,
      items: ['sect_entrance_token'],
    },
    levelRequirement: 10,
    questType: 'main',
  },

  main_breakthrough: {
    id: 'main_breakthrough',
    title: '突破：开辟苦海',
    description: '作为修炼者，第一次突破至关重要。在门派的帮助下，开辟你的苦海。',
    objectives: [
      { type: 'talk', targetId: 'inner_elder', description: '寻找内门长老', current: 0, required: 1 },
      { type: 'collect', targetId: 'source_stone', description: '收集源石', current: 0, required: 3 },
      { type: 'breakthrough', description: '完成苦海突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 1000,
      gold: 500,
      items: ['breakthrough_pill'],
      reputation: { taixuan_sect: 100 },
    },
    levelRequirement: 15,
    questType: 'main',
  },

  main_face_sect_trial: {
    id: 'main_face_sect_trial',
    title: '试炼：门派考核',
    description: '完成门派试炼，证明你的实力，获得门派的认可。',
    objectives: [
      { type: 'enter_dungeon', targetId: 'taixuan_trial_cave', description: '进入太玄试炼洞', current: 0, required: 1 },
      { type: 'kill_boss', targetId: 'trial_boss', description: '击败试炼BOSS', current: 0, required: 1 },
      { type: 'complete_dungeon', targetId: 'taixuan_trial_cave', description: '完成试炼洞', current: 0, required: 1 },
    ],
    rewards: {
      exp: 2000,
      gold: 1000,
      items: ['silver_medal'],
      reputation: { taixuan_sect: 200 },
    },
    levelRequirement: 20,
    questType: 'main',
  },

  main_enter_central_city: {
    id: 'main_enter_central_city',
    title: '进城：前往中州神城',
    description: '门派试炼通过后，是时候前往更广阔的世界。中州神城是东荒最繁华的城池。',
    objectives: [
      { type: 'travel', targetId: 'central_city_entrance', description: '前往中州神城', current: 0, required: 1 },
      { type: 'talk', targetId: 'city_guard', description: '与神城卫兵交谈', current: 0, required: 1 },
      { type: 'visit', targetId: 'central_city_square', description: '参观中央广场', current: 0, required: 1 },
    ],
    rewards: {
      exp: 3000,
      gold: 2000,
      items: ['city_map'],
    },
    levelRequirement: 25,
    questType: 'main',
  },

  // ──────────────────────────────────────────────
  // 支线任务
  // ──────────────────────────────────────────────
  side_collect_herbs: {
    id: 'side_collect_herbs',
    title: '采药：帮助药师',
    description: '归元村的药师需要一些珍稀药材，你能帮忙采集吗？',
    objectives: [
      { type: 'collect', targetId: 'green_herb', description: '采集灵草', current: 0, required: 5 },
      { type: 'collect', targetId: 'red_mushroom', description: '采集红菇', current: 0, required: 3 },
    ],
    rewards: {
      exp: 200,
      gold: 150,
      items: ['health_pill'],
    },
    levelRequirement: 1,
    questType: 'side',
    prerequisite: ['main_awakening'],
  },

  side_hunt_poachers: {
    id: 'side_hunt_poachers',
    title: '除害：狩猎偷猎者',
    description: '东荒旷野出现了偷猎者，他们滥杀妖兽，破坏生态。需要你前去阻止。',
    objectives: [
      { type: 'kill', targetId: 'poacher', description: '击败偷猎者', current: 0, required: 3 },
    ],
    rewards: {
      exp: 500,
      gold: 300,
      reputation: { guiyuan_village: 50 },
    },
    levelRequirement: 10,
    questType: 'side',
    prerequisite: ['main_first_combat'],
  },

  side_treasure_map: {
    id: 'side_treasure_map',
    title: '寻宝：古墓地图',
    description: '一位神秘老者给你一张古墓地图，据说里面藏有上古宝藏。',
    objectives: [
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处', current: 0, required: 1 },
      { type: 'find_item', targetId: 'treasure_chest', description: '找到宝箱', current: 0, required: 1 },
    ],
    rewards: {
      exp: 1000,
      gold: 800,
      items: ['rare_weapon_fragment'],
    },
    levelRequirement: 15,
    questType: 'side',
  },

  side_sect_discipline: {
    id: 'side_sect_discipline',
    title: '门规：惩治叛徒',
    description: '门派中发现有叛徒与外敌勾结，需要你前去惩治。',
    objectives: [
      { type: 'kill', targetId: 'sect_traitor', description: '击败叛徒', current: 0, required: 1 },
      { type: 'collect', targetId: 'traitor_letter', description: '收集叛徒的信件', current: 0, required: 1 },
    ],
    rewards: {
      exp: 1500,
      gold: 1000,
      items: ['sect_honor_medal'],
      reputation: { taixuan_sect: 150 },
    },
    levelRequirement: 20,
    questType: 'side',
    prerequisite: ['main_join_sect'],
  },

  side_demon_mountain: {
    id: 'side_demon_mountain',
    title: '探险：天妖山脉',
    description: '天妖山脉传来异动，有妖兽为祸人间。需要有勇士前去探查。',
    objectives: [
      { type: 'travel', targetId: 'demon_beast_mountain_entrance', description: '前往天妖山脉', current: 0, required: 1 },
      { type: 'kill', targetId: 'mountain_demon', description: '击败山中妖兽', current: 0, required: 5 },
      { type: 'talk', targetId: 'demon_merchant', description: '与妖界商人交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 2000,
      gold: 1500,
      items: ['demon_beast_core'],
    },
    levelRequirement: 25,
    questType: 'side',
  },

  side_battlefield_mystery: {
    id: 'side_battlefield_mystery',
    title: '探秘：古皇战场',
    description: '古皇战场近期有异动，传闻有人在战场深处发现了古皇遗物。',
    objectives: [
      { type: 'travel', targetId: 'ancient_emperor_battlefield_entrance', description: '前往古皇战场', current: 0, required: 1 },
      { type: 'talk', targetId: 'battlefield_scout', description: '与战场斥候交谈', current: 0, required: 1 },
      { type: 'collect', targetId: 'emperor_blood', description: '收集皇血', current: 0, required: 3 },
    ],
    rewards: {
      exp: 3000,
      gold: 3000,
      items: ['ancient_scripture_fragment'],
    },
    levelRequirement: 30,
    questType: 'side',
  },

  side_arena_fame: {
    id: 'side_arena_fame',
    title: '扬名：竞技场挑战',
    description: '中州神城竞技场是成名的好地方，去那里证明你的实力吧！',
    objectives: [
      { type: 'travel', targetId: 'central_city_arena', description: '前往竞技场', current: 0, required: 1 },
      { type: 'pvp_win', description: '赢得竞技场比赛', current: 0, required: 3 },
    ],
    rewards: {
      exp: 2500,
      gold: 2000,
      items: ['arena_fighter_token'],
    },
    levelRequirement: 28,
    questType: 'side',
    prerequisite: ['main_enter_central_city'],
  },

  // ──────────────────────────────────────────────
  // 每日任务
  // ──────────────────────────────────────────────
  daily_collect_resources: {
    id: 'daily_collect_resources',
    title: '日常：资源收集',
    description: '每天收集一定数量的资源，可获得丰厚奖励。',
    objectives: [
      { type: 'collect', targetId: 'source_stone', description: '收集源石', current: 0, required: 10 },
    ],
    rewards: {
      exp: 500,
      gold: 300,
      items: ['daily_box'],
    },
    levelRequirement: 10,
    questType: 'daily',
  },

  daily_dungeon_clear: {
    id: 'daily_dungeon_clear',
    title: '日常：副本挑战',
    description: '每天完成一次副本挑战，可获得额外奖励。',
    objectives: [
      { type: 'complete_dungeon', description: '完成任意副本', current: 0, required: 1 },
    ],
    rewards: {
      exp: 1000,
      gold: 500,
      items: ['dungeon_token'],
    },
    levelRequirement: 15,
    questType: 'daily',
  },

  daily_pvp_battle: {
    id: 'daily_pvp_battle',
    title: '日常：竞技切磋',
    description: '每天在竞技场进行一场切磋，可提升战斗技巧。',
    objectives: [
      { type: 'pvp_participate', description: '参加竞技场比赛', current: 0, required: 1 },
    ],
    rewards: {
      exp: 800,
      gold: 400,
      reputation: { central_city: 20 },
    },
    levelRequirement: 25,
    questType: 'daily',
    prerequisite: ['main_enter_central_city'],
  },

  // ──────────────────────────────────────────────
  // 师门任务（门派专属）
  // ──────────────────────────────────────────────
  sect_daily_delivery: {
    id: 'sect_daily_delivery',
    title: '师门·传递书信',
    description: '门派长老需要你将一封书信送到中州神城。',
    objectives: [
      { type: 'travel', targetId: 'central_city_entrance', description: '前往中州神城', current: 0, required: 1 },
      { type: 'talk', targetId: 'city_official', description: '将书信交给城主府官员', current: 0, required: 1 },
    ],
    rewards: {
      exp: 300,
      gold: 200,
      reputation: { taixuan_sect: 30 },
    },
    levelRequirement: 10,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
    sectExclusive: 'taixuan_sect',
  },

  sect_daily_collect: {
    id: 'sect_daily_collect',
    title: '师门·采集灵材',
    description: '门派炼丹需要高品质的源晶，去采集一些回来。',
    objectives: [
      { type: 'collect', targetId: 'source_crystal', description: '收集源晶', current: 0, required: 3 },
    ],
    rewards: {
      exp: 400,
      gold: 250,
      reputation: { taixuan_sect: 40 },
    },
    levelRequirement: 15,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
    sectExclusive: 'taixuan_sect',
  },

  sect_daily_hunt: {
    id: 'sect_daily_hunt',
    title: '师门·历练狩猎',
    description: '去东荒旷野历练，击杀指定数量的妖兽。',
    objectives: [
      { type: 'travel', targetId: 'donghuang_plain', description: '前往东荒旷野', current: 0, required: 1 },
      { type: 'kill', targetId: 'forest_demon_beast', description: '击败林中妖兽', current: 0, required: 3 },
    ],
    rewards: {
      exp: 500,
      gold: 300,
      reputation: { taixuan_sect: 50 },
    },
    levelRequirement: 12,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
    sectExclusive: 'taixuan_sect',
  },

  sect_daily_spar: {
    id: 'sect_daily_spar',
    title: '师门·同门切磋',
    description: '与同门师兄弟切磋武艺，互相进步。',
    objectives: [
      { type: 'talk', targetId: 'taixuan_senior_disciple', description: '找到大师兄切磋', current: 0, required: 1 },
      { type: 'pvp_win', description: '切磋获胜', current: 0, required: 1 },
    ],
    rewards: {
      exp: 600,
      gold: 350,
      reputation: { taixuan_sect: 60 },
    },
    levelRequirement: 18,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
    sectExclusive: 'taixuan_sect',
  },

  sect_weekly_trial: {
    id: 'sect_weekly_trial',
    title: '师门·每周试炼',
    description: '完成太玄试炼洞，证明自己的实力。',
    objectives: [
      { type: 'enter_dungeon', targetId: 'taixuan_trial_cave', description: '进入太玄试炼洞', current: 0, required: 1 },
      { type: 'complete_dungeon', targetId: 'taixuan_trial_cave', description: '完成试炼', current: 0, required: 1 },
    ],
    rewards: {
      exp: 2000,
      gold: 1000,
      reputation: { taixuan_sect: 200 },
      items: ['sect_contribution_token'],
    },
    levelRequirement: 20,
    questType: 'daily',
    prerequisite: ['main_face_sect_trial'],
    sectExclusive: 'taixuan_sect',
  },

  sect_daily_meditation: {
    id: 'sect_daily_meditation',
    title: '师门·感悟修炼',
    description: '在门派修炼场静心感悟，提升修炼效率。',
    objectives: [
      { type: 'cultivate', description: '完成挂机修炼', current: 0, required: 1 },
    ],
    rewards: {
      exp: 200,
      gold: 100,
      reputation: { taixuan_sect: 20 },
    },
    levelRequirement: 5,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
    sectExclusive: 'taixuan_sect',
  },

  // ──────────────────────────────────────────────
  // 活动副本任务
  // ──────────────────────────────────────────────
  event_beast_tide: {
    id: 'event_beast_tide',
    title: '活动·妖兽攻城',
    description: '妖兽大军即将来袭！保卫中州神城！',
    objectives: [
      { type: 'kill', targetId: 'beast_tide_enemy', description: '击杀来袭妖兽', current: 0, required: 20 },
      { type: 'survive', description: '存活至活动结束', current: 0, required: 1 },
    ],
    rewards: {
      exp: 5000,
      gold: 3000,
      items: ['beast_tide_medal', 'rare_equipment_box'],
    },
    levelRequirement: 30,
    questType: 'main',
  },

  event_emperor_tomb: {
    id: 'event_emperor_tomb',
    title: '活动·皇陵探秘',
    description: '皇陵入口开启，探寻古皇遗迹！',
    objectives: [
      { type: 'enter_dungeon', targetId: 'emperor_dungeon', description: '进入古帝陵', current: 0, required: 1 },
      { type: 'kill_boss', targetId: 'edz_emperor_soul', description: '击败帝魂', current: 0, required: 1 },
      { type: 'collect', targetId: 'emperor_blood', description: '收集皇血', current: 0, required: 1 },
    ],
    rewards: {
      exp: 8000,
      gold: 5000,
      items: ['emperor_relic', 'ancient_scripture_fragment'],
    },
    levelRequirement: 35,
    questType: 'main',
  },

  // ──────────────────────────────────────────────
  // 后期主线任务（道宫境界）
  // ──────────────────────────────────────────────
  main_daogong_insight: {
    id: 'main_daogong_insight',
    title: '感悟：道宫初现',
    description: '你的苦海已圆满，是时候感悟道宫的奥秘了。',
    objectives: [
      { type: 'reach_level', targetId: '20', description: '等级达到20级', current: 0, required: 1 },
      { type: 'talk', targetId: 'daogong_elder', description: '寻找道宫长老', current: 0, required: 1 },
      { type: 'collect', targetId: 'dao_stone', description: '收集道源石', current: 0, required: 5 },
    ],
    rewards: {
      exp: 5000,
      gold: 3000,
      items: ['daogong_pill'],
    },
    levelRequirement: 20,
    questType: 'main',
    prerequisite: ['main_face_sect_trial'],
  },

  main_daogong_breakthrough: {
    id: 'main_daogong_breakthrough',
    title: '突破：开辟道宫',
    description: '收集足够的道源石后，尝试开辟道宫。',
    objectives: [
      { type: 'collect', targetId: 'dao_stone', description: '收集道源石', current: 0, required: 10 },
      { type: 'breakthrough', description: '完成道宫突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 10000,
      gold: 5000,
      items: ['daogong_weapon'],
      reputation: { taixuan_sect: 500 },
    },
    levelRequirement: 25,
    questType: 'main',
    prerequisite: ['main_daogong_insight'],
  },

  // ──────────────────────────────────────────────
  // 后期主线任务（四极境界）
  // ──────────────────────────────────────────────
  main_siji_trial: {
    id: 'main_siji_trial',
    title: '试炼：四极之地',
    description: '四极之地是修炼者的圣地，只有通过试炼才能进入。',
    objectives: [
      { type: 'reach_level', targetId: '30', description: '等级达到30级', current: 0, required: 1 },
      { type: 'enter_dungeon', targetId: 'siji_trial', description: '进入四极试炼', current: 0, required: 1 },
      { type: 'kill_boss', targetId: 'siji_guardian', description: '击败四极守护者', current: 0, required: 1 },
    ],
    rewards: {
      exp: 15000,
      gold: 8000,
      items: ['siji_medal'],
    },
    levelRequirement: 30,
    questType: 'main',
    prerequisite: ['main_daogong_breakthrough'],
  },

  main_siji_breakthrough: {
    id: 'main_siji_breakthrough',
    title: '突破：四极圆满',
    description: '通过四极试炼后，你已准备好突破四极境界。',
    objectives: [
      { type: 'collect', targetId: 'siji_crystal', description: '收集四极晶石', current: 0, required: 8 },
      { type: 'breakthrough', description: '完成四极突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 20000,
      gold: 10000,
      items: ['siji_armor'],
    },
    levelRequirement: 35,
    questType: 'main',
    prerequisite: ['main_siji_trial'],
  },

  // ──────────────────────────────────────────────
  // 后期主线任务（化龙境界）
  // ──────────────────────────────────────────────
  main_hualong_dragon: {
    id: 'main_hualong_dragon',
    title: '化龙：龙脉觉醒',
    description: '化龙境界需要唤醒体内的龙脉之力。',
    objectives: [
      { type: 'reach_level', targetId: '40', description: '等级达到40级', current: 0, required: 1 },
      { type: 'collect', targetId: 'dragon_blood', description: '收集龙血', current: 0, required: 10 },
      { type: 'talk', targetId: 'dragon_elder', description: '寻找龙族长老', current: 0, required: 1 },
    ],
    rewards: {
      exp: 30000,
      gold: 15000,
      items: ['dragon_pill'],
    },
    levelRequirement: 40,
    questType: 'main',
    prerequisite: ['main_siji_breakthrough'],
  },

  main_hualong_breakthrough: {
    id: 'main_hualong_breakthrough',
    title: '突破：化龙成功',
    description: '龙脉觉醒后，尝试化龙突破。',
    objectives: [
      { type: 'collect', targetId: 'dragon_blood', description: '收集龙血', current: 0, required: 20 },
      { type: 'breakthrough', description: '完成化龙突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 50000,
      gold: 25000,
      items: ['dragon_weapon'],
    },
    levelRequirement: 45,
    questType: 'main',
    prerequisite: ['main_hualong_dragon'],
  },

  // ──────────────────────────────────────────────
  // 后期主线任务（仙台境界）
  // ──────────────────────────────────────────────
  main_xiantai_ascent: {
    id: 'main_xiantai_ascent',
    title: '仙台：登临仙台',
    description: '仙台是修炼者的终极目标之一，只有最强大的修炼者才能登临。',
    objectives: [
      { type: 'reach_level', targetId: '50', description: '等级达到50级', current: 0, required: 1 },
      { type: 'enter_dungeon', targetId: 'xiantai_dungeon', description: '进入仙台秘境', current: 0, required: 1 },
      { type: 'kill_boss', targetId: 'xiantai_guardian', description: '击败仙台守护者', current: 0, required: 1 },
    ],
    rewards: {
      exp: 80000,
      gold: 40000,
      items: ['xiantai_medal'],
    },
    levelRequirement: 50,
    questType: 'main',
    prerequisite: ['main_hualong_breakthrough'],
  },

  main_xiantai_breakthrough: {
    id: 'main_xiantai_breakthrough',
    title: '突破：仙台圆满',
    description: '通过仙台试炼后，尝试突破仙台境界。',
    objectives: [
      { type: 'collect', targetId: 'xiantai_crystal', description: '收集仙台晶石', current: 0, required: 15 },
      { type: 'breakthrough', description: '完成仙台突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 100000,
      gold: 50000,
      items: ['xiantai_weapon'],
    },
    levelRequirement: 55,
    questType: 'main',
    prerequisite: ['main_xiantai_ascent'],
  },

  // ──────────────────────────────────────────────
  // 终极主线任务（仙台之后）
  // ──────────────────────────────────────────────
  main_donghuang_explore: {
    id: 'main_donghuang_explore',
    title: '历练：东荒巡游',
    description: '你已初入修炼之门，是时候踏遍东荒大地，见识更广阔的世界了。',
    objectives: [
      { type: 'travel', targetId: 'donghuang_plain', description: '前往东荒旷野', current: 0, required: 1 },
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处', current: 0, required: 1 },
      { type: 'travel', targetId: 'source_mine_entrance', description: '前往源石矿脉', current: 0, required: 1 },
      { type: 'kill', targetId: 'any', description: '击败沿途妖兽', current: 0, required: 10 },
    ],
    rewards: {
      exp: 800,
      gold: 400,
      items: ['explorer_medal'],
    },
    levelRequirement: 8,
    questType: 'main',
    prerequisite: ['main_first_combat'],
  },

  main_find_guide: {
    id: 'main_find_guide',
    title: '奇遇：隐世高人',
    description: '传闻东荒深处有一位隐世高人，修为通天彻地，若能得其指点，修炼之路将事半功倍。',
    objectives: [
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处寻找', current: 0, required: 1 },
      { type: 'talk', targetId: 'traveling_sage', description: '与隐世高人交谈', current: 0, required: 1 },
      { type: 'collect', targetId: 'source_stone', description: '呈上源石作为拜师礼', current: 0, required: 5 },
    ],
    rewards: {
      exp: 1500,
      gold: 800,
      items: ['guide_medal', 'scripture_shard_fine'],
    },
    levelRequirement: 12,
    questType: 'main',
    prerequisite: ['main_donghuang_explore'],
  },

  main_ancient_tomb: {
    id: 'main_ancient_tomb',
    title: '探秘：古墓惊魂',
    description: '古林深处发现了一座上古墓穴，墓中似乎藏有上古强者的传承。你需要小心探索。',
    objectives: [
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处', current: 0, required: 1 },
      { type: 'enter_dungeon', targetId: 'emperor_dungeon', description: '进入古墓', current: 0, required: 1 },
      { type: 'kill_boss', targetId: 'tomb_guardian', description: '击败墓穴守护者', current: 0, required: 1 },
      { type: 'collect', targetId: 'ancient_scripture_fragment', description: '获取古经残卷', current: 0, required: 1 },
    ],
    rewards: {
      exp: 3000,
      gold: 2000,
      items: ['tomb_relic', 'scripture_shard_fine'],
    },
    levelRequirement: 18,
    questType: 'main',
    prerequisite: ['main_find_guide'],
  },

  main_emperor_battlefield: {
    id: 'main_emperor_battlefield',
    title: '传说：古皇战场',
    description: '古皇战场近期异动频繁，有古皇遗物现世。这是你突破四极境界的契机。',
    objectives: [
      { type: 'travel', targetId: 'ancient_emperor_battlefield_entrance', description: '前往古皇战场', current: 0, required: 1 },
      { type: 'talk', targetId: 'battlefield_scout', description: '与战场斥候交谈', current: 0, required: 1 },
      { type: 'kill', targetId: 'ghost_warrior', description: '击败战场亡魂', current: 0, required: 5 },
      { type: 'collect', targetId: 'emperor_blood', description: '收集皇血', current: 0, required: 5 },
    ],
    rewards: {
      exp: 12000,
      gold: 6000,
      items: ['emperor_medal', 'ancient_scripture_fragment'],
    },
    levelRequirement: 32,
    questType: 'main',
    prerequisite: ['main_siji_breakthrough'],
  },

  main_dragon_vein: {
    id: 'main_dragon_vein',
    title: '寻踪：龙脉觉醒',
    description: '化龙境界需要唤醒体内的龙脉之力。传说太初古矿深处有上古龙族遗迹。',
    objectives: [
      { type: 'travel', targetId: 'taichu_mine_entrance', description: '前往太初古矿', current: 0, required: 1 },
      { type: 'kill', targetId: 'mine_beast', description: '击败矿脉妖兽', current: 0, required: 10 },
      { type: 'collect', targetId: 'dragon_blood', description: '收集龙血精华', current: 0, required: 15 },
      { type: 'talk', targetId: 'dragon_elder', description: '寻找龙族长老', current: 0, required: 1 },
    ],
    rewards: {
      exp: 35000,
      gold: 18000,
      items: ['dragon_medal', 'dragon_pill'],
    },
    levelRequirement: 42,
    questType: 'main',
    prerequisite: ['main_hualong_dragon'],
  },

  main_xiantai_trial: {
    id: 'main_xiantai_trial',
    title: '天劫：九重雷劫',
    description: '仙台境界的突破需要渡过九重天劫。天地雷霆将考验你的肉身与意志。',
    objectives: [
      { type: 'reach_level', targetId: '55', description: '等级达到55级', current: 0, required: 1 },
      { type: 'collect', targetId: 'xiantai_crystal', description: '收集仙台晶石', current: 0, required: 20 },
      { type: 'kill_boss', targetId: 'thunder_tribulation', description: '渡过九重天劫', current: 0, required: 1 },
      { type: 'breakthrough', description: '完成仙台突破', current: 0, required: 1 },
    ],
    rewards: {
      exp: 120000,
      gold: 60000,
      items: ['xiantai_weapon', 'divine_pill'],
    },
    levelRequirement: 55,
    questType: 'main',
    prerequisite: ['main_xiantai_ascent'],
  },

  main_final_destiny: {
    id: 'main_final_destiny',
    title: '终章：天道之战',
    description: '修炼之路的终点，是与天道的最终对决。唯有战胜天道，方能证道成帝。',
    objectives: [
      { type: 'reach_level', targetId: '70', description: '等级达到70级', current: 0, required: 1 },
      { type: 'collect', targetId: 'emperor_blood', description: '收集帝血', current: 0, required: 10 },
      { type: 'collect', targetId: 'ancient_scripture_fragment', description: '收集古经残卷', current: 0, required: 5 },
      { type: 'kill_boss', targetId: 'heavenly_dao', description: '击败天道化身', current: 0, required: 1 },
    ],
    rewards: {
      exp: 500000,
      gold: 200000,
      items: ['emperor_weapon', 'heavenly_dao_medal'],
    },
    levelRequirement: 70,
    questType: 'main',
    prerequisite: ['main_xiantai_breakthrough'],
  },

  main_sect_war: {
    id: 'main_sect_war',
    title: '风云：门派之争',
    description: '各大门派之间的矛盾日益激化，一场门派大战即将爆发。你需要选择立场。',
    objectives: [
      { type: 'talk', targetId: 'sect_leader', description: '与门派掌门交谈', current: 0, required: 1 },
      { type: 'kill', targetId: 'sect_enemy', description: '击败敌对门派弟子', current: 0, required: 10 },
      { type: 'collect', targetId: 'sect_honor_medal', description: '收集门派荣誉勋章', current: 0, required: 3 },
      { type: 'complete_dungeon', targetId: 'sect_war_dungeon', description: '完成门派战副本', current: 0, required: 1 },
    ],
    rewards: {
      exp: 20000,
      gold: 10000,
      items: ['sect_war_medal', 'sacred_golden_sword'],
      reputation: { taixuan_sect: 500 },
    },
    levelRequirement: 35,
    questType: 'main',
    prerequisite: ['main_emperor_battlefield'],
  },

  // ──────────────────────────────────────────────
  // 更多支线任务
  // ──────────────────────────────────────────────
  side_ancient_forest: {
    id: 'side_ancient_forest',
    title: '探险：古林深处',
    description: '古林深处传来异响，有妖兽为祸人间。',
    objectives: [
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处', current: 0, required: 1 },
      { type: 'kill', targetId: 'ancient_beast', description: '击败古林妖兽', current: 0, required: 5 },
      { type: 'collect', targetId: 'ancient_fruit', description: '收集古林果实', current: 0, required: 3 },
    ],
    rewards: {
      exp: 3000,
      gold: 2000,
      items: ['ancient_beast_core'],
    },
    levelRequirement: 25,
    questType: 'side',
  },

  side_source_mine: {
    id: 'side_source_mine',
    title: '探险：源石矿脉',
    description: '源石矿脉深处有珍贵的源晶，但也有危险的妖兽。',
    objectives: [
      { type: 'travel', targetId: 'source_mine_entrance', description: '前往源石矿脉', current: 0, required: 1 },
      { type: 'kill', targetId: 'mine_beast', description: '击败矿脉妖兽', current: 0, required: 5 },
      { type: 'collect', targetId: 'source_crystal', description: '收集源晶', current: 0, required: 5 },
    ],
    rewards: {
      exp: 4000,
      gold: 3000,
      items: ['rare_source_crystal'],
    },
    levelRequirement: 30,
    questType: 'side',
  },

  side_demon_realm: {
    id: 'side_demon_realm',
    title: '探险：妖界入口',
    description: '妖界入口出现异动，有妖兽入侵人间。',
    objectives: [
      { type: 'travel', targetId: 'demon_realm_entrance', description: '前往妖界入口', current: 0, required: 1 },
      { type: 'kill', targetId: 'demon_soldier', description: '击败妖界士兵', current: 0, required: 10 },
      { type: 'talk', targetId: 'demon_general', description: '与妖界将领交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 6000,
      gold: 4000,
      items: ['demon_realm_medal'],
    },
    levelRequirement: 35,
    questType: 'side',
  },

  // ──────────────────────────────────────────────
  // 更多每日任务
  // ──────────────────────────────────────────────
  daily_alchemy: {
    id: 'daily_alchemy',
    title: '日常：炼丹修炼',
    description: '每天炼制一炉丹药，提升炼丹技艺。',
    objectives: [
      { type: 'alchemy', description: '炼制丹药', current: 0, required: 1 },
    ],
    rewards: {
      exp: 300,
      gold: 200,
      items: ['alchemy_material_box'],
    },
    levelRequirement: 15,
    questType: 'daily',
  },

  daily_enhance: {
    id: 'daily_enhance',
    title: '日常：装备强化',
    description: '每天强化一次装备，提升装备品质。',
    objectives: [
      { type: 'enhance', description: '强化装备', current: 0, required: 1 },
    ],
    rewards: {
      exp: 400,
      gold: 250,
      items: ['enhance_stone'],
    },
    levelRequirement: 20,
    questType: 'daily',
  },

  daily_cultivation: {
    id: 'daily_cultivation',
    title: '日常：挂机修炼',
    description: '每天挂机修炼一段时间，提升修为。',
    objectives: [
      { type: 'cultivate', description: '挂机修炼', current: 0, required: 1 },
    ],
    rewards: {
      exp: 200,
      gold: 100,
      items: ['cultivation_pill'],
    },
    levelRequirement: 5,
    questType: 'daily',
  },

  // ──────────────────────────────────────────────
  // 更多每日任务
  // ──────────────────────────────────────────────
  daily_gathering: {
    id: 'daily_gathering',
    title: '日常：采药修炼',
    description: '每天采集灵药，提升采药技能。',
    objectives: [
      { type: 'collect', targetId: 'green_herb', description: '采集灵草', current: 0, required: 5 },
    ],
    rewards: {
      exp: 250,
      gold: 150,
      items: ['herb_bag'],
    },
    levelRequirement: 5,
    questType: 'daily',
  },

  daily_cooking: {
    id: 'daily_cooking',
    title: '日常：烹饪修炼',
    description: '每天烹饪一份灵食，提升烹饪技能。',
    objectives: [
      { type: 'alchemy', description: '烹饪灵食', current: 0, required: 1 },
    ],
    rewards: {
      exp: 300,
      gold: 200,
      items: ['cooking_material_box'],
    },
    levelRequirement: 10,
    questType: 'daily',
  },

  daily_world_boss: {
    id: 'daily_world_boss',
    title: '日常：讨伐妖兽',
    description: '每天参与一次世界Boss讨伐，为东荒的和平出一份力。',
    objectives: [
      { type: 'kill', targetId: 'world_boss', description: '参与世界Boss讨伐', current: 0, required: 1 },
    ],
    rewards: {
      exp: 1500,
      gold: 800,
      items: ['boss_medal'],
    },
    levelRequirement: 20,
    questType: 'daily',
  },

  daily_sect_contribution: {
    id: 'daily_sect_contribution',
    title: '日常：门派贡献',
    description: '每天为门派做贡献，提升门派声望。',
    objectives: [
      { type: 'talk', targetId: 'sect_quest_master', description: '向门派长老汇报', current: 0, required: 1 },
      { type: 'collect', targetId: 'source_stone', description: '上交源石', current: 0, required: 5 },
    ],
    rewards: {
      exp: 400,
      gold: 250,
      reputation: { taixuan_sect: 30 },
    },
    levelRequirement: 10,
    questType: 'daily',
    prerequisite: ['main_join_sect'],
  },

  daily_arena_ranking: {
    id: 'daily_arena_ranking',
    title: '日常：竞技排名',
    description: '每天参加竞技场比赛，提升排名。',
    objectives: [
      { type: 'pvp_win', description: '赢得竞技场比赛', current: 0, required: 2 },
    ],
    rewards: {
      exp: 1000,
      gold: 600,
      reputation: { central_city: 30 },
    },
    levelRequirement: 25,
    questType: 'daily',
    prerequisite: ['main_enter_central_city'],
  },

  daily_mount_care: {
    id: 'daily_mount_care',
    title: '日常：坐骑喂养',
    description: '每天喂养坐骑，提升坐骑亲密度。',
    objectives: [
      { type: 'talk', targetId: 'mount_master', description: '与坐骑管理员交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 200,
      gold: 100,
      items: ['mount_feed'],
    },
    levelRequirement: 5,
    questType: 'daily',
  },

  daily_pet_training: {
    id: 'daily_pet_training',
    title: '日常：灵宠训练',
    description: '每天训练灵宠，提升灵宠实力。',
    objectives: [
      { type: 'talk', targetId: 'pet_master', description: '与灵宠训练师交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 250,
      gold: 120,
      items: ['pet_feed'],
    },
    levelRequirement: 10,
    questType: 'daily',
  },

  daily_enhance_equipment: {
    id: 'daily_enhance_equipment',
    title: '日常：装备强化',
    description: '每天强化装备，提升战斗力。',
    objectives: [
      { type: 'enhance', description: '强化装备', current: 0, required: 2 },
    ],
    rewards: {
      exp: 500,
      gold: 300,
      items: ['enhance_stone'],
    },
    levelRequirement: 15,
    questType: 'daily',
  },

  // ──────────────────────────────────────────────
  // 更多支线任务（低等级）
  // ──────────────────────────────────────────────
  side_herb_boy_crisis: {
    id: 'side_herb_boy_crisis',
    title: '危机：药童失踪',
    description: '归元村药师的学徒进山采药后失踪了，你需要前去寻找。',
    objectives: [
      { type: 'travel', targetId: 'donghuang_plain', description: '前往东荒旷野', current: 0, required: 1 },
      { type: 'kill', targetId: 'wild_beast', description: '击败野兽', current: 0, required: 3 },
      { type: 'talk', targetId: 'herb_boy', description: '找到药童', current: 0, required: 1 },
    ],
    rewards: {
      exp: 300,
      gold: 200,
      items: ['rare_herb'],
    },
    levelRequirement: 5,
    questType: 'side',
    prerequisite: ['main_awakening'],
  },

  side_mine_anomaly: {
    id: 'side_mine_anomaly',
    title: '异变：矿脉异动',
    description: '源石矿脉出现异常，矿工们报告说听到了奇怪的声音。',
    objectives: [
      { type: 'travel', targetId: 'source_mine_entrance', description: '前往源石矿脉', current: 0, required: 1 },
      { type: 'kill', targetId: 'mine_beast', description: '击败矿脉妖兽', current: 0, required: 5 },
      { type: 'collect', targetId: 'source_crystal', description: '收集异常源晶', current: 0, required: 3 },
    ],
    rewards: {
      exp: 600,
      gold: 400,
      items: ['rare_source_crystal'],
    },
    levelRequirement: 10,
    questType: 'side',
    prerequisite: ['main_first_combat'],
  },

  side_wandering_swordsman: {
    id: 'side_wandering_swordsman',
    title: '奇遇：流浪剑客',
    description: '一位流浪剑客出现在归元村，他似乎在寻找什么东西。',
    objectives: [
      { type: 'talk', targetId: 'wandering_swordsman', description: '与流浪剑客交谈', current: 0, required: 1 },
      { type: 'kill', targetId: 'bandit', description: '击败山贼', current: 0, required: 5 },
      { type: 'collect', targetId: 'swordsman_letter', description: '获取剑客信物', current: 0, required: 1 },
    ],
    rewards: {
      exp: 800,
      gold: 500,
      items: ['swordsman_medal'],
    },
    levelRequirement: 8,
    questType: 'side',
    prerequisite: ['main_awakening'],
  },

  // ──────────────────────────────────────────────
  // 更多支线任务（中等级）
  // ──────────────────────────────────────────────
  side_ancient_forest_mystery: {
    id: 'side_ancient_forest_mystery',
    title: '秘闻：古林异象',
    description: '古林深处出现奇异光芒，有人说看到了上古灵兽。',
    objectives: [
      { type: 'travel', targetId: 'ancient_forest', description: '前往古林深处', current: 0, required: 1 },
      { type: 'kill', targetId: 'ancient_beast', description: '击败古林妖兽', current: 0, required: 8 },
      { type: 'collect', targetId: 'ancient_fruit', description: '收集古林灵果', current: 0, required: 5 },
    ],
    rewards: {
      exp: 4000,
      gold: 2500,
      items: ['ancient_beast_core', 'scripture_shard_fine'],
    },
    levelRequirement: 20,
    questType: 'side',
    prerequisite: ['main_join_sect'],
  },

  side_demon_invasion: {
    id: 'side_demon_invasion',
    title: '抵御：妖族入侵',
    description: '妖族大军正在入侵东荒边境，需要勇士前去抵御。',
    objectives: [
      { type: 'travel', targetId: 'demon_realm_entrance', description: '前往妖界入口', current: 0, required: 1 },
      { type: 'kill', targetId: 'demon_soldier', description: '击败妖界士兵', current: 0, required: 15 },
      { type: 'kill', targetId: 'demon_general', description: '击败妖界将领', current: 0, required: 1 },
    ],
    rewards: {
      exp: 8000,
      gold: 5000,
      items: ['demon_blood_essence', 'divine_pill'],
    },
    levelRequirement: 30,
    questType: 'side',
    prerequisite: ['main_daogong_breakthrough'],
  },

  side_sect_betrayal: {
    id: 'side_sect_betrayal',
    title: '叛乱：圣地阴谋',
    description: '摇光圣地内部出现叛徒，与外敌勾结，意图颠覆圣地。',
    objectives: [
      { type: 'talk', targetId: 'sect_elder', description: '与门派长老交谈', current: 0, required: 1 },
      { type: 'kill', targetId: 'sect_traitor', description: '击败叛徒', current: 0, required: 3 },
      { type: 'collect', targetId: 'traitor_evidence', description: '收集叛徒证据', current: 0, required: 3 },
    ],
    rewards: {
      exp: 6000,
      gold: 4000,
      items: ['sect_honor_medal'],
      reputation: { yaoguan_sect: 200 },
    },
    levelRequirement: 25,
    questType: 'side',
    prerequisite: ['main_join_sect'],
  },

  // ──────────────────────────────────────────────
  // 更多支线任务（高等级）
  // ──────────────────────────────────────────────
  side_dragon_ruins: {
    id: 'side_dragon_ruins',
    title: '探险：龙族遗迹',
    description: '太初古矿深处发现了上古龙族的遗迹，蕴含着龙族的传承。',
    objectives: [
      { type: 'travel', targetId: 'taichu_mine_entrance', description: '前往太初古矿', current: 0, required: 1 },
      { type: 'kill', targetId: 'mine_beast', description: '击败矿脉守护兽', current: 0, required: 10 },
      { type: 'collect', targetId: 'dragon_blood', description: '收集龙血', current: 0, required: 10 },
      { type: 'kill_boss', targetId: 'dragon_guardian', description: '击败龙族守护者', current: 0, required: 1 },
    ],
    rewards: {
      exp: 25000,
      gold: 15000,
      items: ['dragon_medal', 'dragon_blood'],
    },
    levelRequirement: 40,
    questType: 'side',
    prerequisite: ['main_hualong_dragon'],
  },

  side_abyss_rift: {
    id: 'side_abyss_rift',
    title: '深渊：裂缝危机',
    description: '深渊裂缝出现在东荒大地，虚空之力正在侵蚀现实世界。',
    objectives: [
      { type: 'travel', targetId: 'abyss_rift', description: '前往深渊裂缝', current: 0, required: 1 },
      { type: 'kill', targetId: 'abyss_creature', description: '击败深渊生物', current: 0, required: 10 },
      { type: 'collect', targetId: 'void_essence', description: '收集虚空精华', current: 0, required: 5 },
    ],
    rewards: {
      exp: 30000,
      gold: 18000,
      items: ['abyss_medal', 'scripture_shard_rare'],
    },
    levelRequirement: 45,
    questType: 'side',
  },

  side_emperor_fragment: {
    id: 'side_emperor_fragment',
    title: '寻宝：帝兵碎片',
    description: '传说帝兵碎片散落在东荒各地，收集齐所有碎片可以重铸帝兵。',
    objectives: [
      { type: 'collect', targetId: 'emperor_fragment', description: '收集帝兵碎片', current: 0, required: 5 },
      { type: 'kill', targetId: 'emperor_guardian', description: '击败碎片守护者', current: 0, required: 3 },
      { type: 'talk', targetId: 'emperor_spirit_remnant', description: '与妖帝残魂交谈', current: 0, required: 1 },
    ],
    rewards: {
      exp: 50000,
      gold: 30000,
      items: ['emperor_artifact', 'emperor_blood'],
    },
    levelRequirement: 50,
    questType: 'side',
    prerequisite: ['main_xiantai_ascent'],
  },

  // ──────────────────────────────────────────────
  // 终局支线任务（50+）
  // ──────────────────────────────────────────────
  side_immortal_road: {
    id: 'side_immortal_road',
    title: '争锋：仙路风云',
    description: '仙路即将开启，各方势力蠢蠢欲动。你需要在这场风云中站稳脚跟。',
    objectives: [
      { type: 'kill', targetId: 'immortal_competitor', description: '击败仙路竞争者', current: 0, required: 10 },
      { type: 'collect', targetId: 'immortal_token', description: '收集仙路令牌', current: 0, required: 5 },
      { type: 'kill_boss', targetId: 'immortal_guardian', description: '击败仙路守护者', current: 0, required: 1 },
    ],
    rewards: {
      exp: 80000,
      gold: 40000,
      items: ['immortal_medal', 'divine_pill'],
    },
    levelRequirement: 55,
    questType: 'side',
    prerequisite: ['main_xiantai_breakthrough'],
  },

  side_heaven_trial: {
    id: 'side_heaven_trial',
    title: '试炼：天道考验',
    description: '天道降下考验，只有通过考验的修炼者才能更进一步。',
    objectives: [
      { type: 'reach_level', targetId: '60', description: '等级达到60级', current: 0, required: 1 },
      { type: 'kill', targetId: 'heaven_trial_enemy', description: '击败天道试炼敌人', current: 0, required: 15 },
      { type: 'collect', targetId: 'heaven_essence', description: '收集天道精华', current: 0, required: 10 },
    ],
    rewards: {
      exp: 120000,
      gold: 60000,
      items: ['heaven_medal', 'scripture_shard_epic'],
    },
    levelRequirement: 60,
    questType: 'side',
    prerequisite: ['main_xiantai_breakthrough'],
  },

  side_ten_thousand_race: {
    id: 'side_ten_thousand_race',
    title: '大战：万族纷争',
    description: '万族大战即将爆发，各大种族都在为生存而战。',
    objectives: [
      { type: 'kill', targetId: 'race_enemy', description: '击败异族战士', current: 0, required: 20 },
      { type: 'collect', targetId: 'race_trophy', description: '收集战利品', current: 0, required: 10 },
      { type: 'kill_boss', targetId: 'race_champion', description: '击败异族冠军', current: 0, required: 1 },
    ],
    rewards: {
      exp: 200000,
      gold: 100000,
      items: ['race_medal', 'emperor_weapon'],
    },
    levelRequirement: 65,
    questType: 'side',
    prerequisite: ['side_heaven_trial'],
  },
};

export const INITIAL_QUESTS: string[] = [
  'main_awakening',
  'side_collect_herbs',
];

export const QUEST_CATEGORIES = {
  main: { name: '主线任务', color: '#ffd700', icon: '📜' },
  side: { name: '支线任务', color: '#88ccff', icon: '📋' },
  daily: { name: '日常任务', color: '#55dd88', icon: '📅' },
  sect: { name: '师门任务', color: '#ff8800', icon: '⚔️' },
  event: { name: '活动任务', color: '#ff4444', icon: '🎭' },
};

export default QUESTS;
