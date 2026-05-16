import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { listenPvPChallenges, respondToPvPChallenge, updatePvPRanking } from '../../services/multiplayerService';
import './ArenaPanel.css';

interface PvPMatch {
  id: string;
  player1: string;
  player2: string;
  status: 'waiting' | 'fighting' | 'finished';
  result?: 'player1' | 'player2';
}

const ARENA_TIERS = [
  { name: '青铜竞技场', levelReq: 20, entryFee: 100, reward: 500, icon: '🥉' },
  { name: '白银竞技场', levelReq: 30, entryFee: 500, reward: 3000, icon: '🥈' },
  { name: '黄金竞技场', levelReq: 40, entryFee: 2000, reward: 10000, icon: '🥇' },
  { name: '钻石竞技场', levelReq: 50, entryFee: 5000, reward: 30000, icon: '💎' },
];

const WEEKLY_RANKS = [
  { rank: 1, name: '巅峰王者', rewards: '圣兵碎片×3 + 称号' },
  { rank: 2, name: '绝世强者', rewards: '圣兵碎片×2' },
  { rank: 3, name: '武林盟主', rewards: '圣兵碎片×1 + 龙血×5' },
  { rank: '4-10', name: '顶尖高手', rewards: '龙血×3' },
  { rank: '11-50', name: '一方豪杰', rewards: '龙血×1' },
];

