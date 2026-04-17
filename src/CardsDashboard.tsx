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
  PlusCircle
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
  const [fundWallet, setFundWallet] = useState('');
  const [wallets, setWallets] = useState<any[]>([]);

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
      console.error('Failed to fetch cards:', err);
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
    // Note: Implementation would call toggleCardStatus endpoint
    alert('This will toggle card status on production.');
  };

  const handleIssueCard = async (e: any) => {
    e.preventDefault();
    // Implementation for issuing card
    setIsIssueModalOpen(false);
    fetchCards();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Virtual Cards</h2>
          <p style={{ color: 'var(--text-muted)' }}>Issue and manage your global spending cards instantly.</p>
        </div>
        <button 
          onClick={() => setIsIssueModalOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Card
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <RefreshCcw size={40} color="var(--primary)" />
          </motion.div>
        </div>
      ) : cards.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(99,102,241,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <CreditCard size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Virtual Cards Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 2rem' }}>Create a USD or NGN virtual card to pay for global services like Amazon, Netflix, and more.</p>
          <button 
            onClick={() => setIsIssueModalOpen(true)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            Create Your First Card
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {cards.map(card => (
            <CardItem 
              key={card.id} 
              card={card} 
              showNumber={showNumbers[card.id]} 
              onToggle={() => setShowNumbers(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
              onFreeze={() => toggleFreeze(card.id, card.status)}
            />
          ))}
        </div>
      )}

      {/* Issuing Modal Placeholder */}
      <AnimatePresence>
        {isIssueModalOpen && (
          <Modal title="Issue New Card" onClose={() => setIsIssueModalOpen(false)}>
            <form onSubmit={handleIssueCard}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CARD CURRENCY</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid var(--primary)', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>USD</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Global Spending</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '2px solid transparent', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', opacity: 0.5 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>NGN</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Payments</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>INITIAL FUNDING (MIN $5)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}
                />
              </div>

              <button style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                Issue Card Instantly
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const CardItem = ({ card, showNumber, onToggle, onFreeze }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
  >
    {/* Decorative circles */}
    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(40px)' }} />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
      <div style={{ width: 48, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }} />
      <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>VISA</span>
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '4px', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {showNumber ? card.cardNumber : '•••• •••• •••• ' + card.cardNumber.slice(-4)}
        <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0.5rem' }}>
          {showNumber ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '3rem', marginBottom: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>EXPIRY</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{card.expiry}</div>
      </div>
      <div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>CVV</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{showNumber ? card.cvv : '•••'}</div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
         <button onClick={onFreeze} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
           {card.status === 'ACTIVE' ? <Lock size={14} /> : <Unlock size={14} />} {card.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
         </button>
         <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
           Settings
         </button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>BALANCE</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>$0.00</div>
      </div>
    </div>
  </motion.div>
);

const Modal = ({ title, children, onClose }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '480px', position: 'relative' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{title}</h3>
      </div>
      {children}
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
    </motion.div>
  </div>
);

export default CardsDashboard;
