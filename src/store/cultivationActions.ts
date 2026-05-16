import { Character, CultivationMode, REALM_ORDER } from '../types/game';
import { PHENOMENA, rollPhenomenon, RARITY_LABELS, RARITY_COLORS } from '../data/phenomena';
import { calcExpToNext, calcMaxHp, calcMaxMp } from './helpers';

// ── 开始挂机 ──
export function startCultivation(
  mode: CultivationMode,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (character.cultivationMode !== 'none') {
    addMessage({ channel: 'system', sender: '挂机', content: '你已在挂机中，请先停止。' });
    return null;
  }

  const modeName = mode === 'cultivate' ? '挂机修炼' : '挂机打坐';
  addMessage({ channel: 'system', sender: '挂机', content: `开始${modeName}……（关闭页面后4小时内仍会持续积累）` });

  return {
    cultivationMode: mode,
    cultivationStartMs: Date.now(),
  };
}

// ── 停止挂机 ──
export function stopCultivation(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (character.cultivationMode === 'none') {
    addMessage({ channel: 'system', sender: '挂机', content: '你没有在挂机。' });
    return null;
  }

  const modeName = character.cultivationMode === 'cultivate' ? '挂机修炼' : '挂机打坐';
  addMessage({ channel: 'system', sender: '挂机', content: `停止${modeName}。` });

  return {
    cultivationMode: 'none',
    cultivationStartMs: 0,
  };
}

// ── 打坐 ──
export function meditate(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  const expGain = Math.floor(8 + character.realmLevel * 4 + character.attributes.ganzhi * 0.8);
  const mpRestore = Math.floor(15 + character.attributes.ganzhi * 2);
  const hpRestore = Math.floor(10 + character.attributes.gengu * 1.5);
  const energyRestore = Math.floor(20 + character.attributes.ganzhi * 0.5);

  addMessage({ channel: 'system', sender: '修炼', content: `你盘膝打坐，引天地源力入体……恢复 ${hpRestore} 气血 ${mpRestore} 神力 ${energyRestore} 精力，获得 ${expGain} 修为经验。` });

  let newExp = character.exp + expGain;
  let rl = character.realmLevel;
  let et = calcExpToNext(character.realm, rl);
  while (newExp >= et) {
    newExp -= et;
    rl += 1;
    et = calcExpToNext(character.realm, rl);
  }

  return {
    hp: Math.min(character.maxHp, character.hp + hpRestore),
    mp: Math.min(character.maxMp, character.mp + mpRestore),
    energy: Math.min(character.maxEnergy, character.energy + energyRestore),
    exp: newExp,
    expToNext: et,
    realmLevel: rl,
    luohai: Math.min(100, character.luohai + 1),
    age: character.age + 1,
  };
}

// ── 挂机 tick ──
export function tickCultivation(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (character.cultivationMode === 'none') return null;

  const realmIdx = REALM_ORDER.indexOf(character.realm);
  const realmMult = 1 + realmIdx * 0.3;
  const ganzhiBonus = 1 + character.attributes.ganzhi * 0.02;

  if (character.cultivationMode === 'cultivate') {
    // 挂机修炼：每秒获得修为经验
    const baseExpPerTick = Math.floor((3 + character.realmLevel * 1.5) * realmMult * ganzhiBonus * 1000);
    let newExp = character.exp + baseExpPerTick;
    let rl = character.realmLevel;
    let et = calcExpToNext(character.realm, rl);
    while (newExp >= et) {
      newExp -= et;
      rl += 1;
      et = calcExpToNext(character.realm, rl);
    }

    // 每600秒（10分钟）年龄+1
    const elapsedSec = Math.floor((Date.now() - character.cultivationStartMs) / 1000);
    const newAge = 16 + Math.floor(elapsedSec / 3600);

    return {
      exp: newExp,
      expToNext: et,
      realmLevel: rl,
      luohai: Math.min(100, character.luohai + 0.05),
      age: newAge,
    };
  } else {
    // 挂机打坐：每秒恢复10%气血和神力
    const effectiveMaxHp = character.maxHp + character.bonusHpCap;
    const effectiveMaxMp = character.maxMp + character.bonusMpCap;
    const hpRestore = Math.max(1, Math.floor(effectiveMaxHp * 0.1));
    const mpRestore = Math.max(1, Math.floor(effectiveMaxMp * 0.1));
    const newHp = Math.min(effectiveMaxHp, character.hp + hpRestore);
    const newMp = Math.min(effectiveMaxMp, character.mp + mpRestore);

    // 超出双倍基础上限后，微量提升上限（受境界限制）
    const baseMaxHp = calcMaxHp(character);
    const baseMaxMp = calcMaxMp(character);
    const realmCapHp = baseMaxHp * (1 + realmIdx * 0.5);
    const realmCapMp = baseMaxMp * (1 + realmIdx * 0.5);
    let newBonusHp = character.bonusHpCap;
    let newBonusMp = character.bonusMpCap;

    if (newHp >= baseMaxHp * 2 && newBonusHp < realmCapHp - baseMaxHp) {
      newBonusHp = Math.min(realmCapHp - baseMaxHp, newBonusHp + 0.5);
    }
    if (newMp >= baseMaxMp * 2 && newBonusMp < realmCapMp - baseMaxMp) {
      newBonusMp = Math.min(realmCapMp - baseMaxMp, newBonusMp + 0.5);
    }

    return {
      hp: Math.floor(newHp),
      mp: Math.floor(newMp),
      energy: Math.min(character.maxEnergy, character.energy + 5),
      bonusHpCap: Math.floor(newBonusHp),
      bonusMpCap: Math.floor(newBonusMp),
    };
  }
}

