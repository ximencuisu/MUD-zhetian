import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { QUESTS } from '../../data/quests';
import './Panel.css';

type QuestTab = 'active' | 'available' | 'all';
type CategoryFilter = 'all' | 'main' | 'side' | 'daily' | 'sect' | 'event';

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  main: { label: '主线', color: '#ffd700' },
  side: { label: '支线', color: '#88ccff' },
  daily: { label: '日常', color: '#55dd88' },
  sect: { label: '师门', color: '#ff8800' },
  event: { label: '活动', color: '#ff4444' },
};

interface QuestDisplay {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'active' | 'completed';
  objectives: { description: string; current: number; required: number; completed: boolean }[];
  rewards: { exp: number; gold: number; items?: string[] };
  type?: string;
  levelRequirement: number;
  prerequisite?: string[];
}

export default function TasksPanel() {
  const questIds = useGameStore(s => s.quests);
  const acceptQuest = useGameStore(s => s.acceptQuest);
  const abandonQuest = useGameStore(s => s.abandonQuest);

  const allDefs = Object.values(QUESTS);
  const activeIds = new Set(questIds as string[]);

  const allQuests: QuestDisplay[] = allDefs.map(def => {
    const isActive = activeIds.has(def.id);
    const allCompleted = def.objectives.every(obj => (obj.current || 0) >= (obj.required || 1));
    const status = allCompleted && isActive ? 'completed' : isActive ? 'active' : 'available';
    return {
      id: def.id,
      name: def.title,
      description: def.description,
      status,
      objectives: def.objectives.map(obj => ({
        description: obj.description,
        current: obj.current ?? 0,
        required: obj.required ?? 1,
        completed: (obj.current || 0) >= (obj.required || 1),
      })),
      rewards: {
        exp: def.rewards.exp,
        gold: def.rewards.gold,
        items: def.rewards.items,
      },
      type: def.questType,
      levelRequirement: def.levelRequirement,
      prerequisite: def.prerequisite,
    };
  });

  const [activeTab, setActiveTab] = useState<QuestTab>('active');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const active = allQuests.filter(q => q.status === 'active');
  const available = allQuests.filter(q => q.status === 'available');

  const filterByCategory = (questList: QuestDisplay[]) => {
    if (categoryFilter === 'all') return questList;
    return questList.filter(q => q.type === categoryFilter);
  };

  const currentQuests = activeTab === 'active' ? filterByCategory(active)
    : activeTab === 'available' ? filterByCategory(available)
    : filterByCategory(allQuests);

  const getQuestTypeInfo = (type?: string) => TYPE_BADGE[type || 'side'] || { label: type || '任务', color: '#888' };

  const renderQuest = (quest: QuestDisplay) => {
    const typeInfo = getQuestTypeInfo(quest.type);
    const totalObjs = quest.objectives.length;
    const doneObjs = quest.objectives.filter(o => o.completed).length;
    const progressPercent = totalObjs > 0 ? Math.round((doneObjs / totalObjs) * 100) : 0;

    return (
      <div key={quest.id} className="quest-card" style={{
        opacity: quest.status === 'completed' ? 0.6 : 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', gap: '8px', flexWrap: 'wrap' }}>
          <span className="quest-name">{quest.name}</span>
          <span
            className="quest-type-badge"
            style={{
              backgroundColor: `${typeInfo.color}22`,
              borderColor: typeInfo.color,
              color: typeInfo.color,
            }}
          >
            {typeInfo.label}
          </span>
          {quest.status === 'active' && (
            <span style={{ fontSize: '10px', color: '#55dd88' }}>
              {progressPercent}%
            </span>
          )}
          {quest.status === 'completed' && (
            <span style={{ fontSize: '10px', color: '#ffd700' }}>✓ 已完成</span>
          )}
        </div>
        <div className="quest-desc">{quest.description}</div>

        {quest.objectives.map((obj, i) => (
          <div key={i} className={`quest-obj ${obj.completed ? 'done' : ''}`}>
            {obj.completed ? '✓' : '○'} {obj.description}
            <span style={{ color: obj.completed ? '#55dd88' : '#cc9933' }}>
              {` (${obj.current}/${obj.required})`}
            </span>
            {!obj.completed && (
              <span style={{
                display: 'inline-block',
                width: `${Math.min(100, (obj.current / obj.required) * 100)}%`,
                maxWidth: '80px',
                height: '3px',
                backgroundColor: '#55dd88',
                borderRadius: '2px',
                marginLeft: '4px',
                verticalAlign: 'middle',
                opacity: 0.5,
              }} />
            )}
          </div>
        ))}

        <div className="quest-reward">
          <span style={{ color: '#aa8833' }}>奖励：</span>
          <span style={{ color: '#55dd88' }}>{quest.rewards.exp}修为</span>
          <span style={{ color: '#ffcc00' }}> / {quest.rewards.gold}金叶</span>
          {quest.rewards.items && quest.rewards.items.length > 0 && (
            <span style={{ color: '#88ccff' }}> / 物品×{quest.rewards.items.length}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          {quest.status === 'available' && (
            <button
              onClick={() => acceptQuest(quest.id)}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                backgroundColor: '#2a4a2a',
                border: '1px solid #55dd8855',
                color: '#55dd88',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              接取任务
            </button>
          )}
          {quest.status === 'active' && (
            <button
              onClick={() => abandonQuest(quest.id)}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                backgroundColor: '#3a2a2a',
                border: '1px solid #dd555555',
                color: '#dd5555',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              放弃任务
            </button>
          )}
          {quest.status === 'completed' && (
            <span style={{ fontSize: '11px', color: '#aa8833' }}>
              等待自动提交中...
            </span>
          )}
        </div>
      </div>
    );
  };

  const tabs: { key: QuestTab; label: string; count: number }[] = [
    { key: 'active', label: '进行中', count: active.length },
    { key: 'available', label: '可接取', count: available.length },
    { key: 'all', label: '全部', count: allQuests.length },
  ];

  const categories: { key: CategoryFilter; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📋' },
    { key: 'main', label: '主线', icon: '📜' },
    { key: 'side', label: '支线', icon: '📄' },
    { key: 'daily', label: '日常', icon: '📅' },
    { key: 'sect', label: '师门', icon: '⚔️' },
    { key: 'event', label: '活动', icon: '🎭' },
  ];

  return (
    <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="quest-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`quest-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && <span className="quest-tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="quest-category-filter">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`quest-cat-btn ${categoryFilter === cat.key ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat.key)}
            style={categoryFilter === cat.key ? {
              borderColor: '#ffcc00',
              color: '#ffcc00',
            } : {}}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="quest-list" style={{ flex: 1, overflowY: 'auto' }}>
        {currentQuests.length > 0 ? (
          currentQuests.map(renderQuest)
        ) : (
          <div style={{ color: '#554422', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.3 }}>📜</div>
            <div>暂无{activeTab === 'active' ? '进行中' : activeTab === 'available' ? '可接取' : ''}的任务</div>
            {activeTab === 'available' && (
              <div style={{ fontSize: '11px', marginTop: '8px', color: '#665533' }}>
                继续探索世界，解锁更多任务
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quest-summary" style={{
        borderTop: '1px solid rgba(160,100,0,0.3)',
        paddingTop: '8px',
        fontSize: '11px',
        color: '#665533',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        <span>进行中: <span style={{ color: '#ffd700' }}>{active.length}</span></span>
        <span>可接: <span style={{ color: '#55dd88' }}>{available.length}</span></span>
        <span>总数: <span style={{ color: '#88ccff' }}>{allQuests.length}</span></span>
      </div>
    </div>
  );
}