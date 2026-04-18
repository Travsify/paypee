import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, ArrowRight, Globe, Cpu, Shield, Activity, 
  CreditCard, Wallet, Repeat, Terminal, Users, Lock, Building2,
  ChevronRight, Smartphone, ArrowUpRight, BarChart3,
  Bot, ShieldCheck, Code2, Link as LinkIcon, Star, CheckCircle2,
  Wifi, Snowflake, SlidersHorizontal
} from 'lucide-react';

import LandingWallets from './landing-pages/LandingWallets';
import LandingCards from './landing-pages/LandingCards';
import LandingTransfers from './landing-pages/LandingTransfers';
import LandingCrypto from './landing-pages/LandingCrypto';
import LandingAI from './landing-pages/LandingAI';
import LandingPayments from './landing-pages/LandingPayments';

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

const Nav = ({ onAuth, onNavigate }: { onAuth: () => void, onNavigate: (page: string) => void }) => (
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.glassBorder}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
       <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="#fff" />
       </div>
       <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: theme.text1 }}>Paypee</span>
    </div>
    <div className="desktop-only" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
       {['Features', 'Wallets', 'Cards', 'Transfers', 'Crypto', 'AI', 'Payments'].map(item => (
         <button key={item} onClick={() => onNavigate(item.toLowerCase().replace(' ', ''))} style={{ background: 'transparent', border: 'none', color: theme.text2, fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s', cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = theme.text1} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>{item}</button>
       ))}
    </div>
    <div style={{ display: 'flex', gap: '1rem' }}>
       <button onClick={onAuth} style={{ background: 'transparent', color: theme.text1, border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Sign In</button>
       <button onClick={onAuth} style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.cyan})`, color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: `0 0 20px rgba(99, 102, 241, 0.4)` }}>Get Started</button>
    </div>
  </nav>
);

const InnerHero = ({ title, subtitle }: { title: string, subtitle: string }) => (
   <section style={{ padding: '8rem 0 2rem', textAlign: 'center', background: `radial-gradient(circle at top center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)` }}>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: theme.text1, letterSpacing: '-0.03em', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ fontSize: '1.1rem', color: theme.text2, maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
   </section>
);

// 1. Hero Section
const HeroSection = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '5rem' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: `radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)`, zIndex: 0, filter: 'blur(60px)' }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.2rem', ...glassPanel, borderRadius: '99px', color: theme.cyan, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '2.5rem' }}>
             <Activity size={14} /> GLOBAL FINANCE OS
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem', color: theme.text1 }}>
             Global Finance.<br />
             <span style={{ color: theme.text1 }}>Unified & Instant.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: theme.text2, maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6, fontWeight: 400 }}>
             Hold any currency, send money worldwide in seconds, swap crypto and let AI manage your finances — all from one beautifully simple app.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
             <motion.button onClick={onAuth} whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${theme.primary}80` }} whileTap={{ scale: 0.95 }} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                Get Started
             </motion.button>
             <motion.button onClick={onAuth} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: 'transparent', color: '#fff', border: `1px solid ${theme.glassBorder}`, padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                Try Demo
             </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '10%', top: '30%', ...glassPanel, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <div style={{ background: `rgba(34, 211, 238, 0.2)`, padding: '0.5rem', borderRadius: '50%' }}><Wallet size={20} color={theme.cyan} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>USD Balance</div><div style={{ color: theme.text1, fontWeight: 800 }}>$24,580</div></div>
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ position: 'absolute', right: '10%', top: '40%', ...glassPanel, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <div style={{ background: `rgba(167, 139, 250, 0.2)`, padding: '0.5rem', borderRadius: '50%' }}><Cpu size={20} color={theme.purple} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>BTC</div><div style={{ color: theme.text1, fontWeight: 800 }}>0.842 <span style={{color: '#22c55e', fontSize: '0.75rem'}}>+18.4%</span></div></div>
      </motion.div>
    </section>
  );
};

