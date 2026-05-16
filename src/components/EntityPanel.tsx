import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ROOMS, NPCS } from '../data/world';
import { ZONE_NPCS, ZONES } from '../data/zones';
import { ALL_SECT_ROOMS, SECT_MAPS } from '../data/sectMaps';
import { SECT_NPC_MAP, SectNpcDef } from '../data/sectNpcs';
import { RANK_TEACHES, RARITY_NAMES, RARITY_COLORS, SkillRarity, ALL_SECT_SKILLS, EMPEROR_SCRIPTURES } from '../data/sectSkills';
import { SECT_RANK_ORDER, RANK_PROMO_REQS, RANK_LEARN_LIMIT, REALM_NAMES, SectRank } from '../types/game';
import './EntityPanel.css';

// Which NPC ranks a player of each rank can request teaching from.
// Rule: players can ask NPCs at the exact tier that teaches what they're eligible to learn.
// mortal(外门/内门弟子) → 外门弟子/内门弟子 NPC
// sect(真传/外门长老)   → 真传弟子/外门长老 NPC
// king(内门长老)        → 内门长老 NPC
// sage(道子/圣女/太上)  → 道子/圣女/太上长老 NPC
// sect_secret(宗主)     → 宗主 NPC
const PLAYER_CAN_ASK: Record<string, string[]> = {
  '外门弟子': ['外门弟子', '内门弟子'],
  '内门弟子': ['外门弟子', '内门弟子'],
  '真传弟子': ['外门弟子', '内门弟子', '真传弟子', '外门长老'],
  '外门长老': ['外门弟子', '内门弟子', '真传弟子', '外门长老'],
  '内门长老': ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老'],
  '道子':     ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老'],
  '圣女':     ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老'],
  '太上长老': ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老'],
  '宗主':     ['外门弟子', '内门弟子', '真传弟子', '外门长老', '内门长老', '道子', '圣女', '太上长老', '宗主'],
};

function sectNpcToNpc(sn: SectNpcDef) {
  return {
    id: sn.id, name: sn.name, description: sn.description,
    dialogue: sn.dialogue, isHostile: false,
    hp: 999, maxHp: 999, attack: 0, defense: 0,
    expReward: 0, goldReward: 0, drops: [],
  };
}

// Rarity color map matching spec
const RARITY_BG: Record<string, string> = {
  mortal: '#44cc4422', sect: '#4488ff22', king: '#ffcc0022',
  sage: '#cc66ff22', sect_secret: '#ff990022', emperor: '#ff333322',
};

