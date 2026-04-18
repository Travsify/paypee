import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Snowflake, SlidersHorizontal, EyeOff, ArrowDownRight, PieChart } from 'lucide-react';

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

const LandingCards = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      {/* 1. Card overview (stacked cards) */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Your Cards</h2>
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '2rem' }}>
               <div style={{ width: '320px', minWidth: '320px', height: '200px', background: `linear-gradient(135deg, ${theme.primary}, ${theme.purple})`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>paypee</div>
                  <div>
                     <div style={{ fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 600, marginBottom: '1rem' }}>•••• 9034</div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sarah Okafor</div>
                  </div>
               </div>
               <div style={{ width: '320px', minWidth: '320px', height: '200px', background: `linear-gradient(135deg, ${theme.cyan}, #06b6d4)`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>paypee</div>
                  <div>
                     <div style={{ fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 600, marginBottom: '1rem' }}>•••• 2256</div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Marketing Spend</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. Create new card UI */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Spin up a new card in seconds</h3>
            <div style={{ ...glassPanel, padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
               <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <Plus size={32} color={theme.primary} />
               </div>
               <input type="text" placeholder="Card Name (e.g., Facebook Ads)" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff', marginBottom: '1rem' }} />
               <select style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff', marginBottom: '2rem' }}>
                  <option>Virtual Card</option>
                  <option>Single-Use Card</option>
               </select>
               <button style={{ width: '100%', padding: '1.2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>Generate Card</button>
            </div>
         </div>
      </section>

      {/* 3. Card details & 4. Controls */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
               <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Card Details</h3>
                  <div style={{ ...glassPanel, padding: '2rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1.5rem' }}>
                        <span style={{ color: theme.text2 }}>Card Number</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ fontWeight: 600 }}>4532 9034 2210 8421</span>
                           <EyeOff size={16} color={theme.text2} />
                        </div>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1.5rem' }}>
                        <span style={{ color: theme.text2 }}>Expiry</span>
                        <span style={{ fontWeight: 600 }}>12/28</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: theme.text2 }}>CVV</span>
                        <span style={{ fontWeight: 600 }}>***</span>
                     </div>
                  </div>
               </div>
               <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Controls</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div style={{ ...glassPanel, padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                        <Snowflake size={32} color={theme.cyan} style={{ margin: '0 auto 1rem' }} />
                        <div style={{ fontWeight: 700 }}>Freeze Card</div>
                     </div>
                     <div style={{ ...glassPanel, padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                        <SlidersHorizontal size={32} color={theme.purple} style={{ margin: '0 auto 1rem' }} />
                        <div style={{ fontWeight: 700 }}>Set Limits</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Transactions per card & 6. Analytics */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
               <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Card Transactions</h3>
               <div style={{ ...glassPanel, padding: '2rem' }}>
                  {[1,2,3].map((_, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i !== 2 ? `1px solid ${theme.glassBorder}` : 'none' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <CreditCard size={18} color={theme.purple} />
                          </div>
                          <div>
                             <div style={{ fontWeight: 600 }}>Netflix Subscription</div>
                             <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Yesterday</div>
                          </div>
                       </div>
                       <div style={{ fontWeight: 700 }}>-$15.99</div>
                    </div>
                  ))}
               </div>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
               <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Card Analytics</h3>
               <div style={{ ...glassPanel, padding: '2rem', textAlign: 'center' }}>
                  <PieChart size={48} color={theme.cyan} style={{ margin: '0 auto 2rem' }} />
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>$1,240.00</div>
                  <div style={{ color: theme.text2 }}>Spent this month</div>
                  <div style={{ marginTop: '2rem', width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                     <div style={{ width: '45%', height: '100%', background: theme.primary }} />
                  </div>
                  <div style={{ marginTop: '1rem', color: theme.text2, fontSize: '0.9rem' }}>45% of $3,000 monthly limit</div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingCards;
