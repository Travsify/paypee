import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Globe,
  Cpu,
  Shield,
  Activity
} from 'lucide-react';

const Nav = () => (
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
       <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#fff" />
       </div>
       <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>PAYPEE</span>
    </div>
    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
       {['Platform', 'Solutions', 'Developers'].map(item => (
         <a key={item} href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>{item}</a>
       ))}
       <button style={{ background: '#fff', color: '#020617', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>Get API Keys</button>
    </div>
  </nav>
);

const WorldClassHero = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#020617', padding: '0 1.5rem', paddingTop: '5rem' }}>
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '99px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#6366f1', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '2.5rem' }}>
               <Activity size={14} /> THE FINANCIAL OS
            </div>

            <h1 style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '2rem', color: '#fff' }}>
               Money Moves Like<br />
               <span style={{ background: 'linear-gradient(to right, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>a Message.</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}>
               The world-class operating system for global capital flow. 
               Engineered for institutional velocity, ultimate transparency, and AI-driven growth.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
               <motion.button 
                 onClick={onAuth}
                 whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
                 whileTap={{ scale: 0.95 }}
                 style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
               >
                  Start Building
               </motion.button>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
             <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
             <motion.img 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
               src="/fintech_hero_3d_network_1776504546752.png" 
               alt="Financial Network" 
               style={{ width: '100%', maxWidth: '600px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }}
             />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AnimatedSection = ({ title, desc, icon, image, reverse, color }: any) => {
  return (
    <section style={{ padding: '8rem 0', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
          
          {/* TEXT BLOCK */}
          <motion.div 
             initial={{ opacity: 0, x: reverse ? 50 : -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             style={{ order: reverse ? 2 : 1 }}
          >
             <div style={{ width: 64, height: 64, borderRadius: '16px', background: `rgba(${color}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: `1px solid rgba(${color}, 0.2)` }}>
                {React.cloneElement(icon, { size: 32, color: `rgb(${color})` })}
             </div>
             <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>{title}</h2>
             <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
          </motion.div>

          {/* ANIMATED IMAGE BLOCK */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             style={{ order: reverse ? 1 : 2, position: 'relative' }}
          >
             <div style={{ position: 'absolute', inset: '-20%', background: `radial-gradient(circle, rgba(${color}, 0.15) 0%, transparent 60%)`, filter: 'blur(50px)', zIndex: 0 }} />
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
               style={{ position: 'relative', zIndex: 1, borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${color}, 0.2)` }}
             >
                <img src={image} alt={title} style={{ width: '100%', display: 'block', opacity: 0.9 }} />
             </motion.div>
          </motion.div>

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
      
      <AnimatedSection 
        title="Scale Without Boundaries." 
        desc="Local bank accounts in 50+ countries. Receive EUR, GBP, and CNY as a local business. Our global rails strip away borders, allowing your capital to flow seamlessly."
        icon={<Globe />}
        image="/paypee_business_dashboard_mockup_1776504980885.png"
        color="99, 102, 241"
        reverse={false}
      />

      <AnimatedSection 
        title="Your Personal Vault." 
        desc="Freedom for global citizens. Hold USD and NGN balances in a beautifully designed interface. Swap instantly and spend globally with virtual cards."
        icon={<Shield />}
        image="/paypee_mobile_app_mockup_1776504737041.png"
        color="34, 211, 238"
        reverse={true}
      />

      {/* GLOBAL TRUST FOOTER */}
      <section style={{ padding: '6rem 0', textAlign: 'center', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <p style={{ color: '#475569', fontWeight: 800, letterSpacing: '4px', marginBottom: '3rem' }}>INTEGRATED PARTNERS</p>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.6 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>FINCRA</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>BITNOB</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>MAPLERAD</div>
         </div>
      </section>
    </div>
  );
};

export default LandingV2;
