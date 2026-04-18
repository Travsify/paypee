
const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '[') bracketCount++;
        if (char === ']') bracketCount--;
    }
    if (braceCount < 0 || parenCount < 0 || bracketCount < 0) {
        console.log(`Potential early closure at line ${i + 1}: brace=${braceCount}, paren=${parenCount}, bracket=${bracketCount}`);
        // Reset to prevent cascade if it was a false positive, but usually this is the bug
    }
}

console.log(`Final counts: brace=${braceCount}, paren=${parenCount}, bracket=${bracketCount}`);
