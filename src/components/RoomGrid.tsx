import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ROOMS, ITEMS } from '../data/world';
import { ALL_SECT_ROOMS, SECT_MAPS } from '../data/sectMaps';
import { SECTS } from '../data/sects';
import { REALM_NAMES } from '../types/game';
import { ALL_SECT_NPCS, SectNpcDef } from '../data/sectNpcs';
import { SECT_FUNCTION_NPCS, FUNCTION_TYPE_NAMES, FUNCTION_TYPE_ICONS, FunctionNpcDef } from '../data/sectFunctionNpcs';
import { RANK_TEACHES, ALL_SECT_SKILLS, RARITY_NAMES, RARITY_COLORS, TYPE_NAMES, TYPE_ICONS } from '../data/sectSkills';
import { Skill, SkillRarity, SkillType } from '../types/game';
import './RoomGrid.css';

// Parse realm name into "大境界秘境 小境界 + 阶段" format
function formatRealm(realm: keyof typeof REALM_NAMES): string {
  const fullName = REALM_NAMES[realm];
  const parts = fullName.split('·');
  
  // Special handling for 化龙秘境 (Hualong) - show as "化龙秘境 一变"
  if (parts[0] === '化龙') {
    return `化龙秘境 ${parts[1]}`;
  }
  
  // Special handling for 仙台秘境 (Xiantai) - show with title and layer
  if (parts[0] === '仙台') {
    const layer = parts[1]; // "一层天", "二层天", etc.
    let title = '';
    // Determine title based on layer
    if (layer === '一层天') title = '半步大能';
    else if (layer === '二层天') title = '大能';
    else if (layer === '三层天') title = '斩道王者';
    else if (layer === '四层天') title = '圣人';
    else if (layer === '五层天') title = '圣人王';
    else if (layer === '六层天') title = '大圣';
    return `${title} 仙台秘境 ${layer}`;
  }
  
  // Special handling for 准帝境 (Zhundi) - show as "准帝境 一重天"
  if (parts[0] === '准帝') {
    return `准帝境 ${parts[1]}`;
  }
  
  // Special handling for 大帝境 (Dadi) - show as "大帝境 第一世"
  if (parts[0] === '大帝') {
    return `大帝境 ${parts[1]}`;
  }
  
  // Special handling for 红尘仙 (Hongchen Xian)
  if (parts[0] === '红尘仙') {
    return '红尘仙';
  }
  
  if (parts.length === 3) {
    // Has sub-realm: "轮海·苦海·前期" -> "轮海秘境 苦海前期"
    return `${parts[0]}秘境 ${parts[1]}${parts[2]}`;
  } else if (parts.length === 2) {
    // No sub-realm: "道宫·中期" -> "道宫秘境 中期"
    return `${parts[0]}秘境 ${parts[1]}`;
  }
  return fullName;
}

const DIR_GRID: Record<string, [number, number]> = {
  north: [0, 1], south: [2, 1], east: [1, 2], west: [1, 0],
  northeast: [0, 2], northwest: [0, 0], southeast: [2, 2], southwest: [2, 0],
};

// Merged room lookup
const ALL_ROOMS = { ...ROOMS, ...ALL_SECT_ROOMS };

function isSkillType(value: unknown): value is SkillType {
  return typeof value === 'string' && value in TYPE_ICONS;
}

function isSkillRarity(value: unknown): value is SkillRarity {
  return typeof value === 'string' && value in RARITY_COLORS;
}

// Build reverse map: roomId → sectId
const ROOM_TO_SECT: Record<string, string> = {};
for (const [sectId, map] of Object.entries(SECT_MAPS)) {
  for (const roomId of Object.keys(map)) {
    ROOM_TO_SECT[roomId] = sectId;
  }
}

