import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  RefreshCcw, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Settings,
  PlusCircle,
  X,
  DollarSign
} from 'lucide-react';

const CardsDashboard = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  
  // Funding form state
  const [fundAmount, setFundAmount] = useState('');
  const [fundWalletId, setFundWalletId] = useState('');
  const [wallets, setWallets] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Issue form state
  const [issueWalletId, setIssueWalletId] = useState('');
  const [issueCurrency, setIssueCurrency] = useState('USD');

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/cards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCards(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.wallets) setWallets(data.wallets);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCards();
    fetchWallets();
  }, []);

  const toggleFreeze = async (cardId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/cards/${cardId}/toggle-freeze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCards();
    } catch (err) {
      alert('Failed to update card status');
    }
  };

  const handleIssueCard = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/cards', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletId: issueWalletId, currency: issueCurrency })
      });
      if (res.ok) {
        setIsIssueModalOpen(false);
        fetchCards();
      }
    } catch (err) {
      alert('Failed to issue card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFundCard = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/cards/${selectedCard.id}/fund`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletId: fundWalletId, amount: parseFloat(fundAmount) })
      });
      if (res.ok) {
        setIsFundingModalOpen(false);
        setFundAmount('');
        fetchCards();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Virtual Cards</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Global capital at your fingertips. Issue USD and NGN cards instantly.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsIssueModalOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 30px -10px var(--primary)' }}
        >
          <PlusCircle size={20} /> Create Virtual Card
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="spinner" /></div>
      ) : cards.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '32px', padding: '6rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
            <CreditCard size={40} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>No Virtual Cards</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>Deploy high-security virtual cards for global spending on Amazon, Netflix, and more with instant funding.</p>
          <button onClick={() => setIsIssueModalOpen(true)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Generate First Card</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
          {cards.map(card => (
            <motion.div 
              key={card.id}
              whileHover={{ y: -8 }}
              style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(50px)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                <div style={{ width: 56, height: 38, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginLeft: -8 }} />
                   <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', marginLeft: -4 }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', letterSpacing: '2px', opacity: 0.6 }}>VISA</div>
                   {card.status === 'FROZEN' && <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>FROZEN</div>}
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '5px', color: '#fff', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  {showNumbers[card.id] ? card.cardNumber : '•••• •••• •••• ' + card.cardNumber.slice(-4)}
                  <button onClick={() => setShowNumbers(prev => ({ ...prev, [card.id]: !prev[card.id] }))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0.5rem' }}>
                    {showNumbers[card.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4rem', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem' }}>EXPIRY</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{card.expiry}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.4rem' }}>CVV</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{showNumbers[card.id] ? card.cvv : '•••'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleFreeze(card.id, card.status)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     {card.status === 'ACTIVE' ? <Lock size={15} /> : <Unlock size={15} />} {card.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
                   </motion.button>
                   <motion.button 
                     whileTap={{ scale: 0.95 }} 
                     onClick={() => { setSelectedCard(card); setIsFundingModalOpen(true); }}
                     style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                   >
                     Fund
                   </motion.button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>BALANCE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>$0.00</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Issuing Modal */}
      <AnimatePresence>
        {isIssueModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', padding: '2.5rem', width: '100%', maxWidth: '480px' }}>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Deploy New Virtual Card</h3>
               <form onSubmit={handleIssueCard}>
                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>SOURCE WALLET</label>
                   <select value={issueWalletId} onChange={(e) => setIssueWalletId(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none' }}>
                     <option value="">Select Wallet</option>
                     {wallets.map(w => (
                       <option key={w.id} value={w.id}>{w.currency} - {parseFloat(w.balance).toFixed(2)}</option>
                     ))}
                   </select>
                 </div>
                 <div style={{ marginBottom: '2rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>CURRENCY TYPE</label>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div onClick={() => setIssueCurrency('USD')} style={{ padding: '1.5rem', borderRadius: '16px', background: issueCurrency === 'USD' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', border: '2px solid ' + (issueCurrency === 'USD' ? 'var(--primary)' : 'var(--border)'), cursor: 'pointer', textAlign: 'center' }}>
                         <div style={{ fontWeight: 800 }}>USD Card</div>
                         <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Global Spending</div>
                      </div>
                      <div onClick={() => setIssueCurrency('NGN')} style={{ padding: '1.5rem', borderRadius: '16px', background: issueCurrency === 'NGN' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', border: '2px solid ' + (issueCurrency === 'NGN' ? 'var(--primary)' : 'var(--border)'), cursor: 'pointer', textAlign: 'center' }}>
                         <div style={{ fontWeight: 800 }}>NGN Card</div>
                         <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Local Payments</div>
                      </div>
                   </div>
                 </div>
                 <button type="submit" disabled={submitting} style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                   {submitting ? 'Deploying...' : 'Deploy Card Instantly'}
                 </button>
                 <button type="button" onClick={() => setIsIssueModalOpen(false)} style={{ width: '100%', background: 'transparent', color: 'var(--text-muted)', border: 'none', marginTop: '1rem', cursor: 'pointer' }}>Cancel</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Funding Modal */}
      <AnimatePresence>
        {isFundingModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', padding: '2.5rem', width: '100%', maxWidth: '450px' }}>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Fund Virtual Card</h3>
               <form onSubmit={handleFundCard}>
                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>SOURCE WALLET</label>
                   <select value={fundWalletId} onChange={(e) => setFundWalletId(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none' }}>
                     <option value="">Select Wallet</option>
                     {wallets.map(w => (
                       <option key={w.id} value={w.id}>{w.currency} - {parseFloat(w.balance).toFixed(2)}</option>
                     ))}
                   </select>
                 </div>
                 <div style={{ marginBottom: '2rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>AMOUNT TO TOP-UP</label>
                   <div style={{ position: 'relative' }}>
                     <DollarSign size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                     <input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="0.00" required style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1rem 1.25rem 3rem', color: '#fff', fontSize: '1.5rem', fontWeight: 900, outline: 'none' }} />
                   </div>
                 </div>
                 <button type="submit" disabled={submitting} style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                   {submitting ? 'Transferring...' : 'Confirm Top-up'}
                 </button>
                 <button type="button" onClick={() => setIsFundingModalOpen(false)} style={{ width: '100%', background: 'transparent', color: 'var(--text-muted)', border: 'none', marginTop: '1rem', cursor: 'pointer' }}>Cancel</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsDashboard;
