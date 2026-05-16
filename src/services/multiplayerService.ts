/**
 * Multiplayer service — wraps Firebase Realtime DB.
 * Falls back gracefully when Firebase is not configured (CONFIGURED=false).
 *
 * DB layout:
 *   /players/{uid}                   — online player presence
 *   /chat/world                      — world channel messages
 *   /chat/room/{roomId}              — per-room channel
 *   /chat/system                     — server broadcasts
 *   /chat/private/{convId}           — private messages (sorted UIDs)
 *   /friends/{uid}                   — friend list per player
 *   /friend_requests/{uid}           — incoming friend requests
 *   /parties/{partyId}               — party data
 *   /pvp/challenges/{uid}            — incoming PVP challenges
 *   /pvp/rankings/{uid}              — PVP ranking data
 *   /zones/{zoneId}/rooms            — generated zone room data (seeded, shared)
 */

import {
  ref, set, remove, onValue, push, serverTimestamp, onDisconnect,
  off, get, update, DatabaseReference, query, limitToLast, orderByChild,
} from 'firebase/database';
import { db, CONFIGURED } from '../firebase';

// ── Types ──────────────────────────────────────────────────────────────────

export interface OnlinePlayer {
  uid: string;
  name: string;
  realm: string;
  realmName: string;
  roomId: string;
  zoneId: string | null;
  lastSeen: number;
  level: number;
  sect?: string;
  sectRank?: string;
}

export interface ChatMsg {
  id?: string;
  uid: string;
  sender: string;
  content: string;
  timestamp: number;
  channel: 'world' | 'room' | 'system' | 'private';
  roomId?: string;
  toUid?: string;
  toName?: string;
}

export interface FriendData {
  uid: string;
  name: string;
  realm: string;
  realmName: string;
  level: number;
  addedAt: number;
  sect?: string;
}

export interface FriendRequestData {
  id?: string;
  from: string;
  fromName: string;
  fromRealm: string;
  fromLevel: number;
  fromSect?: string;
  to: string;
  toName: string;
  toRealm: string;
  toLevel: number;
  toSect?: string;
  message?: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface PartyMemberData {
  uid: string;
  name: string;
  realmLevel: number;
  realm: string;
  role: 'tank' | 'dps' | 'healer' | 'support';
  status: 'idle' | 'ready' | 'in_combat';
  hp: number;
  maxHp: number;
  roomId: string;
}

export interface PartyData {
  id?: string;
  leader: string;
  leaderName: string;
  members: PartyMemberData[];
  maxSize: number;
  dungeonId?: string;
  shareLoot: boolean;
  shareExp: boolean;
  createdAt: number;
}

export interface PvPChallengeData {
  id?: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  type: 'friendly' | 'duel' | 'deathmatch';
  bet?: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  timestamp: number;
}

export interface PvPRankingEntry {
  uid: string;
  name: string;
  realm: string;
  realmName: string;
  level: number;
  points: number;
  rank: number;
  tier: string;
  wins: number;
  losses: number;
  winStreak: number;
  sect?: string;
}

type Unsub = () => void;

// ── Player presence ────────────────────────────────────────────────────────

export function registerPresence(player: Omit<OnlinePlayer, 'lastSeen'>): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const playerRef = ref(db, `players/${player.uid}`);
  set(playerRef, { ...player, lastSeen: serverTimestamp() });
  onDisconnect(playerRef).remove();
  return () => { remove(playerRef); };
}

export function updatePresence(uid: string, patch: Partial<OnlinePlayer>) {
  if (!CONFIGURED || !db) return;
  const playerRef = ref(db, `players/${uid}`);
  update(playerRef, { ...patch, lastSeen: serverTimestamp() });
}

export function listenPlayers(cb: (players: OnlinePlayer[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, 'players');
  onValue(r, snap => {
    const val = snap.val() || {};
    cb(Object.values(val) as OnlinePlayer[]);
  });
  return () => off(r);
}

// ── Chat ───────────────────────────────────────────────────────────────────

const MAX_MSGS = 80;

function chatRef(channel: 'world' | 'system'): DatabaseReference;
function chatRef(channel: 'room', roomId: string): DatabaseReference;
function chatRef(channel: 'private', convId: string): DatabaseReference;
function chatRef(channel: string, param?: string): DatabaseReference {
  if (!db) throw new Error('DB not ready');
  if (channel === 'room') return ref(db, `chat/room/${param}`);
  if (channel === 'private') return ref(db, `chat/private/${param}`);
  return ref(db, `chat/${channel}`);
}

export function sendChatMsg(msg: Omit<ChatMsg, 'id' | 'timestamp'>, roomId?: string) {
  if (!CONFIGURED || !db) return;
  try {
    const r = msg.channel === 'room' ? chatRef('room', roomId!) 
      : msg.channel === 'private' ? chatRef('private', getPrivateConvId(msg.uid!, msg.toUid!))
      : chatRef(msg.channel as 'world' | 'system');
    push(r, { ...msg, timestamp: serverTimestamp() });
  } catch {
    return;
  }
}

export function getPrivateConvId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}

