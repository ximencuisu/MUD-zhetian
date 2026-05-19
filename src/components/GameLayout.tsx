import { useState, useEffect, lazy, Suspense } from 'react';
import { useGameStore } from '../store/gameStore';
import { ROOMS, NPCS, ITEMS } from '../data/world';
import { ZONE_NPCS } from '../data/zones';
import { SECT_NPC_MAP } from '../data/sectNpcs';
import { ALL_FUNCTION_NPCS } from '../data/sectFunctionNpcs';
import { ALL_SECT_ROOMS } from '../data/sectMaps';
import { REALM_NAMES } from '../types/game';
import FloatingWindow from './FloatingWindow';
import OverlayDialog from './OverlayDialog';
import StatusBar from './StatusBar';
import MessageLog from './MessageLog';
import InputBar from './InputBar';
import SkillBar from './SkillBar';
import EntityPanel from './EntityPanel';
import './GameLayout.css';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Lazy load panels for code splitting
const CharacterPanel = lazy(() => import('./panels/CharacterPanel'));
const SkillsPanel = lazy(() => import('./panels/SkillsPanel'));
const BagPanel = lazy(() => import('./panels/BagPanel'));
const TasksPanel = lazy(() => import('./panels/TasksPanel'));
const SocialPanel = lazy(() => import('./panels/SocialPanel'));
const RankingsPanel = lazy(() => import('./panels/RankingsPanel'));
const MapPanel = lazy(() => import('./panels/MapPanel'));
const SectPanel = lazy(() => import('./panels/SectPanel'));
const DungeonPanel = lazy(() => import('./panels/DungeonPanel'));
const CultivationPanel = lazy(() => import('./panels/CultivationPanel'));
const ShopPanel = lazy(() => import('./panels/ShopPanel'));
const GuildPanel = lazy(() => import('./panels/GuildPanel'));
const AlchemyPanel = lazy(() => import('./panels/AlchemyPanel'));

const exitNames: Record<string, string> = { north: '北', south: '南', east: '东', west: '西', up: '上', down: '下' };
const exitKeys = ['north', 'south', 'east', 'west', 'up', 'down'];

// Compass grid positions: [row, col] for a 3x3 grid
const COMPASS_POS: Record<string, [number, number]> = {
  northwest: [0, 0], north: [0, 1], northeast: [0, 2],
  west:      [1, 0],                   east:      [1, 2],
  southwest: [2, 0], south: [2, 1], southeast: [2, 2],
};

const WINDOW_DEFS: Record<string, { title: string; width?: number }> = {
  attributes: { title: '\u25C8 \u5C5E\u6027', width: 400 },
  skills:     { title: '\u26A1 \u6280\u80FD', width: 480 },
  bag:        { title: '\u25FB \u80CC\u5305', width: 520 },
  tasks:      { title: '\u25CE \u4EFB\u52A1', width: 440 },
  social:     { title: '\u2630 \u793E\u4EA4', width: 380 },
  rankings:   { title: '\u2605 \u6392\u884C', width: 400 },
  map:        { title: '\u25C9 \u5730\u56FE', width: 480 },
  sect:       { title: '\u2726 \u95E8\u6D3E', width: 460 },
  dungeon:    { title: '\u2694 \u526F\u672C', width: 500 },
  combat:     { title: '\u2694 \u6218\u6597', width: 420 },
  cultivation:{ title: '\u262F \u4FEE\u70BC', width: 440 },
  shop:       { title: '\uD83C\uDFEA \u795E\u836F\u9601', width: 460 },
  guild:      { title: '\uD83C\uDFF0 \u5E2E\u6D3E', width: 420 },
  alchemy:    { title: '\u2697 \u70BC\u4E39', width: 500 },
};

const PanelSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>加载中...</div>}>
    {children}
  </Suspense>
);

const panelMap: Record<string, React.ReactNode> = {
  character: <PanelSuspense><CharacterPanel /></PanelSuspense>,
  attributes: <PanelSuspense><CharacterPanel /></PanelSuspense>,
  stats: <PanelSuspense><CharacterPanel /></PanelSuspense>,
  skills: <PanelSuspense><SkillsPanel /></PanelSuspense>,
  bag: <PanelSuspense><BagPanel /></PanelSuspense>,
  tasks: <PanelSuspense><TasksPanel /></PanelSuspense>,
  social: <PanelSuspense><SocialPanel /></PanelSuspense>,
  rankings: <PanelSuspense><RankingsPanel /></PanelSuspense>,
  map: <PanelSuspense><MapPanel /></PanelSuspense>,
  sect: <PanelSuspense><SectPanel /></PanelSuspense>,
  dungeon: <PanelSuspense><DungeonPanel /></PanelSuspense>,
  cultivation: <PanelSuspense><CultivationPanel /></PanelSuspense>,
  shop: <PanelSuspense><ShopPanel /></PanelSuspense>,
  guild: <PanelSuspense><GuildPanel /></PanelSuspense>,
  alchemy: <PanelSuspense><AlchemyPanel /></PanelSuspense>,
  combat: <PanelSuspense><CharacterPanel /></PanelSuspense>,
};

