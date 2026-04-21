import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Building2, 
  User, 
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Wallet,
  Globe,
  Lock,
  ArrowRight,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import { API_BASE } from './config';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  wallets: any[];
}

const TARGET_CURRENCIES = [
  { code: 'NGN', label: 'Nigeria (NGN)', flag: '🇳🇬' },
  { code: 'USD', label: 'United States (USD)', flag: '🇺🇸' },
  { code: 'GBP', label: 'United Kingdom (GBP)', flag: '🇬🇧' },
  { code: 'EUR', label: 'Europe (EUR)', flag: '🇪🇺' },
  { code: 'KES', label: 'Kenya (KES)', flag: '🇰🇪' },
  { code: 'GHS', label: 'Ghana (GHS)', flag: '🇬🇭' },
  { code: 'UGX', label: 'Uganda (UGX)', flag: '🇺🇬' },
  { code: 'RWF', label: 'Rwanda (RWF)', flag: '🇷🇼' },
  { code: 'XAF', label: 'Central Africa (XAF)', flag: '🇨🇲' },
  { code: 'XOF', label: 'West Africa (XOF)', flag: '🇸🇳' },
  { code: 'TZS', label: 'Tanzania (TZS)', flag: '🇹🇿' },
  { code: 'BTC', label: 'Bitcoin (BTC)', flag: '₿' },
  { code: 'USDT', label: 'Tether (USDT)', flag: '💵' },
  { code: 'USDC', label: 'USD Coin (USDC)', flag: '🔵' }
];