export function listenChat(
  channel: 'world' | 'system',
  cb: (msgs: ChatMsg[]) => void,
): Unsub;
export function listenChat(
  channel: 'room',
  cb: (msgs: ChatMsg[]) => void,
  roomId: string,
): Unsub;
export function listenChat(
  channel: 'private',
  cb: (msgs: ChatMsg[]) => void,
  convId: string,
): Unsub;
export function listenChat(channel: string, cb: (msgs: ChatMsg[]) => void, param?: string): Unsub {
  if (!CONFIGURED || !db) return () => {};
  try {
    let r: DatabaseReference;
    if (channel === 'room') r = chatRef('room', param!);
    else if (channel === 'private') {
      const [uid1, uid2] = param!.split('_');
      r = chatRef('private', getPrivateConvId(uid1, uid2));
    } else r = chatRef(channel as 'world' | 'system');
    onValue(r, snap => {
      const val = snap.val() || {};
      const msgs: ChatMsg[] = Object.entries(val).map(([id, v]) => ({ id, ...(v as ChatMsg) }));
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      cb(msgs.slice(-MAX_MSGS));
    });
    return () => off(r);
  } catch {
    return () => {};
  }
}

export function broadcastSystem(content: string) {
  if (!CONFIGURED || !db) return;
  push(ref(db, 'chat/system'), {
    uid: 'system', sender: '系统', content,
    channel: 'system', timestamp: serverTimestamp(),
  });
}

// ── Friend system ──────────────────────────────────────────────────────────

export function sendFriendRequest(req: Omit<FriendRequestData, 'id' | 'timestamp' | 'status'>) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `friend_requests/${req.to}`);
  push(r, { ...req, status: 'pending', timestamp: serverTimestamp() });
}

export function listenFriendRequests(uid: string, cb: (requests: FriendRequestData[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `friend_requests/${uid}`);
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: FriendRequestData[] = Object.entries(val).map(([id, v]) => ({ id, ...(v as FriendRequestData) }));
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    cb(list.filter(x => x.status === 'pending'));
  });
  return () => off(r);
}

export async function respondToFriendRequest(requestId: string, toUid: string, accept: boolean) {
  if (!CONFIGURED || !db) return;
  const reqRef = ref(db, `friend_requests/${toUid}/${requestId}`);
  const snap = await get(reqRef);
  if (!snap.exists()) return;
  const req = snap.val() as FriendRequestData;
  
  // Mark as accepted/rejected
  await update(reqRef, { status: accept ? 'accepted' : 'rejected' });
  
  if (accept) {
    // Add to both players' friend lists with realm/level info
    await set(ref(db, `friends/${toUid}/${req.from}`), {
      uid: req.from, name: req.fromName,
      realm: req.fromRealm, realmName: req.fromRealm,
      level: req.fromLevel, sect: req.fromSect || '',
      addedAt: serverTimestamp(),
    });
    await set(ref(db, `friends/${req.from}/${toUid}`), {
      uid: toUid, name: req.toName,
      realm: req.toRealm, realmName: req.toRealm,
      level: req.toLevel, sect: req.toSect || '',
      addedAt: serverTimestamp(),
    });
  }
}

export function listenFriends(uid: string, cb: (friends: FriendData[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `friends/${uid}`);
  onValue(r, snap => {
    const val = snap.val() || {};
    // The friends store just has uid+name references; we supplement with profile data
    const list: FriendData[] = Object.values(val) as FriendData[];
    cb(list);
  });
  return () => off(r);
}

export async function removeFriend(uid: string, friendUid: string) {
  if (!CONFIGURED || !db) return;
  await remove(ref(db, `friends/${uid}/${friendUid}`));
  await remove(ref(db, `friends/${friendUid}/${uid}`));
}

// ── Party system ───────────────────────────────────────────────────────────

export async function createParty(leader: PartyMemberData): Promise<string | null> {
  if (!CONFIGURED || !db) return null;
  const partyRef = push(ref(db, 'parties'));
  const partyId = partyRef.key!;
  await set(partyRef, {
    leader: leader.uid,
    leaderName: leader.name,
    members: [leader],
    maxSize: 4,
    shareLoot: true,
    shareExp: true,
    createdAt: serverTimestamp(),
  } as Omit<PartyData, 'id'>);
  return partyId;
}

export async function joinParty(partyId: string, member: PartyMemberData) {
  if (!CONFIGURED || !db) return;
  const partyRef = ref(db, `parties/${partyId}`);
  const snap = await get(partyRef);
  if (!snap.exists()) return;
  const party = snap.val() as PartyData;
  if (party.members.length >= party.maxSize) return;
  await set(partyRef, { ...party, members: [...party.members, member] });
}

export async function leaveParty(partyId: string, uid: string) {
  if (!CONFIGURED || !db) return;
  const partyRef = ref(db, `parties/${partyId}`);
  const snap = await get(partyRef);
  if (!snap.exists()) return;
  const party = snap.val() as PartyData;
  const newMembers = party.members.filter(m => m.uid !== uid);
  if (newMembers.length === 0) {
    await remove(partyRef);
  } else {
    // If the leader left, assign new leader
    const newLeader = party.leader === uid ? newMembers[0].uid : party.leader;
    const newLeaderName = party.leader === uid ? newMembers[0].name : party.leaderName;
    await set(partyRef, { ...party, members: newMembers, leader: newLeader, leaderName: newLeaderName });
  }
}

export async function disbandParty(partyId: string) {
  if (!CONFIGURED || !db) return;
  await remove(ref(db, `parties/${partyId}`));
}

export function listenParty(partyId: string, cb: (party: PartyData | null) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `parties/${partyId}`);
  onValue(r, snap => {
    cb(snap.val() as PartyData | null);
  });
  return () => off(r);
}

