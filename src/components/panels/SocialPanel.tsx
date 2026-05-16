import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  listenFriends, listenFriendRequests, listenPlayers,
  sendFriendRequest, respondToFriendRequest, removeFriend,
  OnlinePlayer, FriendData, FriendRequestData,
} from '../../services/multiplayerService';
import { CONFIGURED } from '../../firebase';
import './SocialPanel.css';

interface LocalFriend {
  id: string;
  name: string;
  level: number;
  status: 'online' | 'offline' | 'in_combat';
  lastOnline?: string;
  realm?: string;
  sect?: string;
}

interface TradeRequest {
  id: string;
  from: string;
  items: string[];
  gold: number;
  timestamp: number;
}

export default function SocialPanel() {
  const { character, addMessage, setPrivateChatTarget } = useGameStore();
  const [activeTab, setActiveTab] = useState<'online' | 'friends' | 'team' | 'trade'>('online');

  // ── Online players (Firebase) ──────────────────────────────────
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [searchPlayer, setSearchPlayer] = useState('');

  useEffect(() => {
    if (!CONFIGURED) return;
    return listenPlayers(setOnlinePlayers);
  }, []);

  // ── Friends (Firebase) ─────────────────────────────────────────
  const [friends, setFriends] = useState<LocalFriend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestData[]>([]);
  const [playerUid, setPlayerUid] = useState<string>('');

  const buildLocalFriends = useCallback((fbFriends: FriendData[], online: OnlinePlayer[]) => {
    return fbFriends.map(f => {
      const o = online.find(p => p.uid === f.uid);
      return {
        id: f.uid,
        name: f.name,
        level: f.level,
        status: o ? (o.roomId ? 'online' as const : 'online' as const) : 'offline' as const,
        lastOnline: o ? undefined : '很久以前',
        realm: f.realmName,
        sect: f.sect,
      };
    });
  }, []);

  useEffect(() => {
    if (!CONFIGURED || !playerUid) return;
    const unsub = listenFriends(playerUid, (fbFriends) => {
      setFriends(buildLocalFriends(fbFriends, onlinePlayers));
    });
    return unsub;
  }, [playerUid, onlinePlayers, buildLocalFriends]);

  useEffect(() => {
    if (!CONFIGURED || !playerUid) return;
    return listenFriendRequests(playerUid, setFriendRequests);
  }, [playerUid]);

  useEffect(() => {
    if (character?.name) {
      setPlayerUid(character.name);
    }
  }, [character?.name]);

  // ── Team (local state) ─────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<LocalFriend[]>([
    { id: '1', name: character?.name || '你', level: character?.realmLevel || 1, status: 'online' },
  ]);

  // ── Trade (local state) ────────────────────────────────────────
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [showTradeWindow, setShowTradeWindow] = useState(false);
  const [tradePartner, setTradePartner] = useState<string>('');
  const [tradeItems, setTradeItems] = useState<string[]>([]);
  const [tradeGold, setTradeGold] = useState(0);

  if (!character) {
    return <div className="social-empty">请先创建角色</div>;
  }

  // ── Friend actions ─────────────────────────────────────────────
  const handleAddFriend = () => {
    const playerName = prompt('请输入要添加的好友名称：');
    if (playerName) {
      if (CONFIGURED && playerUid) {
        const target = onlinePlayers.find(p => p.name === playerName);
        sendFriendRequest({
          from: playerUid,
          fromName: character.name,
          fromRealm: character.realm,
          fromLevel: character.realmLevel,
          fromSect: character.sect || undefined,
          to: target?.uid || playerName,
          toName: playerName,
          toRealm: character.realm,
          toLevel: character.realmLevel,
          toSect: character.sect || undefined,
          message: `你好，我是${character.name}，想加你为好友！`,
        });
        addMessage({
          id: Date.now().toString(), channel: 'system',
          content: `已向 ${playerName} 发送好友申请`,
          sender: '系统',
        });
      } else {
        // Offline mode: add locally
        const newFriend: LocalFriend = {
          id: Date.now().toString(),
          name: playerName,
          level: Math.floor(Math.random() * 50) + 1,
          status: 'online',
        };
        setFriends(prev => [...prev, newFriend]);
        addMessage({
          id: Date.now().toString(), channel: 'system',
          content: `已发送好友申请给 ${playerName}`,
          sender: '系统',
        });
      }
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend && confirm(`确定要删除好友 ${friend.name} 吗？`)) {
      if (CONFIGURED) {
        removeFriend(playerUid, friendId);
      } else {
        setFriends(prev => prev.filter(f => f.id !== friendId));
      }
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `已删除好友 ${friend.name}`,
        sender: '系统',
      });
    }
  };

  const handleAcceptFriendRequest = (reqId: string) => {
    if (CONFIGURED && playerUid) {
      respondToFriendRequest(reqId, playerUid, true);
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `已接受好友请求`,
        sender: '系统',
      });
    }
  };

  const handleDeclineFriendRequest = (reqId: string) => {
    if (CONFIGURED && playerUid) {
      respondToFriendRequest(reqId, playerUid, false);
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `已拒绝好友请求`,
        sender: '系统',
      });
    }
  };

  const handleSendPrivateMsg = (friendName: string) => {
    setPrivateChatTarget(friendName);
    addMessage({
      id: Date.now().toString(), channel: 'system',
      content: `已打开与 ${friendName} 的私聊窗口，直接输入消息发送`,
      sender: '系统',
    });
  };

  // ── Team actions ───────────────────────────────────────────────
  const handleCreateTeam = () => {
    if (teamMembers.length > 0) {
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `你已创建队伍，成员：${teamMembers.map(m => m.name).join(', ')}`,
        sender: '系统',
      });
    }
  };

  const handleInviteToTeam = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `已向 ${friend.name} 发送组队邀请`,
        sender: '系统',
      });
    }
  };

  const handleLeaveTeam = () => {
    addMessage({
      id: Date.now().toString(), channel: 'system',
      content: `你已离开队伍`,
      sender: '系统',
    });
    setTeamMembers([{ id: '1', name: character.name, level: character.realmLevel, status: 'online' }]);
  };

  // ── Trade actions ──────────────────────────────────────────────
  const handleSendTradeRequest = () => {
    const playerName = prompt('请输入要交易的对象名称：');
    if (playerName) {
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `已向 ${playerName} 发起交易请求`,
        sender: '系统',
      });
    }
  };

  const handleConfirmTrade = () => {
    if (tradePartner && tradeGold > 0) {
      if (character.gold < tradeGold) {
        addMessage({
          id: Date.now().toString(), channel: 'system',
          content: `金币不足！当前金币：${character.gold}`,
          sender: '系统',
        });
        return;
      }
      addMessage({
        id: Date.now().toString(), channel: 'system',
        content: `交易完成！已向 ${tradePartner} 转移 ${tradeGold} 金币`,
        sender: '系统',
      });
      setShowTradeWindow(false);
      setTradePartner('');
      setTradeItems([]);
      setTradeGold(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '⚫';
      case 'in_combat': return '⚔️';
      default: return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线';
      case 'offline': return '离线';
      case 'in_combat': return '战斗中';
      default: return '未知';
    }
  };

  const filteredOnline = searchPlayer
    ? onlinePlayers.filter(p => p.name.toLowerCase().includes(searchPlayer.toLowerCase()))
    : onlinePlayers;

  return (
    <div className="social-panel">
      <h3 className="social-title">👥 社交系统</h3>

      <div className="social-tabs">
        <button
          className={`tab-btn ${activeTab === 'online' ? 'active' : ''}`}
          onClick={() => setActiveTab('online')}
        >
          在线
          <span className="tab-count">{onlinePlayers.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          好友
          <span className="tab-count">{friends.length}</span>
          {friendRequests.length > 0 && <span className="tab-badge">{friendRequests.length}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          队伍
          <span className="tab-count">{teamMembers.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'trade' ? 'active' : ''}`}
          onClick={() => setActiveTab('trade')}
        >
          交易
        </button>
      </div>

      {/* ── Online Players Tab ──────────────────────────────────── */}
      {activeTab === 'online' && (
        <div className="friends-section">
          <div className="section-header">
            <h4>当前在线</h4>
            <input
              className="online-search-input"
              placeholder="搜索玩家..."
              value={searchPlayer}
              onChange={e => setSearchPlayer(e.target.value)}
              style={{
                background: '#1a1a2e', color: '#ccc', border: '1px solid #333',
                borderRadius: '4px', padding: '2px 6px', fontSize: '12px', width: '100px',
              }}
            />
          </div>

          {!CONFIGURED && (
            <div className="empty-state">
              <p>Firebase 未配置，无法查看在线玩家</p>
              <p className="hint">配置 Firebase 后即可使用多人功能</p>
            </div>
          )}

          {CONFIGURED && (
            <div className="friends-list">
              {filteredOnline.length === 0 ? (
                <div className="empty-state">
                  <p>{searchPlayer ? '未找到匹配的玩家' : '当前没有在线玩家'}</p>
                  <p className="hint">邀请好友一起玩吧！</p>
                </div>
              ) : (
                filteredOnline.map(player => (
                  <div key={player.uid} className="friend-item">
                    <div className="friend-avatar">
                      <span className="avatar-icon">👤</span>
                      <span className="status-dot online" />
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">{player.name}</div>
                      <div className="friend-status">
                        🟢 在线
                        {player.sect && <span className="friend-sect"> · {player.sect}</span>}
                      </div>
                      <div className="friend-level">
                        {player.realmName || player.realm} · Lv.{player.level}
                      </div>
                    </div>
                    <div className="friend-actions">
                      <button
                        className="action-btn chat"
                        onClick={() => handleSendPrivateMsg(player.name)}
                      >
                        私聊
                      </button>
                      <button
                        className="action-btn invite"
                        onClick={() => {
                          sendFriendRequest({
                            from: playerUid,
                            fromName: character.name,
                            fromRealm: character.realm,
                            fromLevel: character.realmLevel,
                            fromSect: character.sect || undefined,
                            to: player.uid,
                            toName: player.name,
                            toRealm: player.realmName || player.realm,
                            toLevel: player.level,
                            toSect: player.sect || undefined,
                          });
                          addMessage({
                            id: Date.now().toString(), channel: 'system',
                            content: `已发送好友申请给 ${player.name}`,
                            sender: '系统',
                          });
                        }}
                      >
                        加友
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Friends Tab ─────────────────────────────────────────── */}
      {activeTab === 'friends' && (
        <div className="friends-section">
          <div className="section-header">
            <h4>好友列表</h4>
            <button className="add-btn" onClick={handleAddFriend}>添加好友</button>
          </div>

          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="friend-requests-banner" style={{
              background: '#2a1a1a', border: '1px solid #ff4444', borderRadius: '4px',
              padding: '8px', marginBottom: '8px',
            }}>
              <h4 style={{ color: '#ff6644', margin: '0 0 4px', fontSize: '12px' }}>
                好友请求 ({friendRequests.length})
              </h4>
              {friendRequests.map(req => (
                <div key={req.id} className="friend-item" style={{ padding: '4px 0' }}>
                  <div className="friend-info">
                    <div className="friend-name">{req.fromName}</div>
                    <div className="friend-level">{req.fromRealm}</div>
                  </div>
                  <div className="friend-actions">
                    <button className="action-btn chat" onClick={() => handleAcceptFriendRequest(req.id!)}>
                      接受
                    </button>
                    <button className="action-btn remove" onClick={() => handleDeclineFriendRequest(req.id!)}>
                      拒绝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!CONFIGURED && (
            <div className="empty-state">
              <p>当前为离线模式，好友数据仅保存在本地</p>
              <p className="hint">配置 Firebase 后可同步好友数据</p>
            </div>
          )}

          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="empty-state">
                <p>还没有好友</p>
                <p className="hint">点击"添加好友"或在在线列表中添加</p>
              </div>
            ) : (
              friends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <div className="friend-avatar">
                    <span className="avatar-icon">👤</span>
                    <span className={`status-dot ${friend.status}`}></span>
                  </div>
                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>
                    <div className="friend-status">
                      {getStatusIcon(friend.status)} {getStatusText(friend.status)}
                      {friend.status === 'offline' && friend.lastOnline && ` - ${friend.lastOnline}`}
                    </div>
                    <div className="friend-level">
                      {friend.realm ? `${friend.realm} · ` : ''}Lv.{friend.level}
                      {friend.sect && <span> · {friend.sect}</span>}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-btn invite"
                      onClick={() => handleInviteToTeam(friend.id)}
                      disabled={friend.status !== 'online'}
                    >
                      组队
                    </button>
                    <button
                      className="action-btn chat"
                      onClick={() => handleSendPrivateMsg(friend.name)}
                      disabled={friend.status !== 'online'}
                    >
                      私聊
                    </button>
                    <button
                      className="action-btn trade"
                      onClick={() => {
                        setTradePartner(friend.name);
                        setShowTradeWindow(true);
                      }}
                      disabled={friend.status !== 'online'}
                    >
                      交易
                    </button>
                    <button
                      className="action-btn remove"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Team Tab ────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <div className="team-section">
          <div className="section-header">
            <h4>队伍信息</h4>
            <button className="add-btn" onClick={handleCreateTeam}>创建队伍</button>
          </div>

          <div className="team-info">
            <div className="team-count">队伍人数: {teamMembers.length}/4</div>
            {teamMembers.length < 4 && (
              <div className="team-hint">邀请好友加入可组成最多4人的队伍</div>
            )}
          </div>

          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  <span className="avatar-icon">👤</span>
                  <span className={`status-dot ${member.status}`}></span>
                </div>
                <div className="member-info">
                  <div className="member-name">
                    {member.name}
                    {index === 0 && <span className="leader-badge">队长</span>}
                  </div>
                  <div className="member-level">Lv.{member.level}</div>
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length > 1 && (
            <button className="leave-btn" onClick={handleLeaveTeam}>
              离开队伍
            </button>
          )}

          <div className="team-rules">
            <h4>队伍规则</h4>
            <ul>
              <li>组队可挑战更难的副本</li>
              <li>队伍成员可共享任务进度</li>
              <li>击杀怪物经验按贡献分配</li>
              <li>队长可踢除队员</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Trade Tab ───────────────────────────────────────────── */}
      {activeTab === 'trade' && (
        <div className="trade-section">
          <div className="section-header">
            <h4>交易系统</h4>
            <button className="add-btn" onClick={handleSendTradeRequest}>发起交易</button>
          </div>

          <div className="current-gold">
            当前金币: <span className="gold-amount">{character.gold.toLocaleString()}</span>
          </div>

          {tradeRequests.length > 0 && (
            <div className="trade-requests">
              <h4>交易请求</h4>
              {tradeRequests.map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-info">
                    <div className="request-from">{request.from}</div>
                    <div className="request-detail">
                      物品: {request.items.join(', ') || '无'}
                      <br />
                      金币: {request.gold}
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="accept-btn" onClick={() => {
                      setTradePartner(request.from);
                      setShowTradeWindow(true);
                      setTradeRequests(prev => prev.filter(r => r.id !== request.id));
                    }}>
                      接受
                    </button>
                    <button className="decline-btn" onClick={() => {
                      setTradeRequests(prev => prev.filter(r => r.id !== request.id));
                    }}>
                      拒绝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="trade-history">
            <h4>交易记录</h4>
            <div className="empty-state">
              <p>暂无交易记录</p>
            </div>
          </div>

          <div className="trade-rules">
            <h4>交易须知</h4>
            <ul>
              <li>交易需双方同意方可完成</li>
              <li>交易物品一旦转移，无法撤销</li>
              <li>请确认交易对象，避免被骗</li>
              <li>如有疑问，请联系客服</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Trade Window Overlay ────────────────────────────────── */}
      {showTradeWindow && (
        <div className="trade-window-overlay">
          <div className="trade-window">
            <h3>交易窗口 - {tradePartner}</h3>
            <div className="trade-items">
              <h4>交易物品</h4>
              <div className="items-list">
                {tradeItems.length === 0 ? (
                  <div className="empty-items">暂无物品</div>
                ) : (
                  tradeItems.map((item, index) => (
                    <div key={index} className="trade-item">
                      {item}
                      <button onClick={() => setTradeItems(prev => prev.filter((_, i) => i !== index))}>
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="trade-gold-input">
              <label>交易金币:</label>
              <input
                type="number"
                value={tradeGold}
                onChange={(e) => setTradeGold(Math.max(0, parseInt(e.target.value) || 0))}
                max={character.gold}
              />
              <span>/ {character.gold.toLocaleString()}</span>
            </div>
            <div className="trade-window-actions">
              <button className="confirm-btn" onClick={handleConfirmTrade}>
                确认交易
              </button>
              <button className="cancel-btn" onClick={() => setShowTradeWindow(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
