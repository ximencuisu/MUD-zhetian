import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { RARITY_NAMES, RARITY_COLORS, TYPE_NAMES, TYPE_ICONS, SkillType } from '../../data/sectSkills';
import './Panel.css';

const SKILL_TYPE_ORDER: SkillType[] = ['longevity', 'attack', 'defense', 'escape', 'body', 'soul', 'array', 'source'];

function isSkillType(value: unknown): value is SkillType {
  return typeof value === 'string' && value in TYPE_ICONS;
}

const SLOT_DESCS: Record<SkillType, string> = {
  longevity: '长生功法·延年益寿，恢复神力。',
  attack:    '攻伐功法·催动杀意，克敌制胜。',
  defense:   '护体功法·源力成甲，坚不可摧。',
  escape:    '遁术功法·身如流光，快若惊鸿。',
  body:      '炼体功法·淬炼肉身，天地同寿。',
  soul:      '神魂功法·磨砺神魂，感知天地。',
  array:     '阵道功法·布阵成法，引天地之力。',
  source:    '源术功法·掌控源力，运化万法。',
};

// Stat bonuses parsed from effect string for display
function parseEffectStats(effect: string): { label: string; value: string }[] {
  const pairs = effect.split('，').map(s => s.trim()).filter(Boolean);
  return pairs.map(p => {
    const m = p.match(/^(.+?)([+-]\d+%?)$/);
    if (m) return { label: m[1], value: m[2] };
    return { label: p, value: '' };
  });
}

// Rarity ordering for filtering green and above
const RARITY_RANK: Record<string, number> = {
  mortal: 1, sect: 2, king: 3, sage: 4, sect_secret: 5, emperor: 6,
};

