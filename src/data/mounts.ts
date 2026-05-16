// ── 坐骑系统 ──

export interface Mount {
  id: string;
  name: string;
  description: string;
  icon: string;
  quality: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  speed: number; // 移动速度加成 (%)
  effects: MountEffect[];
  requirement: {
    level: number;
    gold?: number;
    items?: string[];
  };
  evolveTo?: string; // 进化后的坐骑ID
}

export interface MountEffect {
  type: 'attack' | 'defense' | 'hp' | 'mp' | 'critRate' | 'dodge' | 'expBonus' | 'goldBonus' | 'speed';
  value: number;
  isPercent: boolean;
}

export interface PlayerMount {
  mountId: string;
  level: number;
  exp: number;
  expToNext: number;
  isActive: boolean;
}

// ── 坐骑定义 ──
export const MOUNTS: Record<string, Mount> = {
  // 普通坐骑
  wild_horse: {
    id: 'wild_horse',
    name: '野马',
    description: '东荒常见的野马，虽然平凡但脚力尚可。',
    icon: '🐎',
    quality: 'common',
    speed: 10,
    effects: [],
    requirement: { level: 5, gold: 500 },
  },
  gray_wolf: {
    id: 'gray_wolf',
    name: '灰狼',
    description: '驯服的灰狼，速度比马快，但需要一定的驯兽技巧。',
    icon: '🐺',
    quality: 'uncommon',
    speed: 20,
    effects: [
      { type: 'attack', value: 10, isPercent: false },
    ],
    requirement: { level: 15, gold: 2000 },
  },
  // 稀有坐骑
  spirit_deer: {
    id: 'spirit_deer',
    name: '灵鹿',
    description: '带有灵性的鹿，奔跑时有淡淡的灵光。',
    icon: '🦌',
    quality: 'rare',
    speed: 35,
    effects: [
      { type: 'dodge', value: 5, isPercent: false },
      { type: 'expBonus', value: 5, isPercent: true },
    ],
    requirement: { level: 25, gold: 5000, items: ['spirit_deer_antler'] },
  },
  black_bear: {
    id: 'black_bear',
    name: '黑熊',
    description: '强壮的黑熊，虽然速度不快但力量惊人。',
    icon: '🐻',
    quality: 'rare',
    speed: 25,
    effects: [
      { type: 'attack', value: 30, isPercent: false },
      { type: 'hp', value: 200, isPercent: false },
    ],
    requirement: { level: 30, gold: 8000, items: ['bear_paw'] },
  },
  // 史诗坐骑
  spirit_tiger: {
    id: 'spirit_tiger',
    name: '灵虎',
    description: '带有灵性的猛虎，威风凛凛，速度极快。',
    icon: '🐯',
    quality: 'epic',
    speed: 50,
    effects: [
      { type: 'attack', value: 50, isPercent: false },
      { type: 'critRate', value: 8, isPercent: false },
      { type: 'speed', value: 10, isPercent: false },
    ],
    requirement: { level: 40, gold: 20000, items: ['tiger_spirit_stone'] },
  },
  phoenix_bird: {
    id: 'phoenix_bird',
    name: '凤凰',
    description: '传说中的神鸟，浴火重生，速度极快。',
    icon: '🦅',
    quality: 'epic',
    speed: 60,
    effects: [
      { type: 'attack', value: 80, isPercent: false },
      { type: 'defense', value: 50, isPercent: false },
      { type: 'expBonus', value: 15, isPercent: true },
    ],
    requirement: { level: 50, gold: 50000, items: ['phoenix_feather'] },
    evolveTo: 'golden_phoenix',
  },
  // 传说坐骑
  golden_phoenix: {
    id: 'golden_phoenix',
    name: '金翅凤凰',
    description: '凤凰进化后的终极形态，金光闪耀，速度冠绝天下。',
    icon: '🔥',
    quality: 'legendary',
    speed: 80,
    effects: [
      { type: 'attack', value: 150, isPercent: false },
      { type: 'defense', value: 100, isPercent: false },
      { type: 'hp', value: 500, isPercent: false },
      { type: 'expBonus', value: 25, isPercent: true },
      { type: 'goldBonus', value: 20, isPercent: true },
    ],
    requirement: { level: 60, gold: 100000, items: ['golden_phoenix_feather'] },
  },
  dragon_horse: {
    id: 'dragon_horse',
    name: '龙马',
    description: '传说中的龙马，龙与马的后裔，速度与力量并存。',
    icon: '🐉',
    quality: 'legendary',
    speed: 90,
    effects: [
      { type: 'attack', value: 200, isPercent: false },
      { type: 'defense', value: 150, isPercent: false },
      { type: 'hp', value: 800, isPercent: false },
      { type: 'critRate', value: 15, isPercent: false },
    ],
    requirement: { level: 70, gold: 200000, items: ['dragon_blood', 'dragon_blood', 'dragon_blood'] },
  },
};

