/**
 * Dungeon map generator — creates a connected grid of rooms for dungeon exploration.
 * Similar to zone map generation but with dungeon-specific room types and events.
 */

import { DungeonGenRoom, DungeonEnemy } from '../types/game';
import type { Dungeon } from '../types/game';

const DIR_OPPOSITE: Record<string, string> = {
  north: 'south', south: 'north', east: 'west', west: 'east',
};
const DIR_LABEL: Record<string, string> = {
  north: '北', south: '南', east: '东', west: '西',
};
const DIR_DELTA: Record<string, [number, number]> = {
  north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0],
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Scale enemy stats by dungeon level
function scaleEnemy(base: DungeonEnemy, levelMin: number, levelMax: number, dangerLevel: number): DungeonEnemy {
  const scale = 1 + (dangerLevel - 1) * 0.3;
  return {
    ...base,
    name: base.name,
    hp: Math.floor(base.hp * scale),
    maxHp: Math.floor(base.maxHp * scale),
    attack: Math.floor(base.attack * scale),
    defense: Math.floor(base.defense * scale),
    expReward: Math.floor(base.expReward * scale),
    goldReward: Math.floor(base.goldReward * scale),
    level: Math.floor(levelMin + (dangerLevel / 5) * (levelMax - levelMin)),
  };
}

export interface DungeonMap {
  id: string;
  rooms: Record<string, DungeonGenRoom>;
  entranceId: string;
  bossRoomId: string;
  totalRooms: number;
  completionPerRoom: number; // % each room contributes
}

