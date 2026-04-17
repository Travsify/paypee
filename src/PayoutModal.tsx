import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Building2, 
  User, 
  AlertCircle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  balance: string;
}

const PayoutModal: React.FC<PayoutModalProps> = ({ isOpen, onClose, onSuccess, balance }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handlePayout = async () => {
    setLoading(true);
    // Simulate Fincra request
    setTimeout(() => {
       setLoading(false);
       setStep(3);
       onSuccess();
    }, 2500);
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
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Send Money</h2>
                <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Enter recipient details for local bank transfer.</p>
                
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>SELECT BANK</label>
                    <div style={selectWrapperStyle}>
                      <Building2 size={18} color="var(--primary)" />
                      <select value={bank} onChange={(e) => setBank(e.target.value)} style={selectStyle}>
                        <option value="">Select Bank</option>
                        <option value="access">Access Bank</option>
                        <option value="gtb">GTBank</option>
                        <option value="zenith">Zenith Bank</option>
                        <option value="kuda">Kuda Microfinance</option>
                      </select>
                      <ChevronDown size={18} style={{ marginLeft: 'auto' }} />
                    </div>
                  </div>

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>ACCOUNT NUMBER</label>
                    <div style={inputWrapperStyle}>
                      <User size={18} color="var(--primary)" />
                      <input 
                        type="text" 
                        placeholder="0123456789" 
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        style={inputStyle} 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!bank || accountNumber.length < 10}
                  style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', opacity: (!bank || accountNumber.length < 10) ? 0.5 : 1 }}
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem' }}>Transfer Amount</h2>
                
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>$</span>
                    <input 
                      autoFocus
                      type="number" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '200px', textAlign: 'center', fontSize: '3rem', fontWeight: 800 }}
                    />
                  </div>
                  <p style={{ color: '#64748b', marginTop: '1rem' }}>Available Balance: ${balance}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#64748b' }}>Transfer Fee</span>
                    <span style={{ fontWeight: 600 }}>$1.50</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                    <span style={{ fontWeight: 700 }}>Total To Pay</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${(parseFloat(amount || '0') + 1.5).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#fff', border: '1px solid #1e293b', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                   <button 
                     onClick={handlePayout}
                     disabled={loading || !amount || parseFloat(amount) > parseFloat(balance)}
                     style={{ flex: 2, background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', opacity: (loading || !amount || parseFloat(amount) > parseFloat(balance)) ? 0.5 : 1 }}
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
                <p style={{ color: '#64748b', marginBottom: '3rem' }}>Your transfer of ${amount} to {accountNumber} is being processed and will arrive shortly.</p>
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
const inputWrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '16px', padding: '0 1.25rem' };
const inputStyle: React.CSSProperties = { background: 'transparent', border: 'none', color: '#fff', padding: '1.25rem 0', width: '100%', outline: 'none', fontSize: '1rem' };
const selectWrapperStyle: React.CSSProperties = { ...inputWrapperStyle };
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none', cursor: 'pointer' };

export default PayoutModal;
