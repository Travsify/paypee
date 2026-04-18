import React from 'react';
import { Repeat, TrendingUp, History, ArrowDownRight, Activity } from 'lucide-react';

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

const LandingCrypto = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
         <div style={{ padding: '4rem 0' }}>
            {/* 1. Swap interface & 2. Live Rate & 3. Before/After */}
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Crypto Swap</h2>
            <div style={{ ...glassPanel, padding: '2rem' }}>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You pay</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '2rem', fontWeight: 800 }}>$5,000</div>
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>USD</div>
                  </div>
                  <div style={{ color: theme.text2, fontSize: '0.8rem', marginTop: '0.5rem' }}>Balance: $12,450.00</div>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', margin: '-1.5rem 0' }}>
                  <div style={{ width: 40, height: 40, background: theme.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, border: `4px solid ${theme.bg}` }}>
                     <Repeat size={18} color="#fff" />
                  </div>
               </div>

               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginTop: '1rem', marginBottom: '2rem' }}>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You receive</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '2rem', fontWeight: 800, color: theme.purple }}>0.074</div>
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>BTC</div>
                  </div>
                  <div style={{ color: theme.text2, fontSize: '0.8rem', marginTop: '0.5rem' }}>Live Rate: 1 BTC = $67,520</div>
               </div>
               
               <button style={{ width: '100%', padding: '1.2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>Preview Swap</button>
            </div>
         </div>

         <div style={{ padding: '4rem 0' }}>
            {/* 4. Transaction Preview & 5. Market Trends */}
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Market Pulse</h2>
            <div style={{ ...glassPanel, padding: '2rem', marginBottom: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F7931A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>₿</div>
                     <div>
                        <div style={{ fontWeight: 700 }}>Bitcoin</div>
                        <div style={{ color: theme.text2, fontSize: '0.85rem' }}>BTC</div>
                     </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>$67,520</div>
                     <div style={{ color: theme.cyan, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><TrendingUp size={14} /> +4.2%</div>
                  </div>
               </div>
               <div style={{ height: '120px', width: '100%', background: `linear-gradient(180deg, rgba(34, 211, 238, 0.2) 0%, transparent 100%)`, borderRadius: '12px', borderBottom: `2px solid ${theme.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity color={theme.cyan} size={32} opacity={0.5} />
               </div>
            </div>

            {/* 6. History of swaps */}
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Recent Swaps</h3>
            <div style={{ ...glassPanel, padding: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: `1px solid ${theme.glassBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Repeat size={16} color={theme.purple} />
                     </div>
                     <div>
                        <div style={{ fontWeight: 600 }}>Swap NGN to USDT</div>
                        <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Yesterday</div>
                     </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>+450 USDT</div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Repeat size={16} color={theme.cyan} />
                     </div>
                     <div>
                        <div style={{ fontWeight: 600 }}>Swap USD to ETH</div>
                        <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Mar 12</div>
                     </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>+0.42 ETH</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LandingCrypto;
