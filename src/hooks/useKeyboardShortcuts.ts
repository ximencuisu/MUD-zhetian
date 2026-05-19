import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { FloatWindowId } from '../types/game';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

const COMMAND_HISTORY_KEY = 'wamud_command_history';
const MAX_HISTORY = 50;

function loadCommandHistory(): string[] {
  try {
    const saved = localStorage.getItem(COMMAND_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCommandToHistory(cmd: string) {
  if (!cmd.trim()) return;
  try {
    const history = loadCommandHistory();
    const filtered = history.filter(h => h !== cmd);
    const updated = [cmd, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(updated));
  } catch {
  }
}

export function useKeyboardShortcuts(onToggleSettings?: () => void) {
  const {
    processCommand,
    openWindows,
    closeWindow,
    toggleWindow,
    combat,
    tickCombat,
  } = useGameStore();

  const commandHistory = useRef<string[]>(loadCommandHistory());
  const historyIndex = useRef(-1);
  const currentInput = useRef('');

  const closeTopWindow = useCallback(() => {
    const windows = Array.from(openWindows);
    if (windows.length > 0) {
      closeWindow(windows[windows.length - 1]);
    } else {
      toggleWindow('social');
    }
  }, [openWindows, closeWindow, toggleWindow]);

  const useSkill = useCallback((index: number) => {
    if (!combat.isInCombat) return;
    const skills = useGameStore.getState().character?.skills || [];
    const attackSkills = skills.filter(s => s.type === 'attack' || s.type === 'buff' || s.type === 'heal');
    if (attackSkills[index]) {
      processCommand(`use ${attackSkills[index].name}`);
    }
  }, [combat.isInCombat, processCommand]);

  const useItem = useCallback((index: number) => {
    const inventory = useGameStore.getState().character?.inventory || [];
    const item = inventory[index];
    if (item) {
      const itemName = typeof item === 'string' ? item : (item as {name?: string}).name || item;
      processCommand(`use ${itemName}`);
    }
  }, [processCommand]);

  const focusInput = useCallback(() => {
    const input = document.querySelector('.msg-chat-input') as HTMLInputElement;
    if (input) {
      input.focus();
    } else {
      const commandInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (commandInput) {
        commandInput.focus();
      }
    }
  }, []);

  const cycleCommand = useCallback((up: boolean) => {
    const input = document.querySelector('.command-input') as HTMLInputElement;
    if (!input || commandHistory.current.length === 0) return;

    if (up) {
      if (historyIndex.current === -1) {
        currentInput.current = input.value;
        historyIndex.current = 0;
      } else if (historyIndex.current < commandHistory.current.length - 1) {
        historyIndex.current++;
      }
    } else {
      if (historyIndex.current > 0) {
        historyIndex.current--;
      } else if (historyIndex.current === 0) {
        historyIndex.current = -1;
        input.value = currentInput.current;
        return;
      }
    }

    if (historyIndex.current >= 0 && historyIndex.current < commandHistory.current.length) {
      input.value = commandHistory.current[historyIndex.current];
    }
  }, []);

  const toggleChatChannel = useCallback(() => {
    const tabs = document.querySelectorAll('.msg-ch-tab');
    if (tabs.length === 0) return;
    const activeTab = document.querySelector('.msg-ch-tab.active') as HTMLElement;
    if (!activeTab) return;
    const activeIndex = Array.from(tabs).indexOf(activeTab);
    const nextIndex = (activeIndex + 1) % tabs.length;
    (tabs[nextIndex] as HTMLElement).click();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (e.key === 'Enter' && target.classList.contains('command-input')) {
        const input = target as HTMLInputElement;
        if (input.value.trim()) {
          saveCommandToHistory(input.value);
          commandHistory.current = loadCommandHistory();
          historyIndex.current = -1;
        }
        return;
      }
    }

    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    const shortcuts: KeyboardShortcut[] = [
      { key: 'escape', action: closeTopWindow, description: '关闭当前窗口' },
      { key: 'tab', shift, action: toggleChatChannel, description: '切换聊天频道' },
      { key: 'q', action: () => toggleWindow('tasks'), description: '打开任务面板' },
      { key: '1', action: () => useSkill(0), description: '释放技能1' },
      { key: '2', action: () => useSkill(1), description: '释放技能2' },
      { key: '3', action: () => useSkill(2), description: '释放技能3' },
      { key: '4', action: () => useSkill(3), description: '释放技能4' },
      { key: ' ', action: () => { if (combat.isInCombat) tickCombat(); }, description: '普通攻击/确认' },
      { key: '1', alt: true, action: () => useItem(0), description: '使用物品1' },
      { key: '2', alt: true, action: () => useItem(1), description: '使用物品2' },
      { key: '3', alt: true, action: () => useItem(2), description: '使用物品3' },
      { key: '4', alt: true, action: () => useItem(3), description: '使用物品4' },
      { key: '5', alt: true, action: () => useItem(4), description: '使用物品5' },
      { key: 'c', action: () => toggleWindow('combat'), description: '打开战斗面板' },
      { key: 's', action: () => toggleWindow('skills'), description: '打开技能面板' },
      { key: 'b', action: () => toggleWindow('bag'), description: '打开背包' },
      { key: 'a', action: () => toggleWindow('attributes'), description: '打开属性面板' },
      { key: 'm', action: () => toggleWindow('map'), description: '打开地图' },
      { key: 't', action: () => toggleWindow('tasks'), description: '打开任务面板' },
      { key: 'p', action: () => toggleWindow('sect'), description: '打开门派面板' },
      { key: 'd', action: () => toggleWindow('dungeon'), description: '打开副本面板' },
      { key: 'o', action: () => toggleWindow('social'), description: '打开社交面板' },
      { key: 'z', action: () => onToggleSettings?.(), description: '打开设置' },
      { key: 'r', action: () => toggleWindow('rankings'), description: '打开排行榜' },
      { key: 'k', action: () => toggleWindow('shop'), description: '打开商城' },
      { key: 'x', action: () => toggleWindow('cultivation'), description: '打开修炼面板' },
      { key: 'g', action: () => toggleWindow('guild'), description: '打开帮派面板' },
      { key: 'y', action: () => toggleWindow('alchemy'), description: '打开炼丹面板' },
      { key: 'h', action: () => processCommand('help'), description: '显示帮助' },
      { key: 'enter', action: focusInput, description: '聚焦输入框' },
      { key: 'arrowup', action: () => cycleCommand(true), description: '上一个命令' },
      { key: 'arrowdown', action: () => cycleCommand(false), description: '下一个命令' },
      { key: 'i', action: () => toggleWindow('bag'), description: '打开背包(快捷)' },
      { key: 'l', action: () => processCommand('look'), description: '查看当前场景' },
    ];

    for (const shortcut of shortcuts) {
      const matchKey = shortcut.key === key;
      const matchCtrl = shortcut.ctrl ? ctrl : true;
      const matchShift = shortcut.shift ? shift : true;
      const matchAlt = shortcut.alt ? alt : true;

      if (matchKey && matchCtrl && matchShift && matchAlt) {
        e.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [processCommand, openWindows, closeWindow, toggleWindow, combat, tickCombat, closeTopWindow, useSkill, useItem, focusInput, cycleCommand, toggleChatChannel, onToggleSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export const KEYBOARD_SHORTCUTS_HELP = [
  { key: 'ESC', description: '关闭当前窗口 / 打开社交' },
  { key: 'Enter', description: '聚焦输入框' },
  { key: '1-4', description: '释放技能1-4(战斗中)' },
  { key: 'Space', description: '普通攻击(战斗中)' },
  { key: 'Alt+1-5', description: '使用背包物品1-5' },
  { key: 'Q / T', description: '任务面板' },
  { key: 'A', description: '属性面板' },
  { key: 'B / I', description: '背包' },
  { key: 'C', description: '战斗面板' },
  { key: 'D', description: '副本面板' },
  { key: 'H', description: '显示帮助' },
  { key: 'K', description: '商城' },
  { key: 'L', description: '查看当前场景' },
  { key: 'M', description: '地图' },
  { key: 'O', description: '社交面板' },
  { key: 'P', description: '门派面板' },
  { key: 'R', description: '排行榜' },
  { key: 'S', description: '技能面板' },
  { key: 'Z', description: '设置' },
  { key: 'X', description: '修炼面板' },
  { key: 'G', description: '帮派面板' },
  { key: 'Y', description: '炼丹面板' },
  { key: 'Tab', description: '切换聊天频道' },
  { key: '↑/↓', description: '切换历史命令' },
];
