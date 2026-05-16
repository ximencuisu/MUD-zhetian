import { useGameStore } from '../store/gameStore';
import { RARITY_COLORS, type SkillRarity } from '../data/sectSkills';
import './SkillBar.css';

function isSkillRarity(value: unknown): value is SkillRarity {
  return typeof value === 'string' && value in RARITY_COLORS;
}

export default function SkillBar() {
  const char = useGameStore(s => s.character);
  const combat = useGameStore(s => s.combat);
  const castSkill = useGameStore(s => s.useSkill);
  const toggleAutoCast = useGameStore(s => s.toggleAutoCast);
  const startCultivation = useGameStore(s => s.startCultivation);
  const stopCultivation = useGameStore(s => s.stopCultivation);
  const tickCombat = useGameStore(s => s.tickCombat);
  const cultivationMode = char?.cultivationMode || 'none';

  if (!char) return null;

  // Get all active (usable) skills the character has — exclude the 3 starters
  const activeSkills = char.skills.filter(s =>
    !['basic_fist', 'breathing', 'body_tempering'].includes(s.id) &&
    (s.type === 'attack' || s.type === 'heal' || s.type === 'buff') &&
    s.category !== 'passive'
  );

  // De-duplicate by id (gongfa slots don't add active skills directly)
  const seenIds = new Set<string>();
  const skillsToShow = activeSkills.filter(s => {
    if (seenIds.has(s.id)) return false;
    seenIds.add(s.id);
    return true;
  });

  return (
    <div className="skill-bar">
      <div className="sb-skills">
        {/* Cultivation buttons */}
        <div className="sb-skill-wrap">
          <button
            className={`sb-cult-btn ${cultivationMode === 'cultivate' ? 'sb-cult-active' : ''}`}
            onClick={() => cultivationMode === 'cultivate' ? stopCultivation() : startCultivation('cultivate')}
            title={cultivationMode === 'cultivate' ? '停止挂机修炼' : '开始挂机修炼'}
          >
            <span className="sb-icon">⚡</span>
            <span className="sb-name">修炼</span>
            {cultivationMode === 'cultivate' && <span className="sb-cd">●</span>}
          </button>
        </div>
        <div className="sb-skill-wrap">
          <button
            className={`sb-cult-btn ${cultivationMode === 'meditate' ? 'sb-cult-active' : ''}`}
            onClick={() => cultivationMode === 'meditate' ? stopCultivation() : startCultivation('meditate')}
            title={cultivationMode === 'meditate' ? '停止挂机打坐' : '开始挂机打坐'}
          >
            <span className="sb-icon">☯</span>
            <span className="sb-name">打坐</span>
            {cultivationMode === 'meditate' && <span className="sb-cd">●</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="sb-divider" />

        {/* Active skills */}
        {skillsToShow.map((skill, idx) => {
          const isOnCooldown = skill.currentCooldown > 0;
          const hasMp = char.mp >= skill.mpCost;
          const isAutoCast = char.autoCastSkills?.includes(skill.id);
          const rarityColor = isSkillRarity(skill.rarity) ? RARITY_COLORS[skill.rarity] : '#cc9900';
          const keyLabel = idx < 9 ? String(idx + 1) : null;

          return (
            <div key={skill.id} className={`sb-skill-wrap ${isAutoCast ? 'sb-auto' : ''}`}>
              <button
                className={`sb-skill-btn ${isAutoCast ? 'sb-auto-active' : ''}`}
                style={{ '--skill-color': rarityColor } as React.CSSProperties}
                disabled={isOnCooldown || !hasMp}
                onClick={() => castSkill(skill.id)}
                title={`${skill.name}\n${skill.effect || skill.description || ''}\n神力：${skill.mpCost} | CD：${skill.cooldown}回合`}
              >
                {keyLabel && <span className="sb-key">{keyLabel}</span>}
                <span className="sb-name">{skill.name}</span>
                {isOnCooldown && <span className="sb-cd">{skill.currentCooldown}</span>}
                {!hasMp && !isOnCooldown && <span className="sb-cd" style={{ color: '#4488ff' }}>蓝</span>}
              </button>
              <button
                className={`sb-auto-toggle ${isAutoCast ? 'on' : ''}`}
                onClick={() => toggleAutoCast(skill.id)}
                title={isAutoCast ? '自动施展：开' : '自动施展：关'}
              >
                {isAutoCast ? '自动' : '手动'}
              </button>
            </div>
          );
        })}

        {/* Basic attack placeholder if no active skills */}
        {skillsToShow.length === 0 && (
          <div className="sb-skill-wrap">
            <button
              className="sb-skill-btn sb-basic"
              disabled={false}
              onClick={() => { if (combat?.isInCombat) tickCombat(); }}
              title="基础攻击（学习功法后显示主动技能）"
            >
              <span className="sb-name">普攻</span>
            </button>
          </div>
        )}


      </div>
    </div>
  );
}
