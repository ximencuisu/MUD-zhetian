import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONES, ZONE_NPCS } from '../data/zones';
import { DUNGEONS } from '../data/dungeons';
import { SECTS } from '../data/sects';
import { ITEMS } from '../data/world';
import './ZoneView.css';

interface Props {
  type: 'dungeon' | 'sect' | 'active';
}

// Shows dungeon/sect selector list + right detail pane
function ZoneSelector({ type }: { type: 'dungeon' | 'sect' }) {
  const { character, enterZone } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const zones = Object.values(ZONES).filter(z => z.type === type);
  const selected = selectedId ? ZONES[selectedId] : null;
  const dungeonInfo = selectedId ? DUNGEONS[selectedId] : null;
  const sectInfo = selectedId ? SECTS[selectedId] : null;

  return (
    <div className="zone-selector">
      {/* Left list */}
      <div className="zs-list">
        <div className="zs-list-title">{type === 'dungeon' ? '副本列表' : '门派列表'}</div>
        {zones.map(zone => {
          const locked = type === 'dungeon' && zone.minLevel && character && character.realmLevel < zone.minLevel;
          return (
            <div
              key={zone.id}
              className={`zs-item ${selectedId === zone.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => setSelectedId(zone.id)}
            >
              <div className="zs-item-name">{zone.name}</div>
              {type === 'dungeon' && zone.minLevel && (
                <div className="zs-item-sub">Lv.{zone.minLevel}+</div>
              )}
              {type === 'sect' && sectInfo && selectedId === zone.id && (
                <div className="zs-item-sub">{SECTS[zone.id]?.specialty}</div>
              )}
              {type === 'sect' && selectedId !== zone.id && (
                <div className="zs-item-sub">{SECTS[zone.id]?.specialty || ''}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right detail */}
      <div className="zs-detail">
        {!selected ? (
          <div className="zs-placeholder">{type === 'dungeon' ? '← 选择副本查看详情' : '← 选择门派查看详情'}</div>
        ) : (
          <>
            <div className="zs-detail-title">{selected.name}</div>
            {type === 'dungeon' && dungeonInfo && (
              <>
                <div className="zs-already-explored">
                  {character?.dungeonProgress?.[selectedId!] ? `已完成 ${character.dungeonProgress[selectedId!]} 次` : '未探索'}
                </div>
                <div className="zs-desc">{selected.description}</div>
                <div className="zs-info-row"><span>推荐等级</span><span>{dungeonInfo.levelMin} ~ {dungeonInfo.levelMax}</span></div>
                <div className="zs-info-row"><span>每日次数</span><span>{dungeonInfo.dailyLimit} 次</span></div>
                <div className="zs-info-row"><span>BOSS</span><span style={{ color: '#ffcc00' }}>{dungeonInfo.bossName}</span></div>
                <div className="zs-desc">副本奖励：</div>
                <div className="zs-rewards">
                  <span className="zsr-exp">经验 +{dungeonInfo.rewards.exp}</span>
                  <span className="zsr-gold">金两 +{dungeonInfo.rewards.gold}</span>
                  {dungeonInfo.rewards.items.map(id => (
                    <span key={id} className="zsr-item">{ITEMS[id]?.name || id}</span>
                  ))}
                </div>
                <div className="zs-btn-row">
                  <button
                    className="zs-enter-btn"
                    disabled={!!(character && dungeonInfo.levelMin > character.realmLevel)}
                    onClick={() => enterZone(selectedId!)}
                  >
                    {character && dungeonInfo.levelMin > character.realmLevel
                      ? `🔒 需要 ${dungeonInfo.levelMin} 级`
                      : '进入副本 →'}
                  </button>
                </div>
              </>
            )}
            {type === 'sect' && (
              <>
                <div className="zs-desc">{selected.description}</div>
                {sectInfo && (
                  <>
                    <div className="zs-info-row"><span>掌门</span><span style={{ color: '#00ccff' }}>{sectInfo.masterNpc}</span></div>
                    <div className="zs-info-row"><span>擅长</span><span style={{ color: '#ffcc00' }}>{sectInfo.specialty}</span></div>
                    <div className="zs-info-row"><span>驻地</span><span>{sectInfo.location}</span></div>
                    <div className="zs-info-row"><span>加入条件</span><span>{sectInfo.joinRequirement}</span></div>
                  </>
                )}
                <div className="zs-btn-row">
                  {character?.sect === (sectInfo?.name || '') ? (
                    <button className="zs-enter-btn sect" onClick={() => enterZone(selectedId!)}>
                      前往门派
                    </button>
                  ) : (
                    <button className="zs-enter-btn sect" onClick={() => enterZone(selectedId!)}>
                      前往拜访
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Active zone map (replaces message log when inside a zone)
function ActiveZoneMap() {
  const { currentZoneId, currentZoneRoomId, character, combat, moveZone, exitZone, attack } = useGameStore();
  if (!currentZoneId || !currentZoneRoomId) return null;

  const zone = ZONES[currentZoneId];
  if (!zone) return null;
  const room = zone.rooms.find(r => r.id === currentZoneRoomId);
  if (!room) return null;

  const hpPct = character ? (character.hp / character.maxHp) * 100 : 100;
  const mpPct = character ? (character.mp / character.maxMp) * 100 : 100;
  const targetHpPct = combat.targetMaxHp > 0 ? (combat.targetHp / combat.targetMaxHp) * 100 : 0;
  const setAutoCombat = useGameStore.getState().setAutoCombat;
  const flee = useGameStore.getState().flee;

  return (
    <div className="zone-active">
      {/* Left: zone room tree */}
      <div className="za-sidebar">
        <div className="za-zone-name">{zone.name}</div>
        <div className="za-room-list">
          {zone.rooms.map((r) => (
            <div
              key={r.id}
              className={`za-room-item ${r.id === currentZoneRoomId ? 'current' : ''} ${!r.isSafe ? 'danger' : ''}`}
              onClick={() => {
                // Can only move to connected rooms
                const connected = room.exits.some(e => e.roomId === r.id);
                if (connected && !combat.isInCombat) moveZone(r.id);
              }}
            >
              <span className="zari-dot">{r.id === currentZoneRoomId ? '◉' : '○'}</span>
              <span className="zari-name">{r.name.replace(`${zone.name}·`, '')}</span>
              {!r.isSafe && <span className="zari-danger">!</span>}
            </div>
          ))}
        </div>
        <button className="za-exit-btn" onClick={exitZone}>⬅ 离开{zone.type === 'dungeon' ? '副本' : '门派'}</button>
      </div>

      {/* Right: room detail + combat */}
      <div className="za-main">
        <div className="za-room-header">
          <span className="za-room-name">{room.name}</span>
          {!room.isSafe && <span className="za-danger-tag">危险区域</span>}
        </div>
        <div className="za-room-desc">{room.description}</div>

        {/* Items in room */}
        {room.items.length > 0 && (
          <div className="za-items">
            地上：{room.items.map(id => ITEMS[id]?.name || id).join('、')}
          </div>
        )}

        {/* Exits */}
        <div className="za-exits">
          {room.exits.map(exit => {
            const destRoom = zone.rooms.find(r => r.id === exit.roomId);
            const isExit = !destRoom; // leads out of zone
            return (
              <button
                key={exit.roomId}
                className={`za-exit-btn-inline ${isExit ? 'leave' : ''}`}
                onClick={() => {
                  if (combat.isInCombat) return;
                  if (isExit) exitZone();
                  else moveZone(exit.roomId);
                }}
                disabled={combat.isInCombat}
              >
                {exit.label} →
              </button>
            );
          })}
        </div>

        {/* NPC list */}
        <div className="za-npcs">
          {room.npcs.map(npcId => {
            const npc = ZONE_NPCS[npcId];
            if (!npc) return null;
            return (
              <div key={npcId} className={`za-npc-row ${npc.isHostile ? 'hostile' : ''}`}>
                <div className="za-npc-info">
                  <span className="za-npc-name" style={{ color: npc.isHostile ? '#ff6644' : '#00cc88' }}>
                    {npc.isHostile ? '⚔ ' : '● '}{npc.name}
                  </span>
                  <span className="za-npc-desc">{npc.description}</span>
                </div>
                <div className="za-npc-actions">
                  {!npc.isHostile && (
                    <button className="za-npc-btn talk" onClick={() => {
                      const { addMessage } = useGameStore.getState();
                      const line = npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
                      addMessage({ channel: 'say', sender: npc.name, content: line });
                    }}>交谈</button>
                  )}
                  <button
                    className="za-npc-btn attack"
                    disabled={combat.isInCombat}
                    onClick={() => attack(npcId)}
                  >攻击</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combat panel */}
        {combat.isInCombat && (
          <div className="za-combat">
            <div className="za-combat-title">⚔ 战斗中</div>
            <div className="za-target-name">{combat.targetName}</div>
            <div className="za-hp-row">
              <span>HP</span>
              <div className="za-hp-bar"><div className="za-hp-fill enemy" style={{ width: `${targetHpPct}%` }} /></div>
              <span>{combat.targetHp}/{combat.targetMaxHp}</span>
            </div>
            <div className="za-my-vitals">
              <div className="za-hp-row">
                <span>气血</span>
                <div className="za-hp-bar"><div className="za-hp-fill player" style={{ width: `${hpPct}%` }} /></div>
                <span>{character?.hp}/{character?.maxHp}</span>
              </div>
              <div className="za-hp-row">
                <span>内力</span>
                <div className="za-hp-bar"><div className="za-hp-fill mp" style={{ width: `${mpPct}%` }} /></div>
                <span>{character?.mp}/{character?.maxMp}</span>
              </div>
            </div>
            <div className="za-combat-btns">
              <button className={`za-cb ${combat.autoCombat ? 'on' : ''}`} onClick={() => setAutoCombat(!combat.autoCombat)}>
                {combat.autoCombat ? '● 自动中' : '自动战斗'}
              </button>
              <button className="za-cb flee" onClick={flee}>撤退</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ZoneView({ type }: Props) {
  if (type === 'active') return <ActiveZoneMap />;
  return <ZoneSelector type={type as 'dungeon' | 'sect'} />;
}
