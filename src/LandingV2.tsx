import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, ArrowRight, Globe, Cpu, Shield, Activity, 
  CreditCard, Wallet, Repeat, Terminal, Users, Lock, Building2,
  ChevronRight, Smartphone, ArrowUpRight, BarChart3,
  Bot, ShieldCheck, Code2, Link as LinkIcon, Star, CheckCircle2,
  Wifi, Snowflake, SlidersHorizontal, Database
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
  glass: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.06)',
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
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1.25rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(30px)', borderBottom: `1px solid ${theme.glassBorder}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
       <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px var(--primary-glow)' }}>
          <Zap size={18} color="#fff" fill="#fff" />
       </div>
       <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: theme.text1 }}>Paypee</span>
    </div>
    <div className="desktop-only" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
       {['Features', 'Wallets', 'Cards', 'Transfers', 'Crypto', 'AI', 'Payments'].map(item => (
         <button key={item} onClick={() => onNavigate(item.toLowerCase().replace(' ', ''))} style={{ background: 'transparent', border: 'none', color: theme.text2, fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s', cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = theme.text1} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>{item}</button>
       ))}
    </div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
       <button onClick={onAuth} style={{ background: 'transparent', color: theme.text1, border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
       <button onClick={onAuth} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '14px', fontWeight: 900, fontSize: '0.9rem' }}>Get Started</button>
    </div>
  </nav>
);

const InnerHero = ({ title, subtitle }: { title: string, subtitle: string }) => (
   <section style={{ padding: '12rem 0 4rem', textAlign: 'center', background: `radial-gradient(circle at top center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)` }}>
      <h1 className="text-glow" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, color: theme.text1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', color: theme.text2, maxWidth: '700px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>{subtitle}</p>
   </section>
);

// 1. Hero Section
const HeroSection = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '5rem' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vw', height: '90vw', background: `radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)`, zIndex: 0, filter: 'blur(80px)' }} />
      <div className="mesh-bg" style={{ opacity: 0.15 }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.5rem', ...glassPanel, borderRadius: '99px', color: theme.cyan, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '3rem', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
             <Activity size={16} /> GLOBAL FINANCE APP v4.0
          </div>
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '1.5rem', color: theme.text1 }}>
             Global Finance.<br />
             <span className="text-glow">Unified & Instant.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: theme.text2, maxWidth: '750px', margin: '0 auto 3.5rem', lineHeight: 1.7, fontWeight: 500 }}>
             Hold any currency, send money worldwide in seconds, swap crypto and let <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Sentinel AI</span> help you — all in one simple app.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
             <motion.button 
               onClick={onAuth} 
               whileHover={{ scale: 1.05, y: -5 }} 
               whileTap={{ scale: 0.95 }} 
               className="btn btn-primary"
               style={{ padding: '1.5rem 4rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem' }}
             >
                Get Started
             </motion.button>
             <motion.button 
               onClick={onAuth} 
               whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }} 
               whileTap={{ scale: 0.95 }} 
               className="btn btn-outline"
               style={{ padding: '1.5rem 4rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem' }}
             >
                Try Demo Terminal
             </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '12%', top: '35%', ...glassPanel, padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', background: 'rgba(10,15,44,0.6)' }}>
         <div style={{ background: `rgba(34, 211, 238, 0.15)`, padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(34, 211, 238, 0.2)' }}><Wallet size={24} color={theme.cyan} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>USD CAPITAL</div><div style={{ color: theme.text1, fontWeight: 900, fontSize: '1.2rem' }}>$24,580.00</div></div>
      </motion.div>
      <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ position: 'absolute', right: '12%', top: '45%', ...glassPanel, padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', background: 'rgba(10,15,44,0.6)' }}>
         <div style={{ background: `rgba(167, 139, 250, 0.15)`, padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(167, 139, 250, 0.2)' }}><Cpu size={24} color={theme.purple} /></div>
         <div><div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>CRYPTOCURRENCY</div><div style={{ color: theme.text1, fontWeight: 900, fontSize: '1.2rem' }}>0.8421 BTC <span style={{color: '#10b981', fontSize: '0.85rem', fontWeight: 900}}>+18.4%</span></div></div>
      </motion.div>
    </section>
  );
};

// 2. Live Financial Preview
const LivePreview = () => (
  <section style={{ padding: '6rem 0', position: 'relative', zIndex: 20 }}>
    <div className="container" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
       <div style={{ color: theme.text2, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.75rem' }}>TERMINAL PREVIEW</div>
       <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>High-Velocity Dashboard</h2>
       <p style={{ color: theme.text2, fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>Real-time telemetry, institutional asset rails, and AI security sentinel — all in one calm interface.</p>
    </div>
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
       <motion.div 
         initial={{ opacity: 0, y: 100, rotateX: 10 }} 
         whileInView={{ opacity: 1, y: 0, rotateX: 0 }} 
         viewport={{ once: true, margin: "-100px" }} 
         transition={{ duration: 1.2, type: "spring", bounce: 0.2 }} 
         className="premium-card"
         style={{ width: '100%', maxWidth: '1100px', background: `linear-gradient(180deg, rgba(10, 15, 44, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)`, overflow: 'hidden', position: 'relative', padding: 0 }}
       >
          <div className="mesh-bg" style={{ opacity: 0.1 }} />
          <div style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', position: 'relative', zIndex: 10 }}>
             <div>
                <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>AGGREGATE PORTFOLIO</div>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: theme.text1, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>$128,450<span style={{ opacity: 0.4 }}>.20</span></div>
                <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <TrendingUp size={20} /> + $2,340.42 <span style={{ opacity: 0.6, fontSize: '0.9rem', fontWeight: 600 }}>this cycle</span>
                </div>
                <div style={{ height: '240px', background: `linear-gradient(to top, rgba(99, 102, 241, 0.1), transparent)`, borderBottom: `2px solid ${theme.primary}`, position: 'relative', borderRadius: '12px' }}>
                   <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                           <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
                        </linearGradient>
                     </defs>
                     <path d="M0,80 Q20,60 40,75 T80,30 T100,10" fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" />
                   </svg>
                   <div style={{ position: 'absolute', top: '10px', right: '10px', width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--primary)' }} />
                </div>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ color: theme.text1, fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Activity size={20} color="var(--primary)" /> Protocol Telemetry
                </h3>
                {[
                  { label: 'Stripe Settlement', time: 'Today · 10:24', val: '+$2,400.00', color: 'var(--accent)' },
                  { label: 'Cloud Infrastructure', time: 'Yesterday · 18:42', val: '-$80.00', color: '#fff' },
                  { label: 'Capital Ingress', time: 'Yesterday · 09:12', val: '+₦450,000', color: 'var(--accent)' },
                  { label: 'Crypto Swap → USDT', time: '2 days ago', val: '-0.012 BTC', color: theme.purple }
                ].map((item, idx) => (
                  <div key={idx} style={{ ...glassPanel, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <div style={{ color: theme.text1, fontWeight: 800, fontSize: '1.05rem' }}>{item.label}</div>
                       <div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 600 }}>{item.time}</div>
                    </div>
                    <div style={{ color: item.color, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>{item.val}</div>
                  </div>
                ))}
             </div>
          </div>
       </motion.div>
    </div>
  </section>
);

const TrendingUp = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;

// 3. Core Capabilities
const Capabilities = () => (
  <section id="features" style={{ padding: '6rem 0' }}>
    <div className="container">
       <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ color: theme.text2, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.75rem' }}>CAPABILITIES</div>
          <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, letterSpacing: '-0.03em' }}>Institutional Infrastructure</h2>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {[
            { t: 'Multi-Currency Rails', d: 'Hold and deploy USD, EUR, GBP, NGN, and crypto across 30+ regional rails.', i: <Globe color={theme.cyan} size={36}/>, color: theme.cyan },
            { t: 'Platinum Virtual Cards', d: 'Issue unlimited Mastercard rails. High limits, zero FX spreads, instant provisioning.', i: <CreditCard color={theme.purple} size={36}/>, color: theme.purple },
            { t: 'Global Settlements', d: 'Send capital to 80+ countries via high-velocity rails with real-time tracking.', i: <Repeat color={theme.primary} size={36}/>, color: theme.primary },
            { t: 'Asset Swap Engine', d: 'Aggregated liquidity for instant fiat & crypto conversion at industrial-grade rates.', i: <Cpu color={theme.cyan} size={36}/>, color: theme.cyan },
            { t: 'Sentinel AI Manager', d: 'Authorized assistant that monitors volatility, secures value, and automates growth.', i: <Bot color={theme.purple} size={36}/>, color: theme.purple },
            { t: 'Encrypted Security', d: 'Bank-grade hardening, biometric protocol, and 24/7 fraud sentinel monitoring.', i: <ShieldCheck color={theme.primary} size={36}/>, color: theme.primary }
          ].map((item, i) => (
             <motion.div key={i} whileHover={{ y: -12, boxShadow: `0 30px 60px rgba(0,0,0,0.5)` }} className="premium-card" style={{ padding: '4rem 2.5rem', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '180px', height: '180px', background: `radial-gradient(circle, ${item.color}30 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }} />
                <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 10 }}>{item.i}</div>
                <h3 style={{ fontSize: '1.7rem', color: theme.text1, fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', position: 'relative', zIndex: 10 }}>{item.t}</h3>
                <p style={{ color: theme.text2, lineHeight: 1.7, fontWeight: 500, fontSize: '1.05rem', position: 'relative', zIndex: 10 }}>{item.d}</p>
             </motion.div>
          ))}
       </div>
    </div>
  </section>
);

// 4. Multi-Currency System
const MultiCurrency = () => (
  <section id="wallets" style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}`, position: 'relative' }}>
     <div className="mesh-bg" style={{ opacity: 0.05 }} />
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
           <div>
              <div style={{ color: theme.cyan, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>CURRENCY RAILS</div>
              <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>Global Capital.<br/>Single Registry.</h2>
              <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 500 }}>Switch between fiat and digital assets in one tap. High-fidelity settlement engine ensures real-time parity across all global regions.</p>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                 { label: 'US Dollar Rail', val: '$24,580.00', bg: 'rgba(99, 102, 241, 0.08)' },
                 { label: 'Euro Rail', val: '€18,240.50', bg: 'rgba(167, 139, 250, 0.08)' },
                 { label: 'Naira Rail', val: '₦8,420,000', bg: 'rgba(34, 211, 238, 0.08)' },
                 { label: 'Bitcoin Protocol', val: '₿0.8421', bg: 'rgba(245, 158, 11, 0.08)' },
                 { label: 'Tether Protocol', val: '₮12,000.00', bg: 'rgba(16, 185, 129, 0.08)' },
                 { label: 'Pound Rail', val: '£3,210.00', bg: 'rgba(236, 72, 153, 0.08)' },
              ].map((c, i) => (
                 <motion.div key={i} whileHover={{ scale: 1.05 }} className="premium-card" style={{ padding: '2rem', background: c.bg, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>{c.label.toUpperCase()}</div>
                    <div style={{ color: theme.text1, fontWeight: 900, fontSize: '1.4rem', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>{c.val}</div>
                 </motion.div>
              ))}
           </div>
        </div>
     </div>
  </section>
);

// 5. Virtual Cards Experience
const VirtualCards = () => (
  <section id="cards" style={{ padding: '8rem 0', overflow: 'hidden' }}>
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
           {/* Left side: Cards Stack */}
           <div style={{ position: 'relative', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Back Card */}
              <motion.div animate={{ rotate: -15, x: -80, y: 30 }} style={{ position: 'absolute', zIndex: 1, width: '380px', height: '240px', background: `linear-gradient(135deg, ${theme.purple}, #c084fc)`, borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 40px 80px rgba(0,0,0,0.6)` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.04em' }}>paypee</div>
                    <Wifi size={24} color="#fff" style={{ transform: 'rotate(90deg)' }} />
                 </div>
                 <div>
                    <div style={{ fontSize: '1.6rem', letterSpacing: '6px', color: '#fff', fontWeight: 600, marginBottom: '1.5rem' }}>•••• •••• •••• 8421</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.4rem' }}>CARDHOLDER</div>
                          <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>SARAH OKAFOR</div>
                       </div>
                       <div style={{ display: 'flex' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', marginLeft: '-16px' }}></div>
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* Front Card */}
              <motion.div animate={{ rotate: 8, x: 40, y: 15 }} style={{ position: 'absolute', zIndex: 3, width: '400px', height: '250px', background: `linear-gradient(135deg, ${theme.primary}, #818cf8)`, borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 50px 100px rgba(0,0,0,0.7)` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.6rem', color: '#fff', letterSpacing: '-0.04em' }}>paypee</div>
                    <Wifi size={28} color="#fff" style={{ transform: 'rotate(90deg)' }} />
                 </div>
                 <div>
                    <div style={{ fontSize: '1.8rem', letterSpacing: '10px', color: '#fff', fontWeight: 600, marginBottom: '1.5rem' }}>•••• 9034</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 900, letterSpacing: '3px', marginBottom: '0.5rem' }}>CARDHOLDER</div>
                          <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>SARAH OKAFOR</div>
                       </div>
                       <div style={{ display: 'flex' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></div>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', marginLeft: '-18px' }}></div>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>

           {/* Right side: Text Content */}
           <div>
              <div style={{ color: theme.purple, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>CAPITAL RAILS</div>
              <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>Platinum Rails.<br/>Absolute Agency.</h2>
              <p style={{ color: theme.text2, fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.7, fontWeight: 500 }}>Issue unlimited virtual Mastercard rails for subscriptions, corporate travel, or global spending. Set precise thresholds and freeze rails instantly.</p>
              
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                 <div className="premium-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '280px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                       <Snowflake color={theme.cyan} size={24} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 900, color: theme.text1, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Instant Freeze</div>
                       <div style={{ fontSize: '0.9rem', color: theme.text2, fontWeight: 500 }}>Zero latency protection.</div>
                    </div>
                 </div>
                 <div className="premium-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '280px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                       <SlidersHorizontal color={theme.purple} size={24} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 900, color: theme.text1, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Threshold Logic</div>
                       <div style={{ fontSize: '0.9rem', color: theme.text2, fontWeight: 500 }}>Granular spending control.</div>
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
  <section style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}`, position: 'relative' }}>
     <div className="mesh-bg" style={{ opacity: 0.05 }} />
     <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
           <div className="premium-card" style={{ padding: '4rem', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ ...glassPanel, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>RECIPIENT</div>
                 <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff' }}>Adaeze N.</div>
                 <div style={{ color: theme.text2, fontSize: '0.9rem', fontWeight: 500 }}>GTBank · Nigeria · 0124458291</div>
              </div>
              <div style={{ ...glassPanel, padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(34, 211, 238, 0.2)', background: 'rgba(34, 211, 238, 0.02)' }}>
                 <div style={{ color: theme.text2, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>VOLUME</div>
                 <div style={{ fontWeight: 900, fontSize: '2.2rem', color: theme.text1, letterSpacing: '-0.02em' }}>$1,200.00</div>
                 <div style={{ color: theme.cyan, fontSize: '1rem', fontWeight: 800 }}>≈ ₦1,800,000.00</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.95rem', fontWeight: 600 }}>Velocity</div>
                 <div style={{ color: theme.text1, fontWeight: 900 }}>INSTANT <span style={{ color: theme.text2, fontWeight: 500 }}>(~12 sec)</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                 <div style={{ color: theme.text2, fontSize: '0.95rem', fontWeight: 600 }}>Protocol Fee</div>
                 <div style={{ color: theme.text1, fontWeight: 900 }}>$0.40 <span style={{ color: theme.primary, fontWeight: 500 }}>(TRANSPARENT FX)</span></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', fontWeight: 900, fontSize: '1.1rem' }}>Execute Settlement</button>
           </div>
           <div>
              <div style={{ color: theme.primary, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>GLOBAL SETTLEMENTS</div>
              <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>Capital Movement.<br/>Accelerated.</h2>
              <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 500 }}>80+ countries. 40+ currencies. Eliminate banking latency with our high-velocity settlement network. Send capital worldwide like sending a text.</p>
           </div>
        </div>
     </div>
  </section>
);

// 7. Crypto & Swap Engine
const CryptoSwap = () => (
   <section id="crypto" style={{ padding: '8rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
         <div style={{ color: theme.cyan, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>ASSET SWAP ENGINE</div>
         <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Liquidity on Demand.</h2>
         <p style={{ color: theme.text2, fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto 5rem', fontWeight: 500, lineHeight: 1.7 }}>Trade fiat and digital assets with near-zero spreads. Aggregated liquidity from global registries gives you the best execution price, every time.</p>
         
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div className="premium-card" style={{ padding: '3rem', width: '340px', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}>
               <div style={{ color: theme.text2, fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.75rem' }}>YOU PAY</div>
               <div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.text1, letterSpacing: '-0.02em' }}>1.24 BTC</div>
               <div style={{ color: theme.text2, fontSize: '0.85rem', fontWeight: 600 }}>LIQUIDITY: 1.24 BTC</div>
            </div>
            <div style={{ width: 64, height: 64, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 30px var(--primary-glow)' }}>
               <Repeat size={32} strokeWidth={3} />
            </div>
            <div className="premium-card" style={{ padding: '3rem', width: '340px', textAlign: 'left', borderColor: theme.cyan, background: 'rgba(34, 211, 238, 0.02)' }}>
               <div style={{ color: theme.text2, fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.75rem' }}>YOU RECEIVE <span style={{ background: theme.cyan, color: '#000', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, marginLeft: '0.5rem' }}>OPTIMIZED</span></div>
               <div style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.cyan, letterSpacing: '-0.02em' }}>$32,540<span style={{ opacity: 0.4 }}>.00</span></div>
            </div>
         </div>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '6rem', marginTop: '6rem' }}>
            <div><div style={{ fontSize: '3rem', fontWeight: 900 }}>120+</div><div style={{ color: theme.text2, fontWeight: 800, letterSpacing: '1px' }}>ASSET PAIRS</div></div>
            <div><div style={{ fontSize: '3rem', fontWeight: 900 }}>1.4s</div><div style={{ color: theme.text2, fontWeight: 800, letterSpacing: '1px' }}>AVG SETTLEMENT</div></div>
            <div><div style={{ fontSize: '3rem', fontWeight: 900 }}>0.1%</div><div style={{ color: theme.text2, fontWeight: 800, letterSpacing: '1px' }}>PROTOCOL FEE</div></div>
         </div>
      </div>
   </section>
);

// 8. Paypee AI
const PaypeeAI = () => (
   <section style={{ padding: '8rem 0', background: `linear-gradient(180deg, ${theme.bg}, rgba(167, 139, 250, 0.08), ${theme.bg})`, borderTop: `1px solid ${theme.glassBorder}`, position: 'relative' }}>
      <div className="mesh-bg" style={{ opacity: 0.05 }} />
      <div className="container">
         <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ width: 80, height: 80, background: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#fff', boxShadow: '0 20px 40px -10px var(--primary-glow)' }}>
               <Bot size={48} />
            </div>
            <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Capital Intelligence.</h2>
            <p style={{ color: theme.text2, fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', fontWeight: 500, lineHeight: 1.7 }}>Sentinel AI monitors global markets, currency volatility, and your capital flows — acting autonomously to preserve and grow your value.</p>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {[
              { t: 'Inflation Shield', d: 'Automatically shifted $2,400 from NGN to USDT to neutralize local currency volatility.', i: ShieldCheck, c: theme.cyan },
              { t: 'Velocity Optimization', d: 'Identified 18% savings on recurring rails. Estimated annual yield increase: $890.', i: BarChart3, c: theme.primary },
              { t: 'Smart Settlement', d: 'Routing EUR transfers via Tuesday liquidity pools. Execution rate improved by 0.45%.', i: Zap, c: theme.purple }
            ].map((item, idx) => (
              <div key={idx} className="premium-card" style={{ padding: '3rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                   <div style={{ color: item.c, background: `${item.c}15`, padding: '0.75rem', borderRadius: '14px', border: `1px solid ${item.c}20` }}><item.i size={24} /></div>
                   <h3 style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>{item.t}</h3>
                </div>
                <p style={{ color: theme.text2, lineHeight: 1.7, fontWeight: 500, fontSize: '1rem' }}>{item.d}</p>
              </div>
            ))}
         </div>
      </div>
   </section>
);

// 9. Security & Trust
const Security = () => (
   <section style={{ padding: '8rem 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
         <div>
            <div style={{ color: theme.primary, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>HARDENED SECURITY</div>
            <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}>Fortified Assets.<br/>Seamless Access.</h2>
            <p style={{ color: theme.text2, fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 500 }}>Your capital and identity are protected by institutional-grade encryption protocols trusted by the world's leading financial entities.</p>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {[
              { i: Lock, t: 'AES-256 Encryption', d: 'End-to-end hardening for all transaction payloads.', c: theme.cyan },
              { i: ShieldCheck, t: 'PCI-DSS v4.0', d: 'Industrial compliance for payment rail integrity.', c: theme.purple },
              { i: Smartphone, t: 'Biometric Auth', d: 'FaceID, TouchID & Passkey authorization.', c: theme.primary },
              { i: Activity, t: 'Sentinel Monitoring', d: '24/7 autonomous anomaly & fraud detection.', c: theme.cyan }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ color: item.c, marginBottom: '1.25rem' }}><item.i size={32} /></div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>{item.t}</div>
                <div style={{ color: theme.text2, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            ))}
         </div>
      </div>
   </section>
);

// 10. For Who Section
const ForWho = ({ onAuth }: { onAuth: () => void }) => (
   <section id="forwho" style={{ padding: '8rem 0', background: theme.bg2, borderTop: `1px solid ${theme.glassBorder}`, position: 'relative' }}>
      <div className="mesh-bg" style={{ opacity: 0.05 }} />
      <div className="container">
         <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ color: theme.cyan, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.75rem' }}>CLIENT PROFILES</div>
            <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: theme.text1, letterSpacing: '-0.04em' }}>Provisioned for All.</h2>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {[
              { t: 'Individuals', p: 'Deploy capital, send globally, and spend with high-velocity rails.', items: ['Multi-currency rails', 'Free platinum cards', 'AI value preservation'], btn: 'btn-outline', color: theme.primary },
              { t: 'Businesses', p: 'Scale global operations, manage team rails, and settle in seconds.', items: ['Institutional payouts', 'Team capital rails', 'Accounting synchronization'], btn: 'btn-primary', color: theme.cyan, active: true },
              { t: 'Developers', p: 'Engineer custom money flows with our advanced API and SDK registry.', items: ['REST + Real-time Webhooks', 'High-fidelity sandbox', 'Open source SDK registry'], btn: 'btn-outline', color: theme.purple }
            ].map((card, i) => (
              <div key={i} className="premium-card" style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', background: card.active ? `linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(2, 6, 23, 0.5) 100%)` : 'rgba(255,255,255,0.01)', border: card.active ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                 <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: theme.text1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>{card.t}</h3>
                 <p style={{ color: theme.text2, lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.05rem', fontWeight: 500 }}>{card.p}</p>
                 <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', color: theme.text1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {card.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>
                        <CheckCircle2 size={18} color={card.color} /> {item}
                      </li>
                    ))}
                 </ul>
                 <button onClick={onAuth} className={`btn ${card.btn}`} style={{ marginTop: 'auto', padding: '1.1rem', borderRadius: '18px', fontWeight: 900 }}>Deploy {card.t} Protocol</button>
              </div>
            ))}
         </div>
      </div>
   </section>
);

// 11. Social Proof
const SocialProof = () => (
   <section style={{ padding: '8rem 0' }}>
      <div className="container">
         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5rem', marginBottom: '6rem', textAlign: 'center' }}>
            {[
              { l: 'ACTIVE TERMINALS', v: '2.4M+', c: theme.primary },
              { l: 'ANNUAL SETTLEMENTS', v: '$18B', c: theme.cyan },
              { l: 'GLOBAL REGIONS', v: '80+', c: theme.purple },
              { l: 'APP STORE RATING', v: '4.9★', c: theme.text1 }
            ].map((s, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: s.c, letterSpacing: '-0.04em' }}>{s.v}</div>
                <div style={{ color: theme.text2, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '2px', marginTop: '0.5rem' }}>{s.l}</div>
              </div>
            ))}
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
            {[
              { n: 'Amaka Eze', r: 'Freelance Designer', t: '"Paypee replaced 4 different apps for me. Getting paid in USD and spending in NGN has never been smoother."' },
              { n: 'Daniel Park', r: 'Founder, Slate Studio', t: '"We pay our entire remote team through Paypee. Setup took 10 minutes. Reconciliation is finally pleasant."' },
              { n: 'Lina Costa', r: 'Crypto Trader', t: '"The swap rates are noticeably better than my exchange. And the rails just… work, everywhere."' }
            ].map((test, idx) => (
              <div key={idx} className="premium-card" style={{ padding: '3rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '0.3rem', color: '#FBBF24', marginBottom: '1.5rem' }}><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div>
                <p style={{ color: theme.text1, fontSize: '1.2rem', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 500, fontStyle: 'italic' }}>{test.t}</p>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{test.n}</div>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>{test.r.toUpperCase()}</div>
                </div>
              </div>
            ))}
         </div>
      </div>
   </section>
);

// 12. CTA
const CTA = ({ onAuth }: { onAuth: () => void }) => (
   <section style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${theme.primary}20 0%, transparent 60%)` }} />
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
         <div className="premium-card" style={{ padding: '6rem 4rem', background: 'rgba(10,15,44,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: theme.text1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Execute Your Global Vision.</h2>
            <p style={{ color: theme.text2, fontSize: '1.25rem', marginBottom: '3.5rem', fontWeight: 500 }}>Setup takes under 60 seconds. Deploy your financial terminal today.</p>
            <motion.button 
              onClick={onAuth} 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              style={{ padding: '1.5rem 4.5rem', borderRadius: '24px', fontWeight: 900, fontSize: '1.25rem' }}
            >
               Provision Account
            </motion.button>
         </div>
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
      
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
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
              <InnerHero title="Institutional Features" subtitle="Everything you need in one powerful financial terminal." />
              <Capabilities />
              <Security />
            </>
          )}

          {page === 'wallets' && (
            <>
              <InnerHero title="Multi-Currency Rails" subtitle="Every currency. One balance you can trust." />
              <LandingWallets />
            </>
          )}

          {page === 'cards' && (
            <>
              <InnerHero title="Capital Rails" subtitle="Beautiful cards. Total agency." />
              <LandingCards />
            </>
          )}

          {page === 'transfers' && (
            <>
              <InnerHero title="Global Settlements" subtitle="Move capital worldwide like sending a text." />
              <LandingTransfers />
            </>
          )}

          {page === 'crypto' && (
            <>
              <InnerHero title="Asset Swap Engine" subtitle="Trade fiat and digital assets with near-zero spreads." />
              <LandingCrypto />
            </>
          )}

          {page === 'ai' && (
            <>
              <InnerHero title="Sentinel AI" subtitle="An authoritative assistant that grows your capital quietly." />
              <LandingAI />
            </>
          )}

          {page === 'payments' && (
            <>
              <InnerHero title="Operating Expenses" subtitle="Pay bills instantly, never miss a settlement date." />
              <LandingPayments />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <CTA onAuth={onAuth} />
      
      <footer style={{ padding: '8rem 0 4rem', borderTop: `1px solid ${theme.glassBorder}`, background: theme.bg, position: 'relative' }}>
        <div className="mesh-bg" style={{ opacity: 0.05 }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            <div style={{ gridColumn: '1 / -1', maxWidth: '400px', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px var(--primary-glow)' }}>
                    <Zap size={22} color="#fff" fill="#fff" />
                 </div>
                 <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.04em', color: theme.text1, cursor: 'pointer' }} onClick={() => setPage('home')}>Paypee</span>
              </div>
              <p style={{ color: theme.text2, lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 500 }}>The advanced financial OS made simple for everyone. Hold, send, spend, and grow capital — globally and instantly.</p>
            </div>
            
            {[
              { h: 'Individuals', links: ['Wallets', 'Virtual Cards', 'Send Money', 'Crypto', 'AI Manager'] },
              { h: 'Businesses', links: ['Payouts', 'Team Cards', 'Invoicing', 'Treasury', 'Pricing'] },
              { h: 'Developers', links: ['API Registry', 'SDK Docs', 'Webhooks', 'Sandbox', 'System Status'] },
              { h: 'Company', links: ['About', 'Careers', 'Press', 'Security', 'Contact'] },
              { h: 'Legal', links: ['Privacy', 'Terms', 'Compliance', 'Cookies', 'AML Policy'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 style={{ marginBottom: '2rem', color: theme.text1, fontWeight: 900, fontSize: '1rem', letterSpacing: '1px' }}>{col.h.toUpperCase()}</h5>
                <ul style={{ listStyle: 'none', padding: 0, color: theme.text2, lineHeight: 2.8, fontSize: '0.95rem', fontWeight: 600 }}>
                  {col.links.map(l => (
                    <li key={l} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = theme.text2}>{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ fontSize: '0.9rem', color: theme.text2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', borderTop: `1px solid ${theme.glassBorder}`, paddingTop: '3rem', gap: '2rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Database size={16} /> <span>Paypee Protocol v4.0.2 Stable</span>
            </div>
            <span>© 2026 Paypee Financial Inc. Engineered with precision.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
