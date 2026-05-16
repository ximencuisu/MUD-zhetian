import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { SECT_MAPS } from '../data/sectMaps';
import { ALL_SECT_NPCS } from '../data/sectNpcs';
import './SectMap.css';

export default function SectMap({ sectId }: { sectId: string }) {
  const moveToRoom = useGameStore(s => s.moveToRoom);
  const combat = useGameStore(s => s.combat);
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const [currentRoomId] = useState('');

  const map = SECT_MAPS[sectId];
  if (!map) return null;

  // Start at gate if no current room
  const roomId = currentRoomId || Object.keys(map)[0];
  const room = map[roomId];
  if (!room) return null;

  // Get NPCs in current room
  const npcsInRoom = ALL_SECT_NPCS.filter(n => n.sect === sectId && room.npcs.includes(n.id));

  return (
    <div className="sect-map">
      <div className="sm-header">
        <span className="sm-room-name">{room.name}</span>
      </div>
      <div className="sm-desc">{room.description}</div>

      {/* NPCs */}
      {npcsInRoom.length > 0 && (
        <div className="sm-npcs">
          {npcsInRoom.map(npc => (
            <div key={npc.id} className="sm-npc-row">
              <span className="sm-npc-name">{npc.name}</span>
              <span className="sm-npc-rank">{npc.rank}</span>
              <button className="sm-npc-btn" onClick={() => setSelectedNpc(selectedNpc === npc.id ? null : npc.id)}>
                {selectedNpc === npc.id ? '收起' : '请教'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Exits */}
      <div className="sm-exits">
        {room.exits.map(e => (
          <button
            key={e.roomId}
            className="sm-exit-btn"
            disabled={combat.isInCombat}
            onClick={() => {
              moveToRoom(e.roomId);
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
