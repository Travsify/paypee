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
  { code: 'BTC', name: 'Bitcoin', region: 'Global Rail', desc: 'On-chain liquidity for non-custodial global value moving.', icon: '₿', color: '#f59e0b', benefits: ['24/7 Liquidity', 'Permissionless', 'Hedge against inflation'] },
  { code: 'USDT', name: 'Tether (USDT)', region: 'Global Rail', desc: 'Stablecoin pegged to the US Dollar for instant crypto transfers.', icon: '₮', color: '#26a17b', benefits: ['Instant settlement', 'Zero volatility', 'Global reach'] },
  { code: 'USDC', name: 'USD Coin (USDC)', region: 'Global Rail', desc: 'Fully backed digital dollar for borderless payments.', icon: '💲', color: '#2775ca', benefits: ['1:1 USD backed', 'High liquidity', 'Regulated'] }
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
        style={{ maxWidth: '1000px', display: 'flex' }}
      >
        {/* Left Side: Dynamic Info */}
        <div className="account-modal-left" style={{ 
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)', 
          padding: '4rem 3rem', 
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          flexDirection: 'column', 
          gap: '2.5rem',
          position: 'relative'
        }}>
           <AnimatePresence mode="wait">
             <motion.div
               key={currentCurrency ? currentCurrency.code : 'default'}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.3 }}
               style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}
             >
                {currentCurrency ? (
                  <>
                    <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ fontSize: '3rem' }}>{currentCurrency.icon}</span>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
                        {currentCurrency.name} <br />
                        <span style={{ color: currentCurrency.color }}>Account</span>
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{currentCurrency.desc}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {currentCurrency.benefits.map((b: string, i: number) => (
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
                  </>
                ) : (
                  <>
                    <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Globe size={40} color="var(--primary)" />
                    </div>

                    <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>
                        Global Value <br />
                        <span style={{ color: 'var(--primary)' }}>Routing Engine</span>
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Select a currency rail to deploy an instant smart-contract managed bank account.</p>
                    </div>
                  </>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Right Side: Flow */}
        <div style={{ 
          padding: '0', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          background: 'rgba(0,0,0,0.2)',
          height: '100%'
        }}>
           <div className="account-modal-content-padding" style={{ padding: '3rem 3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 {step === 2 && (
                    <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '10px' }}>
                       <ArrowLeft size={16} />
                    </button>
                 )}
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{step === 1 ? 'Select Currency' : 'Configure Account'}</h3>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><X size={18} /></button>
           </div>

           <div className="account-modal-content-padding" style={{ flex: 1, overflowY: 'auto', padding: '0 3rem 2rem' }}>
              <AnimatePresence mode="wait">
                 {step === 1 ? (
                   <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                   >
                     <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                       Select a currency to create a new bank account.
                     </p>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {filteredCurrencies.length > 0 ? filteredCurrencies.map((c) => (
                         <div
                           key={c.code}
                           onClick={() => handleSelectCurrency(c)}
                           style={{ 
                             display: 'flex',
                             alignItems: 'center',
                             gap: '1.5rem',
                             cursor: 'pointer',
                             padding: '1rem 1.5rem',
                             borderRadius: '20px',
                             background: 'rgba(255,255,255,0.02)',
                             border: '1px solid rgba(255,255,255,0.05)',
                             transition: 'all 0.2s'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                             e.currentTarget.style.borderColor = c.color;
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                           }}
                         >
                           <div style={{ 
                             width: '48px', 
                             height: '48px', 
                             borderRadius: '16px', 
                             background: c.color + '22',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             fontSize: '1.5rem'
                           }}>
                             {c.icon}
                           </div>
                           <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{c.code}</div>
                             <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.name}</div>
                           </div>
                           <ChevronRight size={20} color="var(--text-muted)" />
                         </div>
                       )) : (
                         <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                           You have created accounts for all available currencies.
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
                         <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: `1px solid ${currentCurrency.color}55`, borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                              <div style={{ fontSize: '2rem' }}>{currentCurrency.icon}</div>
                              <div>
                                 <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Deploying {currentCurrency.code} Account</div>
                                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentCurrency.region}</div>
                              </div>
                           </div>
                           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                             {currentCurrency.code === 'NGN' 
                               ? 'Central bank regulations require your BVN for NGN virtual account generation.' 
                               : `Standard KYC limits apply to this ${currentCurrency.code} account. Ensure your identity verification is fully approved.`}
                           </p>
                         </div>

                         {['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (
                            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tier 1 KYC Requirements</h4>
                              
                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>ENTER 11-DIGIT BVN</label>
                                <input type="text" value={kycData.bvn} onChange={e => setKycData({...kycData, bvn: e.target.value})} maxLength={11} placeholder="Required by regulations" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                              </div>

                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>DATE OF BIRTH</label>
                                  <input type="date" value={kycData.dob} onChange={e => setKycData({...kycData, dob: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>PHONE NUMBER</label>
                                  <input type="tel" value={kycData.phoneNumber} onChange={e => setKycData({...kycData, phoneNumber: e.target.value})} placeholder="08012345678" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>STREET ADDRESS</label>
                                <input type="text" value={kycData.street} onChange={e => setKycData({...kycData, street: e.target.value})} placeholder="123 Main Street" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                              </div>

                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>CITY</label>
                                  <input type="text" value={kycData.city} onChange={e => setKycData({...kycData, city: e.target.value})} placeholder="Lagos" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>STATE</label>
                                  <input type="text" value={kycData.state} onChange={e => setKycData({...kycData, state: e.target.value})} placeholder="Lagos" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                              </div>
                            </div>
                         )}

                         <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <ShieldCheck size={14} color="var(--primary)" />
                             Direct Tier-1 Provisioning Enabled
                           </p>
                           
                           <button 
                             disabled={isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street))}
                             onClick={() => onSelect(currentCurrency.code, ['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) ? kycData.bvn : undefined, kycData)}
                             style={{ 
                               width: '100%', 
                               padding: '1.4rem', 
                               background: isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street)) ? 'rgba(255,255,255,0.05)' : 'var(--primary)', 
                               color: isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street)) ? '#64748b' : '#fff',
                               border: 'none', 
                               borderRadius: '24px', 
                               fontWeight: 900, 
                               fontSize: '1.1rem',
                               cursor: isProcessing || (['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street)) ? 'not-allowed' : 'pointer',
                               boxShadow: (!isProcessing && !(['NGN', 'USD', 'EUR', 'GBP'].includes(currentCurrency.code) && (kycData.bvn.length !== 11 || !kycData.dob || !kycData.street))) ? '0 20px 40px -10px rgba(99, 102, 241, 0.5)' : 'none',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               gap: '1rem'
                             }}
                           >
                             {isProcessing ? (
                               <>
                                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={20} /></motion.div>
                                 Creating Account...
                               </>
                             ) : (
                               <>
                                 Create {currentCurrency.code} Bank Account <ChevronRight size={20} />
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
      `}</style>
    </div>
  );
};
export default AccountCreationModal;
