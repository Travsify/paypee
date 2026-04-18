import React from 'react';
import { Bot, AlertCircle, ToggleRight, MessageSquare, History, Lightbulb, Zap } from 'lucide-react';

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

const LandingAI = () => {
  return (
    <div style={{ color: theme.text1, paddingBottom: '4rem' }}>
      <section style={{ padding: '4rem 0' }}>
         <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
               {/* 1. AI dashboard & 2. Alerts & 3. Automation controls */}
               <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><Bot color={theme.purple} size={40} /> Intelligence</h2>
               
               <div style={{ ...glassPanel, padding: '2rem', marginBottom: '2rem', background: `linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(99, 102, 241, 0.1))` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                     <AlertCircle color="#F59E0B" style={{ marginTop: '0.2rem' }} />
                     <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#F59E0B' }}>Action Recommended</div>
                        <div style={{ color: theme.text2, fontSize: '0.9rem', lineHeight: 1.5 }}>You are holding ₦2.4M while NGN has dropped 1.2% this week. Convert to USD to preserve value.</div>
                        <button style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Convert to USD</button>
                     </div>
                  </div>
               </div>

               <div style={{ ...glassPanel, padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Active Automations</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${theme.glassBorder}`, paddingBottom: '1.5rem' }}>
                     <div>
                        <div style={{ fontWeight: 600 }}>Auto-Convert Incoming NGN</div>
                        <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Instantly swap to USD on receipt</div>
                     </div>
                     <ToggleRight color={theme.cyan} size={32} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 600 }}>Smart Savings</div>
                        <div style={{ color: theme.text2, fontSize: '0.8rem' }}>Move 10% to crypto weekly</div>
                     </div>
                     <ToggleRight color={theme.text2} size={32} opacity={0.5} />
                  </div>
               </div>

               {/* 6. Recommendations */}
               <div style={{ ...glassPanel, padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb color="#FCD34D" size={20} /> Smart Tips</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                     <Zap size={16} color={theme.primary} style={{ marginTop: '0.2rem' }} />
                     <span style={{ fontSize: '0.9rem', color: theme.text2 }}>Freeze inactive "Marketing Spend" card.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <Zap size={16} color={theme.primary} style={{ marginTop: '0.2rem' }} />
                     <span style={{ fontSize: '0.9rem', color: theme.text2 }}>Set a $50 limit on Netflix subscriptions.</span>
                  </div>
               </div>
            </div>

            <div>
               {/* 4. Chat interface & 5. AI action history */}
               <div style={{ ...glassPanel, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem', borderBottom: `1px solid ${theme.glassBorder}`, background: 'rgba(0,0,0,0.2)' }}>
                     <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bot size={18} color={theme.cyan} /> Paypee Copilot</div>
                  </div>
                  <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                     <div style={{ alignSelf: 'flex-end', background: theme.primary, padding: '1rem', borderRadius: '16px 16px 0 16px', maxWidth: '80%' }}>
                        What was my largest expense last month?
                     </div>
                     <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '16px 16px 16px 0', maxWidth: '80%' }}>
                        Your largest expense in March was <strong>$2,450.00</strong> to AWS. This is 15% higher than February.
                     </div>
                     <div style={{ alignSelf: 'flex-end', background: theme.primary, padding: '1rem', borderRadius: '16px 16px 0 16px', maxWidth: '80%' }}>
                        Generate a new virtual card for AWS with a $3,000 limit.
                     </div>
                     <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '16px 16px 16px 0', maxWidth: '80%' }}>
                        <div style={{ marginBottom: '1rem' }}>Done! I've created a new card:</div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${theme.cyan}` }}>
                           <strong>AWS Expense Card</strong><br/>
                           Limit: $3,000 / month<br/>
                           **** 8492
                        </div>
                     </div>
                  </div>
                  <div style={{ padding: '1.5rem', borderTop: `1px solid ${theme.glassBorder}` }}>
                     <input type="text" placeholder="Ask Paypee AI..." style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.glassBorder}`, borderRadius: '12px', color: '#fff' }} />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingAI;
