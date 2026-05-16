import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../firebase';

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use':    '该邮箱已注册，请直接登录。',
    'auth/invalid-email':           '邮箱格式不正确。',
    'auth/weak-password':           '密码至少需要6位。',
    'auth/user-not-found':          '账号不存在，请先注册。',
    'auth/wrong-password':          '密码错误，请重试。',
    'auth/invalid-credential':      '账号或密码错误。',
    'auth/too-many-requests':       '登录失败次数过多，请稍后再试。',
    'auth/network-request-failed':  '网络错误，请检查连接。',
  };
  return map[code] || `登录失败（${code}）`;
}

function getErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return 'unknown';
}

export async function register(email: string, password: string): Promise<AuthResult> {
  if (!auth) return { ok: false, error: 'Firebase 未初始化' };
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return { ok: true, user: cred.user };
  } catch (e: unknown) {
    return { ok: false, error: friendlyError(getErrorCode(e)) };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  if (!auth) return { ok: false, error: 'Firebase 未初始化' };
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, user: cred.user };
  } catch (e: unknown) {
    return { ok: false, error: friendlyError(getErrorCode(e)) };
  }
}

export async function logout(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!auth) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
}

// Save character data to DB under /characters/{uid}
export async function saveCharacter(uid: string, data: object): Promise<void> {
  if (!db) return;
  await set(ref(db, `characters/${uid}`), data);
}

// Load character data from DB, returns null if not found
export async function loadCharacter(uid: string): Promise<object | null> {
  if (!db) return null;
  const snap = await get(ref(db, `characters/${uid}`));
  if (!snap.exists()) return null;
  return snap.val();
}
