import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Send, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  FileText,
  Building2,
  ChevronRight,
  ShieldCheck,
  Plus,
  RefreshCcw,
  ExternalLink,
  Zap,
  Bot,
  Wallet,
  Lock,
  History
} from 'lucide-react';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';
import AiAdvisor from './AiAdvisor';
import VaultsDashboard from './VaultsDashboard';
import AccountCreationModal from './AccountCreationModal';
import BillsDashboard from './BillsDashboard';
import PayoutModal from './PayoutModal';
import BalanceCard from './components/BalanceCard';
import HistoryView from './components/HistoryView';
import TransactionReceiptModal from './components/TransactionReceiptModal';
import { API_BASE } from './config';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, Cell } from 'recharts';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ x: 5, color: '#fff' }}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '0.8rem 1.2rem', 
      borderRadius: '12px', 
      cursor: 'pointer',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? 600 : 500,
      marginBottom: '0.4rem'
    }}
  >
    <Icon size={20} />
    <span style={{ fontSize: '0.95rem' }}>{label}</span>
  </motion.div>
);

const MetricCard = ({ label, value, trend, icon: Icon, color }: { label: string, value: string, trend: string, icon: any, color: string }) => {
  const isPositive = trend.startsWith('+') || ['Optimized', 'Active', '100%'].includes(trend);
  const trendColor = isPositive ? '#10b981' : '#f43f5e';
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid var(--border)', 
        padding: '1.5rem', 
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{label}</div>
        <div style={{ color }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
        <span style={{ color: trendColor, fontWeight: 700 }}>{trend}</span>
        <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    </motion.div>
  );
};

const BusinessDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [uData, txData] = await Promise.all([
        fetch(`${API_BASE}/api/users/me`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/transactions`, { headers }).then(res => res.json())
      ]);
      if(!uData.error) setUserData(uData);
      if(Array.isArray(txData)) setTransactions(txData);
    } catch (err) {
      console.error('Failed to fetch business data:', err);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const generateAccount = async (currency: string, bvn?: string, kycData?: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/accounts/provision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({ 
          currency: currency.toUpperCase(),
          bvn,
          ...kycData
        })
      });
      if (response.ok) {
        setIsAccountModalOpen(false);
        fetchUserData();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to generate treasury account.');
      }
    } catch (err) {
      console.error('Account generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAccount = async (id: string) => {
     try {
        const response = await fetch(`${API_BASE}/api/accounts/${id}`, {
           method: 'DELETE',
           headers: {
              'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
           }
        });
        if (response.ok) {
           fetchUserData();
        } else {
           const err = await response.json();
           alert(err.error || 'Failed to delete account.');
        }
     } catch (err) {
        console.error('Delete account error:', err);
     }
  };

  const statCardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '20px' };
  const statLabelStyle: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', display: 'block', marginBottom: '1rem' };
  const statValueStyle: React.CSSProperties = { fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' };

  const isVerified = userData?.kycStatus === 'VERIFIED';

  const navigate = (section: string) => {
    const publicSections = ['dashboard', 'settings', 'help'];
    if (!isVerified && !publicSections.includes(section)) {
        setActiveSection('verification_required');
        return;
    }
    setActiveSection(section);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020617', color: '#fff', overflow: 'hidden' }}>

      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Sidebar - Hidden on Mobile */}
        <aside className="dashboard-aside desktop-only" style={{ width: '280px', borderRight: '1px solid var(--border)', background: '#0a0f1e', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginBottom: '3rem' }}>
            <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Zap size={20} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Paypee <span style={{ color: 'var(--primary)', fontSize: '0.6rem', verticalAlign: 'top', marginLeft: '2px' }}>BIZ</span></span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
             <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'dashboard'} onClick={() => navigate('dashboard')} />
             <SidebarItem icon={Wallet} label="Treasury" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
             <SidebarItem icon={History} label="Transactions" active={activeSection === 'history'} onClick={() => navigate('history')} />
             <SidebarItem icon={Send} label="Disbursements" active={activeSection === 'payouts'} onClick={() => navigate('payouts')} />
             <SidebarItem icon={Layers} label="Team Accounts" active={activeSection === 'subs'} onClick={() => navigate('subs')} />
             <SidebarItem icon={Zap} label="Pay Bills" active={activeSection === 'bills'} onClick={() => navigate('bills')} />
             <SidebarItem icon={Lock} label="Savings" active={activeSection === 'vaults'} onClick={() => navigate('vaults')} />
             <SidebarItem icon={BarChart3} label="Insights" active={activeSection === 'analytics'} onClick={() => navigate('analytics')} />
             <SidebarItem icon={Users} label="Team" active={activeSection === 'team'} onClick={() => navigate('team')} />
             <SidebarItem icon={Bot} label="AI Helper" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1.5rem' }} className="desktop-only">
            <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
            <SidebarItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('help')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
          </div>
        </aside>

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
          <MobileNavButton icon={LayoutDashboard} label="Home" active={activeSection === 'dashboard'} onClick={() => navigate('dashboard')} />
          <MobileNavButton icon={Wallet} label="Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
          <MobileNavButton icon={History} label="History" active={activeSection === 'history'} onClick={() => navigate('history')} />
          <MobileNavButton icon={MenuIcon} label="More" onClick={() => setShowMobileMenu(true)} />
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
                  <CloseIcon onClick={() => setShowMobileMenu(false)} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <SidebarItem icon={Send} label="Send Money" active={activeSection === 'payouts'} onClick={() => { navigate('payouts'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Layers} label="Team Accounts" active={activeSection === 'subs'} onClick={() => { navigate('subs'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Zap} label="Pay Bills" active={activeSection === 'bills'} onClick={() => { navigate('bills'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Lock} label="Savings" active={activeSection === 'vaults'} onClick={() => { navigate('vaults'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={BarChart3} label="Insights" active={activeSection === 'analytics'} onClick={() => { navigate('analytics'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Users} label="Team" active={activeSection === 'team'} onClick={() => { navigate('team'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Bot} label="AI Helper" active={activeSection === 'ai'} onClick={() => { navigate('ai'); setShowMobileMenu(false); }} />
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1rem 0' }} />
                  <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => { navigate('settings'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={LogOut} label="Logout" onClick={onLogout} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="dashboard-main" style={{ flex: 1, overflowY: 'auto', padding: '3rem 4rem', paddingBottom: '100px', background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)' }}>
          {userData && (
            <VerificationGate 
              kycStatus={userData.kycStatus} 
              accountType="BUSINESS"
              onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
            />
          )}

          {activeSection === 'verification_required' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', minHeight: '60vh' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2rem' }}><Building2 size={40} /></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Business Verification Required</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6, marginBottom: '2.5rem' }}>Your business profile needs to be verified before you can access advanced treasury features, wholesale liquidity, and bulk payouts.</p>
              <button onClick={() => setActiveSection('dashboard')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Complete Verification</button>
            </div>
          )}

          {activeSection === 'settings' && <SettingsView />}
          {activeSection === 'ai' && <AiAdvisor transactions={transactions} userName={userData?.businessName} />}
          {activeSection === 'vaults' && <VaultsDashboard />}
          {activeSection === 'bills' && <BillsDashboard />}
          {activeSection === 'history' && <HistoryView onTransactionClick={(tx) => setSelectedTx(tx)} />}

          {activeSection === 'wallets' && (
             <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Wallet size={28} color="var(--primary)" /> Corporate Treasury Wallets</h2>
               <div className="balance-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {userData?.wallets?.map((w: any) => {
                    const symbols: any = { USD: '$', EUR: '€', NGN: '₦', GBP: '£', BTC: '₿', PYUSD: '₱' };
                    const gradients: any = {
                      USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      BTC: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      PYUSD: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
                    };
                    return (
                      <BalanceCard 
                        key={w.id}
                        currency={w.currency}
                        symbol={symbols[w.currency] || w.currency}
                        amount={parseFloat(w.balance).toFixed(2)}
                        gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}
                        details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                        userName={userData?.businessName}
                        type="BUSINESS"
                        onDelete={deleteAccount}
                      />
                    );
                  })}
                  <motion.div 
                     whileHover={isVerified ? { scale: 1.02, y: -5 } : {}}
                      onClick={() => {
                        if (!isVerified) { alert('You must complete Identity Verification before provisioning a treasury account.'); }
                        else { setIsAccountModalOpen(true); }
                      }}
                      style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: isVerified ? 'pointer' : 'not-allowed', minHeight: '200px', opacity: isVerified ? 1 : 0.5 }}
                  >
                     <Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                     <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Add Wallet</span>
                  </motion.div>
               </div>
             </div>
          )}

          {activeSection === 'dashboard' && (
            <>
              <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <div className="mobile-only" style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>BUSINESS DASHBOARD</div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Dashboard</h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}><div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} /> ACTIVE</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}><Building2 size={16} /> {userData?.businessName || 'Business'}</div>
                  </div>
                </div>
                <div className="dashboard-header-right" style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={fetchUserData}><RefreshCcw size={18} /></button>
                  <button style={{ background: isVerified ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: isVerified ? '#fff' : '#64748b', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed' }} onClick={() => {
                    if (!isVerified) {
                      alert('You must complete Identity Verification before provisioning a treasury account.');
                    } else {
                      setIsAccountModalOpen(true);
                    }
                  }}>Add Wallet</button>
                </div>
              </div>

              <div className="balance-card-slider no-scrollbar" style={{ display: 'grid', gap: '2rem', marginBottom: '3.5rem' }}>
                 <MetricCard label="Total Balance" value={`$${(userData?.wallets?.reduce((acc: any, w: any) => acc + (w.currency === 'USD' ? parseFloat(w.balance) : 0), 0) || 0).toLocaleString()}`} trend="+12.4%" icon={TrendingUp} color="#10b981" />
                 <MetricCard label="Total Payments" value="1.2k" trend="+85%" icon={Send} color="var(--primary)" />
                 <MetricCard label="Team Accounts" value="12" trend="Active" icon={Layers} color="var(--secondary)" />
                 <MetricCard label="Safety Score" value="100%" trend="Safe" icon={ShieldCheck} color="#10b981" />
              </div>

              <div className="dashboard-grid-2" style={{ display: 'grid', gap: '3rem' }}>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Balance Over Time</h2>
                      <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                         {['1D', '1W', '1M', '1Y'].map(p => (<button key={p} style={{ background: p === '1M' ? 'var(--primary)' : 'rgba(255,255,255,0.03)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>{p}</button>))}
                      </div>
                    </div>
                    <div style={{ height: '350px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '32px', padding: '2rem 1.5rem' }}>
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={[
                           { name: 'Mon', income: 4000, expense: 2400 },
                           { name: 'Tue', income: 3000, expense: 1398 },
                           { name: 'Wed', income: 2000, expense: 9800 },
                           { name: 'Thu', income: 2780, expense: 3908 },
                           { name: 'Fri', income: 1890, expense: 4800 },
                           { name: 'Sat', income: 2390, expense: 3800 },
                           { name: 'Sun', income: 3490, expense: 4300 },
                         ]}>
                           <defs>
                             <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                           <YAxis hide />
                           <Tooltip contentStyle={{ background: '#0a1122', border: '1px solid #1e293b', borderRadius: '12px' }} />
                           <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                         </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>Active Wallet Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {userData?.wallets?.map((w: any) => (
                        <div key={w.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                 {w.currency === 'USD' ? '🇺🇸' : w.currency === 'NGN' ? '🇳🇬' : w.currency === 'EUR' ? '🇪🇺' : '🌐'}
                              </div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{w.currency} Wallet</div>
                                 <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>ACTIVE</div>
                              </div>
                           </div>
                           <ChevronRight size={18} opacity={0.3} />
                        </div>
                      ))}
                      <motion.button 
                        whileTap={isVerified ? { scale: 0.98 } : {}}
                         onClick={() => {
                           if (!isVerified) { alert('You must complete Identity Verification before provisioning a treasury account.'); }
                           else { setIsAccountModalOpen(true); }
                         }}
                         style={{ width: '100%', padding: '1rem', border: '2px dashed var(--border)', background: 'transparent', borderRadius: '20px', color: isVerified ? 'var(--text-muted)' : '#64748b', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5 }}
                       >{isVerified ? '+ Add Wallet' : '🔒 Verification Required'}</motion.button>
                    </div>
                 </div>
              </div>
            </>
          )}
        </main>
      </div>

      <PayoutModal isOpen={activeSection === 'payouts'} onClose={() => setActiveSection('dashboard')} onComplete={fetchUserData} wallets={userData?.wallets || []} userType="BUSINESS" />
      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={generateAccount} 
        isProcessing={isGenerating} 
        existingCurrencies={userData?.wallets?.map((w: any) => w.currency) || []} 
      />
      <TransactionReceiptModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
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
    <Icon size={20} />
    <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{label}</span>
  </motion.button>
);

const MenuIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const CloseIcon = ({ size = 20, onClick, style }: any) => (
  <svg onClick={onClick} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default BusinessDashboard;
