import { Character, Quest } from '../types/game';
import { QUESTS } from '../data/quests';

// ── 接受任务 ──
export function acceptQuest(
  questId: string,
  currentQuests: string[],
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { quests: string[] } | null {
  const def = QUESTS[questId];
  if (!def) {
    addMessage({ channel: 'system', sender: '系统', content: '该任务不存在' });
    return null;
  }

  if (currentQuests.includes(questId)) {
    addMessage({ channel: 'system', sender: '系统', content: '你已接受该任务' });
    return null;
  }

  addMessage({ channel: 'system', sender: '任务', content: `接受任务：${def.name}` });
  return { quests: [...currentQuests, questId] };
}

// ── 放弃任务 ──
export function abandonQuest(
  questId: string,
  currentQuests: string[],
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { quests: string[] } | null {
  if (!currentQuests.includes(questId)) {
    addMessage({ channel: 'system', sender: '系统', content: '你没有这个任务' });
    return null;
  }

  const def = QUESTS[questId];
  addMessage({ channel: 'system', sender: '任务', content: `放弃任务：${def?.name || questId}` });
  return { quests: currentQuests.filter(id => id !== questId) };
}

// ── 检查任务进度 ──
export function checkQuestProgress(
  questId: string,
  character: Character,
  eventType: string,
  eventTarget?: string,
): { completed: boolean; message?: string } {
  const def = QUESTS[questId];
  if (!def) return { completed: false };

  // 简化的任务进度检查
  // 实际实现需要更复杂的逻辑
  return { completed: false };
}

// ── 获取可接任务 ──
export function getAvailableQuests(
  character: Character,
  currentQuests: string[],
): string[] {
  return Object.keys(QUESTS).filter(questId => {
    const def = QUESTS[questId];
    if (!def) return false;
    if (currentQuests.includes(questId)) return false;
    // 检查前置条件
    if (def.prerequisite) {
      // 这里需要检查前置任务是否完成
      // 简化实现
    }
    return true;
  });
}
