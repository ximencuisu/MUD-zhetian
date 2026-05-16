import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { CombatBuff } from '../../types/game';
import './Panel.css';
import './CombatPanel.css';

/** Map stat names to short Chinese labels */
function getStatLabel(stat: string, value: number): string {
  const sign = value >= 0 ? '+' : '';
  const map: Record<string, string> = {
    attack: '攻击', defense: '防御', critRate: '暴击',
    critDmg: '暴伤', dodge: '闪避', hit: '命中',
  };
  if (stat === 'none' || !map[stat]) return '';
  return `${sign}${value} ${map[stat]}`;
}

/** Map effectType to icon */
function getEffectTypeIcon(effectType?: string): string {
  const icons: Record<string, string> = {
    stun: '💫', freeze: '❄️', silence: '🔇',
    poison: '☠️', bleed: '🩸', fear: '😨',
  };
  return effectType ? icons[effectType] || '' : '';
}

/** Map effectType to Chinese label */
function getEffectTypeLabel(effectType?: string): string {
  const labels: Record<string, string> = {
    stun: '眩晕', freeze: '冰冻', silence: '沉默',
    poison: '中毒', bleed: '流血', fear: '恐惧',
  };
  return effectType ? labels[effectType] || '' : '';
}

/** Get CSS class for effect type */
function getEffectTypeClass(effectType?: string): string {
  if (!effectType) return '';
  const classes: Record<string, string> = {
    stun: 'cbe-stun', freeze: 'cbe-freeze', silence: 'cbe-silence',
    poison: 'cbe-poison', bleed: 'cbe-bleed', fear: 'cbe-fear',
  };
  return classes[effectType] || '';
}

function combatLogClass(entry: string): string {
  if (entry.startsWith('⚡') && entry.includes('暴击')) return 'combat-log-enemy-crit';
  if (entry.startsWith('⚡')) return 'combat-log-crit';
  if (entry.startsWith('◂')) return 'combat-log-enemy';
  if (entry.includes('治疗') || entry.includes('恢复')) return 'combat-log-heal';
  if (entry.includes('miss') || entry.includes('躲开')) return 'combat-log-miss';
  return 'combat-log-dmg';
}

/** Render duration dots (● = remaining, ○ = expired) */
function DurationDots({ duration }: { duration: number }) {
  const total = Math.max(duration, 3);
  const dots: string[] = [];
  for (let i = 0; i < total; i++) {
    dots.push(i < duration ? '●' : '○');
  }
  return (
    <span className="cbd-dots" data-count={total}>
      {dots.join('')}
    </span>
  );
}

