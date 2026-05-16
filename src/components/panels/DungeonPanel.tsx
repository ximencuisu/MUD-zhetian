import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DUNGEONS } from '../../data/dungeons';
import { DUNGEON_ITEMS } from '../../data/dungeonItems';
import type { Dungeon, BossMechanic } from '../../types/game';
import './Panel.css';
import './DungeonPanel.css';

// ── Helpers ──

const RATING_COLORS: Record<string, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
  diamond: '#b9f2ff',
};
const RATING_LABELS: Record<string, string> = {
  bronze: '铜',
  silver: '银',
  gold: '金',
  platinum: '铂金',
  diamond: '钻石',
};

function roomIcon(room: { isEntrance?: boolean; isBoss?: boolean; isElite?: boolean; dangerLevel: number; npcTemplates: string[]; deadNpcs?: string[] }): { icon: string; color: string; label: string } {
  if (room.isEntrance) return { icon: '🚪', color: '#4488ff', label: '入口' };
  if (room.isBoss) return { icon: '💀', color: '#ff2222', label: 'Boss' };
  if (room.isElite) return { icon: '⚡', color: '#ff6600', label: '精英' };
  if (room.dangerLevel === 0 && room.npcTemplates.length === 0) return { icon: '🏕', color: '#44cc88', label: '休息' };
  if (room.dangerLevel >= 4) return { icon: '⚠', color: '#ff8800', label: '陷阱' };
  if (room.npcTemplates.length === 0) return { icon: '💎', color: '#ffd700', label: '宝箱' };
  return { icon: '⚔', color: '#cc4400', label: '战斗' };
}

// ── Mini-Map Component ──

function DungeonMiniMap({ rooms, currentId, completedRooms }: { rooms: Record<string, any>; currentId: string; completedRooms: Set<string> }) {
  const roomList = Object.values(rooms) as any[];
  if (roomList.length === 0) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const r of roomList) {
    if (r.x < minX) minX = r.x;
    if (r.x > maxX) maxX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.y > maxY) maxY = r.y;
  }
  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;

  const grid: (any | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (const r of roomList) {
    grid[r.y - minY][r.x - minX] = r;
  }

  return (
    <div className="dg-minimap">
      <div className="dg-minimap-title">🗺 地图</div>
      <div className="dg-minimap-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {grid.flatMap((row, y) =>
          row.map((room, x) => {
            if (!room) return <div key={`${y}-${x}`} className="dg-mm-cell dg-mm-empty" />;
            const isCurrent = room.id === currentId;
            const ri = roomIcon(room);
            const done = completedRooms.has(room.id);
            let cls = 'dg-mm-cell';
            if (isCurrent) cls += ' dg-mm-current';
            if (done) cls += ' dg-mm-done';
            if (room.isBoss) cls += ' dg-mm-boss';
            if (room.isElite) cls += ' dg-mm-elite';
            if (room.isEntrance) cls += ' dg-mm-entrance';
            return (
              <div key={`${y}-${x}`} className={cls} title={room.name} style={{ borderColor: ri.color }}>
                <span className="dg-mm-icon">{ri.icon}</span>
              </div>
            );
          })
        )}
      </div>
      <div className="dg-minimap-legend">
        <span><span className="dg-mm-dot dg-mm-dot-entrance" />入口</span>
        <span><span className="dg-mm-dot dg-mm-dot-elite" />精英</span>
        <span><span className="dg-mm-dot dg-mm-dot-boss" />Boss</span>
        <span><span className="dg-mm-dot dg-mm-dot-done" />已完成</span>
        <span><span className="dg-mm-dot dg-mm-dot-current" />当前位置</span>
      </div>
    </div>
  );
}

// ── Boss Mechanics Display ──

function BossMechanicsDisplay({ mechanics }: { mechanics?: BossMechanic[] }) {
  if (!mechanics || mechanics.length === 0) return null;
  return (
    <div className="dg-boss-mechanics">
      <div className="dg-boss-mech-title">👑 Boss 机制</div>
      {mechanics.map((m, i) => (
        <div key={i} className="dg-boss-mech-item">
          <span className="dg-boss-mech-name">{m.name}</span>
          <span className="dg-boss-mech-desc">{m.description}</span>
          {m.phase && <span className="dg-boss-mech-phase">第{m.phase}阶段</span>}
        </div>
      ))}
    </div>
  );
}

// ── Session Stats ──

