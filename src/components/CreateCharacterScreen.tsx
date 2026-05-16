import { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import './LoginScreen.css';
import './CreateCharacterScreen.css';

interface RolledAttrs {
  shenli: number;  // 神力
  gengu: number;   // 根骨
  sudu: number;    // 速度
  ganzhi: number;  // 感知
  mianrong: number; // 面容
  qiyun: number;   // 气运
}

function rollAttr(): number {
  return Math.floor(Math.random() * 8) + 12;
}

function rollAll(): RolledAttrs {
  return {
    shenli: rollAttr(),
    gengu: rollAttr(),
    sudu: rollAttr(),
    ganzhi: rollAttr(),
    mianrong: rollAttr(),
    qiyun: rollAttr(),
  };
}

const ATTR_LABELS: [keyof RolledAttrs, string, string][] = [
  ['shenli',  '神力', '影响攻击力与肉身强度'],
  ['gengu',   '根骨', '影响气血上限与防御'],
  ['sudu',    '速度', '影响命中、闪避与攻速'],
  ['ganzhi',  '感知', '影响内力上限与暴击'],
  ['mianrong','面容', '影响社交与NPC好感'],
  ['qiyun',   '气运', '影响暴击率与掉落运气'],
];

function qualityColor(v: number): string {
  if (v >= 19) return '#ff9900';
  if (v >= 17) return '#cc66ff';
  if (v >= 15) return '#4488ff';
  if (v >= 13) return '#00cc66';
  return '#888888';
}

function qualityLabel(v: number): string {
  if (v >= 19) return '天赋异禀';
  if (v >= 17) return '上等';
  if (v >= 15) return '良好';
  if (v >= 13) return '普通';
  return '偏弱';
}

const PHYSIQUE_OPTIONS = [
  { id: 'mortal',    label: '凡人之躯',   desc: '起点低，可通过机遇觉醒',   color: '#888' },
  { id: 'warrior',   label: '武者体质',   desc: '神力+2，攻击略高',         color: '#00cc66' },
  { id: 'dao',       label: '道体',       desc: '感知+2，技能效果更强',     color: '#4488ff' },
  { id: 'dragon',    label: '龙血体质',   desc: '根骨+2，气血异常充沛',     color: '#cc66ff' },
];

export default function CreateCharacterScreen() {
  const screen = useGameStore(s => s.screen);
  const createCharacter = useGameStore(s => s.createCharacter);

  const [charName, setCharName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [attrs, setAttrs] = useState<RolledAttrs>(rollAll);
  const [physique, setPhysique] = useState('mortal');
  const [rerollCount, setRerollCount] = useState(0);
  const [nameError, setNameError] = useState('');

  const handleReroll = useCallback(() => {
    setAttrs(rollAll());
    setRerollCount(c => c + 1);
  }, []);

  const handleCreate = () => {
    const name = charName.trim();
    if (!name) { setNameError('请输入道号'); return; }
    if (name.length < 2) { setNameError('道号至少2个字'); return; }
    if (name.length > 12) { setNameError('道号最多12个字'); return; }
    setNameError('');
    createCharacter(name, gender, physique);
  };

  if (screen !== 'create') return null;

  const total = Object.values(attrs).reduce((a, b) => a + b, 0);

  return (
    <div className="login-screen">
      <div className="login-scanlines" />
      <div className="login-box create-box-v2">
        <h2 className="create-title-v2">◈ 踏入东荒 · 塑造修炼者 ◈</h2>

        {/* Name + Gender row */}
        <div className="ccs-top-row">
          <div className="ccs-field">
            <label className="ccs-label">道号</label>
            <input
              className="login-input ccs-name-input"
              placeholder="2~12字"
              value={charName}
              onChange={e => setCharName(e.target.value)}
              maxLength={12}
            />
            {nameError && <span className="ccs-name-error">{nameError}</span>}
          </div>
          <div className="ccs-field">
            <label className="ccs-label">性别</label>
            <div className="gender-choice">
              <button
                className={`gender-btn ${gender === 'male' ? 'selected' : ''}`}
                onClick={() => setGender('male')}
              >男</button>
              <button
                className={`gender-btn ${gender === 'female' ? 'selected' : ''}`}
                onClick={() => setGender('female')}
              >女</button>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="ccs-section-title">先天属性
          <span className="ccs-total" style={{ color: total >= 90 ? '#ff9900' : total >= 84 ? '#cc66ff' : '#666' }}>
            合计 {total}
          </span>
          <button className="ccs-reroll-btn" onClick={handleReroll}>
            重新天赋（已投 {rerollCount + 1} 次）
          </button>
        </div>
        <div className="ccs-attrs">
          {ATTR_LABELS.map(([key, label, tip]) => {
            const v = attrs[key];
            return (
              <div key={key} className="ccs-attr-row" title={tip}>
                <span className="ccs-attr-name">{label}</span>
                <div className="ccs-attr-bar-wrap">
                  <div
                    className="ccs-attr-bar"
                    style={{
                      width: `${((v - 12) / 7) * 100}%`,
                      background: qualityColor(v),
                    }}
                  />
                </div>
                <span className="ccs-attr-val" style={{ color: qualityColor(v) }}>{v}</span>
                <span className="ccs-attr-quality" style={{ color: qualityColor(v) }}>{qualityLabel(v)}</span>
              </div>
            );
          })}
        </div>

        {/* Physique */}
        <div className="ccs-section-title">体质选择</div>
        <div className="ccs-physiques">
          {PHYSIQUE_OPTIONS.map(p => (
            <button
              key={p.id}
              className={`ccs-physique-btn ${physique === p.id ? 'selected' : ''}`}
              style={physique === p.id ? { borderColor: p.color, color: p.color } : {}}
              onClick={() => setPhysique(p.id)}
            >
              <span className="cpp-label">{p.label}</span>
              <span className="cpp-desc">{p.desc}</span>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="ccs-info">
          ★ 初始境界：轮海·苦海·初期 &nbsp;|&nbsp; 起始地：东荒南域旷野
        </div>

        <button className="login-btn ccs-confirm-btn" onClick={handleCreate}>
          踏入东荒，开启修炼
        </button>
      </div>
    </div>
  );
}