// ── 宠物系统 ──

export interface Pet {
  id: string;
  name: string;
  description: string;
  icon: string;
  quality: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'attack' | 'defense' | 'support' | 'balanced';
  baseStats: {
    attack: number;
    defense: number;
    hp: number;
    mp: number;
  };
  skills: PetSkill[];
  evolution?: {
    targetId: string;
    requiredLevel: number;
    requiredItems: string[];
  };
  requirement: {
    level: number;
    gold?: number;
    items?: string[];
  };
}

export interface PetSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'heal' | 'buff' | 'debuff';
  damage?: number;
  heal?: number;
  mpCost: number;
  cooldown: number;
}

export interface PlayerPet {
  petId: string;
  level: number;
  exp: number;
  expToNext: number;
  isActive: boolean;
  skills: string[]; // 已学习的技能ID
}

// ── 宠物定义 ──
export const PETS: Record<string, Pet> = {
  // 普通宠物
  spirit_cat: {
    id: 'spirit_cat',
    name: '灵猫',
    description: '带有灵性的小猫，虽然弱小但很可爱。',
    icon: '🐱',
    quality: 'common',
    type: 'support',
    baseStats: { attack: 10, defense: 5, hp: 50, mp: 30 },
    skills: [
      { id: 'cat_scratch', name: '猫爪击', description: '用爪子攻击敌人', type: 'attack', damage: 15, mpCost: 5, cooldown: 1 },
      { id: 'cat_heal', name: '舔舐伤口', description: '舔舐伤口恢复少量气血', type: 'heal', heal: 30, mpCost: 10, cooldown: 3 },
    ],
    requirement: { level: 5, gold: 300 },
  },
  spirit_dog: {
    id: 'spirit_dog',
    name: '灵犬',
    description: '忠诚的灵犬，会保护主人。',
    icon: '🐶',
    quality: 'common',
    type: 'defense',
    baseStats: { attack: 8, defense: 15, hp: 80, mp: 20 },
    skills: [
      { id: 'dog_bite', name: '犬牙击', description: '用利齿咬住敌人', type: 'attack', damage: 12, mpCost: 5, cooldown: 1 },
      { id: 'dog_guard', name: '守护', description: '挡在主人身前，减少受到的伤害', type: 'buff', mpCost: 15, cooldown: 5 },
    ],
    requirement: { level: 8, gold: 500 },
  },
  // 稀有宠物
  spirit_fox: {
    id: 'spirit_fox',
    name: '灵狐',
    description: '九尾狐的幼崽，天生带有魅惑之力。',
    icon: '🦊',
    quality: 'rare',
    type: 'attack',
    baseStats: { attack: 30, defense: 15, hp: 120, mp: 80 },
    skills: [
      { id: 'fox_fire', name: '狐火', description: '释放狐火攻击敌人', type: 'attack', damage: 40, mpCost: 20, cooldown: 2 },
      { id: 'fox_charm', name: '魅惑', description: '魅惑敌人，使其短暂失神', type: 'debuff', mpCost: 30, cooldown: 5 },
    ],
    evolution: {
      targetId: 'nine_tail_fox',
      requiredLevel: 40,
      requiredItems: ['fox_spirit_stone', 'fox_spirit_stone', 'fox_spirit_stone'],
    },
    requirement: { level: 20, gold: 5000, items: ['fox_tail'] },
  },
  spirit_eagle: {
    id: 'spirit_eagle',
    name: '灵鹰',
    description: '天空中的霸主，视力极佳，攻击力强。',
    icon: '🦅',
    quality: 'rare',
    type: 'attack',
    baseStats: { attack: 35, defense: 10, hp: 100, mp: 60 },
    skills: [
      { id: 'eagle_dive', name: '俯冲', description: '从高空俯冲攻击敌人', type: 'attack', damage: 50, mpCost: 25, cooldown: 3 },
      { id: 'eagle_eye', name: '鹰眼', description: '提升主人的命中率', type: 'buff', mpCost: 20, cooldown: 5 },
    ],
    requirement: { level: 25, gold: 8000, items: ['eagle_feather'] },
  },
  // 史诗宠物
  nine_tail_fox: {
    id: 'nine_tail_fox',
    name: '九尾狐',
    description: '九尾狐的完全形态，妖力强大，可幻化人形。',
    icon: '🦊',
    quality: 'epic',
    type: 'attack',
    baseStats: { attack: 80, defense: 40, hp: 300, mp: 200 },
    skills: [
      { id: 'nine_tail_fire', name: '九尾狐火', description: '释放九道狐火攻击敌人', type: 'attack', damage: 120, mpCost: 60, cooldown: 4 },
      { id: 'fox_dance', name: '狐之舞', description: '提升主人的攻击力和暴击率', type: 'buff', mpCost: 40, cooldown: 8 },
      { id: 'fox_heal', name: '狐之治愈', description: '用妖力治愈主人的伤势', type: 'heal', heal: 200, mpCost: 50, cooldown: 6 },
    ],
    requirement: { level: 40 },
  },
  // 传说宠物
  divine_dragon: {
    id: 'divine_dragon',
    name: '神龙',
    description: '传说中的神龙，龙威震慑天地，力量无穷。',
    icon: '🐲',
    quality: 'legendary',
    type: 'balanced',
    baseStats: { attack: 150, defense: 120, hp: 800, mp: 400 },
    skills: [
      { id: 'dragon_breath', name: '龙息', description: '喷出龙息攻击敌人', type: 'attack', damage: 200, mpCost: 100, cooldown: 5 },
      { id: 'dragon_roar', name: '龙啸', description: '龙啸震慑敌人，降低其攻击力', type: 'debuff', mpCost: 80, cooldown: 8 },
      { id: 'dragon_shield', name: '龙鳞护体', description: '用龙鳞保护主人，大幅减少伤害', type: 'buff', mpCost: 120, cooldown: 10 },
      { id: 'dragon_heal', name: '龙之治愈', description: '用龙力治愈主人的伤势', type: 'heal', heal: 500, mpCost: 150, cooldown: 12 },
    ],
    requirement: { level: 60, gold: 200000, items: ['dragon_egg'] },
  },
};

