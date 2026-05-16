import { Character, CombatState } from '../types/game';
import { DUNGEONS } from '../data/dungeons';
import { generateDungeonMap } from '../data/dungeonMapGen';

// ── 进入副本 ──
export function enterDungeon(
  dungeonId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): {
  combat: Partial<CombatState>;
  zoneRooms: Record<string, any>;
  currentGenRoomId: string;
  dungeonCompletedRooms: Set<string>;
  dungeonCompletion: number;
} | null {
  const dungeon = DUNGEONS[dungeonId];
  if (!dungeon) return null;

  // 检查前置条件
  if (dungeon.prerequisite) {
    const preProgress = character.dungeonProgress[dungeon.prerequisite];
    if (!preProgress?.cleared) {
      addMessage({ channel: 'system', sender: '系统', content: `需要先通关${DUNGEONS[dungeon.prerequisite]?.name || dungeon.prerequisite}才能进入此副本。` });
      return null;
    }
  }

  // 检查等级
  if (character.realmLevel < dungeon.levelMin) {
    addMessage({ channel: 'system', sender: '系统', content: `等级不足（需要 Lv.${dungeon.levelMin}）。` });
    return null;
  }

  // 检查每日次数
  const today = new Date().toDateString();
  const todayRuns = character.dungeonProgress[dungeonId]?.todayRuns || 0;
  const lastRunDate = character.dungeonProgress[dungeonId]?.lastRunDate;
  const isToday = lastRunDate === today;

  if (isToday && todayRuns >= dungeon.dailyLimit) {
    addMessage({ channel: 'system', sender: '系统', content: `今日${dungeon.name}进入次数已用完（${dungeon.dailyLimit}次）。` });
    return null;
  }

  // 生成副本地图
  const dungeonMap = generateDungeonMap(dungeon.roomCount, dungeonId);
  const entryRoomId = Object.keys(dungeonMap)[0];

  addMessage({ channel: 'system', sender: '副本', content: `进入${dungeon.name}！` });
  addMessage({ channel: 'room', sender: dungeonMap[entryRoomId].name, content: dungeonMap[entryRoomId].description });

  return {
    combat: {
      inDungeon: true,
      dungeonId: dungeonId,
      dungeonRoom: 0,
      dungeonScore: 0,
      dungeonDeaths: 0,
      dungeonSteps: 0,
    },
    zoneRooms: dungeonMap,
    currentGenRoomId: entryRoomId,
    dungeonCompletedRooms: new Set<string>(),
    dungeonCompletion: 0,
  };
}

// ── 退出副本 ──
export function exitDungeon(
  combat: CombatState,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): {
  combat: Partial<CombatState>;
  currentZoneId: null;
  currentZoneRoomId: null;
  zoneRooms: {};
  currentGenRoomId: string;
  dungeonCompletedRooms: Set<string>;
  dungeonCompletion: 0;
} {
  const dungeonId = combat.dungeonId;
  const dungeon = dungeonId ? DUNGEONS[dungeonId] : null;
  if (dungeon) {
    addMessage({ channel: 'system', sender: '系统', content: `离开${dungeon.name}，返回东荒大地。` });
  }

  return {
    combat: {
      isInCombat: false,
      inDungeon: false,
      dungeonId: null,
      dungeonRoom: 0,
    },
    currentZoneId: null,
    currentZoneRoomId: null,
    zoneRooms: {},
    currentGenRoomId: '',
    dungeonCompletedRooms: new Set<string>(),
    dungeonCompletion: 0,
  };
}

// ── 扫荡副本 ──
export function sweepDungeon(
  dungeonId: string,
  count: number,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): {
  exp: number;
  gold: number;
  inventory: string[];
  dungeonSweepCounts: Record<string, number>;
  dungeonProgress: Record<string, any>;
} | null {
  const dungeon = DUNGEONS[dungeonId];
  if (!dungeon) return null;

  // 检查是否已通关
  const progress = character.dungeonProgress[dungeonId];
  if (!progress?.cleared) {
    addMessage({ channel: 'system', sender: '扫荡', content: '需要先通关才能扫荡。' });
    return null;
  }

  // 检查每日次数
  const today = new Date().toDateString();
  const todaySweeps = character.dungeonSweepCounts?.[dungeonId] || 0;
  const lastSweepDate = progress?.lastSweepDate;
  const isToday = lastSweepDate === today;

  if (isToday && todaySweeps + count > dungeon.dailyLimit) {
    addMessage({ channel: 'system', sender: '扫荡', content: `今日扫荡次数不足（剩余${dungeon.dailyLimit - todaySweeps}次）。` });
    return null;
  }

  // 计算扫荡奖励
  const totalExp = Math.floor(dungeon.sweepRewards.exp * count);
  const totalGold = Math.floor(dungeon.sweepRewards.gold * count);
  const sweepItems: string[] = [];

  for (let i = 0; i < count; i++) {
    if (dungeon.sweepRewards.items) {
      for (const item of dungeon.sweepRewards.items) {
        if (Math.random() < item.chance) {
          sweepItems.push(item.itemId);
        }
      }
    }
  }

  const label = count === 1 ? '扫荡' : `×${count}扫荡`;
  addMessage({ channel: 'system', sender: '扫荡', content: `${label}${dungeon.name}完成！获得${totalExp}修为${totalGold}金叶${sweepItems.length}件物品。` });

  return {
    exp: character.exp + totalExp,
    gold: character.gold + totalGold,
    inventory: [...character.inventory, ...sweepItems],
    dungeonSweepCounts: {
      ...character.dungeonSweepCounts,
      [dungeonId]: (character.dungeonSweepCounts?.[dungeonId] || 0) + count,
    },
    dungeonProgress: {
      ...character.dungeonProgress,
      [dungeonId]: {
        ...progress,
        totalRuns: (progress?.totalRuns || 0) + count,
        lastSweepDate: today,
      },
    },
  };
}
