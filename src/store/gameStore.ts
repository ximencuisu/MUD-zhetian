import { create } from 'zustand';
import {
  Character, ChatMessage, CombatState, Quest, EquipmentSlots, AutoSettings, FloatWindowId,
  Item, REALM_NAMES, REALM_ORDER, CharacterStats, CharacterAttributes, CultivationMode,
  PhenomenonId, SkillType, SectRank, SECT_RANK_ORDER, RANK_PROMO_REQS, RANK_SALARY, CONTRIB_SOURCES,
} from '../types/game';
import { ROOMS, NPCS, ITEMS } from '../data/world';
import { ALL_ALCHEMY_RECIPES, ALCHEMY_RECIPE_MAP } from '../data/alchemyRecipes';
import { STARTER_SKILLS, BASE_GONGFA, ALL_SKILLS } from '../data/skills';
import { SECTS, SECT_SKILLS } from '../data/sects';
import { ALL_SECT_ROOMS, SECT_GATE_ROOMS, SECT_MAPS } from '../data/sectMaps';
import { DUNGEONS } from '../data/dungeons';
import { ZONES, ZONE_NPCS } from '../data/zones';
import { PHENOMENA, rollPhenomenon, RARITY_LABELS, RARITY_COLORS } from '../data/phenomena';
import { ALL_SECT_SKILLS } from '../data/sectSkills';
import { SECT_NPC_MAP } from '../data/sectNpcs';
import { ALL_FUNCTION_NPCS } from '../data/sectFunctionNpcs';
import { SectQuest, generateDailyQuests, ALL_SECT_QUESTS } from '../data/sectQuests';
import { SectShopItem, getSectShopItems, canBuyItem } from '../data/sectShop';
import { EQUIPMENT_SETS } from '../data/equipment';
import { worldEventManager, WorldEvent } from '../data/worldEvents';
import { AchievementManager, TitleManager } from '../data/achievements';

// Merged room lookup (world + all sect rooms)
const ALL_ROOMS = { ...ROOMS, ...ALL_SECT_ROOMS };
const SECT_FUNCTION_NPC_MAP = Object.fromEntries(ALL_FUNCTION_NPCS.map(n => [n.id, n])) as Record<string, (typeof ALL_FUNCTION_NPCS)[number]>;
import { INITIAL_QUESTS, QUESTS } from '../data/quests';
const INITIAL_QUEST_IDS: string[] = INITIAL_QUESTS;
import { ZONE_TEMPLATES, generateZone, GenRoom } from '../data/mapGen';
import { createScaledBuff, getDotDamage, getAdditionalEffects, hasDebuffEffect, SKILL_BUFF_EFFECTS } from '../data/buffEffects';
import { generateDungeonMap } from '../data/dungeonMapGen';
import { getOrCreateZoneSeed, broadcastSystem, registerPresence, updatePresence, sendChatMsg, savePlayerRanking } from '../services/multiplayerService';
import { saveCharacter, loadCharacter } from '../services/authService';

const uid = () => Math.random().toString(36).slice(2, 8);

function rollAttr(): number {
  return Math.floor(Math.random() * 8) + 12; // 12-19
}

function calcStats(character: Character): CharacterStats {
  const { attributes, equipment, enhanceLevels } = character;
  const eItems = Object.values(equipment)
    .filter(Boolean)
    .map(id => ITEMS[id!])
    .filter(Boolean) as Item[];

  // 强化加成倍率（每级 +5%）
  const enhanceMult = (slot: string): number => {
    const level = enhanceLevels?.[slot] || 0;
    return 1 + level * 0.05;
  };

  // 按 slot key 直接查找装备属性，避免索引错位
  const slotKeys = Object.keys(equipment) as (keyof EquipmentSlots)[];
  const slotItem = (slot: keyof EquipmentSlots): Item | null => {
    const id = equipment[slot];
    return id ? ITEMS[id] || null : null;
  };

  let atkBonus = 0, defBonus = 0, strBonus = 0, conBonus = 0, agiBonus = 0, intBonus = 0;
  for (const slot of slotKeys) {
    const item = slotItem(slot);
    if (!item) continue;
    const mult = enhanceMult(slot);
    atkBonus += (item.attack || 0) * mult;
    defBonus += (item.defense || 0) * mult;
    strBonus += (item.bonusStr || 0);
    conBonus += (item.bonusCon || 0);
    agiBonus += (item.bonusAgi || 0);
    intBonus += (item.bonusInt || 0);
  }

  const totalStr = attributes.shenli + strBonus;
  const totalCon = attributes.gengu + conBonus;
  const totalAgi = attributes.sudu + agiBonus;
  const totalInt = attributes.ganzhi + intBonus;

  // 苦海异象加成
  const phen = character.phenomenon ? PHENOMENA[character.phenomenon] : null;
  const pBuff = phen?.buff;
  const atkMult = pBuff?.attackMult || 1;
  const defMult = pBuff?.defenseMult || 1;
  const hitAdd = pBuff?.hitBonus || 0;
  const dodgeAdd = pBuff?.dodgeBonus || 0;
  const parryAdd = pBuff?.parryBonus || 0;
  const critAdd = pBuff?.critRateBonus || 0;
  const critDmgAdd = pBuff?.critDmgBonus || 0;
  const spdAdd = pBuff?.attackSpeedBonus || 0;

  return {
    attack: Math.floor(Math.floor(totalStr * 2.5 + atkBonus + character.realmLevel * 3) * atkMult),
    defense: Math.floor(Math.floor(totalCon * 1.5 + defBonus + character.realmLevel * 2) * defMult),
    hit: Math.floor(totalAgi * 1.5 + totalInt * 0.5 + 80 + hitAdd),
    dodge: Math.floor(totalAgi * 1.2 + 40 + dodgeAdd),
    parry: Math.floor(totalCon * 1.0 + defBonus * 0.5 + 20 + parryAdd),
    critRate: Math.min(Math.floor(totalInt * 0.8 + attributes.qiyun * 0.5 + critAdd), 95),
    critDmg: Math.floor(150 + totalInt * 0.5 + critDmgAdd),
    attackSpeed: Math.floor(100 + totalAgi * 0.5 + spdAdd),
    maxHpBonus: slotKeys.reduce((sum, slot) => {
      const item = slotItem(slot);
      return sum + (item?.hp || 0) * (item ? enhanceMult(slot) : 1);
    }, 0),
    maxMpBonus: slotKeys.reduce((sum, slot) => {
      const item = slotItem(slot);
      return sum + (item?.mp || 0) * (item ? enhanceMult(slot) : 1);
    }, 0),
    finalDamage: 0,
    defIgnore: 0,
    critResist: 0,
    cdReduction: 0,
    mpCostReduction: 0,
    debuffResist: pBuff?.debuffResist || 0,
    castSpeed: spdAdd,
    lifesteal: pBuff?.lifesteal || 0,
    dmgReduction: 0,
    expBonus: 0,
    practiceEfficiency: 100,
    meditationEfficiency: 100,
  };
}

function calcMaxHp(character: Character): number {
  const base = 100 + character.attributes.gengu * 10 + character.realmLevel * 15 + character.luohai * 3;
  const hpMult = character.phenomenon ? (PHENOMENA[character.phenomenon]?.buff.hpMult || 1) : 1;
  return Math.floor((base + character.stats.maxHpBonus + character.bonusHpCap) * hpMult);
}

function calcMaxMp(character: Character): number {
  const base = 60 + character.attributes.ganzhi * 5 + character.realmLevel * 8 + character.mingyuan * 2;
  const mpMult = character.phenomenon ? (PHENOMENA[character.phenomenon]?.buff.mpMult || 1) : 1;
  return Math.floor((base + character.stats.maxMpBonus + character.bonusMpCap) * mpMult);
}

/** Calculate a rough combat power score from character stats */
function calcPower(character: Character): number {
  const stats = character.stats;
  const hp = character.maxHp || 100;
  const mp = character.maxMp || 60;
  const atkPower = (stats?.attack || 10) * 2;
  const defPower = (stats?.defense || 5) * 1.5;
  const hpPower = hp * 0.5;
  const mpPower = mp * 0.3;
  const critPower = (stats?.critRate || 0) * 12 + (stats?.critDmg || 150) * 0.5;
  const spdPower = (stats?.attackSpeed || 100) * 0.2;
  const realmPower = character.realmLevel * 80 + (character.realm ? 200 : 0);
  return Math.floor(atkPower + defPower + hpPower + mpPower + critPower + spdPower + realmPower);
}

// 每个 realmLevel 所需修为（战斗经验驱动境界等级）
function calcExpToNext(_realm: string, realmLevel: number): number {
  // 越高境界realmLevel需要越多修为
  return Math.floor(80 + realmLevel * 25);
}

// 突破所需最大realmLevel（达到此等级后可手动突破）
function calcBreakthroughLevel(realmIdx: number): number {
  // 大境界（圆满）突破需要更高等级
  const isBig = realmIdx % 4 === 3;
  return isBig ? 15 : 10;
}

// 战斗描述语言（遮天风格）
const COMBAT_HIT_PHRASES = [
  '以浑厚神力轰出一拳',
  '运转苦海源力，爆发冲击',
  '一掌拍出，劲气澎湃',
  '以肉身之力强行碾压',
  '源力凝聚于拳，势如奔雷',
];
const COMBAT_CRIT_PHRASES = [
  '苦海源力爆发，金色气血喷涌而出——暴击！',
  '以九秘之力强化拳劲，一拳洞穿防御——暴击！',
  '气血如金色烈火升腾，势不可挡——暴击！',
  '肉身之力达到极限，爆发出惊天一击——暴击！',
  '触发临字秘加持，力量暴增，一击重创——暴击！',
];

const initialEquipment: EquipmentSlots = {
  weapon: 'iron_rod', head: null, body: 'cloth_robe', waist: null, hands: null, feet: null,
};
const initialAutoSettings: AutoSettings = {
  autoCombat: false, autoLoot: true, autoPotion: true, autoPotionThreshold: 30,
};

function buildInitialCharacter(name: string, gender: 'male' | 'female', physique: string = 'mortal'): Character {
  const attrs: CharacterAttributes = {
    shenli: rollAttr(), gengu: rollAttr(), sudu: rollAttr(),
    ganzhi: rollAttr(), mianrong: rollAttr(), qiyun: rollAttr(),
  };
  // Apply physique bonuses
  if (physique === 'warrior') attrs.shenli += 2;
  else if (physique === 'dao') attrs.ganzhi += 2;
  else if (physique === 'dragon') attrs.gengu += 2;
  const base: Character = {
    name, gender,
    realm: 'bitterness_early', realmLevel: 1, age: 16,
    exp: 0, expToNext: calcExpToNext('bitterness_early', 1), potential: 100,
    physique: physique as Character['physique'],
    reputation: 0, kills: 0, deathCount: 0,
    hp: 0, maxHp: 0, mp: 0, maxMp: 0, energy: 100, maxEnergy: 100,
    yuankuai: 0, gold: 100, silver: 50,
    attributes: attrs,
    stats: {
      attack: 0, defense: 0, hit: 80, dodge: 40, parry: 20,
      critRate: 5, critDmg: 150, attackSpeed: 100, maxHpBonus: 0, maxMpBonus: 0,
      finalDamage: 0, defIgnore: 0, critResist: 0, cdReduction: 0, mpCostReduction: 0,
      debuffResist: 0, castSpeed: 0, lifesteal: 0, dmgReduction: 0, expBonus: 0,
      practiceEfficiency: 100, meditationEfficiency: 100,
    },
    luohai: 10, mingyuan: 0, shengqiao: 0, wuzang: [0, 0, 0, 0, 0],
    sect: '', sectRank: '', contribution: 0, master: '',
    guildId: '', guildRank: '',
    inventory: ['qi_recovery_pill', 'qi_recovery_pill', 'qi_recovery_pill', 'iron_rod', 'cloth_robe', 'regen_potion'],
    equipment: { ...initialEquipment },
    enhanceLevels: {},
    skills: [...STARTER_SKILLS.map(s => ({ ...s })), ...BASE_GONGFA.map(s => ({ ...s }))],
    currentRoomId: 'guiyuan_village',
    dungeonProgress: {},
    dungeonSweepCounts: {},
    pkMode: false,
    autoSettings: { ...initialAutoSettings },
    cultivationMode: 'none',
    cultivationStartMs: 0,
    bonusHpCap: 0,
    bonusMpCap: 0,
    lastSaveMs: Date.now(),
    phenomenon: null,
    phenomenonUnlocked: false,
    phenomenonRerollCount: 0,
    chosenPhenomenon: null,
    autoCastSkills: [],
    skillEquipment: {
      longevity: 'base_longevity', attack: 'base_attack', defense: 'base_defense',
      escape: 'base_escape', body: 'base_body', soul: 'base_soul',
      array: 'base_array', source: 'base_source',
    },
  };
  base.stats = calcStats(base);
  base.maxHp = calcMaxHp(base);
  base.maxMp = calcMaxMp(base);
  base.hp = base.maxHp;
  base.mp = base.maxMp;
  return base;
}

interface GameState {
  screen: 'login' | 'create' | 'game';
  gamePhase: 'login' | 'create' | 'game'; // alias for App.tsx compat
  character: Character;
  combat: CombatState;
  messages: ChatMessage[];
  quests: string[];

  openWindows: Set<FloatWindowId>;
  currentZoneId: string | null;
  currentZoneRoomId: string | null;
  // Generated zone map (also used for dungeons)
  zoneRooms: Record<string, GenRoom>;
  currentGenRoomId: string;
  // Dungeon tracking
  dungeonCompletedRooms: Set<string>;
  dungeonCompletion: number;
  // Sect map state
  sectMapId: string | null;
  sectMapRoomId: string;
  prevWorldRoomId: string;
  // Sect quests
  sectQuests: Quest[];
  lastDailyQuestReset: string; // date string

  // uid of the logged-in Firebase user
  uid: string | null;

  // Current private chat target
  privateChatTarget: string | null;

  // Achievement and Title systems
  achievementManager: AchievementManager;
  titleManager: TitleManager;
  activeWorldEvents: WorldEvent[];

