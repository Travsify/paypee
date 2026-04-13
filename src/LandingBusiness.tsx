import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowRight, 
  Repeat, 
  BarChart3, 
  Send, 
  ShieldCheck, 
  Globe,
  Layers,
  Zap
} from 'lucide-react';

const LandingBusiness = ({ onAuth }: { onAuth: () => void }) => {
  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero container perspective-3d" style={{ marginBottom: '6rem' }}>
        <div className="info-row" style={{ alignItems: 'center', textAlign: 'left', gap: '2rem' }}>
           <div className="hero-text-content">
              <motion.div 
                className="badge"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <Building2 size={14} style={{ marginRight: '0.5rem' }} /> FOR BUSINESSES
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'left', fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}
              >
                Corporate Treasury <br />
                <span style={{ color: 'var(--accent)' }}>Automated.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ margin: '0 0 2.5rem 0', fontSize: '1.25rem', maxWidth: '500px', color: 'var(--text-muted)' }}
              >
                Scale your enterprise across Africa and the world. Issue multi-currency IBANs, execute bulk payrolls, and hedge against inflation with our auto-conversion tech.
              </motion.p>
              <motion.div 
                className="hero-btns"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ justifyContent: 'flex-start' }}
              >
                <button className="btn btn-primary" onClick={onAuth} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', background: 'var(--accent)', color: '#fff' }}>
                  Register Business <ArrowRight size={20} />
                </button>
              </motion.div>
           </div>
           
           <div className="hero-visual-content" style={{ position: 'relative', height: '550px' }}>
              <div style={{ position: 'absolute', top: '10%', right: '0', width: '380px', background: 'var(--glass)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', zIndex: 2 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 800 }}>Total Revenue</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>+12.4%</span>
                        <TrendingIcon />
                    </div>
                 </div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>$1,240,500<span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>.00</span></div>
                 
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>RECENT PAYOUTS</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}><Repeat size={16} /></div>
                          <div>UK Payroll Matrix</div>
                       </div>
                       <div style={{ fontWeight: 700 }}>£42,500</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}><Repeat size={16} /></div>
                          <div>SA Operations</div>
                       </div>
                       <div style={{ fontWeight: 700 }}>ZAR 120,000</div>
                    </div>
                 </div>
                 <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '10%', right: '10%', width: 100, height: 100, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(40px)', zIndex: -1 }} />
              </div>
           </div>
        </div>
      </section>

      {/* Corporate Features */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '3rem' }}>Enterprise Operations Engine</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Built for scale. Designed for control.</p>
        </div>
        <div className="grid">
           {[
             { icon: <Globe />, title: "Global Collection Accounts", desc: "Receive payments like a local. Create specialized sub-accounts in USD, EUR, NGN, and GBP within seconds." },
             { icon: <Send />, title: "Mass Disbursements", desc: "Pay 5 or 5,000 employees globally with our intuitive bulk payout engine." },
             { icon: <Layers />, title: "Auto-Treasury Matrix", desc: "Set rules to automatically convert volatile local currencies into USD stablecoins the moment they arrive." },
             { icon: <BarChart3 />, title: "Reconciliation & Tax", desc: "Export clean, categorized data that makes your accounting department happy." }
           ].map((item, idx) => (
             <motion.div key={idx} className="card tilt-card" whileHover={{ y: -5 }}>
                <div className="card-icon" style={{ color: 'var(--accent)' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Auto-Treasury Highlight */}
      <section className="section container" style={{ marginTop: '4rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '40px', padding: '5rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ maxWidth: '500px' }}>
                <div className="badge" style={{ background: 'var(--accent)', color: '#fff', marginBottom: '1rem' }}>AUTO-TREASURY</div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Hedge against inflation on autopilot.</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                   Don't let currency devaluation eat your margins. Set up rules to automatically convert a percentage of incoming local currency directly into pegged USD stablecoins.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Incoming Rule</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Convert 50% NGN</div>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Target Asset</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>USDC Stablecoin</div>
                   </div>
                </div>
             </div>
             <div>
                <Zap size={200} color="var(--accent)" opacity={0.2} />
             </div>
          </div>
      </section>
    </div>
  );
};

const TrendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default LandingBusiness;
