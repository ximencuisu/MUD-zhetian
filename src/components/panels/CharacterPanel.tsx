import { useGameStore } from '../../store/gameStore';
import { ITEMS } from '../../data/world';
import { SECTS } from '../../data/sects';
import { REALM_NAMES, PHYSIQUE_NAMES, SECT_RANK_ORDER, RANK_PROMO_REQS, SectRank } from '../../types/game';
import { PHENOMENA, RARITY_COLORS } from '../../data/phenomena';
import './Panel.css';

const SECRET_REALM_NAMES: Record<string, string> = {
  bitterness: '轮海', spring: '轮海', bridge: '轮海', farshore: '轮海',
  daogong: '道宫', siji: '四极', hualong: '化龙', xiantai: '仙台',
};
function getSecretRealm(realm: string): string {
  for (const [key, name] of Object.entries(SECRET_REALM_NAMES)) {
    if (realm.startsWith(key)) return name;
  }
  return '轮海';
}

const QUALITY_COLORS: Record<string, string> = {
  white: '#cccccc', green: '#44ff88', blue: '#44aaff', purple: '#bb66ff', orange: '#ffaa00',
};
const SLOT_LABELS: Record<string, string> = {
  weapon: '法宝', head: '头部', body: '护甲', waist: '腰带', hands: '手部', feet: '脚部',
};

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="vital-bar">
      <div className="vital-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function AttrBar({ value }: { value: number }) {
  return (
    <div className="attr-bar">
      <div className="attr-fill" style={{ width: `${Math.min(100, value * 4.5)}%` }} />
    </div>
  );
}

