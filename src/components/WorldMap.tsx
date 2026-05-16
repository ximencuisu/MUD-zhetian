import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ZONE_TEMPLATES, WORLD_CONNECTIONS, ZoneTemplate } from '../data/mapGen';
import './WorldMap.css';

const W = 400, H = 320;

export default function WorldMap() {
  const enterZoneById = useGameStore(s => s.enterZoneById);
  const currentZoneId = useGameStore(s => s.currentZoneId);
  const realmLevel = useGameStore(s => s.character.realmLevel);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<ZoneTemplate | null>(null);

  const getPos = (t: ZoneTemplate) => ({
    cx: (t.worldX / 100) * W,
    cy: (t.worldY / 100) * H,
  });

  const dangerColor = (d: number) => {
    const colors = ['', '#226622', '#226622', '#884400', '#aa2200', '#cc0000'];
    return colors[d] || '#333';
  };

  // Minimum danger*8 = approx realm level needed
  const canEnter = (t: ZoneTemplate) => realmLevel >= (t.dangerBase - 1) * 8;

  return (
    <div className="world-map-wrap">
      <div className="world-map-title">◈ 东荒大地图</div>

      <div className="world-map-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
          {/* Connections */}
          {WORLD_CONNECTIONS.map(([a, b]) => {
            const pa = getPos(ZONE_TEMPLATES.find(t => t.id === a)!);
            const pb = getPos(ZONE_TEMPLATES.find(t => t.id === b)!);
            return (
              <line key={a + b}
                x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy}
                stroke="rgba(80,50,0,0.4)" strokeWidth="1" strokeDasharray="4 3"
              />
            );
          })}

          {/* Zone nodes */}
          {ZONE_TEMPLATES.map(t => {
            const { cx, cy } = getPos(t);
            const isActive = t.id === currentZoneId;
            const isHov = hovered === t.id;
            const accessible = canEnter(t);
            const r = isActive ? 9 : isHov ? 8 : 6;

            return (
              <g key={t.id}
                style={{ cursor: accessible ? 'pointer' : 'not-allowed' }}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => accessible && setSelected(t)}
              >
                {isActive && (
                  <circle cx={cx} cy={cy} r={15} fill="none"
                    stroke="#ffd700" strokeWidth="1" opacity="0.4"
                    style={{ animation: 'pulse 2s infinite' }}
                  />
                )}
                <circle cx={cx} cy={cy} r={r}
                  fill={isActive ? '#ffd700' : accessible ? t.color : '#1a1a1a'}
                  stroke={isHov ? '#ffd700' : accessible ? dangerColor(t.dangerBase) : '#222'}
                  strokeWidth={isHov ? 2 : 1}
                  opacity={accessible ? 1 : 0.4}
                />
                <text x={cx} y={cy - r - 3} textAnchor="middle" fontSize="9"
                  fill={isActive ? '#ffd700' : accessible ? '#886622' : '#333'}
                >
                  {t.displayName}
                </text>
                <text x={cx} y={cy + r + 9} textAnchor="middle" fontSize="7"
                  fill={dangerColor(t.dangerBase)}
                >
                  {'★'.repeat(t.dangerBase)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="world-map-legend">
        <span style={{ color: '#ffd700' }}>● 当前位置</span>
        <span>危险等级：</span>
        <span style={{ color: '#226622' }}>★ 新手</span>
        <span style={{ color: '#884400' }}>★★★ 险峻</span>
        <span style={{ color: '#cc0000' }}>★★★★★ 禁区</span>
      </div>

      {/* Zone info popup */}
      {selected && (
        <div className="world-map-popup">
          <div className="wmp-name">{selected.displayName}</div>
          <div className="wmp-danger">危险等级：{'★'.repeat(selected.dangerBase)}</div>
          <div className="wmp-desc">{selected.description}</div>
          <div className="wmp-rooms">房间数：约 {selected.roomCount} 间</div>
          <div className="wmp-boss">区域首领：{selected.bossName}</div>
          <div className="wmp-btns">
            <button
              className="wmp-enter-btn"
              disabled={!canEnter(selected)}
              onClick={() => { enterZoneById(selected.id); setSelected(null); }}
            >
              {canEnter(selected) ? '进入此地' : `境界不足（需 Lv.${(selected.dangerBase - 1) * 8}）`}
            </button>
            <button className="wmp-close-btn" onClick={() => setSelected(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}
