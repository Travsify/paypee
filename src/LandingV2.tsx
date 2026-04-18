import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Globe,
  Cpu,
  Lock,
  Terminal,
  Activity,
  ArrowUpRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

const Nav = () => (
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
       <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#fff" />
       </div>
       <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>PAYPEE</span>
    </div>
    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
       {['Individuals', 'Businesses', 'Developers'].map(item => (
         <a key={item} href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>{item}</a>
       ))}
       <button style={{ background: '#fff', color: '#020617', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>Launch Console</button>
    </div>
  </nav>
);

const VelocityParticles = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: '-10%', y: Math.random() * 100 + '%', opacity: 0 }}
          animate={{ 
            x: '110%', 
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            ease: 'linear',
            delay: Math.random() * 10 
          }}
          style={{ 
            position: 'absolute', 
            width: Math.random() * 200 + 100 + 'px', 
            height: '1px', 
            background: 'linear-gradient(to right, transparent, rgba(99, 102, 241, 0.3), transparent)',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
};

const WorldClassHero = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#020617', textAlign: 'center', padding: '0 1.5rem' }}>
      
      {/* BACKGROUND VELOCITY */}
      <VelocityParticles />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, #020617 80%)' }} />

      {/* CONTENT STACK */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '99px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '3rem' }}>
             <Activity size={14} /> SYSTEM_STATUS :: VELOCITY_OPTIMIZED
          </div>

          <h1 style={{ fontSize: 'clamp(3.5rem, 10vw, 7.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: '2.5rem' }}>
             Money Moves Like<br />
             <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>a Message.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#64748b', maxWidth: '800px', margin: '0 auto 4.5rem', lineHeight: 1.5, fontWeight: 500 }}>
             The world-class operating system for global capital flow. 
             Engineered for institutional velocity and ultimate transparency.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
             <motion.button 
               onClick={onAuth}
               whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
               whileTap={{ scale: 0.95 }}
               style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '1.4rem 4rem', borderRadius: '18px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
             >
                Get Started
             </motion.button>
             <motion.button 
               whileHover={{ background: 'rgba(255,255,255,0.05)' }}
               style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '1.4rem 4rem', borderRadius: '18px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
             >
                API Reference
             </motion.button>
          </div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', color: '#475569' }}
      >
        <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, #6366f1, transparent)' }} />
      </motion.div>
    </section>
  );
};

const WorldClassFeatureSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    { title: "Global Rails", desc: "Instant local collection in 50+ countries.", icon: <Globe /> },
    { title: "AI Treasury", desc: "Autonomous hedging for multi-currency assets.", icon: <Cpu /> },
    { title: "Smart Vaults", desc: "Institutional custody for digital capital.", icon: <Shield /> }
  ];

  return (
    <section style={{ padding: '10rem 0', background: '#020617' }}>
       <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
             {features.map((f, i) => (
               <motion.div 
                 key={i}
                 onMouseEnter={() => setHoveredIndex(i)}
                 onMouseLeave={() => setHoveredIndex(null)}
                 style={{ 
                   padding: '4rem 3rem', 
                   borderRadius: '40px', 
                   background: 'rgba(255,255,255,0.02)', 
                   border: '1px solid rgba(255,255,255,0.05)',
                   position: 'relative',
                   overflow: 'hidden',
                   cursor: 'pointer'
                 }}
               >
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div 
                        layoutId="hover-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(34, 211, 238, 0.05))', zIndex: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                     <div style={{ color: '#6366f1', marginBottom: '2rem' }}>
                        {React.isValidElement(f.icon) && React.cloneElement(f.icon as React.ReactElement<any>, { size: 48 })}
                     </div>
                     <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{f.title}</h3>
                     <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{f.desc}</p>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem' }}>
                        LEARN MORE <ArrowUpRight size={18} />
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};

const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <div style={{ background: '#020617', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Nav />
      <WorldClassHero onAuth={onAuth} />
      <WorldClassFeatureSection />
      
      {/* GLOBAL TRUST FOOTER */}
      <section style={{ padding: '8rem 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <p style={{ color: '#475569', fontWeight: 700, letterSpacing: '4px', marginBottom: '4rem' }}>POWERING THE FUTURE OF FINANCE</p>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', flexWrap: 'wrap', opacity: 0.5 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>FINCRA</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>BITNOB</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>MAPLERAD</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>PREMBLY</div>
         </div>
      </section>
    </div>
  );
};

export default LandingV2;
