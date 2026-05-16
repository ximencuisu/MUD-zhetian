import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { SECT_MAPS } from '../data/sectMaps';
import { ALL_SECT_NPCS } from '../data/sectNpcs';
import { ALL_SECT_SKILLS, RANK_TEACHES, RARITY_NAMES, RARITY_COLORS, TYPE_NAMES, TYPE_ICONS, SkillRarity, SkillType } from '../data/sectSkills';
import { SECTS } from '../data/sects';
import { SECT_FUNCTION_NPCS, FUNCTION_TYPE_NAMES, FUNCTION_TYPE_ICONS, FunctionNpcType } from '../data/sectFunctionNpcs';
import './SectMapView.css';

const RANK_COLORS: Record<string, string> = {
  '杂役弟子': '#888888',
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

const RANK_MAX_RARITY: Record<string, string> = {
  '杂役弟子': '—',
  '外门弟子': '凡俗道功',
  '内门弟子': '凡俗道功',
  '真传弟子': '宗门正法',
  '外门长老': '宗门正法',
  '内门长老': '王侯秘传',
  '道子':     '圣贤古诀',
  '圣女':     '圣贤古诀',
  '太上长老': '圣贤古诀',
  '宗主':     '镇教秘术',
};

const RANK_ORDER = ['杂役弟子', '外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'];
type SkillFilterType = 'all' | SkillType;
const SKILL_TYPES: SkillFilterType[] = ['all', 'longevity', 'attack', 'defense', 'escape', 'body', 'soul', 'array', 'source'];

export default function SectMapView() {
  const sectMapId = useGameStore(s => s.sectMapId);
  const sectMapRoomId = useGameStore(s => s.sectMapRoomId);
  const moveSectRoom = useGameStore(s => s.moveSectRoom);
  const exitSectMap = useGameStore(s => s.exitSectMap);
  const learnSectSkill = useGameStore(s => s.learnSectSkill);
  const char = useGameStore(s => s.character);
  const addMessage = useGameStore(s => s.addMessage);
  const updateCharacter = useGameStore(s => s.updateCharacter);

  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<SkillFilterType>('all');
  const [dialogueIdx, setDialogueIdx] = useState<Record<string, number>>({});
  const [interactionMode, setInteractionMode] = useState<'skills' | 'duel' | 'master'>('skills');
  const [duelResult, setDuelResult] = useState<string | null>(null);
  const [functionNpcMode, setFunctionNpcMode] = useState<'dialogue' | 'service'>('dialogue');

  if (!sectMapId || !sectMapRoomId) return null;

  const map = SECT_MAPS[sectMapId];
  if (!map) return null;

  const currentRoom = map[sectMapRoomId];
  if (!currentRoom) return null;

  const sect = SECTS[sectMapId];
  const learnedIds = char?.skills.map(s => s.id) || [];

  const roomList = Object.values(map);
  const maxX = Math.max(...roomList.map(r => r.x || 0));
  const maxY = Math.max(...roomList.map(r => r.y || 0));
  const roomByPos: Record<string, typeof roomList[0]> = {};
  roomList.forEach(r => { roomByPos[`${r.x},${r.y}`] = r; });

  const npcsHere = ALL_SECT_NPCS.filter(n => n.sect === sectMapId && (currentRoom.npcs || []).includes(n.id));

  const selectedNpc = npcsHere.find(n => n.id === selectedNpcId);
  const rarities: SkillRarity[] = selectedNpc ? (RANK_TEACHES[selectedNpc.rank] || []) : [];
  const isZongzhu = selectedNpc?.rank === '宗主';

  let teachableSkills = rarities.length > 0
    ? ALL_SECT_SKILLS.filter(s => s.sect === sectMapId && rarities.includes(s.rarity as SkillRarity))
    : [];
  if (filterType !== 'all') {
    teachableSkills = teachableSkills.filter(s => s.skillType === filterType);
  }

  const canBeMaster = (npcRank: string) => {
    if (!char.sectRank) return false;
    const npcRankIdx = RANK_ORDER.indexOf(npcRank);
    const playerRankIdx = RANK_ORDER.indexOf(char.sectRank);
    return npcRankIdx > playerRankIdx;
  };

  const canDuel = (npcRank: string) => {
    if (!char.sectRank) return false;
    const npcRankIdx = RANK_ORDER.indexOf(npcRank);
    const playerRankIdx = RANK_ORDER.indexOf(char.sectRank);
    return Math.abs(npcRankIdx - playerRankIdx) <= 2;
  };

  const requestMaster = (npcId: string, npcName: string, npcRank: string) => {
    if (!canBeMaster(npcRank)) {
      addMessage({ channel: 'system', sender: '门派', content: `${npcName}表示你的修为尚浅，暂时无法拜其为师。` });
      return;
    }
    updateCharacter({ master: npcId });
    addMessage({ channel: 'system', sender: '门派', content: `你向${npcName}行拜师礼，正式成为其门下弟子！` });
  };

  const startDuel = (npcName: string, npcRank: string) => {
    if (!canDuel(npcRank)) {
      addMessage({ channel: 'system', sender: '门派', content: `${npcName}认为你与其差距过大，不适合切磋。` });
      return;
    }
    const playerPower = char.realmLevel * 10 + char.stats.attack + char.stats.defense;
    const npcPower = (RANK_ORDER.indexOf(npcRank) + 1) * 50 + Math.random() * 100;
    const win = playerPower > npcPower;
    const resultMsg = win 
      ? `你在切磋中战胜了${npcName}，获得了实战经验！` 
      : `你在切磋中惜败于${npcName}，但受益匪浅。`;
    setDuelResult(resultMsg);
    addMessage({ channel: 'system', sender: '门派', content: resultMsg });
    if (win) {
      updateCharacter({ exp: char.exp + 50, contribution: (char.contribution || 0) + 10 });
    } else {
      updateCharacter({ exp: char.exp + 20 });
    }
  };

  const getServiceName = (service: string): string => {
    const names: Record<string, string> = {
      'refreshQuests': '刷新任务', 'acceptQuest': '接受任务', 'completeQuest': '完成任务',
      'buyItem': '购买物品', 'sellItem': '出售物品', 'refreshShop': '刷新商店',
      'deposit': '存放物品', 'withdraw': '取出物品', 'expandStorage': '扩展空间',
      'forgeWeapon': '锻造武器', 'forgeArmor': '锻造护甲', 'enhanceEquipment': '强化装备',
      'refineMaterial': '精炼材料', 'heal': '治疗伤势', 'cureStatus': '清除负面状态',
      'buyPotion': '购买丹药', 'teleportToWorld': '传送到世界地图',
      'teleportToDungeon': '传送到秘境', 'teleportToZone': '传送到特殊区域',
      'startDuel': '开始切磋', 'startTournament': '参加比武大会', 'viewRankings': '查看排名',
      'enterSectDungeon': '进入门派秘境', 'enterTreasury': '进入宝库', 'enterTrainingGround': '进入修炼场',
    };
    return names[service] || service;
  };

  const getServiceIcon = (service: string): string => {
    const icons: Record<string, string> = {
      'refreshQuests': '🔄', 'acceptQuest': '📋', 'completeQuest': '✅',
      'buyItem': '🛒', 'sellItem': '💰', 'refreshShop': '🔄',
      'deposit': '📥', 'withdraw': '📤', 'expandStorage': '📦',
      'forgeWeapon': '⚔️', 'forgeArmor': '🛡️', 'enhanceEquipment': '✨',
      'refineMaterial': '🔥', 'heal': '💊', 'cureStatus': '🌟',
      'buyPotion': '🧪', 'teleportToWorld': '🌍', 'teleportToDungeon': '🏰',
      'teleportToZone': '🌀', 'startDuel': '⚔️', 'startTournament': '🏆',
      'viewRankings': '📊', 'enterSectDungeon': '🚪', 'enterTreasury': '💎',
      'enterTrainingGround': '💪',
    };
    return icons[service] || '•';
  };

  const handleFunctionService = (_functionType: FunctionNpcType, service: string) => {
    const state = useGameStore.getState();
    switch (service) {
      case 'refreshQuests':
        state.refreshSectQuests?.();
        break;
      case 'buyItem': case 'sellItem': case 'refreshShop':
        state.refreshSectShop?.();
        addMessage({ channel: 'system', sender: '门派', content: '请使用门派面板中的商店功能。' });
        break;
      case 'heal':
        updateCharacter({ hp: char.maxHp, mp: char.maxMp });
        addMessage({ channel: 'system', sender: '门派', content: '你的伤势已完全恢复！' });
        break;
      case 'teleportToWorld':
        exitSectMap();
        break;
      default:
        addMessage({ channel: 'system', sender: '门派', content: `【${getServiceName(service)}】功能正在开发中...` });
    }
  };

  const functionNpcsList = SECT_FUNCTION_NPCS[sectMapId] || [];
  const selectedFunctionNpc = selectedNpc ? functionNpcsList.find(fn => fn.id === selectedNpc.id) : null;

  return (
    <div className="smv-overlay">
      <div className="smv-container">
        <div className="smv-header">
          <div className="smv-header-left">
            <span className="smv-sect-name">{sect?.fullName || sectMapId}</span>
            <span className="smv-room-name">· {currentRoom.name}</span>
          </div>
          <button className="smv-exit-btn" onClick={exitSectMap}>✕ 离开门派</button>
        </div>

        <div className="smv-body">
          <div className="smv-left">
            <div className="smv-panel-title">◈ 门派地图</div>
            <div className="smv-grid-wrap">
              <div className="smv-grid" style={{ gridTemplateColumns: `repeat(${maxX + 1}, 1fr)`, gridTemplateRows: `repeat(${maxY + 1}, 1fr)` }}>
                {Array.from({ length: maxY + 1 }, (_, rowIdx) => {
                  const y = maxY - rowIdx;
                  return Array.from({ length: maxX + 1 }, (_, x) => {
                    const room = roomByPos[`${x},${y}`];
                    if (!room) return <div key={`${x},${y}`} className="smv-cell smv-cell-empty" />;
                    const isCurrent = room.id === sectMapRoomId;
                    const npcsCount = (room.npcs || []).length;
                    return (
                      <button key={room.id} className={`smv-cell smv-cell-room ${isCurrent ? 'smv-cell-current' : ''}`}
                        onClick={() => { if (!isCurrent) { moveSectRoom(room.id); setSelectedNpcId(null); setDuelResult(null); }}}
                        title={room.name}>
                        {isCurrent && <span className="smv-cell-dot">◉</span>}
                        <span className="smv-cell-name">{room.name.replace(/^.*·/, '')}</span>
                        {npcsCount > 0 && <span className="smv-cell-npc-count">👤{npcsCount}</span>}
                      </button>
                    );
                  });
                })}
              </div>
            </div>
            <div className="smv-room-desc">{currentRoom.description}</div>
            <div className="smv-exits-row">
              <span className="smv-exits-label">出口：</span>
              {currentRoom.exits.map((e) => (
                <button key={e.roomId} className="smv-exit-room-btn"
                  onClick={() => { moveSectRoom(e.roomId); setSelectedNpcId(null); setDuelResult(null); }}>{e.label}</button>
              ))}
            </div>
          </div>

          <div className="smv-middle">
            <div className="smv-panel-title">◈ 此处修炼者</div>
            {npcsHere.length === 0 ? (
              <div className="smv-empty-hint">此处无人，前往其他区域。</div>
            ) : (
              <div className="smv-npc-list">
                {npcsHere.map(npc => {
                  const rankColor = RANK_COLORS[npc.rank] || '#886622';
                  const isSelected = selectedNpcId === npc.id;
                  const maxRarity = RANK_MAX_RARITY[npc.rank] || '—';
                  const isMaster = char.master === npc.id;
                  const functionNpc = functionNpcsList.find(fn => fn.id === npc.id);
                  const isFunctionNpc = !!functionNpc;
                  return (
                    <div key={npc.id} className={`smv-npc-card ${isSelected ? 'smv-npc-selected' : ''}`}
                      style={{ borderColor: isSelected ? rankColor : isFunctionNpc ? '#d4a574' : 'rgba(80,60,0,0.3)', background: isFunctionNpc ? 'rgba(212,165,116,0.08)' : undefined }}
                      onClick={() => {
                        if (isSelected) { setSelectedNpcId(null); }
                        else { setSelectedNpcId(npc.id); setDuelResult(null); setDialogueIdx(prev => ({ ...prev, [npc.id]: Math.floor(Math.random() * (npc.dialogue?.length || 1)) })); }
                      }}>
                      <div className="smv-npc-card-top">
                        <span className="smv-npc-name" style={{ color: rankColor }}>
                          {isFunctionNpc && <span style={{ marginRight: '4px' }}>{FUNCTION_TYPE_ICONS[functionNpc.functionType]}</span>}
                          {npc.name}
                        </span>
                        <span className="smv-npc-rank-badge" style={{ borderColor: rankColor, color: rankColor }}>{npc.rank}</span>
                      </div>
                      {isFunctionNpc && <div style={{ fontSize: '9px', color: '#d4a574', marginBottom: '2px' }}>[{FUNCTION_TYPE_NAMES[functionNpc.functionType]}]</div>}
                      <div className="smv-npc-desc">{npc.description}</div>
                      {!isFunctionNpc && <div className="smv-npc-teaches"><span style={{ color: '#554422', fontSize: '9px' }}>最高传授：</span><span style={{ color: rankColor, fontSize: '9px' }}>{maxRarity}</span></div>}
                      {isMaster && <div style={{ color: '#ffcc00', fontSize: '10px', marginTop: '4px' }}>★ 当前师父</div>}
                      {npc.dialogue && npc.dialogue.length > 0 && <div className="smv-npc-dialogue">「{npc.dialogue[dialogueIdx[npc.id] || 0]}」</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="smv-right">
            {selectedNpc ? (
              <>
                <div className="smv-panel-title">
                  ◈ 与{selectedNpc.name}互动
                  <span style={{ color: RANK_COLORS[selectedNpc.rank], fontSize: '10px', marginLeft: 6 }}>[{selectedNpc.rank}]</span>
                </div>

                {selectedFunctionNpc ? (
                  <>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      <button className={`smv-type-btn ${functionNpcMode === 'dialogue' ? 'smv-type-active' : ''}`}
                        onClick={() => setFunctionNpcMode('dialogue')} style={{ flex: 1, fontSize: '11px' }}>💬 对话</button>
                      <button className={`smv-type-btn ${functionNpcMode === 'service' ? 'smv-type-active' : ''}`}
                        onClick={() => setFunctionNpcMode('service')} style={{ flex: 1, fontSize: '11px' }}>
                        {FUNCTION_TYPE_ICONS[selectedFunctionNpc.functionType]} 服务
                      </button>
                    </div>

                    {functionNpcMode === 'dialogue' ? (
                      <div className="smv-function-dialogue">
                        <div style={{ padding: '16px', background: 'rgba(212,165,116,0.1)', borderRadius: '4px', border: '1px solid rgba(212,165,116,0.3)' }}>
                          <div style={{ fontSize: '12px', color: '#d4a574', marginBottom: '12px' }}>
                            {FUNCTION_TYPE_ICONS[selectedFunctionNpc.functionType]} {FUNCTION_TYPE_NAMES[selectedFunctionNpc.functionType]} - {selectedFunctionNpc.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#aa8844', marginBottom: '12px' }}>{selectedFunctionNpc.description}</div>
                          <div style={{ fontSize: '11px', color: '#886622', fontStyle: 'italic' }}>「{selectedFunctionNpc.dialogue[dialogueIdx[selectedFunctionNpc.id] || 0]}」</div>
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '10px', color: '#886622', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                          <div style={{ marginBottom: '4px', color: '#aa8844' }}>提供服务：</div>
                          {selectedFunctionNpc.services.map((service, idx) => <div key={idx}>• {getServiceName(service)}</div>)}
                        </div>
                      </div>
                    ) : (
                      <div className="smv-function-service">
                        <div style={{ padding: '12px', background: 'rgba(212,165,116,0.1)', borderRadius: '4px', border: '1px solid rgba(212,165,116,0.3)', marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#d4a574', marginBottom: '8px' }}>
                            {FUNCTION_TYPE_ICONS[selectedFunctionNpc.functionType]} {FUNCTION_TYPE_NAMES[selectedFunctionNpc.functionType]}
                          </div>
                          <div style={{ fontSize: '11px', color: '#886622' }}>请选择需要的服务：</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedFunctionNpc.services.map((service, idx) => (
                            <button key={idx} className="smv-learn-btn" style={{ width: '100%', padding: '10px', fontSize: '12px', textAlign: 'left' }}
                              onClick={() => handleFunctionService(selectedFunctionNpc.functionType, service)}>
                              {getServiceIcon(service)} {getServiceName(service)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      <button className={`smv-type-btn ${interactionMode === 'skills' ? 'smv-type-active' : ''}`}
                        onClick={() => setInteractionMode('skills')} style={{ flex: 1, fontSize: '11px' }}>请教功法</button>
                      <button className={`smv-type-btn ${interactionMode === 'duel' ? 'smv-type-active' : ''}`}
                        onClick={() => setInteractionMode('duel')} style={{ flex: 1, fontSize: '11px' }}>请求切磋</button>
                      <button className={`smv-type-btn ${interactionMode === 'master' ? 'smv-type-active' : ''}`}
                        onClick={() => setInteractionMode('master')} style={{ flex: 1, fontSize: '11px' }}>拜师</button>
                    </div>

                    {interactionMode === 'skills' && (
                      <>
                        <div className="smv-type-filter">
                          {SKILL_TYPES.map(t => (
                            <button key={t} className={`smv-type-btn ${filterType === t ? 'smv-type-active' : ''}`}
                              onClick={() => setFilterType(t)}>{t === 'all' ? '全' : TYPE_ICONS[t]}</button>
                          ))}
                        </div>
                        {isZongzhu && (
                          <div className="smv-emperor-hint">
                            <span style={{ color: '#ff3333', fontWeight: 'bold' }}>极道帝经</span>
                            <span style={{ color: '#664422', fontSize: '10px' }}>：「{sect?.fullName || ''}最高秘术隐于禁地深处，需集齐镇教秘术大成，方有机缘感应其位置……」</span>
                          </div>
                        )}
                        {teachableSkills.length === 0 && rarities.length === 0 ? (
                          <div className="smv-empty-hint">{selectedNpc.rank === '杂役弟子' ? '杂役弟子没有功法可传授。去请教外门弟子吧。' : '此处暂无可传授功法。'}</div>
                        ) : teachableSkills.length === 0 ? (
                          <div className="smv-empty-hint">此类型无可传授功法。</div>
                        ) : (
                          <div className="smv-skill-list">
                            {teachableSkills.map(sk => {
                              const isLearned = learnedIds.includes(sk.id);
                              const rc = RARITY_COLORS[sk.rarity as SkillRarity] || '#888';
                              return (
                                <div key={sk.id} className="smv-skill-card" style={{ borderColor: rc + '55', background: `${rc}08` }}>
                                  <div className="smv-skill-card-top">
                                    <span className="smv-skill-icon">{(TYPE_ICONS as Record<string, string>)[sk.skillType || 'longevity']}</span>
                                    <div className="smv-skill-info">
                                      <span className="smv-skill-name" style={{ color: rc }}>{sk.name}</span>
                                      <div className="smv-skill-tags">
                                        <span className="smv-tag" style={{ color: rc, borderColor: rc + '44' }}>{RARITY_NAMES[sk.rarity as SkillRarity]}</span>
                                        <span className="smv-tag" style={{ color: '#886622', borderColor: 'rgba(80,60,0,0.3)' }}>{TYPE_NAMES[sk.skillType as SkillType]}</span>
                                        {(sk.slots || 0) > 1 && <span className="smv-tag" style={{ color: '#ffcc00', borderColor: '#ffcc0044' }}>占{sk.slots}槽</span>}
                                      </div>
                                    </div>
                                    {isLearned ? <span className="smv-learned-badge">✓ 已学</span> : (
                                      <button className="smv-learn-btn" style={{ borderColor: rc, color: rc }} onClick={(e) => { e.stopPropagation(); learnSectSkill(sk.id); }}>请教</button>
                                    )}
                                  </div>
                                  <div className="smv-skill-desc">{sk.description}</div>
                                  <div className="smv-skill-effect" style={{ color: rc }}>✦ {sk.effect}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}

                    {interactionMode === 'duel' && (
                      <div className="smv-duel-panel">
                        <div style={{ fontSize: '12px', color: '#aa8844', marginBottom: '12px' }}>与{selectedNpc.name}切磋，可以获得实战经验！</div>
                        {!canDuel(selectedNpc.rank) ? (
                          <div style={{ padding: '16px', background: 'rgba(200,100,100,0.1)', borderRadius: '4px', color: '#cc6666', fontSize: '12px' }}>
                            你的实力与{selectedNpc.name}差距过大，不适合切磋。<br /><br />
                            <span style={{ color: '#886622' }}>提示：只能与职位相近的NPC切磋</span>
                          </div>
                        ) : (
                          <>
                            <button className="smv-learn-btn" style={{ width: '100%', padding: '12px', fontSize: '14px', borderColor: '#cc8844', color: '#ffaa44' }}
                              onClick={() => startDuel(selectedNpc.name, selectedNpc.rank)}>⚔ 开始切磋</button>
                            {duelResult && <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(100,150,100,0.1)', borderRadius: '4px', color: '#88cc88', fontSize: '12px' }}>{duelResult}</div>}
                            <div style={{ marginTop: '16px', fontSize: '11px', color: '#886622', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                              <div style={{ marginBottom: '4px', color: '#aa8844' }}>切磋规则：</div>
                              <div>• 胜利可获得50修为和10贡献值</div>
                              <div>• 失败也可获得20修为</div>
                              <div>• 每日最多切磋5次</div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {interactionMode === 'master' && (
                      <div className="smv-master-panel">
                        {char.master === selectedNpc.id ? (
                          <div style={{ padding: '16px', background: 'rgba(255,204,0,0.1)', borderRadius: '4px', color: '#ffcc00', fontSize: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>★</div>
                            <div>{selectedNpc.name}是你的师父</div>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#aa8844' }}>师徒同心，其利断金</div>
                          </div>
                        ) : !canBeMaster(selectedNpc.rank) ? (
                          <div style={{ padding: '16px', background: 'rgba(200,100,100,0.1)', borderRadius: '4px', color: '#cc6666', fontSize: '12px' }}>
                            你的修为尚浅，{selectedNpc.name}不愿收你为徒。<br /><br />
                            <span style={{ color: '#886622' }}>提示：需要提升职位后才能拜更高职位的NPC为师</span>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '12px', color: '#aa8844', marginBottom: '12px' }}>向{selectedNpc.name}拜师，可以获得额外的修炼指导和资源！</div>
                            <button className="smv-learn-btn" style={{ width: '100%', padding: '12px', fontSize: '14px', borderColor: '#ccaa44', color: '#ffdd66' }}
                              onClick={() => requestMaster(selectedNpc.id, selectedNpc.name, selectedNpc.rank)}>◈ 行拜师礼</button>
                            <div style={{ marginTop: '16px', fontSize: '11px', color: '#886622', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                              <div style={{ marginBottom: '4px', color: '#aa8844' }}>拜师好处：</div>
                              <div>• 每日可向师父请教一次功法</div>
                              <div>• 获得额外的修炼经验加成</div>
                              <div>• 解锁专属师徒任务</div>
                              <div>• 师父会赠送稀有道具</div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="smv-no-npc-selected">
                <div className="smv-panel-title">◈ 功法请教</div>
                <div className="smv-empty-hint">
                  点击左侧修炼者即可与其互动。<br /><br />
                  <span style={{ color: '#3a2a08' }}>
                    功法分为八大类型：<br />
                    {['长生','攻伐','护体','遁术','炼体','神魂','阵道','源术'].map((t, i) => (
                      <span key={t} style={{ display: 'inline-block', marginRight: 4 }}>{['☯','⚔','🛡','💨','💪','🧠','🔮','💎'][i]}{t}</span>
                    ))}<br /><br />
                    稀有度：
                    {(['mortal','sect','king','sage','sect_secret','emperor'] as SkillRarity[]).map(r => (
                      <span key={r} style={{ color: RARITY_COLORS[r], marginRight: 6, fontSize: '10px' }}>{RARITY_NAMES[r]}</span>
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
