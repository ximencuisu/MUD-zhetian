// ── 成就系统 ──

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'exploration' | 'social' | 'collection' | 'cultivation' | 'special';
  icon: string;
  conditions: AchievementCondition[];
  rewards: AchievementReward;
  hidden: boolean; // 是否隐藏成就
}

export interface AchievementCondition {
  type: 'kill' | 'level' | 'realm' | 'item' | 'quest' | 'dungeon' | 'pvp' | 'friend' | 'guild' | 'gold' | 'skill' | 'exploration' | 'special';
  target: string;
  count: number;
  description: string;
}

export interface AchievementReward {
  exp?: number;
  gold?: number;
  items?: string[];
  title?: string; // 称号奖励
}

export interface PlayerAchievement {
  achievementId: string;
  completedAt: number;
  claimed: boolean;
}

// ── 成就定义 ──
export const ACHIEVEMENTS: Record<string, Achievement> = {
  // 战斗成就
  first_blood: {
    id: 'first_blood',
    name: '初出茅庐',
    description: '击败第一个敌人',
    category: 'combat',
    icon: '⚔️',
    conditions: [
      { type: 'kill', target: 'any', count: 1, description: '击败1个敌人' },
    ],
    rewards: { exp: 100, gold: 50 },
    hidden: false,
  },
  monster_hunter: {
    id: 'monster_hunter',
    name: '妖兽猎人',
    description: '击败100个敌人',
    category: 'combat',
    icon: '🗡️',
    conditions: [
      { type: 'kill', target: 'any', count: 100, description: '击败100个敌人' },
    ],
    rewards: { exp: 2000, gold: 1000, title: '妖兽猎人' },
    hidden: false,
  },
  dragon_slayer: {
    id: 'dragon_slayer',
    name: '屠龙勇士',
    description: '击败上古神龙',
    category: 'combat',
    icon: '🐉',
    conditions: [
      { type: 'kill', target: 'world_boss_dragon', count: 1, description: '击败上古神龙' },
    ],
    rewards: { exp: 10000, gold: 5000, title: '屠龙勇士' },
    hidden: false,
  },
  pvp_champion: {
    id: 'pvp_champion',
    name: '竞技之王',
    description: '在竞技场中获得100场胜利',
    category: 'combat',
    icon: '👑',
    conditions: [
      { type: 'pvp', target: 'win', count: 100, description: 'PVP胜利100场' },
    ],
    rewards: { exp: 5000, gold: 3000, title: '竞技之王' },
    hidden: false,
  },

  // 探索成就
  explorer: {
    id: 'explorer',
    name: '东荒探索者',
    description: '探索10个不同的区域',
    category: 'exploration',
    icon: '🗺️',
    conditions: [
      { type: 'exploration', target: 'zone', count: 10, description: '探索10个区域' },
    ],
    rewards: { exp: 1500, gold: 800 },
    hidden: false,
  },
  dungeon_master: {
    id: 'dungeon_master',
    name: '副本征服者',
    description: '通关所有副本',
    category: 'exploration',
    icon: '🏰',
    conditions: [
      { type: 'dungeon', target: 'all', count: 12, description: '通关12个副本' },
    ],
    rewards: { exp: 8000, gold: 4000, title: '副本征服者' },
    hidden: false,
  },

  // 社交成就
  social_butterfly: {
    id: 'social_butterfly',
    name: '社交达人',
    description: '拥有50个好友',
    category: 'social',
    icon: '👥',
    conditions: [
      { type: 'friend', target: 'any', count: 50, description: '拥有50个好友' },
    ],
    rewards: { exp: 2000, gold: 1000 },
    hidden: false,
  },
  guild_leader: {
    id: 'guild_leader',
    name: '帮派领袖',
    description: '创建一个帮派',
    category: 'social',
    icon: '🏛️',
    conditions: [
      { type: 'guild', target: 'create', count: 1, description: '创建帮派' },
    ],
    rewards: { exp: 3000, gold: 2000, title: '帮派领袖' },
    hidden: false,
  },

  // 收集成就
  collector: {
    id: 'collector',
    name: '收藏家',
    description: '收集100种不同的物品',
    category: 'collection',
    icon: '📦',
    conditions: [
      { type: 'item', target: 'unique', count: 100, description: '收集100种物品' },
    ],
    rewards: { exp: 5000, gold: 3000, title: '收藏家' },
    hidden: false,
  },
  rich_man: {
    id: 'rich_man',
    name: '富甲一方',
    description: '拥有100万金叶',
    category: 'collection',
    icon: '💰',
    conditions: [
      { type: 'gold', target: 'any', count: 1000000, description: '拥有100万金叶' },
    ],
    rewards: { exp: 10000, gold: 50000, title: '富甲一方' },
    hidden: false,
  },

  // 修炼成就
  cultivation_beginner: {
    id: 'cultivation_beginner',
    name: '修炼入门',
    description: '达到道宫境界',
    category: 'cultivation',
    icon: '🧘',
    conditions: [
      { type: 'realm', target: 'daogong_early', count: 1, description: '达到道宫境界' },
    ],
    rewards: { exp: 2000, gold: 1000 },
    hidden: false,
  },
  cultivation_master: {
    id: 'cultivation_master',
    name: '修炼大师',
    description: '达到仙台境界',
    category: 'cultivation',
    icon: '✨',
    conditions: [
      { type: 'realm', target: 'xiantai_early', count: 1, description: '达到仙台境界' },
    ],
    rewards: { exp: 20000, gold: 10000, title: '修炼大师' },
    hidden: false,
  },

  // 特殊成就
  secret_seeker: {
    id: 'secret_seeker',
    name: '九秘探寻者',
    description: '学会一个九秘',
    category: 'special',
    icon: '🔮',
    conditions: [
      { type: 'skill', target: 'secret', count: 1, description: '学会1个九秘' },
    ],
    rewards: { exp: 5000, gold: 3000, title: '九秘探寻者' },
    hidden: false,
  },
  phenomenon_master: {
    id: 'phenomenon_master',
    name: '异象大师',
    description: '获得传说级异象',
    category: 'special',
    icon: '🌟',
    conditions: [
      { type: 'special', target: 'phenomenon_legendary', count: 1, description: '获得传说级异象' },
    ],
    rewards: { exp: 8000, gold: 5000, title: '异象大师' },
    hidden: true,
  },
};

