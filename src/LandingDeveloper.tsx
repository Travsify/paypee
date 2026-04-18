import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  Webhook, 
  Database,
  ArrowRight,
  Zap
} from 'lucide-react';

const LandingDeveloper = ({ onAuth }: { onAuth: () => void }) => {
  const [devLanguage, setDevLanguage] = useState<'node' | 'python' | 'go'>('node');

  const codeSnippets = {
    node: `// Initialize Paypee SDK
const paypee = new Paypee('sk_live_...');

// Create Virtual Card
await paypee.cards.create({
  currency: "USD",
  amount: 500,
  label: "Business Cloud"
});`,
    python: `# Initialize Paypee SDK
client = Paypee(api_key='sk_live_...')

# Create Virtual Card
client.cards.create(
    currency="USD",
    amount=500,
    label="Business Cloud"
)`,
    go: `// Initialize Paypee SDK
client := paypee.New("sk_live_...")

// Create Virtual Card
client.Cards.Create(paypee.CardParams{
    Currency: "USD",
    Amount:   500,
    Label:    "Business Cloud",
})`
  };

  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero container perspective-3d" style={{ marginBottom: '6rem' }}>
        <div className="info-row" style={{ alignItems: 'center', textAlign: 'left', gap: '2rem' }}>
           <div className="hero-text-content">
              <motion.div 
                className="badge"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}
              >
                <Code2 size={14} style={{ marginRight: '0.5rem' }} /> FOR DEVELOPERS
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'left', fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}
              >
                The API for <br />
                <span style={{ color: '#ec4899' }}>African Finance.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ margin: '0 0 2.5rem 0', fontSize: '1.25rem', maxWidth: '500px', color: 'var(--text-muted)' }}
              >
                Build, test, and ship financial products in days, not months. One unified integration for 50+ local and international banking networks.
              </motion.p>
              <motion.div 
                className="hero-btns"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ justifyContent: 'flex-start' }}
              >
                <button className="btn btn-primary" onClick={onAuth} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', background: '#ec4899', color: '#fff' }}>
                  Get Sandbox Keys <ArrowRight size={20} />
                </button>
                <button className="btn btn-outline" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                  Read the Docs
                </button>
              </motion.div>
           </div>
           
           <div className="hero-visual-content">
              <motion.div className="code-window" initial={{ rotateY: 10, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                 <div className="code-header" style={{ borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       {['node', 'python', 'go'].map((lang) => (
                          <button 
                            key={lang} 
                            style={{ 
                              background: devLanguage === lang ? 'rgba(255,255,255,0.1)' : 'transparent',
                              border: 'none',
                              color: devLanguage === lang ? '#fff' : 'var(--text-muted)',
                              padding: '0.4rem 1rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              textTransform: 'uppercase',
                              fontWeight: 600
                            }}
                            onClick={() => setDevLanguage(lang as any)}
                          >
                             {lang}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div className="code-body" style={{ background: '#0f172a', padding: '2rem' }}>
                    <pre style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', lineHeight: 1.5 }}><code>{codeSnippets[devLanguage]}</code></pre>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Developer Features */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '3rem' }}>Developer-First Engineering</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>We care about latency, uptime, and DX as much as you do.</p>
        </div>
        <div className="grid">
           {[
             { icon: <Terminal />, title: "Unified SDKs", desc: "Native libraries for Node.js, Python, Ruby, PHP, and Go. Stop writing boilerplate REST code." },
             { icon: <Webhook />, title: "Enterprise Webhooks", desc: "99.99% delivery bound. We intelligently retry failed webhooks with exponential backoff." },
             { icon: <Database />, title: "Live Event Logs", desc: "Debug with precision. Your dashboard provides a granular history of every API call and webhook fired." },
             { icon: <Zap />, title: "High-Throughput API", desc: "Built on resilient infrastructure capable of handling 10,000 requests per second gracefully." }
           ].map((item, idx) => (
             <motion.div key={idx} className="card tilt-card" whileHover={{ y: -5 }}>
                <div className="card-icon" style={{ color: '#ec4899' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Interactive API Playground */}
      <section className="section container" style={{ marginTop: '4rem' }}>
         <div className="info-row" style={{ alignItems: 'flex-start' }}>
            <div className="info-content">
               <div className="badge" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>LIVE PLAYGROUND</div>
               <h3>Simulate Your <br /> First Request.</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Experience the power of our unified Paypee API. See the live response from our Sandbox environment.</p>
               <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ color: 'var(--text-muted)' }}>ENDPOINT</div><div style={{ fontWeight: 800 }}>POST /v1/payouts</div></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ color: 'var(--text-muted)' }}>SETTLEMENT</div><div style={{ fontWeight: 800, color: '#ec4899' }}>Instant</div></div>
                  <button className="btn" style={{ width: '100%', background: '#ec4899', color: '#fff' }}>Execute Request</button>
               </div>
            </div>
            <div style={{ flex: 1.5, marginLeft: '4rem' }}>
               <div className="code-window" style={{ border: '1px solid #334155' }}>
                  <div className="code-header" style={{ borderBottom: '1px solid #334155' }}><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>201 CREATED</span></div>
                  <div className="code-body" style={{ background: '#0f172a' }}>
                     <pre style={{ margin: 0, color: '#10b981' }}><code>{`{
  "id": "set_paypee_9823h...",
  "status": "completed",
  "source": "50,000 NGN",
  "target": "34.20 USD",
  "fx_rate": "1462.00",
  "recipient": "acc_093ur48",
  "mode": "test",
  "timestamp": "2026-04-13T10:45:12Z"
}`}</code></pre>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingDeveloper;