export async function getParty(partyId: string): Promise<PartyData | null> {
  if (!CONFIGURED || !db) return null;
  const snap = await get(ref(db, `parties/${partyId}`));
  return snap.val() as PartyData | null;
}

export function listenPlayerParty(uid: string, cb: (partyId: string | null) => void): Unsub {
  // We store party membership on the player record for easy lookup
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `players/${uid}/partyId`);
  onValue(r, snap => {
    cb(snap.val() as string | null);
  });
  return () => off(r);
}

export async function setPlayerParty(uid: string, partyId: string | null) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `players/${uid}/partyId`);
  if (partyId) await set(r, partyId);
  else await remove(r);
}

// ── PVP system ─────────────────────────────────────────────────────────────

export function sendPvPChallenge(challenge: Omit<PvPChallengeData, 'id' | 'timestamp'>) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `pvp/challenges/${challenge.to}`);
  push(r, { ...challenge, status: 'pending', timestamp: serverTimestamp() });
}

export function listenPvPChallenges(uid: string, cb: (challenges: PvPChallengeData[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `pvp/challenges/${uid}`);
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: PvPChallengeData[] = Object.entries(val).map(([id, v]) => ({ id, ...(v as PvPChallengeData) }));
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    cb(list.filter(x => x.status === 'pending'));
  });
  return () => off(r);
}

export async function respondToPvPChallenge(challengeId: string, toUid: string, accept: boolean) {
  if (!CONFIGURED || !db) return;
  const chalRef = ref(db, `pvp/challenges/${toUid}/${challengeId}`);
  await update(chalRef, { status: accept ? 'accepted' : 'declined' });
}

// ── PVP Rankings ───────────────────────────────────────────────────────────

export async function updatePvPRanking(uid: string, entry: Partial<PvPRankingEntry>) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `pvp/rankings/${uid}`);
  const snap = await get(r);
  const current = snap.val() as PvPRankingEntry | null;
  await set(r, { ...current, ...entry, uid } as PvPRankingEntry);
}

export function listenPvPRankings(cb: (rankings: PvPRankingEntry[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, 'pvp/rankings'), limitToLast(100));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: PvPRankingEntry[] = Object.values(val) as PvPRankingEntry[];
    list.sort((a, b) => (b.points || 0) - (a.points || 0));
    cb(list);
  });
  return () => off(r);
}

// ── Zone seed (shared deterministic generation) ────────────────────────────

export async function getOrCreateZoneSeed(zoneId: string): Promise<number> {
  if (!CONFIGURED || !db) return hashStr(zoneId);
  const r = ref(db, `zones/${zoneId}/seed`);
  const snap = await get(r);
  if (snap.exists()) return snap.val() as number;
  const seed = Math.floor(Math.random() * 0xffffffff);
  await set(r, seed);
  return seed;
}

function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

// ── Guild (帮派) System ────────────────────────────────────────────

export interface GuildShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'item' | 'buff';
  effect?: string;
  itemId?: string;
}

export interface GuildSkillData {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  effects: Record<string, number>;
  costPerLevel: number;
}

export interface GuildWarChallenge {
  id: string;
  fromGuildId: string;
  fromGuildName: string;
  toGuildId: string;
  toGuildName: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  challenger: string;
  challengerName: string;
  timestamp: number;
}

export interface GuildData {
  id: string;
  name: string;
  emblem: string;
  description: string;
  level: number;
  exp: number;
  leader: string;
  leaderName: string;
  announcement: string;
  memberCount: number;
  funds: number;
  prestige: number;
  territory: string;
  territoryName: string;
  createdAt: number;
}

export interface GuildMember {
  uid: string;
  name: string;
  realm: string;
  realmName: string;
  level: number;
  sect?: string;
  rank: 'leader' | 'vice_leader' | 'elder' | 'elite' | 'member';
  joinedAt: number;
  contribution: number;
  lastActive: number;
}