// ── 离线进度 ──
export function applyOfflineProgress(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (character.cultivationMode === 'none' || character.cultivationStartMs === 0) return null;

  const now = Date.now();
  const elapsedMs = now - character.lastSaveMs;
  const maxMs = 24 * 60 * 60 * 1000; // 24小时上限
  const effectiveMs = Math.min(elapsedMs, maxMs);
  const ticks = Math.floor(effectiveMs / 1000); // 每秒1tick

  if (ticks <= 0) return null;

  const realmIdx = REALM_ORDER.indexOf(character.realm);
  const realmMult = 1 + realmIdx * 0.3;
  const ganzhiBonus = 1 + character.attributes.ganzhi * 0.02;

  if (character.cultivationMode === 'cultivate') {
    const baseExpPerTick = Math.floor((3 + character.realmLevel * 1.5) * realmMult * ganzhiBonus * 1000);
    const totalExp = baseExpPerTick * ticks;
    const elapsedHours = Math.floor(ticks / 3600);

    let newExp = character.exp + totalExp;
    let rl = character.realmLevel;
    let et = calcExpToNext(character.realm, rl);
    while (newExp >= et) {
      newExp -= et;
      rl += 1;
      et = calcExpToNext(character.realm, rl);
    }

    addMessage({ channel: 'system', sender: '离线', content: `离线挂机 ${elapsedHours} 小时，获得 ${totalExp} 修为经验。` });

    return {
      exp: newExp,
      expToNext: et,
      realmLevel: rl,
      luohai: Math.min(100, character.luohai + ticks * 0.05),
      age: character.age + Math.floor(ticks / 3600),
    };
  } else {
    // 挂机打坐离线
    const effectiveMaxHp = character.maxHp + character.bonusHpCap;
    const effectiveMaxMp = character.maxMp + character.bonusMpCap;
    const hpRestore = Math.max(1, Math.floor(effectiveMaxHp * 0.1)) * ticks;
    const mpRestore = Math.max(1, Math.floor(effectiveMaxMp * 0.1)) * ticks;
    const elapsedHours = Math.floor(ticks / 3600);

    addMessage({ channel: 'system', sender: '离线', content: `离线挂机 ${elapsedHours} 小时，气血恢复 ${Math.floor(hpRestore)}，神力恢复 ${Math.floor(mpRestore)}。` });

    return {
      hp: Math.min(effectiveMaxHp, character.hp + hpRestore),
      mp: Math.min(effectiveMaxMp, character.mp + mpRestore),
      energy: Math.min(character.maxEnergy, character.energy + ticks * 5),
    };
  }
}

// ── 异象重 roll ──
export function rerollPhenomenon(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (character.phenomenonRerolls >= 10) {
    addMessage({ channel: 'system', sender: '异象', content: '已达重 roll 次数上限（10次），可直接选择异象。' });
    return null;
  }

  const newPhenomenon = rollPhenomenon();
  const phen = PHENOMENA[newPhenomenon];
  const rarityLabel = RARITY_LABELS[phen.rarity];

  addMessage({ channel: 'system', sender: '异象', content: `重 roll 异象！获得【${phen.name}】（${rarityLabel}）` });

  return {
    phenomenon: newPhenomenon,
    phenomenonRerolls: character.phenomenonRerolls + 1,
  };
}

// ── 选择异象 ──
export function choosePhenomenon(
  phenomenonId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  const phen = PHENOMENA[phenomenonId];
  if (!phen) {
    addMessage({ channel: 'system', sender: '异象', content: '异象不存在。' });
    return null;
  }

  addMessage({ channel: 'system', sender: '异象', content: `你选择了【${phen.name}】异象！` });

  return {
    phenomenon: phenomenonId,
  };
}