const getZoneName = (roomId: string): string => {
  if (roomId.startsWith('guiyuan_')) return '归元村';
  if (roomId.startsWith('taixuan_')) return '太玄门';
  if (roomId.startsWith('shenmu_')) return '神木林';
  if (roomId.startsWith('yuanshi_')) return '源石矿';
  if (roomId.startsWith('central_city_')) return '中州神城';
  if (roomId.startsWith('demon_beast_')) return '天妖山脉';
  if (roomId.startsWith('emperor_')) return '古皇战场';
  if (roomId.startsWith('smz_')) return '源石矿·禁区';
  if (roomId.startsWith('edz_')) return '荒古帝陵';
  if (roomId.startsWith('yaoguan_')) return '摇光圣地';
  if (roomId.startsWith('ji_')) return '姬家祖地';
  return '未知区域';
};

export default function GameLayout() {
  const s = useGameStore();
  const { character, combat, openWindows, cultivationMode } = s;

  useKeyboardShortcuts(() => setShowSetting(prev => !prev));

  // Timer: cultivation tick every 1s (use getState to avoid dependency churn)
  useEffect(() => {
    const timer = setInterval(() => useGameStore.getState().tickCultivation(), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer: auto-combat tick every 2s (use getState to avoid dependency churn)
  useEffect(() => {
    if (!combat.autoCombat || !combat.isInCombat) return;
    const timer = setInterval(() => useGameStore.getState().tickCombat(), 2000);
    return () => clearInterval(timer);
  }, [combat.autoCombat, combat.isInCombat]);

  const [showStats, setShowStats] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  // Merge room data
  const ALL_ROOMS = { ...ROOMS, ...ALL_SECT_ROOMS };
  const fnNpcMap = Object.fromEntries(ALL_FUNCTION_NPCS.map(n => [n.id, n]));
  const ALL_NPCS = { ...NPCS, ...ZONE_NPCS, ...SECT_NPC_MAP, ...fnNpcMap };
  const curRoom = ALL_ROOMS[character.currentRoomId];
  const roomNpcIds: string[] = curRoom?.npcs || [];
  const roomItemIds: string[] = curRoom?.items || [];
  const exits = curRoom?.exits || [];
  const visibleExits = exitKeys.filter(d => exits.some(e => e.direction === d));

  // Build compass grid: which exits exist at each compass position
  const compassGrid: Record<string, { exists: boolean; dir: string }> = {};
  for (const d of visibleExits) {
    const pos = COMPASS_POS[d];
    if (pos) {
      compassGrid[`${pos[0]}-${pos[1]}`] = { exists: true, dir: d };
    }
  }

  const getNpcInfo = (nid: string) => {
    const npc = ALL_NPCS[nid];
    if (!npc) return null;
    const isHostile = ('isHostile' in npc && npc.isHostile) || false;
    const name = 'name' in npc ? (npc as any).name : '';
    return { id: nid, name, isHostile };
  };

  return (
    <div className="game-layout">
      {/* Main Content */}
      <div className="game-main">
        {/* Room Info Bar */}
        <div className="room-bar">
          {curRoom ? (
            <>
              {curRoom.description && (
                <div className="room-bar-desc">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="room-title-full" style={{ color: '#ffaa00', fontWeight: 'bold' }}>
                      【{getZoneName(character.currentRoomId)}-{curRoom?.name}】
                    </span>
                    <span className="room-map-toggle" onClick={() => s.toggleWindow('map')} style={{ cursor: 'pointer', fontSize: '16px' }} title="区域地图">
                      🗺️
                    </span>
                  </div>
                  {curRoom.description}
                </div>
              )}

              {/* Compass exit grid */}
              {visibleExits.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '10px 0' }}>
                  <div className="compass-grid">
                    {/* Row 0: NW, N, NE */}
                    <div className="compass-row">
                      <div className="compass-cell">{renderCompassExit('northwest', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                      <div className="compass-cell compass-cell-ns">{renderCompassExit('north', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                      <div className="compass-cell">{renderCompassExit('northeast', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                    </div>
                    {/* Row 1: W, center, E */}
                    <div className="compass-row">
                      <div className="compass-cell compass-cell-we">{renderCompassExit('west', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                      <div className="compass-cell compass-center">
                        <div className="map-box current">{curRoom?.name}</div>
                      </div>
                      <div className="compass-cell compass-cell-we">{renderCompassExit('east', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                    </div>
                    {/* Row 2: SW, S, SE */}
                    <div className="compass-row">
                      <div className="compass-cell">{renderCompassExit('southwest', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                      <div className="compass-cell compass-cell-ns">{renderCompassExit('south', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                      <div className="compass-cell">{renderCompassExit('southeast', compassGrid, s, ALL_ROOMS, curRoom)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* NPC交互面板 */}
              <EntityPanel />

              {roomItemIds.length > 0 && (
                <div className="room-bar-entities">
                  {roomItemIds.map(iid => {
                    const item = ITEMS?.[iid];
                    return (
                      <a key={iid} className="entity-chip item" onClick={() => s.processCommand(`get ${iid}`)}
                        title="拾取">
                        📦 {item?.name || iid}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="room-bar-loading">连接中...</div>
          )}
        </div>

        {/* Message Log */}
        <MessageLog />
      </div>

      {/* Bottom Bars */}
      <InputBar />
      <SkillBar />

      {/* Combat HUD */}
      {combat.isInCombat && (
        <div className="combat-hud">
          <div className="combat-hud-target">
            <span className="combat-hud-name">⚔ {combat.targetName}</span>
            <div className="combat-hud-hpbar">
              <div
                className="combat-hud-hpfill"
                style={{
                  width: `${combat.targetMaxHp > 0 ? Math.min(100, (combat.targetHp / combat.targetMaxHp) * 100) : 0}%`,
                }}
              />
            </div>
            <span className="combat-hud-hptext">
              {combat.targetHp}/{combat.targetMaxHp}
            </span>
          </div>
          <div className="combat-hud-actions">
            <button className="combat-hud-btn attack" onClick={() => combat.targetNpcId && s.attack(combat.targetNpcId)}>攻击</button>
            <button className="combat-hud-btn" onClick={() => s.setAutoCombat(!combat.autoCombat)}>自动{combat.autoCombat ? '开' : '关'}</button>
            <button className="combat-hud-btn flee" onClick={() => s.flee()}>逃跑</button>
          </div>
        </div>
      )}

      {/* Stats Overlay */}
      {showStats && (
        <OverlayDialog title="属性" onClose={() => setShowStats(false)}>
          <div style={{ lineHeight: '1.8', fontSize: '12px' }}>
            <LabelValue label="名称" value={character.name} color="#00ff41" />
            <LabelValue label="境界" value={(REALM_NAMES as any)[character.realm] || character.realm} color="#ffd700" />
            <LabelValue label="等级" value={character.realmLevel.toString()} color="#00ff41" />
            <LabelValue label="门派" value={character.sect || '无'} color="#00e5ff" />
            <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0', padding: '4px 0' }}>
              <div style={{ color: '#ff6644' }}>HP: {character.hp}/{character.maxHp}</div>
              <div style={{ color: '#4488ff' }}>MP: {character.mp}/{character.maxMp}</div>
              <div style={{ color: '#888' }}>EXP: {character.exp}/{character.expToNext}</div>
              <div style={{ color: '#cc9900' }}>金叶: {character.gold}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '4px 0' }}>
              <div style={{ color: '#c0c0c0', marginBottom: '2px' }}>战斗属性</div>
              <LabelValue label="攻击" value={character.stats?.attack?.toString() || '0'} />
              <LabelValue label="防御" value={character.stats?.defense?.toString() || '0'} />
              <LabelValue label="命中" value={character.stats?.hit?.toString() || '0'} />
              <LabelValue label="闪避" value={character.stats?.dodge?.toString() || '0'} />
              <LabelValue label="暴击" value={(character.stats?.critRate || 0) + '%'} />
            </div>
          </div>
        </OverlayDialog>
      )}

      {/* Settings Overlay */}
      {showSetting && (
        <OverlayDialog title="设置" onClose={() => setShowSetting(false)}>
          <div className="setting">
            <h3>战斗</h3>
            <div className="setting-item">
              <span>自动喝药</span>
              <span className={`switch ${character.autoSettings?.autoPotion ? 'on' : ''}`}
                onClick={() => s.setAutoPotion(!character.autoSettings?.autoPotion)}>
                <span className="switch-button" />
                <span className="switch-text">{character.autoSettings?.autoPotion ? '开' : '关'}</span>
              </span>
            </div>
            <div className="setting-item">
              <span>自动战斗</span>
              <span className={`switch ${combat.autoCombat ? 'on' : ''}`}
                onClick={() => s.setAutoCombat(!combat.autoCombat)}>
                <span className="switch-button" />
                <span className="switch-text">{combat.autoCombat ? '开' : '关'}</span>
              </span>
            </div>
            <h3>帮助</h3>
            <div className="help-item" onClick={() => { s.processCommand('help'); setShowSetting(false); }}>指令帮助</div>
            <div className="help-item" onClick={() => { s.processCommand('save'); setShowSetting(false); }}>手动存档</div>
          </div>
        </OverlayDialog>
      )}

      {/* Floating Windows */}
      {Array.from(openWindows).map(id => (
  <FloatingWindow key={id} id={id} title={WINDOW_DEFS[id]?.title || id} width={WINDOW_DEFS[id]?.width} onClose={() => s.closeWindow(id)}>
    {panelMap[id]}
  </FloatingWindow>
      ))}

      {/* Right-Side Quick Access */}
      <div className="quick-access">
        <button className="qa-btn" onClick={() => setShowSetting(true)}>
          <span className="qa-icon">⚙</span>
          <span className="qa-text">设置</span>
          <span className="qa-shortcut">Z</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('dungeon')}>
          <span className="qa-icon">🏰</span>
          <span className="qa-text">江湖</span>
          <span className="qa-shortcut">D</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('rankings')}>
          <span className="qa-icon">📊</span>
          <span className="qa-text">排行</span>
          <span className="qa-shortcut">R</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('social')}>
          <span className="qa-icon">✉</span>
          <span className="qa-text">社交</span>
          <span className="qa-shortcut">O</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('guild')}>
          <span className="qa-icon">🚩</span>
          <span className="qa-text">帮派</span>
          <span className="qa-shortcut">G</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('shop')}>
          <span className="qa-icon">🛒</span>
          <span className="qa-text">商城</span>
          <span className="qa-shortcut">K</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('tasks')}>
          <span className="qa-icon">📋</span>
          <span className="qa-text">任务</span>
          <span className="qa-shortcut">Q</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('skills')}>
          <span className="qa-icon">📖</span>
          <span className="qa-text">技能</span>
          <span className="qa-shortcut">S</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('sect')}>
          <span className="qa-icon">🏯</span>
          <span className="qa-text">门派</span>
          <span className="qa-shortcut">P</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('cultivation')}>
          <span className="qa-icon">☯</span>
          <span className="qa-text">修炼</span>
          <span className="qa-shortcut">X</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('alchemy')}>
          <span className="qa-icon">⚗</span>
          <span className="qa-text">炼丹</span>
          <span className="qa-shortcut">Y</span>
        </button>
        <button className="qa-btn" onClick={() => s.toggleWindow('bag')}>
          <span className="qa-icon">🎒</span>
          <span className="qa-text">背包</span>
          <span className="qa-shortcut">B</span>
        </button>
        <button className="qa-btn" onClick={() => setShowStats(true)}>
          <span className="qa-icon">👤</span>
          <span className="qa-text">属性</span>
          <span className="qa-shortcut">A</span>
        </button>
      </div>
    </div>
  );
}

function renderCompassExit(dir: string, grid: Record<string, { exists: boolean; dir: string }>, s: any, ALL_ROOMS: any, curRoom: any) {
  const key = `${COMPASS_POS[dir][0]}-${COMPASS_POS[dir][1]}`;
  const cell = grid[key];
  if (!cell) return null;
  
  const exit = curRoom?.exits?.find((e: any) => e.direction === dir);
  const targetRoom = exit ? ALL_ROOMS[exit.roomId] : null;
  const roomName = targetRoom ? targetRoom.name : exitNames[dir];
  
  return (
    <a className="compass-exit-btn" onClick={() => s.move(dir)} title={dir}>
      {roomName}
    </a>
  );
}

function LabelValue({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <span style={{ marginRight: '12px' }}>
      <span style={{ color: '#666', width: '3em', display: 'inline-block' }}>{label}</span>
      <span style={{ color: color || '#00ff41' }}>{value}</span>
    </span>
  );
}