// ── 成就管理器 ──
export class AchievementManager {
  private playerAchievements: Map<string, PlayerAchievement> = new Map();
  private progress: Map<string, Map<string, number>> = new Map(); // category -> target -> count

  constructor(savedAchievements?: PlayerAchievement[]) {
    if (savedAchievements) {
      savedAchievements.forEach(a => {
        this.playerAchievements.set(a.achievementId, a);
      });
    }
  }

  // 检查成就是否完成
  checkAchievement(achievementId: string, currentProgress: Record<string, number>): boolean {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return false;

    // 检查是否已完成
    if (this.playerAchievements.has(achievementId)) return false;

    // 检查所有条件
    return achievement.conditions.every(condition => {
      const current = currentProgress[`${condition.type}_${condition.target}`] || 0;
      return current >= condition.count;
    });
  }

  // 完成成就
  completeAchievement(achievementId: string): AchievementReward | null {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return null;

    if (this.playerAchievements.has(achievementId)) return null;

    this.playerAchievements.set(achievementId, {
      achievementId,
      completedAt: Date.now(),
      claimed: false,
    });

    return achievement.rewards;
  }

  // 领取成就奖励
  claimReward(achievementId: string): AchievementReward | null {
    const playerAchievement = this.playerAchievements.get(achievementId);
    if (!playerAchievement || playerAchievement.claimed) return null;

    playerAchievement.claimed = true;
    const achievement = ACHIEVEMENTS[achievementId];
    return achievement?.rewards || null;
  }

  // 获取已完成成就
  getCompletedAchievements(): PlayerAchievement[] {
    return Array.from(this.playerAchievements.values());
  }

  // 获取成就进度
  getAchievementProgress(achievementId: string, currentProgress: Record<string, number>): number {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return 0;

    const totalConditions = achievement.conditions.length;
    let completedConditions = 0;

    achievement.conditions.forEach(condition => {
      const current = currentProgress[`${condition.type}_${condition.target}`] || 0;
      if (current >= condition.count) {
        completedConditions++;
      }
    });

    return Math.floor((completedConditions / totalConditions) * 100);
  }

  // 获取所有成就列表
  getAllAchievements(): Achievement[] {
    return Object.values(ACHIEVEMENTS);
  }

  // 获取分类成就
  getAchievementsByCategory(category: string): Achievement[] {
    return Object.values(ACHIEVEMENTS).filter(a => a.category === category);
  }

  // 检查新完成的成就
  checkAllAchievements(currentProgress: Record<string, number>): string[] {
    const newlyCompleted: string[] = [];

    Object.keys(ACHIEVEMENTS).forEach(achievementId => {
      if (this.checkAchievement(achievementId, currentProgress)) {
        newlyCompleted.push(achievementId);
      }
    });

    return newlyCompleted;
  }
}

// ── 称号系统 ──
export interface Title {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  effects: TitleEffect[];
  source: string; // 获取来源
}

export interface TitleEffect {
  type: 'attack' | 'defense' | 'hp' | 'mp' | 'critRate' | 'dodge' | 'expBonus' | 'goldBonus';
  value: number;
  isPercent: boolean;
}

