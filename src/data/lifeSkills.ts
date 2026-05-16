// ── 生活技能系统 ──

export interface LifeSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gathering' | 'crafting' | 'cooking' | 'alchemy' | 'enchanting';
  maxLevel: number;
  requirement: {
    level: number;
    gold?: number;
  };
  recipes?: LifeSkillRecipe[];
}

export interface LifeSkillRecipe {
  id: string;
  name: string;
  description: string;
  materials: { itemId: string; count: number }[];
  result: { itemId: string; count: number };
  goldCost: number;
  successRate: number;
  skillLevelReq: number;
  expGain: number;
}

export interface PlayerLifeSkill {
  skillId: string;
  level: number;
  exp: number;
  expToNext: number;
}

// ── 生活技能定义 ──
export const LIFE_SKILLS: Record<string, LifeSkill> = {
  // 采集技能
  herbalism: {
    id: 'herbalism',
    name: '采药',
    description: '采集各种灵药和草药，用于炼丹和治疗。',
    icon: '🌿',
    category: 'gathering',
    maxLevel: 100,
    requirement: { level: 5 },
    recipes: [
      {
        id: 'herb_green',
        name: '采集灵草',
        description: '在野外采集灵草',
        materials: [],
        result: { itemId: 'green_herb', count: 3 },
        goldCost: 0,
        successRate: 90,
        skillLevelReq: 1,
        expGain: 10,
      },
      {
        id: 'herb_red',
        name: '采集红菇',
        description: '在深山中采集稀有的红菇',
        materials: [],
        result: { itemId: 'red_mushroom', count: 2 },
        goldCost: 0,
        successRate: 70,
        skillLevelReq: 20,
        expGain: 25,
      },
      {
        id: 'herb_spirit',
        name: '采集灵芝',
        description: '在灵气充沛之地采集灵芝',
        materials: [],
        result: { itemId: 'spirit_mushroom', count: 1 },
        goldCost: 0,
        successRate: 50,
        skillLevelReq: 40,
        expGain: 50,
      },
    ],
  },
  mining: {
    id: 'mining',
    name: '挖矿',
    description: '挖掘各种矿石，用于锻造和强化。',
    icon: '⛏️',
    category: 'gathering',
    maxLevel: 100,
    requirement: { level: 5 },
    recipes: [
      {
        id: 'mine_iron',
        name: '挖掘铁矿',
        description: '在矿脉中挖掘铁矿石',
        materials: [],
        result: { itemId: 'iron_ore', count: 3 },
        goldCost: 0,
        successRate: 90,
        skillLevelReq: 1,
        expGain: 10,
      },
      {
        id: 'mine_steel',
        name: '挖掘精钢矿',
        description: '在深层矿脉中挖掘精钢矿',
        materials: [],
        result: { itemId: 'steel_ore', count: 2 },
        goldCost: 0,
        successRate: 70,
        skillLevelReq: 20,
        expGain: 25,
      },
      {
        id: 'mine_source',
        name: '挖掘源晶',
        description: '在源脉中挖掘珍贵的源晶',
        materials: [],
        result: { itemId: 'source_crystal', count: 1 },
        goldCost: 0,
        successRate: 50,
        skillLevelReq: 40,
        expGain: 50,
      },
    ],
  },
  // 制作技能
  cooking: {
    id: 'cooking',
    name: '烹饪',
    description: '烹饪各种食物，恢复气血和神力。',
    icon: '🍳',
    category: 'cooking',
    maxLevel: 100,
    requirement: { level: 10, gold: 500 },
    recipes: [
      {
        id: 'cook_meat',
        name: '烤肉',
        description: '烤制简单的肉食',
        materials: [{ itemId: 'raw_meat', count: 2 }],
        result: { itemId: 'cooked_meat', count: 1 },
        goldCost: 10,
        successRate: 90,
        skillLevelReq: 1,
        expGain: 15,
      },
      {
        id: 'cook_soup',
        name: '灵药汤',
        description: '用灵药熬制的汤，可恢复大量气血',
        materials: [
          { itemId: 'green_herb', count: 3 },
          { itemId: 'raw_meat', count: 1 },
        ],
        result: { itemId: 'herb_soup', count: 1 },
        goldCost: 20,
        successRate: 80,
        skillLevelReq: 15,
        expGain: 30,
      },
      {
        id: 'cook_feast',
        name: '灵药盛宴',
        description: '用珍稀灵药制作的盛宴，可临时提升属性',
        materials: [
          { itemId: 'spirit_mushroom', count: 2 },
          { itemId: 'cooked_meat', count: 3 },
          { itemId: 'source_crystal', count: 1 },
        ],
        result: { itemId: 'spirit_feast', count: 1 },
        goldCost: 100,
        successRate: 60,
        skillLevelReq: 40,
        expGain: 80,
      },
    ],
  },
  enchanting: {
    id: 'enchanting',
    name: '制符',
    description: '制作各种符箓，用于战斗和修炼。',
    icon: '📜',
    category: 'enchanting',
    maxLevel: 100,
    requirement: { level: 15, gold: 1000 },
    recipes: [
      {
        id: 'enchant_fire',
        name: '火球符',
        description: '制作火球攻击符箓',
        materials: [
          { itemId: 'paper', count: 2 },
          { itemId: 'red_mushroom', count: 1 },
        ],
        result: { itemId: 'fireball_scroll', count: 1 },
        goldCost: 30,
        successRate: 80,
        skillLevelReq: 1,
        expGain: 20,
      },
      {
        id: 'enchant_shield',
        name: '护盾符',
        description: '制作护盾防御符箓',
        materials: [
          { itemId: 'paper', count: 2 },
          { itemId: 'iron_ore', count: 1 },
        ],
        result: { itemId: 'shield_scroll', count: 1 },
        goldCost: 30,
        successRate: 80,
        skillLevelReq: 15,
        expGain: 25,
      },
      {
        id: 'enchant_teleport',
        name: '传送符',
        description: '制作传送符箓，可瞬间移动到指定地点',
        materials: [
          { itemId: 'paper', count: 5 },
          { itemId: 'source_crystal', count: 2 },
        ],
        result: { itemId: 'teleport_scroll', count: 1 },
        goldCost: 100,
        successRate: 60,
        skillLevelReq: 30,
        expGain: 60,
      },
    ],
  },
};

