import React from 'react';
import { Smartphone, Zap, Wifi, Tv, ArrowRight, Clock, Star } from 'lucide-react';

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

const LandingPayments = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      <section style={{ padding: '4rem 0' }}>
         <div className="container">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem' }}>Pay Bills Instantly</h2>
            
            {/* 1. Services */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
               <div style={{ ...glassPanel, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', border: `1px solid ${theme.primary}` }}>
                  <Smartphone color={theme.primary} size={24} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Airtime</div>
               </div>
               <div style={{ ...glassPanel, padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}>
                  <Zap color={theme.cyan} size={24} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Electricity</div>
               </div>
               <div style={{ ...glassPanel, padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}>
                  <Wifi color={theme.purple} size={24} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Internet</div>
               </div>
               <div style={{ ...glassPanel, padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}>
                  <Tv color="#FCD34D" size={24} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cable TV</div>
               </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
               <div style={{ flex: 1, minWidth: '300px' }}>
                  {/* 2. Saved Providers & 3. Payment form */}
                  <div style={{ ...glassPanel, padding: '2rem', marginBottom: '2rem' }}>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Top Up Airtime</h3>
                     <select style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff', marginBottom: '1rem' }}>
                        <option>MTN Nigeria</option>
                        <option>Airtel</option>
                     </select>
                     <input type="text" placeholder="Phone Number" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff', marginBottom: '1rem' }} />
                     <input type="text" placeholder="Amount (e.g. 5000)" style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff', marginBottom: '2rem' }} />
                     <button style={{ width: '100%', padding: '1.2rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>Pay Now</button>
                  </div>
                  
                  {/* 6. Reminders */}
                  <div style={{ ...glassPanel, padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Clock color={theme.purple} />
                        <div>
                           <div style={{ fontWeight: 600 }}>Upcoming: DSTV Premium</div>
                           <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Due in 3 days • ₦24,500</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div style={{ flex: 1, minWidth: '300px' }}>
                  {/* 4. Quick Repeat & 5. History */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star color="#FCD34D" size={20} /> Quick Repeat</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                     <div style={{ ...glassPanel, padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Tv size={16} color="#000" />
                        </div>
                        <div>
                           <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>DSTV</div>
                           <div style={{ color: theme.text2, fontSize: '0.8rem' }}>₦24,500</div>
                        </div>
                     </div>
                     <div style={{ ...glassPanel, padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Zap size={16} color="#000" />
                        </div>
                        <div>
                           <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ikeja Electric</div>
                           <div style={{ color: theme.text2, fontSize: '0.8rem' }}>₦10,000</div>
                        </div>
                     </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recent Payments</h3>
                  <div style={{ ...glassPanel, padding: '1.5rem' }}>
                     {[1,2,3].map((_, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i !== 2 ? `1px solid ${theme.glassBorder}` : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={14} color={theme.text2} />
                             </div>
                             <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>MTN Airtime</div>
                                <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Yesterday</div>
                             </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>-₦5,000</div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingPayments;
