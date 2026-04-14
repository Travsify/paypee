const fs = require('fs');
let content = fs.readFileSync('src/DeveloperDashboard.tsx', 'utf8');

// Find and replace the unguarded mobile nav Plus button (line 246)
// Use regex to match across the exact line
content = content.replace(
  /(<div onClick=\{)(\(\) => setIsAccountModalOpen\(true\))(\} style=\{\{ textAlign: 'center', background: 'var\(--primary\)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: '0 4px 15px rgba\(99, 102, 241, 0\.4\)' \}\}>)\s*\n(\s*)<Plus size=\{24\} color="#fff" \/>/,
  `$1() => {
              if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
              else { setIsAccountModalOpen(true); }
            }$3
$4{isVerified ? <Plus size={24} color="#fff" /> : <Lock size={24} color="var(--text-muted)" />}`
);

fs.writeFileSync('src/DeveloperDashboard.tsx', content, 'utf8');

// Verify no bare unguarded calls remain
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('setIsAccountModalOpen(true)') && !line.trim().startsWith('//')) {
    const ctx = lines.slice(Math.max(0,i-2), i+1).join(' ');
    if (!ctx.includes('isVerified') && !ctx.includes('else')) {
      console.warn(`⚠️  Possibly unguarded at line ${i+1}: ${line.trim()}`);
    }
  }
});

console.log('✅ DeveloperDashboard mobile nav fixed');
