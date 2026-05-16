import { Character, Item, EquipmentSlots } from '../types/game';
import { ITEMS } from '../data/world';
import { ALL_ALCHEMY_RECIPES, ALCHEMY_RECIPE_MAP } from '../data/alchemyRecipes';

// ── 使用物品 ──
export function useItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { character: Partial<Character>; removeItem: boolean } | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  // 检查物品是否在背包中
  if (!character.inventory.includes(itemId)) {
    addMessage({ channel: 'system', sender: '物品', content: '你没有这个物品。' });
    return null;
  }

  // 消耗品
  if (item.type === 'consumable') {
    const changes: Partial<Character> = {};
    let messages: string[] = [];

    if (item.hp) {
      const newHp = Math.min(character.maxHp, character.hp + item.hp);
      changes.hp = newHp;
      messages.push(`恢复 ${item.hp} 气血`);
    }
    if (item.mp) {
      const newMp = Math.min(character.maxMp, character.mp + item.mp);
      changes.mp = newMp;
      messages.push(`恢复 ${item.mp} 神力`);
    }

    if (messages.length > 0) {
      addMessage({ channel: 'system', sender: '物品', content: `使用${item.name}，${messages.join('，')}。` });
      return { character: changes, removeItem: true };
    }
  }

  return null;
}

// ── 装备物品 ──
export function equipItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { equipment: Partial<EquipmentSlots>; inventory: string[] } | null {
  const item = ITEMS[itemId];
  if (!item || item.type !== 'equipment' || !item.slot) return null;

  if (!character.inventory.includes(itemId)) {
    addMessage({ channel: 'system', sender: '装备', content: '你没有这个装备。' });
    return null;
  }

  const slot = item.slot as keyof EquipmentSlots;
  const currentEquip = character.equipment[slot];
  const newEquip = { ...character.equipment, [slot]: itemId };
  const newInv = character.inventory.filter(id => id !== itemId);

  // 如果已有装备，卸下到背包
  if (currentEquip) {
    newInv.push(currentEquip);
  }

  addMessage({ channel: 'system', sender: '装备', content: `装备${item.name}（${slot}部位）${currentEquip ? `，卸下${ITEMS[currentEquip]?.name || '旧装备'}` : ''}` });

  return { equipment: newEquip, inventory: newInv };
}

// ── 卸下装备 ──
export function unequipItem(
  slot: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { equipment: Partial<EquipmentSlots>; inventory: string[] } | null {
  const itemId = character.equipment[slot as keyof EquipmentSlots];
  if (!itemId) return null;

  const item = ITEMS[itemId];
  const newEquip = { ...character.equipment, [slot]: null };
  const newInv = [...character.inventory, itemId];

  addMessage({ channel: 'system', sender: '卸装', content: `卸下${item?.name || '装备'}` });

  return { equipment: newEquip, inventory: newInv };
}

// ── 拾取物品 ──
export function pickupItem(
  itemId: string,
  character: Character,
  currentRoom: any,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[]; roomItems: string[] } | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  if (!currentRoom?.items?.includes(itemId)) {
    addMessage({ channel: 'system', sender: '物品', content: '这里没有这个物品。' });
    return null;
  }

  addMessage({ channel: 'system', sender: '物品', content: `拾取${item.name}` });

  return {
    inventory: [...character.inventory, itemId],
    roomItems: currentRoom.items.filter((id: string) => id !== itemId),
  };
}

// ── 丢弃物品 ──
export function dropItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[] } | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  if (!character.inventory.includes(itemId)) {
    addMessage({ channel: 'system', sender: '物品', content: '你没有这个物品。' });
    return null;
  }

  addMessage({ channel: 'system', sender: '物品', content: `丢弃${item.name}` });

  return { inventory: character.inventory.filter(id => id !== itemId) };
}

// ── 出售物品 ──
export function sellItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[]; gold: number } | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  if (!character.inventory.includes(itemId)) {
    addMessage({ channel: 'system', sender: '商店', content: '你没有这个物品。' });
    return null;
  }

  const sellPrice = Math.floor((item.value || 1) * 0.5);
  addMessage({ channel: 'system', sender: '商店', content: `出售${item.name}，获得 ${sellPrice} 金叶` });

  return {
    inventory: character.inventory.filter(id => id !== itemId),
    gold: character.gold + sellPrice,
  };
}

