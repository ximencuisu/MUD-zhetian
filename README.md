# WAMUD Clone

一个参考文字 MUD / 放置武侠页游体验的 React + TypeScript 项目。当前版本主打“房间探索 + 命令输入 + 挂机修炼 + 门派/副本/技能/背包”一体化玩法。

## 核心体验

- 文字 MUD 命令栏：支持 `look`、`n/s/e/w`、`go north`、`attack 名字`、`talk 名字`、`use 物品`、`equip 装备`、`auto`、`flee`、`xiulian`、`dazuo`、`stop`、`open 背包` 等指令。
- 鼠标快捷操作：底部面板按钮、窗口按钮、战斗/对话快捷按钮可与命令系统共用同一套逻辑。
- 多地图体系：主世界、门派地图、生成区域/副本均可观察、移动和触发战斗。
- 放置成长：挂机修炼、挂机打坐、离线收益、突破、技能熟练度、苦海异象。
- 角色系统：属性、装备、功法槽位、主动技能、自动施法、门派贡献与俸禄。
- 在线能力：Firebase 配置后可开启登录、存档、世界/房间聊天、在线玩家列表。

## 本地运行

```bash
npm install
npm run dev
```

当前开发地址默认是：

```text
http://127.0.0.1:5173/
```

## 验证

```bash
npm run lint
npm run build
```

`npm run build` 目前会通过；Vite 可能提示主包超过 500 kB，这是体量提醒，不影响运行。后续可以用路由级懒加载或手动 chunk 拆分优化。

## Firebase 配置

复制 `.env.example` 并填写 Firebase Web 配置：

```bash
cp .env.example .env
```

未配置 Firebase 时，项目会自动进入离线模式，仍可创建角色和试玩本地内容。
