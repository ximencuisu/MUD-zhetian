import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ROOMS, NPCS, ITEMS } from '../data/world';
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
  const observeNpc = useGameStore(s => s.observeNpc);
  const sparWith = useGameStore(s => s.sparWith);
  const giftToNpc = useGameStore(s => s.giftToNpc);
  const joinSect = useGameStore(s => s.joinSect);
  const learnSectSkill = useGameStore(s => s.learnSectSkill);
  const promoteSectRank = useGameStore(s => s.promoteSectRank);
  const currentZoneId = useGameStore(s => s.currentZoneId);
  const currentZoneRoomId = useGameStore(s => s.currentZoneRoomId);
  const currentRoomId = character?.currentRoomId || 'guiyuan_village';
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [showSkillLearn, setShowSkillLearn] = useState<string | null>(null);
  const [showGiftPanel, setShowGiftPanel] = useState<string | null>(null);

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
      <div className={`ep-entity-row ${selectedEntity === 'player' ? 'selected' : ''}`}
        onClick={() => setSelectedEntity(selectedEntity === 'player' ? null : 'player')}>
        <div className="ep-left">
          <span className="ep-name player">{character.name}</span>
          <span className="ep-hp-text">[{Math.round(character.hp)}/{Math.round(character.maxHp)}]</span>
        </div>
        <div className="ep-right">
          <div className="ep-bar-stack">
            <div className="ep-bar hp"><div className="fill" style={{ width: `${hpPct}%` }} /></div>
            <div className="ep-bar mp"><div className="fill" style={{ width: `${mpPct}%` }} /></div>
          </div>
        </div>
      </div>
      {selectedEntity === 'player' && (
        <div className="ep-actions">
          <button className="ep-btn" onClick={() => useGameStore.getState().lookRoom()}>查看</button>
        </div>
      )}

      {/* NPCs */}
      {npcsHere.map(npc => {
        const sectNpc = isSectRoom ? SECT_NPC_MAP[npc.id] : null;
        const isHostile = npc.isHostile;
        const inCombat = combat.isInCombat && combat.targetId === npc.id;
        const isSelected = selectedEntity === npc.id;
        const npcHpPct = Math.max(0, Math.min(100, (npc.hp / npc.maxHp) * 100));

        const canAsk = isSectRoom && sectNpc && character.sect &&
          character.sectRank && (PLAYER_CAN_ASK[character.sectRank] || []).includes(sectNpc.rank);

        const npcTeachRarities = sectNpc ? (RANK_TEACHES[sectNpc.rank] || []) : [];
        const playerLearnRarities = character.sectRank ? (RANK_LEARN_LIMIT[character.sectRank as SectRank] || []) : ['mortal'];

        const learnableSkills = canAsk
          ? ALL_SECT_SKILLS.filter(s =>
              s.sect === character.sect &&
              npcTeachRarities.includes(s.rarity as SkillRarity) &&
              playerLearnRarities.includes(s.rarity as SkillRarity)
            )
          : [];

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
            <div className={`ep-entity-row ${isSelected ? 'selected' : ''} ${inCombat ? 'fighting' : ''}`}
              onClick={() => {
                setSelectedEntity(isSelected ? null : npc.id);
                setShowSkillLearn(null);
              }}>
              <div className="ep-left">
                <span className={`ep-name ${isHostile ? 'hostile' : 'friendly'}`}>{npc.name}</span>
                <span className="ep-hp-text">[{Math.round(npc.hp)}/{Math.round(npc.maxHp)}]</span>
              </div>
              <div className="ep-right">
                <div className="ep-bar-stack">
                  <div className="ep-bar hp"><div className="fill" style={{ width: `${npcHpPct}%` }} /></div>
                  <div className="ep-bar mp"><div className="fill" style={{ width: '100%' }} /></div> {/* Placeholder MP */}
                </div>
              </div>
            </div>
            
            {isSelected && (
              <div className="ep-actions">
                <button className="ep-btn" onClick={() => observeNpc(npc.id)}>查看</button>
                {!isHostile && !combat.isInCombat && (
                  <button className="ep-btn" onClick={() => sparWith(npc.id)}>比试</button>
                )}
                <button className="ep-btn danger" onClick={() => attack(npc.id)}>击杀</button>
                
                {/* Keep other features */}
                {!isHostile && (
                  <button className="ep-btn secondary" onClick={() => talkTo(npc.id)}>交谈</button>
                )}
                {isSectRoom && !character.sect && (
                  <button className="ep-btn secondary" onClick={() => {
                    for (const [sId, map] of Object.entries(SECT_MAPS)) {
                      if (map[currentRoomId]) { joinSect(sId); break; }
                    }
                  }}>拜入</button>
                )}
                {canAsk && npcTeachRarities.length > 0 && (
                  <button className="ep-btn secondary" onClick={() => setShowSkillLearn(showSkillLearn === npc.id ? null : npc.id)}>请教</button>
                )}
                {!isHostile && character.inventory.length > 0 && (
                  <button className="ep-btn secondary" onClick={() => setShowGiftPanel(showGiftPanel === npc.id ? null : npc.id)}>赠送</button>
                )}
              </div>
            )}

            {/* 赠送物品面板 */}
            {showGiftPanel === npc.id && (
              <div style={{ padding: '6px 8px', background: 'rgba(8,4,0,0.85)', borderTop: '1px solid rgba(130,90,0,0.2)' }}>
                <div style={{ color: '#cc88ff', fontSize: '9px', marginBottom: 4 }}>
                  选择要赠送给{npc.name}的物品：
                </div>
                <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                  {character.inventory.length === 0 ? (
                    <div style={{ color: '#3a2a08', fontSize: '10px' }}>背包空空如也</div>
                  ) : (
                    character.inventory.slice(0, 20).map((itemId, i) => {
                      const item = ITEMS[itemId];
                      const itemName = item?.name || itemId;
                      return (
                        <div key={`${itemId}-${i}`} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '3px 6px', marginBottom: 2,
                          borderRadius: 3, background: 'rgba(30,15,0,0.3)',
                          border: '1px solid rgba(130,90,0,0.2)',
                        }}>
                          <span style={{ flex: 1, fontSize: '10px', color: '#886622' }}>{itemName}</span>
                          <button
                            style={{
                              background: 'rgba(204,136,255,0.1)', border: '1px solid #cc88ff66',
                              color: '#cc88ff', padding: '1px 6px', borderRadius: 3,
                              cursor: 'pointer', fontSize: '9px',
                            }}
                            onClick={() => {
                              giftToNpc(npc.id, itemId);
                              setShowGiftPanel(null);
                            }}
                          >
                            赠送
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <button
                  style={{
                    marginTop: 4, background: 'rgba(100,60,0,0.3)', border: '1px solid rgba(130,90,0,0.3)',
                    color: '#664411', padding: '2px 8px', borderRadius: 3, cursor: 'pointer', fontSize: '9px', width: '100%',
                  }}
                  onClick={() => setShowGiftPanel(null)}
                >
                  关闭
                </button>
              </div>
            )}

            {/* Inline skill learning panel */}
            {showSkillLearn === npc.id && sectNpc && (
              <div style={{ padding: '6px 8px', background: 'rgba(8,4,0,0.85)', borderTop: '1px solid rgba(130,90,0,0.2)' }}>
                <div style={{ color: '#886622', fontSize: '9px', marginBottom: 6 }}>
                  {sectNpc.name}（{sectNpc.rank}）可传授：
                </div>

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

                {/* Locked skills */}
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
