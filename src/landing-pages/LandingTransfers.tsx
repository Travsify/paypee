import React from 'react';
import { Send, Users, Globe, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

const LandingTransfers = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      {/* 1. Send Money Form & 2. Recipient Selection */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
               <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Send Globally</h2>
               <div style={{ ...glassPanel, padding: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                     <label style={{ display: 'block', color: theme.text2, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Send to</label>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</div>
                        <div>
                           <div style={{ fontWeight: 700 }}>Adaeze N.</div>
                           <div style={{ color: theme.text2, fontSize: '0.85rem' }}>GTBank • Nigeria</div>
                        </div>
                     </div>
                  </div>
                  <button style={{ width: '100%', padding: '1rem', background: 'transparent', border: `1px dashed ${theme.glassBorder}`, borderRadius: '12px', color: theme.cyan, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <Users size={18} /> Add New Recipient
                  </button>
               </div>
            </div>

            {/* 3. Amount & Currency */}
            <div style={{ flex: 1, minWidth: '300px' }}>
               <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Set Amount</h2>
               <div style={{ ...glassPanel, padding: '2rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                     <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>You send</div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>$1,200</div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>USD</div>
                     </div>
                  </div>
                  <div style={{ textAlign: 'center', color: theme.text2, fontSize: '0.9rem', marginBottom: '1rem' }}>
                     Available balance: <span style={{ color: '#fff', fontWeight: 600 }}>$12,450.00</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. FX preview & 5. Fees */}
      <section style={{ padding: '4rem 0', background: theme.bg2 }}>
         <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ ...glassPanel, padding: '3rem', width: '100%', maxWidth: '600px' }}>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Transfer Summary</h3>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1rem' }}>
                  <span style={{ color: theme.text2 }}>Exchange Rate</span>
                  <span style={{ fontWeight: 600, color: theme.cyan }}>1 USD = 1,500 NGN</span>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1rem' }}>
                  <span style={{ color: theme.text2 }}>Transfer Fee</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>$0.00 <span style={{ color: theme.primary, fontSize: '0.8rem' }}>(Free)</span></span>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1rem' }}>
                  <span style={{ color: theme.text2 }}>Estimated Delivery</span>
                  <span style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={16} color={theme.purple} /> Instant</span>
               </div>

               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', marginTop: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ color: theme.text2, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Recipient gets</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: '2rem', fontWeight: 800, color: theme.primary }}>₦1,800,000</div>
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>NGN</div>
                  </div>
               </div>

               <button style={{ width: '100%', padding: '1.2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>Continue</button>
            </div>
         </div>
      </section>

      {/* 6. Confirmation */}
      <section style={{ padding: '4rem 0' }}>
         <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ ...glassPanel, padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
               <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 size={40} color={theme.cyan} />
               </div>
               <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Transfer Complete</h3>
               <p style={{ color: theme.text2, fontSize: '1.1rem', marginBottom: '2rem' }}>₦1,800,000 has been securely sent to Adaeze N.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Download Receipt</button>
                  <button style={{ padding: '1rem 2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingTransfers;