// ── 坐骑管理器 ──
export class MountManager {
  private playerMounts: Map<string, PlayerMount> = new Map();
  private activeMount: string | null = null;

  constructor(savedMounts?: PlayerMount[], activeMount?: string) {
    if (savedMounts) {
      savedMounts.forEach(m => {
        this.playerMounts.set(m.mountId, m);
      });
    }
    if (activeMount) {
      this.activeMount = activeMount;
    }
  }

  // 获取坐骑
  addMount(mountId: string): boolean {
    if (this.playerMounts.has(mountId)) return false;
    const mount = MOUNTS[mountId];
    if (!mount) return false;

    this.playerMounts.set(mountId, {
      mountId,
      level: 1,
      exp: 0,
      expToNext: 100,
      isActive: false,
    });
    return true;
  }

  // 设置当前坐骑
  setActiveMount(mountId: string | null): boolean {
    if (mountId && !this.playerMounts.has(mountId)) return false;

    // 取消当前坐骑
    if (this.activeMount) {
      const current = this.playerMounts.get(this.activeMount);
      if (current) current.isActive = false;
    }

    this.activeMount = mountId;
    if (mountId) {
      const mount = this.playerMounts.get(mountId);
      if (mount) mount.isActive = true;
    }
    return true;
  }

  // 获取当前坐骑
  getActiveMount(): Mount | null {
    if (!this.activeMount) return null;
    return MOUNTS[this.activeMount] || null;
  }

