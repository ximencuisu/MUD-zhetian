import { useGameStore } from '../store/gameStore';
import { GenRoom, ZONE_TEMPLATES } from '../data/mapGen';
import './ZoneRoomMap.css';

const CELL = 32; // px per grid cell
const GAP = 4;

export default function ZoneRoomMap() {
  const zoneRooms = useGameStore(s => s.zoneRooms);
  const currentGenRoomId = useGameStore(s => s.currentGenRoomId);
  const moveGenRoom = useGameStore(s => s.moveGenRoom);
  const exitGenZone = useGameStore(s => s.exitGenZone);
  const zoneName = useGameStore((s) => {
    return ZONE_TEMPLATES.find((t: { id: string }) => t.id === s.currentZoneId)?.displayName || s.currentZoneId;
  });

  if (!zoneRooms || Object.keys(zoneRooms).length === 0) {
    return <div className="zrm-loading">正在生成地图…</div>;
  }

  const rooms = Object.values(zoneRooms);
  const maxX = Math.max(...rooms.map(r => r.x));
  const maxY = Math.max(...rooms.map(r => r.y));
  const svgW = (maxX + 1) * (CELL + GAP);
  const svgH = (maxY + 1) * (CELL + GAP);

  const current = zoneRooms[currentGenRoomId];

  const roomColor = (r: GenRoom) => {
    if (r.id === currentGenRoomId) return '#ffd700';
    if (r.isBoss) return '#cc2200';
    if (r.isEntrance) return '#226622';
    const d = r.dangerLevel;
    if (d <= 1) return '#1a3a1a';
    if (d <= 2) return '#2a3a1a';
    if (d <= 3) return '#3a2a0a';
    if (d <= 4) return '#3a1a0a';
    return '#2a0a0a';
  };

  const roomBorder = (r: GenRoom) => {
    if (r.id === currentGenRoomId) return '#ffd700';
    if (r.isBoss) return '#880000';
    if (r.isEntrance) return '#004400';
    return 'rgba(80,50,0,0.5)';
  };

  return (
    <div className="zrm-wrap">
      <div className="zrm-header">
        <span className="zrm-zone-name">◈ {zoneName}</span>
        <button className="zrm-exit-btn" onClick={exitGenZone}>← 离开</button>
      </div>

      <div className="zrm-scroll">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={Math.min(svgW, 600)}
          height={Math.min(svgH, 400)}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Connection lines */}
          {rooms.flatMap(room =>
            room.exits
              .filter(e => ['north', 'east'].includes(e.dir)) // draw each edge once
              .map(exit => {
                const target = zoneRooms[exit.toId];
                if (!target) return null;
                return (
                  <line key={`${room.id}-${exit.dir}`}
                    x1={room.x * (CELL + GAP) + CELL / 2}
                    y1={room.y * (CELL + GAP) + CELL / 2}
                    x2={target.x * (CELL + GAP) + CELL / 2}
                    y2={target.y * (CELL + GAP) + CELL / 2}
                    stroke="rgba(80,50,0,0.5)" strokeWidth="1"
                  />
                );
              })
          )}

          {/* Room nodes */}
          {rooms.map(room => {
            const cx = room.x * (CELL + GAP);
            const cy = room.y * (CELL + GAP);
            const isCurrent = room.id === currentGenRoomId;
            const isReachable = current?.exits.some(e => e.toId === room.id);

            return (
              <g key={room.id}
                style={{ cursor: isReachable || isCurrent ? 'pointer' : 'default' }}
                onClick={() => {
                  if (isReachable) {
                    const exit = current.exits.find(e => e.toId === room.id);
                    if (exit) moveGenRoom(exit.dir);
                  }
                }}
              >
                <rect
                  x={cx} y={cy} width={CELL} height={CELL}
                  fill={roomColor(room)}
                  stroke={roomBorder(room)}
                  strokeWidth={isCurrent ? 2 : 1}
                  rx={2}
                />
                {/* Pulse ring for current */}
                {isCurrent && (
                  <rect x={cx - 3} y={cy - 3} width={CELL + 6} height={CELL + 6}
                    fill="none" stroke="#ffd700" strokeWidth="1" rx={4} opacity="0.4"
                    style={{ animation: 'pulse 2s infinite' }}
                  />
                )}
                {/* Reachable highlight */}
                {isReachable && !isCurrent && (
                  <rect x={cx} y={cy} width={CELL} height={CELL}
                    fill="none" stroke="#4a8a4a" strokeWidth="1" rx={2}
                    opacity="0.7"
                  />
                )}
                {/* Boss marker */}
                {room.isBoss && (
                  <text x={cx + CELL / 2} y={cy + CELL / 2 + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="12" fill="#ff4444">!</text>
                )}
                {/* Entrance marker */}
                {room.isEntrance && (
                  <text x={cx + CELL / 2} y={cy + CELL / 2 + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fill="#44aa44">入</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Current room info */}
      {current && (
        <div className="zrm-room-info">
          <div className="zrm-room-name">
            {current.isBoss ? '⚠ ' : ''}{current.name}
            {current.isEntrance && ' [入口]'}
          </div>
          <div className="zrm-room-desc">{current.description}</div>
          <div className="zrm-exits">
            {current.exits.map(e => (
              <button key={e.dir} className="zrm-exit-chip" onClick={() => moveGenRoom(e.dir)}>
                {e.label}
              </button>
            ))}
          </div>
          {current.npcTemplates.length > 0 && (
            <div className="zrm-npcs">
              敌人：{current.npcTemplates.map(n => `【${n}】`).join(' ')}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="zrm-legend">
        <span style={{ color: '#ffd700' }}>■ 当前</span>
        <span style={{ color: '#226622' }}>■ 入口</span>
        <span style={{ color: '#cc2200' }}>■ BOSS</span>
        <span style={{ color: '#4a8a4a' }}>■ 可移动</span>
      </div>
    </div>
  );
}
