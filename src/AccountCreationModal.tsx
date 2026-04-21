import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Globe, 
  ChevronRight,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: string, bvn?: string, kycData?: any) => void;
  isProcessing: boolean;
  existingCurrencies?: string[];
}

const allCurrencies = [
  { code: 'NGN', name: 'Nigerian Naira', region: 'Nigeria', desc: 'Local NUBAN account for instant bank transfers and airtime.', icon: '🇳🇬', color: '#10b981', benefits: ['Instant settlement', 'NIP integrated', 'Low transaction cost'] },
  { code: 'USD', name: 'US Dollar', region: 'United States', desc: 'Receive payments via ACH, Fedwire, and SWIFT.', icon: '🇺🇸', color: '#3b82f6', benefits: ['Global acceptance', 'ACH/Fedwire ready', 'Zero incoming fees'] },
  { code: 'EUR', name: 'Euro', region: 'European Union', desc: 'SEPA and SWIFT account for effortless pan-European transfers.', icon: '🇪🇺', color: '#6366f1', benefits: ['SEPA Instant ready', 'Cross-border optimized', 'Standard IBAN'] },
  { code: 'GBP', name: 'British Pound', region: 'United Kingdom', desc: 'FPS account for high-speed UK settlements and direct debits.', icon: '🇬🇧', color: '#8b5cf6', benefits: ['Faster Payments', 'CHAPS & BACS', 'Dedicated Sort Code'] },
  { code: 'USDT', name: 'Tether (USDT)', region: 'Solana/Global', desc: 'Stablecoin pegged to the US Dollar for instant crypto transfers.', icon: '💵', color: '#26a17b', benefits: ['Instant settlement', 'Zero volatility', 'Global reach'] },
  { code: 'USDC', name: 'USD Coin (USDC)', region: 'Solana/Global', desc: 'Fully backed digital dollar for borderless payments.', icon: '🔵', color: '#2775ca', benefits: ['1:1 USD backed', 'High liquidity', 'Regulated'] },
  { code: 'PYUSD', name: 'PayPal USD (PYUSD)', region: 'PayPal/Global', desc: 'Stablecoin from PayPal for secure web3 payments.', icon: '🅿️', color: '#003087', benefits: ['PayPal ecosystem', 'Regulated', 'Solana rail'] },
  { code: 'BTC', name: 'Bitcoin (BTC)', region: 'Global Rail', desc: 'The gold standard of digital assets for long-term value preservation.', icon: '₿', color: '#f59e0b', benefits: ['Absolute scarcity', 'Peer-to-peer', 'Store of value'] }
];

