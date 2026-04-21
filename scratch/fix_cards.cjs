
const fs = require('fs');
const path = 'c:\\Users\\USER\\Desktop\\Paypee\\src\\CardsDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split(/\r?\n/);

// Fix Line 191 (0-indexed 190)
if (lines[190].includes('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);')) {
    lines[190] = lines[190].replace('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);', 'if (res.ok) {');
}

// Fix Line 223 (0-indexed 222)
if (lines[222].includes('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);')) {
    lines[222] = lines[222].replace('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);', 'if (res.ok) {');
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Fixed lines 191 and 223');