function DungeonSessionStats({ combat }: { combat: any }) {
  const score = combat.dungeonScore || 0;
  const deaths = combat.dungeonDeaths || 0;
  const steps = combat.dungeonSteps || 0;
  return (
    <div className="dg-session-stats">
      <div className="dg-stat">
        <span className="dg-stat-icon">⚔</span>
        <span className="dg-stat-label">得分</span>
        <span className="dg-stat-value">{score.toLocaleString()}</span>
      </div>
      <div className="dg-stat">
        <span className="dg-stat-icon">💀</span>
        <span className="dg-stat-label">死亡</span>
        <span className="dg-stat-value" style={{ color: deaths > 0 ? '#ff4444' : '#44cc88' }}>{deaths}</span>
      </div>
      <div className="dg-stat">
        <span className="dg-stat-icon">👣</span>
        <span className="dg-stat-label">步数</span>
        <span className="dg-stat-value">{steps}</span>
      </div>
    </div>
  );
}

// ── Rating Badge ──

function RatingBadge({ rating }: { rating: string }) {
  const color = RATING_COLORS[rating] || '#cd7f32';
  const label = RATING_LABELS[rating] || rating;
  return (
    <span className="dg-rating-badge" style={{ color, borderColor: color }}>
      {label}级
    </span>
  );
}

// ── Dungeon Panel ──

