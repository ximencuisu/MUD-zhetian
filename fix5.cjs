const fs = require('fs');
let content = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const broken = "content: '此区域无法通行 }";
const fixed = "content: '此区域无法通行' }";
content = content.split(broken).join(fixed);

fs.writeFileSync('src/store/gameStore.ts', content);
console.log('Fixed line 493');
