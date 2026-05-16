import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SECTS } from '../../data/sects';
import { EMPEROR_SCRIPTURES } from '../../data/sectSkills';
import { RANK_PROMO_REQS, RANK_SALARY, SECT_RANK_ORDER, SectRank } from '../../types/game';
import { REALM_NAMES } from '../../types/game';
import { SectShopItem } from '../../data/sectShop';
import { SectQuest } from '../../data/sectQuests';
import './Panel.css';

// Rank badge colors
const RANK_COLORS: Record<string, string> = {
  '外门弟子': '#44cc44',
  '内门弟子': '#44aaff',
  '真传弟子': '#ffcc00',
  '外门长老': '#ffcc00',
  '内门长老': '#ff9900',
  '道子':     '#cc66ff',
  '圣女':     '#ff66cc',
  '太上长老': '#ff6633',
  '宗主':     '#ff3333',
};

// 物品类型颜色
const ITEM_TYPE_COLORS: Record<string, string> = {
  'consumable': '#88cc88',
  'material': '#88aaff',
  'item': '#ffcc88',
  'skill': '#ff88cc',
};

// 物品类型名称
const ITEM_TYPE_NAMES: Record<string, string> = {
  'consumable': '消耗品',
  'material': '材料',
  'item': '装备',
  'skill': '功法',
};

