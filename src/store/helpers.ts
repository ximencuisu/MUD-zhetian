import {
  Character, CharacterStats, CharacterAttributes, EquipmentSlots, Item,
  REALM_ORDER, PhenomenonId,
} from '../types/game';
import { ITEMS } from '../data/world';
import { PHENOMENA } from '../data/phenomena';

// ── 随机 ID 生成 ──
export const uid = () => Math.random().toString(36).slice(2, 8);

// ── 属性骰点 ──
export function rollAttr(): number {
  return Math.floor(Math.random() * 8) + 12; // 12-19
}

// ── 计算角色属性 ──
export function calcStats(character: Character): CharacterStats {
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

// ── 计算最大气血 ──
export function calcMaxHp(character: Character): number {
  const base = 100 + character.attributes.gengu * 10 + character.realmLevel * 15 + character.luohai * 3;
  const hpMult = character.phenomenon ? (PHENOMENA[character.phenomenon]?.buff.hpMult || 1) : 1;
  return Math.floor((base + character.stats.maxHpBonus + character.bonusHpCap) * hpMult);
}

// ── 计算最大神力 ──
export function calcMaxMp(character: Character): number {
  const base = 60 + character.attributes.ganzhi * 5 + character.realmLevel * 8 + character.mingyuan * 2;
  const mpMult = character.phenomenon ? (PHENOMENA[character.phenomenon]?.buff.mpMult || 1) : 1;
  return Math.floor((base + character.stats.maxMpBonus + character.bonusMpCap) * mpMult);
}

// ── 计算战力评分 ──
export function calcPower(character: Character): number {
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

// ── 计算升级所需经验 ──
export function calcExpToNext(_realm: string, realmLevel: number): number {
  return Math.floor(80 + realmLevel * 25);
}

// ── 计算突破所需等级 ──
export function calcBreakthroughLevel(realmIdx: number): number {
  const isBig = realmIdx % 4 === 3;
  return isBig ? 15 : 10;
}

// ── 战斗描述语言（遮天风格） ──
export const COMBAT_HIT_PHRASES = [
  '以浑厚神力轰出一拳',
  '运转苦海源力，爆发冲击',
  '一掌拍出，劲气澎湃',
  '凝聚源力于拳锋，猛然轰击',
  '身形如电，一击命中',
  '催动体内源力，气劲激荡',
  '拳风呼啸，势不可挡',
  '源力灌注双拳，狠狠砸下',
];

export const COMBAT_CRIT_PHRASES = [
  '源力爆发！致命一击！',
  '拳劲透体，暴击！',
  '一击破防，暴击伤害！',
  '源力凝聚于一点，暴击穿透！',
];

export const COMBAT_MISS_PHRASES = [
  '身形一闪，避开了攻击',
  '源力护体，化解了攻势',
  '对方灵活闪避，攻击落空',
  '源力震荡，偏转了攻击',
];
