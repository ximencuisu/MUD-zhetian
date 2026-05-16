// Procedural map generator — creates a connected room graph for a zone.
// Each zone has 10-40 rooms arranged in a rough grid with random connectivity.

export interface GenRoom {
  id: string;
  name: string;
  description: string;
  x: number; // grid col
  y: number; // grid row
  exits: { dir: string; toId: string; label: string }[];
  npcTemplates: string[]; // npc type tags to spawn
  isEntrance?: boolean;
  isBoss?: boolean;
  isElite?: boolean;
  dangerLevel: number; // 1-5
  // 怪物追踪：已死亡的怪物
  deadNpcs?: string[];
  // 尸体：显示在房间中的尸体
  corpses?: { name: string; looted: boolean }[];
}

export interface GenZone {
  id: string;
  rooms: Record<string, GenRoom>;
  entranceId: string;
  bossRoomId: string;
}

const DIR_OPPOSITE: Record<string, string> = {
  north: 'south', south: 'north', east: 'west', west: 'east',
};
const DIR_LABEL: Record<string, string> = {
  north: '北方', south: '南方', east: '东方', west: '西方',
};
const DIR_DELTA: Record<string, [number, number]> = {
  north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0],
};

export interface ZoneTemplate {
  id: string;
  displayName: string;
  roomCount: number; // target room count
  dangerBase: number; // 1-5 baseline danger
  roomPrefixes: string[]; // for name generation
  roomSuffixes: string[];
  npcTags: string[]; // hostile npc types in this zone
  bossName: string;
  description: string;
  color: string; // for world map node
  worldX: number; // position on world map (0-100)
  worldY: number;
}

// Zone templates — each represents a distinct area in the 遮天 world
export const ZONE_TEMPLATES: ZoneTemplate[] = [
  {
    id: 'east_wild',
    displayName: '东荒·旷野',
    roomCount: 12,
    dangerBase: 1,
    roomPrefixes: ['荒原', '旷野', '草地', '土丘', '溪边', '林缘', '石堆', '古道'],
    roomSuffixes: ['深处', '边缘', '中央', '北段', '南段', '东端', '西端', '荒地', '坡地'],
    npcTags: ['wild_beast', 'bandit'],
    bossName: '荒野巨妖',
    description: '东荒南域最外围的旷野，土地干裂，偶有野兽出没。',
    color: '#554422',
    worldX: 50, worldY: 50,
  },
  {
    id: 'divine_wood',
    displayName: '神木古林',
    roomCount: 20,
    dangerBase: 2,
    roomPrefixes: ['古树', '林间', '树根', '枯枝', '苔藓', '幽径', '暗处', '深林', '神木'],
    roomSuffixes: ['深处', '边缘', '幽谷', '小道', '密林', '古道', '荒径', '林地', '丛中'],
    npcTags: ['forest_beast', 'wood_spirit'],
    bossName: '上古木妖',
    description: '存在了数万年的古林，树木高耸入云，林中积聚大量天地元气。',
    color: '#224422',
    worldX: 25, worldY: 65,
  },
  {
    id: 'source_mine',
    displayName: '源石矿脉',
    roomCount: 18,
    dangerBase: 3,
    roomPrefixes: ['矿道', '矿洞', '矿井', '坑道', '深坑', '矿壁', '暗道', '矿室', '矿层'],
    roomSuffixes: ['入口', '内部', '深处', '底层', '分叉', '主道', '支道', '末端', '节点'],
    npcTags: ['mine_guardian', 'stone_spirit'],
    bossName: '源石矿王',
    description: '蕴含丰富源石的矿脉，开采者众，但深处危机四伏。',
    color: '#334433',
    worldX: 75, worldY: 65,
  },
  {
    id: 'ancient_ruins',
    displayName: '荒古遗迹',
    roomCount: 25,
    dangerBase: 3,
    roomPrefixes: ['废墟', '古殿', '遗址', '断壁', '石台', '祭坛', '古道', '残垣', '秘室'],
    roomSuffixes: ['外围', '内院', '中心', '深处', '侧殿', '正殿', '地下', '遗址', '废地'],
    npcTags: ['ancient_puppet', 'ruin_guardian'],
    bossName: '荒古傀儡王',
    description: '上古时期遗留下的建筑群，残留着强大的禁制和守护者。',
    color: '#443322',
    worldX: 55, worldY: 80,
  },
  {
    id: 'emperor_tomb',
    displayName: '古帝陵',
    roomCount: 30,
    dangerBase: 4,
    roomPrefixes: ['陵道', '墓室', '棺椁', '石像', '甬道', '墓廊', '祭室', '深陵', '古冢'],
    roomSuffixes: ['入口', '前室', '中室', '后室', '侧室', '密道', '禁地', '核心', '底部'],
    npcTags: ['undead_soldier', 'tomb_guardian', 'ancient_undead'],
    bossName: '陵中帝影',
    description: '古代帝王的长眠之地，禁制层层，埋藏着难以想象的宝藏与危险。',
    color: '#332211',
    worldX: 40, worldY: 88,
  },
  {
    id: 'taixuan_sect',
    displayName: '太玄门',
    roomCount: 15,
    dangerBase: 2,
    roomPrefixes: ['山门', '广场', '殿堂', '长廊', '修炼', '内院', '外院', '演武', '藏经'],
    roomSuffixes: ['外围', '入口', '大殿', '侧殿', '场地', '院落', '阁楼', '台地', '禁地'],
    npcTags: ['sect_disciple', 'sect_elder'],
    bossName: '太玄掌教',
    description: '东荒传承数千年的门派，修炼九秘之"行"字秘，底蕴深厚。',
    color: '#224433',
    worldX: 20, worldY: 20,
  },
  {
    id: 'yaoguan_holy',
    displayName: '摇光圣地',
    roomCount: 22,
    dangerBase: 4,
    roomPrefixes: ['圣地', '圣殿', '禁地', '内院', '外围', '广场', '秘境', '圣峰', '灵地'],
    roomSuffixes: ['外围', '山道', '大门', '内殿', '禁区', '核心', '圣山', '秘地', '顶峰'],
    npcTags: ['holy_guardian', 'sect_disciple', 'sect_elder'],
    bossName: '摇光圣主',
    description: '传承自摇光大帝的圣地，拥有龙纹黑金鼎等帝兵，实力深不可测。',
    color: '#443311',
    worldX: 85, worldY: 20,
  },
  {
    id: 'taichu_mine',
    displayName: '太初古矿',
    roomCount: 35,
    dangerBase: 5,
    roomPrefixes: ['禁区', '古矿', '深处', '黑暗', '幽深', '矿道', '古道', '禁地', '秘境'],
    roomSuffixes: ['外围', '浅层', '中层', '深层', '底部', '核心', '禁地', '秘室', '尽头'],
    npcTags: ['ancient_beast', 'mine_horror', 'forbidden_guardian'],
    bossName: '太初矿主',
    description: '北斗七大禁区之一，自古以来无人能探明深处，传说有远古生命沉睡于此。',
    color: '#331100',
    worldX: 90, worldY: 58,
  },
];

