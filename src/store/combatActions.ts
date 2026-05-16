import { Character, CombatState, ChatMessage, Item, EquipmentSlots } from '../types/game';
import { ITEMS, NPCS } from '../data/world';
import { DUNGEONS } from '../data/dungeons';
import { ZONES, ZONE_NPCS } from '../data/zones';
import { createScaledBuff, getDotDamage, getAdditionalEffects, hasDebuffEffect, SKILL_BUFF_EFFECTS } from '../data/buffEffects';
import { generateDungeonMap } from '../data/dungeonMapGen';
import { calcStats, calcMaxHp, calcMaxMp, calcExpToNext, COMBAT_HIT_PHRASES, COMBAT_CRIT_PHRASES, COMBAT_MISS_PHRASES } from './helpers';

// ── 开始攻击 ──
export function startAttack(
  npcId: string,
  character: Character,
  currentZoneId: string | null,
  zoneRooms: Record<string, any>,
  currentGenRoomId: string,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { combat: Partial<CombatState>; character?: Partial<Character> } | null {
  // 查找 NPC
  let npc = NPCS[npcId];
  if (!npc && currentZoneId) {
    const zone = ZONES[currentZoneId];
    if (zone) {
      const room = zone.rooms.find(r => r.id === currentGenRoomId);
      if (room) {
        const npcData = room.npcs.find(n => n.id === npcId);
        if (npcData) npc = npcData;
      }
    }
  }
  if (!npc) {
    const zoneNpc = ZONE_NPCS[npcId];
    if (zoneNpc) npc = zoneNpc;
  }
  if (!npc) return null;

  // 检查是否可攻击
  if (!npc.isHostile) {
    addMessage({ channel: 'system', sender: '战斗', content: `${npc.name}不是敌对目标。` });
    return null;
  }

  // 开始战斗
  const scaledHp = Math.floor(npc.hp * (1 + (npc.level || 1) * 0.1));
  addMessage({ channel: 'combat', sender: '战斗', content: `你对${npc.name}发起攻击！` });

  return {
    combat: {
      isInCombat: true,
      targetId: npcId,
      targetName: npc.name,
      targetHp: scaledHp,
      targetMaxHp: scaledHp,
      targetLevel: npc.level || 1,
      combatLog: [],
      turnCount: 0,
      comboCount: 0,
      maxComboCount: 0,
      playerBuffs: [],
      targetDebuffs: [],
    },
  };
}

// ── 处理战斗回合 ──
export function processCombatTick(
  character: Character,
  combat: CombatState,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): {
  combat: Partial<CombatState>;
  character: Partial<Character>;
  expGain: number;
  goldGain: number;
  itemGains: string[];
  defeated: boolean;
  playerDied: boolean;
} | null {
  if (!combat.isInCombat || !combat.targetId) return null;

  const stats = character.stats;

  // 每回合消耗精力
  const energyCost = 2;
  if (character.energy < energyCost) {
    addMessage({ channel: 'system', sender: '战斗', content: '精力不足，无法继续战斗！' });
    return {
      combat: { isInCombat: false, targetId: null, targetName: '' },
      character: { energy: 0 },
      expGain: 0, goldGain: 0, itemGains: [], defeated: false, playerDied: false,
    };
  }

  // Buff/Debuff 处理
  const currentBuffs = [...(combat.playerBuffs || [])];
  const currentDebuffs = [...(combat.targetDebuffs || [])];
  let newBuffs = currentBuffs.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);
  let newDebuffs = currentDebuffs.map(d => ({ ...d, duration: d.duration - 1 })).filter(d => d.duration > 0);

  // Buff 属性加成
  const buffedAttack = stats.attack + newBuffs.filter(b => b.stat === 'attack').reduce((sum, b) => sum + b.value, 0);
  const buffedCritRate = Math.min(95, stats.critRate + newBuffs.filter(b => b.stat === 'critRate').reduce((sum, b) => sum + b.value, 0));
  const buffedCritDmg = stats.critDmg + newBuffs.filter(b => b.stat === 'critDmg').reduce((sum, b) => sum + b.value, 0);

  // 境界压制
  const targetLevel = combat.targetLevel;
  const levelDiff = character.realmLevel - targetLevel;
  const suppression = Math.max(0.3, Math.min(3.0, 1 + levelDiff * 0.03));
  const playerDmgMult = suppression;

  // 玩家攻击
  const hit = Math.random() * 100 < stats.hit;
  let finalDmg = 0;
  let isCrit = false;

  if (hit) {
    const debuffedTargetArmor = (targetLevel || 1) * 2 + 5;
    const defMitigation = buffedAttack > 0 ? Math.max(0.3, 1 - debuffedTargetArmor / (buffedAttack + debuffedTargetArmor + 50)) : 0.5;
    const baseDmg = Math.max(5, Math.floor(buffedAttack * defMitigation * (0.85 + Math.random() * 0.3)));
    isCrit = Math.random() * 100 < buffedCritRate;
    const combo = combat.comboCount || 0;
    const comboMult = 1 + Math.min(combo, 10) * 0.05;
    finalDmg = Math.floor(baseDmg * playerDmgMult * comboMult * (isCrit ? buffedCritDmg / 100 : 1));

    if (isCrit && buffedCritRate >= 50) {
      finalDmg = Math.floor(finalDmg * (1 + (buffedCritRate - 50) * 0.002));
    }
  }

  // 敌人攻击
  const enemyHit = Math.random() * 100 < 70;
  let enemyDmg = 0;
  if (enemyHit) {
    const enemyBaseDmg = Math.max(3, Math.floor((targetLevel * 5 + 10) * (0.8 + Math.random() * 0.4)));
    const enemyDmgMult = Math.max(0.3, Math.min(3.0, 1 - levelDiff * 0.03));
    enemyDmg = Math.floor(enemyBaseDmg * enemyDmgMult);
  }

  // 计算结果
  const newTargetHp = Math.max(0, combat.targetHp - finalDmg);
  const newPlayerHp = Math.max(0, character.hp - enemyDmg);

  // 生成消息
  if (hit) {
    const phrase = isCrit
      ? COMBAT_CRIT_PHRASES[Math.floor(Math.random() * COMBAT_CRIT_PHRASES.length)]
      : COMBAT_HIT_PHRASES[Math.floor(Math.random() * COMBAT_HIT_PHRASES.length)];
    const comboStr = combat.comboCount > 0 ? ` [连击×${combat.comboCount + 1}]` : '';
    addMessage({ channel: 'combat', sender: '战斗', content: `${phrase}，对${combat.targetName}造成 ${finalDmg} 点伤害${comboStr}。（${newTargetHp}/${combat.targetMaxHp}）` });
  } else {
    const missPhrase = COMBAT_MISS_PHRASES[Math.floor(Math.random() * COMBAT_MISS_PHRASES.length)];
    addMessage({ channel: 'combat', sender: '战斗', content: `你的攻击被${combat.targetName}${missPhrase}！` });
  }

  if (enemyHit) {
    addMessage({ channel: 'combat', sender: combat.targetName, content: `${combat.targetName}反击，对你造成 ${enemyDmg} 点伤害！` });
  } else {
    addMessage({ channel: 'combat', sender: combat.targetName, content: `${combat.targetName}的攻击被你闪过！` });
  }

  const result = {
    combat: {
      targetHp: newTargetHp,
      playerBuffs: newBuffs,
      targetDebuffs: newDebuffs,
      comboCount: hit ? (combat.comboCount || 0) + 1 : 0,
      maxComboCount: hit ? Math.max(combat.maxComboCount || 0, (combat.comboCount || 0) + 1) : combat.maxComboCount,
      turnCount: combat.turnCount + 1,
      combatLog: [...(combat.combatLog || []), `${isCrit ? '⚡' : '▸'} ${finalDmg} → ${combat.targetName}`].slice(-50),
    },
    character: {
      hp: newPlayerHp,
      energy: Math.max(0, character.energy - energyCost),
    },
    expGain: 0,
    goldGain: 0,
    itemGains: [] as string[],
    defeated: false,
    playerDied: false,
  };

  // 敌人被击败
  if (newTargetHp <= 0) {
    const npc = NPCS[combat.targetId] || ZONE_NPCS[combat.targetId];
    if (npc) {
      result.expGain = npc.expReward || 0;
      result.goldGain = npc.goldReward || 0;
      if (npc.drops) {
        result.itemGains = npc.drops.filter(() => Math.random() < 0.3);
      }
      result.defeated = true;
      result.combat.isInCombat = false;
      result.combat.targetId = null;
      result.combat.targetName = '';
      addMessage({ channel: 'combat', sender: '战斗', content: `击败${npc.name}！获得 ${result.expGain} 修为经验${result.goldGain > 0 ? ` ${result.goldGain} 金叶` : ''}。` });
    }
  }

  // 玩家死亡
  if (newPlayerHp <= 0) {
    result.playerDied = true;
    result.combat.isInCombat = false;
    result.combat.targetId = null;
    result.combat.targetName = '';
    addMessage({ channel: 'combat', sender: '战斗', content: '你被击败了！' });
  }

  return result;
}

// ── 逃跑 ──
export function processFlee(
  combat: CombatState,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<CombatState> | null {
  if (!combat.isInCombat) return null;

  const fleeChance = 50 + Math.random() * 30;
  if (fleeChance > 60) {
    addMessage({ channel: 'system', sender: '战斗', content: '你成功逃离了战斗！' });
    return { isInCombat: false, targetId: null, targetName: '', comboCount: 0 };
  } else {
    addMessage({ channel: 'system', sender: '战斗', content: '逃跑失败！' });
    return null;
  }
}
