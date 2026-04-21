import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRightLeft, 
  RefreshCcw, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  History, 
  Lock,
  ArrowDown,
  ShieldCheck,
  TrendingUp,
  Zap,
  Globe,
  Activity,
  Cpu,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { API_BASE } from './config';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  wallets: any[];
}

const currencyConfig: Record<string, { symbol: string; icon: string; color: string; name: string; gradient: string }> = {
  NGN: { symbol: '₦', icon: '🇳🇬', color: '#10b981', name: 'Nigerian Naira', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  USD: { symbol: '$', icon: '🇺🇸', color: '#3b82f6', name: 'US Dollar', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  EUR: { symbol: '€', icon: '🇪🇺', color: '#6366f1', name: 'Euro', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
  GBP: { symbol: '£', icon: '🇬🇧', color: '#8b5cf6', name: 'British Pound', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
  USDT: { symbol: '₮', icon: '💵', color: '#26a17b', name: 'Tether USDT', gradient: 'linear-gradient(135deg, #26a17b 0%, #1a7f61 100%)' },
  USDC: { symbol: '$', icon: '🔵', color: '#2775ca', name: 'USD Coin', gradient: 'linear-gradient(135deg, #2775ca 0%, #1a5cad 100%)' },
  BTC: { symbol: '₿', icon: '₿', color: '#f59e0b', name: 'Bitcoin', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
};

const ALL_SUPPORTED_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP', 'USDT', 'USDC'];

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, onComplete, wallets }) => {
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
  const [pin, setPin] = useState('');
  const timerRef = useRef<any>(null);

  const userOwnedCurrencies = wallets
    .filter((w: any) => ALL_SUPPORTED_CURRENCIES.includes(w.currency))
    .map((w: any) => w.currency);

  const getBalance = (currency: string) => {
    const w = wallets.find((w: any) => w.currency === currency);
    return w ? parseFloat(w.balance).toFixed(2) : '0.00';
  };

  const resetModal = () => {
    setFromCurrency(userOwnedCurrencies[0] || '');
    setToCurrency(ALL_SUPPORTED_CURRENCIES.find(c => c !== userOwnedCurrencies[0]) || '');
    setAmount('');
    setStep('form');
    setQuote(null);
    setError('');
    setIsLoading(false);
    setCountdown(30);
    setPin('');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isOpen) resetModal();
  }, [isOpen]);

  const handleClose = () => { resetModal(); onClose(); };

  useEffect(() => {
    if (step === 'quote' && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev: number) => {
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
      setError('Please enter a valid amount.'); return;
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
    try {
      const res = await fetch(`${API_BASE}/api/fx/swap`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ quoteReference: quote.reference, pin })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Swap failed');
      setQuote({ ...quote, ...data });
      setStep('success');
      onComplete();
    } catch (err: any) { setError(err.message); }
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

  const fromConfig = currencyConfig[fromCurrency] || { symbol: '', icon: '💱', color: '#6366f1', name: '', gradient: '' };
  const toConfig = currencyConfig[toCurrency] || { symbol: '', icon: '💱', color: '#6366f1', name: '', gradient: '' };

  return (
    <div className="paypee-modal-overlay">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleClose} style={{ position: 'absolute', inset: 0 }} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="paypee-modal-content"
        style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden', padding: 0, background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}
      >
        <div className="mesh-bg" style={{ opacity: 0.1 }} />
        
        {/* Header */}
        <div style={{ padding: '3rem 3rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '18px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ArrowRightLeft size={28} />
            </div>
            <div>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>Currency Swap</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '1px' }}>
                  <Activity size={14} /> LIVE MARKET EXECUTION
               </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => { if (step !== 'history') { fetchHistory(); setStep('history'); } else setStep('form'); }}
              className="btn btn-outline"
              style={{ width: 48, height: 48, padding: 0, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', color: step === 'history' ? 'var(--primary)' : '#fff' }}
            >
              <History size={22} />
            </button>
            <button onClick={handleClose} className="btn btn-outline" style={{ width: 48, height: 48, padding: 0, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}><X size={22} /></button>
          </div>
        </div>

        <div style={{ padding: '0 3rem 3.5rem', position: 'relative', zIndex: 10 }}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '1.25rem 1.5rem', borderRadius: '18px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', fontWeight: 800, border: '1px solid rgba(244, 63, 94, 0.2)' }}
            >
              <AlertTriangle size={20} /> {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem' }} className="no-scrollbar">
                  {historyLoading ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}><RefreshCcw className="animate-spin" size={40} color="var(--primary)" /></div>
                  ) : swapHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', fontWeight: 600 }}>No swap history found.</div>
                  ) : (
                    swapHistory.map((swap: any) => (
                      <div key={swap.id} className="premium-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                            {parseFloat(swap.sourceAmount).toLocaleString()} {swap.sourceCurrency} <ArrowRight size={14} style={{ display: 'inline', margin: '0 0.25rem' }} /> {parseFloat(swap.targetAmount).toLocaleString()} {swap.targetCurrency}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: swap.status === 'COMPLETED' ? 'var(--accent)' : '#f43f5e', background: swap.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', padding: '6px 12px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {swap.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                          <span>Rate: 1 {swap.sourceCurrency} = {parseFloat(swap.rate).toFixed(4)} {swap.targetCurrency}</span>
                          <span>{new Date(swap.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button onClick={() => setStep('form')} className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.4rem', borderRadius: '22px', fontWeight: 900 }}>
                  Return to Terminal
                </button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Swap Input Card */}
                <div className="premium-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.75rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                      <div style={{ flex: 1 }}>
                         <label className="form-label">LIQUIDITY SOURCE (SELL)</label>
                         <input 
                           type="number" 
                           value={amount} 
                           onChange={e => setAmount(e.target.value)} 
                           placeholder="0.00"
                           className="text-glow"
                           style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '3.5rem', fontWeight: 900, outline: 'none', width: '100%', padding: 0, letterSpacing: '-0.02em' }} 
                         />
                      </div>
                      <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                         <select 
                           value={fromCurrency} 
                           onChange={e => setFromCurrency(e.target.value)} 
                           className="form-input" 
                           style={{ width: '140px', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', appearance: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.1rem', fontWeight: 800 }}
                         >
                           {userOwnedCurrencies.map((c: string) => (
                             <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                           ))}
                         </select>
                         <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.6 }} />
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wallet size={16} /> Aggregate Balance: {fromConfig.symbol}{getBalance(fromCurrency)}
                      </span>
                      <button onClick={() => setAmount(getBalance(fromCurrency))} style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 900, padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>MAX</button>
                   </div>
                </div>

                {/* Switch Button */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-24px 0', zIndex: 10, position: 'relative' }}>
                   <motion.button 
                     whileHover={{ scale: 1.15, rotate: 180 }}
                     onClick={() => { const tmp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(tmp); }}
                     style={{ width: 56, height: 56, borderRadius: '18px', background: '#0a0f1e', border: '5px solid #1a2235', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}
                   >
                     <ArrowDown size={28} strokeWidth={3} />
                   </motion.button>
                </div>

                {/* Target Card */}
                <div className="premium-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', marginTop: '0.75rem', marginBottom: '3.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                         <label className="form-label">TARGET ASSET (ESTIMATED)</label>
                         <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)', letterSpacing: '-0.02em' }}>
                            {amount ? '---' : '0.00'}
                         </div>
                      </div>
                      <div style={{ position: 'relative', marginTop: '1.5rem' }}>
                         <select 
                           value={toCurrency} 
                           onChange={e => setToCurrency(e.target.value)} 
                           className="form-input" 
                           style={{ width: '140px', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', appearance: 'none', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.1rem', fontWeight: 800 }}
                         >
                           {ALL_SUPPORTED_CURRENCIES.filter(c => c !== fromCurrency).map((c: string) => (
                             <option key={c} value={c} style={{ background: '#0a0f1e' }}>{currencyConfig[c]?.icon} {c}</option>
                           ))}
                         </select>
                         <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.6 }} />
                      </div>
                   </div>
                   <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} /> Routing to: {toConfig.name}
                   </div>
                </div>

                <button 
                  onClick={getQuote} 
                  disabled={isLoading || !amount || parseFloat(amount) <= 0}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.6rem', borderRadius: '24px', fontSize: '1.25rem', fontWeight: 900, gap: '1.25rem' }}
                >
                  {isLoading ? <RefreshCcw className="animate-spin" /> : <><Zap size={22} fill="#fff" /> Request Market Quote</>}
                </button>
              </motion.div>
            )}

            {step === 'quote' && quote && (
              <motion.div key="quote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                   <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>INBOUND SETTLEMENT</div>
                   <div style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.06em', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>{toConfig.symbol}</span>
                      <span className="text-glow">{(quote.targetAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   </div>
                   <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px' }}>{toCurrency.toUpperCase()} ASSET</div>
                </div>

                <div className="premium-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2.5rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                         <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Outbound Liquidity</span>
                         <span style={{ fontWeight: 900, color: '#fff' }}>{parseFloat(amount).toLocaleString()} {fromCurrency}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                         <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Exchange Rate</span>
                         <span style={{ fontWeight: 900, color: 'var(--accent)' }}>1 {fromCurrency} = {quote.rate} {toCurrency}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                         <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Protocol Fee</span>
                         <span style={{ fontWeight: 900, color: 'var(--accent)', letterSpacing: '1px' }}>0.00 (SUBSIDIZED)</span>
                      </div>
                   </div>
                </div>

                {/* Countdown */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '3.5rem' }}>
                   <Clock size={20} color={countdown <= 10 ? '#f43f5e' : 'var(--primary)'} />
                   <div style={{ flex: 1, maxWidth: '250px', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: '100%' }} 
                        animate={{ width: `${(countdown / 30) * 100}%` }} 
                        style={{ height: '100%', background: countdown <= 10 ? '#f43f5e' : 'var(--primary)', boxShadow: `0 0 10px ${countdown <= 10 ? '#f43f5e' : 'var(--primary)'}66` }} 
                      />
                   </div>
                   <span style={{ fontSize: '1rem', fontWeight: 900, color: countdown <= 10 ? '#f43f5e' : 'var(--primary)', width: '40px' }}>{countdown}s</span>
                </div>

                <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '28px', border: '1px solid rgba(99, 102, 241, 0.1)', marginBottom: '3rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Lock size={20} />
                      </div>
                      <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--primary)' }}>AUTHORIZATION PIN</span>
                   </div>
                   <input 
                    type="password" 
                    maxLength={4} 
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '3rem', letterSpacing: '2rem', fontWeight: 900, padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '18px' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                   <button onClick={() => setStep('form')} className="btn btn-outline" style={{ padding: '1.4rem', borderRadius: '22px', fontWeight: 900 }}>Cancel</button>
                   <button 
                     onClick={executeSwap} 
                     disabled={isLoading || pin.length < 4}
                     className="btn btn-primary"
                     style={{ padding: '1.4rem', borderRadius: '22px', fontSize: '1.25rem', fontWeight: 900 }}
                   >
                     {isLoading ? <RefreshCcw className="animate-spin" /> : <><ShieldCheck size={24} /> Authorize Swap</>}
                   </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: 120, height: 120, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', margin: '0 auto 3.5rem', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)' }}>
                   <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
                <h2 className="text-glow" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#fff', letterSpacing: '-0.04em' }}>Swap Finalized</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '4rem', maxWidth: '450px', margin: '0 auto 4rem', fontWeight: 500 }}>
                   Inbound settlement of <span style={{ color: 'var(--accent)', fontWeight: 900 }}>{(quote?.targetAmount || 0).toLocaleString()} {toCurrency}</span> has been confirmed on the Paypee primary ledger.
                </p>
                <button 
                  onClick={handleClose}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.6rem', borderRadius: '24px', fontSize: '1.25rem', fontWeight: 900 }}
                >
                  Return to Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Decorative flair */}
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
           <Cpu size={400} />
        </div>
      </motion.div>
    </div>
  );
};

export default SwapModal;
