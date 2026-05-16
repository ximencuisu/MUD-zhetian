import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ITEMS } from '../../data/world';
import { EquipSlot } from '../../types/game';
import './Panel.css';

const QUALITY_BG: Record<string, string> = {
  white:  'rgba(200,200,200,0.05)',
  green:  'rgba(0,180,80,0.07)',
  blue:   'rgba(0,120,220,0.1)',
  purple: 'rgba(150,50,220,0.1)',
  orange: 'rgba(220,140,0,0.12)',
};

const QUALITY_COLORS: Record<string, string> = {
  white: '#cccccc', green: '#44ff88', blue: '#44aaff', purple: '#bb66ff', orange: '#ffaa00',
};
const QUALITY_LABELS: Record<string, string> = {
  white: '凡器', green: '灵器', blue: '王者神兵', purple: '圣兵', orange: '帝兵',
};
const SLOT_LABELS: Record<string, string> = {
  weapon: '法宝', head: '头部', body: '护甲', waist: '腰带', hands: '手部', feet: '脚部',
};
const TYPE_LABELS: Record<string, string> = {
  weapon: '武器', armor: '防具', consumable: '丹药', quest: '任务', material: '材料',
};

function Stars({ n }: { n: number }) {
  if (!n) return null;
  return <span style={{ color: '#885500', fontSize: '10px' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function BagPanel() {
  const char = useGameStore(s => s.character);
  const equipItem = useGameStore(s => s.equipItem);
  const unequipItem = useGameStore(s => s.unequipItem);
  const consumeItem = useGameStore(s => s.useItem);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inv = char.inventory;
  const selectedItem = selectedId ? ITEMS[selectedId] : null;

  const slots: EquipSlot[] = ['weapon', 'head', 'body', 'waist', 'hands', 'feet'];

  return (
    <div className="panel-body">
      {/* 已装备区 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 已装备法宝</div>
        <div className="bag-equip-slots">
          {slots.map(slot => {
            const itemId = char.equipment[slot];
            const item = itemId ? ITEMS[itemId] : null;
            const color = item?.quality ? QUALITY_COLORS[item.quality] : '#333';
            const stars = item ? (item.quality === 'orange' ? 5 : item.quality === 'purple' ? 4 : item.quality === 'blue' ? 3 : item.quality === 'green' ? 2 : 1) : 0;
            return (
              <div key={slot} className="bag-slot-row" style={{ background: item ? QUALITY_BG[item.quality || 'white'] : 'transparent' }}>
                <span className="bag-slot-pos">{SLOT_LABELS[slot]}</span>
                <Stars n={stars} />
                <span className="bag-slot-name" style={{ color, flex: 1 }}>
                  {item ? item.name : <span style={{ color: '#333' }}>（空）</span>}
                </span>
                {item && (
                  <button
                    className="equip-remove-btn"
                    style={{ marginLeft: '6px' }}
                    onClick={() => unequipItem(slot)}
                    title="卸下"
                  >卸</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 背包物品 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 背包物品（{inv.length}/100件）</div>
        {inv.length === 0 ? (
          <div style={{ color: '#333', fontSize: '12px', padding: '8px' }}>背包空空如也</div>
        ) : (
          <div className="bag-item-grid">
            {inv.map((id, idx) => {
              const item = ITEMS[id];
              if (!item) return null;
              const color = item.quality ? QUALITY_COLORS[item.quality] : '#aaa';
              const isSelected = selectedId === id && inv.indexOf(id) === idx;
              return (
                <div
                  key={`${id}-${idx}`}
                  className={`bag-item-card ${isSelected ? 'selected' : ''}`}
                  style={{ background: isSelected ? undefined : QUALITY_BG[item.quality || 'white'] }}
                  onClick={() => setSelectedId(isSelected ? null : id)}
                >
                  <div className="bag-item-name" style={{ color }}>{item.name}</div>
                  <div className="bag-item-type">
                    {item.quality ? QUALITY_LABELS[item.quality] : ''} {TYPE_LABELS[item.type] || item.type}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 选中物品操作 */}
      {selectedItem && (
        <div className="panel-section">
          <div className="panel-section-title">◈ {selectedItem.name}</div>
          <div style={{ color: '#886622', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
            {selectedItem.description}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginBottom: '8px', fontSize: '11px' }}>
            {selectedItem.attack && <span className="red">攻击 +{selectedItem.attack}</span>}
            {selectedItem.defense && <span className="cyan">防御 +{selectedItem.defense}</span>}
            {selectedItem.hp && <span className="green">气血 +{selectedItem.hp}</span>}
            {selectedItem.mp && <span className="blue">神力 +{selectedItem.mp}</span>}
            {selectedItem.bonusStr && <span className="gold">神力 +{selectedItem.bonusStr}</span>}
            {selectedItem.bonusCon && <span className="gold">根骨 +{selectedItem.bonusCon}</span>}
            {selectedItem.bonusAgi && <span className="gold">速度 +{selectedItem.bonusAgi}</span>}
            {selectedItem.bonusInt && <span className="gold">感知 +{selectedItem.bonusInt}</span>}
          </div>
          {selectedItem.specialEffect && (
            <div style={{ color: '#ffaa00', fontSize: '11px', marginBottom: '8px' }}>
              ✦ {selectedItem.specialEffect}
            </div>
          )}
          <div className="bag-action-bar">
            {selectedItem.slot && (
              <button className="bag-action-btn" onClick={() => { equipItem(selectedId!); setSelectedId(null); }}>
                装备
              </button>
            )}
            {selectedItem.type === 'consumable' && (
              <button className="bag-action-btn" style={{ color: '#44ff88' }} onClick={() => { consumeItem(selectedId!); setSelectedId(null); }}>
                使用
              </button>
            )}
            <button className="bag-action-btn" style={{ color: '#554422' }} onClick={() => setSelectedId(null)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 货币底栏 */}
      <div className="bag-currency">
        <span className="bag-currency-item">源块：{char.yuankuai}</span>
        <span className="bag-currency-item">金叶：{char.gold}</span>
        <span className="bag-currency-item">银两：{char.silver}</span>
      </div>
    </div>
  );
}
