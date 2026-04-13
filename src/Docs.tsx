import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Globe, 
  Lock,
  ChevronRight
} from 'lucide-react';

const Docs = ({ onBack }: { onBack: () => void }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* Docs Header */}
      <nav style={{ padding: '1.5rem 4rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div onClick={onBack} style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Cpu size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>PAYPEE <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>DOCS</span></span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Back to Landing</button>
          <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>API Reference</button>
        </div>
      </nav>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{ width: '300px', padding: '3rem 2rem', position: 'sticky', top: '80px', height: 'calc(100vh - 80px)', borderRight: '1px solid #1e293b', overflowY: 'auto' }}>
          <DocLink active title="Introduction" />
          <DocLink title="Authentication" />
          <DocLink title="Wallets & Balances" />
          <DocLink title="Virtual Cards API" />
          <DocLink title="Identity Verification" />
          <DocLink title="Webhooks" />
          <DocLink title="Error Codes" />
          <div style={{ marginTop: '3rem' }}>
             <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>SDK LIBRARIES</p>
             <DocLink title="Node.js SDK" isNew />
             <DocLink title="Python SDK" />
             <DocLink title="React Component" />
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '4rem 6rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Welcome to Paypee API</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, marginBottom: '4rem', maxWidth: '800px' }}>
              The Paypee API is organized around REST. Our API has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
            </p>

            <section style={{ marginBottom: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}><Lock size={20} /></div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Authentication</h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Authenticate your account by including your secret key in API requests. You can manage your API keys in the Paypee Dashboard.</p>
              
              <div style={codeBlockStyle}>
                <div style={codeHeaderStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <div style={{ width: 12, height: 12, borderRadius: '6px', background: '#ff5f56' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '6px', background: '#ffbd2e' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '6px', background: '#27c93f' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>CURL</span>
                </div>
                <pre style={preStyle}>
{`curl https://api.paypee.com/v1/wallets \\
  -u sk_live_51M...: \\
  -d currency=USD`}
                </pre>
              </div>
            </section>

            <section style={{ marginBottom: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}><Globe size={20} /></div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Core Concepts</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                <ConceptCard 
                  title="Webhooks" 
                  desc="Receive real-time notifications for payment events, verification updates, and card activity." 
                  icon={<Terminal size={24} />}
                />
                <ConceptCard 
                  title="Idempotency" 
                  desc="Safely retry requests without accidentally performing the same operation twice." 
                  icon={<ShieldCheck size={24} />}
                />
              </div>
            </section>

            <section>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Next Steps</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  {['Create a Wallet', 'Issue a Card', 'Mock Verification'].map((step) => (
                    <div key={step} style={stepCardStyle}>
                      <span style={{ fontWeight: 600 }}>{step}</span>
                      <ChevronRight size={18} color="var(--primary)" />
                    </div>
                  ))}
               </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const DocLink = ({ title, active = false, isNew = false }: { title: string, active?: boolean, isNew?: boolean }) => (
  <div style={{ 
    padding: '0.75rem 1rem', 
    borderRadius: '12px', 
    background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    color: active ? 'var(--primary)' : '#64748b',
    fontWeight: active ? 700 : 500,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    marginBottom: '0.25rem'
  }}>
    {title}
    {isNew && <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: '#ec4899', color: '#fff', borderRadius: '4px', fontWeight: 800 }}>NEW</span>}
  </div>
);

const ConceptCard = ({ title, desc, icon }: { title: string, desc: string, icon: any }) => (
  <div style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b' }}>
    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{title}</h3>
    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const codeBlockStyle: React.CSSProperties = { background: '#0a0f1e', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' };
const codeHeaderStyle: React.CSSProperties = { padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const preStyle: React.CSSProperties = { padding: '2rem', margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.7', fontFamily: 'monospace' };
const stepCardStyle: React.CSSProperties = { padding: '1.5rem', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' };

export default Docs;
