import { useGameStore } from '../store/gameStore';
import { ZONE_TEMPLATES } from '../data/mapGen';
import { REALM_NAMES } from '../types/game';
import './ExitNav.css';

// Parse realm name into "大境界 小境界 + 阶段" format
function formatRealm(realm: keyof typeof REALM_NAMES): string {
  const fullName = REALM_NAMES[realm];
  // Example: "轮海·苦海·前期" -> "轮海秘境 苦海前期"
  const parts = fullName.split('·');
  if (parts.length === 3) {
    // Has sub-realm: "轮海·苦海·前期" -> "轮海秘境 苦海前期"
    return `${parts[0]}秘境 ${parts[1]}${parts[2]}`;
  } else if (parts.length === 2) {
    // No sub-realm: "道宫·中期" -> "道宫秘境 中期"
    return `${parts[0]}秘境 ${parts[1]}`;
  }
  return fullName;
}

export default function ExitNav() {
  const character = useGameStore(s => s.character);
  const zoneRooms = useGameStore(s => s.zoneRooms);
  const currentGenRoomId = useGameStore(s => s.currentGenRoomId);
  const moveGenRoom = useGameStore(s => s.moveGenRoom);
  const exitGenZone = useGameStore(s => s.exitGenZone);
  const combat = useGameStore(s => s.combat);
  const attack = useGameStore(s => s.attack);
  const addMessage = useGameStore(s => s.addMessage);

  const current = zoneRooms[currentGenRoomId];

  const zoneName = useGameStore(s => {
    if (combat.inDungeon) return '⚔ 副本';
    return ZONE_TEMPLATES.find((t: { id: string }) => t.id === s.currentZoneId)?.displayName || s.currentZoneId;
  });

  if (!current) {
    return (
      <div className="exit-nav">
        <div className="en-header-row">
          <span className="en-zone-title">{zoneName}</span>
          <button className="en-leave-btn" onClick={exitGenZone}>← 离开</button>
        </div>
        <div className="en-loading">正在生成地图…</div>
      </div>
    );
  }

  // Monster HP: same formula as moveGenRoom
  const charLevel = character?.realmLevel || 1;
  const baseHp = 100 + charLevel * 20 + current.dangerLevel * 50;

  const inCombatWith = (npcTag: string) =>
    combat.isInCombat && combat.targetId === 'gen_' + npcTag;

  // Monster color by tier
  const monsterColor = (hp: number) => {
    if (hp >= 500) return 'en-monster-boss';
    if (hp >= 200) return 'en-monster-elite';
    return 'en-monster-normal';
  };

  // Sort exits by direction
  const exitsByDir: Record<string, typeof current.exits[0]> = {};
  current.exits.forEach(exit => {
    exitsByDir[exit.dir] = exit;
  });

  return (
    <div className="exit-nav">
      {/* Header: zone name + leave */}
      <div className="en-header-row">
        <span className="en-zone-title">{current.name}</span>
        <button className="en-leave-btn" onClick={exitGenZone}>← 离开</button>
      </div>

      {/* Cross-shaped exit navigation */}
      <div className="en-exits-cross">
        {/* North */}
        {exitsByDir.north && (
          <>
            <div className="en-cross-line-v"></div>
            <button
              className="en-exit-cross"
              onClick={() => moveGenRoom('north')}
            >
              北 → {zoneRooms[exitsByDir.north.toId]?.name || exitsByDir.north.toId}
            </button>
          </>
        )}
        
        {/* West, Center, East row */}
        <div className="en-exits-row">
          {exitsByDir.west && (
            <>
              <button
                className="en-exit-cross"
                onClick={() => moveGenRoom('west')}
              >
                {zoneRooms[exitsByDir.west.toId]?.name || exitsByDir.west.toId} ← 西
              </button>
              <div className="en-cross-line-h"></div>
            </>
          )}
          
          <div className="en-cross-center">
            <span className="en-cross-label">当前位置</span>
          </div>
          
          {exitsByDir.east && (
            <>
              <div className="en-cross-line-h"></div>
              <button
                className="en-exit-cross"
                onClick={() => moveGenRoom('east')}
              >
                东 → {zoneRooms[exitsByDir.east.toId]?.name || exitsByDir.east.toId}
              </button>
            </>
          )}
        </div>
        
        {/* South */}
        {exitsByDir.south && (
          <>
            <div className="en-cross-line-v"></div>
            <button
              className="en-exit-cross"
              onClick={() => moveGenRoom('south')}
            >
              {zoneRooms[exitsByDir.south.toId]?.name || exitsByDir.south.toId} ↑ 南
            </button>
          </>
        )}
      </div>

      {/* Room description */}
      <div className="en-desc">{current.description}</div>

      {/* Entity list */}
      <div className="en-entity-list">
        {/* Player */}
        {character && (
          <div className="en-entity-row en-player" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <span className="en-entity-name" style={{ color: '#ff0000', fontWeight: 'bold' }}>
              {formatRealm(character.realm)} {character.name}
            </span>
            <span className="en-player-hp" style={{ color: '#00ff00' }}>[{character.hp}/{character.maxHp}]</span>
            <div className="en-hp-bar" style={{ width: '100px', marginLeft: '15px' }}>
              <div className="en-hp-bar-fill" style={{ width: `${(character.hp / character.maxHp) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Monsters - 只显示活着的 */}
        {current.npcTemplates
          .filter(n => !(current.deadNpcs || []).includes(n))
          .map((n, i) => {
            const hp = inCombatWith(n) ? combat.targetHp : baseHp;
            const maxHp = inCombatWith(n) ? combat.targetMaxHp : baseHp;
            const hpPct = (hp / maxHp) * 100;
            const colorClass = monsterColor(maxHp);
            return (
              <div key={i}>
                <div className={`en-entity-row ${colorClass}`} style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                  <span className="en-entity-name" style={{ color: colorClass === 'en-monster-boss' ? '#ffaa00' : colorClass === 'en-monster-elite' ? '#ffdd44' : '#44cc44' }}>{n}</span>
                  <span style={{ color: '#00ff00' }}>[{hp}/{maxHp}]</span>
                  <div className="en-hp-bar" style={{ width: '100px', marginLeft: '15px' }}>
                    <div className="en-hp-bar-fill" style={{ width: `${hpPct}%` }} />
                  </div>
                </div>
                {/* Action buttons */}
                <div className="en-actions">
                  <button className="en-action-btn">查看</button>
                  <button className="en-action-btn">比试</button>
                  <button
                    className="en-action-btn"
                    onClick={() => {
                      if (!combat.isInCombat) {
                        attack('gen_' + n);
                        addMessage({
                          channel: 'combat',
                          sender: '遭遇',
                          content: `【${n}】向你袭来！`,
                        });
                      }
                    }}
                  >
                    {inCombatWith(n) ? '战中' : '击杀'}
                  </button>
                </div>
              </div>
            );
          })}

        {/* Corpses - 显示尸体 */}
        {(current.corpses || []).length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {(current.corpses || []).map((corpse, i) => (
              <div key={`corpse_${i}`} className="en-entity-row" style={{ color: '#665533', fontSize: '11px', justifyContent: 'center' }}>
                <span>【尸体】{corpse.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 检查是否还有活着的敌人 */}
        {current.npcTemplates.filter(n => !(current.deadNpcs || []).includes(n)).length === 0 && (current.corpses || []).length === 0 && (
          <div className="en-entity-row" style={{ color: '#3a3a2a', fontSize: '11px', justifyContent: 'center' }}>
            此处暂无敌人
          </div>
        )}
      </div>
    </div>
  );
}
