import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { FloatWindowId } from '../types/game';
import './InputBar.css';

const WINDOWS: { id: FloatWindowId; label: string; icon: string }[] = [
  { id: 'attributes', label: '属性', icon: '◈' },
  { id: 'skills',     label: '技能', icon: '⚡' },
  { id: 'bag',        label: '背包', icon: '◻' },
  { id: 'tasks',      label: '任务', icon: '◎' },
  { id: 'sect',       label: '门派', icon: '✦' },
  { id: 'dungeon',    label: '副本', icon: '⚔' },
  { id: 'combat',     label: '战斗', icon: '⚔' },
  { id: 'cultivation',label: '修炼', icon: '☯' },
  { id: 'shop',       label: '神药', icon: '💊' },
  { id: 'map',        label: '地图', icon: '◉' },
  { id: 'social',     label: '社交', icon: '☰' },
  { id: 'rankings',   label: '排行', icon: '★' },
];

export default function InputBar() {
  const toggleWindow = useGameStore(s => s.toggleWindow);
  const openWindows = useGameStore(s => s.openWindows);
  const move = useGameStore(s => s.move);
  const processCommand = useGameStore(s => s.processCommand);
  const addMessage = useGameStore(s => s.addMessage);
  const combat = useGameStore(s => s.combat);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const runCommand = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    addMessage({ channel: 'system', sender: '指令', content: `> ${text}` });
    processCommand(text);
    setHistory(prev => [text, ...prev.filter(item => item !== text)].slice(0, 30));
    setHistoryIndex(null);
    setCommand('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCommand(command);
  };

  const handleCommandKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setCommand(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === null) return;
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(null);
        setCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    } else if (e.key === 'Escape') {
      setCommand('');
      setHistoryIndex(null);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }
      const keyMap: Record<string, string> = {
        ArrowUp: 'north', ArrowDown: 'south', ArrowRight: 'east', ArrowLeft: 'west',
      };
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  return (
    <div className="input-bar">
      <form className="ib-command-form" onSubmit={handleSubmit}>
        <span className="ib-command-prompt">&gt;</span>
        <input
          className="ib-command-input"
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={handleCommandKeyDown}
          placeholder="输入指令"
          spellCheck={false}
        />
        <button className="ib-command-run" type="submit">执行</button>
      </form>
      <div className="ib-quick-row">
        <button className="ib-quick-btn" onClick={() => runCommand('look')}>观察</button>
        <button className="ib-quick-btn" onClick={() => runCommand('xiulian')}>修炼</button>
        <button className="ib-quick-btn" onClick={() => runCommand('dazuo')}>打坐</button>
        <button className="ib-quick-btn" onClick={() => runCommand('breakthrough')}>突破</button>
        {combat.isInCombat && (
          <button className="ib-quick-btn danger" onClick={() => runCommand('flee')}>逃跑</button>
        )}
      </div>
      <div className="ib-window-row">
        {WINDOWS.map(w => (
          <button
            key={w.id}
            className={`ib-win-btn ${openWindows.has(w.id) ? 'active' : ''}`}
            onClick={() => toggleWindow(w.id)}
            title={w.label}
          >
            <span className="ib-win-icon">{w.icon}</span>
            <span className="ib-win-label">{w.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
