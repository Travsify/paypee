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
  Globe
} from 'lucide-react';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wallets: any[];
}

const TARGET_CURRENCIES = [
  { code: 'NGN', label: 'Nigeria (NGN)' },
  { code: 'USD', label: 'United States (USD)' },
  { code: 'GBP', label: 'United Kingdom (GBP)' },
  { code: 'EUR', label: 'Europe (EUR)' },
  { code: 'KES', label: 'Kenya (KES)' },
  { code: 'GHS', label: 'Ghana (GHS)' }
];

const PayoutModal: React.FC<PayoutModalProps> = ({ isOpen, onClose, onSuccess, wallets }) => {
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
      if (wallets.length > 0) {
        setSelectedWalletId(wallets[0].id);
      }
    }
  }, [isOpen, wallets]);

  useEffect(() => {
    if (isOpen && targetCurrency) {
      fetchBanks(targetCurrency);
    }
  }, [isOpen, targetCurrency]);

  const selectedWallet = wallets.find(w => w.id === selectedWalletId);
  const balance = selectedWallet ? parseFloat(selectedWallet.balance) : 0;
  const sourceCurrency = selectedWallet?.currency || 'USD';

  useEffect(() => {
    // Fetch live rate if cross-currency
    if (isOpen && sourceCurrency && targetCurrency && sourceCurrency !== targetCurrency) {
      const fetchRate = async () => {
        try {
          const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/fx/rates?source=${sourceCurrency}&target=${targetCurrency}`, {
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
      const response = await fetch(`https://paypee-api-kmhv.onrender.com/api/payouts/banks?currency=${currency}`, {
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
      const response = await fetch('https://paypee-api-kmhv.onrender.com/api/payouts/transfer', {
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
          walletId: selectedWalletId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setStep(3);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBankingFields = () => {
    if (targetCurrency === 'NGN' || targetCurrency === 'KES' || targetCurrency === 'GHS') {
      return (
        <>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>SELECT DESTINATION BANK</label>
            <div style={selectWrapperStyle}>
              <Building2 size={18} color="var(--primary)" />
              <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} style={selectStyle}>
                <option value="">Select Bank</option>
                {banks.map(b => (
                   <option key={b.bank_code} value={b.bank_code}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={18} style={{ marginLeft: 'auto' }} />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>ACCOUNT NUMBER</label>
            <div style={inputWrapperStyle}>
              <User size={18} color="var(--primary)" />
              <input type="text" placeholder="0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </>
      );
    }

    if (targetCurrency === 'USD' || targetCurrency === 'GBP') {
      return (
        <>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>ACCOUNT NUMBER</label>
            <div style={inputWrapperStyle}>
              <User size={18} color="var(--primary)" />
              <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{targetCurrency === 'USD' ? 'ROUTING NUMBER' : 'SORT CODE'}</label>
            <div style={inputWrapperStyle}>
              <Building2 size={18} color="var(--primary)" />
              <input type="text" placeholder={targetCurrency === 'USD' ? "Routing Number" : "Sort Code"} value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </>
      );
    }

    if (targetCurrency === 'EUR') {
      return (
        <>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>IBAN</label>
            <div style={inputWrapperStyle}>
              <User size={18} color="var(--primary)" />
              <input type="text" placeholder="International Bank Account Number" value={iban} onChange={(e) => setIban(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>SWIFT / BIC CODE</label>
            <div style={inputWrapperStyle}>
              <Building2 size={18} color="var(--primary)" />
              <input type="text" placeholder="SWIFT Code" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </>
      );
    }
  };

  const isStep1Valid = () => {
    if (!selectedWalletId || !targetCurrency) return false;
    if (targetCurrency === 'NGN' || targetCurrency === 'KES' || targetCurrency === 'GHS') {
      return bankCode && accountNumber.length >= 8;
    }
    if (targetCurrency === 'USD' || targetCurrency === 'GBP') {
      return accountNumber.length >= 6 && routingNumber.length >= 6;
    }
    if (targetCurrency === 'EUR') {
      return iban.length >= 10 && swiftCode.length >= 8;
    }
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '32px', padding: '3rem', maxWidth: '500px', width: '100%', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>

            {step === 1 && (
              <>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Global Transfer</h2>
                <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Send money globally with automatic currency conversion.</p>
                
                {error && (
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>PAY FROM WALLET</label>
                      <div style={selectWrapperStyle}>
                        <Wallet size={18} color="var(--primary)" />
                        <select value={selectedWalletId} onChange={(e) => setSelectedWalletId(e.target.value)} style={selectStyle}>
                          {wallets.map(w => (
                            <option key={w.id} value={w.id}>
                              {w.currency} Wallet
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>DESTINATION</label>
                      <div style={selectWrapperStyle}>
                        <Globe size={18} color="var(--primary)" />
                        <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} style={selectStyle}>
                          {TARGET_CURRENCIES.map(c => (
                            <option key={c.code} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {sourceCurrency !== targetCurrency && exchangeRate && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <span>Auto-Conversion Active:</span>
                      <span>1 {sourceCurrency} = {exchangeRate} {targetCurrency}</span>
                    </div>
                  )}

                  {renderBankingFields()}
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                  style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', opacity: !isStep1Valid() ? 0.5 : 1 }}
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem' }}>Transfer Amount</h2>
                
                {error && (
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>{sourceCurrency}</span>
                    <input 
                      autoFocus
                      type="number" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '200px', textAlign: 'center', fontSize: '3rem', fontWeight: 800 }}
                    />
                  </div>
                  <p style={{ color: '#64748b', marginTop: '1rem' }}>Available Balance: {balance.toFixed(2)} {sourceCurrency}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#64748b' }}>Transfer Fee</span>
                    <span style={{ fontWeight: 600 }}>0.00 {sourceCurrency}</span>
                  </div>
                  {sourceCurrency !== targetCurrency && exchangeRate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Recipient Gets (~{exchangeRate})</span>
                      <span style={{ fontWeight: 600 }}>{amount ? (parseFloat(amount) * exchangeRate).toFixed(2) : '0.00'} {targetCurrency}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                    <span style={{ fontWeight: 700 }}>Total To Pay</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{amount ? parseFloat(amount).toFixed(2) : '0.00'} {sourceCurrency}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid #1e293b', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                   <button 
                     onClick={handlePayout}
                     disabled={loading || !amount || parseFloat(amount) > balance}
                     style={{ flex: 2, background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', opacity: (loading || !amount || parseFloat(amount) > balance) ? 0.5 : 1 }}
                   >
                     {loading ? 'Processing...' : 'Send Money'}
                   </button>
                </div>
              </>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 2rem' }}>
                   <CheckCircle2 size={50} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Transfer Successful!</h2>
                <p style={{ color: '#64748b', marginBottom: '3rem' }}>Your transfer of {amount} {sourceCurrency} {sourceCurrency !== targetCurrency ? `(approx ${(parseFloat(amount) * (exchangeRate || 1)).toFixed(2)} ${targetCurrency}) ` : ''}is being processed.</p>
                <button 
                  onClick={onClose}
                  style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.1em' };
const inputWrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '16px', padding: '0 1.25rem', overflow: 'hidden' };
const inputStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: '#fff', padding: '1.25rem 0', width: '100%', outline: 'none', fontSize: '1rem' };
const selectWrapperStyle: React.CSSProperties = { ...inputWrapperStyle };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none', cursor: 'pointer' };

export default PayoutModal;
