import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, History, Plus, Repeat, BarChart3, TrendingUp, CreditCard } from 'lucide-react';

const theme = {
  bg: '#020617',
  bg2: '#0A0F2C',
  primary: '#6366F1',
  cyan: '#22D3EE',
  purple: '#A78BFA',
  text1: '#FFFFFF',
  text2: '#94A3B8',
  glass: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)'
};

const glassPanel = {
  background: theme.glass,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: `1px solid ${theme.glassBorder}`,
};

const LandingWallets = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      {/* 1. All currency wallets grid */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Global Wallets</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
               {['USD', 'EUR', 'NGN', 'GBP'].map(currency => (
                 <motion.div key={currency} whileHover={{ y: -5 }} style={{ ...glassPanel, padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                       <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{currency}</div>
                       <Wallet color={theme.primary} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>$12,450.00</div>
                    <div style={{ color: theme.cyan, fontSize: '0.9rem' }}>+2.4% this week</div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 2. Wallet detail view */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container">
            <div style={{ ...glassPanel, padding: '3rem', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
               <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ color: theme.text2, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>United States Dollar</div>
                  <h3 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '2rem' }}>$45,230.50</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <button style={{ padding: '1rem 2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><Plus size={18} /> Add Money</button>
                     <button style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><ArrowUpRight size={18} /> Send</button>
                  </div>
               </div>
               <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1rem' }}>
                        <span style={{ color: theme.text2 }}>Routing Number</span>
                        <span style={{ fontWeight: 600 }}>021000021</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1rem' }}>
                        <span style={{ color: theme.text2 }}>Account Number</span>
                        <span style={{ fontWeight: 600 }}>**** 8492</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.text2 }}>Bank Name</span>
                        <span style={{ fontWeight: 600 }}>Community Federal</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Transaction history */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container">
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><History color={theme.purple} /> Recent Activity</h3>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               {[1,2,3,4].map((_, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: i !== 3 ? `1px solid ${theme.glassBorder}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowDownRight color={theme.cyan} />
                       </div>
                       <div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Upwork Escrow Inc.</div>
                          <div style={{ color: theme.text2, fontSize: '0.9rem' }}>Today, 10:42 AM</div>
                       </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: theme.cyan }}>+$2,400.00</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. Add / receive funds UI */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>Fund Your Wallet Instantly</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
               <div style={{ ...glassPanel, padding: '2rem', width: '280px' }}>
                  <CreditCard size={32} color={theme.purple} style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Debit Card</h4>
                  <p style={{ color: theme.text2, fontSize: '0.9rem' }}>Instant funding via Visa/Mastercard.</p>
               </div>
               <div style={{ ...glassPanel, padding: '2rem', width: '280px' }}>
                  <BarChart3 size={32} color={theme.primary} style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Bank Transfer</h4>
                  <p style={{ color: theme.text2, fontSize: '0.9rem' }}>Wire or ACH from any local bank.</p>
               </div>
               <div style={{ ...glassPanel, padding: '2rem', width: '280px' }}>
                  <TrendingUp size={32} color={theme.cyan} style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Crypto Deposit</h4>
                  <p style={{ color: theme.text2, fontSize: '0.9rem' }}>Send USDT/BTC and auto-convert.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Currency conversion preview */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ ...glassPanel, padding: '3rem', width: '100%', maxWidth: '600px' }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Convert Instantly</h3>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You spend</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '2rem', fontWeight: 800 }}>$1,000</div>
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>USD</div>
                  </div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'center', margin: '-1.5rem 0' }}>
                  <div style={{ width: 40, height: 40, background: theme.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, border: `4px solid ${theme.bg}` }}>
                     <Repeat size={18} color="#fff" />
                  </div>
               </div>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginTop: '1rem', marginBottom: '2rem' }}>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You receive</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '2rem', fontWeight: 800, color: theme.cyan }}>₦1,550,000</div>
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>NGN</div>
                  </div>
               </div>
               <button style={{ width: '100%', padding: '1.2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>Convert Now</button>
            </div>
         </div>
      </section>

      {/* 6. Insights */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container">
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Spending Insights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
               <div style={{ ...glassPanel, padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 150, height: 150, borderRadius: '50%', background: `conic-gradient(${theme.primary} 0% 60%, ${theme.cyan} 60% 85%, ${theme.purple} 85% 100%)`, marginBottom: '2rem' }}></div>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: theme.primary, borderRadius: '2px' }}></div> USD</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: theme.cyan, borderRadius: '2px' }}></div> NGN</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: theme.purple, borderRadius: '2px' }}></div> EUR</div>
                  </div>
               </div>
               <div style={{ ...glassPanel, padding: '2.5rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Top Categories</h4>
                  {[
                    { label: 'Software Subscriptions', val: '$450.00', pct: '65%' },
                    { label: 'Travel & Flights', val: '$210.00', pct: '25%' },
                    { label: 'Food & Dining', val: '$85.00', pct: '10%' }
                  ].map(cat => (
                    <div key={cat.label} style={{ marginBottom: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          <span>{cat.label}</span>
                          <span style={{ fontWeight: 600 }}>{cat.val}</span>
                       </div>
                       <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                          <div style={{ width: cat.pct, height: '100%', background: theme.primary, borderRadius: '3px' }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingWallets;
