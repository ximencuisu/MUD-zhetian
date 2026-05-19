import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { FloatWindowId } from '../types/game';
import './InputBar.css';



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

  return null;
}
