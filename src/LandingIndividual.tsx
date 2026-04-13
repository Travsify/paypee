import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';

const LandingIndividual = ({ onAuth }: { onAuth: () => void }) => {
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
                <Sparkles size={14} style={{ marginRight: '0.5rem' }} /> FOR INDIVIDUALS
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'left', fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}
              >
                Your Global <br />
                <span style={{ color: 'var(--primary)' }}>Money Hub.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ margin: '0 0 2.5rem 0', fontSize: '1.25rem', maxWidth: '500px', color: 'var(--text-muted)' }}
              >
                Access USD, EUR, and GBP wallets instantly. Issue virtual cards, send money globally, and manage your personal wealth without borders.
              </motion.p>
              <motion.div 
                className="hero-btns"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ justifyContent: 'flex-start' }}
              >
                <button className="btn btn-primary" onClick={onAuth} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                  Open Free Account <ArrowRight size={20} />
                </button>
              </motion.div>
           </div>
           <div className="hero-visual-content" style={{ position: 'relative', height: '550px', background: 'var(--glass)', borderRadius: '40px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div 
                animate={{ y: [-10, 10, -10] }} 
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Smartphone size={300} color="var(--primary)" opacity={0.8} />
              </motion.div>
              <div style={{ position: 'absolute', top: '20%', right: '10%', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', zIndex: 3 }}>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: '#10b981', borderRadius: '50%', padding: '0.4rem' }}><CheckCircle2 size={16} color="#fff" /></div>
                    <div>
                       <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Received from UK</div>
                       <div style={{ fontWeight: 800 }}>£1,250.00</div>
                    </div>
                 </div>
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }} />
           </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '3rem' }}>Everything You Need</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>We've reimagined personal finance for the modern African.</p>
        </div>
        <div className="grid">
           {[
             { icon: <Globe />, title: "Multi-Currency Wallets", desc: "Hold your net worth in NGN, USD, GBP, and EUR to protect against local currency devaluation." },
             { icon: <CreditCard />, title: "Virtual Cards", desc: "Create a virtual Mastercard in one tap. Perfect for Netflix, AWS, Apple Music, and global shopping." },
             { icon: <Zap />, title: "Instant Transfers", desc: "Send money localized or globally at lightning speed. Zero hidden fees, crystal clear exchange rates." },
             { icon: <ShieldCheck />, title: "Bank-Grade Security", desc: "Your money is protected by 256-bit encryption and regulated global custody partners." }
           ].map((item, idx) => (
             <motion.div key={idx} className="card tilt-card" whileHover={{ y: -5 }}>
                <div className="card-icon" style={{ color: 'var(--primary)' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>
      
      {/* Specific Demo / Hook */}
      <section className="section container" style={{ marginTop: '4rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '40px', padding: '4rem' }}>
         <div className="info-row" style={{ alignItems: 'center' }}>
            <div className="info-visual-content">
               <div style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                  borderRadius: '24px', 
                  padding: '2rem', 
                  aspectRatio: '1.6 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Zap size={32} color="var(--primary)" />
                    <span style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.6 }}>VIRTUAL DEBIT</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', letterSpacing: '3px', fontWeight: 600 }}>**** **** **** 4021</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{ opacity: 0.5, fontSize: '0.8rem' }}>HOLDER</div><div style={{ fontWeight: 600 }}>SARAH CHEN</div></div>
                    <div><div style={{ opacity: 0.5, fontSize: '0.8rem' }}>EXPIRES</div><div style={{ fontWeight: 600 }}>08/29</div></div>
                  </div>
                  <div style={{ position: 'absolute', right: '-20%', bottom: '-20%', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(80px)' }} />
               </div>
            </div>
            <div className="info-content" style={{ paddingLeft: '4rem' }}>
               <h2>Cards that just work.</h2>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Stop worrying about transaction limits and card failures. Our USD virtual cards are universally accepted anywhere Mastercard is supported online.</p>
               <button className="btn btn-outline" onClick={onAuth}>Issue Your Card Today</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingIndividual;
