const fs = require('fs');
let content = fs.readFileSync('src/store/gameStore.ts', 'utf8');

content = content.replace(/content: `危险等级 \$\{'\?\.repeat\(newRoom\.danger\)\}/g, "content: `危险等级 ${'★'.repeat(newRoom.danger)}");
content = content.replace(/sender: '感知', content: `危险等级 \$\{'\./g, "sender: '感知', content: `危险等级 ${'★'.repeat(");

fs.writeFileSync('src/store/gameStore.ts', content);
console.log('Fixed');