// ── 生活技能管理器 ──
export class LifeSkillManager {
  private playerSkills: Map<string, PlayerLifeSkill> = new Map();

  constructor(savedSkills?: PlayerLifeSkill[]) {
    if (savedSkills) {
      savedSkills.forEach(s => {
        this.playerSkills.set(s.skillId, s);
      });
    }
  }

  // 学习技能
  learnSkill(skillId: string): boolean {
    if (this.playerSkills.has(skillId)) return false;
    const skill = LIFE_SKILLS[skillId];
    if (!skill) return false;

    this.playerSkills.set(skillId, {
      skillId,
      level: 1,
      exp: 0,
      expToNext: 100,
    });
    return true;
  }

  // 获取技能等级
  getSkillLevel(skillId: string): number {
    return this.playerSkills.get(skillId)?.level || 0;
  }

  // 获取技能经验
  getSkillExp(skillId: string): { exp: number; expToNext: number } | null {
    const skill = this.playerSkills.get(skillId);
    if (!skill) return null;
    return { exp: skill.exp, expToNext: skill.expToNext };
  }

  // 制作/采集
  craft(recipeId: string): { success: boolean; result?: { itemId: string; count: number }; expGain: number } {
    // 查找配方
    let recipe: LifeSkillRecipe | null = null;
    let skillId: string | null = null;

    Object.values(LIFE_SKILLS).forEach(skill => {
      const found = skill.recipes?.find(r => r.id === recipeId);
      if (found) {
        recipe = found;
        skillId = skill.id;
      }
    });

    if (!recipe || !skillId) {
      return { success: false, expGain: 0 };
    }

    // 检查技能等级
    const playerSkill = this.playerSkills.get(skillId);
    if (!playerSkill || playerSkill.level < recipe.skillLevelReq) {
      return { success: false, expGain: 0 };
    }

    // 判定成功
    const success = Math.random() * 100 < recipe.successRate;
    const expGain = success ? recipe.expGain : Math.floor(recipe.expGain * 0.3);

    // 增加技能经验
    if (playerSkill) {
      playerSkill.exp += expGain;
      while (playerSkill.exp >= playerSkill.expToNext) {
        playerSkill.exp -= playerSkill.expToNext;
        playerSkill.level++;
        playerSkill.expToNext = Math.floor(100 * Math.pow(1.2, playerSkill.level - 1));
      }
    }

    if (success) {
      return { success: true, result: recipe.result, expGain };
    }
    return { success: false, expGain };
  }

  // 获取可用配方
  getAvailableRecipes(skillId: string): LifeSkillRecipe[] {
    const skill = LIFE_SKILLS[skillId];
    if (!skill) return [];

    const playerSkill = this.playerSkills.get(skillId);
    if (!playerSkill) return [];

    return (skill.recipes || []).filter(r => playerSkill.level >= r.skillLevelReq);
  }