export default function SkillsPanel() {
  const char = useGameStore(s => s.character);
  const practiceSkill = useGameStore(s => s.practiceSkill);
  const castSkill = useGameStore(s => s.useSkill);
  const equipSkill = useGameStore(s => s.equipSkill);
  const unequipSkill = useGameStore(s => s.unequipSkill);
  const [activeTab, setActiveTab] = useState<'basic' | 'special'>('basic');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const equippedSlots = char.skillEquipment || {
    longevity: null, attack: null, defense: null, escape: null,
    body: null, soul: null, array: null, source: null,
  };

  // Special skills: green rarity (mortal) and above, that have a skillType (sect gongfa)
  const specialSkills = char.skills.filter(s =>
    s.rarity && RARITY_RANK[s.rarity] >= 1 &&
    s.skillType &&
    !s.id.startsWith('base_')
  );

  const getAvailableForSlot = (slotType: SkillType) =>
    char.skills.filter(s => s.skillType === slotType && s.rarity && !s.id.startsWith('base_'));

  return (
    <div className="panel-body" style={{ padding: 0, gap: 0 }}>
      {/* Tab bar */}
      <div className="skill-tab-bar">
        <button className={`skill-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
          基础功法
        </button>
        <button className={`skill-tab ${activeTab === 'special' ? 'active' : ''}`} onClick={() => setActiveTab('special')}>
          特殊技能 ({specialSkills.length})
        </button>
      </div>

      {/* ── 基础功法（8槽位）── */}
      {activeTab === 'basic' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ color: '#554422', fontSize: '10px', padding: '5px 10px', borderBottom: '1px solid rgba(80,50,0,0.2)' }}>
            装备门派功法激活槽位效果，在技能栏显示主动技能。
          </div>
          {SKILL_TYPE_ORDER.map(slotType => {
            const equippedId = equippedSlots[slotType];
            const equippedSkill = equippedId ? char.skills.find(s => s.id === equippedId) : null;
            const available = getAvailableForSlot(slotType);
            const isExpanded = expandedSlot === slotType;
            const rc = equippedSkill ? (RARITY_COLORS[equippedSkill.rarity!] || '#8b772a') : 'rgba(60,45,10,0.5)';

            return (
              <div key={slotType} style={{ borderBottom: '1px solid rgba(80,50,0,0.25)', background: isExpanded ? 'rgba(20,15,0,0.4)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', cursor: 'pointer', gap: '8px' }}
                  onClick={() => setExpandedSlot(isExpanded ? null : slotType)}>
                  <span style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${rc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: equippedSkill ? `${rc}18` : 'rgba(40,30,0,0.3)', flexShrink: 0 }}>
                    {TYPE_ICONS[slotType]}
                  </span>
                  <span style={{ color: '#886622', fontSize: '11px', width: 32, flexShrink: 0 }}>{TYPE_NAMES[slotType]}</span>
                  {equippedSkill ? (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: rc, fontSize: '12px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{equippedSkill.name}</div>
                      <div style={{ color: '#554422', fontSize: '10px' }}>{RARITY_NAMES[equippedSkill.rarity!]} · {equippedSkill.effect}</div>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'rgba(120,100,50,0.6)', fontSize: '11px' }}>【空槽】</div>
                      <div style={{ color: '#3a2a08', fontSize: '10px' }}>{SLOT_DESCS[slotType]}</div>
                    </div>
                  )}
                  <span style={{ color: '#554422', fontSize: '10px' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
                {isExpanded && (
                  <div style={{ padding: '4px 10px 10px', borderTop: '1px solid rgba(80,50,0,0.15)' }}>
                    {equippedSkill && (
                      <button className="dungeon-enter-btn" style={{ marginBottom: 8, fontSize: '10px', padding: '3px 10px', borderColor: '#cc4444', color: '#ff6644' }}
                        onClick={() => unequipSkill(slotType)}>
                        卸下功法
                      </button>
                    )}
                    {available.length > 0 ? (
                      <div>
                        <div style={{ color: '#886622', fontSize: '10px', marginBottom: 4 }}>可装备功法：</div>
                        {available.map(sk => {
                          const skRc = RARITY_COLORS[sk.rarity!] || '#8b772a';
                          const isEq = sk.id === equippedId;
                          return (
                            <div key={sk.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', marginBottom: 3, borderRadius: 3, background: isEq ? `${skRc}18` : 'rgba(30,20,0,0.3)', border: `1px solid ${isEq ? skRc + '66' : 'rgba(80,50,0,0.3)'}` }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ color: skRc, fontSize: '11px', marginRight: 6 }}>{sk.name}</span>
                                <span style={{ color: '#554422', fontSize: '9px' }}>{sk.effect}</span>
                              </div>
                              {isEq ? (
                                <span style={{ color: '#44ff88', fontSize: '9px' }}>✓已装备</span>
                              ) : (
                                <button className="dungeon-enter-btn" style={{ fontSize: '10px', padding: '2px 8px' }} onClick={() => equipSkill(sk.id, slotType)}>装备</button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ color: '#3a2a08', fontSize: '11px' }}>未学会此类型功法。前往门派修炼。</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 特殊技能（参考图风格：列表行 + 展开详情） ── */}
      {activeTab === 'special' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '4px 10px', borderBottom: '1px solid rgba(80,50,0,0.35)', background: 'rgba(10,6,0,0.8)' }}>
            <span style={{ color: '#886622', fontSize: '10px' }}>技能名称</span>
            <span style={{ color: '#886622', fontSize: '10px', textAlign: 'right' }}>熟练度</span>
            <span style={{ color: '#886622', fontSize: '10px', textAlign: 'right' }}>品质</span>
          </div>

          {specialSkills.length === 0 ? (
            <div style={{ color: '#554422', padding: '24px 16px', textAlign: 'center', fontSize: '12px' }}>
              暂无特殊技能<br />
              <span style={{ color: '#3a2a08', fontSize: '10px' }}>拜入门派向NPC学习功法后出现</span>
            </div>
          ) : (
            specialSkills.map(skill => {
              const rc = RARITY_COLORS[skill.rarity!] || '#44cc44';
              const rarityName = RARITY_NAMES[skill.rarity!] || '凡俗';
              const pct = skill.practiceExpMax > 0 ? Math.round((skill.practiceExp / skill.practiceExpMax) * 100) : 0;
              const isExpanded = expandedId === skill.id;
              const isOnCooldown = skill.currentCooldown > 0;
              const canUse = char.mp >= skill.mpCost && !isOnCooldown;
              const stats = parseEffectStats(skill.effect || '');

              // Find which slot this skill is equipped in (if any)
              const equippedInSlot = Object.entries(equippedSlots).find(([, id]) => id === skill.id)?.[0] as SkillType | undefined;
              const slotType = isSkillType(skill.skillType) ? skill.skillType : undefined;

              return (
                <div key={skill.id} style={{ borderBottom: '1px solid rgba(60,40,0,0.3)' }}>
                  {/* Row */}
                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '7px 10px', cursor: 'pointer', alignItems: 'center', background: isExpanded ? 'rgba(30,20,0,0.5)' : 'transparent' }}
                    onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                  >
                    {/* Name + equipped tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      {equippedInSlot && (
                        <span style={{ fontSize: '9px', color: '#44ff88', border: '1px solid #44ff8866', borderRadius: 2, padding: '0 3px', flexShrink: 0 }}>✓{TYPE_NAMES[equippedInSlot]}</span>
                      )}
                      <span style={{ color: rc, fontSize: '12px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                    </div>

                    {/* Proficiency bar */}
                    <div style={{ textAlign: 'right', paddingRight: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        <div style={{ width: 60, height: 4, background: 'rgba(80,50,0,0.4)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: rc, borderRadius: 2, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ color: '#886622', fontSize: '9px', width: 28, textAlign: 'right' }}>{pct}%</span>
                      </div>
                      <div style={{ color: '#554422', fontSize: '9px', marginTop: 1 }}>Lv.{skill.level}/{skill.maxLevel}</div>
                    </div>

                    {/* Rarity */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: rc, fontSize: '10px', fontWeight: 'bold' }}>{rarityName}</span>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div style={{ padding: '8px 12px 12px', background: 'rgba(8,4,0,0.7)', borderTop: '1px solid rgba(80,50,0,0.2)' }}>
                      {/* Action buttons row — like the reference image */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <button className="dungeon-enter-btn" style={{ fontSize: '10px', padding: '3px 12px' }} onClick={() => practiceSkill(skill.id)}>
                          修炼
                        </button>
                        {(skill.type === 'attack' || skill.type === 'heal' || skill.type === 'buff') && (
                          <button className="dungeon-enter-btn" style={{ fontSize: '10px', padding: '3px 12px', opacity: canUse ? 1 : 0.4 }} disabled={!canUse} onClick={() => castSkill(skill.id)}>
                            施展
                          </button>
                        )}
                        {/* Equip button(s) */}
                        {!equippedInSlot ? (
                          <button
                            className="dungeon-enter-btn"
                            style={{ fontSize: '10px', padding: '3px 12px', borderColor: '#88cc44', color: '#aaff66' }}
                            onClick={() => slotType && equipSkill(skill.id, slotType)}
                          >
                            装备{slotType ? `（${TYPE_NAMES[slotType]}槽）` : ''}
                          </button>
                        ) : (
                          <button
                            className="dungeon-enter-btn"
                            style={{ fontSize: '10px', padding: '3px 12px', borderColor: '#cc4444', color: '#ff6644' }}
                            onClick={() => unequipSkill(equippedInSlot)}
                          >
                            取消装备（{TYPE_NAMES[equippedInSlot]}槽）
                          </button>
                        )}
                      </div>

                      {/* Description */}
                      <div style={{ color: '#aa8844', fontSize: '11px', marginBottom: 8, lineHeight: 1.6 }}>
                        {skill.description}
                      </div>

                      {/* Stat bonuses — shown like reference image with label + value */}
                      {stats.length > 0 && (
                        <div style={{ background: 'rgba(20,12,0,0.6)', border: '1px solid rgba(100,70,0,0.3)', borderRadius: 4, padding: '8px 10px', marginBottom: 8 }}>
                          <div style={{ color: '#cc9900', fontSize: '10px', marginBottom: 6, letterSpacing: 1 }}>
                            装备此功法时：
                          </div>
                          {stats.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: i < stats.length - 1 ? '1px solid rgba(60,40,0,0.2)' : 'none' }}>
                              <span style={{ color: '#886622', fontSize: '11px' }}>{s.label}</span>
                              <span style={{ color: '#ffcc44', fontSize: '11px', fontWeight: 'bold' }}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skill meta */}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {skill.mpCost > 0 && (
                          <span style={{ fontSize: '10px', color: '#4488ff' }}>神力消耗：{skill.mpCost}</span>
                        )}
                        {skill.cooldown > 0 && (
                          <span style={{ fontSize: '10px', color: '#886622' }}>冷却：{skill.cooldown}回合</span>
                        )}
                        {isOnCooldown && (
                          <span style={{ fontSize: '10px', color: '#ff4444' }}>冷却中：{skill.currentCooldown}</span>
                        )}
                        {skill.damage && (
                          <span style={{ fontSize: '10px', color: '#ff6633' }}>伤害：{skill.damage + skill.level * 15}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Footer */}
          <div style={{ padding: '6px 10px', color: '#3a2a08', fontSize: '10px', textAlign: 'right', borderTop: '1px solid rgba(60,40,0,0.2)' }}>
            你目前共学会 {specialSkills.length} 项技能
          </div>
        </div>
      )}
    </div>
  );
}