// 2. Live Financial Preview
const LivePreview = () => (
  <section style={{ padding: '4rem 0', position: 'relative', zIndex: 20 }}>
    <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
       <div style={{ color: theme.text2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Live Preview</div>
       <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Real balances, real charts.</h2>
       <p style={{ color: theme.text2, fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need in one calm dashboard.</p>
    </div>
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
       <motion.div initial={{ opacity: 0, y: 50, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, type: "spring" }} style={{ width: '100%', maxWidth: '1000px', ...glassPanel, background: `linear-gradient(180deg, rgba(10, 15, 44, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%)`, overflow: 'hidden', position: 'relative', boxShadow: `0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px ${theme.glassBorder}` }}>
          <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             <div>
                <div style={{ color: theme.text2, marginBottom: '0.5rem' }}>Portfolio</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: theme.text1 }}>$128,450.20</div>
                <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '2rem' }}>+ $2,340 this week</div>
                <div style={{ height: '200px', background: `linear-gradient(to top, rgba(99, 102, 241, 0.1), transparent)`, borderBottom: `2px solid ${theme.primary}`, position: 'relative' }}>
                   <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0,100 Q20,80 40,90 T80,40 T100,20" fill="none" stroke={theme.primary} strokeWidth="3" />
                   </svg>
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ color: theme.text1, fontWeight: 800 }}>Recent activity</h3>
                <div style={{ ...glassPanel, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div><div style={{ color: theme.text1, fontWeight: 700 }}>Stripe Inc.</div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Today · 10:24</div></div>
                   <div style={{ color: theme.cyan, fontWeight: 800 }}>+$2,400.00</div>
                </div>
                <div style={{ ...glassPanel, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div><div style={{ color: theme.text1, fontWeight: 700 }}>Vercel</div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Yesterday</div></div>
                   <div style={{ color: theme.text1, fontWeight: 800 }}>-$80.00</div>
                </div>
                <div style={{ ...glassPanel, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div><div style={{ color: theme.text1, fontWeight: 700 }}>Sarah Okafor</div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Yesterday</div></div>
                   <div style={{ color: theme.cyan, fontWeight: 800 }}>+₦450,000</div>
                </div>
                <div style={{ ...glassPanel, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div><div style={{ color: theme.text1, fontWeight: 700 }}>Crypto Swap → USDT</div><div style={{ color: theme.text2, fontSize: '0.8rem' }}>Mon</div></div>
                   <div style={{ color: theme.purple, fontWeight: 800 }}>-0.012 BTC</div>
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  </section>
);

// 3. Core Capabilities
const Capabilities = () => (
  <section id="features" style={{ padding: '4rem 0' }}>
    <div className="container">
       <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: theme.text2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, letterSpacing: '-0.02em' }}>Everything you need</h2>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { t: 'Multi-Currency Wallets', d: 'Hold USD, EUR, NGN, BTC, USDT and 30+ assets in one place.', i: <Globe color={theme.cyan} size={32}/>, color: theme.cyan },
            { t: 'Virtual Cards', d: 'Issue unlimited cards. Freeze, set limits, spend anywhere instantly.', i: <CreditCard color={theme.purple} size={32}/>, color: theme.purple },
            { t: 'Global Transfers', d: 'Send money to 80+ countries in seconds with transparent fees.', i: <Repeat color={theme.primary} size={32}/>, color: theme.primary },
            { t: 'Crypto & Swap', d: 'Buy, sell and swap crypto and fiat at the best market rates.', i: <Cpu color={theme.cyan} size={32}/>, color: theme.cyan },
            { t: 'AI Money Manager', d: 'Smart insights that protect your money from inflation and waste.', i: <Bot color={theme.purple} size={32}/>, color: theme.purple },
            { t: 'Bank-Grade Security', d: 'End-to-end encryption, biometrics and 24/7 fraud monitoring.', i: <ShieldCheck color={theme.primary} size={32}/>, color: theme.primary }
          ].map((item, i) => (
             <motion.div key={i} whileHover={{ y: -10, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }} style={{ ...glassPanel, padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '150px', height: '150px', background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`, filter: 'blur(30px)' }} />
                <div style={{ marginBottom: '1.5rem' }}>{item.i}</div>
                <h3 style={{ fontSize: '1.5rem', color: theme.text1, fontWeight: 800, marginBottom: '0.5rem' }}>{item.t}</h3>
                <p style={{ color: theme.text2, lineHeight: 1.5 }}>{item.d}</p>
             </motion.div>
          ))}
       </div>
    </div>
  </section>
);

// 4. Multi-Currency System
const MultiCurrency = () => (
  <section id="wallets" style={{ padding: '4rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
           <div>
              <div style={{ color: theme.cyan, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Multi-currency wallet</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Every currency.<br/>One balance you can trust.</h2>
              <p style={{ color: theme.text2, fontSize: '1rem', lineHeight: 1.6 }}>Switch between fiat and crypto in a single tap. No hidden fees, no spreads — just clean, real-time balances wherever you are.</p>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                 { label: 'US Dollar', val: '$24,580.00', bg: 'rgba(99, 102, 241, 0.1)' },
                 { label: 'Euro', val: '€18,240.50', bg: 'rgba(167, 139, 250, 0.1)' },
                 { label: 'Naira', val: '₦8,420,000', bg: 'rgba(34, 211, 238, 0.1)' },
                 { label: 'Bitcoin', val: '₿0.8421', bg: 'rgba(245, 158, 11, 0.1)' },
                 { label: 'Tether', val: '₮12,000.00', bg: 'rgba(16, 185, 129, 0.1)' },
                 { label: 'Pound', val: '£3,210.00', bg: 'rgba(236, 72, 153, 0.1)' },
              ].map((c, i) => (
                 <div key={i} style={{ ...glassPanel, padding: '1.5rem', background: c.bg }}>
                    <div style={{ color: theme.text2, fontSize: '0.85rem' }}>{c.label}</div>
                    <div style={{ color: theme.text1, fontWeight: 800, fontSize: '1.2rem', marginTop: '0.5rem' }}>{c.val}</div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  </section>
);

// 5. Virtual Cards Experience
const VirtualCards = () => (
  <section id="cards" style={{ padding: '4rem 0', overflow: 'hidden' }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
           {/* Left side: Cards Stack */}
           <div style={{ position: 'relative', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Back Card */}
              <motion.div animate={{ rotate: -15, x: -60, y: 20 }} style={{ position: 'absolute', zIndex: 1, width: '320px', height: '200px', background: `linear-gradient(135deg, ${theme.purple}, #c084fc)`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>paypee</div>
                    <Wifi size={20} color="#fff" style={{ transform: 'rotate(90deg)' }} />
                 </div>
                 <div>
                    <div style={{ fontSize: '1.2rem', letterSpacing: '4px', color: '#fff', fontWeight: 600, marginBottom: '1rem' }}>•••• •••• •••• 8421</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>CARDHOLDER</div>
                          <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Sarah Okafor</div>
                       </div>
                       <div style={{ display: 'flex' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', marginLeft: '-12px' }}></div>
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* Middle Card */}
              <motion.div animate={{ rotate: -5, x: -30, y: -20 }} style={{ position: 'absolute', zIndex: 2, width: '320px', height: '200px', background: `linear-gradient(135deg, ${theme.cyan}, #06b6d4)`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>paypee</div>
                    <Wifi size={20} color="#fff" style={{ transform: 'rotate(90deg)' }} />
                 </div>
                 <div>
                    <div style={{ fontSize: '1.2rem', letterSpacing: '4px', color: '#fff', fontWeight: 600, marginBottom: '1rem' }}>•••• •••• •••• 2256</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>CARDHOLDER</div>
                          <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Sarah Okafor</div>
                       </div>
                       <div style={{ display: 'flex' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', marginLeft: '-12px' }}></div>
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* Front Card */}
              <motion.div animate={{ rotate: 8, x: 20, y: 10 }} style={{ position: 'absolute', zIndex: 3, width: '340px', height: '210px', background: `linear-gradient(135deg, ${theme.primary}, #818cf8)`, borderRadius: '16px', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 30px 60px rgba(0,0,0,0.6)` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>paypee</div>
                    <Wifi size={22} color="#fff" style={{ transform: 'rotate(90deg)' }} />
                 </div>
                 <div>
                    <div style={{ fontSize: '1.4rem', letterSpacing: '8px', color: '#fff', fontWeight: 600, marginBottom: '1.2rem' }}>•••• 9034</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>CARDHOLDER</div>
                          <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>Sarah Okafor</div>
                       </div>
                       <div style={{ display: 'flex' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', marginLeft: '-14px' }}></div>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>

           {/* Right side: Text Content */}
           <div>
              <div style={{ color: theme.purple, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Virtual cards</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Beautiful cards.<br/>Total control.</h2>
              <p style={{ color: theme.text2, fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>Spin up unlimited virtual cards for subscriptions, travel or business. Freeze, unfreeze and set spending limits — instantly.</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                 <div style={{ ...glassPanel, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '240px' }}>
                    <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                       <Snowflake color={theme.cyan} size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 700, color: theme.text1, marginBottom: '0.2rem' }}>Freeze instantly</div>
                       <div style={{ fontSize: '0.85rem', color: theme.text2 }}>One tap, zero fraud</div>
                    </div>
                 </div>
                 <div style={{ ...glassPanel, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '240px' }}>
                    <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                       <SlidersHorizontal color={theme.purple} size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 700, color: theme.text1, marginBottom: '0.2rem' }}>Set limits</div>
                       <div style={{ fontSize: '0.85rem', color: theme.text2 }}>Daily, monthly, per-merchant</div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
     </div>
  </section>
);

// 6. Global Transfers
const GlobalTransfers = () => (
  <section style={{ padding: '4rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
           <div style={{ ...glassPanel, padding: '2.5rem', background: 'rgba(2, 6, 23, 0.9)' }}>
              <div style={{ ...glassPanel, padding: '1rem', marginBottom: '1rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Recipient</div>
                 <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Adaeze N.</div>
                 <div style={{ color: theme.text2, fontSize: '0.9rem' }}>GTBank · Nigeria</div>
              </div>
              <div style={{ ...glassPanel, padding: '1rem', marginBottom: '1rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Amount</div>
                 <div style={{ fontWeight: 900, fontSize: '1.5rem', color: theme.text1 }}>$1,200</div>
                 <div style={{ color: theme.cyan, fontSize: '0.9rem' }}>≈ ₦1,800,000</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.5rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Speed</div>
                 <div style={{ color: theme.text1, fontWeight: 700 }}>Instant <span style={{ color: theme.text2, fontWeight: 400 }}>(Arrives in 12 sec)</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Fee</div>
                 <div style={{ color: theme.text1, fontWeight: 700 }}>$0.40 <span style={{ color: theme.primary, fontWeight: 400 }}>(Transparent FX)</span></div>
              </div>
              <button style={{ width: '100%', padding: '1rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem' }}>Send Now</button>
           </div>
           <div>
              <div style={{ color: theme.primary, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Global transfers</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Send money like sending a text.</h2>
              <p style={{ color: theme.text2, fontSize: '1rem', lineHeight: 1.6 }}>80+ countries. 40+ currencies. No banking jargon — just a recipient, an amount, and done.</p>
           </div>
        </div>
     </div>
  </section>
);

// 7. Crypto & Swap Engine
const CryptoSwap = () => (
   <section id="crypto" style={{ padding: '4rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
         <div style={{ color: theme.cyan, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Crypto & swap</div>
         <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Trade fiat & crypto in a tap.</h2>
         <p style={{ color: theme.text2, fontSize: '1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Aggregated liquidity from top exchanges gives you the best price every time — no spreads, no surprises.</p>
         
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ ...glassPanel, padding: '2rem', width: '280px', textAlign: 'left' }}>
               <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You pay</div>
               <div style={{ fontSize: '2rem', fontWeight: 900, color: theme.text1 }}>1.24 BTC</div>
               <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Balance · 1.24 BTC</div>
            </div>
            <Repeat size={40} color={theme.cyan} />
            <div style={{ ...glassPanel, padding: '2rem', width: '280px', textAlign: 'left', borderColor: theme.cyan }}>
               <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You receive <span style={{ background: theme.cyan, color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginLeft: '0.5rem' }}>Best rate</span></div>
               <div style={{ fontSize: '2rem', fontWeight: 900, color: theme.cyan }}>$32,540.00</div>
            </div>
         </div>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '4rem' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 900 }}>120+</div><div style={{ color: theme.text2 }}>Pairs</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 900 }}>1.4s</div><div style={{ color: theme.text2 }}>Avg. swap</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 900 }}>0.1%</div><div style={{ color: theme.text2 }}>Fee</div></div>
         </div>
      </div>
   </section>
);

// 8. Paypee AI
const PaypeeAI = () => (
   <section style={{ padding: '4rem 0', background: `linear-gradient(180deg, ${theme.bg}, rgba(167, 139, 250, 0.05), ${theme.bg})`, borderTop: `1px solid ${theme.glassBorder}` }}>
      <div className="container">
         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Bot size={40} color={theme.purple} style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>An assistant that grows your money quietly.</h2>
            <p style={{ color: theme.text2, fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Paypee AI watches markets, currencies and your spending — then acts on your behalf. Like having a private banker in your pocket.</p>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><ShieldCheck color={theme.cyan} /> <h3 style={{ fontWeight: 800 }}>Inflation shield activated</h3></div>
               <p style={{ color: theme.text2 }}>We moved $2,400 from NGN into USDT to protect your value this week.</p>
            </div>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><BarChart3 color={theme.primary} /> <h3 style={{ fontWeight: 800 }}>Spending optimized</h3></div>
               <p style={{ color: theme.text2 }}>You spent 18% less on subscriptions. Estimated savings: $74/month.</p>
            </div>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><Zap color={theme.purple} /> <h3 style={{ fontWeight: 800 }}>Smart suggestion</h3></div>
               <p style={{ color: theme.text2 }}>Switch your EUR transfers to Tuesdays — average rate is 0.4% better.</p>
            </div>
         </div>
      </div>
   </section>
);

// 9. Security & Trust
const Security = () => (
   <section style={{ padding: '4rem 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
         <div>
            <div style={{ color: theme.primary, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Security</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Built like a vault.<br/>Feels like silk.</h2>
            <p style={{ color: theme.text2, fontSize: '1rem', lineHeight: 1.6 }}>Your money and data are protected by the same systems trusted by global banks. Every layer hardened. Every action audited.</p>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
               <Lock color={theme.cyan} style={{ marginBottom: '1rem' }} />
               <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>256-bit encryption</div>
               <div style={{ color: theme.text2, fontSize: '0.9rem' }}>End-to-end on every transaction.</div>
            </div>
            <div>
               <ShieldCheck color={theme.purple} style={{ marginBottom: '1rem' }} />
               <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>PCI-DSS Level 1</div>
               <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Industry-leading compliance.</div>
            </div>
            <div>
               <Smartphone color={theme.primary} style={{ marginBottom: '1rem' }} />
               <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Biometric auth</div>
               <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Face ID, Touch ID & passkeys.</div>
            </div>
            <div>
               <Activity color={theme.cyan} style={{ marginBottom: '1rem' }} />
               <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>24/7 monitoring</div>
               <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Anomaly detection in real-time.</div>
            </div>
         </div>
      </div>
   </section>
);

// 10. For Who Section
const ForWho = ({ onAuth }: { onAuth: () => void }) => (
   <section id="forwho" style={{ padding: '4rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}` }}>
      <div className="container">
         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: theme.cyan, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>For who</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, letterSpacing: '-0.02em' }}>Built for everyone.</h2>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ ...glassPanel, padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: theme.text1, marginBottom: '1rem' }}>Individuals</h3>
               <p style={{ color: theme.text2, lineHeight: 1.6, marginBottom: '2rem' }}>Hold any currency, send to anyone, spend anywhere.</p>
               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: theme.text1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.primary} /> Multi-currency wallets</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.primary} /> Free virtual cards</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color={theme.primary} /> AI savings</li>
               </ul>
               <button onClick={onAuth} style={{ marginTop: 'auto', background: theme.glass, color: '#fff', border: `1px solid ${theme.glassBorder}`, padding: '1rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Learn more</button>
            </div>
            <div style={{ ...glassPanel, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(2, 6, 23, 0.5) 100%)` }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: theme.text1, marginBottom: '1rem' }}>Businesses</h3>
               <p style={{ color: theme.text2, lineHeight: 1.6, marginBottom: '2rem' }}>Pay contractors, manage cash and reconcile globally.</p>
               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: theme.text1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.cyan} /> Bulk payouts</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.cyan} /> Team cards</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color={theme.cyan} /> Accounting sync</li>
               </ul>
               <button onClick={onAuth} style={{ marginTop: 'auto', background: theme.primary, color: '#fff', border: `none`, padding: '1rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Learn more</button>
            </div>
            <div style={{ ...glassPanel, padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: theme.text1, marginBottom: '1rem' }}>Developers</h3>
               <p style={{ color: theme.text2, lineHeight: 1.6, marginBottom: '2rem' }}>Build money flows with one elegant API and SDKs.</p>
               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: theme.text1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.purple} /> REST + Webhooks</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><CheckCircle2 size={16} color={theme.purple} /> Sandbox env.</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color={theme.purple} /> Open source SDKs</li>
               </ul>
               <button onClick={onAuth} style={{ marginTop: 'auto', background: theme.glass, color: '#fff', border: `1px solid ${theme.glassBorder}`, padding: '1rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Learn more</button>
            </div>
         </div>
      </div>
   </section>
);

// 11. Social Proof
const SocialProof = () => (
   <section style={{ padding: '4rem 0' }}>
      <div className="container">
         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', marginBottom: '4rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.primary }}>2.4M+</div><div style={{ color: theme.text2, fontWeight: 700, fontSize: '0.85rem' }}>Active users</div></div>
            <div><div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.cyan }}>$18B</div><div style={{ color: theme.text2, fontWeight: 700, fontSize: '0.85rem' }}>Processed yearly</div></div>
            <div><div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.purple }}>80+</div><div style={{ color: theme.text2, fontWeight: 700, fontSize: '0.85rem' }}>Countries</div></div>
            <div><div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.text1 }}>4.9★</div><div style={{ color: theme.text2, fontWeight: 700, fontSize: '0.85rem' }}>App rating</div></div>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ ...glassPanel, padding: '2.5rem' }}>
               <div style={{ display: 'flex', gap: '0.2rem', color: '#FBBF24', marginBottom: '1rem' }}><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
               <p style={{ color: theme.text1, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>"Paypee replaced 4 different apps for me. Getting paid in USD and spending in NGN has never been smoother."</p>
               <div><div style={{ fontWeight: 800 }}>Amaka Eze</div><div style={{ color: theme.text2, fontSize: '0.85rem' }}>Freelance designer</div></div>
            </div>
            <div style={{ ...glassPanel, padding: '2.5rem' }}>
               <div style={{ display: 'flex', gap: '0.2rem', color: '#FBBF24', marginBottom: '1rem' }}><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
               <p style={{ color: theme.text1, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>"We pay our entire remote team through Paypee. Setup took 10 minutes. Reconciliation is finally pleasant."</p>
               <div><div style={{ fontWeight: 800 }}>Daniel Park</div><div style={{ color: theme.text2, fontSize: '0.85rem' }}>Founder, Slate Studio</div></div>
            </div>
            <div style={{ ...glassPanel, padding: '2.5rem' }}>
               <div style={{ display: 'flex', gap: '0.2rem', color: '#FBBF24', marginBottom: '1rem' }}><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
               <p style={{ color: theme.text1, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>"The swap rates are noticeably better than my exchange. And the cards just… work, everywhere."</p>
               <div><div style={{ fontWeight: 800 }}>Lina Costa</div><div style={{ color: theme.text2, fontSize: '0.85rem' }}>Crypto trader</div></div>
            </div>
         </div>
      </div>
   </section>
);

// 12. CTA
const CTA = ({ onAuth }: { onAuth: () => void }) => (
   <section style={{ padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${theme.primary}30 0%, transparent 60%)` }} />
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10, ...glassPanel, padding: '4rem 2rem' }}>
         <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: theme.text1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Join millions building a better financial life with Paypee.</h2>
         <p style={{ color: theme.text2, fontSize: '1rem', marginBottom: '2rem' }}>Setup takes under 60 seconds.</p>
         <button onClick={onAuth} style={{ background: theme.text1, color: theme.bg, border: 'none', padding: '1rem 3rem', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}>
            Get Started
         </button>
      </div>
   </section>
);

// --- MAIN PAGE COMPONENT ---
const LandingV2 = ({ onAuth }: { onAuth: () => void }) => {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div style={{ background: theme.bg, color: theme.text1, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Nav onAuth={onAuth} onNavigate={setPage} />
      
      {page === 'home' && (
        <>
          <HeroSection onAuth={onAuth} />
          <LivePreview />
          <Capabilities />
          <MultiCurrency />
          <VirtualCards />
          <GlobalTransfers />
          <CryptoSwap />
          <PaypeeAI />
          <Security />
          <ForWho onAuth={onAuth} />
          <SocialProof />
        </>
      )}

      {page === 'features' && (
        <>
          <InnerHero title="Features" subtitle="Everything you need in one powerful financial platform." />
          <Capabilities />
          <Security />
        </>
      )}

      {page === 'wallets' && (
        <>
          <InnerHero title="Multi-Currency Wallets" subtitle="Every currency. One balance you can trust." />
          <LandingWallets />
        </>
      )}

      {page === 'cards' && (
        <>
          <InnerHero title="Virtual Cards" subtitle="Beautiful cards. Total control." />
          <LandingCards />
        </>
      )}

      {page === 'transfers' && (
        <>
          <InnerHero title="Global Transfers" subtitle="Send money like sending a text." />
          <LandingTransfers />
        </>
      )}

      {page === 'crypto' && (
        <>
          <InnerHero title="Crypto & Swap" subtitle="Trade fiat & crypto in a tap." />
          <LandingCrypto />
        </>
      )}

      {page === 'ai' && (
        <>
          <InnerHero title="Paypee AI" subtitle="An assistant that grows your money quietly." />
          <LandingAI />
        </>
      )}

      {page === 'payments' && (
        <>
          <InnerHero title="Bill Payments" subtitle="Pay bills instantly, never miss a due date." />
          <LandingPayments />
        </>
      )}

      <CTA onAuth={onAuth} />
      
      <footer style={{ padding: '4rem 0 2rem', borderTop: `1px solid ${theme.glassBorder}`, background: theme.bg }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div style={{ gridColumn: '1 / -1', maxWidth: '300px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                 <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} color="#fff" />
                 </div>
                 <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: theme.text1, cursor: 'pointer' }} onClick={() => setPage('home')}>Paypee</span>
              </div>
              <p style={{ color: theme.text2, lineHeight: 1.6, fontSize: '0.9rem' }}>An advanced finance app made simple for everyone. Hold, send, spend and grow money — globally.</p>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '1.5rem', color: theme.text1, fontWeight: 800 }}>Individuals</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Wallets</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Virtual Cards</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Send Money</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Crypto</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>AI Manager</li>
              </ul>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '1.5rem', color: theme.text1, fontWeight: 800 }}>Businesses</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Payouts</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Team Cards</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Invoicing</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Treasury</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '1.5rem', color: theme.text1, fontWeight: 800 }}>Developers</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>API Docs</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>SDKs</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Webhooks</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Sandbox</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Status</li>
              </ul>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '1.5rem', color: theme.text1, fontWeight: 800 }}>Company</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>About</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Careers</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Press</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Security</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Contact</li>
              </ul>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '1.5rem', color: theme.text1, fontWeight: 800 }}>Support</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Help Center</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Community</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Guides</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Compliance</li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Legal</li>
              </ul>
            </div>
          </div>
          
          <div style={{ fontSize: '0.8rem', color: theme.text2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', borderTop: `1px solid ${theme.glassBorder}`, paddingTop: '2rem', gap: '1rem' }}>
            <span>© 2026 Paypee Financial Inc. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Privacy</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Terms</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
