import { useGameStore } from '../../store/gameStore';
import { ROOMS } from '../../data/world';
import './Panel.css';

const NODE_W = 72;
const NODE_H = 24;

function edgePoint(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  if (dx === 0 && dy === 0) return { x: from.x, y: from.y };
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let t: number;
  if (absDx * hh > absDy * hw) {
    t = hw / absDx;
  } else {
    t = hh / absDy;
  }
  return { x: from.x + dx * t, y: from.y + dy * t };
}

export default function MapPanel() {
  const character = useGameStore((s) => s.character);
  const moveToRoom = useGameStore((s) => s.moveToRoom);
  const combat = useGameStore((s) => s.combat);
  const currentRoomId = character?.currentRoomId || 'donghuang_plain';
  const currentRoom = ROOMS[currentRoomId];

  if (!currentRoom) return null;

  const visited = new Set<string>();
  const queue = [currentRoomId];
  const conns: [string, string][] = [];

  while (queue.length > 0) {
    const rid = queue.shift()!;
    if (visited.has(rid)) continue;
    visited.add(rid);
    const room = ROOMS[rid];
    if (!room) continue;
    room.exits.forEach((e) => {
      conns.push([rid, e.roomId]);
      if (!visited.has(e.roomId)) queue.push(e.roomId);
    });
  }

  const roomList = Array.from(visited).map(id => ROOMS[id]).filter(Boolean);
  const cols = Math.min(4, roomList.length);

  const posMap: Record<string, { x: number; y: number }> = {};
  const cellW = 90;
  const cellH = 32;
  roomList.forEach((room, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    posMap[room.id] = { x: col * cellW + cellW / 2, y: row * cellH + cellH / 2 };
  });

  const mapW = cols * cellW;
  const mapH = Math.ceil(roomList.length / cols) * cellH;

  return (
    <div className="panel-body">
      <div className="panel-section">
        <div className="panel-section-title" style={{ color: '#8b772a' }}>◈ {currentRoom.name}</div>

        {/* Visual map with border-to-border connecting lines */}
        <div className="map-visual-wrap">
          <svg width={mapW} height={mapH} style={{ display: 'block' }}>
            {/* Connection lines: border to border */}
            {conns.map(([from, to], i) => {
              const pf = posMap[from];
              const pt = posMap[to];
              if (!pf || !pt) return null;
              const start = edgePoint(pf, pt);
              const end = edgePoint(pt, pf);
              return (
                <line
                  key={i}
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#8b772a"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              );
            })}
            {/* Room nodes */}
            {roomList.map(room => {
              const p = posMap[room.id];
              if (!p) return null;
              const isCurrent = room.id === currentRoomId;
              const isDanger = !room.isSafe && !isCurrent;
              return (
                <g key={room.id}>
                  <rect
                    x={p.x - NODE_W / 2} y={p.y - NODE_H / 2}
                    width={NODE_W} height={NODE_H}
                    rx={3}
                    fill={isCurrent ? 'rgba(139,119,42,0.35)' : 'rgba(20,15,5,0.6)'}
                    stroke={isCurrent ? '#b89a3a' : isDanger ? 'rgba(180,80,0,0.5)' : 'rgba(139,119,42,0.4)'}
                    strokeWidth={isCurrent ? 1.5 : 1}
                    style={isCurrent ? { filter: 'drop-shadow(0 0 4px rgba(139,119,42,0.4))' } : {}}
                  />
                  {isCurrent && (
                    <circle
                      cx={p.x + NODE_W / 2 - 4}
                      cy={p.y - NODE_H / 2 + 4}
                      r={3}
                      fill="#ff0000"
                      style={{ filter: 'drop-shadow(0 0 2px #ff0000)' }}
                    />
                  )}
                  <text
                    x={p.x} y={p.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill={isCurrent ? '#ffffff' : isDanger ? '#b45000' : '#8b772a'}
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                    style={{
                      cursor: isCurrent ? 'default' : 'pointer',
                      textShadow: isCurrent ? '0 0 4px rgba(255,255,255,0.4)' : 'none',
                    }}
                    onClick={() => !isCurrent && !combat.isInCombat && moveToRoom(room.id)}
                  >
                    {room.name.length > 7 ? room.name.slice(0, 7) + '…' : room.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Room list */}
        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '3px' }}>
          {roomList.map(room => {
            const isCurrent = room.id === currentRoomId;
            const isDanger = !room.isSafe && !isCurrent;
            return (
              <button
                key={room.id}
                className={`map-room-btn ${isCurrent ? 'map-room-current' : ''} ${isDanger ? 'map-room-danger' : ''}`}
                disabled={isCurrent || combat.isInCombat}
                onClick={() => !isCurrent && moveToRoom(room.id)}
              >
                <span className="map-room-name">{room.name}</span>
                {isDanger && <span className="map-room-warn">⚠</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