export default function DungeonPanel() {
  const combat = useGameStore(s => s.combat);
  const char = useGameStore(s => s.character);
  const enterDungeon = useGameStore(s => s.enterDungeon);
  const exitDungeon = useGameStore(s => s.exitDungeon);
  const solvePuzzle = useGameStore(s => s.solvePuzzle);
  const lootTreasureRoom = useGameStore(s => s.lootTreasureRoom);
  const handleTrapRoom = useGameStore(s => s.handleTrapRoom);
  const restInDungeon = useGameStore(s => s.restInDungeon);
  const completeDungeon = useGameStore(s => s.completeDungeon);
  const sweepDungeon = useGameStore(s => s.sweepDungeon);
  const dungeonCompletion = useGameStore(s => s.dungeonCompletion);
  const dungeonCompletedRooms = useGameStore(s => s.dungeonCompletedRooms);
  const zoneRooms = useGameStore(s => s.zoneRooms);
  const currentGenRoomId = useGameStore(s => s.currentGenRoomId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState<number | null>(null);
  const [showMiniMap, setShowMiniMap] = useState(true);

  const inDungeon = combat.inDungeon && combat.dungeonId;
  const roomList = Object.values(zoneRooms);

  // ── In Dungeon View ──
  if (inDungeon && char) {
    const dungeon = DUNGEONS[combat.dungeonId!];
    const currentRoom = zoneRooms[currentGenRoomId];
    const isRoomDone = currentRoom ? dungeonCompletedRooms.has(currentRoom.id) : false;
    const hpPct = combat.targetMaxHp > 0 ? (combat.targetHp / combat.targetMaxHp) * 100 : 0;
    const totalRooms = roomList.length;
    const completedCount = dungeonCompletedRooms.size;
    const isBossRoom = currentRoom?.isBoss;

    // Determine room type for interaction
    const hasEnemies = currentRoom && currentRoom.npcTemplates.length > 0;
    const isPuzzleRoom = currentRoom && !hasEnemies && !currentRoom.isBoss && !currentRoom.isEntrance && !isRoomDone && currentRoom.dangerLevel === 2;
    const isTreasureRoom = currentRoom && !hasEnemies && !currentRoom.isBoss && !currentRoom.isEntrance && !isRoomDone && currentRoom.dangerLevel <= 1;
    const isTrapRoom = currentRoom && !hasEnemies && !currentRoom.isBoss && !currentRoom.isEntrance && !isRoomDone && currentRoom.dangerLevel >= 3;
    const isRestRoom = currentRoom && !hasEnemies && !currentRoom.isBoss && !currentRoom.isEntrance && !isRoomDone && currentRoom.dangerLevel === 0 && !isPuzzleRoom;

    return (
      <div className="panel-body dg-body">
        {/* Header */}
        <div className="panel-section dg-header" style={{ borderColor: 'rgba(200,50,0,0.5)' }}>
          <div className="dg-header-top">
            <div className="panel-section-title dg-title" style={{ color: '#ff6633' }}>
              ◈ {dungeon?.name}
              {dungeon?.dungeonType === 'secret' && <span className="dg-type-tag dg-type-secret">秘境</span>}
              {dungeon?.dungeonType === 'endless' && <span className="dg-type-tag dg-type-endless">无尽</span>}
            </div>
            <button className="dg-mm-toggle"
              onClick={() => setShowMiniMap(v => !v)}
              title={showMiniMap ? '隐藏地图' : '显示地图'}
            >{showMiniMap ? '🗺' : '🗺'}</button>
          </div>
          <div className="dg-progress-bar">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cc9900', marginBottom: '2px' }}>
              <span>完成度</span>
              <span>{dungeonCompletion}%（{completedCount}/{totalRooms}）</span>
            </div>
            <div className="dg-progress-track">
              <div className="dg-progress-fill" style={{ width: `${dungeonCompletion}%` }} />
            </div>
          </div>
          <DungeonSessionStats combat={combat} />
        </div>

        {/* Mini-Map */}
        {showMiniMap && (
          <div className="panel-section dg-map-section">
            <DungeonMiniMap rooms={zoneRooms} currentId={currentGenRoomId} completedRooms={dungeonCompletedRooms} />
          </div>
        )}

        {/* Current Room */}
        {currentRoom && (
          <div className={`panel-section dg-room-section ${currentRoom.isElite ? 'dg-room-elite' : ''} ${isBossRoom ? 'dg-room-boss' : ''}`}>
            <div className={`dg-room-header ${currentRoom.isElite ? 'dg-room-elite-header' : ''} ${isBossRoom ? 'dg-room-boss-header' : ''}`}>
              <span className="dg-room-icon">{roomIcon(currentRoom).icon}</span>
              <span className="dg-room-name">{currentRoom.name}</span>
              {currentRoom.isElite && <span className="dg-elite-tag">精英</span>}
              {isBossRoom && <span className="dg-boss-tag">Boss</span>}
              {isRoomDone && <span className="dg-done-tag">✓ 完成</span>}
            </div>
            <div className="dg-room-desc">{currentRoom.description}</div>

            {/* Boss Mechanics */}
            {isBossRoom && dungeon?.bossMechanics && <BossMechanicsDisplay mechanics={dungeon.bossMechanics} />}

            {/* Combat info */}
            {combat.isInCombat && (
              <div className="dg-combat-info">
                <div className="dg-enemy-name">{combat.targetName}</div>
                <div className="dg-combat-hp-track"><div className="dg-combat-hp-fill" style={{ width: `${hpPct}%` }} /></div>
                <div className="dg-combat-hp-text">{combat.targetHp} / {combat.targetMaxHp}</div>
              </div>
            )}

            {/* Room interactions */}
            {!combat.isInCombat && !isRoomDone && dungeon && (
              <div className="dg-room-actions">
                {/* Puzzle */}
                {isPuzzleRoom && dungeon.puzzlePool.length > 0 && (
                  <div className="dg-puzzle-box">
                    <div className="dg-puzzle-question">{dungeon.puzzlePool[0].question}</div>
                    {dungeon.puzzlePool[0].options.map((opt, i) => (
                      <button key={i} className="dg-puzzle-opt"
                        style={{
                          borderColor: puzzleAnswer === i ? '#ffd700' : '#554422',
                          background: puzzleAnswer === i ? 'rgba(255,215,0,0.15)' : undefined
                        }}
                        onClick={() => setPuzzleAnswer(i)}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                    <button className="dg-puzzle-submit"
                      disabled={puzzleAnswer === null}
                      onClick={() => { if (puzzleAnswer !== null) { solvePuzzle(puzzleAnswer); setPuzzleAnswer(null); } }}
                    >确认回答</button>
                  </div>
                )}
                {/* Treasure */}
                {isTreasureRoom && (
                  <button className="dg-room-btn dg-btn-treasure"
                    onClick={lootTreasureRoom}>💎 开启宝箱</button>
                )}
                {/* Trap */}
                {isTrapRoom && (
                  <button className="dg-room-btn dg-btn-trap"
                    onClick={handleTrapRoom}>⚠ 小心通过</button>
                )}
                {/* Rest */}
                {isRestRoom && (
                  <button className="dg-room-btn dg-btn-rest"
                    onClick={restInDungeon}>🏕 休息恢复</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="panel-section dg-actions">
          <div className="dg-action-btns">
            {isBossRoom && isRoomDone && (
              <button className="dg-btn-complete"
                onClick={completeDungeon}>★ 完成副本</button>
            )}
            <button className="dg-btn-exit"
              onClick={exitDungeon}>撤退离开</button>
          </div>
          <div className="dg-hint">方向键移动 | 击败敌人自动完成房间</div>
        </div>
      </div>
    );
  }

  // ── Dungeon List View ──
  const inventorySet = new Set(char?.inventory || []);

  return (
    <div className="panel-body dg-list-body">
      <div className="panel-section">
        <div className="dg-list-intro">
          副本是磨砺自身的绝佳之地。进入后在地图中探索，击败BOSS即可通关。<br/>
          通关后可快速扫荡获取收益，并解锁下一个副本。
        </div>
      </div>

      {/* Secret dungeon entrance prompt */}

      {Object.values(DUNGEONS).map(dungeon => {
        const isSelected = selectedId === dungeon.id;
        const canEnter = char ? char.realmLevel >= dungeon.levelMin : false;
        const progress = char?.dungeonProgress[dungeon.id];
        const isCleared = progress?.cleared ?? false;
        const isLocked = !!(dungeon.prerequisite && !(char?.dungeonProgress[dungeon.prerequisite]?.cleared));

        // Check if player has entry token for secret dungeons
        const entryToken = dungeon.dungeonType === 'secret' ? DUNGEON_ITEMS[`${dungeon.id}_token`] : null;
        const hasToken = entryToken ? inventorySet.has(entryToken.id) : true;

        return (
          <div key={dungeon.id}
            className={`dg-card ${isSelected ? 'dg-card-selected' : ''} ${isLocked ? 'dg-card-locked' : ''} ${dungeon.dungeonType === 'secret' ? 'dg-card-secret' : ''}`}
            onClick={() => !isLocked && setSelectedId(isSelected ? null : dungeon.id)}
          >
            <div className="dg-card-header">
              <div className="dg-card-name">
                {isLocked ? '🔒 ' : isCleared ? '✓ ' : ''}{dungeon.name}
                {dungeon.dungeonType === 'secret' && <span className="dg-type-tag dg-type-secret">秘境</span>}
                {dungeon.dungeonType === 'endless' && <span className="dg-type-tag dg-type-endless">无尽</span>}
              </div>
              <div className="dg-card-stats">
                {isCleared && (
                  <>
                    {progress?.bestRating && <RatingBadge rating={progress.bestRating} />}
                    <span className="dg-run-count">{progress.totalRuns}次通关</span>
                  </>
                )}
              </div>
            </div>
            <div className="dg-card-meta">
              Lv.{dungeon.levelMin}-{dungeon.levelMax} ｜ {dungeon.roomCount}房间 ｜ BOSS：{dungeon.bossName}
              {dungeon.eliteChance ? ` ｜ 精英率${Math.round(dungeon.eliteChance * 100)}%` : ''}
            </div>
            {isSelected && !isLocked && (
              <div className="dg-card-body">
                <div className="dg-card-desc">{dungeon.description}</div>

                {/* Boss Mechanics Preview */}
                {dungeon.bossMechanics && dungeon.bossMechanics.length > 0 && (
                  <div className="dg-card-boss-preview">
                    <div className="dg-card-boss-title">👑 Boss 机制预览</div>
                    {dungeon.bossMechanics.map((m, i) => (
                      <div key={i} className="dg-card-boss-item">
                        <span className="dg-card-boss-name">{m.name}</span>
                        <span className="dg-card-boss-desc">{m.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rewards */}
                <div className="dg-card-rewards">
                  <span className="dg-reward-exp">⚡ {dungeon.rewards.exp}修为</span>
                  <span className="dg-reward-gold">💰 {dungeon.rewards.gold}金叶</span>
                </div>
                {isCleared && (
                  <div className="dg-card-sweep">
                    扫荡收益：⚡{dungeon.sweepRewards.exp}修为 / 💰{dungeon.sweepRewards.gold}金叶
                  </div>
                )}

                {/* Entry token requirement */}
                {entryToken && !hasToken && (
                  <div className="dg-card-token-warn">
                    需要「{entryToken.name}」方可进入（背包中没有此物品）
                  </div>
                )}

                <div className="dg-card-btns">
                  {canEnter && hasToken && (
                    <button className="dg-card-btn dg-btn-enter"
                      onClick={e => { e.stopPropagation(); enterDungeon(dungeon.id); }}
                    >进入副本</button>
                  )}
                  {canEnter && isCleared && (
                    <>
                      <button className="dg-card-btn dg-btn-sweep"
                        onClick={e => { e.stopPropagation(); sweepDungeon(dungeon.id, 1); }}
                      >扫荡×1</button>
                      <button className="dg-card-btn dg-btn-sweep-all"
                        onClick={e => { e.stopPropagation(); sweepDungeon(dungeon.id, 10); }}
                      >扫荡×10</button>
                    </>
                  )}
                  {!canEnter && !isLocked && (
                    <div className="dg-card-lvl-req">等级不足（需要 Lv.{dungeon.levelMin}）</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
