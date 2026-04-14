const fs = require('fs');

// Fix BusinessDashboard.tsx
let biz = fs.readFileSync('src/BusinessDashboard.tsx', 'utf8');

// 1. Mobile nav plus button
biz = biz.replace(
  `<div onClick={() => setIsAccountModalOpen(true)} style={{ textAlign: 'center', background: 'var(--primary)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>\n              <Plus size={24} color="#fff" />\n           </div>`,
  `<div onClick={() => {
              if (!isVerified) { alert('You must complete Identity Verification before provisioning a treasury account.'); }
              else { setIsAccountModalOpen(true); }
            }} style={{ textAlign: 'center', background: isVerified ? 'var(--primary)' : 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: isVerified ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none' }}>
               {isVerified ? <Plus size={24} color="#fff" /> : <Lock size={24} color="var(--text-muted)" />}
            </div>`
);

// 2. Wallets section - Deploy Treasury Rail
biz = biz.replace(
  /whileHover=\{\{ scale: 1\.02, y: -5 \}\}\s*\n\s*onClick=\{\(\) => setIsAccountModalOpen\(true\)\}\s*\n\s*style=\{\{ border: '2px dashed var\(--border\)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '200px' \}\}/,
  `whileHover={isVerified ? { scale: 1.02, y: -5 } : {}}
                      onClick={() => {
                        if (!isVerified) { alert('You must complete Identity Verification before provisioning a treasury account.'); }
                        else { setIsAccountModalOpen(true); }
                      }}
                      style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: isVerified ? 'pointer' : 'not-allowed', minHeight: '200px', opacity: isVerified ? 1 : 0.5 }}`
);

biz = biz.replace(
  `<Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />\n                      <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Deploy Treasury Rail</span>`,
  `{isVerified ? <Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} /> : <Lock size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />}
                      <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Deploy Treasury Rail</span>
                      {!isVerified && <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600, marginTop: '0.5rem' }}>Verification Required</span>}`
);

// 3. Dashboard section - Add Rail button
biz = biz.replace(
  /whileTap=\{\{ scale: 0\.98 \}\}\s*\n\s*onClick=\{\(\) => setIsAccountModalOpen\(true\)\}\s*\n\s*style=\{\{ width: '100%', padding: '1rem', border: '2px dashed var\(--border\)', background: 'transparent', borderRadius: '20px', color: 'var\(--text-muted\)', fontWeight: 700, cursor: 'pointer' \}\}\s*\n\s*>\+ Add Rail</,
  `whileTap={isVerified ? { scale: 0.98 } : {}}
                         onClick={() => {
                           if (!isVerified) { alert('You must complete Identity Verification before provisioning a treasury account.'); }
                           else { setIsAccountModalOpen(true); }
                         }}
                         style={{ width: '100%', padding: '1rem', border: '2px dashed var(--border)', background: 'transparent', borderRadius: '20px', color: isVerified ? 'var(--text-muted)' : '#64748b', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5 }}
                       >{isVerified ? '+ Add Rail' : '🔒 Verification Required'}`
);

fs.writeFileSync('src/BusinessDashboard.tsx', biz, 'utf8');
console.log('✅ BusinessDashboard.tsx fixed');


// Fix DeveloperDashboard.tsx
let dev = fs.readFileSync('src/DeveloperDashboard.tsx', 'utf8');

// 1. Mobile nav plus button
dev = dev.replace(
  `<div onClick={() => setIsAccountModalOpen(true)} style={{ textAlign: 'center', background: 'var(--primary)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>\n               <Plus size={24} color="#fff" />\n            </div>`,
  `<div onClick={() => {
              if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
              else { setIsAccountModalOpen(true); }
            }} style={{ textAlign: 'center', background: isVerified ? 'var(--primary)' : 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: isVerified ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none' }}>
               {isVerified ? <Plus size={24} color="#fff" /> : <Lock size={24} color="var(--text-muted)" />}
            </div>`
);

// 2. Wallets section - Get New Staging Account
dev = dev.replace(
  /whileHover=\{\{ scale: 1\.02, y: -5 \}\}\s*\n\s*onClick=\{\(\) => setIsAccountModalOpen\(true\)\}\s*\n\s*style=\{\{ border: '2px dashed var\(--border\)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '200px' \}\}/,
  `whileHover={isVerified ? { scale: 1.02, y: -5 } : {}}
                      onClick={() => {
                        if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
                        else { setIsAccountModalOpen(true); }
                      }}
                      style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: isVerified ? 'pointer' : 'not-allowed', minHeight: '200px', opacity: isVerified ? 1 : 0.5 }}`
);

dev = dev.replace(
  `<Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />\n                      <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Get New Staging Account</span>`,
  `{isVerified ? <Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} /> : <Lock size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />}
                      <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Get New Staging Account</span>
                      {!isVerified && <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600, marginTop: '0.5rem' }}>Verification Required</span>}`
);

// 3. Overview section - + NEW RAIL button
dev = dev.replace(
  `<button onClick={() => setIsAccountModalOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>+ NEW RAIL</button>`,
  `<button onClick={() => {
                           if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
                           else { setIsAccountModalOpen(true); }
                         }} style={{ background: 'transparent', border: 'none', color: isVerified ? 'var(--primary)' : '#64748b', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed' }}>{isVerified ? '+ NEW RAIL' : '🔒 VERIFY FIRST'}</button>`
);

fs.writeFileSync('src/DeveloperDashboard.tsx', dev, 'utf8');
console.log('✅ DeveloperDashboard.tsx fixed');
