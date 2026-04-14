const fs = require('fs');
let content = fs.readFileSync('src/BusinessDashboard.tsx', 'utf8');

// Fix the broken closing tag: /motion.button> -> </motion.button>
content = content.replace(
  `'🔒 Verification Required'}/motion.button>`,
  `'🔒 Verification Required'}</motion.button>`
);

fs.writeFileSync('src/BusinessDashboard.tsx', content, 'utf8');
console.log('✅ Fixed broken closing tag');
