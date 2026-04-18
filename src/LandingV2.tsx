import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, ArrowRight, Globe, Cpu, Shield, Activity, 
  CreditCard, Wallet, Repeat, Terminal, Users, Lock,
  ChevronRight, Smartphone, ArrowUpRight, BarChart3,
  Bot, ShieldCheck, Code2, Link as LinkIcon
} from 'lucide-react';

// --- STYLES ---
const theme = {
  bg: '#020617',
  bg2: '#0A0F2C',
  glass: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  primary: '#6366F1',
  cyan: '#22D3EE',
  purple: '#A78BFA',
  text1: '#FFFFFF',
  text2: '#94A3B8'
};

const glassPanel = {
  background: theme.glass,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.glassBorder}`,
  borderRadius: '24px'
};

// --- COMPONENTS ---

const Nav = ({ onAuth }: { onAuth: () => void }) => (
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.glassBorder}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
       <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#fff" />
       </div>
       <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: theme.text1 }}>PAYPEE</span>
    </div>
    <div className="desktop-only" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
       {['Products', 'Solutions', 'Developers', 'Company'].map(item => (
         <a key={item} href="#" style={{ color: theme.text2, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = theme.text1} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>{item}</a>
       ))}
    </div>
    <div style={{ display: 'flex', gap: '1rem' }}>
       <button onClick={onAuth} style={{ background: 'transparent', color: theme.text1, border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
       <button onClick={onAuth} style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.cyan})`, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 0 20px rgba(99, 102, 241, 0.4)` }}>Get Started</button>
    </div>
  </nav>
);

// 1. Hero Section
const HeroSection = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '5rem' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: `radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)`, zIndex: 0, filter: 'blur(60px)' }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.2rem', borderRadius: '99px', ...glassPanel, color: theme.cyan, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '2.5rem' }}>
             <Activity size={14} /> PAYPEE OS 2.0 ONLINE
          </div>
          <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '2rem', color: theme.text1 }}>
             Global Finance.<br />
             <span style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.cyan}, ${theme.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unified & Instant.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: theme.text2, maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 500 }}>
             The intelligent financial operating system. Combine banking, crypto, and AI-powered wealth management in one powerful interface.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
             <motion.button onClick={onAuth} whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${theme.primary}80` }} whileTap={{ scale: 0.95 }} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                Open Account
             </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '10%', top: '30%', ...glassPanel, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <div style={{ background: `rgba(34, 211, 238, 0.2)`, padding: '0.5rem', borderRadius: '50%' }}><Repeat size={20} color={theme.cyan} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Incoming SWIFT</div><div style={{ color: theme.text1, fontWeight: 800 }}>$12,450.00</div></div>
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ position: 'absolute', right: '10%', top: '40%', ...glassPanel, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <div style={{ background: `rgba(167, 139, 250, 0.2)`, padding: '0.5rem', borderRadius: '50%' }}><Wallet size={20} color={theme.purple} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Total Liquidity</div><div style={{ color: theme.text1, fontWeight: 800 }}>€342k</div></div>
      </motion.div>
    </section>
  );
};

