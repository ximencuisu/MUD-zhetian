import { Character, SectRank, SECT_RANK_ORDER, RANK_PROMO_REQS, RANK_SALARY } from '../types/game';
import { SECTS, SECT_SKILLS } from '../data/sects';
import { ALL_SECT_SKILLS } from '../data/sectSkills';
import { SECT_NPC_MAP } from '../data/sectNpcs';
import { getSectShopItems, canBuyItem } from '../data/sectShop';
import { generateDailyQuests, ALL_SECT_QUESTS } from '../data/sectQuests';

// ── 加入门派 ──
export function joinSect(
  sectId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  const sect = SECTS[sectId];
  if (!sect) {
    addMessage({ channel: 'system', sender: '门派', content: '门派不存在。' });
    return null;
  }

  if (character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你已经加入了门派，请先退出当前门派。' });
    return null;
  }

  addMessage({ channel: 'system', sender: '门派', content: `你加入了${sect.fullName}！` });
  return {
    sect: sectId,
    sectRank: '外门弟子' as SectRank,
    contribution: 0,
    reputation: 0,
  };
}

// ── 退出门派 ──
export function leaveSect(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (!character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派。' });
    return null;
  }

  const sect = SECTS[character.sect];
  addMessage({ channel: 'system', sender: '门派', content: `你退出了${sect?.fullName || '门派'}。` });

  return {
    sect: null,
    sectRank: null,
    contribution: 0,
    reputation: 0,
  };
}

// ── 捐献 ──
export function donateToSect(
  goldAmount: number,
  yuankuaiAmount: number,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (!character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派。' });
    return null;
  }

  if (goldAmount < 0 || yuankuaiAmount < 0) {
    addMessage({ channel: 'system', sender: '门派', content: '捐献数量不能为负。' });
    return null;
  }

  if (character.gold < goldAmount) {
    addMessage({ channel: 'system', sender: '门派', content: '金叶不足。' });
    return null;
  }

  if (character.yuankuai < yuankuaiAmount) {
    addMessage({ channel: 'system', sender: '门派', content: '源块不足。' });
    return null;
  }

  const totalContrib = goldAmount + yuankuaiAmount * 10;
  addMessage({ channel: 'system', sender: '门派', content: `你向门派捐献 ${goldAmount} 金叶${yuankuaiAmount > 0 ? ` ${yuankuaiAmount} 源块` : ''}，获得 ${totalContrib} 点贡献值。` });

  return {
    gold: character.gold - goldAmount,
    yuankuai: character.yuankuai - yuankuaiAmount,
    contribution: character.contribution + totalContrib,
  };
}

// ── 领取俸禄 ──
export function claimSectSalary(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (!character.sect || !character.sectRank) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
    return null;
  }

  const salary = RANK_SALARY[character.sectRank];
  if (!salary) {
    addMessage({ channel: 'system', sender: '门派', content: '当前职位没有俸禄可领' });
    return null;
  }

  // 检查今日是否已领取
  const today = new Date().toDateString();
  if (character.lastSalaryClaim === today) {
    addMessage({ channel: 'system', sender: '门派', content: '今日俸禄已领取，请明日再来' });
    return null;
  }

  addMessage({ channel: 'system', sender: '门派', content: `你领取了${character.sectRank}的每日俸禄：${salary.gold}金叶${salary.yuankuai > 0 ? `${salary.yuankuai}源块` : ''}${salary.sectPoints > 0 ? `${salary.sectPoints}贡献` : ''}。` });

  return {
    gold: character.gold + salary.gold,
    yuankuai: character.yuankuai + salary.yuankuai,
    contribution: character.contribution + salary.sectPoints,
    lastSalaryClaim: today,
  };
}

