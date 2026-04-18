
const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const tags = [
    { open: '<section', close: '</section' },
    { open: '<div', close: '</div' },
    { open: '<main', close: '</main' },
    { open: '<AnimatePresence', close: '</AnimatePresence' }
];

let lines = content.split('\n');

tags.forEach(tag => {
    let depth = 0;
    console.log(`Checking tag: ${tag.open}`);
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let opens = (line.match(new RegExp(tag.open, 'g')) || []).length;
        let closes = (line.match(new RegExp(tag.close, 'g')) || []).length;
        depth += opens;
        depth -= closes;
        if (depth < 0) {
            console.log(`  Negative depth at line ${i + 1}: ${depth}`);
            // depth = 0; // Don't reset to see true balance
        }
    }
    console.log(`  Final depth: ${depth}`);
});
