import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: string) => void;
  isProcessing: boolean;
  existingCurrencies?: string[];
}

const allCurrencies = [
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
    code: 'USD', 
    name: 'US Dollar', 
    region: 'United States', 
    desc: 'Receive payments via ACH, Fedwire, and SWIFT.', 
    icon: '🇺🇸', 
    color: '#3b82f6',
    benefits: ['Global acceptance', 'ACH/Fedwire ready', 'Zero incoming fees']
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

const AccountCreationModal: React.FC<AccountCreationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  isProcessing, 
  existingCurrencies = [] 
}) => {
  const filteredCurrencies = allCurrencies.filter(c => !existingCurrencies.includes(c.code));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel selection logic
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollY = container.scrollTop;
    const itemHeight = 120; // approximate height of a card
    const newIndex = Math.round(scrollY / itemHeight);
    if (newIndex >= 0 && newIndex < filteredCurrencies.length) {
      setSelectedIndex(newIndex);
    }
  };

  const selectItem = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * 120,
        behavior: 'smooth'
      });
      setSelectedIndex(index);
    }
  };

  if (!isOpen) return null;

  const currentCurrency = filteredCurrencies[selectedIndex];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)' }} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '1000px', 
          background: '#0a0f1e', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '40px', 
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
          height: '650px',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Left Side: Dynamic Info */}
        <div style={{ 
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)', 
          padding: '4rem 3rem', 
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2.5rem',
          position: 'relative'
        }}>
           <AnimatePresence mode="wait">
             {currentCurrency && (
               <motion.div
                 key={currentCurrency.code}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.3 }}
                 style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}
               >
                  <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '3rem' }}>{currentCurrency.icon}</span>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
                      {currentCurrency.name} <br />
                      <span style={{ color: currentCurrency.color }}>Node</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{currentCurrency.desc}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {currentCurrency.benefits.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: currentCurrency.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentCurrency.color }}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                        {b}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', letterSpacing: '1px' }}>SYSTEM_LIVE_API_CONNECTED</span>
                    </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Right Side: Vertical Slider */}
        <div style={{ 
          padding: '0', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          background: 'rgba(0,0,0,0.2)'
        }}>
           <div style={{ padding: '3rem 3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Available Rails</h3>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><X size={18} /></button>
           </div>

           <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
              {/* Overlay Gradients */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(180deg, #0a1122 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(0deg, #0a1122 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }} />

              <div 
                ref={containerRef}
                onScroll={handleScroll}
                style={{ 
                  height: '100%', 
                  overflowY: 'auto', 
                  padding: '100px 3rem 300px',
                  scrollSnapType: 'y mandatory',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
                className="no-scrollbar"
              >
                {filteredCurrencies.length > 0 ? filteredCurrencies.map((c, idx) => (
                  <motion.div
                    key={c.code}
                    onClick={() => selectItem(idx)}
                    animate={{ 
                      scale: selectedIndex === idx ? 1 : 0.85,
                      opacity: selectedIndex === idx ? 1 : 0.4,
                      x: selectedIndex === idx ? 0 : 20
                    }}
                    style={{ 
                      height: '120px', 
                      scrollSnapAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      cursor: 'pointer',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '20px', 
                      background: selectedIndex === idx ? c.color : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      transition: 'background 0.3s'
                    }}>
                      {c.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{c.code}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.name}</div>
                    </div>
                  </motion.div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    All available rails are currently active.
                  </div>
                )}
              </div>

              {/* Selector Indicator */}
              <div style={{ 
                position: 'absolute', 
                top: 'calc(100px + 60px)', 
                left: '2rem', 
                right: '2rem', 
                height: '1px', 
                background: 'rgba(255,255,255,0.1)', 
                pointerEvents: 'none' 
              }} />
           </div>

           <div style={{ padding: '2rem 3rem 3rem', background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={14} color="var(--primary)" />
                Direct Tier-1 Provisioning Enabled
              </p>
              
              <button 
                disabled={isProcessing || filteredCurrencies.length === 0}
                onClick={() => currentCurrency && onSelect(currentCurrency.code)}
                style={{ 
                  width: '100%', 
                  padding: '1.4rem', 
                  background: filteredCurrencies.length > 0 ? (isProcessing ? 'rgba(255,255,255,0.05)' : 'var(--primary)') : 'rgba(255,255,255,0.05)', 
                  color: filteredCurrencies.length > 0 ? '#fff' : 'var(--text-muted)',
                  border: 'none', 
                  borderRadius: '24px', 
                  fontWeight: 900, 
                  fontSize: '1.1rem',
                  cursor: filteredCurrencies.length > 0 && !isProcessing ? 'pointer' : 'not-allowed',
                  boxShadow: filteredCurrencies.length > 0 && !isProcessing ? '0 20px 40px -10px rgba(99, 102, 241, 0.5)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem'
                }}
              >
                {isProcessing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={20} /></motion.div>
                    PROVISION_NODE_ACTIVE...
                  </>
                ) : (
                  <>
                    Provision {currentCurrency?.code || 'Rail'} <ChevronRight size={20} />
                  </>
                )}
              </button>
           </div>
        </div>
      </motion.div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AccountCreationModal;