export default function RoomGrid() {
  const character = useGameStore(s => s.character);
  const moveToRoom = useGameStore(s => s.moveToRoom);
  const exitSectMap = useGameStore(s => s.exitSectMap);
  const combat = useGameStore(s => s.combat);
  const toggleWindow = useGameStore(s => s.toggleWindow);
  const openWindows = useGameStore(s => s.openWindows);
  const currentZoneId = useGameStore(s => s.currentZoneId);
  const startCultivation = useGameStore(s => s.startCultivation);
  const stopCultivation = useGameStore(s => s.stopCultivation);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showPlayerActions, setShowPlayerActions] = useState(false);
  const [showPlayerView, setShowPlayerView] = useState(false);
  const [selectedNpc, setSelectedNpc] = useState<(SectNpcDef & { functionNpc?: FunctionNpcDef }) | null>(null);
  const [npcDialogue, setNpcDialogue] = useState('');
  const [showSkillList, setShowSkillList] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const addMessage = useGameStore(s => s.addMessage);
  const updateCharacter = useGameStore(s => s.updateCharacter);
  const char = useGameStore(s => s.character);
  const refreshSectQuests = useGameStore(s => s.refreshSectQuests);
  const joinSect = useGameStore(s => s.joinSect);
  const learnSectSkill = useGameStore(s => s.learnSectSkill);

  // Player action handlers
  const handleViewPlayer = () => {
    setShowPlayerView(!showPlayerView);
    setShowPlayerActions(false);
  };

  const handleMeditate = () => {
    // Directly start meditation
    startCultivation('meditate');
    setShowPlayerActions(false);
  };

  const handleCultivate = () => {
    // Toggle auto-cultivation
    if (character.cultivationMode === 'none') {
      startCultivation('cultivate');
    } else {
      stopCultivation();
    }
    setShowPlayerActions(false);
  };

  // NPC interaction handlers
  const handleNpcClick = (npc: SectNpcDef, functionNpc?: FunctionNpcDef) => {
    setSelectedNpc({ ...npc, functionNpc });
    // Random dialogue
    const dialogues = functionNpc?.dialogue || npc.dialogue || ['...'];
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    setNpcDialogue(randomDialogue);
  };

  const handleNpcService = (service: string) => {
    if (!selectedNpc?.functionNpc) return;

    switch (service) {
      case 'refreshQuests':
        refreshSectQuests?.();
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}为你刷新了今日任务。` });
        break;
      case 'buyItem':
      case 'sellItem':
        toggleWindow('sect');
        addMessage({ channel: 'system', sender: '门派', content: `请使用门派面板中的商店功能。` });
        break;
      case 'heal':
        updateCharacter({ hp: char.maxHp, mp: char.maxMp });
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}为你治疗，伤势完全恢复！` });
        break;
      case 'teleportToWorld':
        exitSectMap();
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}将你传送到了外界。` });
        break;
      case 'deposit':
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：仓库功能正在开发中...` });
        break;
      case 'withdraw':
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：仓库功能正在开发中...` });
        break;
      case 'forgeWeapon':
      case 'forgeArmor':
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：炼器功能正在开发中，请准备材料...` });
        break;
      case 'startDuel':
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：请前往竞技场切磋。` });
        break;
      case 'enterSectDungeon':
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：秘境功能正在开发中...` });
        break;
      default:
        addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：【${service}】功能正在开发中...` });
    }
    setSelectedNpc(null);
  };

  // Handle join sect
  const handleJoinSect = () => {
    if (!sectId) return;
    if (char.sect) {
      addMessage({ channel: 'system', sender: '门派', content: `你已经是${char.sect}的弟子了，不能再加入其他门派。` });
      return;
    }
    joinSect(sectId);
    addMessage({ channel: 'system', sender: '门派', content: `你正式拜入了${sect?.fullName}！` });
    setSelectedNpc(null);
  };

  // Handle learn skill - show skill selection list
  const handleLearnSkill = () => {
    if (!selectedNpc) return;
    // Get current sectId from room
    const currentRoomId = character?.currentRoomId || 'donghuang_plain';
    const currentSectId = ROOM_TO_SECT[currentRoomId];
    if (!currentSectId) {
      addMessage({ channel: 'system', sender: '门派', content: '你不在门派中，无法学习功法。' });
      return;
    }

    // Get teachable skills based on NPC rank
    const rarities = RANK_TEACHES[selectedNpc.rank] || [];

    if (rarities.length === 0) {
      addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：我没有什么可以教你的。` });
      return;
    }

    // Get skills that player hasn't learned yet
    const learnedIds = char.skills.map((s: { id: string }) => s.id);
    const skills = ALL_SECT_SKILLS.filter((s) =>
      s.sect === currentSectId && isSkillRarity(s.rarity) && rarities.includes(s.rarity) && !learnedIds.includes(s.id)
    );

    if (skills.length === 0) {
      addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc.name}：你已经学会了所有我能传授的功法。` });
      return;
    }

    // Show skill selection list
    setAvailableSkills(skills);
    setShowSkillList(true);
  };

  // Handle select skill to learn
  const handleSelectSkill = (skill: Skill) => {
    learnSectSkill(skill.id);
    addMessage({ channel: 'system', sender: '门派', content: `${selectedNpc?.name}传授了你【${skill.name}】！` });
    setShowSkillList(false);
    setAvailableSkills([]);
    setSelectedNpc(null);
  };

  const getServiceName = (service: string): string => {
    const names: Record<string, string> = {
      'refreshQuests': '刷新任务', 'acceptQuest': '接受任务', 'completeQuest': '完成任务',
      'buyItem': '购买物品', 'sellItem': '出售物品', 'refreshShop': '刷新商店',
      'deposit': '存放物品', 'withdraw': '取出物品', 'expandStorage': '扩展空间',
      'forgeWeapon': '锻造武器', 'forgeArmor': '锻造护甲', 'enhanceEquipment': '强化装备',
      'refineMaterial': '精炼材料', 'heal': '治疗伤势', 'cureStatus': '清除负面状态',
      'buyPotion': '购买丹药', 'teleportToWorld': '传送到外界',
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

  // Hide when in a zone or dungeon — navigation is handled by ExitNav instead
  if (currentZoneId || combat.inDungeon) return null;

  const currentRoomId = character?.currentRoomId || 'donghuang_plain';
  const currentRoom = ALL_ROOMS[currentRoomId];

  if (!currentRoom) return null;

  const sectId = ROOM_TO_SECT[currentRoomId];
  const sect = sectId ? SECTS[sectId] : null;

  // Get NPCs in current room
  const npcsHere = sectId 
    ? ALL_SECT_NPCS.filter(n => n.sect === sectId && (currentRoom.npcs || []).includes(n.id))
    : [];
  const functionNpcsList = sectId ? SECT_FUNCTION_NPCS[sectId] || [] : [];

  const grid: (null | { roomId: string; label: string })[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  grid[1][1] = { roomId: currentRoom.id, label: currentRoom.name };
  currentRoom.exits.forEach(e => {
    const pos = DIR_GRID[e.direction];
    if (pos) {
      const destRoom = ALL_ROOMS[e.roomId];
      grid[pos[0]][pos[1]] = { roomId: e.roomId, label: destRoom ? destRoom.name : e.roomId };
    }
  });

  const isLongDesc = currentRoom.description.length > 50;
  const descText = descExpanded || !isLongDesc
    ? currentRoom.description
    : currentRoom.description.slice(0, 50) + '…';

  return (
    <div className="room-grid">
      {/* Sect banner — shown when inside a sect */}
      {sect && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '5px 10px', background: `${sect.color}18`,
          borderBottom: `1px solid ${sect.color}44`, flexShrink: 0,
        }}>
          <span style={{ color: sect.color, fontSize: '12px', fontWeight: 'bold', letterSpacing: 1 }}>
            {sect.emblem} {sect.fullName}
          </span>
          <button
            style={{
              background: 'rgba(80,20,20,0.7)', border: '1px solid #882222',
              color: '#ff8888', padding: '2px 10px', borderRadius: 3,
              cursor: 'pointer', fontSize: '10px',
            }}
            onClick={exitSectMap}
          >
            ✕ 离开门派
          </button>
        </div>
      )}

      {/* Room title row */}
      <div className="rg-desc-row">
        <span className="rg-room-name">{currentRoom.name}</span>
        <button className="rg-map-btn" onClick={() => toggleWindow('map')} title="查看地图">
          {openWindows.has('map') ? '✕' : '🗺'}
        </button>
      </div>

      {/* Room description */}
      <div className={`rg-desc-text ${descExpanded ? 'rg-desc-expanded' : ''}`}>
        {descText}
        {isLongDesc && (
          <button className="rg-desc-toggle" onClick={() => setDescExpanded(!descExpanded)}>
            {descExpanded ? '▲收起' : '▼展开'}
          </button>
        )}
      </div>

      {/* NPC List */}
      {npcsHere.length > 0 && (
        <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', border: '1px solid rgba(212,165,116,0.3)' }}>
          <div style={{ fontSize: '11px', color: '#d4a574', marginBottom: '6px', fontWeight: 'bold' }}>◈ 此处修炼者（点击交互）</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {npcsHere.map(npc => {
              const functionNpc = functionNpcsList.find(fn => fn.id === npc.id);
              const isFunctionNpc = !!functionNpc;
              const rankColors: Record<string, string> = {
                '杂役弟子': '#888888', '外门弟子': '#44cc44', '内门弟子': '#44aaff',
                '真传弟子': '#ffcc00', '外门长老': '#ffcc00', '内门长老': '#ff9900',
                '道子': '#cc66ff', '圣女': '#ff66cc', '太上长老': '#ff6633', '宗主': '#ff3333',
              };
              return (
                <div 
                  key={npc.id} 
                  onClick={() => handleNpcClick(npc, functionNpc)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 8px',
                    background: isFunctionNpc ? 'rgba(212,165,116,0.1)' : 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                    border: isFunctionNpc ? '1px solid rgba(212,165,116,0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isFunctionNpc ? 'rgba(212,165,116,0.2)' : 'rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isFunctionNpc ? 'rgba(212,165,116,0.1)' : 'rgba(0,0,0,0.2)';
                  }}
                >
                  {isFunctionNpc && <span>{FUNCTION_TYPE_ICONS[functionNpc.functionType]}</span>}
                  <span style={{ fontSize: '11px', color: rankColors[npc.rank] || '#aa8844', fontWeight: 'bold' }}>{npc.name}</span>
                  {isFunctionNpc && (
                    <span style={{ fontSize: '9px', color: '#d4a574' }}>[{FUNCTION_TYPE_NAMES[functionNpc.functionType]}]</span>
                  )}
                  <span style={{ fontSize: '9px', color: '#886622', marginLeft: 'auto' }}>{npc.rank}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NPC Interaction Dialog */}
      {selectedNpc && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000 
        }} onClick={() => setSelectedNpc(null)}>
          <div 
            style={{ 
              background: '#1a1510', 
              border: '2px solid #d4a574', 
              borderRadius: '8px', 
              padding: '20px', 
              maxWidth: '400px', 
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* NPC Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(212,165,116,0.3)', paddingBottom: '10px' }}>
              {selectedNpc.functionNpc && (
                <span style={{ fontSize: '24px' }}>{FUNCTION_TYPE_ICONS[selectedNpc.functionNpc.functionType]}</span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', color: '#d4a574', fontWeight: 'bold' }}>{selectedNpc.name}</div>
                <div style={{ fontSize: '12px', color: '#886622' }}>{selectedNpc.rank}</div>
              </div>
              <button 
                onClick={() => setSelectedNpc(null)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #882222', 
                  color: '#ff6666', 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* NPC Description */}
            <div style={{ fontSize: '13px', color: '#aa8844', marginBottom: '15px', lineHeight: '1.5' }}>
              {selectedNpc.description}
            </div>

            {/* Dialogue */}
            <div style={{ 
              background: 'rgba(212,165,116,0.1)', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '15px',
              border: '1px solid rgba(212,165,116,0.2)'
            }}>
              <div style={{ fontSize: '12px', color: '#d4a574', fontStyle: 'italic' }}>
                「{npcDialogue}」
              </div>
            </div>

            {/* Join Sect Button - Show when player has no sect */}
            {!char.sect && sectId && (
              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleJoinSect}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(68,170,255,0.2)',
                    border: '1px solid #44aaff',
                    borderRadius: '4px',
                    color: '#44aaff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(68,170,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(68,170,255,0.2)';
                  }}
                >
                  <span>🏛️</span>
                  <span>拜入{sect?.fullName}</span>
                </button>
              </div>
            )}

            {/* Learn Skill Button - Show when player is in this sect */}
            {char.sect === sectId && (
              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={handleLearnSkill}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(255,204,0,0.2)',
                    border: '1px solid #ffcc00',
                    borderRadius: '4px',
                    color: '#ffcc00',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,204,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,204,0,0.2)';
                  }}
                >
                  <span>📜</span>
                  <span>学习功法</span>
                </button>
              </div>
            )}

            {/* Services */}
            {selectedNpc.functionNpc && (
              <div>
                <div style={{ fontSize: '12px', color: '#d4a574', marginBottom: '10px', fontWeight: 'bold' }}>
                  可用服务：
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedNpc.functionNpc.services.map((service, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNpcService(service)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: 'rgba(212,165,116,0.1)',
                        border: '1px solid rgba(212,165,116,0.3)',
                        borderRadius: '4px',
                        color: '#d4c4a8',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(212,165,116,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(212,165,116,0.1)';
                      }}
                    >
                      <span>{getServiceIcon(service)}</span>
                      <span>{getServiceName(service)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Close button at bottom */}
            <button 
              onClick={() => setSelectedNpc(null)}
              style={{ 
                width: '100%',
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(80,20,20,0.7)', 
                border: '1px solid #882222', 
                color: '#ff8888', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              离开
            </button>
          </div>
        </div>
      )}

      {/* Skill Selection List */}
      {showSkillList && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1001 
        }} onClick={() => setShowSkillList(false)}>
          <div 
            style={{ 
              background: '#1a1510', 
              border: '2px solid #d4a574', 
              borderRadius: '8px', 
              padding: '20px', 
              maxWidth: '500px', 
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid rgba(212,165,116,0.3)', paddingBottom: '10px' }}>
              <div style={{ fontSize: '16px', color: '#d4a574', fontWeight: 'bold' }}>
                📜 选择要学习的功法
              </div>
              <button 
                onClick={() => setShowSkillList(false)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #882222', 
                  color: '#ff6666', 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Skill List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableSkills.map((skill) => {
                const skillType = isSkillType(skill.skillType) ? skill.skillType : null;
                const rarity = isSkillRarity(skill.rarity) ? skill.rarity : null;
                const rarityColor = rarity ? RARITY_COLORS[rarity] : '#d4c4a8';

                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSelectSkill(skill)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px',
                      background: 'rgba(212,165,116,0.08)',
                      border: '1px solid rgba(212,165,116,0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212,165,116,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212,165,116,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212,165,116,0.2)';
                    }}
                  >
                    {/* Skill Name and Rarity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{skillType ? TYPE_ICONS[skillType] : '•'}</span>
                      <span style={{ fontSize: '14px', color: rarityColor, fontWeight: 'bold' }}>
                        {skill.name}
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        color: rarity ? RARITY_COLORS[rarity] : '#888',
                        padding: '1px 6px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '3px'
                      }}>
                        {rarity ? RARITY_NAMES[rarity] : skill.rarity}
                      </span>
                      <span style={{ fontSize: '10px', color: '#886644', marginLeft: 'auto' }}>
                        {skillType ? TYPE_NAMES[skillType] : skill.skillType}
                      </span>
                    </div>
                    
                    {/* Skill Description */}
                    <div style={{ fontSize: '11px', color: '#886644', marginBottom: '4px', lineHeight: '1.4' }}>
                      {skill.description}
                    </div>
                    
                    {/* Skill Effect */}
                    <div style={{ fontSize: '11px', color: '#44aa44' }}>
                      效果：{skill.effect}
                    </div>
                    
                    {/* Skill Cost */}
                    <div style={{ fontSize: '10px', color: '#4488ff', marginTop: '4px' }}>
                      消耗：{skill.mpCost}神力 | 冷却：{skill.cooldown}回合
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cancel Button */}
            <button 
              onClick={() => setShowSkillList(false)}
              style={{ 
                width: '100%',
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(80,20,20,0.7)', 
                border: '1px solid #882222', 
                color: '#ff8888', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 3x3 exit grid */}
      <div className="rg-grid-wrap">
        <div className="rg-grid">
          {grid.map((row, ri) => (
            <div key={ri} className="rg-row">
              {row.map((cell, ci) => {
                if (!cell) return <div key={ci} className="rg-cell rg-empty" />;
                const isCurrent = cell.roomId === currentRoomId;
                const destRoom = ALL_ROOMS[cell.roomId];
                const isDanger = !destRoom?.isSafe && !isCurrent;
                const hasRight = ci < 2 && grid[ri][ci + 1];
                const hasBottom = ri < 2 && grid[ri + 1][ci];
                return (
                  <div key={ci} className="rg-cell-wrap">
                    <button
                      className={`rg-cell ${isCurrent ? 'rg-current' : ''} ${isDanger ? 'rg-danger' : ''}`}
                      disabled={isCurrent || combat.isInCombat}
                      onClick={() => !isCurrent && moveToRoom(cell.roomId)}
                    >
                      <span className="rg-label">{cell.label}</span>
                      {isDanger && <span className="rg-warn">⚠</span>}
                    </button>
                    {hasRight && <div className="rg-line-h" />}
                    {hasBottom && <div className="rg-line-v" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Player info bar at bottom */}
      {character && (
        <div>
          <div 
            className="rg-player-info" 
            onClick={() => setShowPlayerActions(!showPlayerActions)}
            style={{ cursor: 'pointer' }}
          >
            <span className="rg-pip-realm-name">
              {formatRealm(character.realm)} {character.name}
            </span>
            <span className="rg-pip-hp-text">[{character.hp}/{character.maxHp}]</span>
            <div className="rg-pip-hp-bar">
              <div className="rg-pip-hp-bar-fill" style={{ width: `${(character.hp / character.maxHp) * 100}%` }} />
            </div>
          </div>
          
          {/* Player action buttons */}
          {showPlayerActions && (
            <div className="rg-player-actions">
              <button className="rg-player-action-btn" onClick={handleViewPlayer}>
                {showPlayerView ? '收起' : '查看'}
              </button>
              <button className="rg-player-action-btn" onClick={handleMeditate}>打坐</button>
              <button className="rg-player-action-btn" onClick={handleCultivate}>
                {character.cultivationMode === 'none' ? '修炼' : '停止'}
              </button>
            </div>
          )}

          {/* Player view panel */}
          {showPlayerView && character && (
            <div className="rg-player-view">
              <div className="rg-pv-section">
                <div className="rg-pv-title">人物信息</div>
                <div className="rg-pv-content">
                  <div className="rg-pv-row">
                    <span className="rg-pv-label">境界：</span>
                    <span className="rg-pv-value">{formatRealm(character.realm)} {character.realmLevel > 1 ? character.realmLevel : ''}</span>
                  </div>
                  <div className="rg-pv-row">
                    <span className="rg-pv-label">年龄：</span>
                    <span className="rg-pv-value">{character.age}岁</span>
                  </div>
                  <div className="rg-pv-row">
                    <span className="rg-pv-label">体质：</span>
                    <span className="rg-pv-value">{character.physique === 'mortal' ? '凡体' : character.physique === 'ancient_saint' ? '太古圣体' : character.physique === 'dao_womb' ? '道胎' : character.physique === 'divine_king' ? '神王体' : character.physique === 'overlord' ? '霸体' : character.physique === 'yin_body' ? '玄阴体' : '太阳体'}</span>
                  </div>
                  <div className="rg-pv-row">
                    <span className="rg-pv-label">气血：</span>
                    <span className="rg-pv-value" style={{ color: '#00ff00' }}>{character.hp} / {character.maxHp}</span>
                  </div>
                  <div className="rg-pv-row">
                    <span className="rg-pv-label">神力：</span>
                    <span className="rg-pv-value" style={{ color: '#4488ff' }}>{character.mp} / {character.maxMp}</span>
                  </div>
                </div>
              </div>

              <div className="rg-pv-section">
                <div className="rg-pv-title">装备</div>
                <div className="rg-pv-content rg-pv-equipment">
                  {Object.entries(character.equipment).map(([slot, itemId]) => {
                    const item = itemId ? ITEMS[itemId] : null;
                    return (
                      <div key={slot} className="rg-pv-equip-slot">
                        <span className="rg-pv-equip-label">{slot === 'weapon' ? '武器' : slot === 'head' ? '头部' : slot === 'body' ? '衣服' : slot === 'waist' ? '腰带' : slot === 'hands' ? '护手' : '鞋子'}：</span>
                        <span className={`rg-pv-equip-value ${item ? 'rg-equip-' + item.quality : ''}`}>
                          {item ? item.name : '无'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
