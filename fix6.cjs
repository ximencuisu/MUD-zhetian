const fs = require('fs');
let content = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const fixes = [
  ["无法攻击该目标?}", "无法攻击该目标'}"],
  ["此区域无法通行 }", "此区域无法通行' }"],
  ["此方向无法通行 }", "此方向无法通行' }"],
  ["此方向无路可走 }", "此方向无路可走' }"],
  ["此区域无法通行?}", "无法攻击该目标'},"],
];

for (const [broken, fixed] of fixes) {
  content = content.split(broken).join(fixed);
}

fs.writeFileSync('src/store/gameStore.ts', content);
console.log('Fixed all strings');
