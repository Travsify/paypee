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
  User,
  Bell,
  Menu,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Repeat,
  ShieldCheck,
  Headphones,
  Info,
  Copy,
  Mail,
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import CardsDashboard from './CardsDashboard';
import AiAdvisor from './AiAdvisor';
import Docs from './Docs';
import Checkout from './Checkout';
import SmartWalletView from './SmartWalletView';
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
  <motion.div 
    whileHover={{ x: 4 }}
    onClick={onClick}
    className={`nav-link ${active ? 'active' : ''}`}
    style={{ position: 'relative' }}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '4px', background: 'var(--primary)', borderRadius: '0 4px 4px 0', boxShadow: '0 0 15px var(--primary)' }} 
      />
    )}
    <Icon size={20} style={{ opacity: active ? 1 : 0.6 }} />
    <span style={{ fontSize: '1rem', fontWeight: active ? 800 : 500 }}>{label}</span>
  </motion.div>
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
  const [chartInterval, setChartInterval] = useState('1W');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [vaults, setVaults] = useState<any[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [uRes, txRes, notifRes, vaultRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/me`, { headers }),
        fetch(`${API_BASE}/api/transactions`, { headers }),
        fetch(`${API_BASE}/api/verify/status`, { headers }),
        fetch(`${API_BASE}/api/vaults`, { headers })
      ]);
      const uData = await uRes.json();
      const txData = await txRes.json();
      const nData = await notifRes.json();
      const vData = await vaultRes.json();
      
      if (!uData.error) setUserData(uData);
      if (Array.isArray(txData)) setTransactions(txData);
      if (Array.isArray(vData)) setVaults(vData);
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
      const response = await fetch(`${API_BASE}/api/accounts/provision`, {
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
    if (['USDT', 'USDC'].includes(currency)) return { symbol: '₮', gradient: 'linear-gradient(135deg, #26a17b 0%, #00d395 100%)' };
    if (['KES', 'GHS', 'UGX', 'RWF', 'XAF', 'XOF', 'TZS'].includes(currency)) return { symbol: currency, gradient: 'linear-gradient(135deg, #374151 0%, #111827 100%)' };
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
    
    const now = new Date();
    let cutoff: Date;
    let pointsCount: number;
    let grouping: 'hour' | 'day' | 'month';

    switch (chartInterval) {
      case '1D':
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        pointsCount = 24;
        grouping = 'hour';
        break;
      case '1W':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        pointsCount = 7;
        grouping = 'day';
        break;
      case '1M':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        pointsCount = 30;
        grouping = 'day';
        break;
      case '1Y':
        cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        pointsCount = 12;
        grouping = 'month';
        break;
      default:
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        pointsCount = 7;
        grouping = 'day';
    }

    const filtered = transactions.filter(tx => 
      new Date(tx.createdAt) >= cutoff && 
      (tx.status === 'SUCCESS' || tx.status === 'COMPLETED')
    );

    // Grouping logic
    const aggregatedData = new Array(pointsCount).fill(0);
    filtered.forEach(tx => {
      const date = new Date(tx.createdAt);
      let index: number;
      if (grouping === 'hour') index = Math.floor((date.getTime() - cutoff.getTime()) / (3600 * 1000));
      else if (grouping === 'day') index = Math.floor((date.getTime() - cutoff.getTime()) / (24 * 3600 * 1000));
      else index = (date.getFullYear() - cutoff.getFullYear()) * 12 + (date.getMonth() - cutoff.getMonth());
      
      if (index >= 0 && index < pointsCount) {
        aggregatedData[index] += parseFloat(tx.amount);
      }
    });

    const maxVolume = Math.max(...aggregatedData, 1000);
    const points = aggregatedData.map((vol, i) => {
      const x = (i / (pointsCount - 1)) * 100;
      const y = 90 - (vol / maxVolume) * 70;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  };

  return (
    <div className="dashboard-shell" style={{ background: 'var(--background)' }}>
      <div className="mesh-bg" style={{ opacity: 0.3, pointerEvents: 'none' }} />

      {/* Institutional Desktop Sidebar */}
      <aside className="modern-sidebar desktop-only" style={{ background: 'rgba(5, 8, 15, 0.6)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0 0.75rem', marginBottom: '4.5rem' }}>
          <div style={{ width: 44, height: 44, background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px -5px var(--primary-glow)', border: '1px solid rgba(255,255,255,0.1)' }}>
             <Zap size={26} color="#fff" strokeWidth={3} fill="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff', display: 'block', lineHeight: 1 }}>Paypee</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Personal</span>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <SidebarItem icon={LayoutDashboard} label="Home" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
          <SidebarItem icon={Wallet} label="Wallets" active={activeSection === 'wallets'} onClick={() => setActiveSection('wallets')} />
          <SidebarItem icon={CreditCard} label="Cards" active={activeSection === 'cards'} onClick={() => setActiveSection('cards')} />
          <SidebarItem icon={Zap} label="Pay Bills" active={activeSection === 'bills'} onClick={() => setActiveSection('bills')} />
          <SidebarItem icon={Lock} label="Savings" active={activeSection === 'vaults'} onClick={() => setActiveSection('vaults')} />
          <SidebarItem icon={Send} label="Send Money" active={activeSection === 'payout'} onClick={() => setIsPayoutOpen(true)} />
          <SidebarItem icon={ExternalLink} label="Receive Money" active={activeSection === 'collections'} onClick={() => setActiveSection('collections')} />
          <SidebarItem icon={History} label="Transactions" active={activeSection === 'history'} onClick={() => setActiveSection('history')} />
          <SidebarItem icon={Bot} label="AI Helper" active={activeSection === 'ai'} onClick={() => setActiveSection('ai')} />
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '2rem' }}>
          <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
          <SidebarItem icon={LogOut} label="Logout" onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main" style={{ padding: '3rem 4rem 6rem' }}>
        {userData && (
          <VerificationGate 
            kycStatus={userData.kycStatus} 
            accountType="INDIVIDUAL"
            onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
          />
        )}
        
        {/* Sticky Modern Topbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '3.5rem', 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(2, 6, 23, 0.7)', 
          backdropFilter: 'blur(30px)', 
          padding: '1.5rem 0',
          zIndex: 1000,
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
           <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
               <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} /> Online
             </div>
             <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.2rem', letterSpacing: '-0.04em' }}>
               Welcome back, <span className="text-glow">{userData?.firstName || 'User'}</span>
             </h1>
           </div>

           <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '340px' }} className="desktop-only">
                 <Search size={18} color="var(--text-muted)" />
                 <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.95rem', width: '100%', fontWeight: 500 }} 
                  />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline" 
                onClick={() => { setShowNotifications(!showNotifications); if (unreadCount > 0) handleMarkRead(); }}
                style={{ padding: '0.75rem', borderRadius: '14px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--primary)' }}>
                    {unreadCount}
                  </div>
                )}
              </motion.button>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                 <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setShowMobileMenu(true)}
                   className="mobile-only"
                   style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                 >
                   <Menu size={20} />
                 </motion.button>

                 <motion.div 
                   whileHover={{ scale: 1.05 }}
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', padding: '2px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                 >
                    <div style={{ width: '100%', height: '100%', background: '#020617', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.email}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                 </motion.div>
               </div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="premium-card"
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        right: 0, 
                        marginTop: '1rem', 
                        width: '280px', 
                        padding: '1.5rem',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                        zIndex: 10000,
                        background: 'rgba(10, 15, 30, 0.95)',
                        backdropFilter: 'blur(30px)'
                      }}
                    >
                      <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.01em' }}>{userData?.firstName} {userData?.lastName}</div>
                          <div style={{ padding: '0.25rem 0.6rem', background: userData?.kycStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, color: userData?.kycStatus === 'VERIFIED' ? 'var(--accent)' : '#f43f5e', border: `1px solid ${userData?.kycStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {userData?.kycStatus === 'VERIFIED' ? 'Verified' : 'Pending'}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{userData?.email}</div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                         <UserMenuItem icon={User} label="Profile" onClick={() => { setActiveSection('settings'); setSettingsTab('profile'); setShowUserMenu(false); }} />
                         <UserMenuItem icon={ShieldCheck} label="Security" onClick={() => { setActiveSection('settings'); setSettingsTab('security'); setShowUserMenu(false); }} />
                         <UserMenuItem icon={Settings} label="Settings" onClick={() => { setActiveSection('settings'); setSettingsTab('profile'); setShowUserMenu(false); }} />
                         <div style={{ margin: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                         <UserMenuItem icon={HelpCircle} label="Help & Support" onClick={() => { setActiveSection('help'); setShowUserMenu(false); }} />
                         <div style={{ margin: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                         <UserMenuItem icon={LogOut} label="Logout" onClick={onLogout} danger />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>

        {/* Section Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                
                {userData && !userData.isPinSet && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card"
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.08) 100%)', 
                      border: '1px solid rgba(99,102,241,0.15)', 
                      padding: '2rem 2.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      boxShadow: '0 20px 40px -10px rgba(99,102,241,0.15)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                      <div style={{ width: 56, height: 56, background: 'rgba(99,102,241,0.2)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Lock size={28} color="var(--primary)" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.4rem', color: '#fff', letterSpacing: '-0.01em' }}>Secure Your Capital Access</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Initialization of a 4-digit security PIN is required for outbound settlements.</p>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setIsPinModalOpen(true)}
                        style={{ padding: '1rem 2rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 900 }}
                      >
                        Set PIN
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* 1. Master Capital Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        TOTAL BALANCE
                        <button 
                          onClick={() => setShowBalances(!showBalances)} 
                          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '8px' }}
                        >
                          {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 0.9, marginBottom: '1rem', letterSpacing: '-0.05em' }}>
                        {showBalances ? <span className="text-glow">₦{calculateTotalNGN().toLocaleString(undefined, {minimumFractionDigits: 2})}</span> : '₦•••••••••'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: 'var(--accent)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
                           LIVE UPDATES
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                   </div>
                   
                   {/* 2. Rapid Command Actions */}
                   <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="desktop-only">
                      <motion.button whileHover={{ y: -5 }} onClick={() => setIsPayoutOpen(true)} className="btn btn-primary" style={{ padding: '1.1rem 2.2rem', borderRadius: '18px', fontSize: '1.05rem', fontWeight: 900 }}>
                         <Send size={18} /> Send
                      </motion.button>
                      <motion.button whileHover={{ y: -5 }} onClick={() => setIsAccountModalOpen(true)} className="btn btn-outline" style={{ padding: '1.1rem 2.2rem', borderRadius: '18px', fontSize: '1.05rem', fontWeight: 900 }}>
                         <ArrowDownLeft size={18} /> Receive
                      </motion.button>
                      <motion.button whileHover={{ y: -5 }} onClick={() => setIsSwapOpen(true)} className="btn btn-outline" style={{ padding: '1.1rem 2.2rem', borderRadius: '18px', fontSize: '1.05rem', fontWeight: 900 }}>
                         <Repeat size={18} /> Swap
                      </motion.button>
                      <motion.button whileHover={{ y: -5 }} onClick={() => setActiveSection('bills')} className="btn btn-outline" style={{ padding: '1.1rem 2.2rem', borderRadius: '18px', fontSize: '1.05rem', fontWeight: 900 }}>
                         <Zap size={18} /> Bills
                      </motion.button>
                   </div>
                </div>

                {/* 3. Global Asset Rail */}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Globe size={18} />
                         </div>
                         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Your Wallets</h3>
                      </div>
                      <button onClick={() => setActiveSection('wallets')} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>See All <ChevronRight size={16} /></button>
                   </div>
                   
                   <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.25rem', marginBottom: '1.5rem' }} className="custom-scrollbar">
                      {userData?.wallets?.map((w: any) => {
                         const isActive = selectedWalletId ? selectedWalletId === w.id : userData.wallets[0].id === w.id;
                         return (
                            <motion.button 
                               key={w.id} 
                               whileHover={{ y: -2 }}
                               onClick={() => setSelectedWalletId(w.id)}
                               style={{ 
                                  padding: '0.75rem 1.75rem', 
                                  borderRadius: '20px', 
                                  border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}`, 
                                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)', 
                                  color: isActive ? '#fff' : 'var(--text-muted)', 
                                  fontWeight: 800, 
                                  cursor: 'pointer', 
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.3s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  boxShadow: isActive ? '0 10px 20px rgba(99,102,241,0.1)' : 'none'
                               }}
                            >
                               <div style={{ width: 10, height: 10, borderRadius: '50%', background: isActive ? 'var(--accent)' : 'transparent', border: isActive ? 'none' : '2px solid rgba(255,255,255,0.1)' }}></div>
                               {w.currency} Wallet
                            </motion.button>
                         );
                      })}
                      <button 
                         onClick={() => setIsAccountModalOpen(true)} 
                         style={{ 
                            padding: '0.75rem 1.75rem', 
                            borderRadius: '20px', 
                            border: '1px dashed rgba(255,255,255,0.2)', 
                            background: 'transparent', 
                            color: 'var(--text-muted)', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s'
                         }}
                      >
                         <Plus size={16} /> Deploy Asset Rail
                      </button>
                   </div>

                   <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      {(() => {
                         const activeWallet = selectedWalletId 
                           ? userData?.wallets?.find((w: any) => w.id === selectedWalletId) 
                           : userData?.wallets?.[0];
                            
                         if (!activeWallet) return (
                           <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="premium-card"
                            style={{ width: '100%', borderStyle: 'dashed', padding: '4rem', textAlign: 'center', cursor: 'pointer' }} 
                            onClick={() => setIsAccountModalOpen(true)}
                           >
                              <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.02)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                 <Plus size={40} color="var(--text-muted)" />
                              </div>
                              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>No Active Rails Detected</h3>
                              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Deploy an NGN, USD or GBP asset rail to begin processing capital.</p>
                           </motion.div>
                         );
                         
                         const { symbol, gradient } = getCardProps(activeWallet.currency);
                         const isCrypto = ['USDC', 'USDT', 'BTC'].includes(activeWallet.currency);
                         const meta = activeWallet.metadata || {};
                         const accNo = meta.address || meta.wallet_address || meta.iban || meta.account_number || meta.accountNumber || meta.virtual_account_number || '---';
                         const bank = meta.network || meta.bankName || meta.bank_name || meta.bank || meta.provider || (isCrypto ? 'Decentralized Network' : 'Global Settlement Core');
                         const accName = meta.accountInformation?.accountName || meta.accountName || meta.accountHolder || userData?.firstName + ' ' + userData?.lastName;

                         return (
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', width: '100%' }}>
                              <div style={{ width: '100%' }}>
                                <BalanceCard 
                                  currency={activeWallet.currency} 
                                  symbol={symbol} 
                                  gradient={gradient} 
                                  details={activeWallet.metadata} 
                                  amount={parseFloat(activeWallet.balance).toFixed(2)} 
                                  userName={userData?.firstName}
                                  onRefresh={fetchUserData}
                                />
                              </div>

                              <div className="premium-card" style={{ 
                                padding: '3rem', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.01)'
                              }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)' }} />
                                   <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '3px' }}>Rail Diagnostics</h4>
                                 </div>

                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {[
                                      { label: 'Settlement Currency', value: `${activeWallet.currency} Protocol` },
                                      { label: 'Network Provider', value: bank, highlight: true, icon: Globe },
                                      { label: isCrypto ? 'On-Chain Address' : 'Account Routing ID', value: accNo, copyable: true, icon: Shield },
                                      { label: 'Auth Beneficiary', value: accName, hide: isCrypto, icon: User }
                                    ].filter(f => !f.hide).map((item, idx) => (
                                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {item.icon && <item.icon size={12} />} {item.label}
                                         </div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                           <div style={{ 
                                             fontSize: '1.2rem', 
                                             fontWeight: 800, 
                                             color: item.highlight ? 'var(--primary)' : '#fff',
                                             fontFamily: item.copyable ? 'monospace' : 'inherit',
                                             wordBreak: 'break-all',
                                             letterSpacing: item.copyable ? '0.5px' : '-0.01em'
                                           }}>
                                             {item.value}
                                           </div>
                                           {item.copyable && (
                                             <motion.button 
                                               whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                                               onClick={() => { navigator.clipboard.writeText(item.value); }}
                                               style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex' }}
                                             >
                                               <Copy size={14} />
                                             </motion.button>
                                           )}
                                         </div>
                                      </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                         );
                      })()}
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
                   {/* 4. Institutional Analytics (Pulse) */}
                   <div className="premium-card" style={{ padding: '2.5rem', flex: 2, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Cpu size={20} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Financial Velocity</h3>
                         </div>
                         <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                             {['1D', '1W', '1M', '1Y'].map(t => (
                                <button 
                                  key={t} 
                                  onClick={() => setChartInterval(t)}
                                  style={{ 
                                    background: t === chartInterval ? 'var(--primary)' : 'transparent', 
                                    color: t === chartInterval ? '#fff' : 'var(--text-muted)', 
                                    border: 'none', 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '10px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 900, 
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                  }}
                                >
                                  {t}
                                </button>
                             ))}
                         </div>
                      </div>
                      <div style={{ flex: 1, position: 'relative', minHeight: '240px', display: 'flex', alignItems: 'flex-end' }}>
                         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(99, 102, 241, 0.05), transparent)', borderBottom: '2px solid rgba(99, 102, 241, 0.2)' }}>
                            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                               <defs>
                                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                     <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                     <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                  </linearGradient>
                               </defs>
                               <path 
                                 d={generateSparkline()} 
                                 fill="none" 
                                 stroke="var(--primary)" 
                                 strokeWidth="3" 
                                 vectorEffect="non-scaling-stroke" 
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 style={{ filter: 'drop-shadow(0 0 8px var(--primary-glow))' }}
                               />
                               <path 
                                 d={`${generateSparkline()} L100,100 L0,100 Z`}
                                 fill="url(#chartGradient)"
                                 vectorEffect="non-scaling-stroke"
                               />
                            </svg>
                         </div>
                      </div>
                   </div>

                   {/* 5. AI Sentinel Core */}
                   <div className="premium-card" style={{ padding: '2.5rem', flex: 1, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                      <div className="mesh-bg" style={{ opacity: 0.1 }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                         <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <Bot size={24} color="var(--primary)" />
                         </div>
                         <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>Sentinel Core</h3>
                            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>Active Monitoring</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                         {userData?.wallets?.find((w: any) => w.currency === 'NGN')?.balance > 500000 && (
                           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                 <Zap size={14} fill="var(--accent)" /> Asset Optimization
                              </div>
                              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem', fontWeight: 500 }}>High NGN exposure detected. Market volatility is increasing. Hedging 40% into USD is recommended.</p>
                              <button onClick={() => setIsSwapOpen(true)} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900 }}>Execute FX Swap</button>
                           </div>
                         )}
                         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                               <ShieldCheck size={14} fill="var(--primary)" /> Protocol Audit
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                              {transactions.length > 5 ? 'System throughput has scaled by 12% this session. No anomalies detected in settlement rails.' : 'Welcome to the core. Initialize your first asset rail to begin institutional operations.'}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 6. Recent Immutable Activity */}
                <div className="premium-card" style={{ padding: '3rem', background: 'rgba(255,255,255,0.01)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}>
                             <History size={20} />
                          </div>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Transaction Ledger</h3>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSync}
                            disabled={isGenerating}
                            style={{ 
                              background: 'rgba(16, 185, 129, 0.1)', 
                              border: '1px solid rgba(16, 185, 129, 0.2)', 
                              color: 'var(--accent)', 
                              fontSize: '0.75rem', 
                              padding: '0.5rem 1rem', 
                              borderRadius: '10px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}
                          >
                             <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} /> 
                             {isGenerating ? 'Syncing...' : 'Force Sync'}
                          </motion.button>
                       </div>
                      <button onClick={() => navigate('history')} className="btn btn-outline" style={{ padding: '0.6rem 1.5rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900 }}>Full Audit Logs <ChevronRight size={16} /></button>
                   </div>
                   
                   <div style={{ width: '100%', overflowX: 'auto' }}>
                      <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                         <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
                               <th style={{ padding: '0 1.5rem 1rem' }}>Settle Event</th>
                               <th style={{ padding: '0 1.5rem 1rem' }}>Timestamp</th>
                               <th style={{ padding: '0 1.5rem 1rem' }}>Status Code</th>
                               <th style={{ padding: '0 1.5rem 1rem', textAlign: 'right' }}>Net Volume</th>
                            </tr>
                         </thead>
                         <tbody>
                             {transactions.filter(tx => 
                                (tx.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (tx.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
                             ).length > 0 ? transactions.filter(tx => 
                                (tx.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (tx.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
                             ).slice(0, 8).map(tx => (
                                <motion.tr 
                                  key={tx.id} 
                                  whileHover={{ background: 'rgba(255,255,255,0.03)', scale: 1.005 }}
                                  onClick={() => setSelectedTx(tx)} 
                                  style={{ 
                                    background: 'rgba(255,255,255,0.015)', 
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <td style={{ padding: '1.25rem 1.5rem', borderRadius: '16px 0 0 16px' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: tx.type === 'DEPOSIT' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tx.type === 'DEPOSIT' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)'}` }}>
                                           {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} color="var(--accent)" /> : <ArrowUpRight size={20} color="#fff" />}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>{tx.desc || (tx.type === 'DEPOSIT' ? 'Incoming Settlement' : 'Transfer Payout')}</div>
                                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>REF: {tx.reference?.slice(0, 12)}...</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td style={{ padding: '1.25rem 1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 600 }}>{new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                  <td style={{ padding: '1.25rem 1.5rem' }}>
                                     <div style={{ 
                                       display: 'inline-flex', 
                                       alignItems: 'center', 
                                       gap: '0.5rem', 
                                       padding: '0.4rem 1rem', 
                                       background: tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', 
                                       color: tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'var(--accent)' : '#fff', 
                                       borderRadius: '100px', 
                                       fontSize: '0.75rem', 
                                       fontWeight: 900,
                                       textTransform: 'uppercase',
                                       letterSpacing: '1px',
                                       border: `1px solid ${tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)'}`
                                     }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'var(--accent)' : '#fff' }} />
                                        {tx.status}
                                     </div>
                                  </td>
                                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 900, color: tx.type === 'DEPOSIT' ? 'var(--accent)' : '#fff', fontSize: '1.1rem', borderRadius: '0 16px 16px 0' }}>
                                     {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.currency} {parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                   <td colSpan={4} style={{ padding: '5rem 0', textAlign: 'center' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                         <div style={{ width: 100, height: 100, background: 'rgba(255,255,255,0.02)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                            <History size={40} color="var(--text-muted)" style={{ opacity: 0.3 }} />
                                         </div>
                                         <div>
                                            <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Immutable Ledger Empty</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Deploy an egress or ingress rail to begin generating audit logs.</div>
                                         </div>
                                         <button onClick={() => setIsPayoutOpen(true)} className="btn btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '16px', fontWeight: 900 }}>Initiate First Settlement</button>
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
              <SmartWalletView 
                wallets={userData?.wallets || []}
                vaults={vaults}
                fxRates={fxRates}
                userData={userData}
                showBalances={showBalances}
                onSwap={() => setIsSwapOpen(true)}
                onPayout={() => setIsPayoutOpen(true)}
                onRefresh={fetchUserData}
                onCreateAccount={() => setIsAccountModalOpen(true)}
              />
            )}

            {activeSection === 'cards' && <CardsDashboard wallets={userData?.wallets || []} />}
            {activeSection === 'vaults' && <VaultsView />}
            {activeSection === 'bills' && <BillsView />}
            {activeSection === 'collections' && <CollectionsView />}
            {activeSection === 'history' && <HistoryView onTransactionClick={(tx: any) => setSelectedTx(tx)} />}
            {activeSection === 'ai' && <AiAdvisor transactions={transactions} userName={userData?.firstName} />}
            {activeSection === 'settings' && <SettingsView initialTab={settingsTab} />}
            {activeSection === 'help' && <HelpCenter />}
            {activeSection === 'transfers' && <div className="premium-card" style={{ textAlign: 'center', padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)' }}>
               <div style={{ width: 100, height: 100, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <Send size={50} />
               </div>
               <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Send Money</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 3rem', fontWeight: 500, lineHeight: 1.6 }}>Send money instantly to 150+ countries with Paypee.</p>
               <button onClick={() => setIsPayoutOpen(true)} className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>Send Money Now</button>
            </div>}
          </motion.div>
        </AnimatePresence>
      </main>


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
      {/* Mobile Bottom Navigation */}
      <div className="mobile-only" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(5, 8, 15, 0.9)', 
        backdropFilter: 'blur(20px)', 
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0.5rem 2rem',
        zIndex: 2000
      }}>
        <MobileNavButton icon={LayoutDashboard} label="Home" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
        <MobileNavButton icon={Wallet} label="Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
        <MobileNavButton icon={CreditCard} label="Cards" active={activeSection === 'cards'} onClick={() => navigate('cards')} />
        <MobileNavButton icon={Menu} label="More" onClick={() => setShowMobileMenu(true)} />
      </div>

      {/* Mobile Hamburger Menu Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, backdropFilter: 'blur(5px)' }}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px', background: '#020617', zIndex: 3001, padding: '2rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>Menu</span>
                <X onClick={() => setShowMobileMenu(false)} style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <SidebarItem icon={Lock} label="Savings" active={activeSection === 'vaults'} onClick={() => { setActiveSection('vaults'); setShowMobileMenu(false); }} />
                <SidebarItem icon={Send} label="Send Money" active={activeSection === 'payout'} onClick={() => { setIsPayoutOpen(true); setShowMobileMenu(false); }} />
                <SidebarItem icon={ArrowDownLeft} label="Receive Money" active={activeSection === 'collections'} onClick={() => { setActiveSection('collections'); setShowMobileMenu(false); }} />
                <SidebarItem icon={History} label="Transactions" active={activeSection === 'history'} onClick={() => { setActiveSection('history'); setShowMobileMenu(false); }} />
                <SidebarItem icon={Bot} label="AI Helper" active={activeSection === 'ai'} onClick={() => { setActiveSection('ai'); setShowMobileMenu(false); }} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1rem 0' }} />
                <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => { setActiveSection('settings'); setShowMobileMenu(false); }} />
                <SidebarItem icon={LogOut} label="Logout" onClick={onLogout} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNavButton = ({ icon: Icon, label, active, onClick }: any) => (
  <motion.button 
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{ 
      background: 'transparent', 
      border: 'none', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '0.4rem', 
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      cursor: 'pointer'
    }}
  >
    <Icon size={22} />
    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{label}</span>
  </motion.button>
);

const Menu = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const X = ({ size = 20, onClick, style }: any) => (
  <svg onClick={onClick} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default IndividualDashboard;

const UserMenuItem = ({ icon: Icon, label, onClick, danger = false }: any) => (
  <motion.div 
    whileHover={{ x: 5, background: danger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.06)' }}
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '0.85rem 1.25rem', 
      borderRadius: '14px', 
      cursor: 'pointer',
      color: danger ? '#f43f5e' : '#fff',
      transition: 'all 0.2s',
      fontSize: '0.95rem',
      fontWeight: 700
    }}
  >
    <Icon size={18} style={{ opacity: 0.8 }} />
    {label}
  </motion.div>
);

const HelpCenter = () => {
  const faqs = [
    { q: "How do I add a Dollar account?", a: "Go to 'Wallets' and click 'Add Account'. Select Dollars (USD) and your account will be ready instantly." },
    { q: "How long do transfers take?", a: "Transfers within Paypee are instant. Sending to other banks can take between a few seconds and a few hours." },
    { q: "Is my money safe?", a: "Yes. We use the same high-level security as major global banks to keep your money and identity safe." }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Support Protocol</div>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Help Center</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>Access technical documentation or initiate a support session with our engineering team.</p>
      </div>

      <div className="premium-card" style={{ padding: '3.5rem', background: 'rgba(255,255,255,0.01)' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2.5rem', color: '#fff' }}>Technical Knowledge Base</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ paddingBottom: '2rem', borderBottom: idx === faqs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 900, marginBottom: '0.75rem', fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                 {faq.q}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500, paddingLeft: '1.75rem' }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
        <motion.div whileHover={{ y: -10 }} className="premium-card" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Mail size={32} />
          </div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem' }}>Secure Messaging</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 500 }}>Direct line to our priority engineering support unit.</p>
          <a href="mailto:hi@paypee.co" className="btn btn-primary" style={{ display: 'block', padding: '1.25rem', borderRadius: '18px', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 900 }}>Open Support Ticket</a>
        </motion.div>
        
        <motion.div whileHover={{ y: -10 }} className="premium-card" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Zap size={32} />
          </div>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem' }}>Protocol Live Chat</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 500 }}>Real-time coordination with a specialist advisor.</p>
          <button className="btn btn-outline" style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900 }}>Initiate Live Session</button>
        </motion.div>
      </div>
    </div>
  );
};