  // 获取坐骑属性加成
  getMountEffects(): MountEffect[] {
    const mount = this.getActiveMount();
    if (!mount) return [];

    const playerMount = this.playerMounts.get(this.activeMount!);
    if (!playerMount) return mount.effects;

    // 根据等级增加效果
    const levelMult = 1 + (playerMount.level - 1) * 0.1;
    return mount.effects.map(e => ({
      ...e,
      value: Math.floor(e.value * levelMult),
    }));
  }

  // 获取移动速度加成
  getSpeedBonus(): number {
    const mount = this.getActiveMount();
    if (!mount) return 0;

    const playerMount = this.playerMounts.get(this.activeMount!);
    if (!playerMount) return mount.speed;

    // 根据等级增加速度
    return mount.speed + (playerMount.level - 1) * 2;
  }

  // 坐骑升级
  addExp(mountId: string, exp: number): boolean {
    const playerMount = this.playerMounts.get(mountId);
    if (!playerMount) return false;

    playerMount.exp += exp;
    while (playerMount.exp >= playerMount.expToNext) {
      playerMount.exp -= playerMount.expToNext;
      playerMount.level++;
      playerMount.expToNext = Math.floor(100 * Math.pow(1.5, playerMount.level - 1));
    }
    return true;
  }

  // 进化坐骑
  evolveMount(mountId: string, inventory: string[] = []): string | null {
    const mount = MOUNTS[mountId];
    if (!mount?.evolveTo) return null;

    const playerMount = this.playerMounts.get(mountId);
    if (!playerMount) return null;

    const targetMount = MOUNTS[mount.evolveTo];
    if (!targetMount) return null;

    // 检查所需物品
    if (mount.requirement.items) {
      const invCounts: Record<string, number> = {};
      inventory.forEach(id => { invCounts[id] = (invCounts[id] || 0) + 1; });
      for (const itemId of mount.requirement.items) {
        if ((invCounts[itemId] || 0) < 1) return null;
      }
    }

    // 移除旧坐骑
    this.playerMounts.delete(mountId);

    // 添加新坐骑
    this.playerMounts.set(mount.evolveTo, {
      mountId: mount.evolveTo,
      level: playerMount.level,
      exp: playerMount.exp,
      expToNext: playerMount.expToNext,
      isActive: playerMount.isActive,
    });

    if (this.activeMount === mountId) {
      this.activeMount = mount.evolveTo;
    }

    return mount.evolveTo;
  }

  // 保存坐骑数据
  save(): { mounts: PlayerMount[]; activeMount: string | null } {
    return {
      mounts: Array.from(this.playerMounts.values()),
      activeMount: this.activeMount,
    };
  }
}

// ── 宠物管理器 ──
export class PetManager {
  private playerPets: Map<string, PlayerPet> = new Map();
  private activePet: string | null = null;

  constructor(savedPets?: PlayerPet[], activePet?: string) {
    if (savedPets) {
      savedPets.forEach(p => {
        this.playerPets.set(p.petId, p);
      });
    }
    if (activePet) {
      this.activePet = activePet;
    }
  }

