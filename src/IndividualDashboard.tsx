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
  X
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
    style={{ color: active ? '#fff' : 'var(--text-muted)' }}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span style={{ fontSize: '1rem', fontWeight: active ? 800 : 600 }}>{label}</span>
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
        kycStatus={userData?.kycStatus} 
        accountType="INDIVIDUAL"
        onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
      />

      {/* Modern Desktop Sidebar */}
      <aside className="modern-sidebar">
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
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                  {userData?.wallets?.map((w: any) => {
                    const symbols: any = { USD: '$', EUR: '€', NGN: '₦', GBP: '£', BTC: '₿' };
                    const gradients: any = {
                      USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      BTC: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    };
                    const details = w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {};
                    
                    return (
                      <BalanceCard 
                        key={w.id}
                        currency={w.currency}
                        symbol={symbols[w.currency] || w.currency}
                        amount={parseFloat(w.balance).toFixed(2)}
                        gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}
                        details={details}
                        userName={`${userData?.firstName} ${userData?.lastName}`}
                        type="INDIVIDUAL"
                      />
                    );
                  })}
                  <motion.div 
                    onClick={() => setIsAccountModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--border)', borderRadius: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '2rem', minHeight: '260px' }}
                  >
                    <div style={{ width: 50, height: 50, background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                      <Plus size={24} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Open New Wallet</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>NGN, USD, EUR, or GBP</div>
                  </motion.div>
                </div>

                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Recent Settlements</h3>
                    <button onClick={() => navigate('history')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>View All Activity</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.slice(0, 5).map(tx => (
                      <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '14px', background: tx.type === 'DEPOSIT' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: tx.type === 'DEPOSIT' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                               <div style={{ fontWeight: 800, fontSize: '1rem' }}>{tx.desc || (tx.type === 'DEPOSIT' ? 'Incoming Settlement' : 'Transfer Payout')}</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(tx.createdAt).toLocaleDateString()} · {tx.status}</div>
                            </div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: tx.type === 'DEPOSIT' ? '#10b981' : '#fff' }}>{tx.type === 'DEPOSIT' ? '+' : '-'}{tx.currency} {parseFloat(tx.amount).toFixed(2)}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'wallets' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {userData?.wallets?.map((w: any) => {
                  const symbols: any = { USD: '$', EUR: '€', NGN: '₦', GBP: '£', BTC: '₿' };
                  const gradients: any = {
                    USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    BTC: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  };
                  const details = w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {};

                  return (
                    <BalanceCard 
                      key={w.id} 
                      currency={w.currency} 
                      symbol={symbols[w.currency] || w.currency}
                      amount={parseFloat(w.balance).toFixed(2)} 
                      gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}
                      details={details}
                      userName={`${userData?.firstName} ${userData?.lastName}`}
                      type="INDIVIDUAL"
                      onDelete={(id) => {/* Handle delete */}}
                    />
                  );
                })}
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