export default function EntityPanel() {
  const character = useGameStore(s => s.character);
  const combat = useGameStore(s => s.combat);
  const attack = useGameStore(s => s.attack);
  const talkTo = useGameStore(s => s.talkTo);
  const joinSect = useGameStore(s => s.joinSect);
  const learnSectSkill = useGameStore(s => s.learnSectSkill);
  const promoteSectRank = useGameStore(s => s.promoteSectRank);
  const currentZoneId = useGameStore(s => s.currentZoneId);
  const currentZoneRoomId = useGameStore(s => s.currentZoneRoomId);
  const currentRoomId = character?.currentRoomId || 'guiyuan_village';
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [showSkillLearn, setShowSkillLearn] = useState<string | null>(null);

  if (!character) return null;

  type NpcLike = ReturnType<typeof sectNpcToNpc>;
  let npcsHere: NpcLike[] = [];
  let isSectRoom = false;

  if (currentZoneId && currentZoneRoomId) {
    const zone = ZONES[currentZoneId];
    const zoneRoom = zone?.rooms.find(r => r.id === currentZoneRoomId);
    npcsHere = (zoneRoom?.npcs || []).map(id => ZONE_NPCS[id]).filter(Boolean) as NpcLike[];
  } else {
    const sectRoom = ALL_SECT_ROOMS[currentRoomId];
    if (sectRoom) {
      isSectRoom = true;
      npcsHere = (sectRoom.npcs || [])
        .map(id => SECT_NPC_MAP[id])
        .filter(Boolean)
        .map(sectNpcToNpc);
    } else {
      const currentRoom = ROOMS[currentRoomId];
      if (!currentRoom) return null;
      npcsHere = (currentRoom.npcs || []).map(id => NPCS[id]).filter(Boolean) as NpcLike[];
    }
  }

  const hpPct = Math.max(0, Math.min(100, (character.hp / character.maxHp) * 100));
  const mpPct = Math.max(0, Math.min(100, (character.mp / character.maxMp) * 100));

  const playerRank = character.sectRank as SectRank | null;
  const playerRankIdx = playerRank ? SECT_RANK_ORDER.indexOf(playerRank) : -1;

  // Next promotion requirements
  const promoReq = playerRank ? RANK_PROMO_REQS[playerRank] : undefined;

  return (
    <div className="entity-panel">
      {/* Player row */}
      <div className="ep-entity-row ep-player-row">
        <span className="ep-icon">🧑</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="ep-name">{character.name}</span>
            {playerRank && (
              <span style={{ fontSize: '9px', color: '#ffcc44', border: '1px solid #ffcc4444', borderRadius: 8, padding: '0 5px' }}>
                {playerRank}
              </span>
            )}
          </div>
          {playerRank && (
            <div style={{ fontSize: '9px', color: '#554422', marginTop: 1 }}>
              贡献值：{character.contribution || 0}
              {promoReq && ` / 晋升需${promoReq.minContrib}`}
            </div>
          )}
        </div>
        <div className="ep-bars-mini">
          <div className="ep-bar-mini">
            <div className="ep-bar-mini-fill hp-fill" style={{ width: `${hpPct}%` }} />
            <div className="ep-bar-value">{Math.round(character.hp)}/{Math.round(character.maxHp)}</div>
          </div>
          <div className="ep-bar-mini">
            <div className="ep-bar-mini-fill mp-fill" style={{ width: `${mpPct}%` }} />
            <div className="ep-bar-value">{Math.round(character.mp)}/{Math.round(character.maxMp)}</div>
          </div>
        </div>
      </div>

      {/* Promotion button — shown when in sect and in sect room */}
      {isSectRoom && character.sect && playerRank && promoReq && playerRankIdx < SECT_RANK_ORDER.length - 1 && (
        <div style={{ padding: '4px 8px', borderBottom: '1px solid rgba(80,50,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '10px', color: '#886622' }}>
            晋升 → <span style={{ color: '#ffcc44' }}>{SECT_RANK_ORDER[playerRankIdx + 1]}</span>
            <span style={{ color: '#554422', marginLeft: 6 }}>需境界：{REALM_NAMES[promoReq.minRealm]}</span>
          </div>
          <button
            style={{ background: 'rgba(30,20,0,0.8)', border: '1px solid #ffcc4466', color: '#ffcc44', padding: '2px 10px', borderRadius: 3, cursor: 'pointer', fontSize: '10px' }}
            onClick={promoteSectRank}
          >
            申请晋升
          </button>
        </div>
      )}

      {/* NPCs */}
      {npcsHere.map(npc => {
        const sectNpc = isSectRoom ? SECT_NPC_MAP[npc.id] : null;
        const isHostile = npc.isHostile;
        const inCombat = combat.isInCombat && combat.targetId === npc.id;
        const isSelected = selectedEntity === npc.id;

        // Can this player ask this NPC for teachings?
        const canAsk = isSectRoom && sectNpc && character.sect &&
          playerRank && (PLAYER_CAN_ASK[playerRank] || []).includes(sectNpc.rank);

        // What rarities does this NPC teach?
        const npcTeachRarities = sectNpc ? (RANK_TEACHES[sectNpc.rank] || []) : [];

        // Player's own rank limits what they can learn
        const playerLearnRarities = playerRank ? (RANK_LEARN_LIMIT[playerRank] || []) : ['mortal'];

        // Skills this NPC can teach AND player qualifies to learn
        const learnableSkills = canAsk
          ? ALL_SECT_SKILLS.filter(s =>
              s.sect === character.sect &&
              npcTeachRarities.includes(s.rarity as SkillRarity) &&
              playerLearnRarities.includes(s.rarity as SkillRarity)
            )
          : [];

        // Skills NPC could teach but player rank is too low for
        const lockedSkills = canAsk
          ? ALL_SECT_SKILLS.filter(s =>
              s.sect === character.sect &&
              npcTeachRarities.includes(s.rarity as SkillRarity) &&
              !playerLearnRarities.includes(s.rarity as SkillRarity)
            )
          : [];

        const learnedIds = character.skills.map(s => s.id);

        return (
          <div key={npc.id}>
            <div
              className={`ep-entity-row ${inCombat ? 'ep-fighting' : ''}`}
              onClick={() => {
                setSelectedEntity(isSelected ? null : npc.id);
                setShowSkillLearn(null);
              }}
            >
              <span className={`ep-icon ${isHostile ? 'ep-hostile-icon' : ''}`}>
                {isHostile ? '👹' : (sectNpc ? '🧙‍♂️' : '🧙')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className={`ep-name ${isHostile ? 'ep-hostile' : ''}`}>{npc.name}</span>
                  {sectNpc && (
                    <span style={{ fontSize: '9px', color: '#886622', border: '1px solid rgba(130,90,0,0.3)', borderRadius: 8, padding: '0 5px', flexShrink: 0 }}>
                      {sectNpc.rank}
                    </span>
                  )}
                </div>
              </div>
              {inCombat && <span className="ep-combat-tag">⚔</span>}
            </div>

            {isSelected && (
              <div className="ep-actions-mini">
                {!isHostile && (
                  <button className="ep-mini-btn" onClick={() => talkTo(npc.id)}>交谈</button>
                )}

                {/* Join sect */}
                {isSectRoom && !character.sect && (
                  <button
                    className="ep-mini-btn"
                    style={{ color: '#ffcc44', borderColor: '#ffcc4466' }}
                    onClick={() => {
                      for (const [sId, map] of Object.entries(SECT_MAPS)) {
                        if (map[currentRoomId]) { joinSect(sId); break; }
                      }
                    }}
                  >
                    申请拜入
                  </button>
                )}

                {/* Learn skill button */}
                {canAsk && npcTeachRarities.length > 0 && (
                  <button
                    className="ep-mini-btn"
                    style={{ color: '#88ccff', borderColor: '#88ccff44' }}
                    onClick={() => setShowSkillLearn(showSkillLearn === npc.id ? null : npc.id)}
                  >
                    请教功法
                  </button>
                )}

                {/* Hint: player rank too low to ask */}
                {isSectRoom && sectNpc && character.sect && playerRank &&
                  !(PLAYER_CAN_ASK[playerRank] || []).includes(sectNpc.rank) &&
                  SECT_RANK_ORDER.indexOf(sectNpc.rank as SectRank) > playerRankIdx && (
                  <span style={{ fontSize: '9px', color: '#554422', padding: '1px 6px' }}>
                    需晋升职位方可请教
                  </span>
                )}

                {!isHostile && (
                  <button className="ep-mini-btn ep-mini-observe" onClick={() => {
                    useGameStore.getState().addMessage({ channel: 'system', sender: '观察', content: `【${npc.name}】${npc.description || '看不透深浅'}` });
                  }}>
                    观察
                  </button>
                )}

                <button
                  className="ep-mini-btn ep-mini-attack"
                  disabled={combat.isInCombat}
                  onClick={() => attack(npc.id)}
                >
                  {inCombat ? '战中' : '攻击'}
                </button>
              </div>
            )}

            {/* Inline skill learning panel */}
            {showSkillLearn === npc.id && sectNpc && (
              <div style={{ padding: '6px 8px', background: 'rgba(8,4,0,0.85)', borderTop: '1px solid rgba(130,90,0,0.2)' }}>
                <div style={{ color: '#886622', fontSize: '9px', marginBottom: 6 }}>
                  {sectNpc.name}（{sectNpc.rank}）可传授：
                </div>

                {/* Learnable skills */}
                {learnableSkills.length === 0 && lockedSkills.length === 0 && (
                  <div style={{ color: '#3a2a08', fontSize: '10px' }}>无可传授功法。</div>
                )}

                {learnableSkills.map(sk => {
                  const rc = RARITY_COLORS[sk.rarity as SkillRarity] || '#888';
                  const bg = RARITY_BG[sk.rarity as string] || 'transparent';
                  const isLearned = learnedIds.includes(sk.id);
                  return (
                    <div key={sk.id} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 6px', marginBottom: 3,
                      borderRadius: 3, background: bg,
                      border: `1px solid ${rc}44`,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: rc, fontSize: '11px', fontWeight: 'bold' }}>{sk.name}</div>
                        <div style={{ color: '#554422', fontSize: '9px' }}>{RARITY_NAMES[sk.rarity as SkillRarity]} · {sk.effect}</div>
                      </div>
                      {isLearned ? (
                        <span style={{ color: '#44cc44', fontSize: '9px', flexShrink: 0 }}>✓已学</span>
                      ) : (
                        <button
                          style={{
                            background: `${rc}18`, border: `1px solid ${rc}88`,
                            color: rc, padding: '2px 8px', borderRadius: 3,
                            cursor: 'pointer', fontSize: '10px', flexShrink: 0,
                          }}
                          onClick={() => learnSectSkill(sk.id)}
                        >
                          请教
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Locked skills — player rank insufficient */}
                {lockedSkills.length > 0 && (
                  <>
                    <div style={{ color: '#443311', fontSize: '9px', marginTop: 6, marginBottom: 3 }}>
                      以下功法需提升职位方可学习：
                    </div>
                    {lockedSkills.map(sk => {
                      const rc = RARITY_COLORS[sk.rarity as SkillRarity] || '#888';
                      return (
                        <div key={sk.id} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '3px 6px', marginBottom: 2,
                          borderRadius: 3, background: 'rgba(30,15,0,0.3)',
                          border: `1px solid ${rc}22`, opacity: 0.5,
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: rc, fontSize: '10px' }}>{sk.name}</div>
                            <div style={{ color: '#3a2a08', fontSize: '9px' }}>{RARITY_NAMES[sk.rarity as SkillRarity]}</div>
                          </div>
                          <span style={{ color: '#443311', fontSize: '9px', flexShrink: 0 }}>🔒</span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Emperor scripture hints — only shown by 宗主, never learnable */}
                {sectNpc?.rank === '宗主' && character.sect && (() => {
                  const hints = EMPEROR_SCRIPTURES.filter(s => s.sect === character.sect);
                  if (!hints.length) return null;
                  return (
                    <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #ff333322' }}>
                      <div style={{ color: '#ff333388', fontSize: '9px', marginBottom: 4, letterSpacing: 1 }}>
                        ◈ 极道帝经·传说（不可修炼）
                      </div>
                      {hints.map(sk => (
                        <div key={sk.id} style={{
                          padding: '5px 6px', marginBottom: 3,
                          borderRadius: 3, background: '#ff333310',
                          border: '1px solid #ff333333',
                        }}>
                          <div style={{ color: '#ff3333', fontSize: '11px', fontWeight: 'bold' }}>{sk.name}</div>
                          <div style={{ color: '#883322', fontSize: '9px', marginTop: 2, lineHeight: 1.5 }}>{sk.description}</div>
                          <div style={{ color: '#ff333666', fontSize: '9px', marginTop: 2 }}>效果：{sk.effect}</div>
                          <div style={{ color: '#554422', fontSize: '8px', marginTop: 2, fontStyle: 'italic' }}>
                            ※ 此经文超越常人所能承载，门派内无人可传授，唯有自身悟道。
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}

      {npcsHere.length === 0 && (
        <div className="ep-empty">此处空无一人</div>
      )}
    </div>
  );
}