// 2. Live Financial Preview
const LivePreview = () => (
  <section style={{ padding: '4rem 0', position: 'relative', zIndex: 20 }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
       <motion.div initial={{ opacity: 0, y: 50, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, type: "spring" }} style={{ width: '100%', maxWidth: '1000px', height: '600px', ...glassPanel, background: `linear-gradient(180deg, rgba(10, 15, 44, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%)`, overflow: 'hidden', position: 'relative', boxShadow: `0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px ${theme.glassBorder}` }}>
          {/* Mockup Top Bar */}
          <div style={{ height: '60px', borderBottom: `1px solid ${theme.glassBorder}`, display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
             <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
             <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EAB308' }} />
             <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E' }} />
             <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', color: theme.text2 }}>
                <SearchIcon /> <BellIcon />
             </div>
          </div>
          {/* Mockup Body */}
          <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
             <div>
                <div style={{ color: theme.text2, marginBottom: '0.5rem' }}>Total Balance</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '2rem' }}>$1,284,500.00</div>
                <div style={{ height: '200px', background: `linear-gradient(to top, rgba(99, 102, 241, 0.1), transparent)`, borderBottom: `2px solid ${theme.primary}`, position: 'relative' }}>
                   {/* Fake Chart Line */}
                   <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0,100 Q20,80 40,90 T80,40 T100,20" fill="none" stroke={theme.primary} strokeWidth="3" />
                   </svg>
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ ...glassPanel, padding: '1.5rem' }}>
                   <div style={{ color: theme.text2, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Incoming SWIFT</div>
                   <div style={{ color: theme.cyan, fontWeight: 800 }}>+ $45,000.00</div>
                </div>
                <div style={{ ...glassPanel, padding: '1.5rem' }}>
                   <div style={{ color: theme.text2, fontSize: '0.8rem', marginBottom: '0.5rem' }}>AI Auto-Swap</div>
                   <div style={{ color: theme.purple, fontWeight: 800 }}>NGN → USDT</div>
                </div>
                <div style={{ ...glassPanel, padding: '1.5rem' }}>
                   <div style={{ color: theme.text2, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Virtual Card Exp.</div>
                   <div style={{ color: theme.text1, fontWeight: 800 }}>- $1,240.00</div>
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  </section>
);

const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

// 3. Core Capabilities
const Capabilities = () => (
  <section style={{ padding: '8rem 0' }}>
    <div className="container">
       <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1 }}>The Operating System.</h2>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { t: 'Multi-Currency', i: <Globe color={theme.cyan} size={32}/>, color: theme.cyan },
            { t: 'Virtual Cards', i: <CreditCard color={theme.purple} size={32}/>, color: theme.purple },
            { t: 'Global Transfers', i: <Repeat color={theme.primary} size={32}/>, color: theme.primary },
            { t: 'Crypto Engine', i: <Cpu color={theme.cyan} size={32}/>, color: theme.cyan }
          ].map((item, i) => (
             <motion.div key={i} whileHover={{ y: -10, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }} style={{ ...glassPanel, padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '150px', height: '150px', background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`, filter: 'blur(30px)' }} />
                <div style={{ marginBottom: '2rem' }}>{item.i}</div>
                <h3 style={{ fontSize: '1.5rem', color: theme.text1, fontWeight: 800 }}>{item.t}</h3>
                <div style={{ marginTop: '2rem', height: '80px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: `1px solid ${theme.glassBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ width: '60%', height: '8px', background: `linear-gradient(90deg, ${item.color}, transparent)`, borderRadius: '4px' }}/>
                </div>
             </motion.div>
          ))}
       </div>
    </div>
  </section>
);

// 4. Multi-Currency System
const MultiCurrency = () => (
  <section style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
           <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1.1 }}>One Account.<br/>Infinite Borders.</h2>
              <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.6 }}>Hold USD, EUR, GBP, NGN, BTC, and USDT in a single unified interface. Auto-convert intelligently to protect against volatility.</p>
           </div>
           <div style={{ position: 'relative', height: '400px' }}>
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: 0, right: 0, width: '80%', ...glassPanel, padding: '2rem', zIndex: 2, background: 'rgba(2, 6, 23, 0.9)' }}>
                 <div style={{ color: theme.text2, fontSize: '0.9rem' }}>US Dollar Account</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.text1 }}>$84,200.50</div>
              </motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} style={{ position: 'absolute', bottom: 0, left: 0, width: '80%', ...glassPanel, padding: '2rem', zIndex: 1, background: 'rgba(10, 15, 44, 0.9)' }}>
                 <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Nigerian Naira Account</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.text1 }}>₦12,450,000.00</div>
              </motion.div>
           </div>
        </div>
     </div>
  </section>
);

