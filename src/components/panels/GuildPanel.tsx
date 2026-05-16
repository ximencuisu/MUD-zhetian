import { useState, useEffect, useCallback } from 'react';
import { saveCharacter } from '../../services/authService';
import { useGameStore } from '../../store/gameStore';
import {
  createGuild, listenGuild, listenGuildMembers, listenGuildApplications,
  listenGuilds, sendGuildApplication, respondToGuildApplication,
  updateGuildInfo, kickGuildMember, setGuildMemberRank,
  leaveGuild, GuildData, GuildMember, GuildApplication,
  GUILD_RANK_NAMES,
  GUILD_SHOP_ITEMS, GUILD_SKILLS, GUILD_TERRITORIES,
  guildBuyItem, guildLearnSkill, guildUpgradeTerritory,
  sendGuildWarChallenge, listenGuildWarChallenges, respondToGuildWar,
  guildContribute, getNextTerritory,
  GuildWarChallenge, GuildShopItem, GuildSkillData,
} from '../../services/multiplayerService';
import './Panel.css';
import './GuildPanel.css';

export default function GuildPanel() {
  const char = useGameStore(s => s.character);
  const uid = useGameStore(s => s.uid);
  const updateCharacter = useGameStore(s => s.updateCharacter);

  const [tab, setTab] = useState<'list' | 'create' | 'info' | 'members' | 'manage' | 'applications' | 'shop' | 'skills' | 'territory' | 'war'>('list');
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [applications, setApplications] = useState<GuildApplication[]>([]);
  const [allGuilds, setAllGuilds] = useState<GuildData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [appMsg, setAppMsg] = useState('');
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [warChallenges, setWarChallenges] = useState<GuildWarChallenge[]>([]);
  const [warTargetGuildId, setWarTargetGuildId] = useState('');
  const [warTargetGuildName, setWarTargetGuildName] = useState('');
  const [contributeAmount, setContributeAmount] = useState(100);
  const [learnedSkills, setLearnedSkills] = useState<Record<string, number>>({});
  const [shopMsg, setShopMsg] = useState('');

  const isLeader = guildData?.leader === char.name;
  const isOfficer = isLeader || members.some(m => m.uid === char.name && (m.rank === 'vice_leader' || m.rank === 'elder'));
  const myMemberData = members.find(m => m.uid === char.name);

  // Listen to guild data if in a guild
  useEffect(() => {
    if (!char.guildId) { setGuildData(null); setMembers([]); setWarChallenges([]); return; }
    const unsub1 = listenGuild(char.guildId, setGuildData);
    const unsub2 = listenGuildMembers(char.guildId, setMembers);
    const unsub3 = listenGuildApplications(char.guildId, apps => {
      if (isOfficer) setApplications(apps);
    });
    const unsub4 = listenGuildWarChallenges(char.guildId, setWarChallenges);
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, [char.guildId, char.name]);

  // Listen to all guilds for browsing
  useEffect(() => {
    if (char.guildId) { setAllGuilds([]); return; }
    const unsub = listenGuilds(setAllGuilds);
    return unsub;
  }, [char.guildId]);

  // Switch to info tab when guild is joined
  useEffect(() => {
    if (char.guildId) setTab('info');
  }, [char.guildId]);

  const handleCreate = useCallback(async () => {
    if (!createName.trim()) return;
    const gid = await createGuild(char.name, createName.trim(), createDesc.trim());
    if (gid) {
      updateCharacter({ guildId: gid, guildRank: 'leader' });
      setCreateName('');
      setCreateDesc('');
    }
  }, [createName, createDesc, char.name, updateCharacter]);

  const handleApply = useCallback(async (guildId: string) => {
    await sendGuildApplication(guildId, char.name, char.name, String(char.realm), char.realmLevel, appMsg);
    setSelectedGuild(guildId);
  }, [char, appMsg]);

  const handleLeave = useCallback(async () => {
    if (!char.guildId) return;
    await leaveGuild(char.guildId, char.name);
    updateCharacter({ guildId: null, guildRank: null });
  }, [char.guildId, char.name, updateCharacter]);

  const filteredGuilds = allGuilds.filter(g =>
    g.name.includes(searchQuery) || g.leaderName.includes(searchQuery)
  );

  // ── Not in a guild ─────────────────────────────────────────

  if (!char.guildId) {
    return (
      <div className="panel-body guild-panel">
        <div className="panel-section">
          <div className="panel-section-title">◈ 帮派系统</div>
          <div className="guild-create-tabs">
            <button className={`guild-tab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>浏览帮派</button>
            <button className={`guild-tab ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>创建帮派</button>
          </div>

          {tab === 'list' && (
            <>
              <input
                className="guild-search"
                placeholder="搜索帮派名称..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="guild-list">
                {filteredGuilds.length === 0 ? (
                  <div className="guild-empty">暂无帮派，创建一个吧！</div>
                ) : filteredGuilds.map(g => (
                  <div key={g.id} className={`guild-card ${selectedGuild === g.id ? 'selected' : ''}`}
                    onClick={() => setSelectedGuild(selectedGuild === g.id ? null : g.id)}>
                    <div className="guild-card-header">
                      <span className="guild-emblem">{g.emblem}</span>
                      <span className="guild-card-name">{g.name}</span>
                      <span className="guild-card-level">Lv.{g.level}</span>
                    </div>
                    <div className="guild-card-meta">
                      👤 {g.memberCount}人 · 🏆 {g.prestige}声望
                    </div>
                    {selectedGuild === g.id && (
                      <div className="guild-card-detail">
                        <div className="guild-desc">{g.description || '暂无简介'}</div>
                        <div className="guild-card-leader">帮主：{g.leaderName || g.leader}</div>
                        <textarea
                          className="guild-app-msg"
                          placeholder="附言（可选）"
                          value={appMsg}
                          onChange={e => setAppMsg(e.target.value)}
                          rows={2}
                          onClick={e => e.stopPropagation()}
                        />
                        <button className="guild-btn guild-btn-apply" onClick={e => { e.stopPropagation(); handleApply(g.id); }}>
                          ◈ 申请加入
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'create' && (
            <div className="guild-create-form">
              <div className="guild-form-field">
                <label>帮派名称</label>
                <input value={createName} onChange={e => setCreateName(e.target.value)} maxLength={12} placeholder="输入帮派名称..." />
              </div>
              <div className="guild-form-field">
                <label>帮派宣言</label>
                <textarea value={createDesc} onChange={e => setCreateDesc(e.target.value)} maxLength={200} rows={3} placeholder="描述您的帮派..." />
              </div>
              <button className="guild-btn guild-btn-create" onClick={handleCreate} disabled={!createName.trim()}>
                ◈ 创建帮派（消耗1000金叶）
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── In a guild ────────────────────────────────────────────

  const myRank = myMemberData?.rank;
  const canManage = myRank === 'leader' || myRank === 'vice_leader';
  const canManageMembers = myRank === 'leader';

  return (
    <div className="panel-body guild-panel">
      {/* Guild Header */}
      <div className="guild-header">
        <span className="guild-header-emblem">{guildData?.emblem || '🏰'}</span>
        <div className="guild-header-info">
          <div className="guild-header-name">{guildData?.name || '帮派'}</div>
          <div className="guild-header-stats">
            Lv.{guildData?.level || 1} · 👤{guildData?.memberCount || 0} · 🏆{guildData?.prestige || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="guild-tabs">
        {(['info', 'shop', 'skills', 'territory', 'members', 'war', 'applications', 'manage'] as const).map(t => (
          <button key={t} className={`guild-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'info' ? '概况' : t === 'shop' ? '商店' : t === 'skills' ? '技能' : t === 'territory' ? '领地' : t === 'members' ? '成员' : t === 'war' ? '帮战' : t === 'applications' ? '申请' : '管理'}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div className="guild-tab-content">
          <div className="panel-section">
            <div className="panel-section-title">◈ 帮派公告</div>
            <div className="guild-announcement">{guildData?.announcement || '暂无公告'}</div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">◈ 帮派详情</div>
            <div className="guild-detail-row"><span>创建者</span><span>{guildData?.leaderName || guildData?.leader || '-'}</span></div>
            <div className="guild-detail-row"><span>帮主</span><span>{guildData?.leaderName || guildData?.leader || '-'}</span></div>
            <div className="guild-detail-row"><span>等级</span><span>Lv.{guildData?.level || 1}</span></div>
            <div className="guild-detail-row"><span>声望</span><span>{guildData?.prestige || 0}</span></div>
            <div className="guild-detail-row"><span>帮派资金</span><span className="guild-gold">◎{guildData?.funds || 0}</span></div>
            <div className="guild-desc-text">{guildData?.description || '暂无简介'}</div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">◈ 我的信息</div>
            <div className="guild-detail-row"><span>职位</span><span className="guild-my-rank">{GUILD_RANK_NAMES[myRank || 'member']}</span></div>
            <div className="guild-detail-row"><span>贡献</span><span className="guild-gold">{myMemberData?.contribution || 0}</span></div>
          </div>
        </div>
      )}

      {/* Tab: Members */}
      {tab === 'members' && (
        <div className="guild-tab-content">
          <div className="guild-member-list">
            {members.map(m => (
              <div key={m.uid} className={`guild-member-item ${m.rank === 'leader' ? 'is-leader' : ''}`}>
                <div className="guild-member-avatar">{m.rank === 'leader' ? '👑' : m.rank === 'vice_leader' ? '⭐' : m.rank === 'elder' ? '🌟' : '👤'}</div>
                <div className="guild-member-info">
                  <div className="guild-member-name">
                    {m.name}
                    <span className="guild-member-rank" style={{
                      color: m.rank === 'leader' ? '#ffd700' : m.rank === 'vice_leader' ? '#ff88ff' : m.rank === 'elder' ? '#44aaff' : '#88cc88'
                    }}>
                      {GUILD_RANK_NAMES[m.rank]}
                    </span>
                  </div>
                  <div className="guild-member-meta">
                    {m.realmName || '凡人'} · Lv.{m.level}
                    {m.sect && <span> · {m.sect}</span>}
                    <span> · 贡献 {m.contribution}</span>
                  </div>
                </div>
                {canManageMembers && m.uid !== char.name && (
                  <div className="guild-member-actions">
                    <select
                      className="guild-rank-select"
                      value={m.rank}
                      onChange={e => setGuildMemberRank(char.guildId!, m.uid, e.target.value as GuildMember['rank'])}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="member">帮众</option>
                      <option value="elite">精英</option>
                      <option value="elder">长老</option>
                      <option value="vice_leader">副帮主</option>
                    </select>
                    <button className="guild-btn-small guild-btn-kick" onClick={() => kickGuildMember(char.guildId!, m.uid)}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Applications */}
      {tab === 'applications' && (
        <div className="guild-tab-content">
          {!canManage ? (
            <div className="guild-empty">只有帮主/副帮主可以处理申请</div>
          ) : applications.length === 0 ? (
            <div className="guild-empty">暂无新的申请</div>
          ) : (
            <div className="guild-app-list">
              {applications.map(app => (
                <div key={app.id} className="guild-app-item">
                  <div className="guild-app-header">
                    <span className="guild-app-name">{app.fromName}</span>
                    <span className="guild-app-realm">{app.fromRealm} · Lv.{app.fromLevel}</span>
                  </div>
                  {app.message && <div className="guild-app-msg-text">{app.message}</div>}
                  <div className="guild-app-actions">
                    <button className="guild-btn-small guild-btn-accept" onClick={() => respondToGuildApplication(char.guildId!, app.id, true)}>
                      ✓ 接受
                    </button>
                    <button className="guild-btn-small guild-btn-reject" onClick={() => respondToGuildApplication(char.guildId!, app.id, false)}>
                      ✕ 拒绝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Manage */}
      {tab === 'manage' && (
        <div className="guild-tab-content">
          {!canManage ? (
            <div className="guild-empty">只有帮主/副帮主可以管理帮派</div>
          ) : (
            <>
              <div className="panel-section">
                <div className="panel-section-title">◈ 修改公告</div>
                <textarea
                  className="guild-input"
                  placeholder="新公告内容..."
                  value={newAnnouncement}
                  onChange={e => setNewAnnouncement(e.target.value)}
                  rows={3}
                />
                <button
                  className="guild-btn guild-btn-create"
                  onClick={() => {
                    updateGuildInfo(char.guildId!, { announcement: newAnnouncement });
                    setNewAnnouncement('');
                  }}
                  disabled={!newAnnouncement.trim()}
                >
                  更新公告
                </button>
              </div>

              <div className="panel-section" style={{ borderColor: '#cc444455' }}>
                <div className="panel-section-title" style={{ color: '#ff6644' }}>◈ 危险操作</div>
                <button
                  className="guild-btn guild-btn-danger"
                  onClick={handleLeave}
                >
                  ✕ 退出帮派
                </button>
                {isLeader && (
                  <div className="guild-hint">帮主不能直接退出，请先转让帮主职位。</div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══ Tab: Shop ═══ */}
      {tab === 'shop' && (
        <div className="guild-tab-content">
          <div className="panel-section">
            <div className="panel-section-title">◈ 帮派商店</div>
            <div style={{ color: '#886622', fontSize: '10px', marginBottom: '6px' }}>
              你的贡献：<span style={{ color: '#ffd700' }}>{myMemberData?.contribution || 0}</span>
            </div>
            {GUILD_SHOP_ITEMS.map(item => (
              <div key={item.id} className="guild-shop-item">
                <div className="guild-shop-item-info">
                  <span className="guild-shop-item-name">{item.name}</span>
                  <span className="guild-shop-item-desc">{item.description}</span>
                </div>
                <span className="guild-shop-item-price">◎{item.price}</span>
                <button
                  className="guild-btn-small guild-btn-accept"
                  disabled={(myMemberData?.contribution || 0) < item.price}
                  onClick={async () => {
                    const ok = await guildBuyItem(char.guildId!, char.name, item.id);
                    if (ok) {
                      // 添加物品到背包
                      if (item.type === 'item' && item.itemId && item.itemId !== 'g_gold_pouch') {
                        updateCharacter({ inventory: [...char.inventory, item.itemId] });
                      }
                      setShopMsg(`✓ 购买成功：${item.name}`);
                    } else {
                      setShopMsg('✕ 贡献不足！');
                    }
                    setTimeout(() => setShopMsg(''), 2000);
                  }}
                >
                  购买
                </button>
              </div>
            ))}
            {shopMsg && <div className="guild-shop-msg">{shopMsg}</div>}
          </div>
        </div>
      )}

      {/* ═══ Tab: Skills ═══ */}
      {tab === 'skills' && (
        <div className="guild-tab-content">
          <div className="panel-section">
            <div className="panel-section-title">◈ 帮派技能</div>
            <div style={{ color: '#886622', fontSize: '10px', marginBottom: '6px' }}>
              你的贡献：<span style={{ color: '#ffd700' }}>{myMemberData?.contribution || 0}</span>
            </div>
            {GUILD_SKILLS.map(skill => {
              const curLevel = learnedSkills[skill.id] || 0;
              const isMaxed = curLevel >= skill.maxLevel;
              const canAfford = (myMemberData?.contribution || 0) >= skill.costPerLevel;
              const statEntries = Object.entries(skill.effects);
              const statLabel = statEntries.map(([k, v]) => `${k === 'maxHp' ? '生命' : k === 'attack' ? '攻击' : k === 'defense' ? '防御' : k === 'expBonus' ? '经验加成' : k === 'critRate' ? '暴击率' : k} +${v * (curLevel + 1)}`).join(', ');
              return (
                <div key={skill.id} className="guild-skill-item">
                  <div className="guild-skill-header">
                    <span className="guild-skill-name">{skill.name}</span>
                    <span className="guild-skill-level">Lv.{curLevel}/{skill.maxLevel}</span>
                  </div>
                  <div className="guild-skill-desc">{skill.description}</div>
                  <div className="guild-skill-stats">{isMaxed ? '已满级' : `下1级：${statLabel}`}</div>
                  <div className="guild-skill-actions">
                    <span className="guild-skill-cost">消耗贡献：{skill.costPerLevel}</span>
                    {!isMaxed && (
                      <button
                        className="guild-btn-small guild-btn-accept"
                        disabled={!canAfford}
                        onClick={async () => {
                          const newLevel = await guildLearnSkill(char.guildId!, char.name, skill.id, curLevel);
                          if (newLevel) {
                            setLearnedSkills(prev => ({ ...prev, [skill.id]: newLevel }));
                          }
                        }}
                      >
                        学习
                      </button>
                    )}
                    {isMaxed && <span className="guild-skill-maxed">✓ 已精通</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Tab: Territory ═══ */}
      {tab === 'territory' && (
        <div className="guild-tab-content">
          <div className="panel-section">
            <div className="panel-section-title">◈ 帮派领地</div>
            <div className="guild-territory-banner">
              <span className="guild-territory-icon">
                {guildData?.territory === 'wilderness' ? '🏕️' : guildData?.territory === 'encampment' ? '🏠' : guildData?.territory === 'fort' ? '🏰' : guildData?.territory === 'manor' ? '🏯' : '🏛️'}
              </span>
              <div className="guild-territory-info">
                <div className="guild-territory-name">{guildData?.territoryName || '未知领地'}</div>
                <div className="guild-territory-desc">
                  {GUILD_TERRITORIES[guildData?.territory || 'wilderness']?.description || ''}
                </div>
              </div>
            </div>
            <div className="guild-detail-row"><span>帮派等级</span><span>Lv.{guildData?.level || 1}</span></div>
            <div className="guild-detail-row"><span>帮派资金</span><span className="guild-gold">◎{guildData?.funds || 0}</span></div>
            {(() => {
              const next = getNextTerritory(guildData?.territory || 'wilderness');
              if (!next) return <div className="guild-territory-maxed">✦ 领地已至巅峰！</div>;
              const info = GUILD_TERRITORIES[next];
              const canUpgrade = (guildData?.funds || 0) >= info.upgradeCost && (guildData?.level || 1) >= info.requireLevel;
              return (
                <>
                  <div className="guild-territory-next">
                    <div className="guild-section-subtitle">▸ 可升级</div>
                    <div className="guild-next-territory-name">→ {info.name}</div>
                    <div className="guild-next-territory-desc">{info.description}</div>
                    <div className="guild-next-territory-cost">
                      所需资金：◎{info.upgradeCost.toLocaleString()} · 需要帮派等级：{info.requireLevel}
                    </div>
                  </div>
                  {canManage && (
                    <button
                      className={`guild-btn ${canUpgrade ? 'guild-btn-create' : 'guild-btn-disabled'}`}
                      disabled={!canUpgrade}
                      onClick={async () => {
                        const ok = await guildUpgradeTerritory(char.guildId!);
                        if (ok) setShopMsg('✓ 领地升级成功！');
                        else setShopMsg('✕ 升级失败，条件不足！');
                        setTimeout(() => setShopMsg(''), 2000);
                      }}
                    >
                      升级领地
                    </button>
                  )}
                </>
              );
            })()}
            {shopMsg && <div className="guild-shop-msg">{shopMsg}</div>}
          </div>
        </div>
      )}

      {/* ═══ Tab: War ═══ */}
      {tab === 'war' && (
        <div className="guild-tab-content">
          <div className="panel-section">
            <div className="panel-section-title">◈ 宣战</div>
            <div className="guild-war-form">
              <input
                className="guild-search"
                placeholder="目标帮派ID..."
                value={warTargetGuildId}
                onChange={e => setWarTargetGuildId(e.target.value)}
              />
              <input
                className="guild-search"
                placeholder="目标帮派名称..."
                value={warTargetGuildName}
                onChange={e => setWarTargetGuildName(e.target.value)}
              />
              <button
                className="guild-btn guild-btn-danger"
                disabled={!warTargetGuildId || !warTargetGuildName}
                onClick={async () => {
                  await sendGuildWarChallenge(
                    char.guildId!, guildData?.name || '',
                    warTargetGuildId, warTargetGuildName,
                    char.name, char.name
                  );
                  setWarTargetGuildId('');
                  setWarTargetGuildName('');
                  setShopMsg('✓ 宣战书已发出！');
                  setTimeout(() => setShopMsg(''), 2000);
                }}
              >
                ⚔ 宣战
              </button>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">◈ 帮战记录</div>
            {warChallenges.length === 0 ? (
              <div className="guild-empty">暂无帮战记录</div>
            ) : (
              <div className="guild-war-list">
                {warChallenges.map(w => (
                  <div key={w.id} className="guild-war-item">
                    <div className="guild-war-header">
                      <span className="guild-war-name">{w.fromGuildName} ⚔ {w.toGuildName}</span>
                      <span className={`guild-war-status status-${w.status}`}>
                        {w.status === 'pending' ? '⏳等待回应' : w.status === 'accepted' ? '⚔进行中' : w.status === 'declined' ? '✕已拒绝' : '✓已完成'}
                      </span>
                    </div>
                    <div className="guild-war-meta">发起者：{w.challengerName}</div>
                    {w.status === 'pending' && w.toGuildId === char.guildId && canManage && (
                      <div className="guild-war-actions">
                        <button className="guild-btn-small guild-btn-accept" onClick={() => respondToGuildWar(char.guildId!, w.id, true)}>
                          ✓ 接受
                        </button>
                        <button className="guild-btn-small guild-btn-reject" onClick={() => respondToGuildWar(char.guildId!, w.id, false)}>
                          ✕ 拒绝
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-section">
            <div className="panel-section-title">◈ 贡献帮派</div>
            <div style={{ color: '#886622', fontSize: '10px', marginBottom: '6px' }}>
              你的贡献：<span style={{ color: '#ffd700' }}>{myMemberData?.contribution || 0}</span>
            </div>
            <div className="guild-contribute-form">
              <input
                className="guild-search"
                type="number"
                min={10}
                value={contributeAmount}
                onChange={e => setContributeAmount(Number(e.target.value))}
              />
              <button
                className="guild-btn guild-btn-create"
                disabled={contributeAmount < 10}
                onClick={async () => {
                  if (char.gold < contributeAmount) {
                    setShopMsg('✕ 金叶不足！');
                    setTimeout(() => setShopMsg(''), 2000);
                    return;
                  }
                  await guildContribute(char.guildId!, char.name, contributeAmount);
                  updateCharacter({ gold: char.gold - contributeAmount });
                  if (uid) saveCharacter(uid, { ...char, gold: char.gold - contributeAmount });
                  setShopMsg(`✓ 捐献 ${contributeAmount} 金叶成功！`);
                  setTimeout(() => setShopMsg(''), 2000);
                }}
              >
                捐献金叶
              </button>
              <div className="guild-contribute-info">
                每捐献 1 金叶获得 1 贡献，50% 流入帮派资金
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
