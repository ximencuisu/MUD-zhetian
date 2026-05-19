import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ChatMessage } from '../types/game';
import { listenChat, sendChatMsg, ChatMsg, getPrivateConvId, listenGuildChat, sendGuildChat } from '../services/multiplayerService';
import { CONFIGURED } from '../firebase';
import './MessageLog.css';

type Channel = 'room' | 'world' | 'system' | 'announcement' | 'private' | 'guild' | 'sect' | 'team';

type MessageType = 'combat' | 'system' | 'room' | 'world' | 'say';

const CH_LABEL: Record<Channel, string> = {
  room:   '本地',
  world:  '世界',
  system: '系统',
  announcement: '通告',
  private: '私聊',
  guild:  '帮派',
  sect:   '门派',
  team:   '组队',
};
const CH_COLOR: Record<Channel, string> = {
  room:   '#00ff41',
  world:  '#ffcc00',
  system: '#00ccff',
  announcement: '#ffd700',
  private: '#ff44ff',
  guild:  '#ff8800',
  sect:   '#00ccff',
  team:   '#44ff44',
};

const LOCAL_COLORS: Record<string, string> = {
  world:  '#ffcc00',
  sect:   '#ff8800',
  room:   '#00ff41',
  system: '#00ccff',
  combat: '#ff6644',
  say:    '#cccccc',
  private:'#ff44ff',
};
const LOCAL_PREFIX: Record<string, string> = {
  world:  '[世界]',
  sect:   '[门派]',
  room:   '[场景]',
  system: '[系统]',
  combat: '[战报]',
  say:    '[说]',
  private:'[私聊]',
};

// Render message content; wrap 【name】 with clickable attack/talk buttons
function MsgContent({ content, color, interactive }: { content: string; color: string; interactive?: boolean }) {
  const processCommand = useGameStore(s => s.processCommand);
  if (!interactive) return <span className="msg-content" style={{ color }}>{content}</span>;
  const parts = content.split(/(【[^】]+】)/g);
  return (
    <span className="msg-content" style={{ color }}>
      {parts.map((part, i) => {
        const m = part.match(/^【([^】]+)】$/);
        if (!m) return <span key={i}>{part}</span>;
        const name = m[1];
        return (
          <span key={i} className="msg-entity-group">
            <button className="msg-entity-btn msg-entity-attack" title={`攻击 ${name}`}
              onClick={() => processCommand(`attack ${name}`)}>⚔</button>
            <button className="msg-entity-btn msg-entity-talk" title={`对话 ${name}`}
              onClick={() => processCommand(`talk ${name}`)}>话</button>
            <span className="msg-entity-name">【{name}】</span>
          </span>
        );
      })}
    </span>
  );
}

function LocalMsgItem({ msg }: { msg: ChatMessage }) {
  const color = msg.color || LOCAL_COLORS[msg.channel] || '#888';
  const prefix = LOCAL_PREFIX[msg.channel] || '';
  const interactive = msg.channel === 'system' || msg.channel === 'room';

  // Special announcement: eye-catching style
  if (msg.isAnnouncement) {
    return (
      <div className="msg-line msg-announcement">
        <span className="msg-prefix">【世界通告】</span>
        {msg.sender && <span className="msg-sender">{msg.sender}：</span>}
        <span className="msg-announcement-content" style={{ color: msg.color || '#ffd700' }}>
          {msg.content}
        </span>
      </div>
    );
  }

  return (
    <div className="msg-line">
      <span className="msg-prefix" style={{ color }}>{prefix}</span>
      {msg.sender && <span className="msg-sender" style={{ color }}>{msg.sender}：</span>}
      <MsgContent content={msg.content} color={color} interactive={interactive} />
    </div>
  );
}