export function generateDungeonMap(dungeon: Dungeon, seed?: number): DungeonMap {
  const rng = mulberry32(seed ?? Math.floor(Math.random() * 0xffffffff));
  const rand = () => rng();

  const roomCount = dungeon.roomCount;
  const cols = Math.ceil(Math.sqrt(roomCount * 1.5));
  const rows = Math.ceil(roomCount / cols);

  const grid: (DungeonGenRoom | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const rooms: Record<string, DungeonGenRoom> = {};

  // Place entrance at top-left, boss at bottom-right
  const entranceX = 0, entranceY = 0;
  const bossX = cols - 1, bossY = rows - 1;

  // Collect all positions and shuffle
  const positions: [number, number][] = [[entranceX, entranceY], [bossX, bossY]];
  const usedSet = new Set([`${entranceX},${entranceY}`, `${bossX},${bossY}`]);

  const remaining: [number, number][] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!usedSet.has(`${x},${y}`)) remaining.push([x, y]);
    }
  }
  // Shuffle remaining
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  // Add positions up to roomCount
  for (let i = 0; i < remaining.length && positions.length < roomCount; i++) {
    positions.push(remaining[i]);
  }

  const eliteChance = dungeon.eliteChance ?? 0.15;

  // Assign room types: combat(~40%), elite_combat(~10%), treasure(~15%), puzzle(~12%), rest(~10%), trap(~10%), empty(~3%)
  const typeRoll = (): DungeonGenRoom['type'] => {
    const r = rand();
    if (r < 0.40) {
      // Combat room: chance to be elite variant
      if (rand() < eliteChance) return 'elite_combat';
      return 'combat';
    }
    if (r < 0.55) return 'treasure';
    if (r < 0.67) return 'puzzle';
    if (r < 0.77) return 'rest';
    if (r < 0.87) return 'trap';
    return 'empty';
  };

  // Create room objects
  let puzzleIdx = 0;
  let lootIdx = 0;
  let combatIdx = 0;

  for (const [x, y] of positions) {
    const isEntrance = x === entranceX && y === entranceY;
    const isBoss = x === bossX && y === bossY;
    const id = `dg_${dungeon.id}_${x}_${y}`;
    const dangerLevel = Math.min(5, dungeon.dangerBase + Math.floor((x + y) / (cols + rows) * 2));

    const type: DungeonGenRoom['type'] = isEntrance ? 'entrance' : isBoss ? 'boss' : typeRoll();
    const name = isEntrance ? `${dungeon.name}·入口` : isBoss ? `${dungeon.name}·深处` :
      `${pickRandom(dungeon.roomPrefixes, rand)}·${pickRandom(dungeon.roomSuffixes, rand)}`;
    const desc = isEntrance ? `你踏入了【${dungeon.name}】的入口，四周弥漫着危险的气息。` :
      isBoss ? `${dungeon.description} 此处气息格外凝重，强大的存在就在附近！` :
      generateDesc(type, dangerLevel, dungeon);

    const room: DungeonGenRoom = {
      id, name, description: desc, x, y,
      exits: [],
      type,
      isEntrance,
      isBoss,
      dangerLevel,
      deadNpcs: [],
      corpses: [],
    };

    // Populate room content based on type
    if (type === 'combat') {
      const npcTag = dungeon.combatNpcTags[combatIdx % dungeon.combatNpcTags.length];
      combatIdx++;
      const baseEnemy: DungeonEnemy = {
        name: npcTag,
        hp: 80 + dangerLevel * 60 + combatIdx * 10,
        maxHp: 80 + dangerLevel * 60 + combatIdx * 10,
        attack: 15 + dangerLevel * 12 + combatIdx * 3,
        defense: 10 + dangerLevel * 10 + combatIdx * 2,
        expReward: 20 + dangerLevel * 25 + combatIdx * 5,
        goldReward: 5 + dangerLevel * 8 + combatIdx * 2,
        drops: dangerLevel >= 3 ? ['source_crystal', 'scripture_shard_common'] : ['source_stone', 'source_crystal'],
      };
      room.enemies = [scaleEnemy(baseEnemy, dungeon.levelMin, dungeon.levelMax, dangerLevel)];
    } else if (type === 'elite_combat') {
      const npcTag = (dungeon.eliteNpcTags || dungeon.combatNpcTags)[combatIdx % (dungeon.eliteNpcTags || dungeon.combatNpcTags).length];
      combatIdx++;
      room.isElite = true;
      room.dangerLevel = Math.min(5, room.dangerLevel + 1);
      const baseEnemy: DungeonEnemy = {
        name: `精英·${npcTag}`,
        hp: 200 + room.dangerLevel * 100 + combatIdx * 20,
        maxHp: 200 + room.dangerLevel * 100 + combatIdx * 20,
        attack: 30 + room.dangerLevel * 20 + combatIdx * 5,
        defense: 20 + room.dangerLevel * 15 + combatIdx * 3,
        expReward: 80 + room.dangerLevel * 50 + combatIdx * 10,
        goldReward: 20 + room.dangerLevel * 15 + combatIdx * 5,
        drops: ['source_crystal', 'source_crystal', 'scripture_shard_fine'],
      };
      room.enemies = [scaleEnemy(baseEnemy, dungeon.levelMin, dungeon.levelMax, room.dangerLevel)];
      room.lootItems = ['scripture_shard_fine', 'source_crystal'];
      room.lootGold = 50 + room.dangerLevel * 20;
    } else if (type === 'boss') {
      room.enemies = [dungeon.bossEnemy];
    } else if (type === 'puzzle') {
      room.puzzle = dungeon.puzzlePool[puzzleIdx % dungeon.puzzlePool.length];
      puzzleIdx++;
    } else if (type === 'treasure') {
      const loot = dungeon.lootPool[lootIdx % dungeon.lootPool.length];
      lootIdx++;
      room.lootItems = [...loot.items];
      room.lootGold = loot.gold;
    }

    rooms[id] = room;
    grid[y][x] = room;
  }

  // Connect adjacent rooms
  for (const room of Object.values(rooms)) {
    for (const [dir, [dx, dy]] of Object.entries(DIR_DELTA)) {
      const nx = room.x + dx;
      const ny = room.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const neighbor = grid[ny]?.[nx];
      if (!neighbor) continue;
      if (!room.exits.find(e => e.dir === dir)) {
        room.exits.push({ dir, toId: neighbor.id, label: `${DIR_LABEL[dir]}→${neighbor.name}` });
      }
      if (!neighbor.exits.find(e => e.dir === DIR_OPPOSITE[dir])) {
        neighbor.exits.push({ dir: DIR_OPPOSITE[dir], toId: room.id, label: `${DIR_LABEL[DIR_OPPOSITE[dir]]}→${room.name}` });
      }
    }
  }

  const entranceId = `dg_${dungeon.id}_${entranceX}_${entranceY}`;
  const bossRoomId = `dg_${dungeon.id}_${bossX}_${bossY}`;
  const totalRooms = positions.length;
  const completionPerRoom = Math.floor(100 / totalRooms);

  return { id: dungeon.id, rooms, entranceId, bossRoomId, totalRooms, completionPerRoom };
}

function generateDesc(type: DungeonGenRoom['type'], dangerLevel: number, dungeon: Dungeon): string {
  const dangerTexts = ['', '偶有敌踪，', '危机潜伏，', '危险程度极高，', '极度危险，'];
  const dangerStr = dangerTexts[dangerLevel] || '';

  switch (type) {
    case 'combat': return `${dungeon.name}的一处区域。${dangerStr}敌人就在附近！`;
    case 'treasure': return `此处似乎藏有宝物，空气中弥漫着淡淡的源力气息。`;
    case 'puzzle': return `前方有一道封印，需要解开谜题才能通过。`;
    case 'rest': return `此处相对安全，可以稍作休息恢复精力。`;
    case 'trap': return `地面和墙壁上布满了危险的陷阱，需要小心通过！`;
    case 'empty': return `${dungeon.name}的一条通道，没有特别的事物。`;
    default: return `${dungeon.name}的一处区域。`;
  }
}
