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
import { API_BASE } from './config';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  wallets: any[];
}

const TARGET_CURRENCIES = [
  { code: 'NGN', label: 'Nigeria (NGN)' },
  { code: 'USD', label: 'United States (USD)' },
  { code: 'GBP', label: 'United Kingdom (GBP)' },
  { code: 'EUR', label: 'Europe (EUR)' },
  { code: 'KES', label: 'Kenya (KES)' },
  { code: 'GHS', label: 'Ghana (GHS)' },
  { code: 'UGX', label: 'Uganda (UGX)' },
  { code: 'RWF', label: 'Rwanda (RWF)' }
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

  useEffect(() => {
    if (accountNumber.length >= 10 && bankCode && targetCurrency === 'NGN') {
      const verify = async () => {
        setVerifying(true);
        setAccountName('');
        try {
          const res = await fetch(`${API_BASE}/api/payouts/verify?accountNumber=${accountNumber}&bankCode=${bankCode}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('paypee_token')}` }
          });
          const data = await res.json();
          if (data.account_name) {
            setAccountName(data.account_name);
          }
        } catch (err) {
          console.error('Verification error');
        } finally {
          setVerifying(false);
        }
      };
      const timer = setTimeout(verify, 800);
      return () => clearTimeout(timer);
    } else {
      setAccountName('');
    }
  }, [accountNumber, bankCode, targetCurrency]);

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
    // Fetch live rate if cross-currency
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
          accountName
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
        <>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{isMoMo ? 'SELECT MOBILE MONEY PROVIDER' : 'SELECT DESTINATION BANK'}</label>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                style={{ ...selectWrapperStyle, cursor: 'pointer', borderColor: isBankDropdownOpen ? 'var(--primary)' : '#1e293b' }}
              >
                <Building2 size={18} color="var(--primary)" />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', color: bankCode ? '#fff' : '#475569' }}>
                  {banks.find(b => (b.bank_code || b.code || b.bankCode) === bankCode)?.name || (isMoMo ? 'Choose Provider' : 'Select Bank')}
                </div>
                <ChevronDown size={18} style={{ marginLeft: 'auto', transform: isBankDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>

              <AnimatePresence>
                {isBankDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', marginTop: '0.5rem', zIndex: 100, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  >
                    <div style={{ position: 'sticky', top: 0, background: '#0f172a', padding: '0.75rem', borderBottom: '1px solid #1e293b', zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
                      <input 
                        autoFocus
                        placeholder="Search provider..." 
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.6rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
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
                          style={{ padding: '1rem', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem', background: bankCode === currentCode ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = bankCode === currentCode ? 'rgba(99, 102, 241, 0.1)' : 'transparent'}
                        >
                          {b.name}
                        </div>
                      );
                    })}
                    {filteredBanks.length === 0 && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>No providers found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{isMoMo ? 'MOBILE MONEY NUMBER' : 'ACCOUNT NUMBER'}</label>
            <div style={inputWrapperStyle}>
              <User size={18} color="var(--primary)" />
              <input type="text" placeholder={isMoMo ? "e.g. 0541234567" : "0123456789"} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={inputStyle} />
            </div>
            {verifying && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Verifying account...
            </div>}
            {accountName && <div style={{ fontSize: '0.85rem', color: '#22d3ee', marginTop: '0.5rem', fontWeight: 700, background: 'rgba(34, 211, 238, 0.05)', padding: '0.5rem', borderRadius: '8px' }}>
              Account Name: {accountName}
            </div>}
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
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="paypee-modal-overlay">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="paypee-modal-content"
          >
            <button onClick={onClose} style={{ position: 'sticky', top: '1.5rem', float: 'right', marginRight: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}><X size={20} /></button>
            <div style={{ padding: '2.5rem' }}>

            {step === 1 && (
              <div style={{ overflow: 'visible' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>Global Transfer</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Send money globally with automatic currency conversion.</p>
                
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
                        <Wallet size={18} color="#6366f1" />
                        <select value={selectedWalletId} onChange={(e) => setSelectedWalletId(e.target.value)} style={selectStyle}>
                          {wallets.map(w => (
                            <option key={w.id} value={w.id} style={{ background: '#0a0f1e', color: '#fff' }}>
                              {w.currency} Wallet
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>DESTINATION</label>
                      <div style={selectWrapperStyle}>
                        <Globe size={18} color="#6366f1" />
                        <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} style={selectStyle}>
                          {TARGET_CURRENCIES.map(c => (
                            <option key={c.code} value={c.code} style={{ background: '#0a0f1e', color: '#fff' }}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {sourceCurrency !== targetCurrency && exchangeRate && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <span>Auto-Conversion:</span>
                      <span>1 {sourceCurrency} = {exchangeRate} {targetCurrency}</span>
                    </div>
                  )}

                  {renderBankingFields()}
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                  style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', opacity: !isStep1Valid() ? 0.5 : 1, transition: 'all 0.2s' }}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem', color: '#fff' }}>Transfer Amount</h2>
                
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
                  <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Available Balance: {balance.toFixed(2)} {sourceCurrency}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #1e293b' }}>
                  <h4 style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 800, letterSpacing: '0.05em' }}>RECIPIENT DETAILS</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{accountName || 'Unnamed Recipient'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {banks.find(b => (b.bank_code || b.code || b.bankCode) === bankCode)?.name || 'Local Bank'} • {accountNumber}
                      </div>
                    </div>
                  </div>
                  {routingNumber && <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}><span>{targetCurrency === 'USD' ? 'Routing' : 'Sort Code'}</span><span style={{ color: '#fff' }}>{routingNumber}</span></div>}
                  {swiftCode && <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}><span>SWIFT</span><span style={{ color: '#fff' }}>{swiftCode}</span></div>}
                  {iban && <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}><span>IBAN</span><span style={{ color: '#fff', fontSize: '0.75rem' }}>{iban}</span></div>}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#94a3b8' }}>Transfer Fee</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>0.00 {sourceCurrency}</span>
                  </div>
                  {sourceCurrency !== targetCurrency && exchangeRate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#94a3b8' }}>Recipient Gets (~{exchangeRate})</span>
                      <span style={{ fontWeight: 600, color: '#22d3ee' }}>{amount ? (parseFloat(amount) * exchangeRate).toFixed(2) : '0.00'} {targetCurrency}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>Total To Pay</span>
                    <span style={{ fontWeight: 800, color: '#6366f1' }}>{amount ? parseFloat(amount).toFixed(2) : '0.00'} {sourceCurrency}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid #1e293b', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                   <button 
                     onClick={handlePayout}
                     disabled={loading || !amount || parseFloat(amount) > balance}
                     style={{ flex: 2, background: '#6366f1', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', opacity: (loading || !amount || parseFloat(amount) > balance) ? 0.5 : 1 }}
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
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Transfer Successful!</h2>
                <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Your transfer of {amount} {sourceCurrency} {sourceCurrency !== targetCurrency ? `(approx ${(parseFloat(amount) * (exchangeRate || 1)).toFixed(2)} ${targetCurrency}) ` : ''}is being processed.</p>
                <button 
                  onClick={onClose}
                  style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em' };
const inputWrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '1rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '0 1.25rem', overflow: 'hidden' };
const inputStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: '#fff', padding: '1.25rem 0', width: '100%', outline: 'none', fontSize: '1rem' };
const selectWrapperStyle: React.CSSProperties = { ...inputWrapperStyle };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none', cursor: 'pointer' };

export default PayoutModal;