function RemoteMsgItem({ msg, channel }: { msg: ChatMsg; channel: Channel }) {
  const color = CH_COLOR[channel];
  const prefix = `[${CH_LABEL[channel]}]`;
  return (
    <div className="msg-line remote">
      <span className="msg-prefix" style={{ color }}>{prefix}</span>
      <span className="msg-sender" style={{ color }}>{msg.sender}：</span>
      <span className="msg-content" style={{ color: channel === 'system' ? '#00ccff' : '#aaaaaa' }}>
        {msg.content}
      </span>
    </div>
  );
}

export default function MessageLog() {
  const { messages, character, addMessage, privateChatTarget, setPrivateChatTarget } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeChannel, setActiveChannel] = useState<Channel>('room');
  const [worldMsgs, setWorldMsgs] = useState<ChatMsg[]>([]);
  const [systemMsgs, setSystemMsgs] = useState<ChatMsg[]>([]);
  const [roomMsgs, setRoomMsgs] = useState<ChatMsg[]>([]);
  const [privateMsgs, setPrivateMsgs] = useState<ChatMsg[]>([]);
  const [guildMsgs, setGuildMsgs] = useState<{from:string;fromName:string;text:string;timestamp:number}[]>([]);
  const [sectMsgs, setSectMsgs] = useState<ChatMsg[]>([]);
  const [teamMsgs, setTeamMsgs] = useState<ChatMsg[]>([]);
  const [privateTarget, setPrivateTarget] = useState<string | null>(null);
  const [privateContacts, setPrivateContacts] = useState<{name:string;time:number}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [unreadPrivate, setUnreadPrivate] = useState(0);
  const [unreadGuild, setUnreadGuild] = useState(0);
  const [unreadSect, setUnreadSect] = useState(0);
  const [unreadTeam, setUnreadTeam] = useState(0);
  const [typeFilters, setTypeFilters] = useState<Record<MessageType, boolean>>({
    combat: true,
    system: true,
    room: true,
    world: true,
    say: true,
  });

  const currentRoomId = character?.currentRoomId || '';
  const uid = character?.name || 'guest';

  // Sync privateChatTarget from store
  useEffect(() => {
    if (privateChatTarget && privateChatTarget !== privateTarget) {
      setPrivateTarget(privateChatTarget);
      setActiveChannel('private');
      setPrivateChatTarget(null);
    }
  }, [privateChatTarget, privateTarget, setPrivateChatTarget]);

  // Subscribe Firebase channels
  useEffect(() => {
    if (!CONFIGURED) return;
    const u1 = listenChat('world', setWorldMsgs);
    const u2 = listenChat('system', setSystemMsgs);
    return () => { u1(); u2(); };
  }, []);

  // Listen guild chat
  useEffect(() => {
    if (!CONFIGURED || !character?.guildId) return;
    const unsub = listenGuildChat(character.guildId, setGuildMsgs);
    return unsub;
  }, [character?.guildId]);

  // Listen sect chat
  useEffect(() => {
    if (!CONFIGURED || !character?.sect) return;
    const unsub = listenChat('sect', setSectMsgs, character.sect);
    return unsub;
  }, [character?.sect]);

  // Listen team chat
  useEffect(() => {
    if (!CONFIGURED || !character?.partyId) return;
    const unsub = listenChat('team', setTeamMsgs, character.partyId);
    return unsub;
  }, [character?.partyId]);

  useEffect(() => {
    if (!CONFIGURED || !currentRoomId) return;
    const unsub = listenChat('room', setRoomMsgs, currentRoomId);
    return unsub;
  }, [currentRoomId]);

  // Listen private chat
  useEffect(() => {
    if (!CONFIGURED || !uid || !privateTarget) return;
    const convId = getPrivateConvId(uid, privateTarget);
    const unsub = listenChat('private', setPrivateMsgs, convId);
    return unsub;
  }, [uid, privateTarget]);

  // Track unread private messages
  useEffect(() => {
    if (activeChannel !== 'private' && privateMsgs.length > 0) {
      setUnreadPrivate(prev => prev + 1);
    } else {
      setUnreadPrivate(0);
    }
  }, [privateMsgs.length, activeChannel]);

  // Track unread guild messages
  useEffect(() => {
    if (activeChannel !== 'guild' && guildMsgs.length > 0) {
      setUnreadGuild(prev => prev + 1);
    } else {
      setUnreadGuild(0);
    }
  }, [guildMsgs.length, activeChannel]);

  // Track unread sect messages
  useEffect(() => {
    if (activeChannel !== 'sect' && sectMsgs.length > 0) {
      setUnreadSect(prev => prev + 1);
    } else {
      setUnreadSect(0);
    }
  }, [sectMsgs.length, activeChannel]);

  // Track unread team messages
  useEffect(() => {
    if (activeChannel !== 'team' && teamMsgs.length > 0) {
      setUnreadTeam(prev => prev + 1);
    } else {
      setUnreadTeam(0);
    }
  }, [teamMsgs.length, activeChannel]);

  // Update contacts when receiving private msg
  useEffect(() => {
    if (!uid || privateMsgs.length === 0) return;
    privateMsgs.forEach(msg => {
      if (msg.sender !== uid && msg.sender !== character?.name) {
        setPrivateContacts(prev => {
          const exists = prev.find(c => c.name === msg.sender);
          if (exists) return prev.map(c => c.name === msg.sender ? { ...c, time: msg.timestamp || Date.now() } : c);
          return [...prev, { name: msg.sender, time: msg.timestamp || Date.now() }];
        });
      }
    });
  }, [privateMsgs, uid, character?.name]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, worldMsgs, systemMsgs, roomMsgs, privateMsgs, activeChannel]);

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text || !character) return;

    // 始终添加本地消息
    const localPrefix = CH_LABEL[activeChannel] || '说';
    addMessage({ id: Date.now().toString(), channel: 'say', sender: character.name, content: `[${localPrefix}] 你说："${text}"` });

    // 尝试发送到Firebase（如果配置了的话）
    if (activeChannel === 'private' && privateTarget) {
      sendChatMsg({
        uid,
        sender: character.name,
        content: text,
        channel: 'private',
        toUid: privateTarget,
        toName: privateTarget,
      });
    } else if (activeChannel === 'guild' && character.guildId) {
      sendGuildChat(character.guildId, uid, character.name, text);
    } else if (activeChannel === 'sect' && character.sect) {
      sendChatMsg({
        uid,
        sender: character.name,
        content: text,
        channel: 'sect',
        sectId: character.sect,
      });
    } else if (activeChannel === 'team' && character.partyId) {
      sendChatMsg({
        uid,
        sender: character.name,
        content: text,
        channel: 'team',
        partyId: character.partyId,
      });
    } else if (activeChannel === 'room' || activeChannel === 'world' || activeChannel === 'system') {
      sendChatMsg({
        uid,
        sender: character.name,
        content: text,
        channel: activeChannel as 'room' | 'world' | 'system',
      }, activeChannel === 'room' ? currentRoomId : undefined);
    }

    setChatInput('');
  }, [chatInput, character, activeChannel, currentRoomId, uid, privateTarget, addMessage]);

  const channels: Channel[] = ['room', 'world', 'system', 'private', 'guild', 'sect', 'team'];

  const filteredMessages = useMemo(() => {
    let msgs = messages;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      msgs = msgs.filter(msg =>
        msg.content.toLowerCase().includes(query) ||
        (msg.sender && msg.sender.toLowerCase().includes(query))
      );
    }
    return msgs.filter(msg => typeFilters[msg.channel as MessageType] !== false);
  }, [messages, searchQuery, typeFilters]);

  const clearMessages = useCallback(() => {
    if (activeChannel === 'room') {
      useGameStore.setState({ messages: [] });
    }
  }, [activeChannel]);

  const toggleTypeFilter = (type: MessageType) => {
    setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="message-log-container">
      {/* Channel tabs */}
      <div className="msg-channel-tabs">
        {channels.map(ch => (
          <button
            key={ch}
            className={`msg-ch-tab ${activeChannel === ch ? 'active' : ''}`}
            style={activeChannel === ch ? { color: CH_COLOR[ch], borderColor: CH_COLOR[ch] } : {}}
            onClick={() => setActiveChannel(ch)}
          >
            {CH_LABEL[ch]}
            {ch === 'system' && systemMsgs.length > 0 && (
              <span className="msg-ch-dot" />
            )}
            {ch === 'private' && unreadPrivate > 0 && (
              <span className="msg-ch-badge">{unreadPrivate}</span>
            )}
            {ch === 'guild' && unreadGuild > 0 && (
              <span className="msg-ch-badge" style={{ background: '#ff8800' }}>{unreadGuild}</span>
            )}
            {ch === 'sect' && unreadSect > 0 && (
              <span className="msg-ch-badge" style={{ background: '#00ccff' }}>{unreadSect}</span>
            )}
            {ch === 'team' && unreadTeam > 0 && (
              <span className="msg-ch-badge" style={{ background: '#44ff44' }}>{unreadTeam}</span>
            )}
          </button>
        ))}
        {!CONFIGURED && (
          <span className="msg-offline-badge">离线模式</span>
        )}
      </div>

      {/* Search & Filter bar */}
      {activeChannel === 'room' && (
        <div className="msg-search-bar">
          <input
            type="text"
            className="msg-search-input"
            placeholder="搜索消息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ position: 'relative' }}>
            <button
              className={`msg-filter-btn ${showFilter ? 'active' : ''}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              筛选
            </button>
            {showFilter && (
              <div className="msg-filter-dropdown">
                {(['combat', 'system', 'room', 'say'] as MessageType[]).map(type => (
                  <div
                    key={type}
                    className={`msg-filter-option ${typeFilters[type] ? 'selected' : ''}`}
                    onClick={() => toggleTypeFilter(type)}
                  >
                    <span className="msg-filter-checkbox">
                      {typeFilters[type] ? '✓' : ''}
                    </span>
                    {LOCAL_PREFIX[type].replace(/[\[\]]/g, '')}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="msg-clear-btn" onClick={clearMessages}>
            清屏
          </button>
          {filteredMessages.length < messages.length && (
            <span className="msg-count-badge">
              {filteredMessages.length}/{messages.length}
            </span>
          )}
        </div>
      )}

      {/* Message area */}
      <div className="message-log">
        {activeChannel === 'room' && (
          <>
            {/* Local game messages */}
            {filteredMessages.map(msg => <LocalMsgItem key={msg.id} msg={msg} />)}
            {/* Remote room chat */}
            {CONFIGURED && roomMsgs.map(msg => <RemoteMsgItem key={msg.id} msg={msg} channel="room" />)}
          </>
        )}
        {activeChannel === 'world' && (
          CONFIGURED
            ? worldMsgs.map(msg => <RemoteMsgItem key={msg.id} msg={msg} channel="world" />)
            : <div className="msg-offline-hint">世界频道需要 Firebase 配置后启用</div>
        )}
        {activeChannel === 'system' && (
          CONFIGURED
            ? systemMsgs.map(msg => <RemoteMsgItem key={msg.id} msg={msg} channel="system" />)
            : <div className="msg-offline-hint">系统频道需要 Firebase 配置后启用</div>
        )}
        {activeChannel === 'guild' && (
          CONFIGURED && character.guildId ? (
            guildMsgs.length === 0 ? (
              <div className="msg-offline-hint">帮派频道暂无消息</div>
            ) : (
              guildMsgs.map((msg, i) => (
                <div key={i} className={`msg-line remote guild-${msg.from === uid ? 'sent' : 'received'}`}>
                  <span className="msg-prefix" style={{ color: '#ff8800' }}>[帮派]</span>
                  <span className="msg-sender" style={{ color: msg.from === uid ? '#ffaa44' : '#ff8800' }}>{msg.fromName}：</span>
                  <span className="msg-content" style={{ color: '#dddddd' }}>{msg.text}</span>
                </div>
              ))
            )
          ) : (
            <div className="msg-offline-hint">加入帮派后才能使用帮派频道</div>
          )
        )}
        {activeChannel === 'sect' && (
          CONFIGURED && character.sect ? (
            sectMsgs.length === 0 ? (
              <div className="msg-offline-hint">门派频道暂无消息</div>
            ) : (
              sectMsgs.map(msg => (
                <div key={msg.id} className={`msg-line remote sect-${msg.sender === uid ? 'sent' : 'received'}`}>
                  <span className="msg-prefix" style={{ color: '#00ccff' }}>[门派]</span>
                  <span className="msg-sender" style={{ color: msg.sender === uid ? '#66ddff' : '#00ccff' }}>{msg.sender}：</span>
                  <span className="msg-content" style={{ color: '#dddddd' }}>{msg.content}</span>
                </div>
              ))
            )
          ) : (
            <div className="msg-offline-hint">加入门派后才能使用门派频道</div>
          )
        )}
        {activeChannel === 'team' && (
          CONFIGURED && character.partyId ? (
            teamMsgs.length === 0 ? (
              <div className="msg-offline-hint">组队频道暂无消息</div>
            ) : (
              teamMsgs.map(msg => (
                <div key={msg.id} className={`msg-line remote team-${msg.sender === uid ? 'sent' : 'received'}`}>
                  <span className="msg-prefix" style={{ color: '#44ff44' }}>[组队]</span>
                  <span className="msg-sender" style={{ color: msg.sender === uid ? '#88ff88' : '#44ff44' }}>{msg.sender}：</span>
                  <span className="msg-content" style={{ color: '#dddddd' }}>{msg.content}</span>
                </div>
              ))
            )
          ) : (
            <div className="msg-offline-hint">组队后才能使用组队频道</div>
          )
        )}
        {activeChannel === 'private' && (
          CONFIGURED ? (
            privateTarget ? (
              <>
                <div className="private-header">
                  <span style={{ color: '#ff44ff' }}>与 {privateTarget} 的私聊</span>
                  <button className="private-back-btn" onClick={() => setPrivateTarget(null)}>返回</button>
                </div>
                {privateMsgs.map(msg => (
                  <div key={msg.id} className={`msg-line remote private-${msg.sender === uid ? 'sent' : 'received'}`}>
                    <span className="msg-prefix" style={{ color: '#ff44ff' }}>[私聊]</span>
                    <span className="msg-sender" style={{ color: msg.sender === uid ? '#ff88ff' : '#ff44ff' }}>{msg.sender}：</span>
                    <span className="msg-content" style={{ color: '#dddddd' }}>{msg.content}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="private-contact-list">
                {privateContacts.length === 0 ? (
                  <div className="msg-offline-hint">暂无私聊记录，在好友列表中点击「私聊」开始对话</div>
                ) : (
                  privateContacts.map(c => (
                    <div key={c.name} className="private-contact-item" onClick={() => setPrivateTarget(c.name)}>
                      <span className="private-contact-name">{c.name}</span>
                      <button className="private-contact-chat-btn">开始聊天</button>
                    </div>
                  ))
                )}
              </div>
            )
          ) : (
            <div className="msg-offline-hint">私聊需要 Firebase 配置后启用</div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat input — always visible */}
      <div className="msg-chat-input-row">
        <span className="msg-chat-prefix" style={{ color: CH_COLOR[activeChannel] }}>
          {activeChannel === 'private' ? `[私聊→${privateTarget}]` : `[${CH_LABEL[activeChannel]}]`}
        </span>
        <input
          className="msg-chat-input"
          placeholder={
            activeChannel === 'private' ? `发送给${privateTarget}…` :
            activeChannel === 'guild' ? '发送到帮派频道…' :
            activeChannel === 'sect' ? '发送到门派频道…' :
            activeChannel === 'team' ? '发送到组队频道…' :
            activeChannel === 'world' ? '发送到世界频道…' :
            '说点什么…'
          }
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendChat()}
        />
        <button className="msg-chat-send" onClick={sendChat}>发送</button>
      </div>
    </div>
  );
}