// 5. Virtual Cards Experience
const VirtualCards = () => (
  <section style={{ padding: '8rem 0', overflow: 'hidden' }}>
     <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: theme.text1, marginBottom: '4rem' }}>Spend Without Limits.</h2>
        <div style={{ position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}>
           <div style={{ position: 'absolute', width: '100%', height: '100%', background: `radial-gradient(circle, ${theme.purple}20 0%, transparent 50%)`, filter: 'blur(50px)' }} />
           <motion.div 
              animate={{ rotateY: [0, 10, -10, 0], rotateX: [10, 0, 10] }} 
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ width: '400px', height: '250px', background: `linear-gradient(135deg, ${theme.bg2}, ${theme.purple}40)`, borderRadius: '24px', padding: '2rem', border: `1px solid rgba(167, 139, 250, 0.5)`, boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 30px ${theme.purple}40`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>PAYPEE</div>
                 <Globe color={theme.purple} />
              </div>
              <div style={{ fontSize: '1.8rem', letterSpacing: '4px', color: '#fff', fontWeight: 600 }}>**** **** **** 4092</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                 <span style={{ fontSize: '0.9rem' }}>VIRTUAL</span>
                 <span style={{ fontSize: '0.9rem' }}>12/28</span>
              </div>
           </motion.div>
           
           {/* Card Controls */}
           <motion.div style={{ position: 'absolute', right: '15%', top: '20%', ...glassPanel, padding: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'center' }}><span style={{ color: theme.text1 }}>Freeze Card</span> <div style={{ width: 40, height: 24, background: theme.primary, borderRadius: '12px' }}/></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'center' }}><span style={{ color: theme.text1 }}>Online Spend</span> <div style={{ width: 40, height: 24, background: theme.primary, borderRadius: '12px' }}/></div>
           </motion.div>
        </div>
     </div>
  </section>
);

// 6. Global Transfers
const GlobalTransfers = () => (
  <section style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
           <div style={{ ...glassPanel, padding: '2rem', background: 'rgba(2, 6, 23, 0.9)' }}>
              <div style={{ color: theme.text2, marginBottom: '1rem' }}>Send Money</div>
              <div style={{ ...glassPanel, padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '2rem', color: theme.text1, fontWeight: 800 }}>$5,000</span>
                 <span style={{ color: theme.text2, alignSelf: 'center' }}>USD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', my: '1rem' }}><ArrowRight color={theme.primary} /></div>
              <div style={{ ...glassPanel, padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '2rem', color: theme.cyan, fontWeight: 800 }}>£3,940</span>
                 <span style={{ color: theme.text2, alignSelf: 'center' }}>GBP</span>
              </div>
              <button style={{ width: '100%', padding: '1rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem' }}>Send Instantly</button>
           </div>
           <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1.1 }}>Lightning Fast<br/>Global Rails.</h2>
              <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2rem' }}>Bypass the SWIFT network. Our proprietary routing ensures your funds arrive in seconds, not days, with zero hidden fees.</p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <div>
                    <div style={{ fontSize: '2rem', color: theme.cyan, fontWeight: 900 }}>2s</div>
                    <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Avg. Settlement</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '2rem', color: theme.purple, fontWeight: 900 }}>0%</div>
                    <div style={{ color: theme.text2, fontSize: '0.9rem' }}>FX Markup</div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </section>
);

// 7. Crypto & Swap Engine
const CryptoSwap = () => (
   <section style={{ padding: '8rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '1rem' }}>Fiat to Crypto. Fluidly.</h2>
         <p style={{ color: theme.text2, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem' }}>Enter the digital economy seamlessly. Swap local fiat for stablecoins or Bitcoin instantly.</p>
         
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
            <motion.div whileHover={{ y: -5 }} style={{ width: '200px', ...glassPanel, padding: '2rem' }}>
               <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text1 }}>NGN</div>
               <div style={{ color: theme.text2 }}>₦500,000</div>
            </motion.div>
            <Repeat size={40} color={theme.cyan} />
            <motion.div whileHover={{ y: -5 }} style={{ width: '200px', ...glassPanel, padding: '2rem', borderColor: theme.cyan }}>
               <div style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.cyan }}>USDT</div>
               <div style={{ color: theme.text1 }}>345.20</div>
            </motion.div>
         </div>
      </div>
   </section>
);

// 8. Paypee AI
const PaypeeAI = () => (
   <section style={{ padding: '10rem 0', background: `linear-gradient(180deg, ${theme.bg}, ${theme.primary}20, ${theme.bg})`, position: 'relative' }}>
      <div className="container">
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div>
               <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', color: theme.cyan, background: 'rgba(34,211,238,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', fontWeight: 800, marginBottom: '2rem' }}>
                  <Bot size={18} /> MEET PAYPEE AI
               </div>
               <h2 style={{ fontSize: '4rem', fontWeight: 900, color: theme.text1, lineHeight: 1, marginBottom: '2rem' }}>Your Autonomous<br/>CFO.</h2>
               <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.6 }}>Proactive treasury management. Paypee AI monitors markets, hedges currency risk automatically, and optimizes your cash flow in real-time.</p>
            </div>
            <div style={{ position: 'relative', height: '400px' }}>
               <div style={{ position: 'absolute', inset: 0, ...glassPanel, background: 'rgba(2,6,23,0.9)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', color: theme.text2, width: '80%' }}>
                     Notice: USD/NGN volatility detected. Should I auto-hedge 50% of your NGN balance into USDT?
                  </div>
                  <div style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.purple})`, padding: '1rem', borderRadius: '12px', color: '#fff', width: '60%', alignSelf: 'flex-end', fontWeight: 600 }}>
                     Yes, execute hedge.
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', color: theme.cyan, width: '80%', fontWeight: 800 }}>
                     <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Hedge executed. Capital protected.
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
);