export default function SectPanel() {
  const char = useGameStore(s => s.character);
  const sectQuests = useGameStore(s => s.sectQuests);
  const sectShopItems = useGameStore(s => s.sectShopItems);
  const joinSect = useGameStore(s => s.joinSect);
  const enterSectMap = useGameStore(s => s.enterSectMap);
  const promoteSectRank = useGameStore(s => s.promoteSectRank);
  const donateToSect = useGameStore(s => s.donateToSect);
  const claimSectSalary = useGameStore(s => s.claimSectSalary);
  const refreshSectQuests = useGameStore(s => s.refreshSectQuests);
  const completeSectQuest = useGameStore(s => s.completeSectQuest);
  const buySectShopItem = useGameStore(s => s.buySectShopItem);
  const refreshSectShop = useGameStore(s => s.refreshSectShop);
  const [selectedSect, setSelectedSect] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'quests' | 'donate' | 'shop'>('info');
  const [donateGold, setDonateGold] = useState(1000);
  const [donateYuankuai, setDonateYuankuai] = useState(10);
  const [shopFilter, setShopFilter] = useState<string>('all');

  const sectId = char.sect || selectedSect;
  const sect = sectId ? SECTS[sectId] : null;
  const isInSectMap = useGameStore(s => s.sectMapId !== null);

  // 初始化商店
  useEffect(() => {
    if (char.sect && sectShopItems.length === 0) {
      refreshSectShop();
    }
  }, [char.sect, sectShopItems.length, refreshSectShop]);

  // 获取晋升要求
  const getPromoRequirements = () => {
    if (!char.sectRank) return null;
    const req = RANK_PROMO_REQS[char.sectRank as SectRank];
    if (!req) return null;
    return req;
  };

  // 检查是否可以晋升
  const canPromote = () => {
    const req = getPromoRequirements();
    if (!req) return false;
    if ((char.contribution || 0) < req.minContrib) return false;
    // 这里简化处理，实际应该检查境界
    return true;
  };

  // 获取下一职位
  const getNextRank = () => {
    if (!char.sectRank) return null;
    const currentIdx = SECT_RANK_ORDER.indexOf(char.sectRank as SectRank);
    if (currentIdx < 0 || currentIdx >= SECT_RANK_ORDER.length - 1) return null;
    return SECT_RANK_ORDER[currentIdx + 1];
  };

  // 过滤商店物品
  const filteredShopItems = shopFilter === 'all' 
    ? sectShopItems 
    : sectShopItems.filter(item => item.type === shopFilter);

  // 检查是否可以购买物品
  const canBuyItem = (item: SectShopItem) => {
    if (item.stock <= 0) return false;
    if ((char.contribution || 0) < item.contribCost) return false;
    if (char.gold < item.goldCost) return false;
    if (item.requiredRank && char.sectRank) {
      const rankOrder = ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'];
      if (rankOrder.indexOf(char.sectRank) < rankOrder.indexOf(item.requiredRank)) return false;
    }
    if (item.requiredReputation && char.reputation < item.requiredReputation) return false;
    return true;
  };

  if (!char.sect && !selectedSect) {
    return (
      <div className="panel-body">
        <div className="panel-section">
          <div className="panel-section-title">◈ 拜入门派</div>
          <div style={{ color: '#665522', fontSize: '12px', marginBottom: '8px' }}>
            尚未拜入任何门派。选择门派后将获赠初始武学和专属修炼资源。
          </div>
        </div>
        {Object.values(SECTS).map(s => (
          <div key={s.id} className="sect-card" onClick={() => setSelectedSect(selectedSect === s.id ? null : s.id)}>
            <div className="sect-card-header">
              <span className="sect-emblem">{s.emblem}</span>
              <span className="sect-name" style={{ color: s.color }}>{s.fullName}</span>
            </div>
            <div className="sect-info">📍 {s.location}</div>
            {selectedSect === s.id && (
              <>
                <div className="sect-desc">{s.description}</div>
                <div className="sect-info" style={{ marginBottom: '6px' }}>入门条件：{s.joinRequirement}</div>
                <button className="sect-join-btn" onClick={e => { e.stopPropagation(); joinSect(s.id); setSelectedSect(null); }}>
                  ◈ 拜入{s.fullName}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  const rankColor = RANK_COLORS[char.sectRank || '外门弟子'];
  const nextRank = getNextRank();
  const promoReq = getPromoRequirements();
  const salary = char.sectRank ? RANK_SALARY[char.sectRank as SectRank] : null;

  return (
    <div className="panel-body">
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {(['info', 'quests', 'donate', 'shop'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '6px',
              fontSize: '11px',
              border: `1px solid ${activeTab === tab ? '#d4a574' : '#5a4a3a'}`,
              background: activeTab === tab ? 'rgba(212,165,116,0.2)' : 'transparent',
              color: activeTab === tab ? '#d4a574' : '#8a7a6a',
              cursor: 'pointer',
            }}
          >
            {tab === 'info' ? '门派信息' : tab === 'quests' ? '门派任务' : tab === 'donate' ? '捐献俸禄' : '门派商店'}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <>
          <div className="panel-section" style={{ borderColor: 'rgba(200,150,0,0.5)' }}>
            <div className="panel-section-title" style={{ color: '#ffd700' }}>◈ {sect?.fullName}</div>
            <div style={{ color: rankColor, fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
              职位：{char.sectRank || '外门弟子'}
            </div>
            <div style={{ color: '#cc9900', fontSize: '11px', marginBottom: '4px' }}>
              贡献值：{char.contribution || 0}
            </div>
            <div style={{ color: '#886622', fontSize: '11px', marginBottom: '8px' }}>
              {sect?.description?.slice(0, 80)}…
            </div>
            
            {/* 晋升按钮 */}
            {nextRank && promoReq && (
              <div style={{ marginBottom: '8px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                <div style={{ fontSize: '11px', color: '#aa8844', marginBottom: '4px' }}>
                  下一职位：{nextRank}
                </div>
                <div style={{ fontSize: '10px', color: '#886622', marginBottom: '4px' }}>
                  需要：{REALM_NAMES[promoReq.minRealm]} · {promoReq.minContrib}贡献
                  {promoReq.minSectSkills ? ` · ${promoReq.minSectSkills}种功法` : ''}
                  {promoReq.minReputation ? ` · ${promoReq.minReputation}声望` : ''}
                </div>
                <button
                  className="sect-join-btn"
                  style={{ 
                    fontSize: '11px',
                    opacity: canPromote() ? 1 : 0.5,
                    cursor: canPromote() ? 'pointer' : 'not-allowed'
                  }}
                  onClick={() => canPromote() && promoteSectRank()}
                  disabled={!canPromote()}
                >
                  {canPromote() ? '◈ 申请晋升' : '✗ 条件不足'}
                </button>
              </div>
            )}

            {isInSectMap ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ color: '#44ff88', fontSize: '11px', textAlign: 'center', flex: 1, paddingTop: '6px' }}>
                  ✓ 已在门派区域
                </div>
                <button
                  className="sect-join-btn"
                  style={{ flex: 1, borderColor: '#cc4444', color: '#ff6644' }}
                  onClick={() => useGameStore.getState().exitSectMap?.()}
                >
                  ✕ 离开门派
                </button>
              </div>
            ) : (
              <button
                className="sect-join-btn"
                style={{ animation: 'pulse-glow 2.5s infinite', fontSize: '13px' }}
                onClick={() => enterSectMap(sectId!)}
              >
                ▶ 进入{sect?.fullName}
              </button>
            )}
          </div>

          {/* 俸禄信息 */}
          {salary && (
            <div className="panel-section" style={{ borderColor: 'rgba(100,150,100,0.3)' }}>
              <div className="panel-section-title" style={{ color: '#88cc88' }}>◈ 职位俸禄</div>
              <div style={{ fontSize: '11px', color: '#88aa88', marginBottom: '6px' }}>
                每日可领取：{salary.gold}金叶
                {salary.yuankuai > 0 ? ` · ${salary.yuankuai}源块` : ''}
                {salary.sectPoints > 0 ? ` · ${salary.sectPoints}积分` : ''}
              </div>
              <button
                className="sect-join-btn"
                style={{ fontSize: '11px', borderColor: '#44aa44', color: '#66cc66' }}
                onClick={() => claimSectSalary()}
              >
                领取今日俸禄
              </button>
            </div>
          )}

          {/* Emperor scripture hint */}
          {char.sect && (() => {
            const emperorScript = EMPEROR_SCRIPTURES.find(e => e.sect === char.sect);
            if (!emperorScript) return null;
            return (
              <div className="panel-section" style={{ borderColor: '#ff333344' }}>
                <div className="panel-section-title" style={{ color: '#ff3333' }}>◈ 极道帝经（传说）</div>
                <div style={{ color: '#ff3333', fontSize: '12px', marginBottom: '4px' }}>{emperorScript.name}</div>
                <div style={{ color: '#886622', fontSize: '11px', marginBottom: '8px' }}>
                  {emperorScript.description}
                </div>
                <div style={{ color: '#ff6644', fontSize: '11px' }}>
                  ⚠ 此功法不可在门派内学习。传说唯有大帝方能完全领悟。
                </div>
              </div>
            );
          })()}
        </>
      )}

      {activeTab === 'quests' && (
        <div className="panel-section">
          <div className="panel-section-title">◈ 门派任务</div>
          <button
            className="sect-join-btn"
            style={{ fontSize: '11px', marginBottom: '8px' }}
            onClick={() => refreshSectQuests()}
          >
            刷新每日任务
          </button>
          
          {sectQuests.length === 0 ? (
            <div style={{ color: '#886622', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
              暂无任务，点击刷新获取今日任务
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sectQuests.map(quest => (
                <div key={quest.id} style={{ 
                  padding: '8px', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '4px',
                  border: quest.status === 'completed' ? '1px solid #44aa44' : '1px solid #5a4a3a'
                }}>
                  <div style={{ fontSize: '12px', color: '#d4a574', marginBottom: '2px' }}>
                    {quest.name}
                    {quest.status === 'completed' && <span style={{ color: '#44aa44', marginLeft: '8px' }}>✓</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: '#886622', marginBottom: '4px' }}>
                    {quest.description}
                  </div>
                  <div style={{ fontSize: '10px', color: '#aa8844' }}>
                    奖励：{(quest as Partial<SectQuest>).contribReward || 0}贡献 · {quest.rewards.exp}修为 · {quest.rewards.gold}金叶
                  </div>
                  {quest.status === 'active' && (
                    <button
                      className="sect-join-btn"
                      style={{ fontSize: '10px', marginTop: '4px' }}
                      onClick={() => completeSectQuest(quest.id)}
                    >
                      完成任务
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'donate' && (
        <div className="panel-section">
          <div className="panel-section-title">◈ 捐献资源</div>
          <div style={{ fontSize: '11px', color: '#886622', marginBottom: '8px' }}>
            捐献金叶或源块可获得门派贡献值
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#aa8844', marginBottom: '4px' }}>
              捐献金叶（1金叶 = 0.1贡献）
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="number"
                value={donateGold}
                onChange={e => setDonateGold(parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #5a4a3a',
                  color: '#d4c4a8',
                  fontSize: '12px',
                }}
              />
              <span style={{ fontSize: '11px', color: '#886622' }}>
                = {Math.floor(donateGold * 0.1)}贡献
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#aa8844', marginBottom: '4px' }}>
              捐献源块（1源块 = 2贡献）
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="number"
                value={donateYuankuai}
                onChange={e => setDonateYuankuai(parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #5a4a3a',
                  color: '#d4c4a8',
                  fontSize: '12px',
                }}
              />
              <span style={{ fontSize: '11px', color: '#886622' }}>
                = {donateYuankuai * 2}贡献
              </span>
            </div>
          </div>

          <button
            className="sect-join-btn"
            style={{ fontSize: '11px' }}
            onClick={() => {
              donateToSect(donateGold, donateYuankuai);
              setDonateGold(1000);
              setDonateYuankuai(10);
            }}
          >
            ◈ 确认捐献
          </button>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #5a4a3a' }}>
            <div style={{ fontSize: '11px', color: '#aa8844', marginBottom: '4px' }}>
              当前贡献值：{char.contribution || 0}
            </div>
            <div style={{ fontSize: '10px', color: '#886622' }}>
              贡献值可用于晋升职位、兑换功法
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shop' && (
        <div className="panel-section">
          <div className="panel-section-title">◈ 门派商店</div>
          
          {/* 过滤器 */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: '全部' },
              { key: 'consumable', label: '消耗品' },
              { key: 'material', label: '材料' },
              { key: 'item', label: '装备' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setShopFilter(key)}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  border: `1px solid ${shopFilter === key ? '#d4a574' : '#5a4a3a'}`,
                  background: shopFilter === key ? 'rgba(212,165,116,0.2)' : 'transparent',
                  color: shopFilter === key ? '#d4a574' : '#8a7a6a',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
            <button
              className="sect-join-btn"
              style={{ fontSize: '10px', padding: '4px 8px', marginLeft: 'auto' }}
              onClick={() => refreshSectShop()}
            >
              刷新
            </button>
          </div>

          {/* 资源显示 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '8px',
            padding: '8px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            fontSize: '11px'
          }}>
            <span style={{ color: '#cc9900' }}>贡献：{char.contribution || 0}</span>
            <span style={{ color: '#88cc88' }}>金叶：{char.gold}</span>
            <span style={{ color: '#88aaff' }}>声望：{char.reputation}</span>
          </div>
          
          {filteredShopItems.length === 0 ? (
            <div style={{ color: '#886622', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
              暂无商品，点击刷新
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {filteredShopItems.map(item => {
                const canBuy = canBuyItem(item);
                return (
                  <div key={item.id} style={{ 
                    padding: '8px', 
                    background: 'rgba(0,0,0,0.2)', 
                    borderRadius: '4px',
                    border: canBuy ? '1px solid #5a4a3a' : '1px solid #442222',
                    opacity: item.stock > 0 ? 1 : 0.5,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span style={{ fontSize: '12px', color: '#d4a574', flex: 1 }}>{item.name}</span>
                      <span style={{ 
                        fontSize: '9px', 
                        color: ITEM_TYPE_COLORS[item.type],
                        border: `1px solid ${ITEM_TYPE_COLORS[item.type]}44`,
                        padding: '1px 4px',
                        borderRadius: '2px'
                      }}>
                        {ITEM_TYPE_NAMES[item.type]}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#886622', marginBottom: '4px' }}>
                      {item.description}
                    </div>
                    {item.effect && (
                      <div style={{ fontSize: '10px', color: '#aa8844', marginBottom: '4px' }}>
                        效果：{item.effect}
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#aa8844', marginBottom: '4px' }}>
                      价格：
                      <span style={{ color: '#cc9900' }}>{item.contribCost}贡献</span>
                      {item.goldCost > 0 && (
                        <span style={{ color: '#88cc88' }}> + {item.goldCost}金叶</span>
                      )}
                      {item.requiredRank && (
                        <span style={{ color: '#ffaa44', marginLeft: '8px' }}>
                          需：{item.requiredRank}
                        </span>
                      )}
                      <span style={{ color: item.stock > 0 ? '#88cc88' : '#cc6666', marginLeft: '8px' }}>
                        库存：{item.stock}/{item.maxStock}
                      </span>
                    </div>
                    <button
                      className="sect-join-btn"
                      style={{ 
                        fontSize: '10px',
                        opacity: canBuy ? 1 : 0.5,
                        cursor: canBuy ? 'pointer' : 'not-allowed'
                      }}
                      onClick={() => canBuy && buySectShopItem(item.id)}
                      disabled={!canBuy}
                    >
                      {item.stock <= 0 ? '售罄' : canBuy ? '购买' : '条件不足'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
