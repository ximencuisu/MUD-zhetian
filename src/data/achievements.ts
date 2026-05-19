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

  // ── 新增战斗成就 ──
  monster_slayer: {
    id: 'monster_slayer',
    name: '千人斩',
    description: '击败1000个敌人',
    category: 'combat',
    icon: '⚔️',
    conditions: [
      { type: 'kill', target: 'any', count: 1000, description: '击败1000个敌人' },
    ],
    rewards: { exp: 20000, gold: 10000, title: '千人斩' },
    hidden: false,
  },
  boss_hunter: {
    id: 'boss_hunter',
    name: 'Boss猎人',
    description: '击败50个世界Boss',
    category: 'combat',
    icon: '🎯',
    conditions: [
      { type: 'kill', target: 'world_boss', count: 50, description: '击败50个世界Boss' },
    ],
    rewards: { exp: 15000, gold: 8000, title: 'Boss猎人' },
    hidden: false,
  },
  pvp_legend: {
    id: 'pvp_legend',
    name: '竞技传说',
    description: '在竞技场中获得500场胜利',
    category: 'combat',
    icon: '🏆',
    conditions: [
      { type: 'pvp', target: 'win', count: 500, description: 'PVP胜利500场' },
    ],
    rewards: { exp: 30000, gold: 15000, title: '竞技传说' },
    hidden: false,
  },

  // ── 新增探索成就 ──
  world_traveler: {
    id: 'world_traveler',
    name: '世界旅行者',
    description: '探索所有区域',
    category: 'exploration',
    icon: '🌍',
    conditions: [
      { type: 'exploration', target: 'zone', count: 20, description: '探索20个区域' },
    ],
    rewards: { exp: 5000, gold: 3000, title: '世界旅行者' },
    hidden: false,
  },
  secret_finder: {
    id: 'secret_finder',
    name: '秘境发现者',
    description: '发现5个隐藏地点',
    category: 'exploration',
    icon: '🔍',
    conditions: [
      { type: 'exploration', target: 'hidden', count: 5, description: '发现5个隐藏地点' },
    ],
    rewards: { exp: 3000, gold: 2000, title: '秘境发现者' },
    hidden: false,
  },
  dungeon_king: {
    id: 'dungeon_king',
    name: '副本之王',
    description: '通关所有副本10次',
    category: 'exploration',
    icon: '👑',
    conditions: [
      { type: 'dungeon', target: 'all', count: 120, description: '通关副本120次' },
    ],
    rewards: { exp: 20000, gold: 10000, title: '副本之王' },
    hidden: false,
  },

  // ── 新增社交成就 ──
  best_friend: {
    id: 'best_friend',
    name: '挚友',
    description: '拥有100个好友',
    category: 'social',
    icon: '💕',
    conditions: [
      { type: 'friend', target: 'any', count: 100, description: '拥有100个好友' },
    ],
    rewards: { exp: 5000, gold: 3000, title: '挚友' },
    hidden: false,
  },
  guild_contributor: {
    id: 'guild_contributor',
    name: '帮派功臣',
    description: '为帮派贡献10000点',
    category: 'social',
    icon: '🏅',
    conditions: [
      { type: 'guild', target: 'contribution', count: 10000, description: '帮派贡献10000点' },
    ],
    rewards: { exp: 8000, gold: 5000, title: '帮派功臣' },
    hidden: false,
  },
  team_player: {
    id: 'team_player',
    name: '最佳队友',
    description: '组队完成100次副本',
    category: 'social',
    icon: '🤝',
    conditions: [
      { type: 'dungeon', target: 'party', count: 100, description: '组队通关100次' },
    ],
    rewards: { exp: 10000, gold: 6000, title: '最佳队友' },
    hidden: false,
  },

  // ── 新增收集成就 ──
  equipment_collector: {
    id: 'equipment_collector',
    name: '装备收藏家',
    description: '收集50种不同的装备',
    category: 'collection',
    icon: '🗡️',
    conditions: [
      { type: 'item', target: 'equipment', count: 50, description: '收集50种装备' },
    ],
    rewards: { exp: 8000, gold: 5000, title: '装备收藏家' },
    hidden: false,
  },
  mount_collector: {
    id: 'mount_collector',
    name: '坐骑收藏家',
    description: '收集所有坐骑',
    category: 'collection',
    icon: '🐎',
    conditions: [
      { type: 'item', target: 'mount', count: 8, description: '收集8种坐骑' },
    ],
    rewards: { exp: 10000, gold: 6000, title: '坐骑收藏家' },
    hidden: false,
  },
  pet_collector: {
    id: 'pet_collector',
    name: '灵宠收藏家',
    description: '收集所有灵宠',
    category: 'collection',
    icon: '🐾',
    conditions: [
      { type: 'item', target: 'pet', count: 7, description: '收集7种灵宠' },
    ],
    rewards: { exp: 10000, gold: 6000, title: '灵宠收藏家' },
    hidden: false,
  },
  scripture_master: {
    id: 'scripture_master',
    name: '经文大师',
    description: '收集100个经文碎片',
    category: 'collection',
    icon: '📜',
    conditions: [
      { type: 'item', target: 'scripture_shard', count: 100, description: '收集100个经文碎片' },
    ],
    rewards: { exp: 15000, gold: 8000, title: '经文大师' },
    hidden: false,
  },
  billionaire: {
    id: 'billionaire',
    name: '亿万富翁',
    description: '拥有1000万金叶',
    category: 'collection',
    icon: '💎',
    conditions: [
      { type: 'gold', target: 'any', count: 10000000, description: '拥有1000万金叶' },
    ],
    rewards: { exp: 50000, gold: 200000, title: '亿万富翁' },
    hidden: false,
  },

  // ── 新增修炼成就 ──
  cultivation_grandmaster: {
    id: 'cultivation_grandmaster',
    name: '修炼宗师',
    description: '达到大圣境界',
    category: 'cultivation',
    icon: '🔥',
    conditions: [
      { type: 'realm', target: 'great_sage', count: 1, description: '达到大圣境界' },
    ],
    rewards: { exp: 50000, gold: 25000, title: '修炼宗师' },
    hidden: false,
  },
  skill_master: {
    id: 'skill_master',
    name: '技能大师',
    description: '学会30种不同的技能',
    category: 'cultivation',
    icon: '📖',
    conditions: [
      { type: 'skill', target: 'any', count: 30, description: '学会30种技能' },
    ],
    rewards: { exp: 15000, gold: 8000, title: '技能大师' },
    hidden: false,
  },
  alchemy_grandmaster: {
    id: 'alchemy_grandmaster',
    name: '炼丹宗师',
    description: '炼丹等级达到50级',
    category: 'cultivation',
    icon: '⚗️',
    conditions: [
      { type: 'special', target: 'alchemy_level', count: 50, description: '炼丹等级达到50' },
    ],
    rewards: { exp: 12000, gold: 6000, title: '炼丹宗师' },
    hidden: false,
  },
  crafting_grandmaster: {
    id: 'crafting_grandmaster',
    name: '炼器宗师',
    description: '炼器等级达到50级',
    category: 'cultivation',
    icon: '🔨',
    conditions: [
      { type: 'special', target: 'crafting_level', count: 50, description: '炼器等级达到50' },
    ],
    rewards: { exp: 12000, gold: 6000, title: '炼器宗师' },
    hidden: false,
  },

  // ── 新增特殊成就 ──
  emperor_slayer: {
    id: 'emperor_slayer',
    name: '弑帝者',
    description: '击败古皇残念',
    category: 'special',
    icon: '👑',
    conditions: [
      { type: 'kill', target: 'world_boss_emperor_ghost', count: 1, description: '击败古皇残念' },
    ],
    rewards: { exp: 20000, gold: 10000, title: '弑帝者' },
    hidden: false,
  },
  phoenix_born: {
    id: 'phoenix_born',
    name: '凤凰涅槃',
    description: '击败凤凰',
    category: 'special',
    icon: '🔥',
    conditions: [
      { type: 'kill', target: 'world_boss_phoenix', count: 1, description: '击败凤凰' },
    ],
    rewards: { exp: 25000, gold: 12000, title: '凤凰涅槃' },
    hidden: false,
  },
  void_walker: {
    id: 'void_walker',
    name: '虚空行者',
    description: '击败深渊魔主',
    category: 'special',
    icon: '🌀',
    conditions: [
      { type: 'kill', target: 'abyss_boss', count: 1, description: '击败深渊魔主' },
    ],
    rewards: { exp: 30000, gold: 15000, title: '虚空行者' },
    hidden: true,
  },
  destiny_chosen: {
    id: 'destiny_chosen',
    name: '天命之子',
    description: '完成所有主线任务',
    category: 'special',
    icon: '✨',
    conditions: [
      { type: 'quest', target: 'main', count: 20, description: '完成20个主线任务' },
    ],
    rewards: { exp: 100000, gold: 50000, title: '天命之子' },
    hidden: false,
  },
  perfect_cultivator: {
    id: 'perfect_cultivator',
    name: '完美修炼者',
    description: '所有属性达到1000',
    category: 'special',
    icon: '💫',
    conditions: [
      { type: 'special', target: 'all_stats_1000', count: 1, description: '所有属性达到1000' },
    ],
    rewards: { exp: 200000, gold: 100000, title: '完美修炼者' },
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

  // ── 新增称号 ──
  monster_slayer: {
    id: 'monster_slayer',
    name: '千人斩',
    description: '击败1000个敌人的绝世强者',
    icon: '⚔️',
    color: '#E91E63',
    effects: [
      { type: 'attack', value: 200, isPercent: false },
      { type: 'critRate', value: 10, isPercent: false },
    ],
    source: '成就：千人斩',
  },
  boss_hunter: {
    id: 'boss_hunter',
    name: 'Boss猎人',
    description: '击败50个世界Boss的传奇',
    icon: '🎯',
    color: '#FF5722',
    effects: [
      { type: 'attack', value: 150, isPercent: false },
      { type: 'expBonus', value: 15, isPercent: true },
    ],
    source: '成就：Boss猎人',
  },
  world_traveler: {
    id: 'world_traveler',
    name: '世界旅行者',
    description: '探索过所有区域的冒险家',
    icon: '🌍',
    color: '#4CAF50',
    effects: [
      { type: 'dodge', value: 15, isPercent: false },
      { type: 'goldBonus', value: 10, isPercent: true },
    ],
    source: '成就：世界旅行者',
  },
  equipment_collector: {
    id: 'equipment_collector',
    name: '装备收藏家',
    description: '收集50种不同装备的收藏家',
    icon: '🗡️',
    color: '#9C27B0',
    effects: [
      { type: 'defense', value: 100, isPercent: false },
      { type: 'hp', value: 300, isPercent: false },
    ],
    source: '成就：装备收藏家',
  },
  cultivation_grandmaster: {
    id: 'cultivation_grandmaster',
    name: '修炼宗师',
    description: '达到大圣境界的绝世强者',
    icon: '🔥',
    color: '#FF9800',
    effects: [
      { type: 'attack', value: 300, isPercent: false },
      { type: 'defense', value: 200, isPercent: false },
      { type: 'hp', value: 1500, isPercent: false },
    ],
    source: '成就：修炼宗师',
  },
  destiny_chosen: {
    id: 'destiny_chosen',
    name: '天命之子',
    description: '完成所有主线任务的天选之人',
    icon: '✨',
    color: '#FFD700',
    effects: [
      { type: 'attack', value: 250, isPercent: false },
      { type: 'defense', value: 200, isPercent: false },
      { type: 'hp', value: 1000, isPercent: false },
      { type: 'expBonus', value: 20, isPercent: true },
    ],
    source: '成就：天命之子',
  },
  emperor_slayer: {
    id: 'emperor_slayer',
    name: '弑帝者',
    description: '击败古皇残念的传奇',
    icon: '👑',
    color: '#F44336',
    effects: [
      { type: 'attack', value: 180, isPercent: false },
      { type: 'critRate', value: 8, isPercent: false },
    ],
    source: '成就：弑帝者',
  },
  phoenix_born: {
    id: 'phoenix_born',
    name: '凤凰涅槃',
    description: '击败凤凰的绝世强者',
    icon: '🔥',
    color: '#FF5722',
    effects: [
      { type: 'attack', value: 200, isPercent: false },
      { type: 'hp', value: 500, isPercent: false },
    ],
    source: '成就：凤凰涅槃',
  },
  billionaire: {
    id: 'billionaire',
    name: '亿万富翁',
    description: '坐拥千万金叶的超级富豪',
    icon: '💎',
    color: '#FFD700',
    effects: [
      { type: 'goldBonus', value: 30, isPercent: true },
      { type: 'attack', value: 100, isPercent: false },
    ],
    source: '成就：亿万富翁',
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
