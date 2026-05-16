import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import GameLayout from './components/GameLayout';
import CreateCharacterScreen from './components/CreateCharacterScreen';
import './index.css';

export default function App() {
  const s = useGameStore();
  const { screen } = s;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [regPwd2, setRegPwd2] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { setError('请输入昵称'); return; }
    s.login(name);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) { setError('请输入昵称'); return; }
    if (regPwd !== regPwd2) { setError('密码不一致'); return; }
    sessionStorage.setItem('reg_nick', regName);
    s.login(regName);
  };

  // Screen: game
  if (screen === 'game') return <GameLayout />;

  // Screen: create - show character creation
  if (screen === 'create') {
    return <CreateCharacterScreen />;
  }

  // Screen: login
  return (
    <div className="login-content">
      <div className="mypanel">
        <ul>
          {/* Tabs */}
          <li className="panel_item active">
            <span style={{ cursor: 'pointer', marginRight: '16px', opacity: mode === 'login' ? 1 : 0.5 }}
              onClick={() => setMode('login')}>登陆</span>
            <span style={{ cursor: 'pointer', opacity: mode === 'register' ? 1 : 0.5 }}
              onClick={() => setMode('register')}>注册</span>
          </li>

          {mode === 'login' ? (
            <>
              <li className="content">
                <form onSubmit={handleLogin}>
                  <h3>你的昵称</h3>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="输入昵称" className="textbox" />
                  {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" style={{ padding: '6px 24px', border: '1px solid #337ab7', cursor: 'pointer', background: '#337ab7', color: '#fff', fontSize: '13px' }}>登陆</button>
                  </div>
                </form>
              </li>
              <li className="panel_item" onClick={() => setMode('register')}>注册账号</li>
            </>
          ) : (
            <>
              <li className="content">
                <form onSubmit={handleRegister}>
                  <h3>你的昵称</h3>
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="输入昵称" className="textbox" />
                  <h3>设置密码</h3>
                  <input type="password" value={regPwd} onChange={e => setRegPwd(e.target.value)} placeholder="密码" className="textbox" />
                  <h3>重复密码</h3>
                  <input type="password" value={regPwd2} onChange={e => setRegPwd2(e.target.value)} placeholder="重复密码" className="textbox" />
                  {error && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" style={{ padding: '6px 24px', border: '1px solid #337ab7', cursor: 'pointer', background: '#337ab7', color: '#fff', fontSize: '13px' }}>注册</button>
                  </div>
                </form>
              </li>
              <li className="panel_item" onClick={() => setMode('login')}>返回登陆</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
