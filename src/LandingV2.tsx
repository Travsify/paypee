import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Activity,
  Globe,
  Cpu,
  Lock,
  Terminal,
  ShieldCheck,
  TrendingUp,
  CreditCard
} from 'lucide-react';

const HeroSection = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#020617' }}>
      
      {/* 1. ATMOSPHERE & DEPTH */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
         {/* Liquid Light Effect */}
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.5, 0.3]
           }}
           transition={{ duration: 10, repeat: Infinity }}
           style={{ position: 'absolute', top: '10%', left: '20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} 
         />
         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }}>
          
          {/* TEXT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge" style={{ marginBottom: '2.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
               <Zap size={14} style={{ marginRight: '0.5rem' }} /> NODE_01 :: SYSTEM ONLINE
            </div>
            <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '2rem' }}>
              Global Finance.<br /> 
              <span style={{ background: 'linear-gradient(to right, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unified & Instant.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', marginBottom: '4rem', lineHeight: 1.6 }}>
               The primary operating system for cross-border capital flow. 
               Move value at the speed of thought with institutional-grade rails.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
               <button onClick={onAuth} className="btn btn-primary" style={{ padding: '1.2rem 3.5rem', fontSize: '1.1rem', borderRadius: '18px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}>
                  Launch Console <ArrowRight size={20} />
               </button>
               <button className="btn btn-outline" style={{ padding: '1.2rem 3.5rem', fontSize: '1.1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
                  Infrastructure
               </button>
            </div>
          </motion.div>

          {/* VISUAL COCKPIT */}
          <div style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             
             {/* CENTRAL ASSET: THE GLOBE */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
               style={{ position: 'relative', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             >
                <div style={{ width: '90%', height: '90%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.2), transparent)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)' }} />
                <Globe size={180} style={{ position: 'absolute', color: 'rgba(99, 102, 241, 0.1)' }} />
                
                {/* Liquidity Ribbons */}
                {[0, 120, 240].map((deg, i) => (
                  <motion.div 
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', width: '110%', height: '110%', border: '1px solid rgba(34, 211, 238, 0.1)', borderRadius: '50%', transform: `rotateX(70deg) rotateY(${deg}deg)` }}
                  />
                ))}
             </motion.div>

             {/* FLOATING SYSTEM WIDGETS */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
               style={{ position: 'absolute', top: '10%', right: '5%', padding: '1.5rem', borderRadius: '24px', background: 'rgba(10, 15, 30, 0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', zIndex: 20 }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4rem', alignItems: 'center' }}>
                   <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#6366f1', letterSpacing: '2px', marginBottom: '4px' }}>TREASURY</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>$1,284,500.42</div>
                   </div>
                   <TrendingUp size={20} color="#10b981" />
                </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
               style={{ position: 'absolute', bottom: '15%', left: '0%', padding: '1rem 1.5rem', borderRadius: '20px', background: 'rgba(10, 15, 30, 0.8)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', zIndex: 20 }}
             >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                   <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>AI_HEDGE :: ACTIVE_PROT_99.9%</span>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 3, repeat: Infinity, delay: 2 }}
               style={{ position: 'absolute', top: '40%', left: '-10%', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '9px', fontWeight: 800, color: '#6366f1', fontFamily: 'monospace' }}
             >
                INCOMING_SEPA :: EUR 12,000.00
             </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
};

const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { title: "Autonomous Hedging", desc: "Our AI Volatility Shield automatically protects your NGN capital by hedging into USD during market flips.", icon: <Cpu />, color: "#6366f1", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832" },
    { title: "Global Collection", desc: "Local bank accounts in 50+ countries. Receive EUR, GBP, and CNY as a local business.", icon: <Globe />, color: "#10b981", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2944" },
    { title: "Smart Vaults", desc: "Institutional-grade custody for digital and fiat assets with automated yield generation.", icon: <Lock />, color: "#f59e0b", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=2934" },
    { title: "Unified SDK", desc: "Embed payments, cards, and treasury logic with exactly 12 lines of code.", icon: <Terminal />, color: "#ef4444", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2940" }
  ];

  return (
    <div style={{ background: 'var(--background)', color: 'var(--text)', minHeight: '100vh', fontFamily: 'var(--font-inter)' }}>
      
      <HeroSection onAuth={onAuth} />

      {/* REMAINDER OF SECTIONS (Simplified for the prompt) */}
      <section style={{ padding: 'var(--section-spacing) 0' }}>
         <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {features.map((f, i) => (
                      <motion.div 
                         key={i} 
                         onClick={() => setActiveFeature(i)}
                         style={{ padding: '2.5rem', borderRadius: '32px', background: activeFeature === i ? 'rgba(255,255,255,0.03)' : 'transparent', border: `1px solid ${activeFeature === i ? 'rgba(255,255,255,0.1)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.4s' }}
                      >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                            <div style={{ color: activeFeature === i ? f.color : 'var(--text-muted)' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: activeFeature === i ? '#fff' : 'var(--text-muted)' }}>{f.title}</h3>
                         </div>
                         {activeFeature === i && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{f.desc}</p>}
                      </motion.div>
                   ))}
                </div>
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '500px' }}>
                    <img src={features[activeFeature].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ color: features[activeFeature].color, filter: 'drop-shadow(0 0 30px currentColor)' }}>
                          {React.isValidElement(features[activeFeature].icon) && React.cloneElement(features[activeFeature].icon as React.ReactElement<any>, { size: 120 })}
                       </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      <section style={{ padding: 'var(--section-spacing) 0', background: 'rgba(255,255,255,0.01)' }}>
         <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
               <div className="glass-card">
                  <img src="/paypee_mobile_app_mockup_1776504737041.png" alt="" style={{ width: '100%', borderRadius: '24px', marginBottom: '2rem' }} />
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Individuals.</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Freedom for global citizens. USD accounts and instant virtual cards.</p>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Explore</button>
               </div>
               <div className="glass-card">
                  <img src="/paypee_business_dashboard_mockup_1776504980885.png" alt="" style={{ width: '100%', borderRadius: '24px', marginBottom: '2rem' }} />
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Businesses.</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Infrastructure for emerging markets. Scale globally with ease.</p>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Explore</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingV2;
