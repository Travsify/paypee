import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Send, 
  History, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Zap, 
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Lock,
  ExternalLink,
  Bot,
  Bell,
  Menu,
  X,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import CardsDashboard from './CardsDashboard';
import AiAdvisor from './AiAdvisor';
import SettingsView from './SettingsView';
import PayoutModal from './PayoutModal';
import VerificationGate from './VerificationGate';
import BalanceCard from './components/BalanceCard';
import TransactionReceiptModal from './components/TransactionReceiptModal';
import NotificationPanel from './components/NotificationPanel';
import PinSetupModal from './components/PinSetupModal';
import SwapModal from './SwapModal';
import WalletRailItem from './components/WalletRailItem';
import AccountCreationModal from './AccountCreationModal';
import VaultsView from './components/VaultsView';
import BillsView from './components/BillsView';
import CollectionsView from './components/CollectionsView';
import HistoryView from './components/HistoryView';
import { API_BASE } from './config';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`nav-link ${active ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span style={{ fontSize: '0.95rem' }}>{label}</span>
  </div>
);

const IndividualDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fxRates, setFxRates] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [uRes, txRes, notifRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/me`, { headers }),
        fetch(`${API_BASE}/api/transactions`, { headers }),
        fetch(`${API_BASE}/api/verify/status`, { headers })
      ]);
      const uData = await uRes.json();
      const txData = await txRes.json();
      const nData = await notifRes.json();
      
      if (!uData.error) setUserData(uData);
      if (Array.isArray(txData)) setTransactions(txData);
      if (nData.notifications) {
        setNotifications(nData.notifications);
        setUnreadCount(nData.notifications.filter((n: any) => !n.read).length);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const token = localStorage.getItem('paypee_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const pairs = ['USD', 'GBP', 'EUR'];
        const rates: any = {};
        
        await Promise.all(pairs.map(async (p) => {
          const res = await fetch(`${API_BASE}/api/fx/rates?source=${p}&target=NGN`, { headers });
          const data = await res.json();
          if (data.rate) rates[`${p}_NGN`] = data.rate;
        }));
        
        setFxRates((prev: any) => ({ ...prev, ...rates }));
      } catch (err) {}
    };

    fetchUserData();
    fetchRates();
    
    // Auto-reconcile on mount to pick up any missed webhooks
    const reconcile = async () => {
      const token = localStorage.getItem('paypee_token');
      if (token) {
        try {
          await fetch(`${API_BASE}/api/accounts/reconcile`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          fetchUserData(); // Refresh after reconciliation
        } catch (err) {
          console.warn('Reconciliation silent fail:', err);
        }
      }
    };
    reconcile();

    const interval = setInterval(() => {
      fetchUserData();
      fetchRates();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    const token = localStorage.getItem('paypee_token');
    await fetch(`${API_BASE}/api/notifications/read`, { 
      method: 'POST', 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    setNotifications((prev: any[]) => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleCreateAccount = async (currency: string, bvn?: string, kycData?: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({ currency, bvn, ...kycData })
      });
      if (response.ok) {
        setIsAccountModalOpen(false);
        fetchUserData();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to create account.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSync = async () => {
    setIsGenerating(true);
    try {
      // Hit the reconciliation and fix-swaps endpoints
      await Promise.all([
        fetch(`${API_BASE}/api/accounts/reconcile`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('paypee_token')}` }
        }),
        fetch(`${API_BASE}/api/admin/fix-swaps`)
      ]);
      await fetchUserData();
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const navigate = (section: string) => setActiveSection(section);

  const getCardProps = (currency: string) => {
    if (currency === 'USD') return { symbol: '$', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' };
    if (currency === 'EUR') return { symbol: '€', gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)' };
    if (currency === 'GBP') return { symbol: '£', gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)' };
    if (currency === 'BTC') return { symbol: '₿', gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' };
    return { symbol: '₦', gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)' };
  };

  const calculateTotalNGN = () => {
    if (!userData?.wallets) return 0;
    return userData.wallets.reduce((acc: number, w: any) => {
      const balance = parseFloat(w.balance);
      if (w.currency === 'NGN') return acc + balance;
      const rate = fxRates[`${w.currency}_NGN`];
      if (rate) return acc + (balance * rate);
      return acc + balance; 
    }, 0);
  };

  const generateSparkline = () => {
    if (!transactions || transactions.length === 0) return "M0,100 L100,100";
    const data = [...transactions].filter(tx => tx.status === 'SUCCESS' || tx.status === 'COMPLETED').slice(0, 10).reverse();
    if (data.length < 2) return "M0,50 L100,50";
    const points = data.map((tx, i) => {
      const amount = parseFloat(tx.amount);
      const normalized = Math.min(amount / 10000, 70); 
      return `${(i / (data.length - 1)) * 100},${90 - normalized}`;
    });
    return `M${points.join(' L')}`;
  };

  return (
    <div className="dashboard-shell">
      {userData && (
        <VerificationGate 
          kycStatus={userData.kycStatus} 
          accountType="INDIVIDUAL"
          onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
        />
      )}

      {/* Modern Desktop Sidebar */}
      <aside className="modern-sidebar desktop-only">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem', marginBottom: '3.5rem' }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px -5px var(--primary-glow)' }}>
             <Zap size={24} color="#fff" strokeWidth={3} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Paypee</span>
        </div>
        
        <div style={{ flex: 1 }}>
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
          <SidebarItem icon={Wallet} label="Smart Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
          <SidebarItem icon={CreditCard} label="Virtual Cards" active={activeSection === 'cards'} onClick={() => navigate('cards')} />
          <SidebarItem icon={History} label="History" active={activeSection === 'history'} onClick={() => navigate('history')} />
          <SidebarItem icon={Send} label="Transfers" active={activeSection === 'transfers'} onClick={() => navigate('transfers')} />
          <SidebarItem icon={Lock} label="Vaults" active={activeSection === 'vaults'} onClick={() => navigate('vaults')} />
          <SidebarItem icon={Zap} label="Bills & Utilities" active={activeSection === 'bills'} onClick={() => navigate('bills')} />
          <SidebarItem icon={ExternalLink} label="Collections" active={activeSection === 'collections'} onClick={() => navigate('collections')} />
          <SidebarItem icon={Bot} label="AI Advisor" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
          <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Sticky Modern Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem', 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(5, 8, 15, 0.8)', 
          backdropFilter: 'blur(12px)', 
          padding: '1.5rem 0',
          zIndex: 100,
          borderBottom: '1px solid rgba(255,255,255,0.02)'
        }}>
           <div>
             <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.1rem' }}>
               Welcome back, <span className="text-gradient">{userData?.firstName || 'User'}</span>
             </h1>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monitor your global capital and settlements in real-time.</p>
           </div>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '300px' }} className="desktop-only">
                 <Search size={16} color="var(--text-muted)" />
                 <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', width: '100%' }} 
                  />
              </div>
              <button 
                className="btn btn-outline" 
                onClick={() => { setShowNotifications(!showNotifications); if (unreadCount > 0) handleMarkRead(); }}
                style={{ padding: '0.6rem', borderRadius: '12px', position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f43f5e', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </div>
                )}
              </button>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '2px', cursor: 'pointer' }}>
                 <div style={{ width: '100%', height: '100%', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.email}`} alt="Avatar" />
                 </div>
              </div>
           </div>
        </div>

        {/* Section Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {userData && !userData.isPinSet && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', 
                      border: '1px solid rgba(99,102,241,0.2)', 
                      borderRadius: '24px', 
                      padding: '1.5rem 2rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      boxShadow: '0 10px 30px -10px rgba(99,102,241,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={24} color="#6366f1" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Enhance Your Security</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't set a transaction PIN. Set one now to protect your funds.</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setIsPinModalOpen(true)}
                      style={{ padding: '0.75rem 1.5rem', borderRadius: '14px' }}
                    >
                      Set Security PIN
                    </button>
                  </motion.div>
                )}
                
                {/* 1. Master Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
                   <div>
                      <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        Total Liquid Capital
                        <button 
                          onClick={() => setShowBalances(!showBalances)} 
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                        >
                          {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
                        {showBalances ? `₦${calculateTotalNGN().toLocaleString(undefined, {minimumFractionDigits: 2})}` : '₦••••••'}
                      </div>
                      <div style={{ color: '#22d3ee', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' }}></div>
                         Live tracking active
                      </div>
                   </div>
                   
                   {/* 2. Quick Actions */}
                   <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="desktop-only">
                      <button onClick={() => setIsPayoutOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)' }}>
                         <Send size={16} /> Transfer
                      </button>
                      <button onClick={() => setIsAccountModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                         <ArrowDownLeft size={16} /> Receive
                      </button>
                      <button onClick={() => setIsSwapOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                         <Repeat size={16} /> Swap
                      </button>
                      <button onClick={() => navigate('bills')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                         <Zap size={16} /> Pay Bills
                      </button>
                   </div>
                </div>

                {/* 3. Global Wallets */}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Global Wallets</h3>
                      <button onClick={() => navigate('wallets')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>View All <ChevronRight size={14} /></button>
                   </div>
                   <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                      {userData?.wallets?.map((w: any) => {
                         const { symbol, gradient } = getCardProps(w.currency);
                         return (
                           <BalanceCard 
                             key={w.id} 
                             currency={w.currency} 
                             symbol={symbol} 
                             gradient={gradient} 
                             details={w.metadata} 
                             amount={parseFloat(w.balance).toFixed(2)} 
                             userName={userData?.firstName}
                           />
                         );
                      })}
                      {!userData?.wallets?.length && (
                         <div style={{ minWidth: '280px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setIsAccountModalOpen(true)}>
                            <Plus size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ color: '#94a3b8', fontWeight: 600 }}>Create Wallet</div>
                         </div>
                      )}
                      <div style={{ minWidth: '280px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} onClick={() => setIsAccountModalOpen(true)}>
                         <Plus size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                         <div style={{ color: '#94a3b8', fontWeight: 600 }}>Create New Wallet</div>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                   {/* 4. Financial Pulse (Chart) */}
                   <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', flex: 2, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                         <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Financial Pulse</h3>
                         <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '0.25rem', borderRadius: '8px' }}>
                            {['1D', '1W', '1M', '1Y'].map(t => (
                               <button key={t} style={{ background: t === '1W' ? '#6366f1' : 'transparent', color: t === '1W' ? '#fff' : '#94a3b8', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
                            ))}
                         </div>
                      </div>
                      <div style={{ flex: 1, position: 'relative', minHeight: '200px', display: 'flex', alignItems: 'flex-end' }}>
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(34, 211, 238, 0.1), transparent)', borderBottom: '2px solid #22d3ee' }}>
                            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                               <path 
                                 d={generateSparkline()} 
                                 fill="none" 
                                 stroke="#22d3ee" 
                                 strokeWidth="2" 
                                 vectorEffect="non-scaling-stroke" 
                               />
                            </svg>
                         </div>
                      </div>
                   </div>

                   {/* 5. AI Copilot */}
                   <div style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(167, 139, 250, 0.1)', borderRadius: '24px', padding: '2rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                         <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(167, 139, 250, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={20} color="#a78bfa" />
                         </div>
                         <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Copilot Insights</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         {userData?.wallets?.find((w: any) => w.currency === 'NGN')?.balance > 1000000 && (
                           <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', borderLeft: '3px solid #22d3ee' }}>
                              <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>You are holding ₦{(userData.wallets.find((w: any) => w.currency === 'NGN').balance / 1000000).toFixed(1)}M while NGN is volatile. Protect your capital in USD?</p>
                              <button onClick={() => setIsSwapOpen(true)} style={{ padding: '0.6rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Convert to USD</button>
                           </div>
                         )}
                         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', borderLeft: '3px solid #a78bfa' }}>
                            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5 }}>
                              {transactions.length > 5 ? 'Your transaction velocity has increased by 12% this week.' : 'Welcome! Start by funding your NGN wallet to begin global trading.'}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 6. Recent Activity */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Activity</h3>
                          <button 
                            onClick={handleSync}
                            disabled={isGenerating}
                            style={{ 
                              background: 'rgba(34, 211, 238, 0.1)', 
                              border: 'none', 
                              color: '#22d3ee', 
                              fontSize: '0.75rem', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '8px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontWeight: 700,
                              opacity: isGenerating ? 0.6 : 1
                            }}
                          >
                             <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} /> 
                             {isGenerating ? 'Syncing...' : 'Sync Data'}
                          </button>
                       </div>
                      <button onClick={() => navigate('history')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>View All <ChevronRight size={14} /></button>
                   </div>
                   
                   <div style={{ width: '100%', overflowX: 'auto' }}>
                      <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                         <thead>
                            <tr style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                               <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>Transaction</th>
                               <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>Date/Time</th>
                               <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>Status</th>
                               <th style={{ paddingBottom: '1rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                            </tr>
                         </thead>
                         <tbody>
                             {transactions.filter(tx => 
                                (tx.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (tx.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
                             ).length > 0 ? transactions.filter(tx => 
                                (tx.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (tx.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
                             ).slice(0, 5).map(tx => (
                                <tr key={tx.id} onClick={() => setSelectedTx(tx)} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                                  <td style={{ padding: '1rem 0' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: tx.type === 'DEPOSIT' ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                           {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={16} color="#22d3ee" /> : <ArrowUpRight size={16} color="#fff" />}
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{tx.desc || (tx.type === 'DEPOSIT' ? 'Incoming Settlement' : 'Transfer Payout')}</div>
                                     </div>
                                  </td>
                                  <td style={{ padding: '1rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                  <td style={{ padding: '1rem 0' }}>
                                     <span style={{ padding: '0.25rem 0.5rem', background: tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.1)', color: tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? '#22d3ee' : '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {tx.status}
                                     </span>
                                  </td>
                                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 800, color: tx.type === 'DEPOSIT' ? '#22d3ee' : '#fff' }}>
                                     {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.currency} {parseFloat(tx.amount).toFixed(2)}
                                  </td>
                                </tr>
                            )) : (
                               <tr>
                                  <td colSpan={4} style={{ padding: '3rem 0', textAlign: 'center' }}>
                                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                           <History size={24} color="#94a3b8" />
                                        </div>
                                        <div>
                                           <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>No Recent Activity</div>
                                           <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Your latest transactions will appear here.</div>
                                        </div>
                                        <button onClick={() => setIsPayoutOpen(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>Make a Transfer</button>
                                     </div>
                                  </td>
                                </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>

              </div>
            )}

            {activeSection === 'wallets' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {userData?.wallets?.map((w: any) => {
                   const { symbol, gradient } = getCardProps(w.currency);
                   return (
                     <BalanceCard 
                       key={w.id} 
                       currency={w.currency} 
                       symbol={symbol} 
                       gradient={gradient} 
                       details={w.metadata} 
                       amount={parseFloat(w.balance).toFixed(2)} 
                       userName={userData?.firstName}
                       onSwap={() => setIsSwapOpen(true)}
                       onPayout={() => setIsPayoutOpen(true)}
                       onRefresh={fetchUserData}
                       hideBalance={!showBalances}
                     />
                   );
                })}
              </div>
            )}

            {activeSection === 'cards' && <CardsDashboard />}
            {activeSection === 'vaults' && <VaultsView />}
            {activeSection === 'bills' && <BillsView />}
            {activeSection === 'collections' && <CollectionsView />}
            {activeSection === 'history' && <HistoryView onTransactionClick={(tx: any) => setSelectedTx(tx)} />}
            {activeSection === 'ai' && <AiAdvisor transactions={transactions} userName={userData?.firstName} />}
            {activeSection === 'settings' && <SettingsView />}
            {activeSection === 'transfers' && <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
               <Send size={50} color="var(--primary)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
               <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Global Transfers</h3>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Send money instantly to bank accounts and wallets globally.</p>
               <button onClick={() => setIsPayoutOpen(true)} className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Initiate New Transfer</button>
            </div>}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Floating Mobile Navigation */}
      <nav className="floating-nav mobile-only">
         <div onClick={() => navigate('overview')} className={`mobile-nav-btn ${activeSection === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>Home</span>
         </div>
         <div onClick={() => navigate('wallets')} className={`mobile-nav-btn ${activeSection === 'wallets' ? 'active' : ''}`}>
            <Wallet size={24} />
            <span>Wallets</span>
         </div>
         <div onClick={() => setIsPayoutOpen(true)} style={{ background: 'var(--primary)', color: '#fff', width: 56, height: 56, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-30px', boxShadow: '0 10px 25px var(--primary-glow)' }}>
            <Send size={24} />
         </div>
         <div onClick={() => navigate('cards')} className={`mobile-nav-btn ${activeSection === 'cards' ? 'active' : ''}`}>
            <CreditCard size={24} />
            <span>Cards</span>
         </div>
         <div onClick={() => navigate('ai')} className={`mobile-nav-btn ${activeSection === 'ai' ? 'active' : ''}`}>
            <Bot size={24} />
            <span>AI</span>
         </div>
      </nav>

      {/* Global Modals */}
      <PayoutModal isOpen={isPayoutOpen} onClose={() => setIsPayoutOpen(false)} onComplete={fetchUserData} wallets={userData?.wallets || []} />
      <SwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} wallets={userData?.wallets || []} onComplete={fetchUserData} />
      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={handleCreateAccount} 
        isProcessing={isGenerating} 
        existingCurrencies={userData?.wallets?.map((w: any) => w.currency) || []} 
      />
      <TransactionReceiptModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      <NotificationPanel notifications={notifications} show={showNotifications} onClose={() => setShowNotifications(false)} />
      <PinSetupModal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} onSuccess={fetchUserData} />
    </div>
  );
};

export default IndividualDashboard;