export default function CharacterPanel() {
  const char = useGameStore(s => s.character);
  const unequipItem = useGameStore(s => s.unequipItem);
  const enterSectMap = useGameStore(s => s.enterSectMap);
  const promoteSectRank = useGameStore(s => s.promoteSectRank);
  const sect = char.sect ? SECTS[char.sect] : null;
  const playerRank = char.sectRank as SectRank | null;
  const playerRankIdx = playerRank ? SECT_RANK_ORDER.indexOf(playerRank) : -1;
  const promoReq = playerRank ? RANK_PROMO_REQS[playerRank] : undefined;
  const nextRank = (playerRank && playerRankIdx >= 0 && playerRankIdx < SECT_RANK_ORDER.length - 1)
    ? SECT_RANK_ORDER[playerRankIdx + 1] : null;
  const realmName = REALM_NAMES[char.realm] || char.realm;
  const physiqueName = PHYSIQUE_NAMES[char.physique] || char.physique;

  return (
    <div className="panel-body">
      {/* 基本信息 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 基本信息</div>
        <div className="char-info-grid">
          <div className="char-info-row"><span className="ci-lbl">道号</span><span className="ci-val gold">{char.name}</span></div>
          <div className="char-info-row"><span className="ci-lbl">性别</span><span className="ci-val">{char.gender === 'male' ? '男' : '女'}</span></div>
          <div className="char-info-row"><span className="ci-lbl">境界</span><span className="ci-val gold">{realmName}</span></div>
          <div className="char-info-row"><span className="ci-lbl">等级</span><span className="ci-val cyan">Lv.{char.realmLevel}</span></div>
          <div className="char-info-row"><span className="ci-lbl">年龄</span><span className="ci-val">{char.age}岁</span></div>
          <div className="char-info-row"><span className="ci-lbl">体质</span><span className="ci-val orange">{physiqueName}</span></div>
          {char.phenomenonUnlocked && char.phenomenon && (() => {
            const phen = PHENOMENA[char.phenomenon];
            if (!phen) return null;
            return (
              <div className="char-info-row">
                <span className="ci-lbl">异象</span>
                <span className="ci-val" style={{ color: RARITY_COLORS[phen.rarity] }}>{phen.name}</span>
              </div>
            );
          })()}
          <div className="char-info-row"><span className="ci-lbl">秘境</span><span className="ci-val orange">{getSecretRealm(char.realm)}秘境</span></div>
          <div className="char-info-row"><span className="ci-lbl">声望</span><span className="ci-val">{char.reputation}</span></div>
          <div className="char-info-row"><span className="ci-lbl">潜能</span><span className="ci-val cyan">{char.potential}</span></div>
          <div className="char-info-row">
            <span className="ci-lbl">门派</span>
            {sect ? (
              <span
                className="ci-val cyan"
                style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '2px' }}
                onClick={() => enterSectMap(char.sect!)}
                title="点击进入门派"
              >
                {sect.fullName} ▶
              </span>
            ) : (
              <span className="ci-val" style={{ color: '#554422' }}>无门无派</span>
            )}
          </div>
          <div className="char-info-row">
            <span className="ci-lbl">职位</span>
            <span className="ci-val" style={{ color: playerRank ? '#ffcc44' : undefined }}>{playerRank || '—'}</span>
          </div>
          {playerRank && (
            <div className="char-info-row">
              <span className="ci-lbl">贡献</span>
              <span className="ci-val gold">{char.contribution || 0}</span>
            </div>
          )}
          {nextRank && promoReq && (
            <div className="char-info-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#554422' }}>
                <span>晋升 → {nextRank}</span>
                <span>{char.contribution || 0}/{promoReq.minContrib} 贡献 · 需{REALM_NAMES[promoReq.minRealm]}</span>
              </div>
              <div style={{ background: 'rgba(30,15,0,0.5)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg,#7a5000,#ffcc44)',
                  width: `${Math.min(100, ((char.contribution || 0) / promoReq.minContrib) * 100)}%`,
                  height: '100%', transition: 'width 0.3s',
                }} />
              </div>
              <button
                style={{ background: 'rgba(15,10,0,0.7)', border: '1px solid #ffcc4455', color: '#ffcc44', borderRadius: 3, padding: '2px 0', fontSize: '10px', cursor: 'pointer', marginTop: 2 }}
                onClick={promoteSectRank}
              >
                申请晋升至{nextRank}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 气血神力精力 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 生命状态</div>
        <div className="vital-list">
          <div className="vital-row">
            <span className="vital-lbl">气血</span>
            <Bar value={char.hp} max={char.maxHp} color="linear-gradient(90deg,#cc2200,#ff4400)" />
            <span className="vital-num red">{char.hp}/{char.maxHp}</span>
          </div>
          <div className="vital-row">
            <span className="vital-lbl">神力</span>
            <Bar value={char.mp} max={char.maxMp} color="linear-gradient(90deg,#0055cc,#0088ff)" />
            <span className="vital-num blue">{char.mp}/{char.maxMp}</span>
          </div>
          <div className="vital-row">
            <span className="vital-lbl">精力</span>
            <Bar value={char.energy} max={char.maxEnergy} color="linear-gradient(90deg,#557700,#aaff00)" />
            <span className="vital-num green">{char.energy}/{char.maxEnergy}</span>
          </div>
          <div className="vital-row">
            <span className="vital-lbl">修为</span>
            <Bar value={char.exp} max={char.expToNext} color="linear-gradient(90deg,#885500,#ffaa00)" />
            <span className="vital-num gold">{char.exp}/{char.expToNext}</span>
          </div>
        </div>
      </div>

      {/* 先天属性 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 先天根骨</div>
        <div className="attr-list">
          {[
            ['神力', char.attributes.shenli, '（影响攻击）'],
            ['根骨', char.attributes.gengu, '（影响气血）'],
            ['速度', char.attributes.sudu, '（影响闪避）'],
            ['感知', char.attributes.ganzhi, '（影响暴击）'],
            ['容貌', char.attributes.mianrong, '（影响交际）'],
            ['气运', char.attributes.qiyun, '（影响掉落）'],
          ].map(([label, val, hint]) => (
            <div key={label as string} className="attr-row">
              <span className="attr-lbl">{label}</span>
              <AttrBar value={val as number} />
              <span className="attr-val cyan">{val}</span>
              <span className="attr-hint">{hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 战斗属性 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 战斗能力</div>
        <div className="combat-stats-grid">
          <div className="cs-row"><span className="cs-lbl">攻击</span><span className="cs-val red">{char.stats.attack}</span></div>
          <div className="cs-row"><span className="cs-lbl">防御</span><span className="cs-val cyan">{char.stats.defense}</span></div>
          <div className="cs-row"><span className="cs-lbl">命中</span><span className="cs-val">{char.stats.hit}</span></div>
          <div className="cs-row"><span className="cs-lbl">闪避</span><span className="cs-val">{char.stats.dodge}</span></div>
          <div className="cs-row"><span className="cs-lbl">格挡</span><span className="cs-val">{char.stats.parry}</span></div>
          <div className="cs-row"><span className="cs-lbl">暴击率</span><span className="cs-val gold">{char.stats.critRate}%</span></div>
          <div className="cs-row"><span className="cs-lbl">暴击伤害</span><span className="cs-val gold">{char.stats.critDmg}%</span></div>
          <div className="cs-row"><span className="cs-lbl">攻速</span><span className="cs-val">{char.stats.attackSpeed}</span></div>
        </div>
      </div>

      {/* 高级战斗属性 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 战斗属性</div>
        <div className="combat-stats-grid">
          <div className="cs-row"><span className="cs-lbl">最终伤害</span><span className="cs-val gold">{char.stats.finalDamage}</span></div>
          <div className="cs-row"><span className="cs-lbl">忽视防御</span><span className="cs-val cyan">{char.stats.defIgnore}</span></div>
          <div className="cs-row"><span className="cs-lbl">暴击抵抗</span><span className="cs-val">{char.stats.critResist}%</span></div>
          <div className="cs-row"><span className="cs-lbl">冷却时间减少</span><span className="cs-val">{char.stats.cdReduction}%</span></div>
          <div className="cs-row"><span className="cs-lbl">内力消耗减少</span><span className="cs-val">{char.stats.mpCostReduction}%</span></div>
          <div className="cs-row"><span className="cs-lbl">负面抵抗</span><span className="cs-val">{char.stats.debuffResist}%</span></div>
          <div className="cs-row"><span className="cs-lbl">释放速度</span><span className="cs-val">{char.stats.castSpeed}</span></div>
          <div className="cs-row"><span className="cs-lbl">吸血</span><span className="cs-val">{char.stats.lifesteal}%</span></div>
          <div className="cs-row"><span className="cs-lbl">伤害减免</span><span className="cs-val">{char.stats.dmgReduction}%</span></div>
          <div className="cs-row"><span className="cs-lbl">经验加成</span><span className="cs-val">{char.stats.expBonus}%</span></div>
          <div className="cs-row"><span className="cs-lbl">打坐效率</span><span className="cs-val">{char.stats.practiceEfficiency}%</span></div>
          <div className="cs-row"><span className="cs-lbl">练习效率</span><span className="cs-val">{char.stats.meditationEfficiency}%</span></div>
        </div>
      </div>

      {/* 秘境进度 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 秘境修炼</div>
        <div className="attr-list">
          <div className="attr-row">
            <span className="attr-lbl">苦海广度</span>
            <AttrBar value={char.luohai} />
            <span className="attr-val cyan">{char.luohai}/100</span>
          </div>
          <div className="attr-row">
            <span className="attr-lbl">命泉品质</span>
            <AttrBar value={char.mingyuan} />
            <span className="attr-val cyan">{char.mingyuan}/100</span>
          </div>
          <div className="attr-row">
            <span className="attr-lbl">神桥坚固</span>
            <AttrBar value={char.shengqiao} />
            <span className="attr-val cyan">{char.shengqiao}/100</span>
          </div>
        </div>
      </div>

      {/* 装备槽 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 法宝装备</div>
        <div className="equip-slots">
          {Object.entries(char.equipment).map(([slot, itemId]) => {
            const item = itemId ? ITEMS[itemId] : null;
            const color = item?.quality ? QUALITY_COLORS[item.quality] : '#444';
            const elv = (char.enhanceLevels?.[slot] || 0);
            const enhanceColor = elv >= 7 ? '#ff4466' : elv >= 4 ? '#ff9900' : elv > 0 ? '#66ccff' : undefined;
            return (
              <div key={slot} className="equip-slot-row">
                <span className="equip-slot-lbl">{SLOT_LABELS[slot] || slot}</span>
                <span className="equip-item-name" style={{ color }}>
                  {item ? item.name : '（未装备）'}
                  {item && elv > 0 && (
                    <span className="equip-enhance-lvl" style={{ color: enhanceColor, marginLeft: 6, fontSize: 11, fontWeight: 'bold' }}>
                      +{elv}
                    </span>
                  )}
                </span>
                {item && (
                  <button className="equip-remove-btn" onClick={() => unequipItem(slot)}>卸</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 资产 */}
      <div className="panel-section">
        <div className="panel-section-title">◈ 资产</div>
        <div className="char-info-grid">
          <div className="char-info-row"><span className="ci-lbl">源块</span><span className="ci-val gold">{char.yuankuai}</span></div>
          <div className="char-info-row"><span className="ci-lbl">金叶</span><span className="ci-val gold">{char.gold}</span></div>
          <div className="char-info-row"><span className="ci-lbl">银两</span><span className="ci-val">{char.silver}</span></div>
        </div>
      </div>

    </div>
  );
}
