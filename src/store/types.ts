import {
  Character, ChatMessage, CombatState, Quest, EquipmentSlots, AutoSettings, FloatWindowId,
  Item, SkillType, SectRank,
} from '../types/game';
import { GenRoom } from '../data/mapGen';

// ── 游戏状态接口 ──
export interface GameState {
  screen: 'login' | 'create' | 'game';
  gamePhase: 'login' | 'create' | 'game';
  character: Character;
  combat: CombatState;
  messages: ChatMessage[];
  quests: string[];

  openWindows: Set<FloatWindowId>;
  currentZoneId: string | null;
  currentZoneRoomId: string | null;
  zoneRooms: Record<string, GenRoom>;
  currentGenRoomId: string;
  dungeonCompletedRooms: Set<string>;
  dungeonCompletion: number;
  sectMapId: string | null;
  sectMapRoomId: string;
  prevWorldRoomId: string;
  sectQuests: Quest[];
  lastDailyQuestReset: string;
  sectShopItems: string[];

  uid: string | null;
  privateChatTarget: string | null;

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
  equipSkill: (skillId: string, slotType: SkillType) => void;
  unequipSkill: (slotType: SkillType) => void;
  setAutoCombat: (v: boolean) => void;
  setAutoCastSkill: (skillId: string, enabled: boolean) => void;
  buyItem: (itemId: string) => void;
  enterDungeon: (dungeonId: string) => void;
  exitDungeon: () => void;
  sweepDungeon: (dungeonId: string, count: number) => void;
  enterZone: (zoneId: string) => void;
  exitZone: () => void;
  joinSect: (sectId: string) => void;
  leaveSect: () => void;
  donateToSect: (goldAmount: number, yuankuaiAmount?: number) => void;
  claimSectSalary: () => void;
  promoteSectRank: () => void;
  learnSectSkill: (skillId: string) => void;
  enterSectMap: (sectId: string) => void;
  exitSectMap: () => void;
  moveSectRoom: (roomId: string) => void;
  talkToSectNpc: (npcId: string) => void;
  refreshSectShop: () => void;
  buySectShopItem: (itemId: string) => void;
  acceptSectQuest: (questId: string) => void;
  abandonSectQuest: (questId: string) => void;
  tickSectQuest: () => void;
  alchemy: (recipeId: string) => void;
  enhanceEquipment: (slot: string) => void;
  toggleWindow: (id: FloatWindowId) => void;
  processCommand: (raw: string) => void;
  startCultivation: (mode: 'cultivate' | 'meditate') => void;
  stopCultivation: () => void;
  meditate: () => void;
  acceptQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  tickCultivation: () => void;
  applyOfflineProgress: () => void;
  rerollPhenomenon: () => void;
  choosePhenomenon: (id: string) => void;
  setAutoPotion: (enabled: boolean) => void;
  setAutoPotionThreshold: (threshold: number) => void;
  updateSettings: (settings: Partial<AutoSettings>) => void;
  saveGame: () => void;

  // 交易系统
  sendTradeRequest: (targetName: string) => void;
  acceptTrade: (tradeId: string) => void;
  cancelTrade: (tradeId: string) => void;

  // 仓库系统
  storeItem: (itemId: string) => void;
  withdrawItem: (itemId: string) => void;

  // 锻造系统
  forgeItem: (recipeId: string) => void;

  // 合成系统
  combineItems: (itemId: string) => void;

  // 组队系统
  createParty: () => void;
  joinParty: (partyId: string) => void;
  leaveParty: (partyId: string) => void;
  enterPartyDungeon: (dungeonId: string, partyId: string) => void;
}

// ── Store 辅助类型 ──
export type StoreSet = (fn: (state: GameState) => Partial<GameState>) => void;
export type StoreGet = () => GameState;