export interface GuildApplication {
  id: string;
  from: string;
  fromName: string;
  fromRealm: string;
  fromLevel: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

const GUILD_RANK_ORDER: Record<string, number> = {
  'leader': 5,
  'vice_leader': 4,
  'elder': 3,
  'elite': 2,
  'member': 1,
};

export const GUILD_RANK_NAMES: Record<string, string> = {
  'leader': '帮主',
  'vice_leader': '副帮主',
  'elder': '长老',
  'elite': '精英',
  'member': '帮众',
};

/** Create a new guild */
export async function createGuild(uid: string, name: string, description: string): Promise<string | null> {
  if (!CONFIGURED || !db) return null;
  const guildRef = push(ref(db, 'guilds'));
  const guildId = guildRef.key!;
  const guild: GuildData = {
    id: guildId,
    name,
    emblem: '🏰',
    description,
    level: 1,
    exp: 0,
    leader: uid,
    leaderName: '',
    announcement: '欢迎加入帮派！',
    memberCount: 1,
    funds: 1000,
    prestige: 0,
    territory: 'wilderness',
    territoryName: '荒野之地·未开垦',
    createdAt: Date.now(),
  };
  await set(guildRef, guild);
  // Add creator as leader member
  const memberRef = ref(db, `guild_members/${guildId}/${uid}`);
  await set(memberRef, {
    uid,
    name: uid,
    realm: '',
    realmName: '',
    level: 1,
    rank: 'leader' as const,
    joinedAt: Date.now(),
    contribution: 0,
    lastActive: Date.now(),
  });
  return guildId;
}

/** Listen to a guild's data */
export function listenGuild(guildId: string, cb: (guild: GuildData | null) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `guilds/${guildId}`);
  onValue(r, snap => {
    const val = snap.val();
    cb(val as GuildData | null);
  });
  return () => off(r);
}

/** Listen to guild members */
export function listenGuildMembers(guildId: string, cb: (members: GuildMember[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, `guild_members/${guildId}`), orderByChild('rank'));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: GuildMember[] = Object.values(val) as GuildMember[];
    list.sort((a, b) => (GUILD_RANK_ORDER[b.rank] || 0) - (GUILD_RANK_ORDER[a.rank] || 0));
    cb(list);
  });
  return () => off(r);
}

/** Listen to guild applications */
export function listenGuildApplications(guildId: string, cb: (apps: GuildApplication[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, `guild_applications/${guildId}`), orderByChild('timestamp'));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: GuildApplication[] = Object.entries(val)
      .filter(([_, v]) => (v as GuildApplication).status === 'pending')
      .map(([k, v]) => ({ ...(v as GuildApplication), id: k }));
    list.sort((a, b) => b.timestamp - a.timestamp);
    cb(list);
  });
  return () => off(r);
}

/** Send guild application */
export async function sendGuildApplication(guildId: string, from: string, fromName: string, fromRealm: string, fromLevel: number, message: string) {
  if (!CONFIGURED || !db) return;
  const r = push(ref(db, `guild_applications/${guildId}`));
  await set(r, {
    from, fromName, fromRealm, fromLevel, message,
    status: 'pending',
    timestamp: Date.now(),
  });
}

/** Respond to guild application — if accepted, also add as member */
export async function respondToGuildApplication(guildId: string, appId: string, accept: boolean) {
  if (!CONFIGURED || !db) return;
  const statusRef = ref(db, `guild_applications/${guildId}/${appId}/status`);
  await set(statusRef, accept ? 'accepted' : 'rejected');
  if (accept) {
    // Read the application data to get the applicant's info
    const snap = await get(ref(db, `guild_applications/${guildId}/${appId}`));
    const app = snap.val() as GuildApplication | null;
    if (app) {
      await addGuildMember(guildId, {
        uid: app.from,
        name: app.fromName,
        realm: app.fromRealm || '',
        realmName: app.fromRealm || '',
        level: app.fromLevel || 1,
        rank: 'member',
        joinedAt: Date.now(),
        contribution: 0,
        lastActive: Date.now(),
      });
    }
  }
}

/** Search guilds by name */
export function listenGuilds(cb: (guilds: GuildData[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, 'guilds'), orderByChild('memberCount'));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: GuildData[] = Object.values(val) as GuildData[];
    list.sort((a, b) => b.memberCount - a.memberCount);
    cb(list);
  });
  return () => off(r);
}

/** Update guild info (leader only) */
export async function updateGuildInfo(guildId: string, patch: Partial<GuildData>) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guilds/${guildId}`);
  await update(r, patch as any);
}

/** Kick a member (leader/vice_leader only) */
export async function kickGuildMember(guildId: string, memberUid: string) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guild_members/${guildId}/${memberUid}`);
  await remove(r);
}

