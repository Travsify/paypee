import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, RefreshCcw, ChevronDown, AlertTriangle, CheckCircle2, Clock, History } from 'lucide-react';

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

const API_BASE = 'https://paypee-api-kmhv.onrender.com';

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, onSuccess, wallets }) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'quote' | 'success' | 'error' | 'history'>('form');
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const timerRef = useRef<any>(null);

  const availableCurrencies = wallets
    .filter((w: any) => ['NGN', 'USD', 'EUR', 'GBP'].includes(w.currency))
    .map((w: any) => w.currency);

  const getBalance = (currency: string) => {
    const w = wallets.find((w: any) => w.currency === currency);
    return w ? parseFloat(w.balance).toFixed(2) : '0.00';
  };

  const resetModal = () => {
    setFromCurrency('');
    setToCurrency('');
    setAmount('');
    setStep('form');
    setQuote(null);
    setError('');
    setIsLoading(false);
    setCountdown(30);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleClose = () => { resetModal(); onClose(); };

  // Countdown timer for quote expiry
  useEffect(() => {
    if (step === 'quote' && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setError('Quote expired. Please get a new rate.');
            setStep('form');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [step]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('paypee_token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  const getQuote = async () => {
    if (!fromCurrency || !toCurrency || !amount || parseFloat(amount) <= 0) {
      setError('Please fill in all fields with valid values.'); return;
    }
    if (fromCurrency === toCurrency) {
      setError('Source and target currencies must be different.'); return;
    }
    if (parseFloat(amount) > parseFloat(getBalance(fromCurrency))) {
      setError(`Insufficient balance. You have ${currencyConfig[fromCurrency]?.symbol}${getBalance(fromCurrency)} available.`); return;
    }
    setIsLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/fx/quote`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ sourceCurrency: fromCurrency, targetCurrency: toCurrency, amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get quote');
      setQuote(data);
      setCountdown(data.expiresIn || 30);
      setStep('quote');
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const executeSwap = async () => {
    if (!quote?.reference) { setError('No valid quote. Please try again.'); return; }
    setIsLoading(true); setError('');
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const res = await fetch(`${API_BASE}/api/fx/swap`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ quoteReference: quote.reference })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Swap failed');
      setQuote({ ...quote, ...data });
      setStep('success');
      onSuccess();
    } catch (err: any) { setError(err.message); setStep('error'); }
    finally { setIsLoading(false); }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/fx/history`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setSwapHistory(data);
    } catch (err) { console.error('FX history error:', err); }
    finally { setHistoryLoading(false); }
  };

  if (!isOpen) return null;

  const fromConfig = currencyConfig[fromCurrency] || { symbol: '', icon: '💱', color: '#6366f1' };
  const toConfig = currencyConfig[toCurrency] || { symbol: '', icon: '💱', color: '#6366f1' };

  const selectStyle: React.CSSProperties = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer' };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: '#0a0f1e', borderRadius: '32px', border: '1px solid var(--border)', width: '100%', maxWidth: '480px', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ padding: '2rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRightLeft size={20} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Currency Swap</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { if (step !== 'history') { fetchHistory(); setStep('history'); } else setStep('form'); }}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step === 'history' ? '#f59e0b' : '#fff' }}>
                <History size={16} />
              </button>
              <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><X size={18} /></button>
            </div>
          </div>

          <div style={{ padding: '0 2rem 2rem' }}>
            <AnimatePresence mode="wait">

              {/* HISTORY TAB */}
              {step === 'history' && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Recent swap transactions</p>
                  {historyLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
                  ) : swapHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No swap history yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {swapHistory.slice(0, 10).map((swap: any) => (
                        <div key={swap.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                              {currencyConfig[swap.sourceCurrency]?.icon} {parseFloat(swap.sourceAmount).toFixed(2)} {swap.sourceCurrency} → {currencyConfig[swap.targetCurrency]?.icon} {parseFloat(swap.targetAmount).toFixed(2)} {swap.targetCurrency}
                            </span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: swap.status === 'COMPLETED' ? '#10b981' : '#f43f5e', background: swap.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                              {swap.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Rate: {parseFloat(swap.rate).toFixed(4)} · {new Date(swap.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setStep('form')} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                    New Swap
                  </button>
                </motion.div>
              )}

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
                        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} style={selectStyle}>
                          <option value="" style={{ background: '#0a0f1e' }}>Select</option>
                          {availableCurrencies.map((c: string) => (
                            <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                        style={{ flex: 1, padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }} />
                    </div>
                    {fromCurrency && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Available: {currencyConfig[fromCurrency]?.symbol}{getBalance(fromCurrency)}</span>
                        <button onClick={() => setAmount(getBalance(fromCurrency))} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>MAX</button>
                      </div>
                    )}
                  </div>

                  {/* Swap Arrow */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}
                      onClick={() => { if (fromCurrency && toCurrency) { const tmp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(tmp); } }}
                      style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ArrowRightLeft size={16} color="#f59e0b" style={{ transform: 'rotate(90deg)' }} />
                    </motion.div>
                  </div>

                  {/* To Currency */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', letterSpacing: '1px', marginBottom: '0.5rem' }}>TO</label>
                    <div style={{ position: 'relative' }}>
                      <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} style={selectStyle}>
                        <option value="" style={{ background: '#0a0f1e' }}>Select target currency</option>
                        {availableCurrencies.filter((c: string) => c !== fromCurrency).map((c: string) => (
                          <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                    {toCurrency && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Balance: {currencyConfig[toCurrency]?.symbol}{getBalance(toCurrency)}</div>}
                  </div>

                  {error && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} /> {error}
                    </div>
                  )}

                  <button onClick={getQuote} disabled={isLoading || !fromCurrency || !toCurrency || !amount}
                    style={{ width: '100%', padding: '1rem', background: (!fromCurrency || !toCurrency || !amount) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: (!fromCurrency || !toCurrency || !amount) ? '#64748b' : '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: (!fromCurrency || !toCurrency || !amount) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={18} /></motion.div> Getting Rate...</>) : (<>Get Live Rate <ArrowRightLeft size={18} /></>)}
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
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{fromConfig.symbol}{(quote.sourceAmount || parseFloat(amount)).toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{quote.sourceCurrency || fromCurrency}</div>
                      </div>
                      <ArrowRightLeft size={24} color="#f59e0b" />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{toConfig.icon}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{toConfig.symbol}{(quote.targetAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{quote.targetCurrency || toCurrency}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Exchange Rate</span>
                        <span style={{ fontWeight: 700 }}>1 {fromCurrency} = {quote.rate || 'N/A'} {toCurrency}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Available Balance</span>
                        <span style={{ fontWeight: 600 }}>{fromConfig.symbol}{(quote.sourceBalance || parseFloat(getBalance(fromCurrency))).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Clock size={14} color={countdown <= 10 ? '#f43f5e' : '#f59e0b'} />
                    <span style={{ fontSize: '0.8rem', color: countdown <= 10 ? '#f43f5e' : 'var(--text-muted)', fontWeight: 700 }}>
                      Quote expires in {countdown}s
                    </span>
                    <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div style={{ height: '100%', background: countdown <= 10 ? '#f43f5e' : '#f59e0b', borderRadius: '2px' }}
                        animate={{ width: `${(countdown / 30) * 100}%` }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} /> {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => { setStep('form'); setCountdown(30); if (timerRef.current) clearInterval(timerRef.current); }}
                      style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={executeSwap} disabled={isLoading || countdown <= 0}
                      style={{ flex: 2, padding: '1rem', background: countdown <= 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #10b981, #059669)', color: countdown <= 0 ? '#64748b' : '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', cursor: countdown <= 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCcw size={18} /></motion.div> Swapping...</>) : (<>Confirm Swap <CheckCircle2 size={18} /></>)}
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {fromConfig.symbol}{(quote?.sourceAmount || parseFloat(amount)).toLocaleString()} {fromCurrency} → {toConfig.symbol}{(quote?.targetAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2rem' }}>Rate: 1 {fromCurrency} = {quote?.rate} {toCurrency}</p>
                  <button onClick={handleClose} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
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
                  <button onClick={() => { setStep('form'); setError(''); }} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
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
