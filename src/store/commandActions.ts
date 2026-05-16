import { Character, FloatWindowId } from '../types/game';

// ── 命令映射表 ──
const DIRECTION_MAP: Record<string, string> = {
  n: 'north', s: 'south', e: 'east', w: 'west',
  u: 'up', d: 'down', ne: 'northeast', nw: 'northwest',
  se: 'southeast', sw: 'southwest',
  north: 'north', south: 'south', east: 'east', west: 'west',
  up: 'up', down: 'down', northeast: 'northeast', northwest: 'northwest',
  southeast: 'southeast', southwest: 'southwest',
};

const WINDOW_COMMANDS: Record<string, FloatWindowId> = {
  attr: 'attributes', attributes: 'attributes', stats: 'attributes',
  skill: 'skills', skills: 'skills', '技能': 'skills',
  bag: 'bag', inventory: 'bag', item: 'bag', items: 'bag', '背包': 'bag',
  task: 'tasks', tasks: 'tasks', quest: 'tasks', quests: 'tasks', '任务': 'tasks',
  map: 'map', '地图': 'map',
  sect: 'sect', '门派': 'sect',
  dungeon: 'dungeon', '副本': 'dungeon',
  combat: 'combat', '战斗': 'combat',
  cultivate: 'cultivation', cultivation: 'cultivation', '修炼': 'cultivation',
  shop: 'shop', '商店': 'shop', '神药': 'shop',
  arena: 'arena', '竞技': 'arena',
  guild: 'guild', '帮派': 'guild',
  rank: 'rankings', ranking: 'rankings', rankings: 'rankings', '排行': 'rankings',
  social: 'social', '社交': 'social',
  alchemy: 'alchemy', '炼丹': 'alchemy',
  enhance: 'enhance', '强化': 'enhance',
};

// ── 解析命令 ──
export function parseCommand(raw: string): {
  type: string;
  action: string;
  target?: string;
  args?: string[];
} {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  const parts = lower.split(/\s+/);
  const cmd = parts[0];

  // 方向移动
  if (DIRECTION_MAP[cmd]) {
    return { type: 'move', action: DIRECTION_MAP[cmd] };
  }

  // 打开窗口
  if (cmd === 'open' || cmd === '打开') {
    const key = parts.slice(1).join(' ');
    const windowId = WINDOW_COMMANDS[key];
    if (windowId) {
      return { type: 'window', action: windowId };
    }
  }

  // 直接窗口命令
  if (WINDOW_COMMANDS[cmd]) {
    return { type: 'window', action: WINDOW_COMMANDS[cmd] };
  }

  // 战斗命令
  if (cmd === 'attack' || cmd === 'kill' || cmd === '攻击' || cmd === '打') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(attack|kill|攻击|打)\s*/i, '');
    return { type: 'combat', action: 'attack', target };
  }

  // 对话命令
  if (cmd === 'talk' || cmd === 'ask' || cmd === '对话' || cmd === '交谈') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(talk|ask|对话|交谈)\s*/i, '');
    return { type: 'social', action: 'talk', target };
  }

  // 使用物品
  if (cmd === 'use' || cmd === 'eat' || cmd === '使用' || cmd === '服用') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(use|eat|使用|服用)\s*/i, '');
    return { type: 'inventory', action: 'use', target };
  }

  // 装备
  if (cmd === 'equip' || cmd === 'wear' || cmd === '装备') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(equip|wear|装备)\s*/i, '');
    return { type: 'inventory', action: 'equip', target };
  }

  // 卸下装备
  if (cmd === 'unequip' || cmd === 'remove' || cmd === '卸下') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(unequip|remove|卸下)\s*/i, '');
    return { type: 'inventory', action: 'unequip', target };
  }

  // 拾取
  if (cmd === 'get' || cmd === 'pick' || cmd === '捡起' || cmd === '拾取') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(get|pick|捡起|拾取)\s*/i, '');
    return { type: 'inventory', action: 'pickup', target };
  }

  // 丢弃
  if (cmd === 'drop' || cmd === '丢弃') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(drop|丢弃)\s*/i, '');
    return { type: 'inventory', action: 'drop', target };
  }

  // 出售
  if (cmd === 'sell' || cmd === '出售') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(sell|出售)\s*/i, '');
    return { type: 'inventory', action: 'sell', target };
  }

  // 购买
  if (cmd === 'buy' || cmd === '购买') {
    const target = parts.slice(1).join(' ') || trimmed.replace(/^(buy|购买)\s*/i, '');
    return { type: 'inventory', action: 'buy', target };
  }

  // 修炼/挂机
  if (cmd === 'cultivate' || cmd === 'xiulian' || cmd === '修炼' || cmd === '挂机修炼') {
    return { type: 'cultivation', action: 'cultivate' };
  }

  if (cmd === 'dazuo' || cmd === 'idle' || cmd === '挂机打坐') {
    return { type: 'cultivation', action: 'meditate' };
  }

  if (cmd === 'meditate' || cmd === '吐纳' || cmd === '打坐') {
    return { type: 'cultivation', action: 'meditate' };
  }

  if (cmd === 'stop' || cmd === '停止') {
    return { type: 'cultivation', action: 'stop' };
  }

  // 自动战斗
  if (cmd === 'auto' || cmd === 'autofight' || cmd === '自动战斗') {
    return { type: 'combat', action: 'auto' };
  }

  // 逃跑
  if (cmd === 'flee' || cmd === 'run' || cmd === '逃跑') {
    return { type: 'combat', action: 'flee' };
  }

  // 观察
  if (cmd === 'look' || cmd === 'l' || cmd === '观察') {
    return { type: 'room', action: 'look' };
  }

  // 帮助
  if (cmd === 'help' || cmd === '?' || cmd === '帮助') {
    return { type: 'system', action: 'help' };
  }

  // 聊天
  if (cmd === 'say' || cmd === '说') {
    const content = parts.slice(1).join(' ') || trimmed.replace(/^(say|说)\s*/i, '');
    return { type: 'chat', action: 'say', target: content };
  }

  if (cmd === 'tell' || cmd === '私聊') {
    const target = parts[1];
    const content = parts.slice(2).join(' ');
    return { type: 'chat', action: 'tell', target, args: [content] };
  }

  // 保存
  if (cmd === 'save' || cmd === '保存') {
    return { type: 'system', action: 'save' };
  }

  // 未知命令
  return { type: 'unknown', action: cmd };
}

// ── 获取帮助文本 ──
export function getHelpText(): string {
  return `【指令列表】
移动：n/s/e/w/ne/nw/se/sw 或 north/south/east/west
战斗：attack <目标> / auto（自动战斗）/ flee（逃跑）
物品：use <物品> / equip <装备> / unequip <槽位> / get <物品> / drop <物品> / sell <物品> / buy <物品>
修炼：cultivate（挂机修炼）/ dazuo（挂机打坐）/ stop（停止）
观察：look（观察房间）/ talk <NPC>（对话）
窗口：open <窗口名>（打开面板）
聊天：say <内容> / tell <玩家> <内容>
其他：save（保存）/ help（帮助）

快捷键：
Q/W/E/R - 技能1-4
Space - 攻击
1-5 - 使用物品
Tab - 切换聊天频道
ESC - 关闭窗口`;
}
