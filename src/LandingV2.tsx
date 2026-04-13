import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Terminal, 
  Lock, 
  Layout, 
  Activity,
  Box,
  ChevronRight,
  Database,
  BarChart4
} from 'lucide-react';

const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { title: "Autonomous Hedging", desc: "Our AI Volatility Shield automatically protects your NGN capital by hedging into USD during market flips.", icon: <Cpu />, color: "#6366f1" },
    { title: "Global Collection", desc: "Local bank accounts in 50+ countries. Receive EUR, GBP, and CNY as a local business.", icon: <Globe />, color: "#10b981" },
    { title: "Smart Vaults", desc: "Institutional-grade custody for digital and fiat assets with automated yield generation.", icon: <Lock />, color: "#f59e0b" },
    { title: "Unified SDK", desc: "Embed payments, cards, and treasury logic with exactly 12 lines of code.", icon: <Terminal />, color: "#ef4444" }
  ];

  return (
    <div style={{ background: '#020617', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero 2.0 */}
      <section style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)', zIndex: 0 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.6rem 1.2rem', borderRadius: '99px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
               <Zap size={14} /> PAYPEE V2.0: THE FINTECH OPERATING SYSTEM
            </div>
            <h1 style={{ fontSize: '5.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '2rem' }}>
              Global Liquidity.<br /> 
              <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Autonomous Banking.</span>
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
               Building the primary infrastructure for cross-border capital flow across Africa and emerging markets.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
               <button onClick={onAuth} style={{ background: '#fff', color: '#020617', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  Start Building <ArrowRight size={20} />
               </button>
               <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #1e293b', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                  API Reference
               </button>
            </div>
          </motion.div>
        </div>

        {/* Global Node Visual */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', height: '400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100% 100% 0 0', zIndex: 0 }} />
      </section>

      {/* Feature Grid - Interactive */}
      <section style={{ padding: '8rem 0' }}>
         <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
               <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Scale Without Boundaries.</h2>
               <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Every tool you need to manage global capital in one unified system.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {features.map((f, i) => (
                     <div 
                        key={i} 
                        onClick={() => setActiveFeature(i)}
                        style={{ 
                           padding: '2rem', 
                           borderRadius: '24px', 
                           background: activeFeature === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                           border: `1px solid ${activeFeature === i ? '#1e293b' : 'transparent'}`,
                           cursor: 'pointer',
                           transition: 'all 0.3s'
                        }}
                     >
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: activeFeature === i ? '#fff' : '#475569' }}>{f.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', display: activeFeature === i ? 'block' : 'none' }}>{f.desc}</p>
                     </div>
                  ))}
               </div>

               <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '40px', padding: '4rem', position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeFeature}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        style={{ fontSize: '8rem', color: features[activeFeature].color, filter: 'drop-shadow(0 0 50px rgba(99, 102, 241, 0.3))' }}
                      >
                         {features[activeFeature].icon}
                      </motion.div>
                   </AnimatePresence>
                   <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontSize: '0.8rem', color: '#475569', fontWeight: 700, letterSpacing: '2px' }}>PRO SYSTEM ACTIVE</div>
               </div>
            </div>
         </div>
      </section>

      {/* Developer Experience Area */}
      <section style={{ padding: '8rem 0', background: 'rgba(255,255,255,0.01)' }}>
         <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center' }}>
               <div>
                  <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem' }}>Built for the <br /> 10x Engineer.</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                      <div>
                         <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>99.99%</div>
                         <div style={{ color: '#64748b' }}>Uptime Reliability</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>120ms</div>
                         <div style={{ color: '#64748b' }}>API Latency (Global)</div>
                      </div>
                  </div>
                  <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem 2.5rem', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}>View API Docs</button>
               </div>
               <div style={{ background: '#000', borderRadius: '32px', border: '1px solid #1e293b', padding: '2rem', fontFamily: 'monospace', color: '#10b981', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ lineHeight: 1.6 }}>
                     <span style={{ color: '#6366f1' }}>import</span> Paypee <span style={{ color: '#6366f1' }}>from</span> <span style={{ color: '#f59e0b' }}>'@paypee/sdk'</span>;<br /><br />
                     <span style={{ color: '#64748b' }}>// Initialize liquidity client</span><br />
                     <span style={{ color: '#6366f1' }}>const</span> paypee = <span style={{ color: '#6366f1' }}>new</span> Paypee(<span style={{ color: '#f59e0b' }}>'sk_live_...'</span>);<br /><br />
                     <span style={{ color: '#64748b' }}>// Provision EUR IBAN instantly</span><br />
                     <span style={{ color: '#6366f1' }}>const</span> account = <span style={{ color: '#6366f1' }}>await</span> paypee.createGlobalAccount(<span style={{ color: '#f59e0b' }}>'EUR'</span>);<br /><br />
                     <span style={{ color: '#64748b' }}>// Enable AI hedging</span><br />
                     <span style={{ color: '#6366f1' }}>await</span> paypee.triggerAutoHedge();
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA 2.0 */}
      <section style={{ padding: '10rem 0', textAlign: 'center' }}>
         <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '3rem' }}>Ready to Scale?</h2>
         <button onClick={onAuth} style={{ background: '#fff', color: '#020617', border: 'none', padding: '1.5rem 4rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 0 50px rgba(255,255,255,0.2)' }}>Get API Keys Now</button>
      </section>
    </div>
  );
};

export default LandingV2;
