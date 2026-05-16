import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ITEMS } from '../../data/world';
import './EquipmentEnhancement.css';

const MAX_ENHANCE_LEVEL = 10;
const ENHANCEMENT_COSTS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200];
const ENHANCEMENT_SUCCESS_RATES = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
const ENHANCEMENT_EXP_PER_LEVEL = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];

const SLOT_NAMES: Record<string, string> = {
  weapon: '武器',
  head: '头盔',
  body: '护甲',
  waist: '腰带',
  hands: '护手',
  feet: '靴子',
};
const SLOTS = Object.keys(SLOT_NAMES);

function getEnhanceLevelColor(level: number): string {
  if (level <= 0) return '#8fbc8f';
  if (level <= 3) return '#66ccff';
  if (level <= 5) return '#cc66ff';
  if (level <= 7) return '#ff9900';
  if (level <= 9) return '#ff4466';
  return '#ff0000';
}

function getEnhanceLevelLabel(level: number): string {
  if (level <= 0) return '未强化';
  if (level <= 3) return '初阶';
  if (level <= 5) return '中阶';
  if (level <= 7) return '高阶';
  if (level <= 9) return '绝世';
  return '至尊';
}

interface StatPreview {
  label: string;
  base: number;
  enhanced: number;
  unit: string;
}

