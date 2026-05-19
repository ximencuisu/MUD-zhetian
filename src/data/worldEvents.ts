import { Item } from '../types/game';

// ── 世界事件类型 ──
export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'boss' | 'treasure' | 'invasion' | 'festival' | 'mystery';
  icon: string;
  duration: number; // 持续时间（分钟）
  cooldown: number; // 冷却时间（分钟）
  levelReq: number;
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  boss?: {
    name: string;
    hp: number;
    attack: number;
    defense: number;
    expReward: number;
    goldReward: number;
    drops: string[];
  };
  location: string;
  isActive: boolean;
  startTime?: number;
  endTime?: number;
}

// ── 世界Boss ──
export const WORLD_BOSSES: WorldEvent[] = [
  {
    id: 'world_boss_demon_king',
    name: '妖王降世',
    description: '千年妖王突然出现在东荒旷野，妖气冲天，需要勇士前去讨伐！',
    type: 'boss',
    icon: '👹',
    duration: 30,
    cooldown: 120,
    levelReq: 20,
    rewards: {
      exp: 10000,
      gold: 5000,
      items: ['demon_beast_core', 'dragon_blood', 'scripture_shard_rare'],
    },
    boss: {
      name: '千年妖王·霸天',
      hp: 100000,
      attack: 300,
      defense: 200,
      expReward: 10000,
      goldReward: 5000,
      drops: ['demon_beast_core', 'dragon_blood', 'ancient_scripture_fragment', 'divine_pill'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
  {
    id: 'world_boss_dragon',
    name: '古龙出渊',
    description: '太初古矿深处传来龙吟，上古神龙苏醒，正在向地面飞来！',
    type: 'boss',
    icon: '🐉',
    duration: 45,
    cooldown: 180,
    levelReq: 40,
    rewards: {
      exp: 30000,
      gold: 15000,
      items: ['dragon_blood', 'dragon_blood', 'sacred_golden_sword'],
    },
    boss: {
      name: '上古神龙·烛龙',
      hp: 500000,
      attack: 600,
      defense: 400,
      expReward: 30000,
      goldReward: 15000,
      drops: ['dragon_blood', 'dragon_blood', 'dragon_blood', 'sacred_golden_sword', 'nine_turn_elixir'],
    },
    location: 'taichu_mine_entrance',
    isActive: false,
  },
  {
    id: 'world_boss_emperor_ghost',
    name: '帝魂复苏',
    description: '古皇战场深处传来异响，古帝残念正在复苏，天地变色！',
    type: 'boss',
    icon: '👻',
    duration: 60,
    cooldown: 240,
    levelReq: 50,
    rewards: {
      exp: 50000,
      gold: 25000,
      items: ['emperor_blood', 'ancient_scripture_fragment', 'ghost_emperor_weapon'],
    },
    boss: {
      name: '古帝残念·帝魂',
      hp: 1000000,
      attack: 800,
      defense: 500,
      expReward: 50000,
      goldReward: 25000,
      drops: ['emperor_blood', 'emperor_blood', 'ancient_scripture_fragment', 'ghost_emperor_weapon', 'nine_turn_elixir'],
    },
    location: 'ancient_emperor_battlefield',
    isActive: false,
  },
  {
    id: 'world_boss_ancient_emperor',
    name: '古皇显圣',
    description: '古皇战场核心区域，上古皇者的残躯显化，皇威镇压天地！',
    type: 'boss',
    icon: '👑',
    duration: 60,
    cooldown: 300,
    levelReq: 55,
    rewards: {
      exp: 80000,
      gold: 40000,
      items: ['emperor_blood', 'emperor_blood', 'ancient_scripture_fragment', 'sacred_golden_sword'],
    },
    boss: {
      name: '上古皇者·天帝',
      hp: 1500000,
      attack: 1000,
      defense: 700,
      expReward: 80000,
      goldReward: 40000,
      drops: ['emperor_blood', 'emperor_blood', 'emperor_artifact', 'ancient_scripture_fragment', 'nine_turn_elixir'],
    },
    location: 'ancient_emperor_battlefield',
    isActive: false,
  },
  {
    id: 'world_boss_demon_emperor',
    name: '妖帝降临',
    description: '天妖山脉深处传来远古妖帝的气息，妖帝残魂正在苏醒！',
    type: 'boss',
    icon: '🦊',
    duration: 45,
    cooldown: 240,
    levelReq: 60,
    rewards: {
      exp: 100000,
      gold: 50000,
      items: ['demon_blood_essence', 'phoenix_feather', 'scripture_shard_epic'],
    },
    boss: {
      name: '远古妖帝·混沌',
      hp: 2000000,
      attack: 1200,
      defense: 800,
      expReward: 100000,
      goldReward: 50000,
      drops: ['demon_blood_essence', 'demon_blood_essence', 'phoenix_feather', 'ancient_scripture_fragment', 'divine_pill'],
    },
    location: 'demon_beast_mountain_entrance',
    isActive: false,
  },
  {
    id: 'world_boss_sea_dragon',
    name: '海龙王出世',
    description: '东海之滨惊现海龙王，海啸滔天，水族大军压境！',
    type: 'boss',
    icon: '🐲',
    duration: 45,
    cooldown: 180,
    levelReq: 45,
    rewards: {
      exp: 45000,
      gold: 22000,
      items: ['dragon_blood', 'dragon_blood', 'sacred_golden_sword'],
    },
    boss: {
      name: '海龙王·敖广',
      hp: 800000,
      attack: 700,
      defense: 500,
      expReward: 45000,
      goldReward: 22000,
      drops: ['dragon_blood', 'dragon_blood', 'dragon_blood', 'sacred_golden_sword', 'nine_turn_elixir'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
  {
    id: 'world_boss_undead_king',
    name: '不死王复苏',
    description: '深渊裂缝中传来不死王的咆哮，亡灵大军正在涌出！',
    type: 'boss',
    icon: '💀',
    duration: 45,
    cooldown: 200,
    levelReq: 55,
    rewards: {
      exp: 70000,
      gold: 35000,
      items: ['ghost_essence', 'emperor_blood', 'scripture_shard_rare'],
    },
    boss: {
      name: '不死王·冥帝',
      hp: 1200000,
      attack: 900,
      defense: 600,
      expReward: 70000,
      goldReward: 35000,
      drops: ['ghost_essence', 'ghost_essence', 'emperor_blood', 'ancient_scripture_fragment', 'divine_pill'],
    },
    location: 'ancient_emperor_battlefield',
    isActive: false,
  },
  {
    id: 'world_boss_phoenix',
    name: '凤凰涅槃',
    description: '不死火山中凤凰即将涅槃重生，天地异火焚烧一切！',
    type: 'boss',
    icon: '🔥',
    duration: 60,
    cooldown: 360,
    levelReq: 65,
    rewards: {
      exp: 150000,
      gold: 75000,
      items: ['phoenix_feather', 'phoenix_feather', 'scripture_shard_epic'],
    },
    boss: {
      name: '凤凰·天火',
      hp: 3000000,
      attack: 1500,
      defense: 1000,
      expReward: 150000,
      goldReward: 75000,
      drops: ['phoenix_feather', 'phoenix_feather', 'emperor_artifact', 'ancient_scripture_fragment', 'nine_turn_elixir'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
];

// ── 宝藏事件 ──
export const TREASURE_EVENTS: WorldEvent[] = [
  {
    id: 'treasure_falling_star',
    name: '流星坠落',
    description: '一颗流星坠落在东荒旷野，流星中蕴含珍贵的源晶和宝物！',
    type: 'treasure',
    icon: '☄️',
    duration: 15,
    cooldown: 60,
    levelReq: 10,
    rewards: {
      exp: 2000,
      gold: 1000,
      items: ['source_crystal', 'source_crystal', 'scripture_shard_common'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
  {
    id: 'treasure_ancient_ruins',
    name: '古迹现世',
    description: '一处上古遗迹突然出现在地表，内有大量宝物和修炼资源！',
    type: 'treasure',
    icon: '🏛️',
    duration: 20,
    cooldown: 90,
    levelReq: 25,
    rewards: {
      exp: 5000,
      gold: 3000,
      items: ['ancient_scripture_fragment', 'source_crystal', 'dao_stone'],
    },
    location: 'central_city',
    isActive: false,
  },
];

// ── 入侵事件 ──
export const INVASION_EVENTS: WorldEvent[] = [
  {
    id: 'invasion_beast_tide',
    name: '妖兽攻城',
    description: '大批妖兽正在向中州神城发起进攻，保卫神城！',
    type: 'invasion',
    icon: '🐗',
    duration: 30,
    cooldown: 120,
    levelReq: 20,
    rewards: {
      exp: 8000,
      gold: 4000,
      items: ['demon_beast_core', 'source_crystal', 'rage_pill'],
    },
    location: 'central_city',
    isActive: false,
  },
  {
    id: 'invasion_demon_army',
    name: '妖界入侵',
    description: '妖界大军入侵人间，妖气弥漫，需要所有修炼者共同抵御！',
    type: 'invasion',
    icon: '👹',
    duration: 45,
    cooldown: 180,
    levelReq: 35,
    rewards: {
      exp: 15000,
      gold: 8000,
      items: ['demon_blood_essence', 'ancient_scripture_fragment', 'divine_pill'],
    },
    location: 'demon_realm_entrance',
    isActive: false,
  },
  {
    id: 'invasion_undead',
    name: '亡灵入侵',
    description: '深渊裂缝中涌出大量亡灵，正在侵蚀东荒大地！',
    type: 'invasion',
    icon: '💀',
    duration: 40,
    cooldown: 150,
    levelReq: 45,
    rewards: {
      exp: 20000,
      gold: 10000,
      items: ['ghost_essence', 'emperor_blood', 'divine_pill'],
    },
    location: 'ancient_emperor_battlefield',
    isActive: false,
  },
  {
    id: 'invasion_void_creatures',
    name: '虚空入侵',
    description: '虚空裂缝撕裂空间，虚空生物正在入侵现实世界！',
    type: 'invasion',
    icon: '🌀',
    duration: 50,
    cooldown: 240,
    levelReq: 55,
    rewards: {
      exp: 30000,
      gold: 15000,
      items: ['void_essence', 'ancient_scripture_fragment', 'scripture_shard_epic'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
];

// ── 节日活动 ──
export const FESTIVAL_EVENTS: WorldEvent[] = [
  {
    id: 'festival_double_exp',
    name: '双倍经验日',
    description: '天地源力充沛，所有修炼者获得双倍经验！',
    type: 'festival',
    icon: '🎉',
    duration: 1440, // 24小时
    cooldown: 10080, // 一周
    levelReq: 1,
    rewards: {
      exp: 0,
      gold: 0,
      items: [],
    },
    location: 'all',
    isActive: false,
  },
  {
    id: 'festival_source_rain',
    name: '源力之雨',
    description: '天降源力之雨，所有修炼者获得额外源晶和修为！',
    type: 'festival',
    icon: '🌧️',
    duration: 60,
    cooldown: 1440,
    levelReq: 10,
    rewards: {
      exp: 3000,
      gold: 1500,
      items: ['source_crystal', 'source_crystal', 'source_crystal'],
    },
    location: 'all',
    isActive: false,
  },
];

// ── 奇遇事件 ──
export const MYSTERY_EVENTS: WorldEvent[] = [
  {
    id: 'mystery_old_master',
    name: '神秘老者',
    description: '一位神秘老者出现在归元村，似乎在寻找有缘人……',
    type: 'mystery',
    icon: '👴',
    duration: 10,
    cooldown: 360,
    levelReq: 5,
    rewards: {
      exp: 1000,
      gold: 500,
      items: ['scripture_shard_common', 'health_pill'],
    },
    location: 'guiyuan_village',
    isActive: false,
  },
  {
    id: 'mystery_fairy',
    name: '仙女下凡',
    description: '一位仙女从天而降，赐予有缘人宝物！',
    type: 'mystery',
    icon: '🧚',
    duration: 5,
    cooldown: 720,
    levelReq: 15,
    rewards: {
      exp: 3000,
      gold: 2000,
      items: ['scripture_shard_fine', 'divine_pill'],
    },
    location: 'central_city',
    isActive: false,
  },
  {
    id: 'mystery_spirit_vein',
    name: '灵脉爆发',
    description: '东荒大地灵脉突然爆发，源力充沛，修炼效率大增！',
    type: 'mystery',
    icon: '💎',
    duration: 30,
    cooldown: 480,
    levelReq: 10,
    rewards: {
      exp: 5000,
      gold: 2000,
      items: ['source_crystal', 'source_crystal', 'source_crystal'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
  {
    id: 'mystery_meteorite',
    name: '天降陨石',
    description: '一颗巨大的陨石从天而降，陨石中蕴含着珍稀材料！',
    type: 'mystery',
    icon: '☄️',
    duration: 20,
    cooldown: 600,
    levelReq: 20,
    rewards: {
      exp: 8000,
      gold: 5000,
      items: ['rare_source_crystal', 'scripture_shard_rare', 'divine_pill'],
    },
    location: 'central_city',
    isActive: false,
  },
  {
    id: 'mystery_secret_realm',
    name: '秘境开启',
    description: '一处上古秘境突然出现在东荒，内有大量宝物和修炼资源！',
    type: 'mystery',
    icon: '🌀',
    duration: 60,
    cooldown: 1440,
    levelReq: 30,
    rewards: {
      exp: 15000,
      gold: 8000,
      items: ['ancient_scripture_fragment', 'scripture_shard_rare', 'divine_pill'],
    },
    location: 'donghuang_plain',
    isActive: false,
  },
];

// ── 所有世界事件 ──
export const ALL_WORLD_EVENTS: WorldEvent[] = [
  ...WORLD_BOSSES,
  ...TREASURE_EVENTS,
  ...INVASION_EVENTS,
  ...FESTIVAL_EVENTS,
  ...MYSTERY_EVENTS,
];

// ── 事件管理器 ──
export class WorldEventManager {
  private events: Map<string, WorldEvent> = new Map();
  private activeEvents: WorldEvent[] = [];
  private lastCheck: number = 0;

  constructor() {
    ALL_WORLD_EVENTS.forEach(event => {
      this.events.set(event.id, { ...event });
    });
  }

  // 检查并触发事件
  checkEvents(currentTime: number): WorldEvent[] {
    if (currentTime - this.lastCheck < 60000) return []; // 每分钟检查一次
    this.lastCheck = currentTime;

    const newEvents: WorldEvent[] = [];

    this.events.forEach((event, id) => {
      if (event.isActive) {
        // 检查是否结束
        if (event.endTime && currentTime >= event.endTime) {
          event.isActive = false;
          event.startTime = undefined;
          event.endTime = undefined;
        }
      } else {
        // 检查是否应该触发
        const timeSinceLastEnd = event.endTime ? currentTime - event.endTime : Infinity;
        if (timeSinceLastEnd >= event.cooldown * 60000) {
          // 随机触发
          if (Math.random() < 0.1) { // 10%概率
            event.isActive = true;
            event.startTime = currentTime;
            event.endTime = currentTime + event.duration * 60000;
            newEvents.push(event);
          }
        }
      }
    });

    return newEvents;
  }

  // 获取当前活跃事件
  getActiveEvents(): WorldEvent[] {
    return Array.from(this.events.values()).filter(e => e.isActive);
  }

  // 获取事件
  getEvent(id: string): WorldEvent | undefined {
    return this.events.get(id);
  }

  // 手动触发事件（用于测试）
  triggerEvent(id: string): WorldEvent | null {
    const event = this.events.get(id);
    if (!event || event.isActive) return null;

    event.isActive = true;
    event.startTime = Date.now();
    event.endTime = Date.now() + event.duration * 60000;
    return event;
  }
}

// 全局事件管理器实例
export const worldEventManager = new WorldEventManager();