// 9. Security & Trust
const Security = () => (
   <section style={{ padding: '8rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
         <Shield size={60} color={theme.primary} style={{ marginBottom: '2rem' }} />
         <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '4rem' }}>Bank-Grade Security.</h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <h3 style={{ color: theme.text1, fontWeight: 800, marginBottom: '1rem' }}>MPC Custody</h3>
               <p style={{ color: theme.text2 }}>Multi-party computation ensures your assets are never exposed.</p>
            </div>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <h3 style={{ color: theme.text1, fontWeight: 800, marginBottom: '1rem' }}>Real-Time KYC</h3>
               <p style={{ color: theme.text2 }}>Automated global identity verification in under 3 minutes.</p>
            </div>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <h3 style={{ color: theme.text1, fontWeight: 800, marginBottom: '1rem' }}>ISO 27001</h3>
               <p style={{ color: theme.text2 }}>Certified infrastructure adhering to the highest global standards.</p>
            </div>
         </div>
      </div>
   </section>
);

// 10. Developer Tools
const DevTools = () => (
   <section style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
      <div className="container">
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div style={{ ...glassPanel, padding: '2rem', background: '#020617', fontFamily: 'monospace', color: theme.cyan, overflowX: 'hidden' }}>
               <div style={{ color: theme.text2, marginBottom: '1rem', fontSize: '0.8rem' }}>// Initialize Paypee SDK</div>
               <div>const paypee = new Paypee('sk_live_...');</div>
               <br/>
               <div style={{ color: theme.text2, marginBottom: '1rem', fontSize: '0.8rem' }}>// Create a payout</div>
               <div>await paypee.payouts.create(&#123;</div>
               <div style={{ paddingLeft: '1rem' }}>amount: 5000,</div>
               <div style={{ paddingLeft: '1rem' }}>currency: 'USD',</div>
               <div style={{ paddingLeft: '1rem' }}>destination: 'iban_...'</div>
               <div>&#125;);</div>
            </div>
            <div>
               <h2 style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1.1 }}>Built for<br/>Engineers.</h2>
               <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.6 }}>Robust APIs, comprehensive SDKs, and enterprise-grade webhooks. Integrate global finance into your app in an afternoon.</p>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button style={{ background: 'transparent', color: theme.primary, border: 'none', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>Read Docs <ArrowRight size={18} /></button>
               </div>
            </div>
         </div>
      </div>
   </section>
);

// 11. Social Proof
const SocialProof = () => (
   <section style={{ padding: '8rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
         <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.text1, marginBottom: '4rem' }}>Trusted globally.</h2>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.5 }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: theme.text1 }}>FINCRA</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: theme.text1 }}>MAPLERAD</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: theme.text1 }}>BITNOB</div>
         </div>
      </div>
   </section>
);

// 12. CTA
const CTA = ({ onAuth }: { onAuth: () => void }) => (
   <section style={{ padding: '10rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${theme.primary}40 0%, transparent 70%)` }} />
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
         <h2 style={{ fontSize: '4rem', fontWeight: 900, color: theme.text1, marginBottom: '2rem' }}>Scale beyond borders.</h2>
         <p style={{ color: theme.text2, fontSize: '1.2rem', marginBottom: '3rem' }}>Join the financial operating system of the future.</p>
         <button onClick={onAuth} style={{ background: theme.text1, color: theme.bg, border: 'none', padding: '1.5rem 4rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer' }}>
            Start Building Free
         </button>
      </div>
   </section>
);

// --- MAIN PAGE COMPONENT ---
const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <div style={{ background: theme.bg, color: theme.text1, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Nav onAuth={onAuth} />
      <HeroSection onAuth={onAuth} />
      <LivePreview />
      <Capabilities />
      <MultiCurrency />
      <VirtualCards />
      <GlobalTransfers />
      <CryptoSwap />
      <PaypeeAI />
      <Security />
      <DevTools />
      <SocialProof />
      <CTA onAuth={onAuth} />
      
      <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: `1px solid ${theme.glassBorder}` }}>
         <p style={{ color: theme.text2, fontSize: '0.9rem' }}>© 2026 Paypee Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingV2;
