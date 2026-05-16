import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { register, login } from '../services/authService';
import './LoginScreen.css';

const ASCII_LOGO = `
██████╗  █████╗ ███╗   ██╗███████╗██╗    ███████╗██╗  ██╗███████╗████████╗██╗ █████╗ ███╗  ██╗
██╔══██╗██╔══██╗████╗  ██║╚════██║╚═╝    ╚════██║██║  ██║██╔════╝╚══██╔══╝██║██╔══██╗████╗ ██║
██████╔╝███████║██╔██╗ ██║    ██╔╝        █████╔╝███████║█████╗     ██║   ██║███████║██╔██╗██║
██╔══██╗██╔══██║██║╚██╗██║   ██╔╝        ██╔═══╝ ██╔══██║██╔══╝     ██║   ██║██╔══██║██║╚████║
██████╔╝██║  ██║██║ ╚████║   ██║         ███████╗██║  ██║███████╗   ██║   ██║██║  ██║██║ ╚███║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝         ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝
`;

type Mode = 'login' | 'register';

interface Props {
  offline?: boolean;
}

export default function LoginScreen({ offline }: Props) {
  const screen = useGameStore(s => s.screen);
  const loginWithUser = useGameStore(s => s.loginWithUser);
  const loginAsGuest = useGameStore(s => s.loginAsGuest);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (screen !== 'login') return null;

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码。');
      return;
    }
    if (mode === 'register') {
      if (password !== confirmPw) {
        setError('两次密码不一致。');
        return;
      }
      if (password.length < 6) {
        setError('密码至少需要6位。');
        return;
      }
    }
    setLoading(true);
    const result = mode === 'register'
      ? await register(email.trim(), password)
      : await login(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Pass uid + email to store; store will load character from DB
    await loginWithUser(result.user.uid, result.user.email || email);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-screen">
      <div className="login-scanlines" />
      <div className="login-box">
        <pre className="login-logo">{ASCII_LOGO}</pre>
        <p className="login-subtitle">— 遮天文字修炼世界 · MUD · 东荒篇 —</p>
        {offline && (
          <p style={{ color: '#ff8800', fontSize: '12px', marginBottom: '8px' }}>
            ⚠ Firebase 连接超时，已切换至离线模式。游客模式可正常游戏，但进度不会保存。
          </p>
        )}
        <p className="login-lore">
          "天地不仁，以万物为刍狗。"<br />
          东荒广袤，强者为尊。<br />
          踏入苦海，开辟命泉，搭建神桥，直抵彼岸——<br />
          弹指间，遮蔽天地！
        </p>

        {/* Mode tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >登录账号</button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >注册新账号</button>
        </div>

        <div className="login-form">
          <div className="login-field">
            <label className="login-label">邮箱</label>
            <input
              className="login-input"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label className="login-label">密码</label>
            <input
              className="login-input"
              type="password"
              placeholder="至少6位"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </div>
          {mode === 'register' && (
            <div className="login-field">
              <label className="login-label">确认密码</label>
              <input
                className="login-input"
                type="password"
                placeholder="再次输入密码"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '处理中…' : mode === 'register' ? '注册并进入东荒' : '登录进入东荒'}
          </button>

          <button
            className="login-btn"
            style={{ marginTop: '10px', borderColor: '#554422', color: '#886622' }}
            onClick={loginAsGuest}
          >
            游客模式进入（不保存进度）
          </button>
        </div>

        <p className="login-footer">v0.4 · 弹指遮天 · 东荒修炼世界</p>
      </div>
    </div>
  );
}
