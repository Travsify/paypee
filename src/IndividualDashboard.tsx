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
  Repeat
} from 'lucide-react';
import CardsDashboard from './CardsDashboard';
import AiAdvisor from './AiAdvisor';
import SettingsView from './SettingsView';
import PayoutModal from './PayoutModal';
import VerificationGate from './VerificationGate';
import SwapModal from './SwapModal';
import WalletRailItem from './components/WalletRailItem';
import AccountCreationModal from './AccountCreationModal';
import VaultsView from './components/VaultsView';
import BillsView from './components/BillsView';
import CollectionsView from './components/CollectionsView';
import HistoryView from './components/HistoryView';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`nav-link ${active ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span style={{ fontSize: '0.95rem' }}>{label}</span>
  </div>
);

const BalanceCard = ({ currency, amount, onSwap, onPayout, accountDetails }: { currency: string, amount: string, onSwap: () => void, onPayout: () => void, accountDetails?: any }) => {
  const getGradient = (cur: string) => {
    const map: Record<string, string> = {
      USD: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      NGN: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      EUR: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      GBP: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)'
    };
    return map[cur] || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Account details copied!');
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ 
        background: getGradient(currency), 
        padding: '2rem', 
        borderRadius: '28px', 
        color: '#fff',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '0.8rem', opacity: 0.8 }}>{currency} ACCOUNT</div>
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} />
          </div>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}{amount}
        </div>
        
        {accountDetails && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => copyToClipboard(accountDetails.iban)}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.25rem', letterSpacing: '1px' }}>{accountDetails.bankName || 'VIRTUAL ACCOUNT'}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace' }}>{accountDetails.iban}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
        <button onClick={onSwap} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.85rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Convert</button>
        <button onClick={onPayout} style={{ flex: 1, background: '#fff', border: 'none', color: '#000', padding: '0.85rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Withdraw</button>
      </div>
    </motion.div>
  );
};

const IndividualDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [uRes, txRes] = await Promise.all([
        fetch('https://paypee-api-kmhv.onrender.com/api/users/me', { headers }),
        fetch('https://paypee-api-kmhv.onrender.com/api/transactions', { headers })
      ]);
      const uData = await uRes.json();
      const txData = await txRes.json();
      if (!uData.error) setUserData(uData);
      if (Array.isArray(txData)) setTransactions(txData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAccount = async (currency: string, bvn?: string, kycData?: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://paypee-api-kmhv.onrender.com/api/accounts', {
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
    } catch (err) {
      console.error('Account generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const navigate = (section: string) => setActiveSection(section);

  return (
    <div className="dashboard-shell">
      <VerificationGate 
        kycStatus={userData?.kycStatus || 'PENDING'} 
        accountType="INDIVIDUAL"
        onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
      />

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
        {/* Modern Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
           <div>
             <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.25rem' }}>
               Welcome back, <span className="text-gradient">{userData?.firstName || 'User'}</span>
             </h1>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Monitor your global capital and settlements in real-time.</p>
           </div>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '300px' }} className="desktop-only">
                 <Search size={18} color="var(--text-muted)" />
                 <input type="text" placeholder="Search transactions..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
              </div>
              <button className="btn btn-outline" style={{ padding: '0.75rem', borderRadius: '16px' }}>
                <Bell size={20} />
              </button>
              <div style={{ width: 44, height: 44, borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '2px' }}>
                 <div style={{ width: '100%', height: '100%', background: '#000', borderRadius: '14px', overflow: 'hidden' }}>
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
                
                {/* 1. Master Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
                   <div>
                      <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Total Liquid Capital</div>
                      <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
                        {userData?.wallets?.length > 0 
                           ? `₦${userData.wallets.reduce((acc: number, w: any) => acc + parseFloat(w.balance), 0).toLocaleString(undefined, {minimumFractionDigits: 2})}` 
                           : '₦0.00'
                        }
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
                      {userData?.wallets?.map((w: any) => (
                         <div key={w.id} style={{ minWidth: '280px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                               <div style={{ fontWeight: 700, color: '#94a3b8' }}>{w.currency}</div>
                               <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Wallet size={16} color="#fff" />
                               </div>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{w.currency === 'USD' ? '$' : w.currency === 'EUR' ? '€' : w.currency === 'GBP' ? '£' : '₦'}{parseFloat(w.balance).toFixed(2)}</div>
                         </div>
                      ))}
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
                              <path d="M0,100 Q10,90 20,95 T40,80 T60,85 T80,50 T100,20" fill="none" stroke="#22d3ee" strokeWidth="2" vectorEffect="non-scaling-stroke" />
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
                         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', borderLeft: '3px solid #22d3ee' }}>
                            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>You are holding ₦2.4M while NGN has dropped 1.2%. Convert to USD?</p>
                            <button style={{ padding: '0.6rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Convert to USD</button>
                         </div>
                         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', borderLeft: '3px solid #a78bfa' }}>
                            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5 }}>You spent 18% less on subscriptions this month.</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 6. Recent Activity */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Activity</h3>
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
                            {transactions.length > 0 ? transactions.slice(0, 5).map(tx => (
                               <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
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
                {userData?.wallets?.map((w: any) => (
                   <BalanceCard key={w.id} currency={w.currency} amount={parseFloat(w.balance).toFixed(2)} onSwap={() => setIsSwapOpen(true)} onPayout={() => setIsPayoutOpen(true)} />
                ))}
              </div>
            )}

            {activeSection === 'cards' && <CardsDashboard />}
            {activeSection === 'vaults' && <VaultsView />}
            {activeSection === 'bills' && <BillsView />}
            {activeSection === 'collections' && <CollectionsView />}
            {activeSection === 'history' && <HistoryView />}
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
      />
    </div>
  );
};

export default IndividualDashboard;
