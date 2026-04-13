import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Building2, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: string) => void;
  isProcessing: boolean;
}

const currencies = [
  { 
    code: 'USD', 
    name: 'US Dollar', 
    region: 'United States', 
    desc: 'Receive payments via ACH, Fedwire, and SWIFT.', 
    icon: '🇺🇸', 
    color: '#3b82f6',
    benefits: ['Global acceptance', 'ACH/Fedwire ready', 'Zero incoming fees']
  },
  { 
    code: 'NGN', 
    name: 'Nigerian Naira', 
    region: 'Nigeria', 
    desc: 'Local NUBAN account for instant bank transfers and airtime.', 
    icon: '🇳🇬', 
    color: '#10b981',
    benefits: ['Instant settlement', 'NIP integrated', 'Low transaction cost']
  },
  { 
    code: 'EUR', 
    name: 'Euro', 
    region: 'European Union', 
    desc: 'SEPA and SWIFT account for effortless pan-European transfers.', 
    icon: '🇪🇺', 
    color: '#6366f1',
    benefits: ['SEPA Instant ready', 'Cross-border optimized', 'Standard IBAN']
  },
  { 
    code: 'GBP', 
    name: 'British Pound', 
    region: 'United Kingdom', 
    desc: 'FPS account for high-speed UK settlements and direct debits.', 
    icon: '🇬🇧', 
    color: '#8b5cf6',
    benefits: ['Faster Payments', 'CHAPS & BACS', 'Dedicated Sort Code']
  },
  { 
    code: 'BTC', 
    name: 'Bitcoin', 
    region: 'Global Rail', 
    desc: 'On-chain liquidity for non-custodial global value moving.', 
    icon: '₿', 
    color: '#f59e0b',
    benefits: ['24/7 Liquidity', 'Permissionless', 'Hedge against inflation']
  }
];

const AccountCreationModal: React.FC<AccountCreationModalProps> = ({ isOpen, onClose, onSelect, isProcessing }) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '900px', 
          background: '#0a0f1e', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '32px', 
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
          maxHeight: '85vh'
        }}
      >
        {/* Left Side: Info & Features */}
        <div style={{ background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)', padding: '3rem', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ width: 60, height: 60, background: 'var(--primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={32} color="#fff" />
           </div>
           <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>Unified Treasury <br /><span style={{ color: 'var(--primary)' }}>Infrastructure</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Deploy a globally optimized banking node in seconds. No paperwork, no hidden fees, pure scale.</p>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <ShieldCheck size={18} color="var(--accent)" />, text: "ISO 27001 Certified Security" },
                { icon: <Zap size={18} color="var(--secondary)" />, text: "Real-time Settlement Engine" },
                { icon: <Building2 size={18} color="var(--primary)" />, text: "Direct Tier-1 Banking Access" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                   {item.icon} {item.text}
                </div>
              ))}
           </div>
           <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                 <Clock size={16} color="var(--text-muted)" />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>NETWORK STATUS</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)' }}>99.99% Uptime Optimized</div>
           </div>
        </div>

        {/* Right Side: Selection */}
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Choose Currency</h3>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currencies.map((c) => (
                <motion.div 
                  key={c.code}
                  onClick={() => setSelected(c.code)}
                  whileHover={{ x: 5 }}
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '20px', 
                    border: '1px solid', 
                    borderColor: selected === c.code ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    background: selected === c.code ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800 }}>{c.name} ({c.code})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.region} Rail</div>
                      </div>
                    </div>
                    {selected === c.code ? <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} color="#fff" /></div> : <ChevronRight size={18} color="rgba(255,255,255,0.2)" />}
                  </div>
                  
                  {selected === c.code && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}
                    >
                      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>{c.desc}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                         {c.benefits.map((b, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              <Check size={12} color="var(--accent)" /> {b}
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
           </div>

           <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {isProcessing ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: 700 }}>
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={24} /></motion.div>
                   Opening Your Account...
                </div>
              ) : (
                <button 
                  disabled={!selected}
                  onClick={() => selected && onSelect(selected)}
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem', 
                    background: selected ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                    color: selected ? '#fff' : 'var(--text-muted)',
                    border: 'none', 
                    borderRadius: '16px', 
                    fontWeight: 800, 
                    fontSize: '1rem',
                    cursor: selected ? 'pointer' : 'not-allowed',
                    boxShadow: selected ? '0 15px 30px -10px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  Get My {selected || ''} Account
                </button>
              )}
              <div style={{ marginTop: '1rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                 <AlertCircle size={14} color="var(--text-muted)" />
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By generating, you agree to our next-gen Treasury Terms.</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountCreationModal;
