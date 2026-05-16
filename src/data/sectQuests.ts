import { Quest } from '../types/game';

// 门派任务类型
export type SectQuestType = 'daily' | 'weekly' | 'special' | 'contribution';

export interface SectQuest extends Quest {
  type: 'sect';
  sectId: string;
  questType: SectQuestType;
  contribReward: number;
  reputationReward: number;
  requiredRank?: string;
  cooldown?: number; // 冷却时间（小时）
}

// 摇光圣地任务
export const YAOGUAN_QUESTS: SectQuest[] = [
  {
    id: 'yg_daily_1',
    name: '圣光修行',
    description: '在摇光圣地修炼圣光功法，提升修为。',
    status: 'available',
    type: 'sect',
    sectId: 'yaoguan',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼摇光功法3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
  {
    id: 'yg_daily_2',
    name: '清扫圣坛',
    description: '前往真传峰清扫圣光祭坛，保持圣地洁净。',
    status: 'available',
    type: 'sect',
    sectId: 'yaoguan',
    questType: 'daily',
    contribReward: 20,
    reputationReward: 5,
    objectives: [{ description: '清扫圣坛', current: 0, required: 1, completed: false }],
    rewards: { exp: 80, gold: 30, items: [] },
  },
  {
    id: 'yg_contrib_1',
    name: '收集圣光石',
    description: '为圣地收集圣光石用于修炼。',
    status: 'available',
    type: 'sect',
    sectId: 'yaoguan',
    questType: 'contribution',
    contribReward: 100,
    reputationReward: 20,
    objectives: [{ description: '收集10块圣光石', current: 0, required: 10, completed: false }],
    rewards: { exp: 200, gold: 100, items: ['source_crystal'] },
  },
  {
    id: 'yg_special_1',
    name: '古皇拳传承',
    description: '向真传弟子请教古皇拳的奥义。',
    status: 'available',
    type: 'sect',
    sectId: 'yaoguan',
    questType: 'special',
    contribReward: 200,
    reputationReward: 50,
    requiredRank: '内门弟子',
    objectives: [{ description: '与真传弟子切磋3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 500, gold: 300, items: [] },
  },
];

// 姬家任务
export const JI_FAMILY_QUESTS: SectQuest[] = [
  {
    id: 'ji_daily_1',
    name: '虚空感悟',
    description: '感悟虚空之力，提升对虚空经的理解。',
    status: 'available',
    type: 'sect',
    sectId: 'ji_family',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼姬家功法3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
  {
    id: 'ji_contrib_1',
    name: '寻找虚空石',
    description: '虚空石是修炼虚空经的重要材料。',
    status: 'available',
    type: 'sect',
    sectId: 'ji_family',
    questType: 'contribution',
    contribReward: 100,
    reputationReward: 20,
    objectives: [{ description: '收集8块虚空石', current: 0, required: 8, completed: false }],
    rewards: { exp: 200, gold: 100, items: ['source_crystal'] },
  },
];

// 太玄门任务
export const TAIXUAN_QUESTS: SectQuest[] = [
  {
    id: 'tx_daily_1',
    name: '速度修炼',
    description: '修炼行字秘，提升速度。',
    status: 'available',
    type: 'sect',
    sectId: 'taixuan',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼行字秘3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
  {
    id: 'tx_special_1',
    name: '追捕段德',
    description: '段德又偷了门派的行字秘残篇，去把他抓回来！',
    status: 'available',
    type: 'sect',
    sectId: 'taixuan',
    questType: 'special',
    contribReward: 300,
    reputationReward: 100,
    requiredRank: '真传弟子',
    objectives: [{ description: '在源石矿找到段德', current: 0, required: 1, completed: false }],
    rewards: { exp: 800, gold: 500, items: ['ancient_scripture_fragment'] },
  },
];

// 紫府圣地任务
export const ZIFU_QUESTS: SectQuest[] = [
  {
    id: 'zf_daily_1',
    name: '紫气东来',
    description: '吸收紫气，淬炼肉身。',
    status: 'available',
    type: 'sect',
    sectId: 'zifu',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼紫府功法3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
];

// 姜家任务
export const JIANG_QUESTS: SectQuest[] = [
  {
    id: 'jg_daily_1',
    name: '柔劲修炼',
    description: '以柔克刚，修炼姜家柔劲。',
    status: 'available',
    type: 'sect',
    sectId: 'jiang_family',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼姜家功法3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
];

// 妖族任务
export const YAO_QUESTS: SectQuest[] = [
  {
    id: 'yao_daily_1',
    name: '妖血沸腾',
    description: '激发妖血之力，淬炼肉身。',
    status: 'available',
    type: 'sect',
    sectId: 'yao_clan',
    questType: 'daily',
    contribReward: 30,
    reputationReward: 10,
    objectives: [{ description: '修炼妖族功法3次', current: 0, required: 3, completed: false }],
    rewards: { exp: 100, gold: 50, items: [] },
  },
  {
    id: 'yao_contrib_1',
    name: '收集妖核',
    description: '妖核是妖族修炼的重要资源。',
    status: 'available',
    type: 'sect',
    sectId: 'yao_clan',
    questType: 'contribution',
    contribReward: 100,
    reputationReward: 20,
    objectives: [{ description: '收集5颗妖核', current: 0, required: 5, completed: false }],
    rewards: { exp: 200, gold: 100, items: ['dragon_blood'] },
  },
];

// 所有门派任务
export const ALL_SECT_QUESTS: SectQuest[] = [
  ...YAOGUAN_QUESTS,
  ...JI_FAMILY_QUESTS,
  ...TAIXUAN_QUESTS,
  ...ZIFU_QUESTS,
  ...JIANG_QUESTS,
  ...YAO_QUESTS,
];

// 获取门派可用的任务
export function getAvailableSectQuests(sectId: string, rank: string | null): SectQuest[] {
  return ALL_SECT_QUESTS.filter(q => {
    if (q.sectId !== sectId) return false;
    if (q.status !== 'available') return false;
    if (q.requiredRank && rank) {
      const rankOrder = ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'];
      if (rankOrder.indexOf(rank) < rankOrder.indexOf(q.requiredRank)) return false;
    }
    return true;
  });
}

// 生成每日任务
export function generateDailyQuests(sectId: string, rank: string | null): SectQuest[] {
  const allQuests = ALL_SECT_QUESTS.filter(q => 
    q.sectId === sectId && 
    q.questType === 'daily' &&
    (!q.requiredRank || (rank && isRankHighEnough(rank, q.requiredRank)))
  );
  // 随机选择2-3个每日任务
  const shuffled = [...allQuests].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(3, shuffled.length)).map(q => ({
    ...q,
    status: 'active' as const,
  }));
}

// 检查职位等级是否足够
function isRankHighEnough(currentRank: string, requiredRank: string): boolean {
  const rankOrder = ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'];
  return rankOrder.indexOf(currentRank) >= rankOrder.indexOf(requiredRank);
}