/** Change member rank (leader only) */
export async function setGuildMemberRank(guildId: string, memberUid: string, rank: GuildMember['rank']) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guild_members/${guildId}/${memberUid}/rank`);
  await set(r, rank);
}

/** Join a guild (after application accepted) */
export async function addGuildMember(guildId: string, member: GuildMember) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guild_members/${guildId}/${member.uid}`);
  await set(r, member);
  // Increment member count
  const countRef = ref(db, `guilds/${guildId}/memberCount`);
  const snap = await get(countRef);
  const cur = snap.val() as number || 1;
  await set(countRef, cur + 1);
}

/** Leave a guild */
export async function leaveGuild(guildId: string, memberUid: string) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guild_members/${guildId}/${memberUid}`);
  await remove(r);
  // Decrement member count
  const snap = await get(ref(db, `guilds/${guildId}/memberCount`));
  const cur = snap.val() as number || 1;
  await set(ref(db, `guilds/${guildId}/memberCount`), Math.max(1, cur - 1));
}

/* ============== Ranking System ============== */

export interface PlayerRanking {
  uid: string;
  name: string;
  realmLevel: number;
  realm: string;
  sect: string;
  power: number;
  kills: number;
  updatedAt: number;
}

/** Save/update a player's ranking data */
export async function savePlayerRanking(uid: string, data: Omit<PlayerRanking, 'uid' | 'updatedAt'>) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `rankings/${uid}`);
  await set(r, { ...data, uid, updatedAt: Date.now() });
}

/** Listen to all rankings, sorted client-side by the given field */
export function listenRankings(cb: (rankings: PlayerRanking[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, `rankings`), limitToLast(200));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: PlayerRanking[] = Object.values(val);
    cb(list);
  });
  return () => off(r);
}

/** Increment kill count for a player */
export async function incrementKills(uid: string) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `rankings/${uid}/kills`);
  const snap = await get(r);
  const cur = (snap.val() as number) || 0;
  await set(r, cur + 1);
  await set(ref(db, `rankings/${uid}/updatedAt`), Date.now());
}

/** Send guild chat message */
export async function sendGuildChat(guildId: string, from: string, fromName: string, text: string) {
  if (!CONFIGURED || !db) return;
  const r = push(ref(db, `guild_chat/${guildId}/messages`));
  await set(r, {
    from, fromName, text,
    timestamp: Date.now(),
  });
}

/** Listen to guild chat messages */
export function listenGuildChat(guildId: string, cb: (msgs: { from: string; fromName: string; text: string; timestamp: number }[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, `guild_chat/${guildId}/messages`), limitToLast(50));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list = Object.values(val) as any[];
    cb(list);
  });
  return () => off(r);
}

/* ============== Guild Expansion: Shop, Skills, Territory, War ============== */

/** Guild predefined shop items (bought with contribution) */
export const GUILD_SHOP_ITEMS: GuildShopItem[] = [
  { id: 'g_potion_hp', name: '回血丹', description: '恢复500点生命值', price: 50, type: 'item', effect: 'hp+500', itemId: 'g_potion_hp' },
  { id: 'g_potion_mp', name: '回神丹', description: '恢复300点神力', price: 50, type: 'item', effect: 'mp+300', itemId: 'g_potion_mp' },
  { id: 'g_power_pill', name: '大力丸', description: '战斗攻击力+20%（持续30分钟）', price: 150, type: 'buff', effect: 'atk+20%' },
  { id: 'g_def_pill', name: '金刚丹', description: '战斗防御力+20%（持续30分钟）', price: 150, type: 'buff', effect: 'def+20%' },
  { id: 'g_exp_pill', name: '悟道丹', description: '击杀经验+30%（持续30分钟）', price: 200, type: 'buff', effect: 'exp+30%' },
  { id: 'g_speed_pill', name: '神行符', description: '移动速度+50%（持续15分钟）', price: 100, type: 'buff', effect: 'spd+50%' },
  { id: 'g_revive_stone', name: '替死符', description: '死亡时原地复活一次（不损失经验）', price: 500, type: 'item', effect: 'revive', itemId: 'g_revive_stone' },
  { id: 'g_gold_pouch', name: '帮派钱袋', description: '获得500金叶帮派资金', price: 300, type: 'item', effect: 'funds+500', itemId: 'g_gold_pouch' },
];

/** Guild predefined skills (learned with contribution) */
export const GUILD_SKILLS: GuildSkillData[] = [
  { id: 'g_skill_hp', name: '锻体术', description: '修炼肉体，提升生命上限', maxLevel: 10, effects: { maxHp: 200 }, costPerLevel: 100 },
  { id: 'g_skill_atk', name: '破锋诀', description: '领悟攻伐之道，提升攻击力', maxLevel: 10, effects: { attack: 30 }, costPerLevel: 120 },
  { id: 'g_skill_def', name: '金刚诀', description: '淬炼防御，提升防御力', maxLevel: 10, effects: { defense: 20 }, costPerLevel: 120 },
  { id: 'g_skill_exp', name: '悟道诀', description: '悟道增慧，提升击杀经验获取', maxLevel: 10, effects: { expBonus: 10 }, costPerLevel: 150 },
  { id: 'g_skill_crit', name: '会心诀', description: '感悟要害，提升暴击率', maxLevel: 5, effects: { critRate: 3 }, costPerLevel: 200 },
];

/** Guild territory definitions */
export const GUILD_TERRITORIES: Record<string, { name: string; description: string; upgradeCost: number; requireLevel: number }> = {
  wilderness: { name: '荒野之地·未开垦', description: '一片荒芜之地，仅有简陋的营地。', upgradeCost: 0, requireLevel: 1 },
  encampment: { name: '初级营地', description: '搭建了简易木栅栏和营帐，初具规模。', upgradeCost: 5000, requireLevel: 2 },
  fort: { name: '坚固堡垒', description: '石墙环绕，箭塔林立，易守难攻。', upgradeCost: 20000, requireLevel: 4 },
  manor: { name: '庄园府邸', description: '亭台楼阁，灵田药圃，一派仙家气象。', upgradeCost: 50000, requireLevel: 6 },
  palace: { name: '仙宫圣殿', description: '悬浮于云海之中的仙家宫殿，威震八方。', upgradeCost: 150000, requireLevel: 8 },
};

const TERRITORY_UPGRADE_ORDER = ['wilderness', 'encampment', 'fort', 'manor', 'palace'];

/** Buy an item from guild shop (deducts contribution) */
export async function guildBuyItem(guildId: string, uid: string, itemId: string): Promise<boolean> {
  if (!CONFIGURED || !db) return false;
  const item = GUILD_SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return false;
  const memberRef = ref(db, `guild_members/${guildId}/${uid}/contribution`);
  const snap = await get(memberRef);
  const contrib = (snap.val() as number) || 0;
  if (contrib < item.price) return false;
  await set(memberRef, contrib - item.price);
  if (item.type === 'item' && item.itemId === 'g_gold_pouch') {
    // Add to guild funds
    const fundsRef = ref(db, `guilds/${guildId}/funds`);
    const fs = await get(fundsRef);
    const curFunds = (fs.val() as number) || 0;
    await set(fundsRef, curFunds + 500);
  }
  return true;
}

/** Learn/upgrade a guild skill (deducts contribution) */
export async function guildLearnSkill(guildId: string, uid: string, skillId: string, currentLevel: number): Promise<number | null> {
  if (!CONFIGURED || !db) return null;
  const skill = GUILD_SKILLS.find(s => s.id === skillId);
  if (!skill) return null;
  if (currentLevel >= skill.maxLevel) return null;
  const memberRef = ref(db, `guild_members/${guildId}/${uid}/contribution`);
  const snap = await get(memberRef);
  const contrib = (snap.val() as number) || 0;
  if (contrib < skill.costPerLevel) return null;
  await set(memberRef, contrib - skill.costPerLevel);
  return currentLevel + 1;
}

/** Get the next territory key for upgrade */
export function getNextTerritory(current: string): string | null {
  const idx = TERRITORY_UPGRADE_ORDER.indexOf(current);
  if (idx < 0 || idx >= TERRITORY_UPGRADE_ORDER.length - 1) return null;
  return TERRITORY_UPGRADE_ORDER[idx + 1];
}

/** Upgrade guild territory (deducts funds) */
export async function guildUpgradeTerritory(guildId: string): Promise<boolean> {
  if (!CONFIGURED || !db) return false;
  const guildRef = ref(db, `guilds/${guildId}`);
  const snap = await get(guildRef);
  const guild = snap.val() as GuildData | null;
  if (!guild) return false;
  const next = getNextTerritory(guild.territory);
  if (!next) return false;
  const territoryInfo = GUILD_TERRITORIES[next];
  if (guild.funds < territoryInfo.upgradeCost) return false;
  if (guild.level < territoryInfo.requireLevel) return false;
  await set(ref(db, `guilds/${guildId}/funds`), guild.funds - territoryInfo.upgradeCost);
  await set(ref(db, `guilds/${guildId}/territory`), next);
  await set(ref(db, `guilds/${guildId}/territoryName`), territoryInfo.name);
  return true;
}

/** Add contribution to a guild member */
export async function guildAddContribution(guildId: string, uid: string, amount: number) {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `guild_members/${guildId}/${uid}/contribution`);
  const snap = await get(r);
  const cur = (snap.val() as number) || 0;
  await set(r, cur + amount);
}


/* ===== Guild War System ===== */

/** Send a guild war challenge */
export async function sendGuildWarChallenge(fromGuildId: string, fromGuildName: string, toGuildId: string, toGuildName: string, challenger: string, challengerName: string): Promise<string | null> {
  if (!CONFIGURED || !db) return null;
  const r = push(ref(db, 'guild_wars'));
  const challenge: GuildWarChallenge = {
    id: r.key!,
    fromGuildId, fromGuildName,
    toGuildId, toGuildName,
    status: 'pending',
    challenger, challengerName,
    timestamp: Date.now(),
  };
  await set(r, challenge);
  return r.key;
}

/** Listen to guild war challenges for a guild */
export function listenGuildWarChallenges(guildId: string, cb: (challenges: GuildWarChallenge[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, 'guild_wars'), limitToLast(50));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: GuildWarChallenge[] = Object.values(val)
      .filter((c: any) => c.toGuildId === guildId || c.fromGuildId === guildId);
    cb(list);
  });
  return () => off(r);
}

/** Respond to a guild war challenge */
export async function respondToGuildWar(guildId: string, challengeId: string, accept: boolean) {
  if (!CONFIGURED || !db) return;
  const status = accept ? 'accepted' : 'declined';
  await set(ref(db, `guild_wars/${challengeId}/status`), status);
}

/** Resolve a guild war (calculate winner based on member power) */
export async function resolveGuildWar(challengeId: string): Promise<{ winnerId: string; winnerName: string } | null> {
  if (!CONFIGURED || !db) return null;
  const snap = await get(ref(db, `guild_wars/${challengeId}`));
  if (!snap.exists()) return null;
  const war = snap.val() as GuildWarChallenge;
  if (war.status !== 'accepted') return null;

  // Get both guilds' members
  const [fromMembersSnap, toMembersSnap] = await Promise.all([
    get(ref(db, `guild_members/${war.fromGuildId}`)),
    get(ref(db, `guild_members/${war.toGuildId}`)),
  ]);

  const fromMembers: GuildMember[] = Object.values(fromMembersSnap.val() || {});
  const toMembers: GuildMember[] = Object.values(toMembersSnap.val() || {});

  // Calculate total power for each guild
  const fromPower = fromMembers.reduce((sum, m) => sum + (m.level || 1) * 100 + (m.contribution || 0), 0);
  const toPower = toMembers.reduce((sum, m) => sum + (m.level || 1) * 100 + (m.contribution || 0), 0);

  // Add some randomness
  const fromRoll = fromPower * (0.8 + Math.random() * 0.4);
  const toRoll = toPower * (0.8 + Math.random() * 0.4);

  const winnerId = fromRoll >= toRoll ? war.fromGuildId : war.toGuildId;
  const winnerName = fromRoll >= toRoll ? war.fromGuildName : war.toGuildName;
  const loserId = winnerId === war.fromGuildId ? war.toGuildId : war.fromGuildId;

  // Update war status
  await set(ref(db, `guild_wars/${challengeId}/status`), 'completed');

  // Update winner prestige
  const winnerPrestigeRef = ref(db, `guilds/${winnerId}/prestige`);
  const winnerPrestigeSnap = await get(winnerPrestigeRef);
  const curPrestige = (winnerPrestigeSnap.val() as number) || 0;
  await set(winnerPrestigeRef, curPrestige + 100);

  // Update loser prestige
  const loserPrestigeRef = ref(db, `guilds/${loserId}/prestige`);
  const loserPrestigeSnap = await get(loserPrestigeRef);
  const curLoserPrestige = (loserPrestigeSnap.val() as number) || 0;
  await set(loserPrestigeRef, Math.max(0, curLoserPrestige - 50));

  return { winnerId, winnerName };
}

/** Contribute to guild (add contribution + funds) */
export async function guildContribute(guildId: string, uid: string, goldAmount: number): Promise<boolean> {
  if (!CONFIGURED || !db) return false;
  const contribPerGold = 1; // 1 gold = 1 contribution
  const contribution = goldAmount * contribPerGold;
  const fundsAdd = Math.floor(goldAmount * 0.5); // 50% goes to guild funds
  const r = ref(db, `guild_members/${guildId}/${uid}/contribution`);
  const snap = await get(r);
  const cur = (snap.val() as number) || 0;
  await set(r, cur + contribution);
  // Add to guild funds
  const fundsRef = ref(db, `guilds/${guildId}/funds`);
  const fs = await get(fundsRef);
  const curFunds = (fs.val() as number) || 0;
  await set(fundsRef, curFunds + fundsAdd);
  return true;
}

/* ===== Trade System ===== */

export interface TradeItem {
  itemId: string;
  name: string;
  count: number;
}

export interface TradeOffer {
  id?: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  fromItems: TradeItem[];
  fromGold: number;
  fromYuankuai: number;
  toItems: TradeItem[];
  toGold: number;
  toYuankuai: number;
  status: 'pending' | 'both_confirmed' | 'completed' | 'cancelled';
  fromConfirmed: boolean;
  toConfirmed: boolean;
  timestamp: number;
}

/** Send a trade request */
export async function sendTradeRequest(
  fromUid: string, fromName: string,
  toUid: string, toName: string,
): Promise<string | null> {
  if (!CONFIGURED || !db) return null;
  const r = push(ref(db, 'trades'));
  const offer: TradeOffer = {
    id: r.key!,
    fromUid, fromName,
    toUid, toName,
    fromItems: [], fromGold: 0, fromYuankuai: 0,
    toItems: [], toGold: 0, toYuankuai: 0,
    status: 'pending',
    fromConfirmed: false,
    toConfirmed: false,
    timestamp: Date.now(),
  };
  await set(r, offer);
  return r.key;
}

/** Listen to incoming trade requests for a player */
export function listenTradeRequests(uid: string, cb: (trades: TradeOffer[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = query(ref(db, 'trades'), limitToLast(20));
  onValue(r, snap => {
    const val = snap.val() || {};
    const list: TradeOffer[] = Object.values(val)
      .filter((t: TradeOffer) => (t.toUid === uid || t.fromUid === uid) && t.status !== 'completed' && t.status !== 'cancelled');
    cb(list);
  });
  return () => off(r);
}

/** Update trade offer items/gold */
export async function updateTradeOffer(
  tradeId: string,
  side: 'from' | 'to',
  items: TradeItem[],
  gold: number,
  yuankuai: number,
): Promise<void> {
  if (!CONFIGURED || !db) return;
  const updates: Record<string, any> = {};
  updates[`trades/${tradeId}/${side}Items`] = items;
  updates[`trades/${tradeId}/${side}Gold`] = gold;
  updates[`trades/${tradeId}/${side}Yuankuai`] = yuankuai;
  updates[`trades/${tradeId}/${side}Confirmed`] = false;
  updates[`trades/${tradeId}/status`] = 'pending';
  await update(ref(db), updates);
}

/** Confirm a trade (one side) */
export async function confirmTrade(tradeId: string, side: 'from' | 'to'): Promise<string> {
  if (!CONFIGURED || !db) return 'pending';
  const tradeRef = ref(db, `trades/${tradeId}`);
  const snap = await get(tradeRef);
  if (!snap.exists()) return 'cancelled';
  const trade = snap.val() as TradeOffer;

  if (side === 'from') {
    await set(ref(db, `trades/${tradeId}/fromConfirmed`), true);
    if (trade.toConfirmed) {
      await set(ref(db, `trades/${tradeId}/status`), 'both_confirmed');
      return 'both_confirmed';
    }
  } else {
    await set(ref(db, `trades/${tradeId}/toConfirmed`), true);
    if (trade.fromConfirmed) {
      await set(ref(db, `trades/${tradeId}/status`), 'both_confirmed');
      return 'both_confirmed';
    }
  }
  return 'pending';
}

/** Cancel a trade */
export async function cancelTrade(tradeId: string): Promise<void> {
  if (!CONFIGURED || !db) return;
  await set(ref(db, `trades/${tradeId}/status`), 'cancelled');
}

/** Complete a trade (mark as done) */
export async function completeTrade(tradeId: string): Promise<void> {
  if (!CONFIGURED || !db) return;
  await set(ref(db, `trades/${tradeId}/status`), 'completed');
}

/** Get trade by ID */
export async function getTrade(tradeId: string): Promise<TradeOffer | null> {
  if (!CONFIGURED || !db) return null;
  const snap = await get(ref(db, `trades/${tradeId}`));
  return snap.val() as TradeOffer | null;
}

/* ===== Warehouse System ===== */

export interface WarehouseItem {
  itemId: string;
  count: number;
  storedAt: number;
}

/** Store item in warehouse */
export async function storeWarehouseItem(
  uid: string,
  itemId: string,
  count: number,
): Promise<void> {
  if (!CONFIGURED || !db) return;
  const r = ref(db, `warehouse/${uid}/${itemId}`);
  const snap = await get(r);
  const current = snap.val() as WarehouseItem | null;
  await set(r, {
    itemId,
    count: (current?.count || 0) + count,
    storedAt: Date.now(),
  });
}

/** Withdraw item from warehouse */
export async function withdrawWarehouseItem(
  uid: string,
  itemId: string,
  count: number,
): Promise<boolean> {
  if (!CONFIGURED || !db) return false;
  const r = ref(db, `warehouse/${uid}/${itemId}`);
  const snap = await get(r);
  const current = snap.val() as WarehouseItem | null;
  if (!current || current.count < count) return false;
  const newCount = current.count - count;
  if (newCount <= 0) {
    await remove(r);
  } else {
    await set(r, { ...current, count: newCount });
  }
  return true;
}

/** Listen to warehouse items */
export function listenWarehouse(uid: string, cb: (items: WarehouseItem[]) => void): Unsub {
  if (!CONFIGURED || !db) return () => {};
  const r = ref(db, `warehouse/${uid}`);
  onValue(r, snap => {
    const val = snap.val() || {};
    cb(Object.values(val) as WarehouseItem[]);
  });
  return () => off(r);
}