const PayoutModal: React.FC<PayoutModalProps> = ({ isOpen, onClose, onComplete, wallets }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [banks, setBanks] = useState<any[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [accountName, setAccountName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const isMoMo = ['KES', 'GHS', 'UGX', 'RWF'].includes(targetCurrency);
    const minLen = (targetCurrency === 'NGN' || isMoMo) ? 8 : 6;
    
    if (accountNumber.length >= minLen && (bankCode || routingNumber || iban || swiftCode)) {
      const verify = async () => {
        setVerifying(true);
        setAccountName('');
        try {
          const res = await fetch(`${API_BASE}/api/payouts/verify?accountNumber=${accountNumber}&bankCode=${bankCode || routingNumber || iban || swiftCode}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('paypee_token')}` }
          });
          const data = await res.json();
          if (res.ok) {
            const fetchedName = data.name || data.account_name || data.accountName || data.full_name || data.fullName || data.customer_name || data.account_holder_name || '';
            if (fetchedName) {
              setAccountName(fetchedName);
              setError('');
            } else {
              setError('Could not verify account name. Please check details.');
            }
          } else {
            setError(data.error || 'Verification failed. Please check the account number.');
          }
        } catch (err) {
          setError('Network error during verification.');
        } finally {
          setVerifying(false);
        }
      };
      const timer = setTimeout(verify, 800);
      return () => clearTimeout(timer);
    } else {
      setAccountName('');
    }
  }, [accountNumber, bankCode, routingNumber, iban, swiftCode, targetCurrency]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount('');
      setTargetCurrency('NGN');
      setBankCode('');
      setAccountNumber('');
      setRoutingNumber('');
      setSwiftCode('');
      setIban('');
      setError('');
      setPin('');
      if (wallets.length > 0) {
        setSelectedWalletId(wallets[0].id);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedWalletId && wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  useEffect(() => {
    if (isOpen && targetCurrency) {
      fetchBanks(targetCurrency);
    }
  }, [isOpen, targetCurrency]);

  const selectedWallet = wallets.find(w => w.id === selectedWalletId);
  const balance = selectedWallet ? parseFloat(selectedWallet.balance) : 0;
  const sourceCurrency = selectedWallet?.currency || 'USD';

  useEffect(() => {
    if (isOpen && sourceCurrency && targetCurrency && sourceCurrency !== targetCurrency) {
      const fetchRate = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/fx/rates?source=${sourceCurrency}&target=${targetCurrency}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('paypee_token')}` }
          });
          const data = await res.json();
          if (data.rate) {
            setExchangeRate(data.rate);
          }
        } catch (err) {
          console.error('Failed to fetch rate');
        }
      };
      fetchRate();
    } else {
      setExchangeRate(null);
    }
  }, [isOpen, sourceCurrency, targetCurrency]);

  const fetchBanks = async (currency: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/payouts/banks?currency=${currency}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('paypee_token')}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setBanks(data);
      }
    } catch (err) {
      console.error('Failed to fetch banks', err);
    }
  };

  const handlePayout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/payouts/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({
          amount,
          sourceCurrency,
          targetCurrency,
          bankCode,
          accountNumber,
          routingNumber,
          swiftCode,
          iban,
          walletId: selectedWalletId,
          accountName,
          bankName: banks.find(b => (b.bank_code || b.code || b.bankCode) === bankCode)?.name || 'Local Bank',
          pin
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setStep(3);
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [bankSearch, setBankSearch] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  const filteredBanks = banks.filter(b => 
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const renderBankingFields = () => {
    const isMoMo = ['KES', 'GHS', 'UGX', 'RWF'].includes(targetCurrency);
    
    if (targetCurrency === 'NGN' || isMoMo) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">{isMoMo ? 'SELECT MOBILE MONEY PROVIDER' : 'SELECT DESTINATION BANK'}</label>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                className="form-input"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Building2 size={18} color="var(--primary)" />
                   <span style={{ color: bankCode ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                      {banks.find(b => (b.bank_code || b.code || b.bankCode) === bankCode)?.name || (isMoMo ? 'Choose Provider' : 'Select Bank')}
                   </span>
                </div>
                <ChevronDown size={18} style={{ transform: isBankDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>

              <AnimatePresence>
                {isBankDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '20px', marginTop: '0.75rem', zIndex: 100, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    className="no-scrollbar"
                  >
                    <div style={{ position: 'sticky', top: 0, background: '#0a0f1e', padding: '1rem', borderBottom: '1px solid var(--border)', zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
                      <input 
                        autoFocus
                        placeholder="Search bank or provider..." 
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="form-input"
                        style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    {filteredBanks.map((b, idx) => {
                      const currentCode = b.bank_code || b.code || b.bankCode;
                      return (
                        <div 
                          key={currentCode || idx} 
                          onClick={(e) => { 
                            e.stopPropagation();
                            setBankCode(currentCode); 
                            setIsBankDropdownOpen(false); 
                            setBankSearch(''); 
                          }}
                          style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '1rem', fontWeight: 600, background: bankCode === currentCode ? 'rgba(99, 102, 241, 0.1)' : 'transparent', color: bankCode === currentCode ? 'var(--primary)' : '#fff' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = bankCode === currentCode ? 'rgba(99, 102, 241, 0.1)' : 'transparent'}
                        >
                          {b.name}
                        </div>
                      );
                    })}
                    {filteredBanks.length === 0 && (
                      <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No providers found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <label className="form-label">{isMoMo ? 'MOBILE MONEY NUMBER' : 'ACCOUNT NUMBER'}</label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="form-input" placeholder={isMoMo ? "e.g. 0541234567" : "0123456789"} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                {verifying && <RefreshCcw size={18} className="animate-spin" color="var(--primary)" />}
                {accountName && !verifying && <CheckCircle2 size={18} color="var(--accent)" />}
              </div>
            </div>
            {accountName && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '0.9rem', color: 'var(--accent)', marginTop: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <User size={16} /> Verified: {accountName}
              </motion.div>
            )}
          </div>
        </div>
      );
    }

    if (targetCurrency === 'USD' || targetCurrency === 'GBP') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">ACCOUNT NUMBER</label>
            <input type="text" className="form-input" placeholder="International Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
          <div>
            <label className="form-label">{targetCurrency === 'USD' ? 'ROUTING NUMBER (ABA)' : 'SORT CODE'}</label>
            <input type="text" className="form-input" placeholder={targetCurrency === 'USD' ? "9-digit ABA Routing" : "6-digit Sort Code"} value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} />
          </div>
        </div>
      );
    }

    if (targetCurrency === 'EUR') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="form-label">IBAN</label>
            <input type="text" className="form-input" placeholder="International Bank Account Number" value={iban} onChange={(e) => setIban(e.target.value)} />
          </div>
          <div>
            <label className="form-label">SWIFT / BIC CODE</label>
            <input type="text" className="form-input" placeholder="8 or 11 character SWIFT code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />
          </div>
        </div>
      );
    }
  };

  const isStep1Valid = () => {
    if (!selectedWalletId || !targetCurrency) return false;
    // For fiat targets, we need accountName (verification)
    const isCrypto = ['BTC', 'USDT', 'USDC'].includes(targetCurrency);
    if (!isCrypto && !accountName && !verifying) {
       // Allow bypassing verification for USD/EUR/GBP for now as they might not have real-time verification in all regions
       if (['USD', 'EUR', 'GBP'].includes(targetCurrency)) return accountNumber.length > 5;
       return false;
    }
    
    const isMoMo = ['KES', 'GHS', 'UGX', 'RWF'].includes(targetCurrency);
    if (targetCurrency === 'NGN' || isMoMo) {
      return bankCode && accountNumber.length >= 8;
    }
    if (targetCurrency === 'USD' || targetCurrency === 'GBP') {
      return accountNumber.length >= 6 && routingNumber.length >= 6;
    }
    if (targetCurrency === 'EUR') {
      return iban.length >= 10 && swiftCode.length >= 8;
    }
    if (isCrypto) return accountNumber.length > 20; // Basic crypto addr check
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="paypee-modal-overlay">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }} 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="paypee-modal-content"
        style={{ maxWidth: '650px', overflow: 'visible' }}
      >
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                   <Send size={24} />
                </div>
                <div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      {step === 1 ? 'Global Transfer' : step === 2 ? 'Review & Authorize' : 'Success'}
                   </h2>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Step {step} of 3</div>
                </div>
             </div>
             <button onClick={onClose} className="btn btn-outline" style={{ width: 40, height: 40, borderRadius: '50%', padding: 0 }}><X size={20} /></button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '1.25rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(244, 63, 94, 0.2)' }}
            >
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">SOURCE WALLET</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        className="form-input" 
                        value={selectedWalletId} 
                        onChange={(e) => setSelectedWalletId(e.target.value)}
                        style={{ appearance: 'none' }}
                      >
                        {wallets.map(w => (
                          <option key={w.id} value={w.id} style={{ background: '#0a0f1e' }}>{w.currency} Wallet</option>
                        ))}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">DESTINATION RAIL</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        className="form-input" 
                        value={targetCurrency} 
                        onChange={(e) => setTargetCurrency(e.target.value)}
                        style={{ appearance: 'none' }}
                      >
                        {TARGET_CURRENCIES.map(c => (
                          <option key={c.code} value={c.code} style={{ background: '#0a0f1e' }}>{c.flag} {c.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                    </div>
                  </div>
                </div>

                {sourceCurrency !== targetCurrency && exchangeRate && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem 1.5rem', borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 32, height: 32, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                       <Globe size={18} />
                    </div>
                    <div>
                       <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Exchange Rate</div>
                       <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>1 {sourceCurrency} ≈ {exchangeRate.toLocaleString()} {targetCurrency}</div>
                    </div>
                  </div>
                )}

                {renderBankingFields()}

                <button 
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.4rem', fontSize: '1.1rem', fontWeight: 900, borderRadius: '24px', opacity: !isStep1Valid() ? 0.5 : 1 }}
                >
                  Confirm Details <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                   <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Enter Amount to Transfer</div>
                   <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{sourceCurrency}</span>
                      <input 
                        autoFocus
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '220px', textAlign: 'center', fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}
                      />
                   </div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' }}>
                      Available: {balance.toLocaleString()} {sourceCurrency}
                   </div>
                </div>

                <div className="premium-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                      <div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem' }}>RECIPIENT</div>
                         <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{accountName || 'Unnamed Recipient'}</div>
                         <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{accountNumber} • {banks.find(b => (b.bank_code || b.code || b.bankCode) === bankCode)?.name || 'Standard Rail'}</div>
                      </div>
                      <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Building2 size={24} color="var(--primary)" />
                      </div>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                         <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Transaction Fee</span>
                         <span style={{ fontWeight: 800, color: 'var(--accent)' }}>FREE</span>
                      </div>
                      {exchangeRate && amount && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                           <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Recipient Gets</span>
                           <span style={{ fontWeight: 800, color: '#fff' }}>≈ {(parseFloat(amount) * exchangeRate).toLocaleString()} {targetCurrency}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         <span style={{ color: '#fff', fontWeight: 800 }}>Total to Debit</span>
                         <span style={{ fontWeight: 900, color: 'var(--primary)' }}>{amount || '0.00'} {sourceCurrency}</span>
                      </div>
                   </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <Lock size={18} color="var(--primary)" />
                      <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--primary)' }}>CONFIRM WITH PIN</span>
                   </div>
                   <input 
                    type="password" 
                    maxLength={4} 
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '2.5rem', letterSpacing: '1.5rem', fontWeight: 900, padding: '1rem', background: 'rgba(0,0,0,0.3)' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                   <button onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: '1.25rem', borderRadius: '20px' }}>Back</button>
                   <button 
                     onClick={handlePayout}
                     disabled={loading || pin.length < 4 || !amount}
                     className="btn btn-primary"
                     style={{ padding: '1.25rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900 }}
                   >
                     {loading ? <RefreshCcw className="animate-spin" /> : <><ShieldCheck size={20} /> Authorize Transfer</>}
                   </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div style={{ width: 100, height: 100, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', margin: '0 auto 2.5rem' }}>
                   <CheckCircle2 size={56} />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>Transfer Initiated</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
                   We've queued your transfer of <span style={{ color: '#fff', fontWeight: 800 }}>{amount} {sourceCurrency}</span>. You'll receive a notification once the settlement is complete.
                </p>
                <button 
                  onClick={onClose}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PayoutModal;
