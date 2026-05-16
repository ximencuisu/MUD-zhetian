import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SHOP_ITEMS } from '../../data/world';
import { PHENOMENA, RARITY_LABELS, RARITY_COLORS } from '../../data/phenomena';
import { PhenomenonId } from '../../types/game';
import './Panel.css';

const QUALITY_COLORS: Record<string, string> = {
  white: '#cccccc', green: '#44ff88', blue: '#44aaff', purple: '#bb66ff', orange: '#ffaa00',
};

export default function ShopPanel() {
  const char = useGameStore(s => s.character);
  const buyShopItem = useGameStore(s => s.buyShopItem);
  const choosePhenomenon = useGameStore(s => s.choosePhenomenon);
  const [showPhenomenonPicker, setShowPhenomenonPicker] = useState(false);

  const regularItems = Object.values(SHOP_ITEMS).filter(item => (item.goldPrice ?? 0) > 0 && (item.yuankuaiPrice ?? 0) === 0);
  const specialItems = Object.values(SHOP_ITEMS).filter(item => (item.yuankuaiPrice ?? 0) > 0);

  return (
    <div className="panel-body">
      {/* 货币信息 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 我的资产</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ color: '#ffd700' }}>源块：{char.yuankuai}</div>
          <div style={{ color: '#ffcc00' }}>金叶：{char.gold}</div>
          <div style={{ color: '#aaa' }}>银两：{char.silver}</div>
        </div>
      </div>

      {/* 普通商品 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 杂货铺（金叶）</div>                {regularItems.map(item => {
          const canAfford = char.gold >= (item.goldPrice ?? 0);
          const qColor = QUALITY_COLORS[item.quality || 'white'];
          const hasBuff = item.consumableEffects && item.consumableEffects.length > 0;
          return (
            <div key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid rgba(80,50,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1, color: qColor, fontSize: '12px' }}>{item.name}</span>
                <span style={{ color: '#ffcc00', fontSize: '11px', marginRight: '8px' }}>{item.goldPrice} 金叶</span>
                {item.hp && <span style={{ color: '#ff6644', fontSize: '10px', marginRight: '4px' }}>回血+{item.hp}</span>}
                {item.mp && <span style={{ color: '#4488ff', fontSize: '10px', marginRight: '4px' }}>回神+{item.mp}</span>}
                <button
                  className="dungeon-enter-btn"
                  style={{ padding: '2px 8px', fontSize: '11px', opacity: canAfford ? 1 : 0.4, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                  onClick={() => buyShopItem(item.id)}
                >
                  购买
                </button>
              </div>
              {hasBuff && (
                <div style={{ marginTop: '2px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {item.consumableEffects!.map((eff, i) => (
                    <span key={i} style={{
                      fontSize: '10px', padding: '1px 4px', borderRadius: '2px',
                      background: 'rgba(0,100,200,0.12)', border: '1px solid rgba(0,100,200,0.25)',
                      color: '#66aaff',
                    }}>
                      {eff.icon} {eff.description} · {eff.duration}回合
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 神药商店 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 神药阁（源块）</div>
        <div style={{ color: '#886622', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
          神药以源块交易，助修炼者洗练异象、逆天改命。
        </div>

        {specialItems.map(item => (
          <div key={item.id} className="quest-card" style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span className="quest-name" style={{ color: QUALITY_COLORS[item.quality || 'white'] }}>
                {item.name}
              </span>
              <span style={{ color: '#ffd700', fontSize: '11px', marginLeft: '8px' }}>
                {item.yuankuaiPrice} 源块
              </span>
            </div>
            <div className="quest-desc">{item.description}</div>
            {item.specialEffect && (
              <div style={{ color: '#ffaa00', fontSize: '11px', marginBottom: '6px' }}>
                ✦ {item.specialEffect}
              </div>
            )}
            <button
              className="dungeon-enter-btn"
              style={{
                width: '100%',
                opacity: char.yuankuai >= (item.yuankuaiPrice ?? 0) ? 1 : 0.4,
                cursor: char.yuankuai >= (item.yuankuaiPrice ?? 0) ? 'pointer' : 'not-allowed',
              }}
              onClick={() => buyShopItem(item.id)}
            >
              购买
            </button>
          </div>
        ))}
      </div>

      {/* 散功重修 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 散功重修</div>
        <div style={{ color: '#886622', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
          散去当前苦海异象之力，重新觉醒新的异象。<br />
          十次重修后仍不满意，可自行选择一次异象。
        </div>
        <div style={{ color: '#cc9900', fontSize: '11px', marginBottom: '8px', textAlign: 'center' }}>
          已重修：{char.phenomenonRerollCount}/10 次
          {char.phenomenonRerollCount >= 10 && (
            <span style={{ color: '#44ff88' }}> — 已达标！</span>
          )}
        </div>
        <button
          className="dungeon-enter-btn"
          style={{
            width: '100%',
            borderColor: '#cc4444',
            color: '#ff6644',
            opacity: char.phenomenonRerollCount < 10 ? 1 : 0.5,
          }}
          onClick={() => useGameStore.getState().rerollPhenomenon()}
        >
          散功重修（随机新异象）
        </button>
        {char.phenomenonRerollCount >= 10 && (
          <button
            className="dungeon-enter-btn"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => setShowPhenomenonPicker(p => !p)}
          >
            {showPhenomenonPicker ? '关闭选择' : '自选异象'}
          </button>
        )}
      </div>

      {/* 异象选择器 */}
      {showPhenomenonPicker && char.phenomenonRerollCount >= 10 && (
        <div className="panel-section">
          <div className="panel-section-title" style={{ color: '#ffd700' }}>◈ 自选异象</div>
          <div style={{ color: '#886622', fontSize: '10px', marginBottom: '8px' }}>
            选择后将永久替换当前异象，请慎重考虑。
          </div>
          {Object.values(PHENOMENA).map(phen => {
            const rarityColor = RARITY_COLORS[phen.rarity];
            const isCurrent = char.phenomenon === phen.id;
            return (
              <div
                key={phen.id}
                className={`quest-card ${isCurrent ? 'selected' : ''}`}
                style={{ marginBottom: '6px', borderColor: isCurrent ? rarityColor : 'rgba(80,50,0,0.3)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: rarityColor, fontSize: '13px', fontWeight: 'bold' }}>
                    {phen.name}
                  </span>
                  <span style={{ color: rarityColor, fontSize: '10px' }}>
                    【{RARITY_LABELS[phen.rarity]}】
                  </span>
                </div>
                <div style={{ color: '#886622', fontSize: '10px', marginBottom: '4px' }}>
                  {phen.description.slice(0, 60)}…
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', fontSize: '10px', marginBottom: '6px' }}>
                  <span className="red">攻×{phen.buff.attackMult}</span>
                  <span className="cyan">防×{phen.buff.defenseMult}</span>
                  <span className="green">血×{phen.buff.hpMult}</span>
                  <span className="blue">神×{phen.buff.mpMult}</span>
                  <span className="gold">暴击+{phen.buff.critRateBonus}%</span>
                  <span className="gold">暴伤+{phen.buff.critDmgBonus}%</span>
                </div>
                {!isCurrent && (
                  <button
                    className="dungeon-enter-btn"
                    style={{ width: '100%' }}
                    onClick={() => {
                      choosePhenomenon(phen.id as PhenomenonId);
                      setShowPhenomenonPicker(false);
                    }}
                  >
                    选择此异象
                  </button>
                )}
                {isCurrent && (
                  <div style={{ color: '#44ff88', fontSize: '11px', textAlign: 'center' }}>
                    ✓ 当前异象
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
