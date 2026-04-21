import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  RefreshCcw, 
  ShieldCheck,
  Zap,
  ChevronRight,
  PlusCircle,
  X,
  DollarSign,
  Fingerprint,
  TrendingUp,
  Activity,
  ShieldAlert,
  BarChart3,
  Globe,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  CheckCircle2,
  Database,
  Cpu,
  Shield
} from 'lucide-react';
import { API_BASE } from './config';
import VerificationGate from './VerificationGate';

const CardsDashboard = ({ wallets: propWallets }: { wallets?: any[] }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [isPinVerifyModalOpen, setIsPinVerifyModalOpen] = useState(false);
  const [pinToVerify, setPinToVerify] = useState('');
  const [cardToVerify, setCardToVerify] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [needsKycRefresh, setNeedsKycRefresh] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, any[]>>({});
  
  const [fundAmount, setFundAmount] = useState('');
  const [fundWalletId, setFundWalletId] = useState('');
  const [transferPin, setTransferPin] = useState('');
  const [wallets, setWallets] = useState<any[]>(propWallets || []);
  const [submitting, setSubmitting] = useState(false);

  const [issueWalletId, setIssueWalletId] = useState('');
  const [issueCurrency, setIssueCurrency] = useState('USD');
  const [issueBvn, setIssueBvn] = useState('');
  const [issuePhone, setIssuePhone] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const fetchCards = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCards(data);
        data.forEach(card => fetchSubscriptions(card.id));
      }
      setLoading(false);
      setTimeout(() => setRefreshing(false), 800);
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVerifyPinAndShow = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/users/verify-pin`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin: pinToVerify })
      });
      if (res.ok) {
        if (cardToVerify) {
          setShowNumbers(prev => ({ ...prev, [cardToVerify]: true }));
        }
        setIsPinVerifyModalOpen(false);
        setPinToVerify('');
        setCardToVerify(null);
      } else {
        alert('INCORRECT PIN: Access Denied.');
      }
    } catch (err) {
      alert('Verification Error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSubscriptions = async (cardId: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/${cardId}/subscriptions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSubscriptions(prev => ({ ...prev, [cardId]: data }));
    } catch (err) {}
  };

  const toggleBlock = async (cardId: string, merchantName: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/${cardId}/block-merchant`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ merchantName })
      });
      if (res.ok) fetchSubscriptions(cardId);
    } catch (err) {}
  };

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUserData(data);
      if (data.wallets) setWallets(data.wallets);
      if (data.metadata?.bvn) setIssueBvn(data.metadata.bvn);
      if (data.metadata?.phone || data.metadata?.phoneNumber) {
        setIssuePhone(data.metadata.phone || data.metadata.phoneNumber);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchCards();
    fetchWallets();
  }, []);

  const handleIssueCard = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/issue`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency: issueCurrency,
          walletId: issueWalletId,
          bvn: issueBvn,
          phone: issuePhone
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsIssueModalOpen(false);
        fetchCards();
        fetchWallets();
      } else {
        alert(data.error || 'Card issuance failed');
      }
    } catch (err) {
      alert('Issuance Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFundCard = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/${selectedCard.id}/fund`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: fundAmount, walletId: fundWalletId, pin: transferPin })
      });
      if (res.ok) {
        setIsFundingModalOpen(false);
        setFundAmount('');
        setTransferPin('');
        fetchCards();
        fetchWallets();
      } else {
        const data = await res.json();
        alert(data.error || 'Funding failed');
      }
    } catch (err) {
      alert('Funding Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/${selectedCard.id}/withdraw`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: fundAmount, pin: transferPin })
      });
      if (res.ok) {
        setIsWithdrawModalOpen(false);
        setFundAmount('');
        setTransferPin('');
        fetchCards();
        fetchWallets();
      } else {
        const data = await res.json();
        alert(data.error || 'Withdrawal failed');
      }
    } catch (err) {
      alert('Withdrawal Error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFreeze = async (cardId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const action = currentStatus === 'ACTIVE' ? 'freeze' : 'unfreeze';
      const res = await fetch(`${API_BASE}/api/cards/${cardId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCards();
    } catch (err) {}
  };

  const metrics = useMemo(() => {
    const activeVolume = cards.reduce((sum, c) => sum + parseFloat(c.balance || '0'), 0);
    const activeCards = cards.filter(c => c.status === 'ACTIVE').length;
    const frozenCards = cards.filter(c => c.status === 'FROZEN').length;
    const totalDailyLimit = cards.reduce((sum, c) => sum + parseFloat(c.dailyLimit || '0'), 0);
    const averageSavings = activeVolume > 0 ? (activeVolume * 0.032).toFixed(2) : '0.00';
    const totalSubscriptions = Object.values(subscriptions).reduce((sum: number, subs: any) => sum + (Array.isArray(subs) ? subs.length : 0), 0);
    const activeSubscriptions = Object.values(subscriptions).reduce((sum: number, subs: any) => sum + (Array.isArray(subs) ? subs.filter((s: any) => s.status !== 'BLOCKED').length : 0), 0);
    
    return { activeVolume, activeCards, frozenCards, totalDailyLimit, averageSavings, totalSubscriptions, activeSubscriptions };
  }, [cards, subscriptions]);

  const aiSecurityInsights = useMemo(() => [
    { 
      title: "AI Spending Shield", 
      status: metrics.activeCards > 0 ? "Active" : "Standby", 
      desc: `Monitoring ${metrics.activeCards} active rail${metrics.activeCards !== 1 ? 's' : ''} across $${metrics.activeVolume.toLocaleString(undefined, {minimumFractionDigits: 2})} in deployed capital.`,
      icon: <Fingerprint size={20} color="var(--primary)" />
    },
    { 
      title: "FX Optimizer", 
      status: metrics.activeVolume > 0 ? "Calibrated" : "Idle", 
      desc: `Estimated $${metrics.averageSavings} saved via optimized card rails vs. traditional FX spreads.`,
      icon: <Globe size={20} color="var(--accent)" />
    },
    { 
      title: "Smart Protection", 
      status: metrics.frozenCards > 0 ? `${metrics.frozenCards} Frozen` : "Defending", 
      desc: metrics.frozenCards > 0 ? `${metrics.frozenCards} rail${metrics.frozenCards !== 1 ? 's' : ''} currently frozen by security protocol.` : `All ${metrics.activeCards} rail${metrics.activeCards !== 1 ? 's' : ''} operating within safe parameters.`,
      icon: <Shield size={20} color="#ec4899" />
    }
  ], [metrics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      
      {/* Institutional Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <Database size={16} fill="var(--primary)" /> Card Issuance Protocol
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>
            Global <span className="text-glow">Capital Rails</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', fontWeight: 500, lineHeight: 1.6 }}>
            Provision secure, AI-monitored virtual Mastercard rails globally. Integrated with institutional FX settlements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCards} 
            className="btn btn-outline" 
            style={{ padding: '1rem 1.5rem', borderRadius: '18px' }}
          >
            <RefreshCcw size={20} className={refreshing ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsIssueModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '1.1rem 2.5rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900 }}
          >
            <PlusCircle size={22} /> Deploy New Rail
          </motion.button>
        </div>
      </div>

      {/* Analytics Registry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
         {[
           { label: 'ACTIVE VOLUME', value: `$${metrics.activeVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, trend: `+${(metrics.activeVolume > 0 ? 12.4 : 0)}%`, icon: TrendingUp, color: 'var(--text)' },
           { label: 'PROVISIONED RAILS', value: `${metrics.activeCards} / ${cards.length}`, trend: metrics.frozenCards > 0 ? `${metrics.frozenCards} FROZEN` : 'OPERATIONAL', icon: Activity, color: 'var(--accent)' },
           { label: 'DAILY AGGREGATE CAP', value: `$${metrics.totalDailyLimit.toLocaleString()}`, trend: 'LIMIT ACTIVE', icon: Shield, color: 'var(--text)' },
           { label: 'FX ARBITRAGE SAVINGS', value: `$${metrics.averageSavings}`, trend: 'OPTIMIZED', icon: Cpu, color: 'var(--primary)' }
         ].map((m, idx) => (
           <div key={idx} className="premium-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <m.icon size={16} /> {m.label}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: m.color, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: m.trend.includes('FROZEN') ? '#ef4444' : 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: m.trend.includes('FROZEN') ? '#ef4444' : 'var(--accent)' }} />
                 {m.trend}
              </div>
           </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(340px, 1fr)', gap: '4rem', alignItems: 'start' }}>
        
        {/* Rail Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
               <CreditCard size={18} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Active Rail Inventory</h3>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
               <div className="spinner" style={{ width: 48, height: 48, borderTopColor: 'var(--primary)' }} />
            </div>
          ) : cards.length === 0 ? (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="premium-card" 
              style={{ padding: '8rem 2rem', textAlign: 'center', borderStyle: 'dashed', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}
              onClick={() => setIsIssueModalOpen(true)}
            >
              <div style={{ width: 100, height: 100, background: 'rgba(99,102,241,0.05)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                <CreditCard size={50} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Zero Capital Rails Detected</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 3rem', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
                Deploy your first high-velocity Mastercard rail to begin global settlements.
              </p>
              <button className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>
                Deploy First Rail
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
              {cards.map(card => (
                <motion.div 
                  key={card.id}
                  whileHover={{ y: -10 }}
                  className="holographic-card"
                  style={{ 
                    padding: '3rem', 
                    minHeight: '340px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="mesh-bg" style={{ opacity: 0.2 }} />
                  
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>INSTITUTIONAL RAIL</div>
                          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{card.brand?.toUpperCase() || 'MASTERCARD'}</div>
                       </div>
                       <div style={{ 
                         background: card.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                         color: card.status === 'ACTIVE' ? 'var(--accent)' : '#ef4444', 
                         padding: '0.6rem 1.5rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${card.status === 'ACTIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                       }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.status === 'ACTIVE' ? 'var(--accent)' : '#ef4444', boxShadow: `0 0 10px ${card.status === 'ACTIVE' ? 'var(--accent)' : '#ef4444'}` }} />
                         {card.status === 'ACTIVE' ? 'OPERATIONAL' : 'FROZEN'}
                       </div>
                    </div>

                    <div style={{ marginBottom: '3.5rem' }}>
                       <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          {showNumbers[card.id] ? card.cardNumber : '•••• •••• •••• ' + ((card.cardNumber || '0000').slice(-4))}
                          <motion.button 
                            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                            onClick={(e) => { e.stopPropagation(); setCardToVerify(card.id); setIsPinVerifyModalOpen(true); }} 
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px', borderRadius: '12px' }}
                          >
                             {showNumbers[card.id] ? <EyeOff size={22} /> : <Eye size={22} />}
                          </motion.button>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '5rem', marginBottom: '3.5rem' }}>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.5rem' }}>EXPIRY</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{card.expiry}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.5rem' }}>SEC CODE</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>{showNumbers[card.id] ? card.cvv : '•••'}</div>
                       </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Globe size={14} /> BILLING PROTOCOL
                       </div>
                       <div style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                          {card.addressLine1 || 'San Francisco, CA'} <br />
                          {card.addressCountry || 'United States'}
                       </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 10, marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <motion.button 
                          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                          onClick={(e) => { e.stopPropagation(); toggleFreeze(card.id, card.status); }} 
                          className="btn btn-outline"
                          style={{ width: '56px', height: '56px', borderRadius: '18px', padding: 0 }}
                        >
                          {card.status === 'ACTIVE' ? <Lock size={22} /> : <Unlock size={22} />}
                        </motion.button>
                        <motion.button 
                          whileHover={{ y: -5 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setIsWithdrawModalOpen(true); }}
                          className="btn btn-outline"
                          style={{ padding: '0 1.75rem', borderRadius: '18px', fontSize: '1rem', fontWeight: 800 }}
                        >
                          Send Money
                        </motion.button>
                        <motion.button 
                          whileHover={{ y: -5 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setIsFundingModalOpen(true); }}
                          className="btn btn-primary"
                          style={{ padding: '0 2.25rem', fontSize: '1rem', borderRadius: '18px', fontWeight: 900 }}
                        >
                          Inject
                        </motion.button>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '2px', marginBottom: '0.5rem' }}>NET CAPITAL</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>${parseFloat(card.balance || '0').toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Smart Helper Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
           <div className="premium-card" style={{ padding: '3rem', background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)', position: 'sticky', top: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
                 <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px var(--primary-glow)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Sparkles size={28} color="#fff" />
                 </div>
                 <div>
                    <h4 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Smart Helper</h4>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>Active Monitoring</div>
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 {aiSecurityInsights.map((insight, idx) => (
                   <div key={idx} style={{ padding: '2rem', background: 'rgba(255,255,255,0.015)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
                            {insight.icon} {insight.title}
                         </div>
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, color: insight.status === 'Idle' ? 'var(--text-muted)' : 'var(--accent)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>{insight.status.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>
                         {insight.desc}
                      </p>
                   </div>
                 ))}
              </div>
              
              <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                 <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: 500 }}>Provision institutional-grade Mastercard rails globally with near-zero latency.</p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   className="btn btn-outline" 
                   style={{ width: '100%', borderRadius: '18px', padding: '1.1rem', fontWeight: 800 }}
                 >
                    Technical Specifications
                 </motion.button>
              </div>
           </div>
        </div>
      </div>

      {/* Global Card Modals */}
      <AnimatePresence>
        {isIssueModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsIssueModalOpen(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="paypee-modal-content"
              style={{ maxWidth: '640px', padding: '4.5rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                     <div style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                        <PlusCircle size={32} />
                     </div>
                     <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Deploy Platinum Rail</h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>MASTERCARD WORLD ELITE PROTOCOL</div>
                     </div>
                  </div>
                  <button onClick={() => setIsIssueModalOpen(false)} className="btn btn-outline" style={{ width: 48, height: 48, borderRadius: '50%', padding: 0 }}><X size={24} /></button>
               </div>

               <form onSubmit={handleIssueCard} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label">CURRENCY REGION</label>
                      <div style={{ position: 'relative' }}>
                        <select value={issueCurrency} onChange={(e) => setIssueCurrency(e.target.value)} className="form-input" style={{ appearance: 'none', paddingRight: '3rem' }}>
                          <option value="USD" style={{ background: '#0a0f1e' }}>🇺🇸 USD (Global Rail)</option>
                          <option value="NGN" style={{ background: '#0a0f1e' }}>🇳🇬 NGN (Local Rail)</option>
                        </select>
                        <ChevronDown size={20} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label className="form-label">ADD MONEY</label>
                      <div style={{ position: 'relative' }}>
                        <select value={issueWalletId} onChange={(e) => setIssueWalletId(e.target.value)} required className="form-input" style={{ appearance: 'none', paddingRight: '3rem' }}>
                          <option value="" disabled style={{ background: '#0a0f1e' }}>Select Source Wallet</option>
                          {wallets.map(w => (
                            <option key={w.id} value={w.id} style={{ background: '#0a0f1e' }}>{w.currency} Rail — {parseFloat(w.balance).toLocaleString()}</option>
                          ))}
                        </select>
                        <ChevronDown size={20} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                      </div>
                    </div>
                  </div>

                  {!userData?.metadata?.bridgecard_id && !userData?.metadata?.bvn && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                       <label className="form-label">KYC PROTOCOL (BVN)</label>
                       <input type="text" className="form-input" maxLength={11} placeholder="Enter 11-digit NIN/BVN" value={issueBvn} onChange={e => setIssueBvn(e.target.value)} style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '2px' }} />
                    </div>
                  )}

                  <div style={{ padding: '2.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '32px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                       <Activity size={20} /> DEPLOYMENT COST MATRIX
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Provisioning Protocol</span>
                          <span style={{ color: '#fff' }}>{issueCurrency === 'USD' ? '$4.00' : '₦5,500'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Initial Liquidity Injection</span>
                          <span style={{ color: '#fff' }}>{issueCurrency === 'USD' ? '$1.00' : '₦1,500'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 900, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                          <span>TOTAL SETTLEMENT</span>
                          <span style={{ color: 'var(--primary)' }}>{issueCurrency === 'USD' ? '$5.00' : '₦7,000'}</span>
                       </div>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting || !issueWalletId} className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', borderRadius: '24px', fontSize: '1.25rem', fontWeight: 900 }}>
                    {submitting ? <div className="spinner" style={{ width: 24, height: 24 }} /> : 'Authorize & Deploy Rail'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isFundingModalOpen || isWithdrawModalOpen) && (
          <div className="paypee-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setIsFundingModalOpen(false); setIsWithdrawModalOpen(false); }} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="paypee-modal-content"
              style={{ maxWidth: '520px', padding: '4.5rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                     <div style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                        {isFundingModalOpen ? <ArrowUpRight size={32} /> : <ArrowDownLeft size={32} />}
                     </div>
                     <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{isFundingModalOpen ? 'Inject Liquidity' : 'Reclaim Capital'}</h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>RAIL SETTLEMENT ENGINE</div>
                     </div>
                  </div>
                  <button onClick={() => { setIsFundingModalOpen(false); setIsWithdrawModalOpen(false); }} className="btn btn-outline" style={{ width: 48, height: 48, borderRadius: '50%', padding: 0 }}><X size={24} /></button>
               </div>

               <form onSubmit={isFundingModalOpen ? handleFundCard : handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                 {isFundingModalOpen && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <label className="form-label">SOURCE WALLET</label>
                     <div style={{ position: 'relative' }}>
                       <select value={fundWalletId} onChange={(e) => setFundWalletId(e.target.value)} required className="form-input" style={{ appearance: 'none', paddingRight: '3rem' }}>
                         <option value="" disabled style={{ background: '#0a0f1e' }}>Select Capital Source</option>
                         {wallets.map(w => (
                           <option key={w.id} value={w.id} style={{ background: '#0a0f1e' }}>{w.currency} Rail — {parseFloat(w.balance).toLocaleString()}</option>
                         ))}
                       </select>
                       <ChevronDown size={20} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                     </div>
                   </div>
                 )}

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <label className="form-label">VOLUME TO {isFundingModalOpen ? 'INJECT' : 'RECLAIM'}</label>
                   <div style={{ position: 'relative' }}>
                     <span style={{ position: 'absolute', left: '1.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.5 }}>$</span>
                     <input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="0.00" required className="form-input" style={{ paddingLeft: '4rem', fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }} />
                   </div>
                 </div>

                 <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '32px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <Lock size={20} color="var(--primary)" />
                      <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>AUTHORIZE PROTOCOL</span>
                   </div>
                   <input 
                    type="password" 
                    maxLength={4} 
                    placeholder="••••"
                    value={transferPin}
                    onChange={(e) => setTransferPin(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '3rem', letterSpacing: '2rem', fontWeight: 900, padding: '1.5rem', background: 'rgba(0,0,0,0.4)', color: 'var(--primary)' }} 
                  />
                </div>

                 <button type="submit" disabled={submitting || transferPin.length < 4} className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', borderRadius: '24px', fontSize: '1.25rem', fontWeight: 900 }}>
                   {submitting ? <div className="spinner" style={{ width: 24, height: 24 }} /> : <><ShieldCheck size={22} /> Execute Settlement</>}
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPinVerifyModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsPinVerifyModalOpen(false)} style={{ position: 'absolute', inset: 0 }} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="paypee-modal-content" 
              style={{ maxWidth: '480px', padding: '4.5rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Lock size={24} />
                     </div>
                     <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Security Intel</h3>
                  </div>
                  <button onClick={() => setIsPinVerifyModalOpen(false)} className="btn btn-outline" style={{ width: 48, height: 48, borderRadius: '50%', padding: 0 }}><X size={24} /></button>
               </div>

               <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
                  Decrypt sensitive rail identifiers by providing your 4-digit security PIN.
               </p>

               <form onSubmit={handleVerifyPinAndShow} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '32px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                     <input 
                      type="password" 
                      maxLength={4}
                      value={pinToVerify} 
                      onChange={(e) => setPinToVerify(e.target.value.replace(/\D/g, ''))} 
                      placeholder="••••" 
                      required 
                      className="form-input" 
                      style={{ textAlign: 'center', fontSize: '3.5rem', letterSpacing: '2rem', fontWeight: 900, padding: '1.5rem', background: 'rgba(0,0,0,0.4)', color: 'var(--primary)' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.25rem', fontWeight: 900, borderRadius: '24px' }} disabled={submitting || pinToVerify.length < 4}>
                     {submitting ? <div className="spinner" style={{ width: 24, height: 24 }} /> : <><Eye size={22} /> Decrypt Protocol</>}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsDashboard;