// ── 晋升 ──
export function promoteSectRank(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): Partial<Character> | null {
  if (!character.sect || !character.sectRank) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
    return null;
  }

  const currentIdx = SECT_RANK_ORDER.indexOf(character.sectRank);
  if (currentIdx >= SECT_RANK_ORDER.length - 1) {
    addMessage({ channel: 'system', sender: '门派', content: '你已是最高职位' });
    return null;
  }

  const nextRank = SECT_RANK_ORDER[currentIdx + 1];
  const reqs = RANK_PROMO_REQS[nextRank];

  if (!reqs) {
    addMessage({ channel: 'system', sender: '门派', content: '暂无晋升条件' });
    return null;
  }

  // 检查条件
  if (character.realmLevel < (reqs.minRealmLevel || 0)) {
    addMessage({ channel: 'system', sender: '门派', content: `境界不足，需要 ${reqs.minRealmLevel} 级` });
    return null;
  }

  if (character.contribution < (reqs.contribution || 0)) {
    addMessage({ channel: 'system', sender: '门派', content: `贡献不足，需要 ${reqs.contribution} 点` });
    return null;
  }

  addMessage({ channel: 'system', sender: '门派', content: `恭喜！你晋升为${nextRank}！` });

  return {
    sectRank: nextRank,
  };
}

// ── 学习门派技能 ──
export function learnSectSkill(
  skillId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { skills: any[]; contribution: number } | null {
  if (!character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
    return null;
  }

  const skillDef = ALL_SECT_SKILLS.find(s => s.id === skillId);
  if (!skillDef) {
    addMessage({ channel: 'system', sender: '门派', content: '技能不存在' });
    return null;
  }

  // 检查是否已学习
  if (character.skills.some(s => s.id === skillId)) {
    addMessage({ channel: 'system', sender: '门派', content: '你已学习该技能' });
    return null;
  }

  // 检查贡献
  if (character.contribution < (skillDef.contributionCost || 0)) {
    addMessage({ channel: 'system', sender: '门派', content: `贡献不足，需要 ${skillDef.contributionCost} 点` });
    return null;
  }

  // 检查境界要求
  if (skillDef.minRealmLevel && character.realmLevel < skillDef.minRealmLevel) {
    addMessage({ channel: 'system', sender: '门派', content: `境界不足，需要 ${skillDef.minRealmLevel} 级` });
    return null;
  }

  addMessage({ channel: 'system', sender: '门派', content: `学习${skillDef.name}成功！` });

  return {
    skills: [...character.skills, {
      id: skillDef.id,
      name: skillDef.name,
      description: skillDef.description,
      category: skillDef.category,
      stars: skillDef.stars,
      level: 1,
      maxLevel: skillDef.maxLevel || 10,
      practiceExp: 0,
      damage: skillDef.damage,
      heal: skillDef.heal,
      mpCost: skillDef.mpCost,
      cooldown: skillDef.cooldown,
      currentCooldown: 0,
      type: skillDef.type,
      rarity: skillDef.rarity,
      skillType: skillDef.skillType,
      masteryLevel: 0,
    }],
    contribution: character.contribution - (skillDef.contributionCost || 0),
  };
}

// ── 刷新门派商店 ──
export function refreshSectShop(
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): string[] | null {
  if (!character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
    return null;
  }

  const items = getSectShopItems(character.sect);
  addMessage({ channel: 'system', sender: '门派', content: '门派商店已刷新' });
  return items.map(item => item.itemId);
}

// ── 购买门派商店物品 ──
export function buySectShopItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[]; contribution: number } | null {
  if (!character.sect) {
    addMessage({ channel: 'system', sender: '门派', content: '你尚未加入任何门派' });
    return null;
  }

  const items = getSectShopItems(character.sect);
  const shopItem = items.find(item => item.itemId === itemId);

  if (!shopItem) {
    addMessage({ channel: 'system', sender: '门派', content: '物品不存在' });
    return null;
  }

  if (!canBuyItem(shopItem, character.contribution, character.gold)) {
    addMessage({ channel: 'system', sender: '门派', content: '资源不足' });
    return null;
  }

  addMessage({ channel: 'system', sender: '门派', content: `购买${shopItem.itemId}成功！` });

  return {
    inventory: [...character.inventory, shopItem.itemId],
    contribution: character.contribution - (shopItem.contributionCost || 0),
  };
}