// World map connections between zones
export const WORLD_CONNECTIONS: [string, string][] = [
  ['east_wild', 'divine_wood'],
  ['east_wild', 'source_mine'],
  ['east_wild', 'taixuan_sect'],
  ['east_wild', 'ancient_ruins'],
  ['divine_wood', 'ancient_ruins'],
  ['source_mine', 'ancient_ruins'],
  ['source_mine', 'taichu_mine'],
  ['ancient_ruins', 'emperor_tomb'],
  ['east_wild', 'yaoguan_holy'],
  ['taixuan_sect', 'divine_wood'],
];

// ── Room name generation ──

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genRoomName(template: ZoneTemplate, _x: number, _y: number, isEntrance: boolean, isBoss: boolean): string {
  if (isEntrance) return `${template.displayName}·入口`;
  if (isBoss) return `${template.displayName}·深处`;
  return `${pickRandom(template.roomPrefixes)}·${pickRandom(template.roomSuffixes)}`;
}

function genRoomDesc(template: ZoneTemplate, dangerLevel: number, isBoss: boolean): string {
  if (isBoss) return `${template.description} 此处气息格外凝重，强大的存在就在附近。`;
  const dangTexts = ['', '偶有野兽出没，', '危机潜伏，', '危险程度极高，', '极度危险，'];
  return `${template.displayName}的一处区域。${dangTexts[dangerLevel] || ''}四周弥漫着天地元气。`;
}

// ── Core generator ──

export function generateZone(template: ZoneTemplate, seed?: number): GenZone {
  const rng = mulberry32(seed ?? Math.floor(Math.random() * 0xffffffff));
  const rand = () => rng();
  const randPick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const cols = Math.ceil(Math.sqrt(template.roomCount * 1.5));
  const rows = Math.ceil(template.roomCount / cols);

  // Place rooms on grid with ~70% fill
  const grid: (GenRoom | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const rooms: Record<string, GenRoom> = {};

  // Always place entrance at top-left area and boss at bottom-right area
  const entranceX = 0, entranceY = 0;
  const bossX = cols - 1, bossY = rows - 1;

  let placed = 0;
  const positions: [number, number][] = [];

  // BFS from entrance to ensure connectivity
  const toPlace = new Set<string>();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      toPlace.add(`${x},${y}`);
    }
  }

  // Force entrance + boss
  toPlace.delete(`${entranceX},${entranceY}`);
  toPlace.delete(`${bossX},${bossY}`);
  positions.push([entranceX, entranceY], [bossX, bossY]);
  placed += 2;

  // Fill remaining up to roomCount
  const remaining = Array.from(toPlace).sort(() => rand() - 0.5);
  for (const pos of remaining) {
    if (placed >= template.roomCount) break;
    const [x, y] = pos.split(',').map(Number);
    positions.push([x, y]);
    placed++;
  }

  // Create room objects
  for (const [x, y] of positions) {
    const isEntrance = x === entranceX && y === entranceY;
    const isBoss = x === bossX && y === bossY;
    const id = `${template.id}_${x}_${y}`;
    const dangerLevel = Math.min(5, template.dangerBase + Math.floor((x + y) / (cols + rows) * 2));
    grid[y][x] = {
      id,
      name: genRoomName(template, x, y, isEntrance, isBoss),
      description: genRoomDesc(template, dangerLevel, isBoss),
      x, y,
      exits: [],
      npcTemplates: isBoss ? [template.bossName] : (rand() < 0.6 ? [randPick(template.npcTags)] : []),
      isEntrance,
      isBoss,
      dangerLevel,
    };
    rooms[id] = grid[y][x]!;
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
        room.exits.push({ dir, toId: neighbor.id, label: `${DIR_LABEL[dir]}·${neighbor.name}` });
      }
      if (!neighbor.exits.find(e => e.dir === DIR_OPPOSITE[dir])) {
        neighbor.exits.push({ dir: DIR_OPPOSITE[dir], toId: room.id, label: `${DIR_LABEL[DIR_OPPOSITE[dir]]}·${room.name}` });
      }
    }
  }

  const entranceId = `${template.id}_${entranceX}_${entranceY}`;
  const bossRoomId = `${template.id}_${bossX}_${bossY}`;

  return { id: template.id, rooms, entranceId, bossRoomId };
}

// Seeded PRNG (Mulberry32) for deterministic zone generation
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