  // 保存技能数据
  save(): PlayerLifeSkill[] {
    return Array.from(this.playerSkills.values());
  }
}

// ── 天气/时间系统 ──

export type Weather = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';
export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';

export interface WeatherEffect {
  type: 'attack' | 'defense' | 'critRate' | 'dodge' | 'expBonus' | 'goldBonus';
  value: number;
  isPercent: boolean;
}

export interface TimeEffect {
  type: 'attack' | 'defense' | 'critRate' | 'dodge' | 'expBonus' | 'goldBonus';
  value: number;
  isPercent: boolean;
}

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect[]> = {
  clear: [
    { type: 'expBonus', value: 5, isPercent: true },
  ],
  cloudy: [],
  rain: [
    { type: 'attack', value: -10, isPercent: false },
    { type: 'defense', value: 10, isPercent: false },
  ],
  storm: [
    { type: 'attack', value: -20, isPercent: false },
    { type: 'defense', value: -10, isPercent: false },
    { type: 'critRate', value: 10, isPercent: false },
  ],
  snow: [
    { type: 'attack', value: -15, isPercent: false },
    { type: 'defense', value: 20, isPercent: false },
  ],
  fog: [
    { type: 'dodge', value: 15, isPercent: false },
    { type: 'critRate', value: -10, isPercent: false },
  ],
};

export const TIME_EFFECTS: Record<TimeOfDay, TimeEffect[]> = {
  dawn: [
    { type: 'expBonus', value: 10, isPercent: true },
  ],
  morning: [
    { type: 'attack', value: 10, isPercent: false },
  ],
  noon: [
    { type: 'attack', value: 15, isPercent: false },
    { type: 'critRate', value: 5, isPercent: false },
  ],
  afternoon: [
    { type: 'defense', value: 10, isPercent: false },
  ],
  dusk: [
    { type: 'expBonus', value: 10, isPercent: true },
  ],
  night: [
    { type: 'dodge', value: 15, isPercent: false },
    { type: 'critRate', value: 10, isPercent: false },
    { type: 'attack', value: -10, isPercent: false },
  ],
};

// ── 时间管理器 ──
export class TimeManager {
  private gameTime: number = 0; // 游戏内时间（分钟）
  private weather: Weather = 'clear';
  private weatherChangeTime: number = 0;

  constructor() {
    this.gameTime = this.getInitialGameTime();
    this.weather = this.getRandomWeather();
  }

  // 获取初始游戏时间
  private getInitialGameTime(): number {
    const now = new Date();
    return (now.getHours() * 60 + now.getMinutes()) % 1440; // 24小时 = 1440分钟
  }

  // 获取随机天气
  private getRandomWeather(): Weather {
    const weathers: Weather[] = ['clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'];
    const weights = [40, 30, 15, 5, 5, 5]; // 权重
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;

    for (let i = 0; i < weathers.length; i++) {
      random -= weights[i];
      if (random <= 0) return weathers[i];
    }
    return 'clear';
  }

  // 更新时间
  updateTime(deltaMinutes: number): void {
    this.gameTime = (this.gameTime + deltaMinutes) % 1440;

    // 检查是否需要改变天气
    if (this.gameTime >= this.weatherChangeTime) {
      this.weather = this.getRandomWeather();
      this.weatherChangeTime = (this.gameTime + 60 + Math.random() * 120) % 1440; // 1-3小时后改变
    }
  }

  // 获取当前时间
  getCurrentTime(): TimeOfDay {
    const hour = Math.floor(this.gameTime / 60);
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 14) return 'noon';
    if (hour >= 14 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 20) return 'dusk';
    return 'night';
  }

  // 获取当前天气
  getCurrentWeather(): Weather {
    return this.weather;
  }

  // 获取时间效果
  getTimeEffects(): TimeEffect[] {
    return TIME_EFFECTS[this.getCurrentTime()];
  }

  // 获取天气效果
  getWeatherEffects(): WeatherEffect[] {
    return WEATHER_EFFECTS[this.weather];
  }

  // 获取所有效果
  getAllEffects(): { type: string; value: number; isPercent: boolean; source: string }[] {
    const timeEffects = this.getTimeEffects().map(e => ({ ...e, source: 'time' as const }));
    const weatherEffects = this.getWeatherEffects().map(e => ({ ...e, source: 'weather' as const }));
    return [...timeEffects, ...weatherEffects];
  }

  // 保存时间数据
  save(): { gameTime: number; weather: Weather; weatherChangeTime: number } {
    return {
      gameTime: this.gameTime,
      weather: this.weather,
      weatherChangeTime: this.weatherChangeTime,
    };
  }
}
