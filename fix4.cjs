const fs = require('fs');
let content = fs.readFileSync('src/store/gameStore.ts', 'utf8');

content = content.replace(/此区域无法通行\?/g, '此区域无法通行');
content = content.replace(/此方向无法通行\?/g, '此方向无法通行');
content = content.replace(/此方向无路可走\?/g, '此方向无路可走');
content = content.replace(/继续前进，去迎接真正的考验吧\?/g, '继续前进，去迎接真正的考验吧');
content = content.replace(/危险等级 \$\{'\?\.repeat/g, "危险等级 ${'★'.repeat");

fs.writeFileSync('src/store/gameStore.ts', content);
console.log('Fixed all strings');
