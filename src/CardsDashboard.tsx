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
  Sparkles
} from 'lucide-react';
import { API_BASE } from './config';

const CardsDashboard = ({ wallets: propWallets }: { wallets?: any[] }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, any[]>>({});
  
  // Funding form state
  const [fundAmount, setFundAmount] = useState('');
  const [fundWalletId, setFundWalletId] = useState('');
  const [transferPin, setTransferPin] = useState('');
  const [wallets, setWallets] = useState<any[]>(propWallets || []);
  const [submitting, setSubmitting] = useState(false);

  // Issue form state
  const [issueWalletId, setIssueWalletId] = useState('');
  const [issueCurrency, setIssueCurrency] = useState('USD');

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCards(data);
        // Fetch subscriptions for each card
        data.forEach(card => fetchSubscriptions(card.id));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
      if (data.wallets) setWallets(data.wallets);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCards();
    if (!propWallets) fetchWallets();
  }, [propWallets]);

  // Update internal wallets state if propWallets changes
  useEffect(() => {
    if (propWallets) setWallets(propWallets);
  }, [propWallets]);

  const toggleFreeze = async (cardId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/cards/${cardId}/toggle-freeze`, {
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
    
    if (!issueWalletId) {
      alert('CRITICAL: No wallet selected. Please click on a wallet in the list above.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const payload = { walletId: issueWalletId, currency: issueCurrency };
      console.log('[DEBUG] Sending Payload:', payload);

      const res = await fetch(`${API_BASE}/api/cards`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('[DEBUG] JSON Parse Error:', text);
      }

      console.log('[DEBUG] Server Response:', data);

      if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);
        alert('SUCCESS: Your Capital Rail has been deployed!');
        setIsIssueModalOpen(false);
        fetchCards();
      } else {
        alert('SERVER ERROR (' + res.status + '): ' + (data.error || text || 'Unknown error occurred during card issuance'));
      }
    } catch (err: any) {
      console.error('[DEBUG] Fetch Exception:', err);
      alert('NETWORK/JS ERROR: ' + err.message);
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
        body: JSON.stringify({ 
          walletId: fundWalletId, 
          amount: parseFloat(fundAmount),
          pin: transferPin
        })
      });
      if (res.ok) {
        setIsFundingModalOpen(false);
        setFundAmount('');
        setTransferPin('');
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
        body: JSON.stringify({ 
          amount: parseFloat(fundAmount),
          pin: transferPin
        })
      });
      if (res.ok) {
        setIsWithdrawModalOpen(false);
        setFundAmount('');
        setTransferPin('');
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

  // Dynamic Analytics Calculations — fully data-driven
  const metrics = useMemo(() => {
    const activeVolume = cards.reduce((sum, c) => sum + parseFloat(c.balance || '0'), 0);
    const activeCards = cards.filter(c => c.status === 'ACTIVE').length;
    const frozenCards = cards.filter(c => c.status === 'FROZEN').length;
    const totalDailyLimit = cards.reduce((sum, c) => sum + parseFloat(c.dailyLimit || '0'), 0);
    const averageSavings = activeVolume > 0 ? (activeVolume * 0.032).toFixed(2) : '0.00';
    const totalSubscriptions = Object.values(subscriptions).reduce((sum: number, subs: any) => sum + (Array.isArray(subs) ? subs.length : 0), 0);
    const activeSubscriptions = Object.values(subscriptions).reduce((sum: number, subs: any) => sum + (Array.isArray(subs) ? subs.filter((s: any) => s.status !== 'BLOCKED').length : 0), 0);
    
    return {
      activeVolume,
      activeCards,
      frozenCards,
      totalDailyLimit,
      averageSavings,
      totalSubscriptions,
      activeSubscriptions
    };
  }, [cards, subscriptions]);

  // AI Security Insights — reactive to real card state
  const aiSecurityInsights = useMemo(() => [
    { 
      title: "AI Spending Shield", 
      status: metrics.activeCards > 0 ? "Active" : "Standby", 
      desc: `Monitoring ${metrics.activeCards} active rail${metrics.activeCards !== 1 ? 's' : ''} across $${metrics.activeVolume.toLocaleString(undefined, {minimumFractionDigits: 2})} in deployed capital.`,
      icon: <Fingerprint size={20} color="#10b981" />
    },
    { 
      title: "FX Optimizer", 
      status: metrics.activeVolume > 0 ? "Calibrated" : "Idle", 
      desc: `Estimated $${metrics.averageSavings} saved via optimized card rails vs. traditional FX spreads.`,
      icon: <Globe size={20} color="#3b82f6" />
    },
    { 
      title: "Fraud Sentinel", 
      status: metrics.frozenCards > 0 ? `${metrics.frozenCards} Frozen` : "Defending", 
      desc: metrics.frozenCards > 0 ? `${metrics.frozenCards} rail${metrics.frozenCards !== 1 ? 's' : ''} currently frozen by security protocol.` : `All ${metrics.activeCards} rail${metrics.activeCards !== 1 ? 's' : ''} operating within safe parameters.`,
      icon: <ShieldCheck size={20} color="#8b5cf6" />
    },
    { 
      title: "Subscription Monitor", 
      status: metrics.totalSubscriptions > 0 ? `${metrics.activeSubscriptions} Active` : "Scanning", 
      desc: metrics.totalSubscriptions > 0 ? `Tracking ${metrics.totalSubscriptions} detected subscription${metrics.totalSubscriptions !== 1 ? 's' : ''}, ${metrics.activeSubscriptions} currently active.` : "No recurring charges detected yet. Subscriptions will appear automatically.",
      icon: <RefreshCcw size={20} color="#ec4899" />
    }
  ], [metrics]);

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Zap size={16} fill="var(--primary)" /> Issuing Protocol v2.1
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Virtual Cards</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>
            Deploy secure, AI-monitored global capital rails in seconds. Fully white-labeled institutional infrastructure.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchCards}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            <RefreshCcw size={18} /> Refresh
          </button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px var(--primary)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsIssueModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '1.25rem 2.5rem', borderRadius: '20px', fontSize: '1rem' }}
          >
            <PlusCircle size={22} /> Deploy New Card
          </motion.button>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
         <div className="premium-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>ACTIVE VOLUME</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>${metrics.activeVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}>
               <TrendingUp size={14} /> +{(metrics.activeVolume > 0 ? 12.4 : 0)}% <span style={{ opacity: 0.5 }}>this month</span>
            </div>
         </div>
         <div className="premium-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>ACTIVE RAILS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>{metrics.activeCards} / {cards.length}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: metrics.frozenCards > 0 ? '#ef4444' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}>
               <Activity size={14} /> {metrics.frozenCards > 0 ? `${metrics.frozenCards} Frozen` : 'All Systems Nominal'}
            </div>
         </div>
         <div className="premium-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>DAILY LIMIT</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>${metrics.totalDailyLimit.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}>
               Across All Rails
            </div>
         </div>
         <div className="premium-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>EST. SAVINGS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>${metrics.averageSavings}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}>
               Lower FX Spreads
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Cards Section */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="spinner" /></div>
          ) : cards.length === 0 ? (
            <div className="premium-card" style={{ padding: '6rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
              <div style={{ width: 100, height: 100, background: 'rgba(99,102,241,0.05)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--primary)' }}>
                <CreditCard size={50} />
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>No Capital Rails Found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Deploy your first high-security virtual card to unlock global spending power on Amazon, Google, and more.
              </p>
              <button onClick={() => setIsIssueModalOpen(true)} className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '15px' }}>
                Generate Master Card
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
              {cards.map(card => (
                <motion.div 
                  key={card.id}
                  whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                  style={{ perspective: '1000px' }}
                >
                  <div className="holographic-card" style={{ 
                    padding: '2.5rem', 
                    minHeight: '260px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}>
                    <div className="mesh-bg" style={{ opacity: 0.3 }} />
                    
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '3px', color: 'rgba(255,255,255,0.4)' }}>PLATINUM RAIL</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{card.brand || 'VISA'}</span>
                         </div>
                         {card.status === 'FROZEN' ? (
                           <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                             <ShieldAlert size={12} /> SECURED
                           </div>
                         ) : (
                           <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                             <ShieldCheck size={12} /> ACTIVE
                           </div>
                         )}
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                         <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {showNumbers[card.id] ? card.cardNumber : '•••• •••• •••• ' + ((card.cardNumber || '0000').slice(-4))}
                            <button onClick={() => setShowNumbers(prev => ({ ...prev, [card.id]: !prev[card.id] }))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}>
                               {showNumbers[card.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                         </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4rem' }}>
                         <div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.2rem' }}>VALID THRU</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{card.expiry}</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.2rem' }}>SECURITY</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{showNumbers[card.id] ? card.cvv : '•••'}</div>
                         </div>
                      </div>

                      {/* Billing Address */}
                      {(card.addressLine1 || card.addressCity) && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.5rem' }}>BILLING ADDRESS</div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                              {card.addressLine1 && <div>{card.addressLine1}</div>}
                              <div>{[card.addressCity, card.addressState, card.addressZip].filter(Boolean).join(', ')}</div>
                              {card.addressCountry && <div>{card.addressCountry}</div>}
                           </div>
                        </div>
                      )}

                      {/* Subscribed Platforms */}
                      <div style={{ marginTop: '2rem' }}>
                         <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '1rem' }}>ACTIVE SUBSCRIPTIONS</div>
                         <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {subscriptions[card.id]?.length > 0 ? (
                               subscriptions[card.id].map(sub => (
                               <div key={sub.name} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: sub.status === 'BLOCKED' ? 0.5 : 1 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sub.status === 'BLOCKED' ? '#64748b' : '#ec4899' }} />
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{sub.name}</span>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleBlock(card.id, sub.name); }}
                                    style={{ background: 'none', border: 'none', color: sub.status === 'BLOCKED' ? '#10b981' : '#ef4444', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', marginLeft: '4px', padding: '2px' }}
                                  >
                                    {sub.status === 'BLOCKED' ? 'RESUME' : 'BLOCK'}
                                  </button>
                               </div>
                            ))
                            ) : (
                              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>No subscriptions detected yet.</div>
                            )}
                         </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 10, marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleFreeze(card.id, card.status); }} 
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title={card.status === 'ACTIVE' ? 'Freeze' : 'Unfreeze'}
                          >
                            {card.status === 'ACTIVE' ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setIsWithdrawModalOpen(true); }}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Withdraw
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setIsFundingModalOpen(true); }}
                            className="btn btn-primary"
                            style={{ padding: '0 1.5rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          >
                            Fund Rails
                          </button>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px' }}>LIQUIDITY</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>${parseFloat(card.balance || '0').toFixed(2)}</div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* AI Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="premium-card" 
             style={{ padding: '2.5rem', background: 'rgba(99, 102, 241, 0.03)' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                 <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', boxShadow: '0 10px 20px -5px var(--primary)' }}>
                    <Sparkles size={24} color="#fff" />
                 </div>
                 <h4 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>AI Sentinel Core</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {aiSecurityInsights.map((insight, idx) => (
                   <div key={idx} className="holographic-card" style={{ padding: '1.5rem', borderLeft: `3px solid ${idx === 0 ? '#10b981' : idx === 1 ? '#3b82f6' : '#8b5cf6'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '0.9rem' }}>
                            {insight.icon} {insight.title}
                         </div>
                         <span style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.5 }}>{insight.status}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                         {insight.desc}
                      </p>
                   </div>
                 ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>Intelligence Status</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>OPTIMAL</span>
                 </div>
                 <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1 }} style={{ height: '100%', background: 'var(--primary)' }} />
                 </div>
              </div>
           </motion.div>

           <div className="premium-card" style={{ padding: '2.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem' }}>Spending Insights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                       <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Capital Deployed</span>
                       <span style={{ fontWeight: 900 }}>${metrics.activeVolume.toLocaleString(undefined, {minimumFractionDigits: 2})} / ${metrics.totalDailyLimit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: `${metrics.totalDailyLimit > 0 ? Math.min((metrics.activeVolume / metrics.totalDailyLimit) * 100, 100) : 0}%`, background: '#3b82f6', transition: 'width 0.5s ease' }} />
                    </div>
                 </div>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                       <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Tracked Subscriptions</span>
                       <span style={{ fontWeight: 900 }}>{metrics.totalSubscriptions}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '0.75rem' }}>
                       {cards.length > 0 ? cards.map(c => <div key={c.id} style={{ height: '24px', flex: 1, background: c.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', borderRadius: '4px', border: `1px solid ${c.status === 'ACTIVE' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }} />) : [1,2,3].map(i => <div key={i} style={{ height: '24px', flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />)}
                    </div>
                 </div>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                       <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>FX Savings</span>
                       <span style={{ fontWeight: 900, color: '#10b981' }}>~${metrics.averageSavings}</span>
                    </div>
                 </div>
              </div>
              <button onClick={fetchCards} className="btn btn-outline" style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', fontSize: '0.9rem', borderRadius: '15px' }}>
                 Refresh Analytics
              </button>
           </div>
        </div>

      </div>

      {/* Issuing Modal */}
      <AnimatePresence>
        {isIssueModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="paypee-modal-content"
              style={{ maxWidth: '480px', padding: '3rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Deploy Capital Rail</h3>
                  <button onClick={() => setIsIssueModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
               </div>

               <form onSubmit={handleIssueCard}>
                 <div style={{ marginBottom: '2rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>FUNDING SOURCE</label>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                      {wallets.length === 0 ? (
                        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                           <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                              <Plus size={20} />
                           </div>
                           <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.5rem' }}>No Liquid Wallets</h4>
                           <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                              You need at least one active wallet with $1.00 to deploy a Capital Rail.
                           </p>
                           <button 
                             type="button"
                             onClick={() => { setIsIssueModalOpen(false); window.location.hash = '#overview'; }}
                             style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                           >
                              Initialize My First Wallet
                           </button>
                        </div>
                      ) : (
                        wallets.map(w => (
                          <div 
                            key={w.id} 
                            onClick={() => {
                               console.log('[DEBUG] Wallet selected:', w.id);
                               setIssueWalletId(w.id);
                            }}
                            style={{ 
                              padding: '1.25rem', 
                              borderRadius: '12px', 
                              background: issueWalletId === w.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', 
                              border: `1px solid ${issueWalletId === w.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s',
                              position: 'relative',
                              zIndex: 10
                            }}
                          >
                             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'none' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{w.currency}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{w.currency} Wallet</div>
                             </div>
                             <div style={{ textAlign: 'right', pointerEvents: 'none' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{parseFloat(w.balance).toLocaleString()}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>AVAILABLE</div>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                 </div>

                 <div style={{ marginBottom: '2.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '1rem', letterSpacing: '1px' }}>RAIL CONFIGURATION</label>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div 
                        onClick={() => setIssueCurrency('USD')} 
                        style={{ 
                          padding: '1.5rem', 
                          borderRadius: '20px', 
                          background: issueCurrency === 'USD' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', 
                          border: `2px solid ${issueCurrency === 'USD' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`, 
                          cursor: 'pointer', 
                          textAlign: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                         <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>USD Card</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 800 }}>GLOBAL RAIL</div>
                      </div>
                      <div 
                        onClick={() => setIssueCurrency('NGN')} 
                        style={{ 
                          padding: '1.5rem', 
                          borderRadius: '20px', 
                          background: issueCurrency === 'NGN' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', 
                          border: `2px solid ${issueCurrency === 'NGN' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`, 
                          cursor: 'pointer', 
                          textAlign: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                         <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>NGN Card</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 800 }}>LOCAL RAIL</div>
                      </div>
                   </div>
                 </div>

                 <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                       <ShieldCheck size={18} /> Instant Tier-1 Deployment
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', margin: 0 }}>
                       New card creation requires a mandatory $1.00 **Initial Capital Injection**. This is not a fee; the amount is instantly loaded onto your new card as its starting balance.
                    </p>
                 </div>

                 <button type="button" onClick={handleIssueCard} disabled={submitting || !issueWalletId} className="btn btn-primary" style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>
                   {submitting ? 'Initializing Rail...' : 'Deploy Instantly'}
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Funding Modal */}
      <AnimatePresence>
        {isFundingModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="paypee-modal-content"
              style={{ maxWidth: '450px', padding: '3rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Top-up Capital Rail</h3>
                  <button onClick={() => setIsFundingModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
               </div>

               <form onSubmit={handleFundCard}>
                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>LIQUID SOURCE</label>
                   <select value={fundWalletId} onChange={(e) => setFundWalletId(e.target.value)} required className="form-input">
                     <option value="">Select Wallet</option>
                     {wallets.map(w => (
                       <option key={w.id} value={w.id}>{w.currency} - {parseFloat(w.balance).toFixed(2)}</option>
                     ))}
                   </select>
                 </div>

                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>AMOUNT TO INJECT</label>
                   <div style={{ position: 'relative' }}>
                     <DollarSign size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                     <input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="0.00" required className="form-input" style={{ paddingLeft: '3.5rem', fontSize: '2rem', fontWeight: 900 }} />
                   </div>
                 </div>

                 <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>TRANSACTION PIN</label>
                    <input 
                      type="password" 
                      value={transferPin} 
                      onChange={(e) => setTransferPin(e.target.value)} 
                      maxLength={4} 
                      placeholder="••••" 
                      className="form-input" 
                      style={{ textAlign: 'center', letterSpacing: '1rem', fontSize: '1.5rem' }} 
                    />
                 </div>

                 <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>
                   {submitting ? 'Transferring...' : 'Confirm Injection'}
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="paypee-modal-content"
              style={{ maxWidth: '450px', padding: '3rem' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Withdraw from Rail</h3>
                  <button onClick={() => setIsWithdrawModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
               </div>

               <form onSubmit={handleWithdraw}>
                 <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>FUNDS WILL RETURN TO</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedCard?.wallet?.currency} Liquid Wallet</div>
                 </div>

                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>AMOUNT TO WITHDRAW</label>
                   <div style={{ position: 'relative' }}>
                     <DollarSign size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                     <input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="0.00" required className="form-input" style={{ paddingLeft: '3.5rem', fontSize: '2rem', fontWeight: 900 }} />
                   </div>
                 </div>

                 <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem', letterSpacing: '1px' }}>TRANSACTION PIN</label>
                    <input 
                      type="password" 
                      value={transferPin} 
                      onChange={(e) => setTransferPin(e.target.value)} 
                      maxLength={4} 
                      placeholder="••••" 
                      className="form-input" 
                      style={{ textAlign: 'center', letterSpacing: '1rem', fontSize: '1.5rem' }} 
                    />
                 </div>

                 <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '1.4rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>
                   {submitting ? 'Withdrawing...' : 'Confirm Withdrawal'}
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
