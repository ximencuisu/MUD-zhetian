import { useGameStore } from '../../store/gameStore';
import { REALM_NAMES, REALM_ORDER } from '../../types/game';
import { PHENOMENA, RARITY_LABELS, RARITY_COLORS } from '../../data/phenomena';
import './Panel.css';

function calcBreakthroughLevel(realmIdx: number): number {
  return realmIdx % 4 === 3 ? 15 : 10;
}

export default function CultivationPanel() {
  const char = useGameStore(s => s.character);
  const startCultivation = useGameStore(s => s.startCultivation);
  const stopCultivation = useGameStore(s => s.stopCultivation);
  const breakthrough = useGameStore(s => s.breakthrough);

  const realmIdx = REALM_ORDER.indexOf(char.realm);
  const isPerfect = realmIdx % 4 === 3;
  const nextRealm = REALM_ORDER[realmIdx + 1];
  const nextRealmName = nextRealm ? REALM_NAMES[nextRealm] : '天道极限';

  // Use the same realmLevel-based check as gameStore
  const requiredLevel = calcBreakthroughLevel(realmIdx);
  const canBreakthrough = char.realmLevel >= requiredLevel;
  const levelPct = Math.min(100, (char.realmLevel / requiredLevel) * 100);

  // 挂机时间
  const isCultivating = char.cultivationMode !== 'none';
  const elapsedSec = isCultivating ? Math.floor((Date.now() - char.cultivationStartMs) / 1000) : 0;
  const elapsedH = Math.floor(elapsedSec / 3600);
  const elapsedM = Math.floor((elapsedSec % 3600) / 60);
  const elapsedS = elapsedSec % 60;

  // 气血/神力上限信息
  const effectiveMaxHp = char.maxHp + char.bonusHpCap;
  const effectiveMaxMp = char.maxMp + char.bonusMpCap;
  const baseMaxHp = char.maxHp;
  const baseMaxMp = char.maxMp;

  return (
    <div className="panel-body">
      {/* 当前境界 + 突破 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 境界突破</div>
        <div style={{ color: '#ffd700', fontSize: '17px', marginBottom: '2px', textAlign: 'center', textShadow: '0 0 8px rgba(255,215,0,0.4)' }}>
          {REALM_NAMES[char.realm]}
        </div>
        <div style={{ color: '#886622', fontSize: '11px', textAlign: 'center', marginBottom: '10px' }}>
          {isPerfect ? '【圆满境界】— 可突破至大境界' : '— 可突破至下一小境界 —'}
          {nextRealm && <span style={{ color: '#554422' }}>  →  {nextRealmName}</span>}
        </div>

        {/* 境界等级进度条 */}
        <div style={{ marginBottom: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
            <span style={{ color: '#cc9900' }}>境界积累</span>
            <span style={{ color: canBreakthrough ? '#44ff88' : (char.realmLevel >= requiredLevel * 0.7 ? '#ffcc44' : '#886622') }}>
              Lv.{char.realmLevel} / 需 Lv.{requiredLevel}
            </span>
          </div>
          <div className="sb-bar" style={{ height: '10px' }}>
            <div
              className="sb-bar-fill"
              style={{
                width: `${levelPct}%`,
                background: canBreakthrough
                  ? 'linear-gradient(90deg, #44ff88, #ffdd00)'
                  : 'linear-gradient(90deg, #885500, #ffaa00)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* 修为进度条 */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
            <span style={{ color: '#cc9900' }}>当前修为</span>
            <span style={{ color: '#886622' }}>{char.exp} / {char.expToNext}</span>
          </div>
          <div className="sb-bar" style={{ height: '8px' }}>
            <div
              className="sb-bar-fill exp-fill"
              style={{
                width: `${Math.min(100, (char.exp / char.expToNext) * 100)}%`,
                background: 'linear-gradient(90deg, #664400, #cc8800)',
              }}
            />
          </div>
        </div>

        {/* 突破按钮 */}
        <button
          className="breakthrough-btn"
          disabled={!canBreakthrough}
          style={canBreakthrough
            ? { animation: 'pulse-glow 2s infinite', fontSize: '14px', padding: '10px' }
            : { opacity: 0.4, cursor: 'not-allowed' }
          }
          onClick={breakthrough}
        >
          {canBreakthrough
            ? (isPerfect ? '⚡ 大境界突破！' : '⚡ 突破小境界！')
            : `🔒 修为不足（需 Lv.${requiredLevel}）`}
        </button>

        {/* 大境界提示 */}
        {isPerfect && canBreakthrough && (
          <div style={{ color: '#ffaa00', fontSize: '11px', textAlign: 'center', marginTop: '6px' }}>
            ✦ 大境界突破将触发异象觉醒！
          </div>
        )}
      </div>

      {/* 挂机修炼 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 挂机修炼</div>
        {isCultivating ? (
          <>
            <div style={{ color: '#44ff88', fontSize: '13px', textAlign: 'center', marginBottom: '6px' }}>
              {char.cultivationMode === 'cultivate' ? '⚡ 挂机修炼中' : '☯ 挂机打坐中'}
            </div>
            <div style={{ color: '#886622', fontSize: '11px', textAlign: 'center', marginBottom: '8px' }}>
              已挂机 {elapsedH}时{elapsedM}分{elapsedS}秒
            </div>
            <div style={{ color: '#554422', fontSize: '10px', textAlign: 'center', marginBottom: '8px' }}>
              关闭页面后24小时内仍会持续积累
            </div>
            <button
              className="dungeon-enter-btn"
              style={{ width: '100%', borderColor: '#cc4444', color: '#ff6644' }}
              onClick={stopCultivation}
            >
              停止挂机
            </button>
          </>
        ) : (
          <>
            <div style={{ color: '#886622', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
              选择挂机模式后，修为/气血/神力将持续增长。<br />
              即使关闭页面，24小时内仍会积累进度。
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="dungeon-enter-btn"
                style={{ flex: 1 }}
                onClick={() => startCultivation('cultivate')}
              >
                ⚡ 挂机修炼
              </button>
              <button
                className="dungeon-enter-btn"
                style={{ flex: 1, borderColor: '#4488ff', color: '#44aaff' }}
                onClick={() => startCultivation('meditate')}
              >
                ☯ 挂机打坐
              </button>
            </div>
          </>
        )}
      </div>

      {/* 气血/神力上限 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 气血/神力上限</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div>
            <div style={{ color: '#cc4400', marginBottom: '3px' }}>气血上限</div>
            <div style={{ color: '#886622' }}>基础：{baseMaxHp}</div>
            {char.bonusHpCap > 0 && (
              <div style={{ color: '#44ff88' }}>额外：+{char.bonusHpCap}</div>
            )}
            <div style={{ color: '#554422' }}>总计：{effectiveMaxHp}</div>
          </div>
          <div>
            <div style={{ color: '#0044cc', marginBottom: '3px' }}>神力上限</div>
            <div style={{ color: '#886622' }}>基础：{baseMaxMp}</div>
            {char.bonusMpCap > 0 && (
              <div style={{ color: '#44ff88' }}>额外：+{char.bonusMpCap}</div>
            )}
            <div style={{ color: '#554422' }}>总计：{effectiveMaxMp}</div>
          </div>
        </div>
        <div style={{ color: '#554422', fontSize: '10px', marginTop: '6px' }}>
          打坐超出双倍基础上限后，自动微量提升上限，受当前境界限制。
        </div>
      </div>

      {/* 苦海异象 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 苦海异象</div>
        {char.phenomenonUnlocked && char.phenomenon ? (() => {
          const phen = PHENOMENA[char.phenomenon];
          if (!phen) return null;
          const rarityColor = RARITY_COLORS[phen.rarity];
          const rarityLabel = RARITY_LABELS[phen.rarity];
          return (
            <>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ color: rarityColor, fontSize: '18px', fontWeight: 'bold', textShadow: `0 0 10px ${rarityColor}44` }}>
                  {phen.name}
                </div>
                <div style={{ color: rarityColor, fontSize: '11px' }}>【{rarityLabel}】</div>
              </div>
              <div style={{ color: '#886622', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px', fontStyle: 'italic' }}>
                {phen.description}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', marginBottom: '6px' }}>
                <span className="red">攻击 ×{phen.buff.attackMult}</span>
                <span className="cyan">防御 ×{phen.buff.defenseMult}</span>
                <span className="green">气血 ×{phen.buff.hpMult}</span>
                <span className="blue">神力 ×{phen.buff.mpMult}</span>
                <span className="gold">暴击 +{phen.buff.critRateBonus}%</span>
                <span className="gold">暴伤 +{phen.buff.critDmgBonus}%</span>
                <span>闪避 +{phen.buff.dodgeBonus}</span>
                <span>命中 +{phen.buff.hitBonus}</span>
                <span>格挡 +{phen.buff.parryBonus}</span>
                <span>攻速 +{phen.buff.attackSpeedBonus}</span>
                {phen.buff.lifesteal > 0 && <span style={{ color: '#ff4444' }}>吸血 +{phen.buff.lifesteal}%</span>}
              </div>
              <div style={{ color: '#ffaa00', fontSize: '11px', textAlign: 'center' }}>
                ✦ {phen.buff.specialDesc}
              </div>
            </>
          );
        })() : (
          <>
            <div style={{ color: '#554422', fontSize: '11px', lineHeight: 1.7, marginBottom: '8px' }}>
              苦海圆满突破时，有概率觉醒苦海异象。<br />
              异象觉醒后将获得数倍属性加成，战力飞跃！<br />
              <span style={{ color: '#886622' }}>异象一旦觉醒，终生相随，无法更改。</span>
            </div>
            <div style={{ color: '#333', fontSize: '10px', textAlign: 'center' }}>
              当前境界：{REALM_NAMES[char.realm]}
              {char.realm === 'bitterness_perfect'
                ? ' — 即将觉醒异象！'
                : ' — 需突破至苦海圆满'}
            </div>
          </>
        )}
      </div>

      {/* 下一境界预览 */}
      {nextRealm && (
        <div className="panel-section">
          <div className="panel-section-title" style={{ color: '#554422' }}>◈ 下一境界预览</div>
          <div style={{ color: '#cc9900', fontSize: '13px', textAlign: 'center', marginBottom: '4px' }}>
            {nextRealmName}
          </div>
          <div style={{ color: '#554422', fontSize: '10px', textAlign: 'center' }}>
            {isPerfect
              ? `大境界突破 — 所有属性巨幅提升（+15%）`
              : `小境界突破 — 所有属性中幅提升（+5%）`}
          </div>
        </div>
      )}
    </div>
  );
}