  // Actions
  loginAsGuest: () => void;
  loginWithUser: (uid: string, email: string) => Promise<void>;
  login: (name: string) => void;
  createCharacter: (name: string, gender: 'male' | 'female', physique?: string) => void;
  addMessage: (msg: { channel: string; sender: string; content: string; id?: string }) => void;
  move: (direction: string) => void;
  moveToRoom: (roomId: string) => void;
  moveZone: (roomId: string) => void;
  moveGenRoom: (dir: string) => void;
  attack: (npcId: string) => void;
  tickCombat: () => void;
  flee: () => void;
  talkTo: (npcId: string) => void;
  lookRoom: () => void;
  useItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: string) => void;
  pickupItem: (itemId: string) => void;
  dropItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  practiceSkill: (skillId: string) => void;
  useSkill: (skillId: string, targetId?: string) => void;
  joinSect: (sectId: string) => void;
  promoteSectRank: () => void;
  donateToSect: (goldAmount: number, yuankuaiAmount: number) => void;
  claimSectSalary: () => void;
  enterDungeon: (dungeonId: string) => void;
  completeDungeonRoom: () => void;
  solvePuzzle: (answerIdx: number) => void;
  lootTreasureRoom: () => void;
  handleTrapRoom: () => void;
  restInDungeon: () => void;
  completeDungeon: () => void;
  sweepDungeon: (dungeonId: string, count: number) => void;
  exitDungeon: () => void;
  enterZone: (zoneId: string) => void;
  enterZoneById: (zoneId: string) => void;
  exitZone: () => void;
  exitGenZone: () => void;
  toggleWindow: (id: FloatWindowId) => void;
  closeWindow: (id: FloatWindowId) => void;
  setAutoCombat: (on: boolean) => void;
  setAutoPotion: (on: boolean) => void;
  setPotionThreshold: (v: number) => void;
  processCommand: (input: string) => void;
  breakthrough: () => void;
  meditate: () => void;
  acceptQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  rerollPhenomenon: () => void;
  choosePhenomenon: (phenId: PhenomenonId) => void;
  buyShopItem: (itemId: string) => void;
  startCultivation: (mode: CultivationMode) => void;
  stopCultivation: () => void;
  toggleAutoCast: (skillId: string) => void;
  tickCultivation: () => void;
  applyOfflineProgress: () => void;
  learnSectSkill: (skillId: string) => void;
  equipSkill: (skillId: string, slotType: SkillType) => void;
  unequipSkill: (slotType: SkillType) => void;
  enterSectMap: (sectId: string) => void;
  exitSectMap: () => void;
  moveSectRoom: (roomId: string) => void;
  // Sect quest actions
  refreshSectQuests: () => void;
  acceptSectQuest: (questId: string) => void;
  completeSectQuest: (questId: string) => void;
  abandonSectQuest: (questId: string) => void;
  // Sect shop actions
  sectShopItems: SectShopItem[];
  buySectShopItem: (itemId: string) => void;
  refreshSectShop: () => void;
  // Character update
  updateCharacter: (updates: Partial<Character>) => void;
  // Private chat
  setPrivateChatTarget: (target: string | null) => void;

  // Phase 2: Trade system
  sendTradeRequest: (targetName: string) => void;
  acceptTrade: (tradeId: string) => void;
  cancelTrade: (tradeId: string) => void;

  // Phase 2: Warehouse system
  storeItem: (itemId: string) => void;
  withdrawItem: (itemId: string) => void;

  // Phase 2: Forge/Craft system
  forgeItem: (recipeId: string) => void;
  combineItems: (itemId: string) => void;

  // Phase 2: Party system
  createParty: () => void;
  joinParty: (partyId: string) => void;
  leaveParty: (partyId: string) => void;
  enterPartyDungeon: (dungeonId: string, partyId: string) => void;

  // Achievement system
  checkAchievements: () => void;
  claimAchievementReward: (achievementId: string) => void;

  // Title system
  setActiveTitle: (titleId: string | null) => void;

  // World events
  checkWorldEvents: () => void;
  triggerWorldEvent: (eventId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => {
  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    set(s => ({
      messages: [...s.messages.slice(-150), { ...msg, id: uid(), timestamp: new Date() }],
    }));
  };

  const addAnnouncement = (content: string, sender = '世界', color = '#ffd700') => {
    set(s => ({
      messages: [...s.messages.slice(-150), {
        channel: 'system' as const,
        sender,
        content,
        color,
        isAnnouncement: true,
        id: uid(),
        timestamp: new Date(),
      }],
    }));
  };

  const getChar = () => get().character;
  const getCombat = () => get().combat;

  const updateQuestProgress = (type: string, targetId?: string, count = 1) => {
    const state = get();
    const char = state.character;
    const activeQuestIds = state.quests || [];
    let completedQuestIds: string[] = [];

    set(s => {
      const newMessages = [...s.messages];
      let questsUpdated = false;

      activeQuestIds.forEach(questId => {
        const def = QUESTS[questId];
        if (!def) return;

        def.objectives.forEach(obj => {
          if (obj.completed) return;
          let shouldIncrement = false;

          switch (type) {
            case 'kill':
              shouldIncrement = (obj.type === 'kill' || obj.type === 'kill_boss') && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'talk':
              shouldIncrement = obj.type === 'talk' && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'travel':
              shouldIncrement = (obj.type === 'travel' || obj.type === 'explore' || obj.type === 'visit') &&
                (!obj.targetId || obj.targetId === targetId);
              break;
            case 'collect':
              shouldIncrement = obj.type === 'collect' && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'breakthrough':
              shouldIncrement = obj.type === 'breakthrough';
              break;
            case 'reach_level':
              shouldIncrement = obj.type === 'reach_level' && char.realmLevel >= parseInt(obj.targetId || '0');
              break;
            case 'enter_dungeon':
              shouldIncrement = obj.type === 'enter_dungeon' && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'complete_dungeon':
              shouldIncrement = obj.type === 'complete_dungeon' && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'find_item':
              shouldIncrement = obj.type === 'find_item' && (!obj.targetId || obj.targetId === targetId);
              break;
            case 'alchemy':
              shouldIncrement = obj.type === 'alchemy';
              break;
            case 'enhance':
              shouldIncrement = obj.type === 'enhance';
              break;
            case 'cultivate':
              shouldIncrement = obj.type === 'cultivate';
              break;
          }

          if (shouldIncrement) {
            obj.current = (obj.current || 0) + count;
            if (obj.current >= (obj.required || 1)) {
              obj.current = obj.required;
              obj.completed = true;
            }
            questsUpdated = true;
          }
        });

        if (def.objectives.every(o => o.completed)) {
          completedQuestIds.push(questId);
        }
      });

      if (questsUpdated) {
        set(s2 => ({ quests: [...s2.quests] }));
      }

      return s;
    });

    completedQuestIds.forEach(questId => {
      const def = QUESTS[questId];
      if (!def) return;
      const char = get().character;

      addMessage({ channel: 'system', sender: '任务', content: `完成任务【${def.title}】！获得 ${def.rewards.exp} 修为经验${def.rewards.gold} 金叶。` });

      const rewardItems = def.rewards.items || [];
      let newInv = [...char.inventory, ...rewardItems];
      const newQuests = (get().quests || []).filter(id => id !== questId);

      if (def.rewards.items && def.rewards.items.length > 0) {
        addMessage({ channel: 'system', sender: '任务', content: `获得物品：${def.rewards.items.map(id => ITEMS[id]?.name || id).join('、')}` });
      }

      updateChar(c => ({
        exp: c.exp + def.rewards.exp,
        gold: c.gold + def.rewards.gold,
        inventory: newInv,
      }));

      set(s => ({ quests: newQuests }));

      if (def.questType === 'main' && def.rewards.reputation) {
        updateChar(c => ({
          reputation: c.reputation + Object.values(def.rewards.reputation || {}).reduce((a, b) => a + b, 0),
        }));
      }
    });
  };

  const updateChar = (updater: (c: Character) => Partial<Character>) => {
    set(s => {
      const partial = updater(s.character);
      const merged = { ...s.character, ...partial };
      const stats = calcStats(merged);
      const maxHp = calcMaxHp({ ...merged, stats });
      const maxMp = calcMaxMp({ ...merged, stats });
      return {
        character: {
          ...merged, stats,
          maxHp, maxMp,
          hp: Math.min(merged.hp, maxHp),
          mp: Math.min(merged.mp, maxMp),
    },

    // ── 私聊目标设置 ─────────────────────────────────────────────────────────
    setPrivateChatTarget: (target: string | null) => {
      set({ privateChatTarget: target });
    },
  };
});
  };

  return {
    screen: 'login',
    uid: null,
    privateChatTarget: null,
    character: buildInitialCharacter('旅行者', 'male'),
    combat: {
      isInCombat: false, inDungeon: false, dungeonId: null, dungeonRoom: 0,
      dungeonScore: 0, dungeonDeaths: 0, dungeonSteps: 0,
      targetId: null, targetName: '', targetHp: 0, targetMaxHp: 0, targetLevel: 1,
      autoCombat: false, autoLoot: false, combatLog: [], turnCount: 0,
      comboCount: 0, maxComboCount: 0, playerBuffs: [], targetDebuffs: [],
    },
    messages: [],
    quests: INITIAL_QUEST_IDS,
    openWindows: new Set<FloatWindowId>(),
    currentZoneId: null,
    currentZoneRoomId: null,
    zoneRooms: {},
    currentGenRoomId: '',
    dungeonCompletedRooms: new Set<string>(),
    dungeonCompletion: 0,
    sectMapId: null,
    sectMapRoomId: '',
    prevWorldRoomId: 'guiyuan_village',
    sectQuests: [],
    lastDailyQuestReset: '',
    sectShopItems: [],
    gamePhase: 'login',
    achievementManager: new AchievementManager(),
    titleManager: new TitleManager(),
    activeWorldEvents: [],

    loginAsGuest: () => {
      set({ screen: 'create', gamePhase: 'create' });
    },

    loginWithUser: async (uid: string, _email: string) => {
      void _email;
      set({ uid });
      // Try to load existing character from Firebase
      const saved = await loadCharacter(uid);
      if (saved) {
        // Restore saved character; recalc derived stats in case code changed
        const char = saved as Character;
        const stats = calcStats(char);
        const maxHp = calcMaxHp({ ...char, stats });
        const maxMp = calcMaxMp({ ...char, stats });
        const restored: Character = {
          ...char, stats, maxHp, maxMp,
          // Ensure new fields exist on old saves
          dungeonSweepCounts: char.dungeonSweepCounts || {},
          dungeonProgress: char.dungeonProgress || {},
        };
        set({ character: restored, screen: 'game', gamePhase: 'game' });
        registerPresence({
          uid: char.name,
          name: char.name,
          realm: char.realm,
          realmName: REALM_NAMES[char.realm],
          roomId: char.currentRoomId,
          zoneId: null,
          level: char.realmLevel,
          sect: char.sect || '',
          sectRank: char.sectRank || '',
        });
        // Save ranking data on login
        const powerScore = calcPower(restored);
        savePlayerRanking(char.name, { name: char.name, realmLevel: char.realmLevel, realm: char.realm, sect: char.sect || '散修', power: powerScore, kills: char.kills || 0 });
        setTimeout(() => {
          addMessage({ channel: 'system', sender: '系统', content: `欢迎回来${char.name}。` });
          addMessage({ channel: 'system', sender: '系统', content: `当前境界${REALM_NAMES[char.realm]} Lv.${char.realmLevel}` });
          const room = ROOMS[char.currentRoomId];
          if (room) {
            addMessage({ channel: 'room', sender: room.name, content: room.description });
            addMessage({ channel: 'system', sender: '出口', content: room.exits.map(e => e.label).join(' | ') });
          }
        }, 100);
      } else {
        // No character yet - go to create screen
        set({ screen: 'create', gamePhase: 'create' });
      }
    },

    login: (_name: string) => {
      void _name;
      set({ screen: 'create', gamePhase: 'create' });
    },

    createCharacter: (name: string, gender: 'male' | 'female') => {
      // Sanitize name input
      const sanitizedName = name.replace(/[<>"'&]/g, '').trim().slice(0, 20);
      if (!sanitizedName || sanitizedName.length < 2) {
        addMessage({ channel: 'system', sender: '系统', content: '角色名需要2-20个字符。' });
        return;
      }
      const char = buildInitialCharacter(sanitizedName, gender);
      const { uid } = get();
      set({ character: char, screen: 'game', gamePhase: 'game' });
      registerPresence({
        uid: char.name,
        name: char.name,
        realm: char.realm,
        realmName: REALM_NAMES[char.realm],
        roomId: char.currentRoomId,
        zoneId: null,
        level: char.realmLevel,
        sect: char.sect || '',
        sectRank: char.sectRank || '',
      });
      // Save ranking data on new character
      savePlayerRanking(char.name, { name: char.name, realmLevel: char.realmLevel, realm: char.realm, sect: char.sect || '散修', power: calcPower(char), kills: 0 });
      // Save to Firebase if logged in
      if (uid) saveCharacter(uid, char);
      setTimeout(() => {
        addMessage({ channel: 'system', sender: '系统', content: `【弹指遮天】欢迎，${name}。你以一个凡人之身踏入东荒，命运从此改变。` });
        addMessage({ channel: 'system', sender: '系统', content: `你的当前境界${REALM_NAMES[char.realm]}。苦海初开，源力如涓涓细流。` });
        addMessage({ channel: 'system', sender: '系统', content: `体质${char.physique === 'mortal' ? '凡人之躯（可通过特殊机遇觉醒）' : char.physique}` });
        const room = ROOMS[char.currentRoomId];
        if (room) {
          addMessage({ channel: 'room', sender: room.name, content: room.description });
          addMessage({ channel: 'system', sender: '出口', content: room.exits.map(e => e.label).join(' | ') });
        }
        setTimeout(() => {
          addMessage({ channel: 'system', sender: '新手引导', content: '━━━━━━ 新手指南 ━━━━━━' });
          addMessage({ channel: 'system', sender: '①', content: '输入 look 或点击📍观察当前房间的人和物' });
          addMessage({ channel: 'system', sender: '②', content: '点击方向或输入 n/s/e/w 移动探索世界' });
          addMessage({ channel: 'system', sender: '③', content: '遇到敌人点击攻击，战斗胜利获得经验与金钱' });
          addMessage({ channel: 'system', sender: '④', content: '输入 equip 装备名 穿上装备提升战力' });
          addMessage({ channel: 'system', sender: '⑤', content: '输入 help 查看所有可用指令' });
          addMessage({ channel: 'system', sender: '⑥', content: '点击底部工具条打开背包、技能、任务等面板' });
          addMessage({ channel: 'system', sender: '提示', content: '村外树林有低级妖兽可练手，先与引路老人交谈接取任务！' });
        }, 600);
      }, 100);
    },

    addMessage,

    move: (direction: string) => {
      const { currentZoneId, currentZoneRoomId, zoneRooms, currentGenRoomId } = get();
      if (currentGenRoomId && Object.keys(zoneRooms).length > 0) {
        const room = zoneRooms[currentGenRoomId];
        const exit = room?.exits.find(e => e.dir === direction || e.label.includes(direction));
        if (exit) {
          get().moveGenRoom(exit.dir);
        } else {
          addMessage({ channel: 'system', sender: '系统', content: '此方向无法通行' });
        }
        return;
      }
      if (currentZoneId) {
        // Zone内移动
        const zone = ZONES[currentZoneId];
        const curRoom = zone?.rooms.find(r => r.id === currentZoneRoomId);
        const exit = curRoom?.exits.find(e => e.direction === direction || e.label.includes(direction));
        if (exit) {
          get().moveZone(exit.roomId);
        } else {
          addMessage({ channel: 'system', sender: '系统', content: '此方向无法通行' });
        }
        return;
      }
      const char = getChar();
      const room = ALL_ROOMS[char.currentRoomId];
      const exit = room?.exits.find(e => e.direction === direction);
      if (!exit) {
        addMessage({ channel: 'system', sender: '系统', content: '此方向无路可走' });
        return;
      }
      const newRoom = ALL_ROOMS[exit.roomId];
      if (!newRoom) {
        addMessage({ channel: 'system', sender: '系统', content: '目标房间不存在' });
        return;
      }

      updateChar(() => ({ currentRoomId: newRoom.id }));

      updatePresence(char.name, {
        roomId: newRoom.id,
        level: char.realmLevel,
      });

      updateQuestProgress('travel', newRoom.id);

      addMessage({ channel: 'room', sender: newRoom.name, content: newRoom.description });
      if (newRoom.danger && newRoom.danger > 0) {
        addMessage({ channel: 'system', sender: '感知', content: `危险等级: ${'！'.repeat(newRoom.danger)}` });
      }
      addMessage({ channel: 'system', sender: '出口', content: newRoom.exits.map(e => e.label).join(' | ') });

      const npcsHere = (newRoom.npcs || []).map(id => NPCS[id]).filter(Boolean);
      const hostile = npcsHere.find(n => n.isHostile);
      if (hostile) {
        addMessage({ channel: 'combat', sender: '遭遇', content: `${hostile.name}】挡住了去路！` });
        set(s => ({
          combat: {
            ...s.combat, isInCombat: true,
            targetId: hostile.id, targetName: hostile.name,
            targetHp: hostile.hp, targetMaxHp: hostile.maxHp, targetLevel: hostile.level || 1,
          },
        }));
      }
    },

    moveToRoom: (roomId: string) => {
      const { currentZoneId } = get();
      if (currentZoneId) return; // Don't use in zones
      const char = getChar();
      const room = ALL_ROOMS[char.currentRoomId];
      if (!room) return;
      const exit = room.exits.find(e => e.roomId === roomId);
      if (!exit) {
        addMessage({ channel: 'system', sender: '系统', content: '此区域无法通行' });
        return;
      }
      const newRoom = ALL_ROOMS[roomId];
      if (!newRoom) return;

      updateChar(() => ({ currentRoomId: newRoom.id }));
      
      updateQuestProgress('travel', newRoom.id);

      addMessage({ channel: 'room', sender: newRoom.name, content: newRoom.description });
      if (newRoom.danger && newRoom.danger > 0) {
        addMessage({ channel: 'system', sender: '感知', content: `危险等级: ${'！'.repeat(newRoom.danger)}` });
      }
      addMessage({ channel: 'system', sender: '出口', content: newRoom.exits.map(e => e.label).join(' | ') });

      const npcsHere = (newRoom.npcs || []).map(id => NPCS[id]).filter(Boolean);
      const hostile = npcsHere.find(n => n.isHostile);
      if (hostile) {
        addMessage({ channel: 'combat', sender: '遭遇', content: `${hostile.name}】挡住了去路！` });
        set(s => ({
          combat: {
            ...s.combat, isInCombat: true,
            targetId: hostile.id, targetName: hostile.name,
            targetHp: hostile.hp, targetMaxHp: hostile.maxHp, targetLevel: hostile.level || 1,
          },
        }));
      }
    },

    moveZone: (roomId: string) => {
      const { currentZoneId } = get();
      if (!currentZoneId) return;
      const zone = ZONES[currentZoneId];
      const newRoom = zone?.rooms.find(r => r.id === roomId);
      if (!newRoom) return;

      set({ currentZoneRoomId: roomId });
      addMessage({ channel: 'room', sender: newRoom.name, content: newRoom.description });
      addMessage({ channel: 'system', sender: '出口', content: newRoom.exits.map(e => e.label).join(' | ') });

      const hostileNpcs = newRoom.npcs.map(id => ZONE_NPCS[id]).filter(n => n?.isHostile);
      if (hostileNpcs.length > 0) {
        const enemy = hostileNpcs[0];
        addMessage({ channel: 'combat', sender: '遭遇', content: `${enemy.name}】发出凶猛的嚎叫，向你攻来！` });
        set(s => ({
          combat: {
            ...s.combat, isInCombat: true,
            targetId: enemy.id, targetName: enemy.name,
            targetHp: enemy.hp, targetMaxHp: enemy.maxHp, targetLevel: enemy.level || 1,
          },
        }));
      }
    },

    attack: (npcId: string) => {
      const allNpcs = { ...NPCS, ...ZONE_NPCS };
      const npc = allNpcs[npcId];
      if (!npc || !npc.isHostile) {
        addMessage({ channel: 'system', sender: '系统', content: '无法攻击该目标' });
        return;
      }
      set(s => ({
        combat: {
          ...s.combat, isInCombat: true,
          targetId: npcId, targetName: npc.name,
          targetHp: npc.hp, targetMaxHp: npc.maxHp, targetLevel: npc.level || 1,
        },
      }));
      addMessage({ channel: 'combat', sender: '战斗', content: `你向${npc.name}】发起攻击！` });
    },

    tickCombat: () => {
      const state = get();
      const { combat } = state;
      if (!combat.isInCombat || !combat.targetId) return;

      const char = getChar();
      const autoPotion = char.autoSettings.autoPotion;
      const threshold = char.autoSettings.autoPotionThreshold;

      // 自动喝药
      if (autoPotion && char.hp < char.maxHp * (threshold / 100)) {
        const potionId = char.inventory.find(id => {
          const item = ITEMS[id];
          return item && item.type === 'consumable' && (item.hp || 0) > 0;
        });
        if (potionId) {
          get().useItem(potionId);
          return;
        }
      }

      // 技能冷却

set(s => ({
        character: {
          ...s.character,
          skills: s.character.skills.map(sk => ({
            ...sk, currentCooldown: Math.max(0, sk.currentCooldown - 1),
          })),
        },
      }));

      // 自动战斗：智能技能选择
      if (combat.autoCombat && char.autoCastSkills.length > 0) {
        const availableSkills = char.skills.filter(s =>
          char.autoCastSkills.includes(s.id) &&
          s.currentCooldown <= 0 &&
          char.mp >= s.mpCost
        );

        const hpPercent = char.hp / char.maxHp;
        const turnCount = combat.turnCount || 0;

        // 优先级：治疗(HP<50%) > Buff(前2回合) > 攻击
        let autoSkill = availableSkills.find(s => s.type === 'heal' && hpPercent < 0.5);
        if (!autoSkill) {
          autoSkill = availableSkills.find(s => s.type === 'buff' && turnCount <= 2);
        }
        if (!autoSkill) {
          autoSkill = availableSkills.find(s => s.type === 'attack');
        }
        if (!autoSkill) {
          autoSkill = availableSkills[0];
        }

        if (autoSkill) {
          get().useSkill(autoSkill.id);
          // 技能释放后，跳过普通攻击
          const state2 = get();
          if (!state2.combat.isInCombat) return; // 敌人可能已被技能击杀
        }
      }

      // ── Buff/Debuff 持续效果处理 ──
      const currentBuffs = [...(get().combat.playerBuffs || [])];
      const currentDebuffs = [...(get().combat.targetDebuffs || [])];
      let newBuffs: typeof currentBuffs = [];
      let newDebuffs: typeof currentDebuffs = [];
      let dotTotal = 0;
      let dotSource = '';

      // 处理玩家 buff：递减持续时间 + 每回合回复效果 + 移除过期的
      let healPerTurnTotal = 0;
      if (currentBuffs.length > 0) {
        healPerTurnTotal = currentBuffs.filter(b => b.healPerTurn && b.healPerTurn > 0)
          .reduce((sum, b) => sum + (b.healPerTurn || 0), 0);
        newBuffs = currentBuffs
          .map(b => ({ ...b, duration: b.duration - 1 }))
          .filter(b => b.duration > 0);
      }

      // 处理目标 debuff：递减持续时间 + DoT 伤害
      if (currentDebuffs.length > 0) {
        const dotSources: string[] = [];
        currentDebuffs.forEach(d => {
          // 使用 CombatBuff.dotDamage（已在 createScaledBuff 中算好）
          if (d.dotDamage && d.dotDamage > 0) {
            dotTotal += d.dotDamage;
            dotSources.push(d.name);
          }
        });
        dotSource = dotSources.length > 1
          ? dotSources.slice(0, -1).join('、') + '、' + dotSources[dotSources.length - 1]
          : dotSources[0] || '';
        newDebuffs = currentDebuffs
          .map(d => ({ ...d, duration: d.duration - 1 }))
          .filter(d => d.duration > 0);
      }

      // ── 每回合回复效果（玩家 buff 回血） ──
      if (healPerTurnTotal > 0) {
        updateChar(c => ({ hp: Math.min(c.maxHp, c.hp + healPerTurnTotal) }));
        addMessage({ channel: 'combat', sender: '🌿', content: `持续回复效果使你恢复 ${healPerTurnTotal} 点气血！` });
      }

      // 应用 DoT 伤害到目标
      if (dotTotal > 0) {
        const dotTargetHp = Math.max(0, combat.targetHp - dotTotal);
        addMessage({ channel: 'combat', sender: '🔥', content: `${dotSource}灼烧${combat.targetName}】，造成 ${dotTotal} 点额外伤害！` });
        const dotLog = `🔥 ${dotTotal}  [灼烧] ${combat.targetName}`;
        const currentLog = get().combat.combatLog || [];
        set(s => ({ combat: { ...s.combat, targetHp: dotTargetHp, playerBuffs: newBuffs, targetDebuffs: newDebuffs, combatLog: [...currentLog, dotLog].slice(-50) } }));

        // DoT 击杀
        if (dotTargetHp <= 0) {
          // 敌人被灼烧击杀，走击败逻辑（后面 tickCombat 会走到 defeat 分支）
          // 先更新 targetHp，后面正常逻辑判断
        }
      } else if (currentBuffs.length > 0 || currentDebuffs.length > 0) {
        // 没有 DoT，只更新 buff/debuff 持续
        set(s => ({ combat: { ...s.combat, playerBuffs: newBuffs, targetDebuffs: newDebuffs } }));
      }

      const stats = char.stats;

      // ── 每回合消耗精力 ──
      const energyCost = 2;
      if (char.energy < energyCost) {
        addMessage({ channel: 'system', sender: '战斗', content: '精力不足，无法继续战斗！' });
        set(s => ({ combat: { ...s.combat, isInCombat: false, targetId: null, targetName: '' } }));
        return;
      }
      updateChar(c => ({ energy: Math.max(0, c.energy - energyCost) }));

      // ── 应用 Buff 属性加成 ──
      const buffedAttack = stats.attack + (newBuffs.length > 0
        ? newBuffs.filter(b => b.stat === 'attack').reduce((sum, b) => sum + b.value, 0)
        : 0);
      const buffedCritRate = Math.min(95, stats.critRate + (newBuffs.length > 0
        ? newBuffs.filter(b => b.stat === 'critRate').reduce((sum, b) => sum + b.value, 0)
        : 0));
      const buffedCritDmg = stats.critDmg + (newBuffs.length > 0
        ? newBuffs.filter(b => b.stat === 'critDmg').reduce((sum, b) => sum + b.value, 0)
        : 0);
      const buffedDodge = stats.dodge + (newBuffs.length > 0
        ? newBuffs.filter(b => b.stat === 'dodge').reduce((sum, b) => sum + b.value, 0)
        : 0);

      // ── 应用 Debuff 属性减益（敌人） ──
      const debuffedTargetArmor = (combat.targetLevel || 1) * 2 + 5
        + (newDebuffs.filter(d => d.stat === 'defense').reduce((sum, d) => sum + d.value, 0));

      const targetLevel = combat.targetLevel;

      // ── 境界压制（渐进式） ──
      const levelDiff = char.realmLevel - targetLevel;
      // 每级 3%，最高 3x/最低 0.3x
      const suppression = Math.max(0.3, Math.min(3.0, 1 + levelDiff * 0.03));
      const playerDmgMult = suppression;
      const enemyDmgMult = Math.max(0.3, Math.min(3.0, 1 - levelDiff * 0.03));

      // ── 玩家攻击 ──
      const hit = Math.random() * 100 < stats.hit;
      if (hit) {
        // 攻击 - 防御 * 减伤系数（防御收益递减）
        const defMitigation = buffedAttack > 0 ? Math.max(0.3, 1 - debuffedTargetArmor / (buffedAttack + debuffedTargetArmor + 50)) : 0.5;
        const baseDmg = Math.max(5, Math.floor(buffedAttack * defMitigation * (0.85 + Math.random() * 0.3)));
        // 暴击判定（含 buff 加成）
        const isCrit = Math.random() * 100 < buffedCritRate;
        // 连击加成：每层 +5%，最高 10 层 = +50%
        const combo = get().combat.comboCount || 0;
        const comboMult = 1 + Math.min(combo, 10) * 0.05;
        // 最终伤害（含 buff 暴伤加成）
        let finalDmg = Math.floor(baseDmg * playerDmgMult * comboMult * (isCrit ? buffedCritDmg / 100 : 1));
        // 暴击浮动加成（高暴击率时暴击伤害额外提升）
        if (isCrit && buffedCritRate >= 50) {
          finalDmg = Math.floor(finalDmg * (1 + (buffedCritRate - 50) * 0.002));
        }
        // 更新连击
        set(s => ({ combat: { ...s.combat, comboCount: (s.combat.comboCount || 0) + 1, maxComboCount: Math.max(s.combat.maxComboCount || 0, (s.combat.comboCount || 0) + 1) } }));
        const phrase = isCrit
          ? COMBAT_CRIT_PHRASES[Math.floor(Math.random() * COMBAT_CRIT_PHRASES.length)]
          : COMBAT_HIT_PHRASES[Math.floor(Math.random() * COMBAT_HIT_PHRASES.length)];

        const newTargetHp = Math.max(0, combat.targetHp - finalDmg);
        const comboStr = combo > 0 ? ` [连击×${combo + 1}]` : '';
        const critStr = isCrit ? '暴击！' : '';
        const combatMsg = `${phrase}，对${combat.targetName}】造成 ${finalDmg} 点伤害${comboStr}。（${newTargetHp}/${combat.targetMaxHp}）`;
        addMessage({ channel: 'combat', sender: '战斗', content: combatMsg });
        const combatLogEntry = `${critStr}${isCrit ? '⚡' : '▸'} ${finalDmg}  → ${combat.targetName}${comboStr}`;
        const newLog = [...(combat.combatLog || []), combatLogEntry].slice(-50);
        set(s => ({ combat: { ...s.combat, combatLog: newLog } }));

        // ── 吸血效果：玩家有 lifesteal buff 时回复生命 ──
        const lifestealBuffs = (newBuffs || []).filter(b => b.lifestealPercent && b.lifestealPercent > 0);
        if (lifestealBuffs.length > 0) {
          const totalLifestealPct = lifestealBuffs.reduce((sum, b) => sum + (b.lifestealPercent || 0), 0);
          const healAmt = Math.max(1, Math.floor(finalDmg * totalLifestealPct / 100));
          updateChar(c => ({ hp: Math.min(c.maxHp, c.hp + healAmt) }));
          addMessage({ channel: 'combat', sender: '战斗', content: `吸血效果：恢复 ${healAmt} 点气血！` });
        }

        if (newTargetHp <= 0) {
          // 击败敌人
          const allNpcs = { ...NPCS, ...ZONE_NPCS };
          const npc = allNpcs[combat.targetId!];
          const expGain = npc?.expReward || 0;
          const goldGain = npc?.goldReward || 0;
          const drops = npc?.drops || [];
          // 战斗胜利给门派贡献值（按exp的10%）
          const contribGain = Math.max(1, Math.floor(expGain * 0.1));

          addMessage({ channel: 'combat', sender: '战斗', content: `${combat.targetName}被击败！获得 ${expGain} 修为经验 ${goldGain} 金叶。` });

          // 掉落物品 - 自动拾取（低等级敌人掉落率更高）
          const lootItems: string[] = [];
          const levelBonus = Math.max(0, 10 - (combat.targetLevel || 1));
          drops.forEach(d => {
            const dropRate = 0.5 + levelBonus * 0.03;
            if (Math.random() < dropRate && ITEMS[d]) lootItems.push(d);
          });
          if (lootItems.length > 0) {
            addMessage({ channel: 'system', sender: '拾取', content: `获得: ${lootItems.map(i => ITEMS[i]?.name).join('、')}` });
          }

          // 更新角色
          let newExp = char.exp + expGain;
          const newInventory = [...char.inventory];
          lootItems.forEach(i => {
            if (newInventory.length < 100) newInventory.push(i);
          });
          const newKills = char.kills + 1;

          // 经验溢出处理：修为条驱动境界等级
          let realmLevel = char.realmLevel;
          let expToNext = calcExpToNext(char.realm, realmLevel);
          while (newExp >= expToNext) {
            newExp -= expToNext;
            realmLevel += 1;
            expToNext = calcExpToNext(char.realm, realmLevel);
            addMessage({ channel: 'system', sender: '精进', content: `修为精进${REALM_NAMES[char.realm]} Lv.${realmLevel}！` });
          }

          // Sync ranking on kill/level-up
          // Recalc stats with new realmLevel for accurate power
          const updatedCharForPower = { ...char, realmLevel, kills: newKills };
          updatedCharForPower.stats = calcStats(updatedCharForPower as Character);
          updatedCharForPower.maxHp = calcMaxHp(updatedCharForPower as Character);
          updatedCharForPower.maxMp = calcMaxMp(updatedCharForPower as Character);
          const newPower = calcPower(updatedCharForPower as Character);
          savePlayerRanking(char.name, { name: char.name, realmLevel, realm: char.realm, sect: char.sect || '散修', power: newPower, kills: newKills });

          updateChar(c => ({
            exp: newExp,
            expToNext: calcExpToNext(char.realm, realmLevel),
            gold: c.gold + goldGain,
            realmLevel,
            inventory: newInventory,
            kills: newKills,
            contribution: c.sect ? (c.contribution || 0) + contribGain : (c.contribution || 0),
            age: c.age + 1,
          }));

          updateQuestProgress('kill', combat.targetId || undefined);

          // 副本处理
          if (combat.inDungeon) {
            const { currentGenRoomId, zoneRooms } = get();
            const room = zoneRooms[currentGenRoomId];
            if (room) {
              // 提取怪物名称（去?gen_ 前缀?              const npcName = combat.targetId?.startsWith('gen_') ? combat.targetId.substring(4) : combat.targetName;
              
              // 更新房间数据：标记怪物已死亡，添加尸体
              const newZoneRooms = { ...zoneRooms };
              const newRoom = { ...room };
              newRoom.deadNpcs = [...(room.deadNpcs || []), npcName];
              newRoom.corpses = [...(room.corpses || []), { name: npcName, looted: true }];
              newZoneRooms[currentGenRoomId] = newRoom;

              // 检查是否所有怪物都已死亡
              const aliveNpcs = room.npcTemplates.filter(n => !(newRoom.deadNpcs || []).includes(n)).length;
              
              set(s => ({
                zoneRooms: newZoneRooms,
                combat: {
                  ...s.combat,
                  isInCombat: false, targetId: null, targetName: '',
                  targetHp: 0, targetMaxHp: 0,
                },
              }));

              // 只有所有怪物都死了才完成房间
              if (aliveNpcs === 0) {
                addMessage({ channel: 'system', sender: '房间', content: `${room.name}】的敌人已全部清除！` });
                get().completeDungeonRoom();
              }
            } else {
              // 如果找不到房间，正常结束战斗
              set(s => ({
                combat: {
                  ...s.combat,
                  isInCombat: false, targetId: null, targetName: '',
                  targetHp: 0, targetMaxHp: 0,
                },
              }));
            }
          } else {
            // 普通区域处理

set(s => ({
              combat: {
                ...s.combat,
                isInCombat: false, targetId: null, targetName: '',
                targetHp: 0, targetMaxHp: 0, turnCount: 0,
              },
            }));
            // 自动战斗：胜利后自动攻击同房间下一个敌人

if(combat.autoCombat) {
              const freshChar = getChar();
              const { currentZoneId: zid, currentZoneRoomId: zrid } = get();
              let nextNpcId: string | null = null;
              if (zid && zrid) {
                const zone = ZONES[zid];
                const zRoom = zone?.rooms.find(r => r.id === zrid);
                const hostileIds = (zRoom?.npcs || []).filter(id => ZONE_NPCS[id]?.isHostile && id !== combat.targetId);
                nextNpcId = hostileIds[0] ?? null;
              } else {
                const room = ROOMS[freshChar.currentRoomId];
                const hostileIds = (room?.npcs || []).filter(id => NPCS[id]?.isHostile && id !== combat.targetId);
                nextNpcId = hostileIds[0] ?? null;
              }
              if (nextNpcId) {
                setTimeout(() => get().attack(nextNpcId!), 400);
              }
            }
          }
          return;
        }

        set(s => ({ combat: { ...s.combat, targetHp: newTargetHp } }));
      } else {
        addMessage({ channel: 'combat', sender: '战斗', content: `你的攻击被${combat.targetName}】躲开了！连击中断！` });
        set(s => ({ combat: { ...s.combat, comboCount: 0 } }));
      }

      // ── 状态效果检查：眩晕/冰冻/放逐的敌人跳过反击 ──
      const enemyStunBuffs = (newDebuffs || []).filter(d => d.effectType === 'stun' || d.effectType === 'freeze');
      const enemyStunned = enemyStunBuffs.length > 0;

      // 敌人反击
      const allNpcs = { ...NPCS, ...ZONE_NPCS };
      const npc = allNpcs[combat.targetId!];
      if (!npc && !enemyStunned) return;

      if (enemyStunned) {
        addMessage({ channel: 'combat', sender: '战斗', content: `${combat.targetName}】处于${enemyStunBuffs[0].name}状态，无法反击！` });
      } else {
      // ── 敌人反击（含暴击/闪避/状态判定） ──
      const enemyHitMod = (newDebuffs || []).filter(d => d.stat === 'hit').reduce((sum, d) => sum + d.value, 0);
      const enemyHitRate = Math.max(15, 50 + (npc.level || targetLevel) * 1.5 + enemyHitMod); // 敌人命中率（debuff降低）
      const enemyDodge = stats.dodge || 10;
      const enemyHit = Math.random() * 100 < enemyHitRate;
      const playerDodged = !enemyHit || Math.random() * 100 < enemyDodge * 0.5; // 玩家闪避
      if (enemyHit && !playerDodged) {
        // 恐惧/沉默效果：降低敌人伤害
        const hasFear = (newDebuffs || []).some(d => d.effectType === 'fear');
        const hasSilence = (newDebuffs || []).some(d => d.effectType === 'silence');
        const fearMult = hasFear ? 0.6 : 1;
        const silenceMult = hasSilence ? 0.5 : 1;

        // 敌人伤害：攻击 - 玩家防御 * 减伤率
        const defMitigation = npc.attack > 0 ? Math.max(0.3, 1 - char.stats.defense / (npc.attack + char.stats.defense + 30)) : 0.5;
        const enemyBaseDmg = Math.max(3, Math.floor(npc.attack * defMitigation * (0.85 + Math.random() * 0.3) * fearMult * silenceMult));
        // 敌人暴击（精英/Boss更高）
        const npcTag = (npc.id || npc.name || '').toLowerCase();
        const enemyCritRate = npcTag.includes('boss') ? 20 : npcTag.includes('elite') || npcTag.includes('精英') ? 10 : 5;
        const enemyCrit = Math.random() * 100 < enemyCritRate;
        const enemyDmg = Math.floor(enemyBaseDmg * enemyDmgMult * (enemyCrit ? 1.5 : 1));
        const newHp = Math.max(0, char.hp - enemyDmg);
        const critTag = enemyCrit ? '【暴击】' : '';
        addMessage({ channel: 'combat', sender: combat.targetName, content: `${combat.targetName}】${critTag}反击，对你造成 ${enemyDmg} 点伤害。（${newHp}/${char.maxHp}）` });
        updateChar(() => ({ hp: newHp }));
        // 连击中断 + combatLog
        const enemyLog = `${enemyCrit ? '⚡' : '◂'} ${enemyDmg}  来自 ${combat.targetName}${enemyCrit ? ' [暴击]' : ''}`;
        const { combatLog = [] } = get().combat;
        set(s => ({ combat: { ...s.combat, comboCount: 0, combatLog: [...combatLog, enemyLog].slice(-50) } }));

        if (newHp <= 0) {
          const deathCount = (char.deathCount || 0) + 1;
          addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
          addMessage({ channel: 'system', sender: '⚰️', content: `你的气血耗尽，${combat.targetName}】将你击败！` });
          addMessage({ channel: 'system', sender: '复活', content: `你被送回${ROOMS['guiyuan_village']?.name || '归元村'}，气血恢复50%。` });
          if (deathCount > 1) {
            addMessage({ channel: 'system', sender: '统计', content: `你已阵亡 ${deathCount} 次。胜败乃兵家常事，大侠请重新来过。` });
          }
          addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
          // Track dungeon death for rating
          if (get().combat.inDungeon) {
            set(s => ({ combat: { ...s.combat, dungeonDeaths: (s.combat.dungeonDeaths || 0) + 1 } }));
          }
          set(s => ({
            combat: { ...s.combat, isInCombat: false, targetId: null, targetName: '', targetHp: 0, targetMaxHp: 0, inDungeon: false, turnCount: 0 },
            currentZoneId: null, currentZoneRoomId: null,
          }));
          updateChar(c => ({ hp: Math.floor(c.maxHp * 0.5), mp: Math.floor(c.maxMp * 0.3), currentRoomId: 'guiyuan_village', deathCount }));
        }
      } else {
        addMessage({ channel: 'combat', sender: combat.targetName, content: `${combat.targetName}】的攻击被你闪过！` });
      }
      }
    },

    flee: () => {
      if (!getCombat().isInCombat) return;
      const success = Math.random() < 0.6;
      if (success) {
        addMessage({ channel: 'combat', sender: '逃跑', content: '你成功脱离战斗！' });
        set(s => ({
          combat: { ...s.combat, isInCombat: false, targetId: null, targetName: '', targetHp: 0, targetMaxHp: 0, inDungeon: false },
          currentZoneId: null, currentZoneRoomId: null,
        }));
      } else {
        addMessage({ channel: 'combat', sender: '逃跑', content: '逃跑失败' });
        get().tickCombat();
      }
    },

    talkTo: (npcId: string) => {
      const allNpcs = { ...NPCS, ...ZONE_NPCS };
      const npc = allNpcs[npcId];
      const sectNpc = SECT_NPC_MAP[npcId];
      const functionNpc = SECT_FUNCTION_NPC_MAP[npcId];
      if (!npc && !sectNpc && !functionNpc) {
        addMessage({ channel: 'say', sender: '系统', content: '找不到该人物' });
        return;
      }
      // Open alchemy panel for alchemy function NPCs or the world alchemy_master
      const isAlchemyNpc = functionNpc?.functionType === 'alchemy' || npc?.id === 'alchemy_master';
      if (isAlchemyNpc) {
        const alchemyName = functionNpc?.name || npc?.name || '炼丹师';
        const alchemyDialogues = functionNpc?.dialogue || npc?.dialogue || [];
        const line = alchemyDialogues[Math.floor(Math.random() * alchemyDialogues.length)] || '老夫炼丹六十年，有什么需要？';
        addMessage({ channel: 'say', sender: alchemyName, content: line });
        set(s => {
          const next = new Set(s.openWindows);
          next.add('alchemy');
          return { openWindows: next };
        });
        return;
      }
      const isHostile = npc?.isHostile || false;
      if (isHostile) {
        addMessage({ channel: 'say', sender: npc.name, content: '（此人对你充满敌意，不接受对话）' });
        return;
      }
      const name = npc?.name || sectNpc?.name || functionNpc?.name || '未知';
      const dialogue = sectNpc?.dialogue || functionNpc?.dialogue || npc?.dialogue || [];
      const line = dialogue[Math.floor(Math.random() * dialogue.length)] || '此人无话可说';
      addMessage({ channel: 'say', sender: name, content: line });
      updateQuestProgress('talk', npcId);

      const state = get();
      const char = state.character;
      const activeIds = new Set(state.quests);
      const npcQuests = Object.values(QUESTS).filter(q => {
        if (activeIds.has(q.id)) return false;
        if (q.prerequisite && q.prerequisite.length > 0) {
          const prereqsMet = q.prerequisite.every(preId => activeIds.has(preId));
          if (!prereqsMet) return false;
        }
        return char.realmLevel >= q.levelRequirement;
      });
      if (npcQuests.length > 0) {
        addMessage({ channel: 'system', sender: '任务', content: `${name}】有以下任务可接：` });
        npcQuests.slice(0, 5).forEach(q => {
          addMessage({ channel: 'system', sender: '任务', content: `【${q.title}】${q.description}（奖励${q.rewards.exp}修为/${q.rewards.gold}金叶）` });
        });
      }

      const completable = Object.values(QUESTS).filter(q => {
        if (!activeIds.has(q.id)) return false;
        return q.objectives.every(o => (o.current || 0) >= (o.required || 1));
      });
      if (completable.length > 0) {
        addMessage({ channel: 'system', sender: '任务', content: `${name}】处有以下任务可完成：` });
        completable.slice(0, 5).forEach(q => {
          addMessage({ channel: 'system', sender: '任务', content: `【${q.title}】（已达成，奖励${q.rewards.exp}修为/${q.rewards.gold}金叶）` });
        });
      }
    },

    lookRoom: () => {
      const { currentZoneId, currentZoneRoomId, zoneRooms, currentGenRoomId } = get();
      if (currentGenRoomId && Object.keys(zoneRooms).length > 0) {
        const room = zoneRooms[currentGenRoomId];
        if (room) {
          addMessage({ channel: 'room', sender: room.name, content: room.description });
          if (room.npcTemplates.length > 0) {
            addMessage({ channel: 'system', sender: '敌人', content: room.npcTemplates.map(n => `${n}】`).join(' ') });
          }
          if (room.isBoss) {
            addMessage({ channel: 'system', sender: '感知', content: '此地气机沉重，似有首领盘' });
          }
          addMessage({ channel: 'system', sender: '出口', content: room.exits.map(e => e.label).join(' | ') || '无出口' });
        }
        return;
      }
      if (currentZoneId) {
        const zone = ZONES[currentZoneId];
        const room = zone?.rooms.find(r => r.id === currentZoneRoomId);
        if (room) {
          addMessage({ channel: 'room', sender: room.name, content: room.description });
          addMessage({ channel: 'system', sender: '出口', content: room.exits.map(e => e.label).join(' | ') });
        }
        return;
      }
      const char = getChar();
      const room = ALL_ROOMS[char.currentRoomId];
      if (!room) return;
      addMessage({ channel: 'room', sender: room.name, content: room.description });
      const npcsHere = room.npcs
        .map(id => NPCS[id] || ZONE_NPCS[id])
        .filter(Boolean);
      const sectNpcsHere = room.npcs
        .map(id => SECT_NPC_MAP[id] || SECT_FUNCTION_NPC_MAP[id])
        .filter(Boolean);
      if (npcsHere.length > 0) {
        // Use 【name?brackets so MessageLog renders clickable attack/talk buttons
        const hostile = npcsHere.filter(n => n.isHostile);
        const friendly = npcsHere.filter(n => !n.isHostile);
        if (hostile.length > 0) {
          addMessage({ channel: 'system', sender: '敌人', content: hostile.map(n => `${n.name}】`).join(' ') });
        }
        if (friendly.length > 0) {
          addMessage({ channel: 'system', sender: '人物', content: friendly.map(n => `${n.name}】`).join(' ') });
        }
      }
      if (sectNpcsHere.length > 0) {
        addMessage({ channel: 'system', sender: '人物', content: sectNpcsHere.map(n => `${n.name}】`).join(' ') });
      }
      const itemsHere = room.items.map(id => ITEMS[id]).filter(Boolean);
      if (itemsHere.length > 0) {
        addMessage({ channel: 'system', sender: '物品', content: itemsHere.map(i => i.name).join('、') });
      }
      addMessage({ channel: 'system', sender: '出口', content: room.exits.map(e => e.label).join(' | ') });
    },

    useItem: (itemId: string) => {
      const char = getChar();
      const idx = char.inventory.indexOf(itemId);
      if (idx === -1) {
        addMessage({ channel: 'system', sender: '系统', content: '背包中没有该物品' });
        return;
      }
      const item = ITEMS[itemId];
      if (!item || item.type !== 'consumable') {
        addMessage({ channel: 'system', sender: '系统', content: '该物品不可使' });
        return;
      }
      const hpHeal = item.hp || 0;
      const mpHeal = item.mp || 0;
      const newHp = Math.min(char.maxHp, char.hp + hpHeal);
      const newMp = Math.min(char.maxMp, char.mp + mpHeal);

      // 2. 永久属性提升（bonusStr——...神力, bonusCon→根骨, bonusAgi→速度, bonusInt→感知）
      let permStr = 0, permCon = 0, permAgi = 0, permInt = 0;
      if (item.bonusStr) permStr = item.bonusStr;
      if (item.bonusCon) permCon = item.bonusCon;
      if (item.bonusAgi) permAgi = item.bonusAgi;
      if (item.bonusInt) permInt = item.bonusInt;

      // 3. 临时 buff 效果（战斗中生效）
      const combat = getCombat();
      let buffMsg = '';
      let updatedBuffs = [...(combat.playerBuffs || [])];
      if (item.consumableEffects && item.consumableEffects.length > 0) {
        item.consumableEffects.forEach(eff => {
          const buff = {
            id: `item_${itemId}_${eff.stat}`,
            name: item.name,
            description: eff.description || `${eff.stat} ${eff.value > 0 ? '+' : ''}${eff.value}`,
            type: 'buff',
            stat: eff.stat,
            value: eff.value,
            duration: eff.duration,
            icon: eff.icon || '💊',
          };
          // 移除同类型旧 buff（刷新持续时间）
          updatedBuffs = updatedBuffs.filter(b => !b.id.startsWith(`item_${itemId}_`));
          updatedBuffs.push(buff);
          buffMsg += `，${eff.description || `${eff.stat}+${eff.value}`}持续${eff.duration}回合`;
        });
        set(s => ({ combat: { ...s.combat, playerBuffs: updatedBuffs } }));
      }

      // 4. 移除已使用的物品
      const newInv = [...char.inventory];
      newInv.splice(idx, 1);

      // 5. 构建消息
      let msg = `服用${item.name}】`;
      if (hpHeal > 0) msg += `，恢复${Math.min(hpHeal, char.maxHp - char.hp)} 点气血`;
      if (mpHeal > 0) msg += `，恢复${Math.min(mpHeal, char.maxMp - char.mp)} 点神力`;
      if (permStr > 0 || permCon > 0 || permAgi > 0 || permInt > 0) {
        const parts = [];
        if (permStr > 0) parts.push(`神力+${permStr}`);
        if (permCon > 0) parts.push(`根骨+${permCon}`);
        if (permAgi > 0) parts.push(`速度+${permAgi}`);
        if (permInt > 0) parts.push(`感知+${permInt}`);
        msg += `，永久提升${parts.join('、')}`;
      }
      msg += buffMsg;
      addMessage({ channel: 'system', sender: '使用', content: msg });

      // 6. 更新角色状态
      let newAttrs: typeof char.attributes | undefined;
      if (permStr > 0 || permCon > 0 || permAgi > 0 || permInt > 0) {
        newAttrs = { ...char.attributes };
        if (permStr > 0) newAttrs.shenli += permStr;
        if (permCon > 0) newAttrs.gengu += permCon;
        if (permAgi > 0) newAttrs.sudu += permAgi;
        if (permInt > 0) newAttrs.ganzhi += permInt;
      }
      updateChar(() => ({
        inventory: newInv,
        ...(hpHeal > 0 || mpHeal > 0 ? { hp: newHp, mp: newMp } : {}),
        ...(newAttrs ? { attributes: newAttrs } : {}),
      }));
    },

    equipItem: (itemId: string) => {
      const char = getChar();
      if (!char.inventory.includes(itemId)) return;
      const item = ITEMS[itemId];
      if (!item || !item.slot) {
        addMessage({ channel: 'system', sender: '系统', content: '该物品无法装' });
        return;
      }
      const slot = item.slot;
      const newInv = char.inventory.filter(id => id !== itemId);
      const old = char.equipment[slot];
      if (old) newInv.push(old);
      const newEquip = { ...char.equipment, [slot]: itemId };
      let compareMsg = '';
      if (old) {
        const oldItem = ITEMS[old];
        if (oldItem) {
          const diffs: string[] = [];
          if (item.attack && item.attack !== oldItem.attack) {
            const diff = item.attack - (oldItem.attack || 0);
            diffs.push(`攻击${diff > 0 ? '+' + diff : diff}`);
          }
          if (item.defense && item.defense !== oldItem.defense) {
            const diff = item.defense - (oldItem.defense || 0);
            diffs.push(`防御${diff > 0 ? '+' + diff : diff}`);
          }
          if (diffs.length > 0) compareMsg = `（对比${oldItem.name}】：${diffs.join('，')}）`;
        }
      }
      addMessage({ channel: 'system', sender: '装备', content: `装备${item.name}】（${slot}部位${old ? `，卸下${ITEMS[old]?.name}】` : ''}${compareMsg}` });
      updateChar(() => ({ equipment: newEquip, inventory: newInv }));
    },

    unequipItem: (slot: string) => {
      const char = getChar();
      const itemId = char.equipment[slot as keyof EquipmentSlots];
      if (!itemId) return;
      const newEquip = { ...char.equipment, [slot]: null };
      const newInv = [...char.inventory, itemId];
      addMessage({ channel: 'system', sender: '卸装', content: `卸下${ITEMS[itemId]?.name}】` });
      updateChar(() => ({ equipment: newEquip, inventory: newInv }));
    },

    pickupItem: (itemId: string) => {
      const char = getChar();
      const room = ALL_ROOMS[char.currentRoomId];
      if (!room) return;
      const item = ITEMS[itemId];
      if (!item) {
        addMessage({ channel: 'system', sender: '系统', content: '该物品不存在' });
        return;
      }
      if (!room.items.includes(itemId)) {
        addMessage({ channel: 'system', sender: '系统', content: `此处没有${item.name}】` });
        return;
      }
      const newRoomItems = room.items.filter(id => id !== itemId);
      const newInv = [...char.inventory, itemId];
      ALL_ROOMS[char.currentRoomId] = { ...room, items: newRoomItems };
      addMessage({ channel: 'system', sender: '拾取', content: `你捡起了${item.name}】` });
      updateQuestProgress('collect', itemId);
      updateChar(() => ({ inventory: newInv }));
    },

    dropItem: (itemId: string) => {
      const char = getChar();
      const idx = char.inventory.indexOf(itemId);
      if (idx === -1) {
        addMessage({ channel: 'system', sender: '系统', content: '背包中没有该物品' });
        return;
      }
      const item = ITEMS[itemId];
      if (!item) return;
      if (item.type === 'quest') {
        addMessage({ channel: 'system', sender: '系统', content: '任务物品不可丢弃' });
        return;
      }
      const newInv = char.inventory.filter(id => id !== itemId);
      const room = ALL_ROOMS[char.currentRoomId];
      if (room) {
        ALL_ROOMS[char.currentRoomId] = { ...room, items: [...room.items, itemId] };
      }
      addMessage({ channel: 'system', sender: '丢弃', content: `你丢弃了${item.name}】` });
      updateChar(() => ({ inventory: newInv }));
    },

    sellItem: (itemId: string) => {
      const char = getChar();
      const idx = char.inventory.indexOf(itemId);
      if (idx === -1) {
        addMessage({ channel: 'system', sender: '系统', content: '背包中没有该物品' });
        return;
      }
      const item = ITEMS[itemId];
      if (!item) return;
      if (item.type === 'quest') {
        addMessage({ channel: 'system', sender: '系统', content: '任务物品不可出售' });
        return;
      }
      const sellPrice = Math.floor(item.value / 2);
      const newInv = char.inventory.filter(id => id !== itemId);
      addMessage({ channel: 'system', sender: '出售', content: `你出售了${item.name}】，获得 ${sellPrice} 金叶` });
      updateChar(c => ({ inventory: newInv, gold: c.gold + sellPrice }));
    },

    practiceSkill: (skillId: string) => {
      const char = getChar();
      const skillIdx = char.skills.findIndex(s => s.id === skillId);
      if (skillIdx === -1) return;
      const skill = char.skills[skillIdx];
      const mpCost = 10;
      if (char.mp < mpCost) {
        addMessage({ channel: 'system', sender: '修炼', content: '神力不足，无法修' });
        return;
      }
      const gain = Math.floor(Math.random() * 15) + 5;
      const newSkills = [...char.skills];
      let newPracticeExp = skill.practiceExp + gain;
      let newLevel = skill.level;
      if (newPracticeExp >= skill.practiceExpMax && skill.level < skill.maxLevel) {
        newPracticeExp = 0;
        newLevel += 1;
        addMessage({ channel: 'system', sender: '突破', content: `${skill.name}】修炼有成，提升至第 ${newLevel} 层！` });
      }
      newSkills[skillIdx] = { ...skill, practiceExp: newPracticeExp, level: newLevel };
      addMessage({ channel: 'system', sender: '修炼', content: `修炼${skill.name}】，领悟 ${gain} 点感悟。（${newPracticeExp}/${skill.practiceExpMax}）` });
      updateChar(() => ({ skills: newSkills, mp: char.mp - mpCost }));
      
    },

    useSkill: (skillId: string) => {
      const char = getChar();
      const skill = char.skills.find(s => s.id === skillId);
      if (!skill) return;
      if (skill.currentCooldown > 0) {
        addMessage({ channel: 'system', sender: '技能', content: `${skill.name}】冷却中（剩余${skill.currentCooldown}回合）` });
        return;
      }
      if (char.mp < skill.mpCost) {
        addMessage({ channel: 'system', sender: '技能', content: `神力不足，${skill.name}】需要${skill.mpCost}点神力。` });
        return;
      }
      updateChar(() => ({ mp: char.mp - skill.mpCost }));

      const combat = getCombat();
      if (skill.type === 'heal' && skill.heal) {
        const healAmt = skill.heal + skill.level * 10;
        updateChar(c => ({ hp: Math.min(c.maxHp, c.hp + healAmt) }));
        addMessage({ channel: 'combat', sender: '技能', content: `施展${skill.name}】，恢复 ${healAmt} 点气血。` });
      } else if (skill.type === 'attack' && skill.damage && combat.isInCombat) {
        const dmg = skill.damage + skill.level * 15;
        const newTargetHp = Math.max(0, combat.targetHp - dmg);
        addMessage({ channel: 'combat', sender: '技能', content: `${skill.name}】轰${combat.targetName}】，造成 ${dmg} 点伤害！` });

        // ── 攻击技能附加 debuff（含 effectChance 几率判定） ──
        let updatedDebuffs = [...(getCombat().targetDebuffs || [])];
        if (hasDebuffEffect(skillId)) {
          const def = SKILL_BUFF_EFFECTS[skillId];
          // effectChance: 有几率设定的按几率判定
          const shouldApply = !def?.effectChance || Math.random() * 100 < def.effectChance;
          if (shouldApply) {
            const debuff = createScaledBuff(skillId, skill.level);
            if (debuff) {
              // 移除同类型旧 debuff（刷新持续时间）
              updatedDebuffs = updatedDebuffs.filter(d => d.id !== debuff.id);
              updatedDebuffs.push(debuff);
            }
          }
        }
        set(s => ({
          combat: { ...s.combat, targetHp: newTargetHp, targetDebuffs: updatedDebuffs },
        }));
        // If target dies from skill, trigger a tickCombat to run full victory logic
        if (newTargetHp <= 0) {
          setTimeout(() => get().tickCombat(), 50);
        }
      } else if (skill.type === 'buff') {
        // ── 增益技能附加 buff ──
        let updatedBuffs = [...(getCombat().playerBuffs || [])];
        const buff = createScaledBuff(skillId, skill.level);
        if (buff) {
          // 移除同类型旧 buff（刷新持续时间）
          updatedBuffs = updatedBuffs.filter(b => b.id !== buff.id);
          updatedBuffs.push(buff);
          const extraEffects = getAdditionalEffects(skillId, skill.level);
          if (extraEffects.length > 0) {
            addMessage({ channel: 'combat', sender: '技能', content: `施展${skill.name}】，${buff.description}（攻击+${buff.value}，${extraEffects.map(e => `${e.stat === 'critRate' ? '暴击' : e.stat === 'critDmg' ? '暴伤' : e.stat}+${e.value}`).join('，')}，持续${buff.duration}回合）！` });
          } else {
            addMessage({ channel: 'combat', sender: '技能', content: `施展${skill.name}】，${buff.description}（${buff.value > 0 ? '+' : ''}${buff.value}，持续${buff.duration}回合）！` });
          }
        } else {
          addMessage({ channel: 'combat', sender: '技能', content: `施展${skill.name}】，战力大幅提升！` });
        }
        set(s => ({ combat: { ...s.combat, playerBuffs: updatedBuffs } }));
      }

      // 设置冷却
      set(s => ({
        character: {
          ...s.character,
          skills: s.character.skills.map(sk =>
            sk.id === skillId ? { ...sk, currentCooldown: skill.cooldown } : sk
          ),
        },
      }));
    },

    joinSect: (sectId: string) => {
      const char = getChar();
      if (char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你已身在门派，不可再' });
        return;
      }
      const sect = SECTS[sectId];
      if (!sect) return;
      const sectSkills = SECT_SKILLS[sectId] || [];
      const newSkills = [...char.skills];
      sectSkills.slice(0, 2).forEach(sk => {
        if (!newSkills.find(s => s.id === sk.id)) {
          newSkills.push({ ...sk });
        }
      });
      addMessage({ channel: 'system', sender: '门派', content: `你正式拜${sect.fullName}】，获赠门派武学${sectSkills.slice(0, 2).map(s => s.name).join('、')}。` });
      updateChar(() => ({ sect: sectId, sectRank: '外门弟子' as const, contribution: 0, skills: newSkills }));
    },

    promoteSectRank: () => {
      const char = getChar();
      if (!char.sect || !char.sectRank) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const currentIdx = SECT_RANK_ORDER.indexOf(char.sectRank as SectRank);
      if (currentIdx < 0 || currentIdx >= SECT_RANK_ORDER.length - 1) {
        addMessage({ channel: 'system', sender: '门派', content: '你已达到最高职位，无法再晋' });
        return;
      }
      const req = RANK_PROMO_REQS[char.sectRank as SectRank];
      if (!req) {
        addMessage({ channel: 'system', sender: '门派', content: '当前职位无法主动晋升，需由门派长老认' });
        return;
      }
      const realmIdx = REALM_ORDER.indexOf(char.realm);
      const reqRealmIdx = REALM_ORDER.indexOf(req.minRealm);
      if (realmIdx < reqRealmIdx) {
        addMessage({ channel: 'system', sender: '门派', content: `晋升需达到${REALM_NAMES[req.minRealm]}】，你当前修为不足。` });
        return;
      }
      if ((char.contribution || 0) < req.minContrib) {
        addMessage({ channel: 'system', sender: '门派', content: `晋升还需 ${req.minContrib - (char.contribution || 0)} 点门派贡献值。` });
        return;
      }
      // 检查门派功法数量要求

if(req.minSectSkills) {
        const sectSkillsCount = char.skills.filter(s => s.sect === char.sect).length;
        if (sectSkillsCount < req.minSectSkills) {
          addMessage({ channel: 'system', sender: '门派', content: `晋升需学会至少 ${req.minSectSkills} 种门派功法，你当前只学会了 ${sectSkillsCount} 种。` });
          return;
        }
      }
      // 检查声望要求

if(req.minReputation && char.reputation < req.minReputation) {
        addMessage({ channel: 'system', sender: '门派', content: `晋升需要 ${req.minReputation} 点声望，你当前只有 ${char.reputation} 点。` });
        return;
      }
      const nextRank = SECT_RANK_ORDER[currentIdx + 1];
      updateChar(c => ({ sectRank: nextRank, contribution: (c.contribution || 0) - req.minContrib }));
      addMessage({ channel: 'system', sender: '门派', content: `恭喜！你晋升${nextRank}】，可向更高阶长老请教功法。`, isAnnouncement: true });
      
      // 显示新职位的俸禄信息
      const salary = RANK_SALARY[nextRank];
      if (salary) {
        addMessage({ channel: 'system', sender: '门派', content: `作为${nextRank}，你每日可领取俸禄：${salary.gold}金叶${salary.yuankuai > 0 ? `${salary.yuankuai}源块`: ''}${salary.sectPoints}门派积分。` });
      }
    },

    // 捐献金叶获取贡献
    donateToSect: (goldAmount: number, yuankuaiAmount: number) => {
      const char = getChar();
      if (!char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      if (goldAmount < 0 || yuankuaiAmount < 0) {
        addMessage({ channel: 'system', sender: '门派', content: '捐献数额无效' });
        return;
      }
      if (char.gold < goldAmount || char.yuankuai < yuankuaiAmount) {
        addMessage({ channel: 'system', sender: '门派', content: '你的资源不足' });
        return;
      }
      const goldContrib = Math.floor(goldAmount * CONTRIB_SOURCES.donateGold);
      const yuankuaiContrib = Math.floor(yuankuaiAmount * CONTRIB_SOURCES.donateYuankuai);
      const totalContrib = goldContrib + yuankuaiContrib;
      
      updateChar(c => ({
        gold: c.gold - goldAmount,
        yuankuai: c.yuankuai - yuankuaiAmount,
        contribution: (c.contribution || 0) + totalContrib,
      }));
      addMessage({ channel: 'system', sender: '门派', content: `你向门派捐献 ${goldAmount} 金叶${yuankuaiAmount > 0 ? ` ${yuankuaiAmount} 源块`: ''}，获得 ${totalContrib} 点贡献值。` });
    },

    // 领取每日俸禄
    claimSectSalary: () => {
      const char = getChar();
      if (!char.sect || !char.sectRank) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const salary = RANK_SALARY[char.sectRank];
      if (!salary) {
        addMessage({ channel: 'system', sender: '门派', content: '当前职位没有俸禄可领' });
        return;
      }
      // 检查今日是否已领取
      const today = new Date().toDateString();
      const lastClaim = char.lastSalaryClaim;
      if (lastClaim === today) {
        addMessage({ channel: 'system', sender: '门派', content: '今日俸禄已领取，请明日再来' });
        return;
      }
      updateChar(c => ({
        gold: c.gold + salary.gold,
        yuankuai: c.yuankuai + salary.yuankuai,
        contribution: c.contribution + salary.sectPoints,
        lastSalaryClaim: today,
      }));
      addMessage({ channel: 'system', sender: '门派', content: `你领取了${char.sectRank}的每日俸禄：${salary.gold}金叶${salary.yuankuai > 0 ? `${salary.yuankuai}源块`: ''}${salary.sectPoints > 0 ? `${salary.sectPoints}贡献`: ''}。` });
    },

    enterDungeon: (dungeonId: string) => {
      const dungeon = DUNGEONS[dungeonId];
      if (!dungeon) return;
      const char = getChar();
      if (dungeon.prerequisite) {
        const preProgress = char.dungeonProgress[dungeon.prerequisite];
        if (!preProgress?.cleared) {
          addMessage({ channel: 'system', sender: '系统', content: `需要先通关${DUNGEONS[dungeon.prerequisite]?.name || dungeon.prerequisite}】才能进入此副本。` });
          return;
        }
      }
      if (char.realmLevel < dungeon.levelMin) {
        addMessage({ channel: 'system', sender: '系统', content: `等级不足（需要 Lv.${dungeon.levelMin}）。` });
        return;
      }

      addMessage({ channel: 'system', sender: '副本', content: `进入${dungeon.name}】……` });

      // Generate dungeon map as a zone, reuse the zone system
      const map = generateDungeonMap(dungeon);
      const entrance = map.rooms[map.entranceId];
      if (!entrance) return;

      // Convert DungeonGenRoom to GenRoom format for the zone system
      const genRooms: Record<string, GenRoom> = {};
      for (const room of Object.values(map.rooms)) {
        genRooms[room.id] = {
          id: room.id,
          name: room.name,
          description: room.description,
          x: room.x,
          y: room.y,
          exits: room.exits,
          npcTemplates: room.enemies ? room.enemies.map(e => e.name) : [],
          isEntrance: room.isEntrance,
          isBoss: room.isBoss,
          isElite: room.isElite,
          dangerLevel: room.dangerLevel,
          deadNpcs: [],
          corpses: [],
        };
      }

      // Save dungeon meta for completion tracking
      set({
        currentZoneId: dungeonId,
        currentZoneRoomId: map.entranceId,
        zoneRooms: genRooms,
        currentGenRoomId: map.entranceId,
        dungeonCompletedRooms: new Set<string>(),
        dungeonCompletion: 0,
        openWindows: new Set(), // Close all windows when entering dungeon
        combat: { ...get().combat, inDungeon: true, dungeonId, dungeonRoom: 0, dungeonScore: 0, dungeonDeaths: 0, dungeonSteps: 0 },
      });

      addMessage({ channel: 'room', sender: entrance.name, content: entrance.description });
      addMessage({ channel: 'system', sender: '出口', content: entrance.exits.map(e => e.label).join(' | ') });
      broadcastSystem(`${char.name} 进入${dungeon.name}】`);
      updateQuestProgress('enter_dungeon', dungeonId);
    },

    completeDungeonRoom: () => {
      const { combat, zoneRooms, currentGenRoomId, dungeonCompletedRooms } = get();
      if (!combat.dungeonId) return;
      const room = zoneRooms[currentGenRoomId];
      if (!room || dungeonCompletedRooms.has(room.id)) return;

      const newCompleted = new Set(dungeonCompletedRooms);
      newCompleted.add(room.id);
      const totalRooms = Object.keys(zoneRooms).length;
      const perRoom = Math.floor(100 / totalRooms);
      const completion = Math.min(100, newCompleted.size * perRoom);

      set({ dungeonCompletedRooms: newCompleted, dungeonCompletion: completion });
      addMessage({ channel: 'system', sender: '副本', content: `完成${room.name}】！进度${completion}%${newCompleted.size}/${totalRooms}）` });

      if (room.isBoss) {
        get().completeDungeon();
      }
    },

    solvePuzzle: (answerIdx: number) => {
      const { combat, zoneRooms, currentGenRoomId, dungeonCompletedRooms } = get();
      if (!combat.dungeonId || combat.isInCombat) return;
      // Find the DungeonGenRoom from the original map data
      const dungeon = DUNGEONS[combat.dungeonId];
      if (!dungeon) return;
      // Re-generate to get puzzle data (same seed would be ideal, but we check by room position)
      const room = zoneRooms[currentGenRoomId];
      if (!room || !room.npcTemplates || room.npcTemplates.length > 0) return;

      // Use dungeon puzzle pool ?puzzle rooms have no npcTemplates
      const puzzle = dungeon.puzzlePool.find(() =>
        room.npcTemplates.length === 0
      );
      if (!puzzle) return;
      if (dungeonCompletedRooms.has(room.id)) return;

      if (answerIdx === puzzle.answer) {
        addMessage({ channel: 'system', sender: '解密', content: `?回答正确！获${puzzle.rewardExp}修为。` });
        updateChar(c => ({
          exp: c.exp + puzzle.rewardExp,
          inventory: puzzle.rewardItems
            ? [...c.inventory, ...puzzle.rewardItems.filter(() => c.inventory.length < 100)]
            : c.inventory,
        }));
        get().completeDungeonRoom();
      } else {
        addMessage({ channel: 'system', sender: '解密', content: `回答错误${puzzle.hint ? '提示: ' + puzzle.hint : '再想想'}` });
      }
    },

    lootTreasureRoom: () => {
      const { combat, zoneRooms, currentGenRoomId, dungeonCompletedRooms } = get();
      if (!combat.dungeonId || combat.isInCombat) return;
      const room = zoneRooms[currentGenRoomId];
      if (!room || dungeonCompletedRooms.has(room.id)) return;
      // Treasure rooms have no enemies and aren't entrance/boss
      if (room.npcTemplates.length > 0 || room.isBoss || room.isEntrance) return;

      const dungeon = DUNGEONS[combat.dungeonId];
      const loot = dungeon?.lootPool[Math.floor(Math.random() * dungeon.lootPool.length)];
      if (!loot) return;

      addMessage({ channel: 'system', sender: '宝箱', content: `获得${loot.gold}金叶${loot.items.length}件物品！` });
      updateChar(c => ({
        gold: c.gold + loot.gold,
        inventory: [...c.inventory, ...loot.items.filter(() => c.inventory.length < 100)],
      }));
      get().completeDungeonRoom();
    },

    handleTrapRoom: () => {
      const { combat, zoneRooms, currentGenRoomId, dungeonCompletedRooms } = get();
      if (!combat.dungeonId || combat.isInCombat) return;
      const room = zoneRooms[currentGenRoomId];
      if (!room || dungeonCompletedRooms.has(room.id)) return;

      const char = getChar();
      const dmg = Math.floor(char.maxHp * (0.05 + Math.random() * 0.1));
      const dodged = Math.random() * 100 < char.stats.dodge;

      if (dodged) {
        addMessage({ channel: 'system', sender: '陷阱', content: `你敏捷地躲过了陷阱！` });
      } else {
        const actualDmg = Math.min(dmg, char.hp - 1);
        updateChar(c => ({ hp: Math.max(1, c.hp - actualDmg) }));
        addMessage({ channel: 'system', sender: '陷阱', content: `陷阱触发！受${actualDmg}点伤害。` });
      }
      get().completeDungeonRoom();
    },

    restInDungeon: () => {
      const { combat, dungeonCompletedRooms, currentGenRoomId, zoneRooms } = get();
      if (!combat.dungeonId || combat.isInCombat) return;
      const room = zoneRooms[currentGenRoomId];
      if (!room || dungeonCompletedRooms.has(room.id)) return;

      const char = getChar();
      const hpRestore = Math.floor(char.maxHp * 0.3);
      const mpRestore = Math.floor(char.maxMp * 0.3);
      updateChar(c => ({
        hp: Math.min(c.maxHp, c.hp + hpRestore),
        mp: Math.min(c.maxMp, c.mp + mpRestore),
      }));
      addMessage({ channel: 'system', sender: '休息', content: `稍作休整，恢${hpRestore}气血${mpRestore}神力。` });
      get().completeDungeonRoom();
    },

    completeDungeon: () => {
      const { combat } = get();
      if (!combat.dungeonId) return;
      const dungeon = DUNGEONS[combat.dungeonId];
      const char = getChar();

      addMessage({ channel: 'system', sender: '副本', content: `${dungeon.name}】通关！获得丰厚奖励！`, isAnnouncement: true });

      updateQuestProgress('complete_dungeon', combat.dungeonId || undefined);

      const rewardItems = dungeon.rewards.items.filter(() => char.inventory.length < 100);
      updateChar(c => ({
        exp: c.exp + dungeon.rewards.exp,
        gold: c.gold + dungeon.rewards.gold,
        inventory: [...c.inventory, ...rewardItems],
        dungeonProgress: {
          ...c.dungeonProgress,
          [combat.dungeonId!]: {
            ...c.dungeonProgress[combat.dungeonId!],
            cleared: true,
            totalRuns: (c.dungeonProgress[combat.dungeonId!]?.totalRuns || 0) + 1,
          },
        },
      }));

      const nextDungeon = Object.values(DUNGEONS).find(d => d.prerequisite === combat.dungeonId);
      if (nextDungeon) {
        addMessage({ channel: 'system', sender: '系统', content: `新副${nextDungeon.name}】已解锁！`, isAnnouncement: true });
      }

      // Exit to world
      // Calculate dungeon rating
      const score = combat.dungeonScore || 0;
      const deaths = combat.dungeonDeaths || 0;
      const steps = combat.dungeonSteps || 0;
      const ratingScore = Math.max(0, score - deaths * 200 - steps * 5);
      let rating: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' = 'bronze';
      const thresholds = dungeon.ratingThresholds || { bronze: 0, silver: 500, gold: 1000, platinum: 2000, diamond: 3500 };
      if (ratingScore >= thresholds.diamond) rating = 'diamond';
      else if (ratingScore >= thresholds.platinum) rating = 'platinum';
      else if (ratingScore >= thresholds.gold) rating = 'gold';
      else if (ratingScore >= thresholds.silver) rating = 'silver';

      if (ratingScore > (char.dungeonProgress[combat.dungeonId!]?.bestScore || 0)) {
        updateChar(c => ({
          dungeonProgress: {
            ...c.dungeonProgress,
            [combat.dungeonId!]: {
              ...c.dungeonProgress[combat.dungeonId!],
              bestRating: rating,
              bestScore: ratingScore,
              bestTime: steps,
            },
          },
        }));
      }

      addMessage({ channel: 'system', sender: '评级', content: `评分: ${ratingScore}分 | 评级: ${rating === 'diamond' ? '💎' : rating === 'platinum' ? '🏆' : rating === 'gold' ? '🥇' : rating === 'silver' ? '🥈' : '🥉'} ${rating}（死${deaths}次 · ${steps}步）` });

      set(s => ({
        combat: { ...s.combat, isInCombat: false, inDungeon: false, dungeonId: null, dungeonRoom: 0, dungeonScore: 0, dungeonDeaths: 0, dungeonSteps: 0 },
        currentZoneId: null, currentZoneRoomId: null, zoneRooms: {}, currentGenRoomId: '',
        dungeonCompletedRooms: new Set<string>(), dungeonCompletion: 0,
      }));
    },

    sweepDungeon: (dungeonId: string, count: number) => {
      const dungeon = DUNGEONS[dungeonId];
      if (!dungeon) return;
      const char = getChar();
      const progress = char.dungeonProgress[dungeonId];
      if (!progress?.cleared) {
        addMessage({ channel: 'system', sender: '系统', content: '需要先通关副本才能扫荡' });
        return;
      }
      if (char.realmLevel < dungeon.levelMin) {
        addMessage({ channel: 'system', sender: '系统', content: '等级不足，无法扫荡' });
        return;
      }
      const todaySweeps = char.dungeonSweepCounts[dungeonId] || 0;
      if (todaySweeps + count > dungeon.dailyLimit) {
        addMessage({ channel: 'system', sender: '系统', content: `今日扫荡次数不足（剩${Math.max(0, dungeon.dailyLimit - todaySweeps)}次）。` });
        return;
      }
      const totalExp = dungeon.sweepRewards.exp * count;
      const totalGold = dungeon.sweepRewards.gold * count;
      const sweepItems: string[] = [];
      for (let i = 0; i < count; i++) {
        for (const item of dungeon.sweepRewards.items) {
          if (Math.random() < 0.7 && char.inventory.length + sweepItems.length < 100) {
            sweepItems.push(item);
          }
        }
      }
      updateChar(c => ({
        exp: c.exp + totalExp,
        gold: c.gold + totalGold,
        inventory: [...c.inventory, ...sweepItems],
        dungeonSweepCounts: { ...c.dungeonSweepCounts, [dungeonId]: (c.dungeonSweepCounts[dungeonId] || 0) + count },
        dungeonProgress: {
          ...c.dungeonProgress,
          [dungeonId]: { ...c.dungeonProgress[dungeonId], totalRuns: (c.dungeonProgress[dungeonId]?.totalRuns || 0) + count },
        },
      }));
      const label = count === 1 ? '扫荡' : `×${count}扫荡`;
      addMessage({ channel: 'system', sender: '扫荡', content: `${label}${dungeon.name}】完成！获得${totalExp}修为${totalGold}金叶${sweepItems.length}件物品。` });
    },

    exitDungeon: () => {
      const dungeonId = get().combat.dungeonId;
      const dungeon = dungeonId ? DUNGEONS[dungeonId] : null;
      if (dungeon) addMessage({ channel: 'system', sender: '系统', content: `离开${dungeon.name}】，返回东荒大地。` });
      set(s => ({
        combat: { ...s.combat, isInCombat: false, inDungeon: false, dungeonId: null, dungeonRoom: 0 },
        currentZoneId: null, currentZoneRoomId: null, zoneRooms: {}, currentGenRoomId: '',
        dungeonCompletedRooms: new Set<string>(), dungeonCompletion: 0,
      }));
    },

    enterZone: (zoneId: string) => {
      const zone = ZONES[zoneId];
      if (!zone) return;
      set({ currentZoneId: zoneId, currentZoneRoomId: zone.entryRoomId });
      const entryRoom = zone.rooms.find(r => r.id === zone.entryRoomId);
      addMessage({ channel: 'system', sender: '系统', content: `进入${zone.name}】` });
      if (entryRoom) {
        addMessage({ channel: 'room', sender: entryRoom.name, content: entryRoom.description });
        addMessage({ channel: 'system', sender: '出口', content: entryRoom.exits.map(e => e.label).join(' | ') });
      }
    },

    exitZone: () => {
      const { currentZoneId } = get();
      if (currentZoneId) {
        const zone = ZONES[currentZoneId];
        addMessage({ channel: 'system', sender: '系统', content: `离开${zone?.name}】，返回东荒。` });
      }
      set({ currentZoneId: null, currentZoneRoomId: null });
      set(s => ({ combat: { ...s.combat, isInCombat: false } }));
    },

    // ── Generated zone (分层地图) ──────────────────────────────────────

    enterZoneById: (zoneId: string) => {
      const template = ZONE_TEMPLATES.find(t => t.id === zoneId);
      if (!template) return;
      addMessage({ channel: 'system', sender: '系统', content: `正在进入${template.displayName}】…` });
      // Generate deterministically (seed from Firebase or hash)
      getOrCreateZoneSeed(zoneId).then(seed => {
        const zone = generateZone(template, seed);
        const entrance = zone.rooms[zone.entranceId];
        set({
          currentZoneId: zoneId,
          currentZoneRoomId: zone.entranceId,
          zoneRooms: zone.rooms,
          currentGenRoomId: zone.entranceId,
        });
        addMessage({ channel: 'room', sender: entrance.name, content: entrance.description });
        broadcastSystem(`${get().character.name} 进入${template.displayName}】`);
      });
    },

    moveGenRoom: (dir: string) => {
      const { currentGenRoomId, zoneRooms } = get();
      const room = zoneRooms[currentGenRoomId];
      if (!room) return;
      const exit = room.exits.find(e => e.dir === dir);
      if (!exit) {
        addMessage({ channel: 'system', sender: '系统', content: '此方向无路可走' });
        return;
      }
      const next = zoneRooms[exit.toId];
      if (!next) return;
      set({ currentGenRoomId: exit.toId, currentZoneRoomId: exit.toId });
      // Track dungeon step for rating
      const curCombat = get().combat;
      if (curCombat.inDungeon) {
        set(s => ({ combat: { ...s.combat, dungeonSteps: (s.combat.dungeonSteps || 0) + 1 } }));
      }
      addMessage({ channel: 'room', sender: next.name, content: next.description });
      
      if (next.npcTemplates.length > 0) {
        addMessage({ channel: 'system', sender: '敌人', content: next.npcTemplates.map(n => `${n}】`).join(' ') });
        // Auto-engage first hostile NPC in generated zone
        const npcTag = next.npcTemplates[0];
        const char = getChar();
        const baseHp = 100 + char.realmLevel * 20 + next.dangerLevel * 50;
        addMessage({ channel: 'combat', sender: '遭遇', content: `${npcTag}】向你袭来！` });
        set(s => ({
          combat: {
            ...s.combat, isInCombat: true,
            targetId: 'gen_' + npcTag, targetName: npcTag,
            targetHp: baseHp, targetMaxHp: baseHp, targetLevel: char.realmLevel + next.dangerLevel - 1,
          },
        }));
      }
      if (next.isBoss) {
        addMessage({ channel: 'system', sender: '系统', content: '警告: 感受到强大的气息，区域首领就在附近！' });
      }
    },

    exitGenZone: () => {
      const { currentZoneId, combat } = get();
      // If in dungeon, use dungeon exit
      if (combat.inDungeon) {
        get().exitDungeon();
        return;
      }
      const character = get().character;
      const template = ZONE_TEMPLATES.find(t => t.id === currentZoneId);
      if (template) {
        addMessage({ channel: 'system', sender: '系统', content: `离开${template.displayName}】，返回东荒大地。` });
        broadcastSystem(`${character.name} 离开${template.displayName}】`);
      }
      set({ currentZoneId: null, currentZoneRoomId: null, zoneRooms: {}, currentGenRoomId: '' });
    },

    toggleWindow: (id: FloatWindowId) => {
      set(s => {
        const next = new Set(s.openWindows);
        if (next.has(id)) next.delete(id); else next.add(id);
        return { openWindows: next };
      });
    },

    closeWindow: (id: FloatWindowId) => {
      set(s => {
        const next = new Set(s.openWindows);
        next.delete(id);
        return { openWindows: next };
      });
    },

    setAutoCombat: (on: boolean) => {
      set(s => ({ combat: { ...s.combat, autoCombat: on } }));
      updateChar(c => ({ autoSettings: { ...c.autoSettings, autoCombat: on } }));
    },

    setAutoPotion: (on: boolean) => {
      updateChar(c => ({ autoSettings: { ...c.autoSettings, autoPotion: on } }));
    },

    setPotionThreshold: (v: number) => {
      updateChar(c => ({ autoSettings: { ...c.autoSettings, autoPotionThreshold: v } }));
    },

    breakthrough: () => {
      const char = getChar();
      const combat = getCombat();
      if (combat.isInCombat) {
        addMessage({ channel: 'system', sender: '突破', content: '战斗中无法凝神突破！' });
        return;
      }
      const currentIdx = REALM_ORDER.indexOf(char.realm);
      if (currentIdx === -1 || currentIdx >= REALM_ORDER.length - 1) {
        addMessage({ channel: 'system', sender: '突破', content: '已学会达到当前可知最高境' });
        return;
      }

      // 突破需要境界等级达到阈?      const isBigRealm = currentIdx % 4 === 3; // 当前是圆满境界，下一步是大境界突?      const requiredLevel = calcBreakthroughLevel(currentIdx);

      if (char.realmLevel < requiredLevel) {
        addMessage({ channel: 'system', sender: '突破', content: `境界积累不足！突破至${REALM_NAMES[REALM_ORDER[currentIdx + 1]]}需境界等级 ${requiredLevel}，当前仅 ${char.realmLevel}。持续修炼战斗以积累修为。` });
        return;
      }

      const nextRealm = REALM_ORDER[currentIdx + 1];
      const isBigBreakthrough = isBigRealm;

      // 苦海圆满突破 ?觉醒苦海异象?      const isBitternessPerfect = char.realm === 'bitterness_perfect';
      let newPhenomenon: PhenomenonId | null = null;
      if (isBitternessPerfect && !char.phenomenonUnlocked) {
        const phenId = rollPhenomenon();
        newPhenomenon = phenId as PhenomenonId;
      }

      // 世界通告：突破成功
      const playerName = char.name;
      if (isBigBreakthrough) {
        addAnnouncement(
          `${playerName}】突破至${REALM_NAMES[nextRealm]}】！天地变色，大道轰鸣！`,
          '世界',
          '#ffd700'
        );
      } else {
        addAnnouncement(
          `${playerName}】突破至${REALM_NAMES[nextRealm]}】！`,
          '世界',
          '#ffcc00'
        );
      }

      // 突破特效消息序列
      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
      if (isBigBreakthrough) {
        addMessage({ channel: 'system', sender: '突破', content: `你盘膝而坐，心神沉入苦海深处……` });
        addMessage({ channel: 'system', sender: '突破', content: `天地源力如潮水般涌来，苦海轰鸣，命泉沸腾！` });
        addMessage({ channel: 'system', sender: '突破', content: `大道轰鸣，境界壁垒轰然破碎！` });

        // 苦海异象觉醒特效 + 世界通告
        if (newPhenomenon) {
          const phen = PHENOMENA[newPhenomenon];
          const rarityLabel = RARITY_LABELS[phen.rarity];
          const rarityColor = RARITY_COLORS[phen.rarity];

          // 世界通告：异象觉醒
          addAnnouncement(
            `${playerName}觉醒苦海异象【${phen.name}】！${phen.rarity === 'mythic' ? '天道震颤，万道臣服！' : phen.rarity === 'legendary' ? '天地共鸣，异象显化！' : '异象之力降临'}`,
            '世界',
            rarityColor
          );

          addMessage({ channel: 'system', sender: '◈◈', content: `苦海异象觉醒！` });
          addMessage({ channel: 'system', sender: '◈◈', content: phen.visualDesc });
          addMessage({ channel: 'system', sender: rarityColor, content: `${phen.name}】的稀有度${rarityLabel}` });
          addMessage({ channel: 'system', sender: '突破', content: `异象加成：攻${phen.buff.attackMult} 防御×${phen.buff.defenseMult} 气血×${phen.buff.hpMult} 神力×${phen.buff.mpMult}` });
          addMessage({ channel: 'system', sender: '突破', content: `特殊效果${phen.buff.specialDesc}` });
        }

        addMessage({ channel: 'system', sender: '◈◈', content: `${REALM_NAMES[char.realm]}】→${REALM_NAMES[nextRealm]}】大境界突破成功！` });
        addMessage({ channel: 'system', sender: '突破', content: `所有属性巨幅提升！气血神力上限大幅增加！` });
      } else {
        addMessage({ channel: 'system', sender: '突破', content: `你凝神静气，引导源力冲刷经脉……` });
        addMessage({ channel: 'system', sender: '◈◈', content: `${REALM_NAMES[char.realm]}】→${REALM_NAMES[nextRealm]}】小境界突破成功！` });
        addMessage({ channel: 'system', sender: '突破', content: `所有属性中幅度提升！` });
      }
      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });

      // 突破后属性提升
      updateChar(c => {
        const updated = { ...c, realm: nextRealm, realmLevel: 1 };
        // 大境界突破：巨幅提升所有属性
        const attrMult = isBigBreakthrough ? 1.15 : 1.05;
        const newAttrs = {
          shenli: Math.floor(updated.attributes.shenli * attrMult),
          gengu: Math.floor(updated.attributes.gengu * attrMult),
          sudu: Math.floor(updated.attributes.sudu * attrMult),
          ganzhi: Math.floor(updated.attributes.ganzhi * attrMult),
          mianrong: updated.attributes.mianrong,
          qiyun: updated.attributes.qiyun,
        };
        const final = {
          ...updated,
          attributes: newAttrs,
          exp: 0,
          expToNext: calcExpToNext(nextRealm, 1),
          phenomenon: newPhenomenon || c.phenomenon,
          phenomenonUnlocked: newPhenomenon ? true : c.phenomenonUnlocked,
        };
        return { ...final, hp: final.maxHp, mp: final.maxMp };
      });
      updateQuestProgress('breakthrough');
    },

    processCommand: (input: string) => {
      const raw = input.trim();
      const cmd = raw.toLowerCase();
      if (!raw) return;

      const state = get();
      const {
        move, talkTo, attack, lookRoom, useItem: consumeItem, equipItem, unequipItem, flee, breakthrough,
        pickupItem, dropItem, sellItem,
        toggleWindow, startCultivation, stopCultivation, setAutoCombat,
      } = state;
      const char = getChar();

      type NamedEntity = { id: string; name: string };
      const namedEntities: NamedEntity[] = [
        ...Object.values(NPCS),
        ...Object.values(ZONE_NPCS),
        ...Object.values(SECT_NPC_MAP),
        ...Object.values(SECT_FUNCTION_NPC_MAP),
      ];
      const matchEntity = (entities: NamedEntity[], query: string) => {
        const q = query.toLowerCase();
        return entities.find(n => n.id.toLowerCase() === q || n.name.toLowerCase().includes(q));
      };
      const findVisibleEntity = (query: string) => {
        const room = ALL_ROOMS[char.currentRoomId];
        const visibleIds = new Set(room?.npcs || []);
        const visible = namedEntities.filter(n => visibleIds.has(n.id));
        return matchEntity(visible, query) || matchEntity(namedEntities, query);
      };
      const generatedRoom = state.currentGenRoomId ? state.zoneRooms[state.currentGenRoomId] : undefined;
      const startGeneratedFight = (query: string) => {
        if (!generatedRoom) return false;
        const q = query.toLowerCase();
        const npcName = generatedRoom.npcTemplates.find(name =>
          name.toLowerCase().includes(q) || q.includes(name.toLowerCase())
        );
        if (!npcName) return false;
        const baseHp = 100 + char.realmLevel * 20 + generatedRoom.dangerLevel * 50;
        addMessage({ channel: 'combat', sender: '战斗', content: `你向${npcName}】发起攻击！` });
        set(s => ({
          combat: {
            ...s.combat,
            isInCombat: true,
            targetId: 'gen_' + npcName,
            targetName: npcName,
            targetHp: baseHp,
            targetMaxHp: baseHp,
            targetLevel: char.realmLevel + generatedRoom.dangerLevel - 1,
          },
        }));
        return true;
      };

      const directionAliases: Record<string, string> = {
        north: 'north', n: 'north',
        south: 'south', s: 'south',
        east: 'east', e: 'east',
        west: 'west', w: 'west',
        up: 'up', u: 'up',
        down: 'down', d: 'down',
      };
      if (directionAliases[cmd]) return move(directionAliases[cmd]);
      if (cmd.startsWith('go ') || cmd.startsWith('move ')) {
        const arg = raw.replace(/^(go|move|去)\s+/i, '').trim().toLowerCase();
        if (directionAliases[arg]) return move(directionAliases[arg]);
      }

      if (cmd === 'look' || cmd === 'l' || cmd === '观察') return lookRoom();
      if (cmd === 'flee' || cmd === 'run' || cmd === '逃跑') return flee();
      if (cmd === 'breakthrough' || cmd === '突破') return breakthrough();
      if (cmd === 'stop' || cmd === '停止' || cmd === '收功') return stopCultivation();
      if (cmd === 'cultivate' || cmd === 'xiulian' || cmd === '修炼' || cmd === '挂机修炼') {
        return char.cultivationMode === 'cultivate' ? stopCultivation() : startCultivation('cultivate');
      }
      if (cmd === 'dazuo' || cmd === 'idle' || cmd === '挂机打坐') {
        return char.cultivationMode === 'meditate' ? stopCultivation() : startCultivation('meditate');
      }
      if (cmd === 'meditate' || cmd === '吐纳' || cmd === '打坐') return get().meditate();
      if (cmd === 'hit' || cmd === 'kill' || cmd === '攻击') {
        if (state.combat.isInCombat) return get().tickCombat();
        if (generatedRoom?.npcTemplates[0] && startGeneratedFight(generatedRoom.npcTemplates[0])) return;
        const room = ALL_ROOMS[char.currentRoomId];
        const hostile = (room?.npcs || []).map(id => NPCS[id] || ZONE_NPCS[id]).find(n => n?.isHostile);
        if (hostile) return attack(hostile.id);
        addMessage({ channel: 'system', sender: '系统', content: '此处没有可攻击的目标' });
        return;
      }

      const windowCommands: Record<string, FloatWindowId> = {
        attr: 'attributes', attributes: 'attributes', stats: 'attributes',
        skill: 'skills', skills: 'skills', '技能': 'skills',
        bag: 'bag', inventory: 'bag', item: 'bag', items: 'bag', '背包': 'bag',
        task: 'tasks', tasks: 'tasks', quest: 'tasks', quests: 'tasks', '任务': 'tasks',
        map: 'map', '地图': 'map',
        sect: 'sect', '门派': 'sect',
        dungeon: 'dungeon', '副本': 'dungeon',
        combat: 'combat', '战斗': 'combat',
        cultivate: 'cultivation', cultivation: 'cultivation', '修炼': 'cultivation',
        shop: 'shop', '商店': 'shop', '神药': 'shop',
      };
      if (windowCommands[cmd]) return toggleWindow(windowCommands[cmd]);
      if (cmd.startsWith('open ') || raw.startsWith('打开 ')) {
        const key = raw.replace(/^(open|打开)\s+/i, '').trim().toLowerCase();
        const windowId = windowCommands[key];
        if (windowId) return toggleWindow(windowId);
      }

      if (cmd === 'auto' || cmd === 'autofight' || cmd === '自动战斗') {
        const next = !get().combat.autoCombat;
        setAutoCombat(next);
        addMessage({ channel: 'system', sender: '战斗', content: `自动战斗${next ? '开' : '关闭'}。` });
        return;
      }

      if (cmd === 'help' || cmd === '?' || cmd === '帮助') {
        addMessage({ channel: 'system', sender: '帮助', content: '━━━━━━ 指令帮助 ━━━━━━' });
        addMessage({ channel: 'system', sender: '移动', content: 'n/s/e/w/ne/nw/se/sw 或 north/south/east/west 等' });
        addMessage({ channel: 'system', sender: '战斗', content: 'attack <目标> / auto（自动战斗）/ flee（逃跑）' });
        addMessage({ channel: 'system', sender: '物品', content: 'use <物品> / equip <装备> / unequip <槽位> / get <物品> / drop <物品> / sell <物品> / buy <物品>' });
        addMessage({ channel: 'system', sender: '修炼', content: 'cultivate（挂机修炼）/ dazuo（挂机打坐）/ stop（停止）' });
        addMessage({ channel: 'system', sender: '观察', content: 'look（观察房间）/ talk <NPC>（对话）' });
        addMessage({ channel: 'system', sender: '窗口', content: 'open <窗口名>（打开面板）' });
        addMessage({ channel: 'system', sender: '聊天', content: 'say <内容> / tell <玩家> <内容>' });
        addMessage({ channel: 'system', sender: '其他', content: 'save（保存）/ help（帮助）' });
        addMessage({ channel: 'system', sender: '快捷键', content: 'Q/W/E/R-技能1-4 Space-攻击 1-5-使用物品 Tab-切换频道 ESC-关闭窗口' });
        return;
      }

      if (cmd.startsWith('talk ') || cmd.startsWith('ask ') || raw.startsWith('对话 ')) {
        const npcName = raw.replace(/^(talk|ask|对话)\s+/i, '').trim();
        const npc = findVisibleEntity(npcName);
        if (npc) return talkTo(npc.id);
        addMessage({ channel: 'system', sender: '系统', content: `找不到${npcName}。请先【观察】查看此处人物。` });
        return;
      }

      if (cmd.startsWith('attack ') || cmd.startsWith('kill ') || raw.startsWith('攻击 ')) {
        const npcName = raw.replace(/^(attack|kill|攻击)\s+/i, '').trim();
        if (startGeneratedFight(npcName)) return;
        const npc = findVisibleEntity(npcName);
        if (npc) return attack(npc.id);
        addMessage({ channel: 'system', sender: '系统', content: `找不到${npcName}。请先【观察】查看此处的敌人。` });
        return;
      }

      if (cmd.startsWith('use ') || cmd.startsWith('eat ') || raw.startsWith('使用 ')) {
        const itemName = raw.replace(/^(use|eat|使用)\s+/i, '').trim();
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === itemName.toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase())
        );
        if (itemId) return consumeItem(itemId);
        addMessage({ channel: 'system', sender: '系统', content: `背包中没有${itemName}。` });
        return;
      }

      if (cmd.startsWith('equip ') || cmd.startsWith('wear ') || raw.startsWith('装备 ')) {
        const itemName = raw.replace(/^(equip|wear|装备)\s+/i, '').trim();
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === itemName.toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase())
        );
        if (itemId) return equipItem(itemId);
        addMessage({ channel: 'system', sender: '系统', content: `背包中没有${itemName}。` });
        return;
      }

      if (cmd.startsWith('unequip ') || cmd.startsWith('remove ') || raw.startsWith('卸下 ')) {
        const slotName = raw.replace(/^(unequip|remove|卸下)\s+/i, '').trim().toLowerCase();
        const slotAliases: Record<string, string> = {
          weapon: 'weapon', '武器': 'weapon',
          head: 'head', '头盔': 'head', '头部': 'head',
          body: 'body', '衣服': 'body', '铠甲': 'body', '身体': 'body',
          waist: 'waist', '腰带': 'waist',
          hands: 'hands', '手套': 'hands', '手部': 'hands',
          feet: 'feet', '鞋子': 'feet', '脚部': 'feet',
        };
        const slot = slotAliases[slotName];
        if (slot) return unequipItem(slot);
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === slotName || ITEMS[id]?.name.toLowerCase().includes(slotName)
        );
        if (itemId) {
          const item = ITEMS[itemId];
          if (item?.slot && char.equipment[item.slot] === itemId) {
            return unequipItem(item.slot);
          }
        }
        addMessage({ channel: 'system', sender: '系统', content: `未装备该物品或槽位不存在。可用槽位: weapon/head/body/waist/hands/feet` });
        return;
      }

      if (cmd.startsWith('get ') || cmd.startsWith('pick ') || raw.startsWith('捡起 ') || raw.startsWith('拾取 ')) {
        const itemName = raw.replace(/^(get|pick|捡起|拾取)\s+/i, '').trim();
        const room = ALL_ROOMS[char.currentRoomId];
        if (!room || room.items.length === 0) {
          addMessage({ channel: 'system', sender: '系统', content: '此处没有可拾取的物品' });
          return;
        }
        const itemId = room.items.find(id =>
          id.toLowerCase() === itemName.toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase())
        );
        if (itemId) return pickupItem(itemId);
        addMessage({ channel: 'system', sender: '系统', content: `此处没?${itemName}"。` });
        return;
      }

      if (cmd.startsWith('drop ') || raw.startsWith('丢弃 ')) {
        const itemName = raw.replace(/^(drop|丢弃)\s+/i, '').trim();
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === itemName.toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase())
        );
        if (itemId) return dropItem(itemId);
        addMessage({ channel: 'system', sender: '系统', content: `背包中没有${itemName}。` });
        return;
      }

      if (cmd.startsWith('sell ') || raw.startsWith('出售 ')) {
        const itemName = raw.replace(/^(sell|出售)\s+/i, '').trim();
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === itemName.toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase())
        );
        if (itemId) return sellItem(itemId);
        addMessage({ channel: 'system', sender: '系统', content: `背包中没有${itemName}。` });
        return;
      }

      if (cmd.startsWith('buy ') || raw.startsWith('购买 ')) {
        const itemName = raw.replace(/^(buy|购买)\s+/i, '').trim();
        const itemId = itemName.toLowerCase();
        if (ITEMS[itemId]) return state.buyShopItem(itemId);
        const foundId = Object.keys(ITEMS).find(id => ITEMS[id]?.name.toLowerCase().includes(itemName.toLowerCase()));
        if (foundId) return state.buyShopItem(foundId);
        addMessage({ channel: 'system', sender: '系统', content: `商店中没?${itemName}"。请打开商店（open shop）查看可购物品。` });
        return;
      }

      if (cmd.startsWith('give ') || raw.startsWith('给予 ')) {
        const parts = raw.replace(/^(give|给予)\s+/i, '').split(/\s+to\s+|\s+给\s+/i);
        if (parts.length < 2) {
          addMessage({ channel: 'system', sender: '系统', content: '格式：give 物品名 to NPC名 或 给予 物品名 给 NPC名' });
          return;
        }
        const [itemName, npcName] = parts;
        const itemId = char.inventory.find(id =>
          id.toLowerCase() === itemName.trim().toLowerCase() || ITEMS[id]?.name.toLowerCase().includes(itemName.trim().toLowerCase())
        );
        if (!itemId) {
          addMessage({ channel: 'system', sender: '系统', content: `背包中没有${itemName.trim()}。` });
          return;
        }
        const npc = findVisibleEntity(npcName.trim());
        if (!npc) {
          addMessage({ channel: 'system', sender: '系统', content: `找不到${npcName.trim()}。` });
          return;
        }
        const item = ITEMS[itemId];
        const newInv = char.inventory.filter(id => id !== itemId);
        addMessage({ channel: 'say', sender: '系统', content: `你将${item?.name}】交给了${npc.name}】。` });
        updateChar(() => ({ inventory: newInv }));
        return;
      }

      if (cmd.startsWith('say ') || raw.startsWith('说 ')) {
        const content = raw.replace(/^(say|说)\s+/i, '').trim();
        if (!content) {
          addMessage({ channel: 'system', sender: '系统', content: '格式：say 内容 或 说 内容' });
          return;
        }
        addMessage({ channel: 'say', sender: char.name, content: `${char.name}说："${content}"` });
        return;
      }

      if (cmd.startsWith('tell ') || raw.startsWith('私聊 ') || raw.startsWith('密 ')) {
        const parts = raw.replace(/^(tell|私聊|密)\s+/i, '').split(/\s+/);
        if (parts.length < 2) {
          addMessage({ channel: 'system', sender: '系统', content: '格式：tell 玩家名 内容 或 私聊 玩家名 内容' });
          return;
        }
        const targetName = parts[0].replace(/[<>"'&]/g, '').trim().slice(0, 20);
        const content = parts.slice(1).join(' ').replace(/[<>"'&]/g, '').trim().slice(0, 200);
        if (!content) {
          addMessage({ channel: 'system', sender: '系统', content: '消息内容不能为空。' });
          return;
        }
        addMessage({ channel: 'tell', sender: char.name, content: `你对${targetName}】说："${content}"` });
        // Also send via Firebase if configured
        sendChatMsg({
          uid: char.name,
          sender: char.name,
          content,
          channel: 'private',
          toUid: targetName,
          toName: targetName,
        });
        return;
      }

      if (cmd === 'save') {
        const { uid } = get();
        if (uid) {
          saveCharacter(uid, get().character);
          addMessage({ channel: 'system', sender: '系统', content: '游戏已自动存档。' });
        } else {
          localStorage.setItem('wamud_char_backup', JSON.stringify(get().character));
          addMessage({ channel: 'system', sender: '系统', content: '本地存档已保存。' });
        }
        return;
      }

      addMessage({ channel: 'system', sender: '系统', content: `未知指令"${input}"。输入 help 查看可用指令。` });
    },

    meditate: () => {
      const char = getChar();
      const combat = getCombat();
      if (combat.isInCombat) {
        addMessage({ channel: 'system', sender: '修炼', content: '战斗中无法凝神打坐！' });
        return;
      }
      const expGain = Math.floor(8 + char.realmLevel * 4 + char.attributes.ganzhi * 0.8);
      const mpRestore = Math.floor(15 + char.attributes.ganzhi * 2);
      const hpRestore = Math.floor(10 + char.attributes.gengu * 1.5);
      const energyRestore = Math.floor(20 + char.attributes.ganzhi * 0.5);
      addMessage({ channel: 'system', sender: '修炼', content: `你盘膝打坐，引天地源力入体……恢复 ${hpRestore} 气血 ${mpRestore} 神力 ${energyRestore} 精力，获得 ${expGain} 修为经验。` });
      updateChar(c => {
        let newExp = c.exp + expGain;
        let rl = c.realmLevel;
        let et = calcExpToNext(c.realm, rl);
        while (newExp >= et) {
          newExp -= et;
          rl += 1;
          et = calcExpToNext(c.realm, rl);
        }
        return {
          hp: Math.min(c.maxHp, c.hp + hpRestore),
          mp: Math.min(c.maxMp, c.mp + mpRestore),
          energy: Math.min(c.maxEnergy, c.energy + energyRestore),
          exp: newExp,
          expToNext: et,
          realmLevel: rl,
          luohai: Math.min(100, c.luohai + 1),
          age: c.age + 1,
        };
      });
    },

    acceptQuest: (questId: string) => {
      const def = QUESTS[questId];
      if (!def) {
        addMessage({ channel: 'system', sender: '系统', content: '该任务不存在' });
        return;
      }
      const state = get();
      if (state.quests.includes(questId)) {
        addMessage({ channel: 'system', sender: '系统', content: `你已经接取了${def.title}】` });
        return;
      }
      const char = getChar();
      if (char.realmLevel < def.levelRequirement) {
        addMessage({ channel: 'system', sender: '系统', content: `等级不足，需要 Lv.${def.levelRequirement}` });
        return;
      }
      if (def.prerequisite && def.prerequisite.length > 0) {
        for (const preId of def.prerequisite) {
          if (!state.quests.includes(preId)) {
            const preDef = QUESTS[preId];
            addMessage({ channel: 'system', sender: '系统', content: `需要先完成${preDef?.title || preId}】` });
            return;
          }
        }
      }
      def.objectives.forEach(obj => { obj.current = 0; obj.completed = false; });
      addMessage({ channel: 'system', sender: '任务', content: `接取任务${def.title}】` });
      set(s => ({ quests: [...s.quests, questId] }));
    },

    abandonQuest: (questId: string) => {
      const def = QUESTS[questId];
      if (!def) return;
      const state = get();
      if (!state.quests.includes(questId)) return;
      def.objectives.forEach(obj => { obj.current = 0; obj.completed = false; });
      addMessage({ channel: 'system', sender: '任务', content: `已放弃任务${def.title}】` });
      set(s => ({ quests: s.quests.filter(id => id !== questId) }));
    },

    // ── 挂机修炼系统 ─────────────────────────────────────────────────────

    startCultivation: (mode: CultivationMode) => {
      const combat = getCombat();
      if (combat.isInCombat) {
        addMessage({ channel: 'system', sender: '挂机', content: '战斗中无法开始挂机！' });
        return;
      }
      const modeName = mode === 'cultivate' ? '挂机修炼' : '挂机打坐';
      addMessage({ channel: 'system', sender: '挂机', content: `开始${modeName}……（关闭页面后4小时内仍会持续积累）` });
      updateChar(() => ({
        cultivationMode: mode,
        cultivationStartMs: Date.now(),
        lastSaveMs: Date.now(),
      }));
      // Update quest progress
      updateQuestProgress('cultivate');
    },

    stopCultivation: () => {
      const char = getChar();
      if (char.cultivationMode === 'none') return;
      const modeName = char.cultivationMode === 'cultivate' ? '挂机修炼' : '挂机打坐';
      addMessage({ channel: 'system', sender: '挂机', content: `停止${modeName}。` });
      updateChar(() => ({
        cultivationMode: 'none',
        cultivationStartMs: 0,
      }));
    },

    toggleAutoCast: (skillId: string) => {
      updateChar(c => {
        const has = c.autoCastSkills.includes(skillId);
        return {
          autoCastSkills: has
            ? c.autoCastSkills.filter(id => id !== skillId)
            : [...c.autoCastSkills, skillId],
        };
      });
    },

    // ── 苦海异象散功重修 ──────────────────────────────────────────────────

    rerollPhenomenon: () => {
      const char = getChar();
      if (!char.phenomenonUnlocked || !char.phenomenon) {
        addMessage({ channel: 'system', sender: '重修', content: '尚未觉醒苦海异象，无法洗练散功重修' });
        return;
      }
      // 10次重修后，允许自行选择
      if (char.phenomenonRerollCount >= 10 && char.chosenPhenomenon) {
        addMessage({ channel: 'system', sender: '重修', content: '已学会达10次重修上限，请使?选择异象"功能自行指定' });
        return;
      }
      const oldPhen = PHENOMENA[char.phenomenon];
      const newPhenId = rollPhenomenon();
      const newPhen = PHENOMENA[newPhenId];
      const newCount = char.phenomenonRerollCount + 1;
      const rarityLabel = RARITY_LABELS[newPhen.rarity];
      const rarityColor = RARITY_COLORS[newPhen.rarity];

      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
      addMessage({ channel: 'system', sender: '重修', content: `散功重修！散${oldPhen.name}】的异象之力……` });
      addMessage({ channel: 'system', sender: '重修', content: newPhen.visualDesc });
      addMessage({ channel: 'system', sender: rarityColor, content: `新觉醒：${newPhen.name}】的稀有度${rarityLabel}` });
      addMessage({ channel: 'system', sender: '重修', content: `异象加成：攻${newPhen.buff.attackMult} 防御×${newPhen.buff.defenseMult} 气血×${newPhen.buff.hpMult} 神力×${newPhen.buff.mpMult}` });
      addMessage({ channel: 'system', sender: '重修', content: `已重${newCount}/10次` + (newCount >= 10 ? '(已达到上限，可自行选择异象)' : '') });
      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });

      updateChar(() => ({
        phenomenon: newPhenId as PhenomenonId,
        phenomenonRerollCount: newCount,
      }));
    },

    choosePhenomenon: (phenId: PhenomenonId) => {
      const char = getChar();
      if (char.phenomenonRerollCount < 10) {
        addMessage({ channel: 'system', sender: '选择', content: '需先完成10次散功重修方可自行选择异象' });
        return;
      }
      const phen = PHENOMENA[phenId];
      if (!phen) {
        addMessage({ channel: 'system', sender: '选择', content: '无效的异象选择' });
        return;
      }
      const rarityLabel = RARITY_LABELS[phen.rarity];
      const rarityColor = RARITY_COLORS[phen.rarity];
      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
      addMessage({ channel: 'system', sender: '选择', content: `你以无上意志，强行凝${phen.name}】异象！` });
      addMessage({ channel: 'system', sender: rarityColor, content: `${phen.name}】?${rarityLabel}` });
      addMessage({ channel: 'system', sender: '选择', content: `异象加成：攻${phen.buff.attackMult} 防御×${phen.buff.defenseMult} 气血×${phen.buff.hpMult} 神力×${phen.buff.mpMult}` });
      addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });

      updateChar(() => ({
        phenomenon: phenId,
        chosenPhenomenon: phenId,
      }));
    },

    // ── 商店系统（神药洗练异象） ──────────────────────────────────────────

    buyShopItem: (itemId: string) => {
      const char = getChar();
      const item = ITEMS[itemId];
      if (!item) {
        addMessage({ channel: 'system', sender: '商店', content: '商品不存在' });
        return;
      }
      // 检查货?      const price = item.goldPrice || 0;
      const priceYuankuai = item.yuankuaiPrice || 0;
      if (char.gold < price || char.yuankuai < priceYuankuai) {
        addMessage({ channel: 'system', sender: '商店', content: `货币不足！需要${price > 0 ? price + '金叶' : ''}${price > 0 && priceYuankuai > 0 ? '和' : ''}${priceYuankuai > 0 ? priceYuankuai + '源块' : ''}` });
        return;
      }
      // 消耗货币
      updateChar(c => ({
        gold: c.gold - price,
        yuankuai: c.yuankuai - priceYuankuai,
      }));

      // 神药效果
      if (itemId === 'phenomenon_reroll_pill') {
        // 洗练异象神药（等价于一次散功重修）
        if (!char.phenomenonUnlocked || !char.phenomenon) {
          addMessage({ channel: 'system', sender: '神药', content: '尚未觉醒苦海异象，无法洗练' });
          updateChar(c => ({ gold: c.gold + price, yuankuai: c.yuankuai + priceYuankuai }));
          return;
        }
        const oldPhen = PHENOMENA[char.phenomenon];
        const newPhenId = rollPhenomenon();
        const newPhen = PHENOMENA[newPhenId];
        const newCount = char.phenomenonRerollCount + 1;
        const rarityLabel = RARITY_LABELS[newPhen.rarity];
        const rarityColor = RARITY_COLORS[newPhen.rarity];

        addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });
        addMessage({ channel: 'system', sender: '神药', content: `服下${item.name}】，异象之力开始洗练……` });
        addMessage({ channel: 'system', sender: '神药', content: `散去${oldPhen.name}】，${newPhen.visualDesc}` });
        addMessage({ channel: 'system', sender: rarityColor, content: `新觉醒：${newPhen.name}】的稀有度${rarityLabel}` });
        addMessage({ channel: 'system', sender: '神药', content: `已洗${newCount}/10次` + (newCount >= 10 ? '(已达到上限，可自行选择异象)' : '') });
        addMessage({ channel: 'system', sender: '系统', content: '────────────────────────────' });

        updateChar(() => ({
          phenomenon: newPhenId as PhenomenonId,
          phenomenonRerollCount: newCount,
        }));
      } else if (itemId === 'phenomenon_choice_pill') {
        // 异象选择神药 ?允许直接选择（需10次重修）
        if (char.phenomenonRerollCount < 10) {
          addMessage({ channel: 'system', sender: '神药', content: '需先完成10次散功重修方可使用此神药' });
          updateChar(c => ({ gold: c.gold + price, yuankuai: c.yuankuai + priceYuankuai }));
          return;
        }
        addMessage({ channel: 'system', sender: '神药', content: `服下${item.name}】，已解锁异象自选功能。请在修炼面板选择你想要的异象。` });
      } else {
        // 普通物??加入背包
        updateChar(c => {
          const newInv = c.inventory.length < 100 ? [...c.inventory, itemId] : c.inventory;
          return { inventory: newInv };
        });
        addMessage({ channel: 'system', sender: '商店', content: `购买${item.name}】成功！` });
      }
    },

    tickCultivation: () => {
      const char = getChar();
      if (char.cultivationMode === 'none') return;
      const combat = getCombat();
      if (combat.isInCombat) return;

      const realmIdx = REALM_ORDER.indexOf(char.realm);
      const realmMult = 1 + realmIdx * 0.3;
      const ganzhiBonus = 1 + char.attributes.ganzhi * 0.02;

      if (char.cultivationMode === 'cultivate') {
        // 挂机修炼：每秒获得修为经验
        const baseExpPerTick = Math.floor((3 + char.realmLevel * 1.5) * realmMult * ganzhiBonus * 1000);
        updateChar(c => {
          let newExp = c.exp + baseExpPerTick;
          let rl = c.realmLevel;
          let et = calcExpToNext(c.realm, rl);
          while (newExp >= et) { newExp -= et; rl += 1; et = calcExpToNext(c.realm, rl); }
          // 每600秒（10分钟）年龄+1
          const elapsedSec = Math.floor((Date.now() - c.cultivationStartMs) / 1000);
          const newAge = 16 + Math.floor(elapsedSec / 3600);
          return { exp: newExp, expToNext: et, realmLevel: rl, luohai: Math.min(100, c.luohai + 0.05), age: newAge };
        });
      } else {
        // 挂机打坐：每秒恢复10%气血和神力
        const effectiveMaxHp = char.maxHp + char.bonusHpCap;
        const effectiveMaxMp = char.maxMp + char.bonusMpCap;
        const hpRestore = Math.max(1, Math.floor(effectiveMaxHp * 0.1));
        const mpRestore = Math.max(1, Math.floor(effectiveMaxMp * 0.1));
        const newHp = Math.min(effectiveMaxHp, char.hp + hpRestore);
        const newMp = Math.min(effectiveMaxMp, char.mp + mpRestore);
        // 超出双倍基础上限后，微量提升上限（受境界限制）
        const baseMaxHp = calcMaxHp(char);
        const baseMaxMp = calcMaxMp(char);
        const realmCapHp = baseMaxHp * (1 + realmIdx * 0.5);
        const realmCapMp = baseMaxMp * (1 + realmIdx * 0.5);
        let newBonusHp = char.bonusHpCap;
        let newBonusMp = char.bonusMpCap;
        if (newHp >= baseMaxHp * 2 && newBonusHp < realmCapHp - baseMaxHp) {
          newBonusHp = Math.min(realmCapHp - baseMaxHp, newBonusHp + 0.5);
        }
        if (newMp >= baseMaxMp * 2 && newBonusMp < realmCapMp - baseMaxMp) {
          newBonusMp = Math.min(realmCapMp - baseMaxMp, newBonusMp + 0.5);
        }
        set(s => ({
          character: {
            ...s.character,
            hp: Math.floor(newHp),
            mp: Math.floor(newMp),
            energy: Math.min(s.character.maxEnergy, s.character.energy + 5),
            bonusHpCap: Math.floor(newBonusHp),
            bonusMpCap: Math.floor(newBonusMp),
          },
        }));
      }
    },

    applyOfflineProgress: () => {
      const char = getChar();
      if (char.cultivationMode === 'none' || char.cultivationStartMs === 0) return;
      const now = Date.now();
      const elapsedMs = now - char.lastSaveMs;
      const maxMs = 24 * 60 * 60 * 1000; // 24小时上限
      const effectiveMs = Math.min(elapsedMs, maxMs);
      const ticks = Math.floor(effectiveMs / 1000); // 每秒1tick

      if (ticks <= 0) return;

      const realmIdx = REALM_ORDER.indexOf(char.realm);
      const realmMult = 1 + realmIdx * 0.3;
      const ganzhiBonus = 1 + char.attributes.ganzhi * 0.02;

      if (char.cultivationMode === 'cultivate') {
        const baseExpPerTick = Math.floor((3 + char.realmLevel * 1.5) * realmMult * ganzhiBonus * 1000);
        const totalExp = baseExpPerTick * ticks;
        const elapsedHours = (effectiveMs / (60 * 60 * 1000)).toFixed(1);
        addMessage({ channel: 'system', sender: '离线', content: `离线挂机 ${elapsedHours} 小时，获得 ${totalExp} 修为经验。` });
        updateChar(c => {
          let newExp = c.exp + totalExp;
          let rl = c.realmLevel;
          let et = calcExpToNext(c.realm, rl);
          while (newExp >= et) { newExp -= et; rl += 1; et = calcExpToNext(c.realm, rl); }
          const offlineHours = Math.floor(effectiveMs / (60 * 60 * 1000));
          return { exp: newExp, expToNext: et, realmLevel: rl, lastSaveMs: now, age: c.age + offlineHours };
        });
      } else {
        // 离线打坐：每秒10%气血神力恢复
        const effectiveMaxHp = calcMaxHp(char) + char.bonusHpCap;
        const effectiveMaxMp = calcMaxMp(char) + char.bonusMpCap;
        const hpPerTick = Math.max(1, Math.floor(effectiveMaxHp * 0.1));
        const mpPerTick = Math.max(1, Math.floor(effectiveMaxMp * 0.1));
        const totalHp = hpPerTick * ticks;
        const totalMp = mpPerTick * ticks;
        const baseMaxHp = calcMaxHp(char);
        const baseMaxMp = calcMaxMp(char);
        const realmCapHp = baseMaxHp * (1 + realmIdx * 0.5);
        const realmCapMp = baseMaxMp * (1 + realmIdx * 0.5);
        const newHp = Math.min(baseMaxHp + char.bonusHpCap, char.hp + totalHp);
        const newMp = Math.min(baseMaxMp + char.bonusMpCap, char.mp + totalMp);
        let newBonusHp = char.bonusHpCap;
        let newBonusMp = char.bonusMpCap;
        // 超出双倍后微量提升上限
        if (newHp >= baseMaxHp * 2 && newBonusHp < realmCapHp - baseMaxHp) {
          newBonusHp = Math.min(realmCapHp - baseMaxHp, newBonusHp + ticks * 0.5);
        }
        if (newMp >= baseMaxMp * 2 && newBonusMp < realmCapMp - baseMaxMp) {
          newBonusMp = Math.min(realmCapMp - baseMaxMp, newBonusMp + ticks * 0.5);
        }
        const elapsedHours = (effectiveMs / (60 * 60 * 1000)).toFixed(1);
        addMessage({ channel: 'system', sender: '离线', content: `离线挂机 ${elapsedHours} 小时，气血恢复 ${Math.floor(totalHp)}，神力恢复 ${Math.floor(totalMp)}。` });
        const offlineHours = Math.floor(effectiveMs / (60 * 60 * 1000));
        set(s => ({
          character: {
            ...s.character,
            hp: Math.floor(newHp),
            mp: Math.floor(newMp),
            bonusHpCap: Math.floor(newBonusHp),
            bonusMpCap: Math.floor(newBonusMp),
            lastSaveMs: now,
            age: s.character.age + offlineHours,
          },
        }));
      }
    },

    learnSectSkill: (skillId: string) => {
      const char = getChar();
      const skill = ALL_SECT_SKILLS.find(s => s.id === skillId);
      if (!skill) {
        addMessage({ channel: 'system', sender: '学习', content: '功法不存在' });
        return;
      }
      if (char.skills.find(s => s.id === skillId)) {
        addMessage({ channel: 'system', sender: '学习', content: '已学会会此功法' });
        return;
      }
      const cost = skill.rarity === 'mortal' ? 100 : skill.rarity === 'sect' ? 500 : skill.rarity === 'king' ? 2000 : skill.rarity === 'sage' ? 10000 : 50000;
      if (char.gold < cost) {
        addMessage({ channel: 'system', sender: '学习', content: `金叶不足！学${skill.name}需 ${cost} 金叶。` });
        return;
      }
      updateChar(c => ({
        gold: c.gold - cost,
        skills: [...c.skills, { ...skill, level: 1, practiceExp: 0, currentCooldown: 0 }],
      }));
      addMessage({ channel: 'system', sender: '学习', content: `学会${skill.name}】！?${cost} 金叶。` });
    },

    equipSkill: (skillId: string, slotType: SkillType) => {
      const char = getChar();
      const skill = char.skills.find(s => s.id === skillId);
      if (!skill) {
        addMessage({ channel: 'system', sender: '装备', content: '未学会此功法' });
        return;
      }
      const eq = { ...char.skillEquipment };
      eq[slotType] = skillId;
      updateChar(() => ({ skillEquipment: eq }));
      addMessage({ channel: 'system', sender: '装备', content: `装备${skill.name}】到${slotType}槽位。` });
    },

    unequipSkill: (slotType: SkillType) => {
      const char = getChar();
      const eq = { ...char.skillEquipment };
      eq[slotType] = null;
      updateChar(() => ({ skillEquipment: eq }));
      addMessage({ channel: 'system', sender: '装备', content: `卸下${slotType}槽位的功法。` });
    },

    enterSectMap: (sectId: string) => {
      const gateRoomId = SECT_GATE_ROOMS[sectId];
      const gateRoom = ALL_SECT_ROOMS[gateRoomId];
      if (!gateRoom) return;
      const char = getChar();
      const prevRoom = char.currentRoomId;
      // Save previous world room before entering sect
      set({ 
        sectMapId: sectId, 
        sectMapRoomId: gateRoomId,
        prevWorldRoomId: prevRoom 
      });
      updateChar(() => ({ currentRoomId: gateRoomId }));
      addMessage({ channel: 'room', sender: gateRoom.name, content: gateRoom.description });
      if (gateRoom.exits.length > 0) {
        addMessage({ channel: 'system', sender: '出口', content: gateRoom.exits.map(e => e.label).join(' | ') });
      }
    },

    exitSectMap: () => {
      const { prevWorldRoomId } = get();
      const restoreRoom = prevWorldRoomId || 'guiyuan_village';
      const room = ROOMS[restoreRoom];
      updateChar(() => ({ currentRoomId: restoreRoom }));
      set({ sectMapId: null, sectMapRoomId: '', prevWorldRoomId: 'donghuang_plain' });
      addMessage({ channel: 'system', sender: '离开', content: `你离开了门派，回到${room?.name || '东荒南域'}。` });
    },

    moveSectRoom: (roomId: string) => {
      const { sectMapId } = get();
      if (!sectMapId) return;
      const map = SECT_MAPS[sectMapId];
      if (!map || !map[roomId]) return;
      
      set({ sectMapRoomId: roomId });
      updateChar(() => ({ currentRoomId: roomId }));
      
      const room = map[roomId];
      addMessage({ channel: 'room', sender: room.name, content: room.description });
      if (room.exits.length > 0) {
        addMessage({ channel: 'system', sender: '出口', content: room.exits.map((e: { label: string }) => e.label).join(' | ') });
      }
    },

    // ── 门派任务系统 ─────────────────────────────────────────────────────────
    refreshSectQuests: () => {
      const char = getChar();
      if (!char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const today = new Date().toDateString();
      const { lastDailyQuestReset } = get();
      
      // 检查是否需要刷新每日任务

if(lastDailyQuestReset !== today) {
        const dailyQuests = generateDailyQuests(char.sect, char.sectRank);
        set({ 
          sectQuests: dailyQuests,
          lastDailyQuestReset: today 
        });
        addMessage({ channel: 'system', sender: '门派', content: `今日门派任务已刷新，?${dailyQuests.length} 个任务可接取。` });
      } else {
        addMessage({ channel: 'system', sender: '门派', content: '今日任务已刷新，请查看当前任务列' });
      }
    },

    acceptSectQuest: (questId: string) => {
      const char = getChar();
      if (!char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const quest = ALL_SECT_QUESTS.find(q => q.id === questId);
      if (!quest) {
        addMessage({ channel: 'system', sender: '门派', content: '任务不存在' });
        return;
      }
      const { sectQuests } = get();
      if (sectQuests.find(q => q.id === questId)) {
        addMessage({ channel: 'system', sender: '门派', content: '你已经接取了此任务' });
        return;
      }
      const newQuest = { ...quest, status: 'active' as const };
      set({ sectQuests: [...sectQuests, newQuest] });
      addMessage({ channel: 'system', sender: '门派', content: `接取任务${quest.name}】` });
    },

    completeSectQuest: (questId: string) => {
      const char = getChar();
      const { sectQuests } = get();
      const quest = sectQuests.find(q => q.id === questId);
      if (!quest) {
        addMessage({ channel: 'system', sender: '门派', content: '任务不存在' });
        return;
      }
      if (quest.status !== 'active') {
        addMessage({ channel: 'system', sender: '门派', content: '此任务无法完成' });
        return;
      }
      // 检查任务目标是否完成
      const allCompleted = quest.objectives.every(o => o.completed);
      if (!allCompleted) {
        addMessage({ channel: 'system', sender: '门派', content: '任务目标尚未全部完成' });
        return;
      }
      
      // 完成任务奖励
      const sectQuest = quest as SectQuest;
      updateChar(c => ({
        contribution: (c.contribution || 0) + (sectQuest.contribReward || 0),
        reputation: c.reputation + (sectQuest.reputationReward || 0),
        gold: c.gold + quest.rewards.gold,
        exp: c.exp + quest.rewards.exp,
      }));
      
      // 添加奖励物品
      quest.rewards.items?.forEach(itemId => {
        if (char.inventory.length < 100) {
          char.inventory.push(itemId);
        }
      });
      
      // 更新任务进度

set({
        sectQuests: sectQuests.map(q => 
          q.id === questId ? { ...q, status: 'completed' as const } : q
        )
      });
      
      addMessage({ channel: 'system', sender: '门派', content: `完成任务${quest.name}】！获得 ${sectQuest.contribReward} 贡献${sectQuest.reputationReward} 声望。` });
    },

    abandonSectQuest: (questId: string) => {
      const { sectQuests } = get();
      const quest = sectQuests.find(q => q.id === questId);
      if (!quest) {
        addMessage({ channel: 'system', sender: '门派', content: '任务不存在' });
        return;
      }
      set({
        sectQuests: sectQuests.filter(q => q.id !== questId)
      });
      addMessage({ channel: 'system', sender: '门派', content: `已放弃任${quest.name}】。` });
    },

    // ── 门派商店系统 ─────────────────────────────────────────────────────────
    buySectShopItem: (itemId: string) => {
      const char = getChar();
      if (!char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const { sectShopItems } = get();
      const item = sectShopItems.find(i => i.id === itemId);
      if (!item) {
        addMessage({ channel: 'system', sender: '门派', content: '商品不存在' });
        return;
      }
      
      const check = canBuyItem(item, char.contribution || 0, char.gold, char.sectRank, char.reputation);
      if (!check.canBuy) {
        addMessage({ channel: 'system', sender: '门派', content: check.reason || '无法购买此物' });
        return;
      }
      
      // 扣除资源
      updateChar(c => ({
        contribution: (c.contribution || 0) - item.contribCost,
        gold: c.gold - item.goldCost,
      }));
      
      // 添加物品到背包      
if(char.inventory.length < 100) {
        char.inventory.push(itemId);
      }
      
      // 减少库存
      set({
        sectShopItems: sectShopItems.map(i => 
          i.id === itemId ? { ...i, stock: i.stock - 1 } : i
        )
      });
      
      addMessage({ channel: 'system', sender: '门派', content: `购买成功！获${item.name}】。` });
    },

    refreshSectShop: () => {
      const char = getChar();
      if (!char.sect) {
        addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
        return;
      }
      const items = getSectShopItems(char.sect);
      set({ sectShopItems: items });
      addMessage({ channel: 'system', sender: '门派', content: '门派商店已刷' });
    },

    // ── 通用角色更新 ─────────────────────────────────────────────────────────
    updateCharacter: (updates: Partial<Character>) => {
      set(s => {
        const merged = { ...s.character, ...updates };
        const stats = calcStats(merged);
        const maxHp = calcMaxHp({ ...merged, stats });
        const maxMp = calcMaxMp({ ...merged, stats });
        return {
          character: {
            ...merged, stats,
            maxHp, maxMp,
            hp: Math.min(merged.hp, maxHp),
            mp: Math.min(merged.mp, maxMp),
          },
        };
      });
    },

    // ── 交易系统 ──────────────────────────────────────────────────────────
    sendTradeRequest: (targetName: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '交易', content: '请先登录。' });
        return;
      }
      if (char.name === targetName) {
        addMessage({ channel: 'system', sender: '交易', content: '不能与自己交易。' });
        return;
      }
      // Find target player from online players
      import('../services/multiplayerService').then(({ sendTradeRequest, listenPlayers }) => {
        // Get current online players to find target UID
        const unsub = listenPlayers((players) => {
          const targetPlayer = players.find(p => p.name === targetName);
          if (targetPlayer) {
            sendTradeRequest(uid, char.name, targetPlayer.uid, targetName);
            addMessage({ channel: 'system', sender: '交易', content: `向${targetName}发起交易请求……` });
          } else {
            addMessage({ channel: 'system', sender: '交易', content: `找不到玩家${targetName}。` });
          }
          unsub();
        });
      });
    },

    acceptTrade: (tradeId: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) return;
      import('../services/multiplayerService').then(({ confirmTrade, getTrade }) => {
        // Determine if we are 'from' or 'to' side
        getTrade(tradeId).then(trade => {
          if (!trade) {
            addMessage({ channel: 'system', sender: '交易', content: '交易不存在。' });
            return;
          }
          const side = trade.fromUid === uid ? 'from' : 'to';
          confirmTrade(tradeId, side);
          addMessage({ channel: 'system', sender: '交易', content: '已确认交易。' });
        });
      });
    },

    cancelTrade: (tradeId: string) => {
      import('../services/multiplayerService').then(({ cancelTrade }) => {
        cancelTrade(tradeId);
        addMessage({ channel: 'system', sender: '交易', content: '交易已取消。' });
      });
    },

    // ── 仓库系统 ──────────────────────────────────────────────────────────
    storeItem: (itemId: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '仓库', content: '请先登录。' });
        return;
      }
      const item = ITEMS[itemId];
      if (!item) {
        addMessage({ channel: 'system', sender: '仓库', content: '物品不存在。' });
        return;
      }
      if (!char.inventory.includes(itemId)) {
        addMessage({ channel: 'system', sender: '仓库', content: '你没有这个物品。' });
        return;
      }
      import('../services/multiplayerService').then(({ storeWarehouseItem }) => {
        storeWarehouseItem(uid, itemId, 1);
        updateChar(c => ({
          inventory: c.inventory.filter(id => id !== itemId),
        }));
        addMessage({ channel: 'system', sender: '仓库', content: `存入${item.name}成功！` });
      });
    },

    withdrawItem: (itemId: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '仓库', content: '请先登录。' });
        return;
      }
      if (char.inventory.length >= 100) {
        addMessage({ channel: 'system', sender: '仓库', content: '背包已满。' });
        return;
      }
      import('../services/multiplayerService').then(({ withdrawWarehouseItem }) => {
        withdrawWarehouseItem(uid, itemId, 1).then(success => {
          if (success) {
            updateChar(c => ({
              inventory: [...c.inventory, itemId],
            }));
            addMessage({ channel: 'system', sender: '仓库', content: `取出${ITEMS[itemId]?.name || itemId}成功！` });
          } else {
            addMessage({ channel: 'system', sender: '仓库', content: '仓库中没有此物品。' });
          }
        });
      });
    },

    // ── 锻造系统 ──────────────────────────────────────────────────────────
    forgeItem: (recipeId: string) => {
      const char = getChar();
      // Simplified forging - combine materials into equipment
      const FORGE_RECIPES: Record<string, { name: string; materials: string[]; result: string; goldCost: number }> = {
        'forge_iron_sword': {
          name: '锻造铁剑',
          materials: ['iron_ore', 'iron_ore', 'iron_ore'],
          result: 'iron_sword',
          goldCost: 100,
        },
        'forge_steel_armor': {
          name: '锻造钢甲',
          materials: ['steel_ore', 'steel_ore', 'leather'],
          result: 'steel_armor',
          goldCost: 200,
        },
      };

      const recipe = FORGE_RECIPES[recipeId];
      if (!recipe) {
        addMessage({ channel: 'system', sender: '锻造', content: '配方不存在。' });
        return;
      }

      // Check materials
      const invCounts: Record<string, number> = {};
      char.inventory.forEach(id => {
        invCounts[id] = (invCounts[id] || 0) + 1;
      });

      for (const mat of recipe.materials) {
        if ((invCounts[mat] || 0) < 1) {
          addMessage({ channel: 'system', sender: '锻造', content: `材料不足：${ITEMS[mat]?.name || mat}` });
          return;
        }
      }

      // Check gold
      if (char.gold < recipe.goldCost) {
        addMessage({ channel: 'system', sender: '锻造', content: '金叶不足。' });
        return;
      }

      // Consume materials
      let newInv = [...char.inventory];
      for (const mat of recipe.materials) {
        const idx = newInv.indexOf(mat);
        if (idx !== -1) newInv.splice(idx, 1);
      }

      // Add result
      newInv.push(recipe.result);

      updateChar(c => ({
        inventory: newInv,
        gold: c.gold - recipe.goldCost,
      }));

      addMessage({ channel: 'system', sender: '锻造', content: `锻造${ITEMS[recipe.result]?.name || recipe.result}成功！` });
    },

    // ── 炼丹系统 ──────────────────────────────────────────────────────────
    alchemy: (recipeId: string) => {
      const char = getChar();
      const ALCHEMY_RECIPES: Record<string, { name: string; materials: string[]; result: string; goldCost: number; successRate: number }> = {
        'health_pill_recipe': {
          name: '炼制回血丹',
          materials: ['green_herb', 'green_herb'],
          result: 'health_pill',
          goldCost: 20,
          successRate: 85,
        },
        'mp_pill_recipe': {
          name: '炼制回神丹',
          materials: ['red_mushroom', 'red_mushroom'],
          result: 'mp_pill',
          goldCost: 20,
          successRate: 85,
        },
        'rage_pill_recipe': {
          name: '炼制狂暴丹',
          materials: ['green_herb', 'red_mushroom', 'source_crystal'],
          result: 'rage_pill',
          goldCost: 50,
          successRate: 70,
        },
      };

      const recipe = ALCHEMY_RECIPES[recipeId];
      if (!recipe) {
        addMessage({ channel: 'system', sender: '炼丹', content: '配方不存在。' });
        return;
      }

      // Check materials
      const invCounts: Record<string, number> = {};
      char.inventory.forEach(id => {
        invCounts[id] = (invCounts[id] || 0) + 1;
      });

      for (const mat of recipe.materials) {
        if ((invCounts[mat] || 0) < 1) {
          addMessage({ channel: 'system', sender: '炼丹', content: `材料不足：${ITEMS[mat]?.name || mat}` });
          return;
        }
      }

      // Check gold
      if (char.gold < recipe.goldCost) {
        addMessage({ channel: 'system', sender: '炼丹', content: '金叶不足。' });
        return;
      }

      // Consume materials
      let newInv = [...char.inventory];
      for (const mat of recipe.materials) {
        const idx = newInv.indexOf(mat);
        if (idx !== -1) newInv.splice(idx, 1);
      }

      // Check success
      const success = Math.random() * 100 < recipe.successRate;
      if (success) {
        newInv.push(recipe.result);
        addMessage({ channel: 'system', sender: '炼丹', content: `炼丹成功！获得${ITEMS[recipe.result]?.name || '丹药'}！` });
      } else {
        addMessage({ channel: 'system', sender: '炼丹', content: '炼丹失败，材料消耗殆尽。' });
      }

      updateChar(c => ({
        inventory: newInv,
        gold: c.gold - recipe.goldCost,
      }));

      // Update quest progress
      updateQuestProgress('alchemy');
    },

    // ── 装备强化系统 ──────────────────────────────────────────────────────
    enhanceEquipment: (slot: string) => {
      const char = getChar();
      const itemId = char.equipment[slot as keyof typeof char.equipment];
      if (!itemId) {
        addMessage({ channel: 'system', sender: '强化', content: '该部位没有装备。' });
        return;
      }

      const currentLevel = char.enhanceLevels?.[slot] || 0;
      if (currentLevel >= 10) {
        addMessage({ channel: 'system', sender: '强化', content: '已达最高强化等级。' });
        return;
      }

      //强化费用
      const cost = Math.floor(100 * Math.pow(2, currentLevel));
      if (char.gold < cost) {
        addMessage({ channel: 'system', sender: '强化', content: `金叶不足，需要 ${cost} 金叶。` });
        return;
      }

      // 成功率
      const successRate = Math.max(10, 100 - currentLevel * 10);
      const success = Math.random() * 100 < successRate;

      if (success) {
        updateChar(c => ({
          enhanceLevels: { ...c.enhanceLevels, [slot]: currentLevel + 1 },
          gold: c.gold - cost,
        }));
        addMessage({ channel: 'system', sender: '强化', content: `强化成功！${slot}部位 +${currentLevel + 1}` });
      } else {
        updateChar(c => ({
          gold: c.gold - cost,
        }));
        addMessage({ channel: 'system', sender: '强化', content: `强化失败！${slot}部位保持 +${currentLevel}` });
      }

      // Update quest progress
      updateQuestProgress('enhance');
    },

    // ── 合成系统 ──────────────────────────────────────────────────────────
    combineItems: (itemId: string) => {
      const char = getChar();
      // Combine multiple items into one (e.g., scripture shards)
      const COMBINE_RECIPES: Record<string, { name: string; count: number; result: string }> = {
        'scripture_shard_common': {
          name: '合成凡俗经文',
          count: 10,
          result: 'skill_scroll_common',
        },
        'scripture_shard_rare': {
          name: '合成稀有经文',
          count: 10,
          result: 'skill_scroll_rare',
        },
      };

      const recipe = COMBINE_RECIPES[itemId];
      if (!recipe) {
        addMessage({ channel: 'system', sender: '合成', content: '无法合成此物品。' });
        return;
      }

      // Count items
      const count = char.inventory.filter(id => id === itemId).length;
      if (count < recipe.count) {
        addMessage({ channel: 'system', sender: '合成', content: `需要${recipe.count}个${recipe.name}，当前只有${count}个。` });
        return;
      }

      // Remove items and add result
      let removed = 0;
      const newInv = char.inventory.filter(id => {
        if (id === itemId && removed < recipe.count) {
          removed++;
          return false;
        }
        return true;
      });
      newInv.push(recipe.result);

      updateChar(c => ({
        inventory: newInv,
      }));

      addMessage({ channel: 'system', sender: '合成', content: `合成${ITEMS[recipe.result]?.name || recipe.result}成功！` });
    },

    // ── 组队系统 ──────────────────────────────────────────────────────────
    createParty: () => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '组队', content: '请先登录。' });
        return;
      }
      import('../services/multiplayerService').then(({ createParty }) => {
        const memberData = {
          uid,
          name: char.name,
          realmLevel: char.realmLevel,
          realm: char.realm,
          role: 'leader' as const,
          status: 'online' as const,
          hp: char.hp,
          maxHp: char.maxHp,
          roomId: state.combat.inDungeon ? 'dungeon' : 'world',
        };
        createParty(memberData).then(partyId => {
          if (partyId) {
            addMessage({ channel: 'system', sender: '组队', content: `创建队伍成功！队伍ID：${partyId}` });
          } else {
            addMessage({ channel: 'system', sender: '组队', content: '创建队伍失败。' });
          }
        });
      });
    },

    joinParty: (partyId: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '组队', content: '请先登录。' });
        return;
      }
      import('../services/multiplayerService').then(({ joinParty }) => {
        const memberData = {
          uid,
          name: char.name,
          realmLevel: char.realmLevel,
          realm: char.realm,
          role: 'member' as const,
          status: 'online' as const,
          hp: char.hp,
          maxHp: char.maxHp,
          roomId: state.combat.inDungeon ? 'dungeon' : 'world',
        };
        joinParty(partyId, memberData).then(() => {
          addMessage({ channel: 'system', sender: '组队', content: '加入队伍成功！' });
        });
      });
    },

    leaveParty: (partyId: string) => {
      const state = get();
      const { uid } = state;
      if (!uid) return;
      import('../services/multiplayerService').then(({ leaveParty }) => {
        leaveParty(partyId, uid);
        addMessage({ channel: 'system', sender: '组队', content: '离开队伍。' });
      });
    },

    // ── 组队副本 ──────────────────────────────────────────────────────────
    enterPartyDungeon: (dungeonId: string, partyId: string) => {
      const char = getChar();
      const state = get();
      const { uid } = state;
      if (!uid) {
        addMessage({ channel: 'system', sender: '副本', content: '请先登录。' });
        return;
      }

      // Check party exists
      import('../services/multiplayerService').then(({ getParty }) => {
        getParty(partyId).then(party => {
          if (!party) {
            addMessage({ channel: 'system', sender: '副本', content: '队伍不存在。' });
            return;
          }

          // Check dungeon
          const dungeon = DUNGEONS[dungeonId];
          if (!dungeon) {
            addMessage({ channel: 'system', sender: '副本', content: '副本不存在。' });
            return;
          }

          // Check level
          if (char.realmLevel < dungeon.levelMin) {
            addMessage({ channel: 'system', sender: '副本', content: `等级不足（需要 Lv.${dungeon.levelMin}）。` });
            return;
          }

          // Generate dungeon map
          const dungeonMap = generateDungeonMap(dungeon.roomCount, dungeonId);
          const entryRoomId = Object.keys(dungeonMap)[0];

          addMessage({ channel: 'system', sender: '副本', content: `队伍进入${dungeon.name}！` });
          addMessage({ channel: 'room', sender: dungeonMap[entryRoomId].name, content: dungeonMap[entryRoomId].description });

          set({
            combat: {
              ...state.combat,
              inDungeon: true,
              dungeonId: dungeonId,
              dungeonRoom: 0,
              dungeonScore: 0,
              dungeonDeaths: 0,
              dungeonSteps: 0,
            },
            zoneRooms: dungeonMap,
            currentGenRoomId: entryRoomId,
            dungeonCompletedRooms: new Set<string>(),
            dungeonCompletion: 0,
          });
        });
      });
    },

    // ── 成就系统 ──────────────────────────────────────────────────────────
    checkAchievements: () => {
      const char = getChar();
      const state = get();
      const progress: Record<string, number> = {
        [`kill_any`]: char.stats?.attack || 0, // Simplified
        [`level_any`]: char.realmLevel,
        [`realm_${char.realm}`]: 1,
        [`gold_any`]: char.gold,
        [`friend_any`]: 0, // Would need to track
        [`guild_create`]: char.sect ? 1 : 0,
        [`pvp_win`]: 0, // Would need to track
        [`dungeon_all`]: Object.keys(char.dungeonProgress).filter(k => char.dungeonProgress[k]?.cleared).length,
      };

      const newlyCompleted = state.achievementManager.checkAllAchievements(progress);
      newlyCompleted.forEach(achievementId => {
        state.achievementManager.completeAchievement(achievementId);
        const achievement = state.achievementManager.getAllAchievements().find(a => a.id === achievementId);
        if (achievement) {
          addMessage({ channel: 'system', sender: '成就', content: `完成成就【${achievement.name}】！` });
        }
      });
    },

    claimAchievementReward: (achievementId: string) => {
      const state = get();
      const reward = state.achievementManager.claimReward(achievementId);
      if (reward) {
        updateChar(c => ({
          exp: c.exp + (reward.exp || 0),
          gold: c.gold + (reward.gold || 0),
          inventory: [...c.inventory, ...(reward.items || [])],
        }));
        addMessage({ channel: 'system', sender: '成就', content: `领取成就奖励成功！` });
      }
    },

    // ── 称号系统 ──────────────────────────────────────────────────────────
    setActiveTitle: (titleId: string | null) => {
      const state = get();
      state.titleManager.setActiveTitle(titleId);
      addMessage({ channel: 'system', sender: '称号', content: titleId ? `设置称号成功！` : '取消称号。' });
    },

    // ── 世界事件 ──────────────────────────────────────────────────────────
    checkWorldEvents: () => {
      const newEvents = worldEventManager.checkEvents(Date.now());
      newEvents.forEach(event => {
        addMessage({ channel: 'system', sender: '世界', content: `【${event.name}】${event.description}` });
      });
      set({ activeWorldEvents: worldEventManager.getActiveEvents() });
    },

    triggerWorldEvent: (eventId: string) => {
      const event = worldEventManager.triggerEvent(eventId);
      if (event) {
        addMessage({ channel: 'system', sender: '世界', content: `【${event.name}】${event.description}` });
        set({ activeWorldEvents: worldEventManager.getActiveEvents() });
      }
    },
  };
});

