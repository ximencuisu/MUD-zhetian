import { useGameStore } from '../store/gameStore';
import { ROOMS } from '../data/world';
import { ZONES } from '../data/zones';
import { REALM_NAMES, PHYSIQUE_NAMES } from '../types/game';
import { useEffect, useState, useRef } from 'react';
import './StatusBar.css';

interface AnimatedBarProps {
  current: number;
  max: number;
  type: 'hp' | 'mp' | 'exp';
  label: string;
}

function AnimatedBar({ current, max, type, label }: AnimatedBarProps) {
  const [displayValue, setDisplayValue] = useState(current);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(current);

  useEffect(() => {
    if (prevValue.current !== current) {
      setIsAnimating(true);
      const diff = current - prevValue.current;
      const steps = 20;
      const stepValue = diff / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        if (step >= steps) {
          setDisplayValue(current);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setDisplayValue(prev => prev + stepValue);
        }
      }, 25);

      prevValue.current = current;
      return () => clearInterval(interval);
    }
  }, [current, max]);

  const percentage = max > 0 ? Math.min(100, Math.max(0, (displayValue / max) * 100)) : 0;
  const isLow = type === 'hp' && percentage < 20;
  const isFull = type !== 'exp' && percentage >= 95;

  const fillClass = `sb-bar-fill ${type === 'hp' ? 'hp-fill' : type === 'mp' ? 'mp-fill' : 'exp-fill'}`;
  const animClass = isAnimating ? 'smooth-bar pulse-bar' : 'smooth-bar';

  return (
    <div className="sb-bar-row">
      <span className="sb-bar-lbl">{label}</span>
      <div className={`sb-bar-container ${isLow ? 'low-warning' : ''} ${isFull ? 'full-status' : ''}`}>
        <div className="sb-bar">
          <div
            className={`${fillClass} ${animClass}`}
            style={{ width: `${percentage}%` }}
          />
          {isLow && <div className="sb-bar-danger-indicator" />}
        </div>
      </div>
      <span className={`sb-bar-val ${isLow ? 'danger-text' : ''} ${isFull ? 'full-text' : ''}`}>
        {Math.floor(displayValue)}/{max}
      </span>
    </div>
  );
}

export default function StatusBar() {
  const character = useGameStore(s => s.character);
  const combat = useGameStore(s => s.combat);
  const currentZoneId = useGameStore(s => s.currentZoneId);

  if (!character) return null;

  const locationName = currentZoneId
    ? ZONES[currentZoneId]?.name
    : ROOMS[character.currentRoomId]?.name || '未知';

  const realmName = REALM_NAMES[character.realm] || character.realm;
  const physiqueName = PHYSIQUE_NAMES[character.physique] || character.physique;
  const cultivationModeName = character.cultivationMode === 'cultivate'
    ? '挂机修炼'
    : character.cultivationMode === 'meditate'
      ? '挂机打坐'
      : '';

  return (
    <div className="status-bar">
      <div className="sb-left">
        <span className="sb-name glow-effect">{character.name}</span>
        <span className="sb-realm">{realmName} Lv.{character.realmLevel}</span>
        {character.physique !== 'mortal' && (
          <span className="sb-physique animate-pulse-glow">【{physiqueName}】</span>
        )}
        {character.sect && (
          <span className="sb-sect">{character.sect}</span>
        )}
      </div>

      <div className="sb-bars">
        <AnimatedBar current={character.hp} max={character.maxHp} type="hp" label="气血" />
        <AnimatedBar current={character.mp} max={character.maxMp} type="mp" label="神力" />
        <AnimatedBar current={character.exp} max={character.expToNext} type="exp" label="修为" />
      </div>

      <div className="sb-right">
        <span className="sb-location">📍 {locationName}</span>
        <span className="sb-gold animate-float">💰 {character.gold.toLocaleString()}金</span>
        {cultivationModeName && (
          <span className="sb-cultivation-flag animate-pulse-glow">{cultivationModeName}</span>
        )}
        {combat.isInCombat && (
          <span className="sb-combat-flag">⚔ 战斗中</span>
        )}
      </div>
    </div>
  );
}