export default function ArenaPanel() {
  const { character, addMessage, uid } = useGameStore();
  const [selectedTier, setSelectedTier] = useState(0);
  const [matches, setMatches] = useState<PvPMatch[]>([]);
  const [arenaRank, setArenaRank] = useState(0);
  const [arenaPoints, setArenaPoints] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);

  // Listen for incoming PVP challenges
  useEffect(() => {
    if (!uid) return;
    const unsub = listenPvPChallenges(uid, (chals) => {
      setChallenges(chals);
    });
    return unsub;
  }, [uid]);

  if (!character) {
    return <div className="arena-empty">请先创建角色</div>;
  }

  const currentTier = ARENA_TIERS[selectedTier];
  const realmLevel = character.realmLevel;
  const isLevelEnough = realmLevel >= currentTier.levelReq;

  const handleEnterArena = () => {
    if (!isLevelEnough) {
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: `境界不足！需要达到 ${currentTier.levelReq} 重才能进入 ${currentTier.name}。`,
        sender: '系统',
      });
      return;
    }

    if (character.gold < currentTier.entryFee) {
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: `金币不足！进入 ${currentTier.name} 需要 ${currentTier.entryFee} 金币。`,
        sender: '系统',
      });
      return;
    }

    addMessage({
      id: Date.now().toString(),
      channel: 'system',
      content: `正在匹配 ${currentTier.name} 对手...`,
      sender: '系统',
    });

    setTimeout(() => {
      const opponentName = getRandomOpponent();
      addMessage({
        id: Date.now().toString(),
        channel: 'system',
        content: `匹配成功！你的对手是：${opponentName}`,
        sender: '系统',
      });

      const newMatch: PvPMatch = {
        id: Date.now().toString(),
        player1: character.name,
        player2: opponentName,
        status: 'fighting',
      };
      setMatches(prev => [...prev, newMatch]);
    }, 2000);
  };

  const getRandomOpponent = () => {
    const names = ['李逍遥', '张无忌', '独孤求败', '张三丰', '东方不败', '任我行', '风清扬', '岳不群', '令狐冲', '杨过'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const handleFight = () => {
    const playerPower = calculateCombatPower();
    const opponentPower = 1000 + Math.floor(Math.random() * 2000);

    const winChance = playerPower / (playerPower + opponentPower);
    const roll = Math.random();
    const isWin = roll < winChance;

    if (isWin) {
      addMessage({
        id: Date.now().toString(),
        channel: 'combat',
        content: `【战斗胜利】你战胜了对手！`,
        sender: '系统',
      });
      addMessage({
        id: Date.now().toString(),
        channel: 'combat',
        content: `获得奖励：${currentTier.reward} 金币，+${Math.floor(currentTier.reward / 10)} 竞技积分`,
        sender: '系统',
      });
      const pointsGain = Math.floor(currentTier.reward / 10);
      setArenaPoints(prev => prev + pointsGain);
      setArenaRank(prev => Math.max(1, prev - Math.floor(Math.random() * 10)));

      // Update PVP ranking
      if (uid) {
        updatePvPRanking(uid, {
          name: character.name,
          realm: character.realm,
          realmName: character.realm,
          level: character.realmLevel,
          points: arenaPoints + pointsGain,
          rank: Math.max(1, arenaRank - Math.floor(Math.random() * 10)),
          tier: ARENA_TIERS[selectedTier].name,
          wins: (challenges.length || 0) + 1,
          losses: 0,
          winStreak: 1,
          sect: character.sect || undefined,
        });
      }
    } else {
      addMessage({
        id: Date.now().toString(),
        channel: 'combat',
        content: `【战斗失败】你惜败于对手！`,
        sender: '系统',
      });
      addMessage({
        id: Date.now().toString(),
        channel: 'combat',
        content: `获得安慰奖励：${Math.floor(currentTier.reward / 5)} 金币`,
        sender: '系统',
      });
      setArenaRank(prev => prev + Math.floor(Math.random() * 5));

      // Update PVP ranking
      if (uid) {
        updatePvPRanking(uid, {
          name: character.name,
          realm: character.realm,
          realmName: character.realm,
          level: character.realmLevel,
          points: Math.max(0, arenaPoints - 10),
          rank: arenaRank + Math.floor(Math.random() * 5),
          tier: ARENA_TIERS[selectedTier].name,
          wins: 0,
          losses: 1,
          winStreak: 0,
          sect: character.sect || undefined,
        });
      }
    }

    setMatches(prev => prev.slice(0, -1));
  };

  const calculateCombatPower = () => {
    const basePower = realmLevel * 10;
    const statsPower = (character.attributes.shenli + character.attributes.gengu) * 2;
    return basePower + statsPower + (character.gold / 1000);
  };

  const getMyRankTier = () => {
    if (arenaRank <= 10) return { tier: '巅峰王者', color: '#ffd700' };
    if (arenaRank <= 50) return { tier: '绝世强者', color: '#c0c0c0' };
    if (arenaRank <= 100) return { tier: '一方豪杰', color: '#cd7f32' };
    return { tier: '初入江湖', color: '#888888' };
  };

  const myTierInfo = getMyRankTier();

  return (
    <div className="arena-panel">
      <h3 className="arena-title">🏟️ 竞技场系统</h3>

      <div className="arena-rank-info">
        <div className="rank-display">
          <div className="rank-badge" style={{ color: myTierInfo.color }}>
            {myTierInfo.tier}
          </div>
          <div className="rank-number">排名: #{arenaRank || '未上榜'}</div>
          <div className="arena-points">积分: {arenaPoints}</div>
        </div>
      </div>

      <div className="arena-tiers">
        <h4>选择竞技场</h4>
        <div className="tier-list">
          {ARENA_TIERS.map((tier, index) => (
            <button
              key={index}
              className={`tier-btn ${selectedTier === index ? 'selected' : ''} ${realmLevel < tier.levelReq ? 'disabled' : ''}`}
              onClick={() => setSelectedTier(index)}
            >
              <div className="tier-icon">{tier.icon}</div>
              <div className="tier-info">
                <div className="tier-name">{tier.name}</div>
                <div className="tier-requirement">境界要求: {tier.levelReq}重</div>
                <div className="tier-reward">奖励: {tier.reward} 金</div>
              </div>
              {realmLevel < tier.levelReq && (
                <div className="level-lock">🔒</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="arena-actions">
        <button
          className="arena-btn primary"
          onClick={handleEnterArena}
          disabled={!isLevelEnough}
        >
          {isLevelEnough ? `进入 ${currentTier.name}` : `需要 ${currentTier.levelReq} 重`}
        </button>
        <div className="entry-fee">
          入场费: <span>{currentTier.entryFee}</span> 金币
        </div>
      </div>

      {matches.length > 0 && (
        <div className="active-match">
          <h4>⚔️ 战斗中</h4>
          {matches.map(match => (
            <div key={match.id} className="match-info">
              <div className="match-players">
                <span className="player-name">{match.player1}</span>
                <span className="vs">VS</span>
                <span className="player-name">{match.player2}</span>
              </div>
              <button className="fight-btn" onClick={handleFight}>
                开始战斗
              </button>
            </div>
          ))}
        </div>
      )}

      {challenges.length > 0 && (
        <div className="incoming-challenges">
          <h4>📨 收到的挑战</h4>
          {challenges.map(chal => (
            <div key={chal.id} className="challenge-item">
              <div className="challenge-info">
                <span className="challenger-name">{chal.fromName}</span>
                <span className="challenge-type">
                  {chal.type === 'friendly' ? '切磋' : chal.type === 'duel' ? '决斗' : '死斗'}
                </span>
              </div>
              <div className="challenge-actions">
                <button
                  className="accept-btn"
                  onClick={() => {
                    if (chal.id && uid) {
                      respondToPvPChallenge(chal.id, uid, true);
                      addMessage({
                        id: Date.now().toString(),
                        channel: 'system',
                        content: `接受${chal.fromName}的挑战！`,
                        sender: '系统',
                      });
                    }
                  }}
                >
                  接受
                </button>
                <button
                  className="decline-btn"
                  onClick={() => {
                    if (chal.id && uid) {
                      respondToPvPChallenge(chal.id, uid, false);
                      addMessage({
                        id: Date.now().toString(),
                        channel: 'system',
                        content: `拒绝${chal.fromName}的挑战。`,
                        sender: '系统',
                      });
                    }
                  }}
                >
                  拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="weekly-rewards">
        <h4>🏆 每周排名奖励</h4>
        <div className="reward-list">
          {WEEKLY_RANKS.map((rank, index) => (
            <div key={index} className="reward-item">
              <div className="reward-rank">
                {typeof rank.rank === 'number' ? `#${rank.rank}` : `#${rank.rank}`}
              </div>
              <div className="reward-name">{rank.name}</div>
              <div className="reward-detail">{rank.rewards}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="arena-tips">
        <h4>📜 竞技场规则</h4>
        <ul>
          <li>每周一凌晨重置排名和积分</li>
          <li>胜利获得积分，失败扣除积分</li>
          <li>排名越高，每周奖励越丰厚</li>
          <li>每日可免费挑战10次</li>
        </ul>
      </div>
    </div>
  );
}
