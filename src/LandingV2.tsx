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
  BarChart4,
  Smartphone,
  Layers
} from 'lucide-react';

const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { 
      title: "Autonomous Hedging", 
      desc: "Our AI Volatility Shield automatically protects your NGN capital by hedging into USD during market flips.", 
      icon: <Cpu />, 
      color: "#6366f1",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832" 
    },
    { 
      title: "Global Collection", 
      desc: "Local bank accounts in 50+ countries. Receive EUR, GBP, and CNY as a local business.", 
      icon: <Globe />, 
      color: "#10b981",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2944"
    },
    { 
      title: "Smart Vaults", 
      desc: "Institutional-grade custody for digital and fiat assets with automated yield generation.", 
      icon: <Lock />, 
      color: "#f59e0b",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=2934"
    },
    { 
      title: "Unified SDK", 
      desc: "Embed payments, cards, and treasury logic with exactly 12 lines of code.", 
      icon: <Terminal />, 
      color: "#ef4444",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2940"
    }
  ];

  return (
    <div style={{ background: 'var(--background)', color: 'var(--text)', minHeight: '100vh', fontFamily: 'var(--font-inter)' }}>
      
      {/* HERO 3.0: FIXED & TAILORED */}
      <section style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
        {/* Animated Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
           <img 
             src="/fintech_hero_3d_network_1776504546752.png" 
             alt="Global Financial Network" 
             style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, filter: 'blur(4px)' }} 
           />
           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 90%)' }} />
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge" style={{ marginBottom: '2.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
               <Zap size={14} style={{ marginRight: '0.5rem' }} /> THE FINANCIAL OPERATING SYSTEM
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '2rem' }}>
              Global Finance.<br /> 
              <span className="text-gradient">Unified & Instant.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
               Building the primary infrastructure for autonomous capital flow across Africa and emerging markets. 
               Move value at the speed of thought.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
               <button onClick={onAuth} className="btn btn-primary" style={{ padding: '1.2rem 3.5rem', fontSize: '1.1rem', borderRadius: '18px' }}>
                  Start Building <ArrowRight size={20} />
               </button>
               <button className="btn btn-outline" style={{ padding: '1.2rem 3.5rem', fontSize: '1.1rem', borderRadius: '18px' }}>
                  API Reference
               </button>
            </div>
          </motion.div>
        </div>

        {/* Global Node Decorative Visual */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '140vw', height: '140vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, border: '1px solid rgba(255,255,255,0.02)' }} 
        />
      </section>

      {/* SECTION 2: THE CORE STACK (TAILORED) */}
      <section style={{ padding: 'var(--section-spacing) 0' }}>
         <div className="container">
            <div style={{ textAlign: 'left', marginBottom: '6rem', maxWidth: '800px' }}>
               <div className="badge" style={{ marginBottom: '1.5rem' }}>THE ENGINE</div>
               <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '2rem' }}>Engineered for <br/>Unlimited Velocity.</h2>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.6 }}>Every tool you need to manage global capital in one unified system. We handle the complexity of local rails so you can focus on building.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {features.map((f, i) => (
                      <motion.div 
                         key={i} 
                         onClick={() => setActiveFeature(i)}
                         whileHover={{ x: 10 }}
                         style={{ 
                            padding: '2.5rem', 
                            borderRadius: '32px', 
                            background: activeFeature === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                            border: `1px solid ${activeFeature === i ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                         }}
                      >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ color: activeFeature === i ? f.color : 'var(--text-muted)', transition: 'color 0.4s' }}>
                               {React.isValidElement(f.icon) && React.cloneElement(f.icon as React.ReactElement<any>, { size: 28 })}
                            </div>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: activeFeature === i ? '#fff' : 'var(--text-muted)' }}>{f.title}</h3>
                         </div>
                         <AnimatePresence>
                           {activeFeature === i && (
                             <motion.p 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0, overflow: 'hidden' }}
                             >
                               {f.desc}
                             </motion.p>
                           )}
                         </AnimatePresence>
                      </motion.div>
                   ))}
                </div>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                       <motion.div 
                         key={activeFeature}
                         initial={{ opacity: 0, scale: 1.1 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         style={{ position: 'absolute', inset: 0 }}
                       >
                          <img 
                            src={features[activeFeature].image} 
                            alt={features[activeFeature].title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface) 10%, transparent 80%)' }} />
                       </motion.div>
                    </AnimatePresence>
                    
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem' }}>
                       <motion.div
                         key={`icon-${activeFeature}`}
                         initial={{ y: 20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         style={{ color: features[activeFeature].color, filter: `drop-shadow(0 0 30px ${features[activeFeature].color}66)` }}
                       >
                          {React.isValidElement(features[activeFeature].icon) && React.cloneElement(features[activeFeature].icon as React.ReactElement<any>, { size: 120 })}
                       </motion.div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '4px' }}>
                       SYSTEM_NODE :: {features[activeFeature].title.toUpperCase().replace(' ', '_')}
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* SECTION 3: AUDIENCE TAILORING (FIXED IMAGES) */}
      <section style={{ padding: 'var(--section-spacing) 0', background: 'rgba(255,255,255,0.01)' }}>
         <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
               
               {/* INDIVIDUALS */}
               <motion.div className="glass-card" whileHover={{ y: -10 }}>
                  <div style={{ height: '300px', borderRadius: '24px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                     <img 
                       src="/paypee_mobile_app_mockup_1776504737041.png" 
                       alt="Paypee for Individuals" 
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                     />
                  </div>
                  <div className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>FOR INDIVIDUALS</div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Freedom for <br/>Global Citizens.</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Move your money as fast as you think. No borders, no delays. USD accounts and instant virtual cards.</p>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Explore Personal <ArrowRight size={18} /></button>
               </motion.div>

               {/* BUSINESSES */}
               <motion.div className="glass-card" whileHover={{ y: -10 }}>
                  <div style={{ height: '300px', borderRadius: '24px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                     <img 
                       src="/paypee_business_dashboard_mockup_1776504980885.png" 
                       alt="Paypee for Businesses" 
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                     />
                  </div>
                  <div className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>FOR BUSINESSES</div>
                  <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Infrastructure for <br/>Emerging Markets.</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Scale your operations globally with unified settlements, treasury automation, and local collections.</p>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Explore Enterprise <ArrowRight size={18} /></button>
               </motion.div>

            </div>
         </div>
      </section>

      {/* SECTION 4: DEVELOPER EXPERIENCE (POLISHED) */}
      <section style={{ padding: 'var(--section-spacing) 0' }}>
         <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'center' }}>
               <div>
                  <div className="badge" style={{ marginBottom: '1.5rem' }}>DEVELOPER FIRST</div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '2rem' }}>Built for the <br /> 10x Engineer.</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                     Our API is the bridge to the future. Integrate global banking, crypto liquidity, and identity verification in minutes.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
                      <div>
                         <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary)' }}>99.99%</div>
                         <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Uptime Reliability</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent)' }}>120ms</div>
                         <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Latency</div>
                      </div>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>View API Documentation</button>
               </div>
               
               <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-20px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }} />
                  <div style={{ background: '#000', borderRadius: '32px', border: '1px solid var(--border)', padding: '2.5rem', fontFamily: 'monospace', color: '#10b981', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)', position: 'relative', zIndex: 1 }}>
                     <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                     </div>
                     <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
                        <span style={{ color: '#6366f1' }}>import</span> Paypee <span style={{ color: '#6366f1' }}>from</span> <span style={{ color: '#f59e0b' }}>'@paypee/sdk'</span>;<br /><br />
                        <span style={{ color: '#64748b' }}>// Initialize liquidity node</span><br />
                        <span style={{ color: '#6366f1' }}>const</span> paypee = <span style={{ color: '#6366f1' }}>new</span> Paypee(<span style={{ color: '#f59e0b' }}>'sk_live_...'</span>);<br /><br />
                        <span style={{ color: '#64748b' }}>// Provision multi-currency IBAN</span><br />
                        <span style={{ color: '#6366f1' }}>const</span> account = <span style={{ color: '#6366f1' }}>await</span> paypee.createGlobalAccount(<span style={{ color: '#f59e0b' }}>'EUR'</span>);<br /><br />
                        <span style={{ color: '#64748b' }}>// Trigger AI capital shield</span><br />
                        <span style={{ color: '#6366f1' }}>await</span> paypee.triggerAutoHedge();
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA 3.0: FINAL CONVERSION (TAILORED) */}
      <section style={{ padding: 'var(--section-spacing) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', zIndex: 0 }} />
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, marginBottom: '3rem' }}>The Future is <br/><span className="text-gradient">Borderless.</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>Join the thousands of innovators building the next generation of global finance.</p>
            <button onClick={onAuth} className="btn btn-primary" style={{ padding: '1.5rem 5rem', borderRadius: '24px', fontSize: '1.4rem', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}>
               Get Started Now
            </button>
         </div>
      </section>
    </div>
  );
};

export default LandingV2;