/** A single buff/debuff badge with tooltip */
function BuffBadge({ buff }: { buff: CombatBuff }) {
  const [showTip, setShowTip] = useState(false);
  const isBuff = buff.type === 'buff';
  const effectIcon = getEffectTypeIcon(buff.effectType);
  const effectLabel = getEffectTypeLabel(buff.effectType);
  const statLabel = getStatLabel(buff.stat, buff.value);
  const effectCls = getEffectTypeClass(buff.effectType);
  const isLowDuration = buff.duration <= 1;
  const isDoT = !!buff.dotDamage;

  return (
    <div
      className={`cbb-badge ${isBuff ? 'cbb-buff' : 'cbb-debuff'} ${effectCls} ${isLowDuration ? 'cbb-low' : ''}`}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {/* Icon */}
      <span className="cbb-icon">{effectIcon || buff.icon}</span>

      {/* Stat value */}
      {statLabel && <span className="cbb-stat">{statLabel}</span>}

      {/* DoT indicator */}
      {isDoT && <span className="cbb-dot">🔥{buff.dotDamage!}</span>}

      {/* Effect type badge */}
      {effectLabel && <span className={`cbb-effect-badge ${effectCls}`}>{effectLabel}</span>}

      {/* Duration dots */}
      <DurationDots duration={buff.duration} />

      {/* Tooltip */}
      {showTip && (
        <div className="cbb-tooltip">
          <div className="cbb-tooltip-header">
            <span>{buff.icon} {buff.name}</span>
            {effectLabel && <span className={`cbb-tooltip-effect ${effectCls}`}>{effectLabel}</span>}
          </div>
          {buff.description && <div className="cbb-tooltip-desc">{buff.description}</div>}
          <div className="cbb-tooltip-stats">
            {statLabel && <span>{statLabel}</span>}
            <span>剩余 {buff.duration} 回合</span>
            {isDoT && <span>每回合 🔥{buff.dotDamage} 伤害</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CombatPanel() {
  const char = useGameStore(s => s.character);
  const combat = useGameStore(s => s.combat);
  const tickCombat = useGameStore(s => s.tickCombat);
  const flee = useGameStore(s => s.flee);
  const castSkill = useGameStore(s => s.useSkill);
  const setAutoCombat = useGameStore(s => s.setAutoCombat);
  const setAutoPotion = useGameStore(s => s.setAutoPotion);
  const logEndRef = useRef<HTMLDivElement>(null);

  const hpPct = combat.targetMaxHp > 0 ? (combat.targetHp / combat.targetMaxHp) * 100 : 0;
  const attackSkills = char.skills.filter(s => s.type === 'attack' || s.type === 'buff' || s.type === 'heal');
  const combatLog = combat.combatLog || [];
  const comboCount = combat.comboCount || 0;

  // Separate CC effects from regular buffs/debuffs
  const ccTypes = new Set(['stun', 'freeze', 'silence', 'fear']);
  const playerBuffs = (combat.playerBuffs || []).filter(b => !b.effectType || !ccTypes.has(b.effectType));
  const playerCC = (combat.playerBuffs || []).filter(b => b.effectType && ccTypes.has(b.effectType));
  const targetDebuffs = (combat.targetDebuffs || []).filter(b => !b.effectType || !ccTypes.has(b.effectType));
  const targetCC = (combat.targetDebuffs || []).filter(b => b.effectType && ccTypes.has(b.effectType));

  // Auto-scroll combat log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatLog.length]);

  // Combo level for styling
  const comboLevelClass = comboCount === 0 ? 'combat-combo-0' :
    comboCount <= 2 ? 'combat-combo-1' :
    comboCount <= 4 ? 'combat-combo-2' :
    comboCount <= 6 ? 'combat-combo-3' :
    comboCount <= 8 ? 'combat-combo-4' : 'combat-combo-5-up';

  return (
    <div className="panel-body">
      {/* 自动战斗设置 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 自动战斗设置</div>
        <div className="combat-auto-settings">
          <button
            className={`combat-auto-btn ${combat.autoCombat ? 'active' : ''}`}
            onClick={() => setAutoCombat(!combat.autoCombat)}
          >
            {combat.autoCombat ? '⚡ 自动战斗中' : '○ 自动战斗'}
          </button>
          <button
            className={`combat-auto-btn ${char.autoSettings.autoPotion ? 'active' : ''}`}
            onClick={() => setAutoPotion(!char.autoSettings.autoPotion)}
          >
            {char.autoSettings.autoPotion ? '✓ 自动喝药' : '○ 自动喝药'}
          </button>
        </div>
        <div style={{ marginTop: '4px', color: '#554422', fontSize: '11px' }}>
          喝药阈值：{char.autoSettings.autoPotionThreshold}% 气血以下自动使用
        </div>
      </div>

      {/* 当前目标 */}
      <div className="panel-section combat-target-section">
        {combat.isInCombat ? (
          <>
            <div className="combat-target-header">
              <div className="panel-section-title" style={{ color: '#ff4444', margin: 0, padding: 0, border: 'none' }}>
                ◈ 战斗中
                {combat.inDungeon && <span style={{ color: '#ffaa00', fontSize: '10px', marginLeft: '6px' }}>⚔ 副本</span>}
              </div>
              {combat.targetLevel > 0 && (
                <span className="combat-target-level">Lv.{combat.targetLevel}</span>
              )}
            </div>
            <div className="combat-target-name">{combat.targetName}</div>
            <div className="combat-hp-bar">
              <div className="combat-hp-fill"
                style={{ width: `${hpPct}%`, background: hpPct < 30 ? '#ff0000' : 'linear-gradient(90deg,#880000,#ff2200)' }}
              />
            </div>
            <div className="combat-hp-text">{combat.targetHp} / {combat.targetMaxHp}</div>

            {/* 连击计数器 */}
            <div className="combat-combo-wrap">
              <span className={`combat-combo ${comboLevelClass}`}>
                {comboCount >= 10 ? '🔥 MAX' : `🔥 ×${comboCount}`}
              </span>
              <span className="combat-combo-label">连击</span>
              {combat.maxComboCount > 0 && (
                <span className="combat-max-combo">最高 {combat.maxComboCount} 连击</span>
              )}
            </div>

            {/* 战斗日志 */}
            <div className="combat-log-section">
              {combatLog.length === 0 ? (
                <div className="combat-log-empty">开始战斗以记录日志...</div>
              ) : (
                combatLog.map((entry, i) => (
                  <div key={i} className={`combat-log-entry ${combatLogClass(entry)}`}>
                    {entry}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>

            {/* ─── 增益/减益状态 ─── */}

            {/* 玩家控制效果 (眩晕/冰冻等) */}
            {(playerCC.length > 0 || targetCC.length > 0) && (
              <div className="cbe-section">
                <div className="cbe-section-title">◈ 控制状态</div>
                <div className="cbe-grid">
                  {playerCC.map(buff => (
                    <BuffBadge key={buff.id} buff={buff} />
                  ))}
                  {targetCC.map(debuff => (
                    <BuffBadge key={debuff.id} buff={debuff} />
                  ))}
                </div>
              </div>
            )}

            {/* 玩家增益 */}
            {playerBuffs.length > 0 && (
              <div className="cbe-section">
                <div className="cbe-section-title cbe-section-title-buff">↑ 增益</div>
                <div className="cbe-grid">
                  {playerBuffs.map(buff => (
                    <BuffBadge key={buff.id} buff={buff} />
                  ))}
                </div>
              </div>
            )}

            {/* 敌人减益 */}
            {targetDebuffs.length > 0 && (
              <div className="cbe-section">
                <div className="cbe-section-title cbe-section-title-debuff">↓ 减益</div>
                <div className="cbe-grid">
                  {targetDebuffs.map(debuff => (
                    <BuffBadge key={debuff.id} buff={debuff} />
                  ))}
                </div>
              </div>
            )}

            {/* 无效果时显示占位 */}
            {playerBuffs.length === 0 && targetDebuffs.length === 0 && playerCC.length === 0 && targetCC.length === 0 && (
              <div className="cbe-empty">无活跃状态效果</div>
            )}
          </>
        ) : (
          <div style={{ color: '#554422', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
            当前无战斗
          </div>
        )}
      </div>

      {/* 技能快捷 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 技能快捷</div>
        <div className="combat-skill-grid">
          {attackSkills.map(skill => (
            <button
              key={skill.id}
              className="combat-skill-btn"
              disabled={!combat.isInCombat || skill.currentCooldown > 0 || char.mp < skill.mpCost}
              onClick={() => castSkill(skill.id)}
              title={`${skill.description}\n神力：${skill.mpCost}  CD：${skill.cooldown}回合`}
            >
              <div>{skill.name}</div>
              <div style={{ fontSize: '9px', color: '#554422' }}>
                {skill.currentCooldown > 0 ? `冷却 ${skill.currentCooldown}` : `神力 ${skill.mpCost}`}
              </div>
            </button>
          ))}
          <button
            className="combat-skill-btn"
            disabled={!combat.isInCombat}
            onClick={tickCombat}
            style={{ color: '#ff6633', borderColor: 'rgba(200,50,0,0.5)' }}
          >
            <div>普通攻击</div>
            <div style={{ fontSize: '9px', color: '#663300' }}>无消耗</div>
          </button>
          {combat.isInCombat && (
            <button
              className="combat-skill-btn"
              onClick={flee}
              style={{ color: '#888', borderColor: 'rgba(80,80,80,0.5)' }}
            >
              <div>撤退逃跑</div>
              <div style={{ fontSize: '9px', color: '#444' }}>60%成功率</div>
            </button>
          )}
        </div>
      </div>

      {/* 自身状态 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 自身状态</div>
        <div className="vital-list">
          <div className="vital-row">
            <span className="vital-lbl">气血</span>
            <div className="vital-bar">
              <div className="vital-fill" style={{
                width: `${char.maxHp > 0 ? (char.hp / char.maxHp) * 100 : 0}%`,
                background: 'linear-gradient(90deg,#cc2200,#ff4400)',
              }} />
            </div>
            <span className="vital-num red">{char.hp}/{char.maxHp}</span>
          </div>
          <div className="vital-row">
            <span className="vital-lbl">神力</span>
            <div className="vital-bar">
              <div className="vital-fill" style={{
                width: `${char.maxMp > 0 ? (char.mp / char.maxMp) * 100 : 0}%`,
                background: 'linear-gradient(90deg,#0055cc,#0088ff)',
              }} />
            </div>
            <span className="vital-num blue">{char.mp}/{char.maxMp}</span>
          </div>
        </div>
        <div className="combat-stats-grid">
          <span className="red">攻击：{char.stats.attack}</span>
          <span className="cyan">防御：{char.stats.defense}</span>
          <span className="gold">暴击：{char.stats.critRate}%</span>
          <span className="gold">暴伤：{char.stats.critDmg}%</span>
          <span className="green">命中：{char.stats.hit}</span>
          <span className="green">闪避：{char.stats.dodge}</span>
        </div>
      </div>
    </div>
  );
}
