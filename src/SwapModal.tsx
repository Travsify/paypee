import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, RefreshCcw, ChevronDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wallets: any[];
}

const currencyConfig: Record<string, { symbol: string; icon: string; color: string }> = {
  NGN: { symbol: '₦', icon: '🇳🇬', color: '#10b981' },
  USD: { symbol: '$', icon: '🇺🇸', color: '#3b82f6' },
  EUR: { symbol: '€', icon: '🇪🇺', color: '#6366f1' },
  GBP: { symbol: '£', icon: '🇬🇧', color: '#8b5cf6' },
};

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, onSuccess, wallets }) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'quote' | 'success' | 'error'>('form');
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCurrencies = wallets
    .filter((w: any) => ['NGN', 'USD', 'EUR', 'GBP'].includes(w.currency))
    .map((w: any) => w.currency);

  const resetModal = () => {
    setFromCurrency('');
    setToCurrency('');
    setAmount('');
    setStep('form');
    setQuote(null);
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getQuote = async () => {
    if (!fromCurrency || !toCurrency || !amount || parseFloat(amount) <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    if (fromCurrency === toCurrency) {
      setError('Source and target currencies must be different.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/fx/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sourceCurrency: fromCurrency, targetCurrency: toCurrency, amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get quote');
      setQuote(data);
      setStep('quote');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async () => {
    if (!quote?.reference) {
      setError('No valid quote reference. Please try again.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/fx/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quoteReference: quote.reference })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Swap failed');
      setStep('success');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const fromConfig = currencyConfig[fromCurrency] || { symbol: '', icon: '💱', color: '#6366f1' };
  const toConfig = currencyConfig[toCurrency] || { symbol: '', icon: '💱', color: '#6366f1' };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#0a0f1e', borderRadius: '32px', border: '1px solid var(--border)',
            width: '100%', maxWidth: '480px', overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '2rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRightLeft size={20} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Currency Swap</h3>
            </div>
            <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><X size={18} /></button>
          </div>

          <div style={{ padding: '0 2rem 2rem' }}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Form */}
              {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Swap between your wallet currencies at live Maplerad FX rates.
                  </p>

                  {/* From Currency */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>FROM</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ position: 'relative', flex: '0 0 140px' }}>
                        <select
                          value={fromCurrency}
                          onChange={e => setFromCurrency(e.target.value)}
                          style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#0a0f1e' }}>Select</option>
                          {availableCurrencies.map((c: string) => (
                            <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                        style={{ flex: 1, padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Swap Arrow */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRightLeft size={16} color="#f59e0b" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  </div>

                  {/* To Currency */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>TO</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={toCurrency}
                        onChange={e => setToCurrency(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: '#0a0f1e' }}>Select target currency</option>
                        {availableCurrencies.filter((c: string) => c !== fromCurrency).map((c: string) => (
                          <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} /> {error}
                    </div>
                  )}

                  <button
                    onClick={getQuote}
                    disabled={isLoading || !fromCurrency || !toCurrency || !amount}
                    style={{
                      width: '100%', padding: '1rem', background: (!fromCurrency || !toCurrency || !amount) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: (!fromCurrency || !toCurrency || !amount) ? '#64748b' : '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem',
                      cursor: (!fromCurrency || !toCurrency || !amount) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                    }}
                  >
                    {isLoading ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={18} /></motion.div> Getting Rate...</>
                    ) : (
                      <>Get Live Rate <ArrowRightLeft size={18} /></>
                    )}
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Quote Confirmation */}
              {step === 'quote' && quote && (
                <motion.div key="quote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{fromConfig.icon}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{fromConfig.symbol}{parseFloat(amount).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{fromCurrency}</div>
                      </div>
                      <ArrowRightLeft size={24} color="#f59e0b" />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{toConfig.icon}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{toConfig.symbol}{(quote.target_amount ? (quote.target_amount / 100) : 0).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{toCurrency}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Exchange Rate</span>
                        <span style={{ fontWeight: 700 }}>1 {fromCurrency} = {quote.rate || 'N/A'} {toCurrency}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Quote Reference</span>
                        <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.7rem' }}>{quote.reference?.substring(0, 16)}...</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
                    This quote expires in 30 seconds. Confirm to execute the swap.
                  </p>

                  {error && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} /> {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setStep('form')} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                      Back
                    </button>
                    <button
                      onClick={executeSwap}
                      disabled={isLoading}
                      style={{ flex: 2, padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {isLoading ? (
                        <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={18} /></motion.div> Swapping...</>
                      ) : (
                        <>Confirm Swap <CheckCircle2 size={18} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Success */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle2 size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Swap Complete!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    {fromConfig.symbol}{parseFloat(amount).toLocaleString()} {fromCurrency} has been swapped successfully.
                  </p>
                  <button onClick={handleClose} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                    Done
                  </button>
                </motion.div>
              )}

              {/* STEP 4: Error */}
              {step === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', border: '2px solid #f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <AlertTriangle size={40} color="#f43f5e" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Swap Failed</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{error || 'Something went wrong. Please try again.'}</p>
                  <button onClick={() => { setStep('form'); setError(''); }} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwapModal;