export const TITLES: Record<string, Title> = {
  // 成就称号
  monster_hunter: {
    id: 'monster_hunter',
    name: '妖兽猎人',
    description: '击败100个敌人的勇士',
    icon: '🗡️',
    color: '#4CAF50',
    effects: [
      { type: 'attack', value: 50, isPercent: false },
    ],
    source: '成就：妖兽猎人',
  },
  dragon_slayer: {
    id: 'dragon_slayer',
    name: '屠龙勇士',
    description: '击败上古神龙的传说',
    icon: '🐉',
    color: '#FF9800',
    effects: [
      { type: 'attack', value: 100, isPercent: false },
      { type: 'critRate', value: 5, isPercent: false },
    ],
    source: '成就：屠龙勇士',
  },
  pvp_champion: {
    id: 'pvp_champion',
    name: '竞技之王',
    description: '竞技场的不败传说',
    icon: '👑',
    color: '#FFD700',
    effects: [
      { type: 'attack', value: 80, isPercent: false },
      { type: 'defense', value: 50, isPercent: false },
    ],
    source: '成就：竞技之王',
  },
  dungeon_master: {
    id: 'dungeon_master',
    name: '副本征服者',
    description: '征服所有副本的强者',
    icon: '🏰',
    color: '#9C27B0',
    effects: [
      { type: 'hp', value: 500, isPercent: false },
      { type: 'defense', value: 80, isPercent: false },
    ],
    source: '成就：副本征服者',
  },
  cultivation_master: {
    id: 'cultivation_master',
    name: '修炼大师',
    description: '达到仙台境界的修炼者',
    icon: '✨',
    color: '#E91E63',
    effects: [
      { type: 'expBonus', value: 10, isPercent: true },
      { type: 'attack', value: 150, isPercent: false },
    ],
    source: '成就：修炼大师',
  },
  rich_man: {
    id: 'rich_man',
    name: '富甲一方',
    description: '坐拥百万金叶的富豪',
    icon: '💰',
    color: '#FFC107',
    effects: [
      { type: 'goldBonus', value: 20, isPercent: true },
    ],
    source: '成就：富甲一方',
  },
  secret_seeker: {
    id: 'secret_seeker',
    name: '九秘探寻者',
    description: '探寻九秘奥秘的修炼者',
    icon: '🔮',
    color: '#673AB7',
    effects: [
      { type: 'attack', value: 120, isPercent: false },
      { type: 'critRate', value: 8, isPercent: false },
    ],
    source: '成就：九秘探寻者',
  },
  phenomenon_master: {
    id: 'phenomenon_master',
    name: '异象大师',
    description: '掌握传说异象的天才',
    icon: '🌟',
    color: '#FF5722',
    effects: [
      { type: 'attack', value: 200, isPercent: false },
      { type: 'defense', value: 100, isPercent: false },
      { type: 'hp', value: 1000, isPercent: false },
    ],
    source: '成就：异象大师',
  },

  // 特殊称号
  sect_leader: {
    id: 'sect_leader',
    name: '宗主',
    description: '一宗之主，统领门派',
    icon: '🏯',
    color: '#F44336',
    effects: [
      { type: 'attack', value: 200, isPercent: false },
      { type: 'defense', value: 150, isPercent: false },
      { type: 'hp', value: 800, isPercent: false },
    ],
    source: '成为宗主',
  },
  guild_leader: {
    id: 'guild_leader',
    name: '帮派领袖',
    description: '帮派的创建者和领袖',
    icon: '🏛️',
    color: '#3F51B5',
    effects: [
      { type: 'attack', value: 100, isPercent: false },
      { type: 'defense', value: 80, isPercent: false },
    ],
    source: '创建帮派',
  },
};

// ── 称号管理器 ──
export class TitleManager {
  private playerTitles: Set<string> = new Set();
  private activeTitle: string | null = null;

  constructor(savedTitles?: string[], activeTitle?: string) {
    if (savedTitles) {
      savedTitles.forEach(t => this.playerTitles.add(t));
    }
    if (activeTitle) {
      this.activeTitle = activeTitle;
    }
  }

  // 添加称号
  addTitle(titleId: string): boolean {
    if (this.playerTitles.has(titleId)) return false;
    this.playerTitles.add(titleId);
    return true;
  }

  // 设置当前称号
  setActiveTitle(titleId: string | null): boolean {
    if (titleId && !this.playerTitles.has(titleId)) return false;
    this.activeTitle = titleId;
    return true;
  }

  // 获取当前称号
  getActiveTitle(): Title | null {
    if (!this.activeTitle) return null;
    return TITLES[this.activeTitle] || null;
  }

  // 获取所有称号
  getAllTitles(): Title[] {
    return Array.from(this.playerTitles)
      .map(id => TITLES[id])
      .filter(Boolean) as Title[];
  }

  // 获取称号属性加成
  getTitleEffects(): TitleEffect[] {
    const title = this.getActiveTitle();
    return title?.effects || [];
  }

  // 保存称号数据
  save(): { titles: string[]; activeTitle: string | null } {
    return {
      titles: Array.from(this.playerTitles),
      activeTitle: this.activeTitle,
    };
  }
}
