import { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { listenRankings, listenPvPRankings, PlayerRanking, PvPRankingEntry } from '../../services/multiplayerService';
import './Panel.css';
import './RankingsPanel.css';

type RankingTab = 'realm' | 'power' | 'pvp' | 'kills';

const TABS: { id: RankingTab; label: string; icon: string }[] = [
  { id: 'realm', label: '境界榜', icon: '☯' },
  { id: 'power', label: '战力榜', icon: '⚔' },
  { id: 'pvp', label: 'PVP榜', icon: '🏆' },
  { id: 'kills', label: '斬殺榜', icon: '💀' },
];

function getRealmColor(rank: number): string {
  if (rank === 1) return '#ffd700';
  if (rank === 2) return '#c0c0c0';
  if (rank === 3) return '#cd7f32';
  return '#554422';
}

function getRankIcon(rank: number): string {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString();
}

export default function RankingsPanel() {
  const character = useGameStore(s => s.character);
  const [activeTab, setActiveTab] = useState<RankingTab>('realm');
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [pvpRankings, setPvpRankings] = useState<PvPRankingEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub1 = listenRankings(setRankings);
    const unsub2 = listenPvPRankings(setPvpRankings);
    return () => { unsub1(); unsub2(); };
  }, []);

  const sortedData = useMemo(() => {
    const filtered = searchTerm
      ? rankings.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : rankings;

    switch (activeTab) {
      case 'realm':
        return [...filtered].sort((a, b) => (b.realmLevel || 0) - (a.realmLevel || 0) || (b.power || 0) - (a.power || 0));
      case 'power':
        return [...filtered].sort((a, b) => (b.power || 0) - (a.power || 0));
      case 'kills':
        return [...filtered].sort((a, b) => (b.kills || 0) - (a.kills || 0) || (b.power || 0) - (a.power || 0));
      default:
        return filtered;
    }
  }, [rankings, activeTab, searchTerm]);

  const pvpSorted = useMemo(() => {
    const filtered = searchTerm
      ? pvpRankings.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : pvpRankings;
    return [...filtered].sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [pvpRankings, searchTerm]);

  const myRank = useMemo(() => {
    if (!character) return null;
    const list = activeTab === 'pvp' ? pvpSorted : sortedData;
    const idx = list.findIndex(p => p.name === character.name);
    return idx >= 0 ? idx + 1 : null;
  }, [character, activeTab, sortedData, pvpSorted]);

  const renderRealmRow = (player: PlayerRanking, i: number) => {
    const isMe = player.name === character?.name;
    return (
      <div key={player.uid || i} className={`rank-row ${isMe ? 'me' : ''}`}>
        <span className={`rank-num ${i < 3 ? 'top3' : ''}`} style={{ minWidth: 28 }}>
          {getRankIcon(i + 1)}
        </span>
        <span className="rank-name" style={{ flex: 1 }}>
          {player.name}{isMe ? ' ◀' : ''}
        </span>
        <span className="rank-sect" style={{ fontSize: 10, color: '#887755', width: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {player.sect || '散修'}
        </span>
        <span className="rank-realm" style={{ color: '#ccaa44', width: 70, textAlign: 'right' }}>
          Lv.{player.realmLevel || 1}
        </span>
      </div>
    );
  };

  const renderPowerRow = (player: PlayerRanking, i: number) => {
    const isMe = player.name === character?.name;
    return (
      <div key={player.uid || i} className={`rank-row ${isMe ? 'me' : ''}`}>
        <span className={`rank-num ${i < 3 ? 'top3' : ''}`} style={{ minWidth: 28 }}>
          {getRankIcon(i + 1)}
        </span>
        <span className="rank-name" style={{ flex: 1 }}>
          {player.name}{isMe ? ' ◀' : ''}
        </span>
        <span className="rank-realm" style={{ color: '#ff6644', width: 80, textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(player.power || 0)}
        </span>
      </div>
    );
  };

  const renderPvpRow = (player: PvPRankingEntry, i: number) => {
    const isMe = player.name === character?.name;
    return (
      <div key={player.uid || i} className={`rank-row ${isMe ? 'me' : ''}`}>
        <span className={`rank-num ${i < 3 ? 'top3' : ''}`} style={{ minWidth: 28 }}>
          {getRankIcon(i + 1)}
        </span>
        <span className="rank-name" style={{ flex: 1 }}>
          {player.name}{isMe ? ' ◀' : ''}
        </span>
        <span className="rank-realm" style={{ color: '#aa88ff', width: 60, textAlign: 'right', fontFamily: 'monospace' }}>
          {player.points || 0}
        </span>
        <span className="rank-sect" style={{ fontSize: 10, color: '#887755', width: 40, textAlign: 'right' }}>
          {player.wins || 0}胜
        </span>
      </div>
    );
  };

  const renderKillsRow = (player: PlayerRanking, i: number) => {
    const isMe = player.name === character?.name;
    return (
      <div key={player.uid || i} className={`rank-row ${isMe ? 'me' : ''}`}>
        <span className={`rank-num ${i < 3 ? 'top3' : ''}`} style={{ minWidth: 28 }}>
          {getRankIcon(i + 1)}
        </span>
        <span className="rank-name" style={{ flex: 1 }}>
          {player.name}{isMe ? ' ◀' : ''}
        </span>
        <span className="rank-realm" style={{ color: '#66cc66', width: 60, textAlign: 'right', fontFamily: 'monospace' }}>
          {player.kills || 0}
        </span>
      </div>
    );
  };

  return (
    <div className="panel-body rankings-panel">
      {/* Tabs */}
      <div className="rankings-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`rankings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="rankings-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="rankings-search">
        <span className="rankings-search-icon">🔍</span>
        <input
          className="rankings-search-input"
          type="text"
          placeholder="搜索玩家..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <span className="rankings-search-clear" onClick={() => setSearchTerm('')}>✕</span>
        )}
      </div>

      {/* My rank indicator */}
      {myRank !== null && myRank <= 100 && (
        <div className="rankings-myrank">
          你的排名：第 <strong style={{ color: getRealmColor(myRank) }}>{myRank}</strong> 名
          {myRank <= 3 && ' 🎉'}
        </div>
      )}
      {myRank !== null && myRank > 100 && (
        <div className="rankings-myrank" style={{ color: '#887755' }}>
          你的排名：第 {myRank} 名（前100名外）
        </div>
      )}

      {/* List */}
      <div className="rank-list">
        {activeTab === 'pvp' ? (
          pvpSorted.length > 0 ? (
            pvpSorted.slice(0, 50).map((player, i) => renderPvpRow(player, i))
          ) : (
            <div className="rankings-empty">暂无PVP排名数据…</div>
          )
        ) : (
          sortedData.length > 0 ? (
            sortedData.slice(0, 50).map((player, i) => {
              switch (activeTab) {
                case 'realm': return renderRealmRow(player, i);
                case 'power': return renderPowerRow(player, i);
                case 'kills': return renderKillsRow(player, i);
                default: return renderRealmRow(player, i);
              }
            })
          ) : (
            <div className="rankings-empty">
              {searchTerm ? '未找到匹配的玩家…' : '暂无排行数据…'}
            </div>
          )
        )}
      </div>

      {/* Online count */}
      <div className="rankings-footer">
        当前记录玩家：{rankings.length} 人
        {activeTab === 'pvp' && ` · PVP选手：${pvpRankings.length} 人`}
      </div>
    </div>
  );
}