// ── 购买物品 ──
export function buyItem(
  itemId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[]; gold: number; yuankuai: number } | null {
  const item = ITEMS[itemId];
  if (!item) return null;

  const price = item.goldPrice || item.value || 0;
  const yuankuaiPrice = item.yuankuaiPrice || 0;

  if (character.gold < price) {
    addMessage({ channel: 'system', sender: '商店', content: '金叶不足。' });
    return null;
  }
  if (character.yuankuai < yuankuaiPrice) {
    addMessage({ channel: 'system', sender: '商店', content: '源块不足。' });
    return null;
  }

  addMessage({ channel: 'system', sender: '商店', content: `购买${item.name}成功！` });

  return {
    inventory: [...character.inventory, itemId],
    gold: character.gold - price,
    yuankuai: character.yuankuai - yuankuaiPrice,
  };
}

// ── 炼丹 ──
export function alchemy(
  recipeId: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { inventory: string[]; gold: number; success: boolean } | null {
  const recipe = ALCHEMY_RECIPE_MAP[recipeId];
  if (!recipe) return null;

  // 检查材料
  for (const mat of recipe.materials) {
    const count = character.inventory.filter(id => id === mat.itemId).length;
    if (count < mat.count) {
      addMessage({ channel: 'system', sender: '炼丹', content: `材料不足：${ITEMS[mat.itemId]?.name || mat.itemId}×${mat.count}` });
      return null;
    }
  }

  // 检查金叶
  if (character.gold < recipe.goldCost) {
    addMessage({ channel: 'system', sender: '炼丹', content: '金叶不足。' });
    return null;
  }

  // 消耗材料
  let newInv = [...character.inventory];
  for (const mat of recipe.materials) {
    let removed = 0;
    newInv = newInv.filter(id => {
      if (id === mat.itemId && removed < mat.count) {
        removed++;
        return false;
      }
      return true;
    });
  }

  // 判定成功
  const success = Math.random() * 100 < recipe.successRate;
  if (success) {
    newInv.push(recipe.resultItemId);
    addMessage({ channel: 'system', sender: '炼丹', content: `炼丹成功！获得${ITEMS[recipe.resultItemId]?.name || '丹药'}！` });
  } else {
    addMessage({ channel: 'system', sender: '炼丹', content: '炼丹失败，材料消耗殆尽。' });
  }

  return {
    inventory: newInv,
    gold: character.gold - recipe.goldCost,
    success,
  };
}

// ── 装备强化 ──
export function enhanceEquipment(
  slot: string,
  character: Character,
  addMessage: (msg: { channel: string; sender: string; content: string }) => void,
): { enhanceLevels: Record<string, number>; gold: number; success: boolean } | null {
  const itemId = character.equipment[slot as keyof EquipmentSlots];
  if (!itemId) {
    addMessage({ channel: 'system', sender: '强化', content: '该部位没有装备。' });
    return null;
  }

  const currentLevel = character.enhanceLevels?.[slot] || 0;
  if (currentLevel >= 10) {
    addMessage({ channel: 'system', sender: '强化', content: '已达最高强化等级。' });
    return null;
  }

  // 强化费用
  const cost = Math.floor(100 * Math.pow(2, currentLevel));
  if (character.gold < cost) {
    addMessage({ channel: 'system', sender: '强化', content: `金叶不足，需要 ${cost} 金叶。` });
    return null;
  }

  // 成功率
  const successRate = Math.max(10, 100 - currentLevel * 10);
  const success = Math.random() * 100 < successRate;

  const newEnhanceLevels = { ...character.enhanceLevels, [slot]: success ? currentLevel + 1 : currentLevel };

  if (success) {
    addMessage({ channel: 'system', sender: '强化', content: `强化成功！${slot}部位 +${currentLevel + 1}` });
  } else {
    addMessage({ channel: 'system', sender: '强化', content: `强化失败！${slot}部位保持 +${currentLevel}` });
  }

  return {
    enhanceLevels: newEnhanceLevels,
    gold: character.gold - cost,
    success,
  };
}