  // 获取宠物
  addPet(petId: string): boolean {
    if (this.playerPets.has(petId)) return false;
    const pet = PETS[petId];
    if (!pet) return false;

    this.playerPets.set(petId, {
      petId,
      level: 1,
      exp: 0,
      expToNext: 100,
      isActive: false,
      skills: pet.skills.map(s => s.id),
    });
    return true;
  }

  // 设置当前宠物
  setActivePet(petId: string | null): boolean {
    if (petId && !this.playerPets.has(petId)) return false;

    // 取消当前宠物
    if (this.activePet) {
      const current = this.playerPets.get(this.activePet);
      if (current) current.isActive = false;
    }

    this.activePet = petId;
    if (petId) {
      const pet = this.playerPets.get(petId);
      if (pet) pet.isActive = true;
    }
    return true;
  }

  // 获取当前宠物
  getActivePet(): Pet | null {
    if (!this.activePet) return null;
    return PETS[this.activePet] || null;
  }

  // 获取宠物属性
  getPetStats(): { attack: number; defense: number; hp: number; mp: number } | null {
    const pet = this.getActivePet();
    if (!pet) return null;

    const playerPet = this.playerPets.get(this.activePet!);
    if (!playerPet) return pet.baseStats;

    // 根据等级增加属性
    const levelMult = 1 + (playerPet.level - 1) * 0.15;
    return {
      attack: Math.floor(pet.baseStats.attack * levelMult),
      defense: Math.floor(pet.baseStats.defense * levelMult),
      hp: Math.floor(pet.baseStats.hp * levelMult),
      mp: Math.floor(pet.baseStats.mp * levelMult),
    };
  }

  // 宠物升级
  addExp(petId: string, exp: number): boolean {
    const playerPet = this.playerPets.get(petId);
    if (!playerPet) return false;

    playerPet.exp += exp;
    while (playerPet.exp >= playerPet.expToNext) {
      playerPet.exp -= playerPet.expToNext;
      playerPet.level++;
      playerPet.expToNext = Math.floor(100 * Math.pow(1.3, playerPet.level - 1));
    }
    return true;
  }

  // 进化宠物
  evolvePet(petId: string, inventory: string[] = []): string | null {
    const pet = PETS[petId];
    if (!pet?.evolution) return null;

    const playerPet = this.playerPets.get(petId);
    if (!playerPet) return null;

    if (playerPet.level < pet.evolution.requiredLevel) return null;

    const targetPet = PETS[pet.evolution.targetId];
    if (!targetPet) return null;

    // 检查所需物品
    if (pet.evolution.requiredItems) {
      const invCounts: Record<string, number> = {};
      inventory.forEach(id => { invCounts[id] = (invCounts[id] || 0) + 1; });
      for (const itemId of pet.evolution.requiredItems) {
        if ((invCounts[itemId] || 0) < 1) return null;
      }
    }

    // 移除旧宠物
    this.playerPets.delete(petId);

    // 添加新宠物
    this.playerPets.set(pet.evolution.targetId, {
      petId: pet.evolution.targetId,
      level: playerPet.level,
      exp: playerPet.exp,
      expToNext: playerPet.expToNext,
      isActive: playerPet.isActive,
      skills: targetPet.skills.map(s => s.id),
    });

    if (this.activePet === petId) {
      this.activePet = pet.evolution.targetId;
    }

    return pet.evolution.targetId;
  }

  // 宠物技能
  getPetSkills(): PetSkill[] {
    const pet = this.getActivePet();
    if (!pet) return [];

    const playerPet = this.playerPets.get(this.activePet!);
    if (!playerPet) return pet.skills;

    return pet.skills.filter(s => playerPet.skills.includes(s.id));
  }

  // 保存宠物数据
  save(): { pets: PlayerPet[]; activePet: string | null } {
    return {
      pets: Array.from(this.playerPets.values()),
      activePet: this.activePet,
    };
  }
}
