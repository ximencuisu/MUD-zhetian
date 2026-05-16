import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ITEMS } from '../../data/world';
import { ALL_ALCHEMY_RECIPES, AlchemyRecipe } from '../../data/alchemyRecipes';
import './AlchemyPanel.css';

function getQualityColor(q?: string): string {
  switch (q) {
    case 'orange': return '#ff9900';
    case 'purple': return '#cc66ff';
    case 'blue': return '#66ccff';
    case 'green': return '#66ff66';
    default: return '#aaa';
  }
}

function getQualityLabel(q?: string): string {
  switch (q) {
    case 'orange': return '传说';
    case 'purple': return '史诗';
    case 'blue': return '精良';
    case 'green': return '优秀';
    default: return '普通';
  }
}

function getSuccessRateColor(rate: number): string {
  if (rate >= 80) return '#66ff99';
  if (rate >= 60) return '#ffd700';
  if (rate >= 40) return '#ff8844';
  return '#ff4444';
}

export default function AlchemyPanel() {
  const { character, addMessage, updateCharacter, toggleWindow } = useGameStore();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [crafting, setCrafting] = useState(false);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  const inventorySet = useMemo(() => {
    const map = new Map<string, number>();
    for (const id of character?.inventory || []) {
      map.set(id, (map.get(id) || 0) + 1);
    }
    return map;
  }, [character?.inventory]);

  // Filter recipes by level requirement
  const availableRecipes = useMemo(() => {
    return ALL_ALCHEMY_RECIPES.filter(r => character && character.realmLevel >= r.requiredLevel);
  }, [character?.realmLevel]);

  const selectedRecipe = selectedRecipeId
    ? ALL_ALCHEMY_RECIPES.find(r => r.id === selectedRecipeId)
    : null;

  // Check if player has enough materials
  const canCraft = useMemo(() => {
    if (!selectedRecipe || !character) return false;
    for (const [itemId, count] of Object.entries(selectedRecipe.materials)) {
      if ((inventorySet.get(itemId) || 0) < count) return false;
    }
    return character.gold >= selectedRecipe.goldCost;
  }, [selectedRecipe, inventorySet, character?.gold]);

  const handleCraft = () => {
    if (!selectedRecipe || crafting || !character) return;

    // Double-check materials
    for (const [itemId, count] of Object.entries(selectedRecipe.materials)) {
      if ((inventorySet.get(itemId) || 0) < count) {
        addMessage({ channel: 'system', sender: '炼丹', content: `材料不足：缺少 ${ITEMS[itemId]?.name || itemId} x${count}` });
        return;
      }
    }
    if (character.gold < selectedRecipe.goldCost) {
      addMessage({ channel: 'system', sender: '炼丹', content: `金币不足！炼丹需要 ${selectedRecipe.goldCost} 金叶。` });
      return;
    }

    setCrafting(true);
    setResult(null);

    // Simulate crafting with delay for animation
    setTimeout(() => {
      const roll = Math.random() * 100;
      const success = roll < selectedRecipe.baseSuccessRate;

      if (success) {
        // Consume materials
        let newInv = [...character.inventory];
        for (const [itemId, count] of Object.entries(selectedRecipe.materials)) {
          for (let i = 0; i < count; i++) {
            const idx = newInv.indexOf(itemId);
            if (idx !== -1) newInv.splice(idx, 1);
          }
        }
        // Add result pill
        newInv.push(selectedRecipe.resultId);

        const resultItem = ITEMS[selectedRecipe.resultId];
        updateCharacter({
          inventory: newInv,
          gold: character.gold - selectedRecipe.goldCost,
        });

        addMessage({
          channel: 'system',
          sender: '炼丹',
          content: `✦ 炼丹成功！炼制出 ${resultItem?.name || selectedRecipe.resultId}！消耗 ${selectedRecipe.goldCost} 金叶。`,
        });
        setResult('success');
      } else {
        // Consume materials even on failure
        let newInv = [...character.inventory];
        for (const [itemId, count] of Object.entries(selectedRecipe.materials)) {
          for (let i = 0; i < count; i++) {
            const idx = newInv.indexOf(itemId);
            if (idx !== -1) newInv.splice(idx, 1);
          }
        }

        updateCharacter({
          inventory: newInv,
          gold: character.gold - selectedRecipe.goldCost,
        });

        addMessage({
          channel: 'system',
          sender: '炼丹',
          content: `💥 炼丹失败！材料已耗尽，失去 ${selectedRecipe.goldCost} 金叶。`,
        });
        setResult('fail');
      }

      setTimeout(() => {
        setCrafting(false);
        setResult(null);
      }, 1000);
    }, 600);
  };

  if (!character) {
    return <div className="alchemy-empty">请先创建角色</div>;
  }

  return (
    <div className="alchemy-panel">
      <h3 className="alchemy-title">⚗️ 炼丹炉</h3>

      <div className="alchemy-top-bar">
        <span>💰 金叶: <strong className="gold-amount">{character.gold.toLocaleString()}</strong></span>
        <span>📦 背包: <strong>{character.inventory.length}/100</strong></span>
      </div>

      {/* Recipe list */}
      <div className="alchemy-recipe-list">
        <h4 className="section-title">📜 丹方（Lv.{character.realmLevel}）</h4>
        {availableRecipes.length === 0 ? (
          <div className="no-recipes">
            <p>暂无可用丹方</p>
            <p className="hint">提升境界等级以解锁更多丹方</p>
          </div>
        ) : (
          availableRecipes.map(recipe => {
            const resultItem = ITEMS[recipe.resultId];
            const isSelected = selectedRecipeId === recipe.id;
            return (
              <button
                key={recipe.id}
                className={`recipe-card ${isSelected ? 'selected' : ''} ${result ? `result-${result}` : ''}`}
                onClick={() => { setSelectedRecipeId(recipe.id); setResult(null); }}
              >
                <div className="recipe-header">
                  <span className="recipe-name">{recipe.name}</span>
                  <span className="recipe-tier" style={{ color: getQualityColor(resultItem?.quality) }}>
                    {getQualityLabel(resultItem?.quality)}
                  </span>
                </div>
                <div className="recipe-result">
                  <span className="result-icon">→</span>
                  <span className="result-name" style={{ color: getQualityColor(resultItem?.quality) }}>
                    {resultItem?.name || recipe.resultId}
                  </span>
                </div>
                <div className="recipe-materials">
                  {Object.entries(recipe.materials).map(([itemId, count]) => {
                    const have = inventorySet.get(itemId) || 0;
                    const item = ITEMS[itemId];
                    return (
                      <span
                        key={itemId}
                        className={`material-tag ${have >= count ? 'have' : 'lack'}`}
                      >
                        {item?.name || itemId} x{count}
                        <span className="material-have">({have})</span>
                      </span>
                    );
                  })}
                </div>
                <div className="recipe-meta">
                  <span className="meta-level">Lv.{recipe.requiredLevel}</span>
                  <span className="meta-rate" style={{ color: getSuccessRateColor(recipe.baseSuccessRate) }}>
                    {recipe.baseSuccessRate}%
                  </span>
                  <span className="meta-gold">{recipe.goldCost} 💰</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Locked recipes */}
      {ALL_ALCHEMY_RECIPES.length > availableRecipes.length && (
        <div className="locked-recipes">
          <h4 className="section-title lock-title">🔒 未解锁丹方</h4>
          {ALL_ALCHEMY_RECIPES
            .filter(r => character.realmLevel < r.requiredLevel)
            .map(recipe => (
              <div key={recipe.id} className="recipe-card locked">
                <div className="recipe-header">
                  <span className="recipe-name">{recipe.name}</span>
                  <span className="lock-req">Lv.{recipe.requiredLevel}</span>
                </div>
                <div className="recipe-result">
                  <span className="result-icon">→</span>
                  <span className="result-name">{recipe.resultId}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Craft button */}
      {selectedRecipe && (
        <div className="craft-section">
          <div className={`craft-area ${result ? `result-${result}` : ''}`}>
            <div className="craft-info">
              <div className="craft-recipe-name">
                {ITEMS[selectedRecipe.resultId]?.name || selectedRecipe.resultId}
              </div>
              <div className="craft-rate-bar">
                <div className="rate-label">成功率</div>
                <div className="rate-track">
                  <div
                    className="rate-fill"
                    style={{
                      width: `${selectedRecipe.baseSuccessRate}%`,
                      backgroundColor: getSuccessRateColor(selectedRecipe.baseSuccessRate),
                    }}
                  />
                </div>
                <div className="rate-num" style={{ color: getSuccessRateColor(selectedRecipe.baseSuccessRate) }}>
                  {selectedRecipe.baseSuccessRate}%
                </div>
              </div>
              <div className="craft-cost">
                消耗 {selectedRecipe.goldCost} 金叶
              </div>
            </div>

            <button
              className={`craft-btn ${crafting ? 'crafting' : ''} ${result === 'success' ? 'btn-success' : ''} ${result === 'fail' ? 'btn-fail' : ''}`}
              onClick={handleCraft}
              disabled={crafting || !canCraft}
            >
              {crafting ? (
                <span className="craft-anim">
                  <span className="flame" /> 炼制中...
                  <span className="flame" />
                </span>
              ) : result === 'success' ? (
                '✦ 成功！'
              ) : result === 'fail' ? (
                '💥 失败'
              ) : (
                '开始炼制'
              )}
            </button>

            {!canCraft && !crafting && (
              <div className="craft-hint">
                {Object.entries(selectedRecipe.materials).some(
                  ([id, c]) => (inventorySet.get(id) || 0) < c
                )
                  ? '材料不足，请先收集材料'
                  : '金币不足'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