const AccountCreationModal: React.FC<AccountCreationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  isProcessing, 
  existingCurrencies = [] 
}) => {
  const filteredCurrencies = allCurrencies.filter(c => !existingCurrencies.includes(c.code));
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [kycData, setKycData] = useState({ bvn: '', dob: '', phoneNumber: '', street: '', city: '', state: '', postalCode: '' });

  // Reset state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedCurrency(null);
      setKycData({ bvn: '', dob: '', phoneNumber: '', street: '', city: '', state: '', postalCode: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCurrency = (currency: any) => {
    setSelectedCurrency(currency);
    setStep(2);
  };

  const currentCurrency = selectedCurrency;

  return (
    <div className="paypee-modal-overlay">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="paypee-modal-content"
        style={{ 
          maxWidth: '950px', 
          display: 'flex', 
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          overflow: 'hidden'
        }}
      >
        {/* Left Side: Dynamic Info */}
        <div style={{ 
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)', 
          padding: window.innerWidth < 768 ? '2rem' : '4rem 3rem', 
          borderRight: window.innerWidth < 768 ? 'none' : '1px solid rgba(255,255,255,0.05)', 
          borderBottom: window.innerWidth < 768 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          display: 'flex',
          flexDirection: 'column', 
          gap: '2.5rem',
          position: 'relative',
          width: window.innerWidth < 768 ? '100%' : '400px',
          flexShrink: 0
        }}>
           <AnimatePresence mode="wait">
             <motion.div
               key={currentCurrency ? currentCurrency.code : 'default'}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.3 }}
               style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
             >
                {currentCurrency ? (
                  <>
                    <div style={{ 
                      width: 80, 
                      height: 80, 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `0 0 30px ${currentCurrency.color}22`
                    }}>
                      <span style={{ fontSize: '3rem' }}>{currentCurrency.icon}</span>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff', lineHeight: 1.1 }}>
                        {currentCurrency.name} <br />
                        <span style={{ color: currentCurrency.color }}>{['USDC', 'USDT', 'BTC'].includes(currentCurrency.code) ? 'Wallet' : 'Account'}</span>
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{currentCurrency.desc}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {currentCurrency.benefits.map((b: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: currentCurrency.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentCurrency.color }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                          {b}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '2px' }}>API_ENCRYPTED_RAIL</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ 
                      width: 80, 
                      height: 80, 
                      background: 'rgba(99, 102, 241, 0.05)', 
                      borderRadius: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      boxShadow: '0 0 30px rgba(99, 102, 241, 0.1)'
                    }}>
                      <Globe size={40} color="var(--primary)" />
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff', lineHeight: 1.1 }}>
                        Global Value <br />
                        <span style={{ color: 'var(--primary)' }}>Routing Engine</span>
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Select a currency rail to deploy an instant smart-contract managed bank account.</p>
                    </div>
                    
                    <div className="desktop-only" style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                          <ShieldCheck size={18} />
                          <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>ISO 27001 Certified</span>
                       </div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>All accounts are provisioned via PCI-DSS compliant banking infrastructure.</p>
                    </div>
                  </>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Right Side: Flow */}
        <div style={{ 
          flex: 1,
          padding: '0', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          background: 'rgba(0,0,0,0.1)',
          maxHeight: window.innerWidth < 768 ? '60vh' : 'auto'
        }}>
           <div style={{ padding: '2.5rem 3rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 {step === 2 && (
                    <button onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                       <ArrowLeft size={18} />
                    </button>
                 )}
                 <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{step === 1 ? 'Deploy New Rail' : 'Configuration'}</h3>
              </div>
              <button onClick={onClose} className="btn btn-outline" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0 }}><X size={20} /></button>
           </div>

           <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 3rem 3rem' }} className="no-scrollbar">
              <AnimatePresence mode="wait">
                 {step === 1 ? (
                   <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                   >
                     <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', fontWeight: 500 }}>
                        Select your preferred settlement currency.
                     </p>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                       {filteredCurrencies.length > 0 ? filteredCurrencies.map((c) => (
                         <div
                           key={c.code}
                           onClick={() => handleSelectCurrency(c)}
                           style={{ 
                             display: 'flex',
                             alignItems: 'center',
                             gap: '1.25rem',
                             cursor: 'pointer',
                             padding: '1.25rem 1.5rem',
                             borderRadius: '24px',
                             background: 'rgba(255,255,255,0.02)',
                             border: '1px solid rgba(255,255,255,0.05)',
                             transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                             e.currentTarget.style.borderColor = c.color + '44';
                             e.currentTarget.style.transform = 'scale(1.01)';
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                             e.currentTarget.style.transform = 'scale(1)';
                           }}
                         >
                           <div style={{ 
                             width: '56px', 
                             height: '56px', 
                             borderRadius: '18px', 
                             background: c.color + '15',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             fontSize: '1.8rem',
                             border: `1px solid ${c.color}22`
                           }}>
                             {c.icon}
                           </div>
                           <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{c.code}</div>
                             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.name}</div>
                           </div>
                           <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <ChevronRight size={18} color="var(--text-muted)" />
                           </div>
                         </div>
                       )) : (
                         <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Globe size={40} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>All Rails Deployed</div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>You have successfully created accounts for all supported global currencies.</p>
                         </div>
                       )}
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                   >
                     {currentCurrency && (
                       <>
                         <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${currentCurrency.color}22`, borderRadius: '28px', padding: '1.75rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                               <div style={{ fontSize: '2.5rem' }}>{currentCurrency.icon}</div>
                               <div>
                                  <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>Configure {currentCurrency.code} {['USDC', 'USDT', 'BTC', 'PYUSD'].includes(currentCurrency.code) ? 'Wallet' : 'Account'}</div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{currentCurrency.region} Compliance Region</div>
                               </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                              {currentCurrency.code === 'NGN' 
                                ? 'Central bank regulations (CBN) require a valid BVN verification to provision a dedicated NUBAN account.' 
                                : `This ${currentCurrency.code} rail will be provisioned with full SWIFT/SEPA capabilities upon successful identity validation.`}
                            </p>
                         </div>

                         {['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                              <div>
                                <label className="form-label">11-DIGIT BANK VERIFICATION NUMBER</label>
                                <input type="text" className="form-input" value={kycData.bvn} onChange={e => setKycData({...kycData, bvn: e.target.value})} maxLength={11} placeholder="Required for NUBAN activation" />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                  <label className="form-label">DATE OF BIRTH</label>
                                  <input type="date" className="form-input" value={kycData.dob} onChange={e => setKycData({...kycData, dob: e.target.value})} />
                                </div>
                                <div>
                                  <label className="form-label">LEGAL PHONE NUMBER</label>
                                  <input type="tel" className="form-input" value={kycData.phoneNumber} onChange={e => setKycData({...kycData, phoneNumber: e.target.value})} placeholder="+234..." />
                                </div>
                              </div>

                              <div>
                                <label className="form-label">RESIDENTIAL ADDRESS</label>
                                <input type="text" className="form-input" value={kycData.street} onChange={e => setKycData({...kycData, street: e.target.value})} placeholder="Full street address" />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                  <label className="form-label">CITY</label>
                                  <input type="text" className="form-input" value={kycData.city} onChange={e => setKycData({...kycData, city: e.target.value})} placeholder="e.g. Lagos" />
                                </div>
                                <div>
                                  <label className="form-label">STATE / PROVINCE</label>
                                  <input type="text" className="form-input" value={kycData.state} onChange={e => setKycData({...kycData, state: e.target.value})} placeholder="e.g. Lagos State" />
                                </div>
                              </div>
                            </div>
                         )}

                         <div style={{ marginTop: 'auto' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', padding: '1rem 1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                               <ShieldCheck size={18} color="#10b981" />
                               <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Secure End-to-End Encryption Active</span>
                            </div>
                            
                            <button 
                              disabled={isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street))}
                              onClick={() => onSelect(currentCurrency.code, ['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) ? kycData.bvn : undefined, kycData)}
                              className="btn btn-primary"
                              style={{ 
                                width: '100%', 
                                padding: '1.4rem', 
                                borderRadius: '24px', 
                                fontSize: '1.15rem', 
                                fontWeight: 900,
                                opacity: (isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street))) ? 0.5 : 1
                              }}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCcw size={22} className="animate-spin" />
                                  Initializing Smart-Contract...
                                </>
                              ) : (
                                <>
                                  Deploy {currentCurrency.code} Rail <ChevronRight size={22} />
                                </>
                              )}
                            </button>
                         </div>
                       </>
                     )}
                   </motion.div>
                 )}
              </AnimatePresence>
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
        @media (max-width: 767px) {
          .paypee-modal-content {
             max-height: 95vh;
             border-radius: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountCreationModal;