export default function EquipmentEnhancement() {
  const { character, addMessage, updateCharacter } = useGameStore();
  const [selectedSlot, setSelectedSlot] = useState<string>('weapon');
  const [enhancing, setEnhancing] = useState(false);
  const [showResult, setShowResult] = useState<'success' | 'fail' | null>(null);
  const [useProtect, setUseProtect] = useState(false);

  if (!character) {
    return <div className="enhancement-empty">请先创建角色</div>;
  }

  const equipment = character.equipment || {};
  const enhanceLevels = character.enhanceLevels || {};
  const equippedId = equipment[selectedSlot as keyof typeof equipment];
  const selectedEquipment = equippedId ? ITEMS[equippedId] : null;
  const currentLevel = selectedSlot ? (enhanceLevels[selectedSlot] || 0) : 0;
  const nextLevel = Math.min(currentLevel + 1, MAX_ENHANCE_LEVEL);
  const cost = currentLevel < MAX_ENHANCE_LEVEL ? ENHANCEMENT_COSTS[currentLevel] : 0;
  const successRate = currentLevel < MAX_ENHANCE_LEVEL ? ENHANCEMENT_SUCCESS_RATES[currentLevel] : 0;

  // Check if player has protection items
  const hasProtectStone = character.inventory.includes('protect_stone');

  // Calculate stat preview
  const getStatPreview = (): StatPreview[] => {
    if (!selectedEquipment) return [];
    const previews: StatPreview[] = [];
    const mult = (level: number) => 1 + level * 0.05;
    if (selectedEquipment.attack) {
      previews.push({
        label: '攻击',
        base: Math.floor(selectedEquipment.attack * mult(currentLevel)),
        enhanced: Math.floor(selectedEquipment.attack * mult(currentLevel + 1)),
        unit: '',
      });
    }
    if (selectedEquipment.defense) {
      previews.push({
        label: '防御',
        base: Math.floor(selectedEquipment.defense * mult(currentLevel)),
        enhanced: Math.floor(selectedEquipment.defense * mult(currentLevel + 1)),
        unit: '',
      });
    }
    if (selectedEquipment.hp) {
      previews.push({
        label: '气血',
        base: Math.floor(selectedEquipment.hp * mult(currentLevel)),
        enhanced: Math.floor(selectedEquipment.hp * mult(currentLevel + 1)),
        unit: '',
      });
    }
    if (selectedEquipment.mp) {
      previews.push({
        label: '神力',
        base: Math.floor(selectedEquipment.mp * mult(currentLevel)),
        enhanced: Math.floor(selectedEquipment.mp * mult(currentLevel + 1)),
        unit: '',
      });
    }
    return previews;
  };

  const handleEnhance = () => {
    if (!selectedEquipment || enhancing) return;
    if (currentLevel >= MAX_ENHANCE_LEVEL) {
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: '该装备已达到最高强化等级 +10！',
        sender: '系统',
      });
      return;
    }

    // Check gold
    if (character.gold < cost) {
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: `强化需要 ${cost} 金币，您的金币不足！`,
        sender: '系统',
      });
      return;
    }

    // Check protection stone
    if (useProtect && !hasProtectStone) {
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: '没有保护符！请先获取保护符。',
        sender: '系统',
      });
      return;
    }

    setEnhancing(true);
    setShowResult(null);
    const roll = Math.random() * 100;

    setTimeout(() => {
      if (roll < successRate) {
        // Success
        const newLevel = currentLevel + 1;
        const newEnhanceLevels = { ...enhanceLevels, [selectedSlot]: newLevel };

        // Deduct gold
        updateCharacter({
          gold: character.gold - cost,
          enhanceLevels: newEnhanceLevels,
        });

        // Remove protection stone if used
        if (useProtect) {
          const newInv = character.inventory.filter(id => id !== 'protect_stone');
          updateCharacter({ inventory: newInv });
          setUseProtect(false);
        }

        addMessage({
          id: Date.now().toString(),
          channel: 'system',
          content: `✦ 强化成功！${SLOT_NAMES[selectedSlot]}【${selectedEquipment.name}】强化至 +${newLevel}！`,
          sender: '系统',
        });
        setShowResult('success');
      } else {
        // Fail
        // Deduct gold (cost is lost)
        updateCharacter({ gold: character.gold - cost });

        if (useProtect) {
          // Protection stone prevents level loss
          const newInv = character.inventory.filter(id => id !== 'protect_stone');
          updateCharacter({ inventory: newInv });
          setUseProtect(false);
          addMessage({
            id: Date.now().toString(),
            channel: 'system',
            content: `⚡ 强化失败！保护符已生效，强化等级保持不变。金币 -${cost}`,
            sender: '系统',
          });
        } else {
          // Level down on fail if above +3
          let newLevel = currentLevel;
          if (currentLevel >= 4) {
            newLevel = currentLevel - 1;
            updateCharacter({
              enhanceLevels: { ...enhanceLevels, [selectedSlot]: newLevel },
            });
            addMessage({
              id: Date.now().toString(),
              channel: 'system',
              content: `💥 强化失败！装备等级降至 +${newLevel}，金币 -${cost}`,
              sender: '系统',
            });
          } else {
            addMessage({
              id: Date.now().toString(),
              channel: 'system',
              content: `❌ 强化失败！金币 -${cost}，强化等级未变化。`,
              sender: '系统',
            });
          }
        }
        setShowResult('fail');
      }

      setTimeout(() => {
        setEnhancing(false);
        setShowResult(null);
      }, 800);
    }, 600);
  };

  const statPreview = getStatPreview();

  return (
    <div className="equipment-enhancement">
      <h3 className="enhancement-title">⚔ 装备强化</h3>

      <div className="enhancement-top-bar">
        <span>💰 金币: <strong className="gold-amount">{character.gold.toLocaleString()}</strong></span>
        <span>🛡 保护符: <strong className={hasProtectStone ? 'have-item' : 'no-item'}>
          {hasProtectStone ? `×${character.inventory.filter(i => i === 'protect_stone').length}` : '无'}
        </strong></span>
      </div>

      {/* Slot selector */}
      <div className="equipment-slots">
        {SLOTS.map(slot => {
          const id = equipment[slot as keyof typeof equipment];
          const lvl = enhanceLevels[slot] || 0;
          return (
            <button
              key={slot}
              className={`slot-btn ${selectedSlot === slot ? 'selected' : ''} ${lvl > 0 ? 'has-level' : ''}`}
              onClick={() => { setSelectedSlot(slot); setShowResult(null); }}
              title={id ? `${SLOT_NAMES[slot]}: +${lvl}` : `${SLOT_NAMES[slot]} (空)`}
            >
              <span className="slot-name">{SLOT_NAMES[slot]}</span>
              {id ? (
                <span className="slot-level" style={{ color: getEnhanceLevelColor(lvl) }}>
                  +{lvl}
                </span>
              ) : (
                <span className="slot-empty">空</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Equipment detail */}
      {selectedEquipment ? (
        <div className={`selected-equipment ${showResult ? `result-${showResult}` : ''}`}>
          <div className="equip-header">
            <span className="equip-name" style={{ color: getEnhanceLevelColor(currentLevel) }}>
              {selectedEquipment.name}
            </span>
            <span className="equip-quality" data-quality={selectedEquipment.quality || 'white'}>
              {selectedEquipment.quality === 'orange' ? '传说' :
               selectedEquipment.quality === 'purple' ? '史诗' :
               selectedEquipment.quality === 'blue' ? '精良' :
               selectedEquipment.quality === 'green' ? '优秀' : '普通'}
            </span>
          </div>

          {/* Current enhancement level */}
          <div className="enhance-level-display">
            <div className="level-ring" style={{
              borderColor: getEnhanceLevelColor(currentLevel),
              boxShadow: currentLevel > 0 ? `0 0 20px ${getEnhanceLevelColor(currentLevel)}40` : 'none',
            }}>
              <span className="level-number" style={{ color: getEnhanceLevelColor(currentLevel) }}>
                +{currentLevel}
              </span>
              <span className="level-label">{getEnhanceLevelLabel(currentLevel)}</span>
            </div>
          </div>

          {/* Stat preview */}
          <div className="stat-preview">
            <div className="stat-preview-header">
              <span>当前属性</span>
              {currentLevel < MAX_ENHANCE_LEVEL && <span className="arrow">→</span>}
              {currentLevel < MAX_ENHANCE_LEVEL && <span>强化后</span>}
            </div>
            {statPreview.map((stat, i) => (
              <div key={i} className="stat-preview-row">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-base">{stat.base}{stat.unit}</span>
                {currentLevel < MAX_ENHANCE_LEVEL && <span className="stat-arrow">→</span>}
                {currentLevel < MAX_ENHANCE_LEVEL && (
                  <span className="stat-enhanced" style={{ color: getEnhanceLevelColor(currentLevel + 1) }}>
                    {stat.enhanced}{stat.unit}
                    <span className="stat-diff">(+{stat.enhanced - stat.base})</span>
                  </span>
                )}
              </div>
            ))}
            {selectedEquipment.specialEffect && (
              <div className="special-effect">
                ✦ {selectedEquipment.specialEffect}
              </div>
            )}
          </div>

          {/* Enhancement controls */}
          {currentLevel < MAX_ENHANCE_LEVEL ? (
            <div className="enhance-controls">
              <div className="enhance-info-grid">
                <div className="info-item">
                  <span className="info-label">费用</span>
                  <span className="info-value">{cost.toLocaleString()} 💰</span>
                </div>
                <div className="info-item">
                  <span className="info-label">成功率</span>
                  <span className={`info-value rate-${successRate >= 70 ? 'high' : successRate >= 40 ? 'mid' : 'low'}`}>
                    {successRate}%
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">失败惩罚</span>
                  <span className="info-value penalty-info">
                    {currentLevel < 4 ? '仅扣金币' : '降1级'}
                  </span>
                </div>
              </div>

              {/* Protection stone toggle */}
              {hasProtectStone && currentLevel >= 4 && (
                <label className="protect-toggle">
                  <input
                    type="checkbox"
                    checked={useProtect}
                    onChange={e => setUseProtect(e.target.checked)}
                  />
                  <span>使用保护符（防止降级）</span>
                </label>
              )}

              <button
                className={`enhance-btn ${enhancing ? 'enhancing' : ''} ${showResult === 'success' ? 'btn-success' : ''} ${showResult === 'fail' ? 'btn-fail' : ''}`}
                onClick={handleEnhance}
                disabled={enhancing || character.gold < cost}
              >
                {enhancing ? (
                  <span className="enhance-anim">
                    <span className="sparkle" /> 强化中...
                    <span className="sparkle" />
                  </span>
                ) : showResult === 'success' ? '✦ 成功！' :
                  showResult === 'fail' ? '💥 失败' :
                  '开始强化'}
              </button>
            </div>
          ) : (
            <div className="max-level-display">
              <span>✦ 已臻至境 ✦</span>
              <span className="max-sub">该装备已达最高强化等级</span>
            </div>
          )}
        </div>
      ) : (
        <div className="no-equipment">
          <p>该装备槽位为空</p>
          <p className="hint">请先装备物品后再进行强化</p>
        </div>
      )}

      <div className="enhancement-tips">
        <h4>📜 强化说明</h4>
        <ul>
          <li>强化等级 <strong>+1~+3</strong>：100% 成功，失败仅扣金币</li>
          <li>强化等级 <strong>+4~+6</strong>：成功率递减，失败降 1 级</li>
          <li>强化等级 <strong>+7~+9</strong>：低成功率，高回报</li>
          <li><strong>+10</strong>：至尊境界，属性大幅提升</li>
          <li>每级 <strong>+5%</strong> 基础属性加成</li>
          <li>保护符可防止 +4 以上强化失败降级</li>
        </ul>
      </div>
    </div>
  );
}
