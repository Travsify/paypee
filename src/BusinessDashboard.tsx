import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import BillsDashboard from './BillsDashboard';
import AccountCreationModal from './AccountCreationModal';
import BalanceCard from './components/BalanceCard';
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

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [uData, txData] = await Promise.all([
        fetch('https://paypee-api.onrender.com/api/users/me', { headers }).then(res => res.json()),
        fetch('https://paypee-api.onrender.com/api/transactions', { headers }).then(res => res.json())
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

  const generateAccount = async (currency: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://paypee-api.onrender.com/api/accounts/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({ currency: currency.toUpperCase() })
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

  const statCardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '20px' };
  const statLabelStyle: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', display: 'block', marginBottom: '1rem' };
  const statValueStyle: React.CSSProperties = { fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' };

  const isVerified = userData?.kycStatus === 'VERIFIED';

  const navigate = (section: string) => {
    const openSections = ['dashboard', 'settings', 'help'];
    if (!isVerified && !openSections.includes(section)) {
      setActiveSection('kyc_blocked');
      return;
    }
    setActiveSection(section);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020617', color: '#fff', overflow: 'hidden' }}>
      <VerificationGate 
        kycStatus={userData?.kycStatus || 'PENDING'} 
        accountType="BUSINESS"
        onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ 
          width: '280px', 
          background: '#0a0f1e', 
          borderRight: '1px solid var(--border)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            <Building2 size={28} color="var(--primary)" />
            Paypee Business
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', margin: '0 -0.5rem' }}>
             <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'dashboard'} onClick={() => navigate('dashboard')} />
             <SidebarItem icon={Wallet} label="My Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
             <SidebarItem icon={BarChart3} label="Money Stats" active={activeSection === 'analytics'} onClick={() => navigate('analytics')} />
             <SidebarItem icon={Users} label="Pay Employees" active={activeSection === 'payroll'} onClick={() => navigate('payroll')} />
             <SidebarItem icon={Send} label="Send to Many" active={activeSection === 'payouts'} onClick={() => navigate('payouts')} />
             <SidebarItem icon={Lock} label="Safe Box" active={activeSection === 'vaults'} onClick={() => navigate('vaults')} />
             <SidebarItem icon={Zap} label="Pay Bills" active={activeSection === 'bills'} onClick={() => navigate('bills')} />
             <SidebarItem icon={Bot} label="AI Helper" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
             <SidebarItem icon={FileText} label="Tax Help" active={activeSection === 'tax'} onClick={() => navigate('tax')} />
          </div>

          <div>
            <SidebarItem icon={Settings} label="Admin Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
            <SidebarItem icon={HelpCircle} label="Help Center" active={activeSection === 'help'} onClick={() => navigate('help')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          {activeSection === 'kyc_blocked' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', textAlign: 'center', gap: '1.5rem' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>KYB Verification Required</h2>
              <p style={{ color: '#64748b', maxWidth: '420px', lineHeight: 1.7 }}>
                This feature is locked until your business is verified. Complete your KYB to unlock Treasury, Analytics, Payroll, Bulk Payouts, Vaults, and all enterprise features.
              </p>
              <button
                onClick={() => setActiveSection('dashboard')}
                style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >
                Return to Dashboard
              </button>
            </div>
          ) : activeSection === 'ai' ? (
            <AiAdvisor transactions={transactions} userName={userData?.companyName || userData?.firstName} />
          ) : activeSection === 'vaults' ? (
            <VaultsDashboard />
          ) : activeSection === 'bills' ? (
            <BillsDashboard />
          ) : activeSection === 'wallets' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Treasury Accounts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {userData?.wallets?.map((w: any) => {
                  const symbols: any = { USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
                  const gradients: any = {
                    USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    GBP: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                    NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  };
                  return (
                    <BalanceCard 
                      key={w.id}
                      currency={w.currency}
                      symbol={symbols[w.currency] || w.currency}
                      amount={parseFloat(w.balance).toFixed(2)}
                      gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}
                      details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                      userName={userData?.businessName || userData?.firstName}
                      type="BUSINESS"
                    />
                  );
                })}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setIsAccountModalOpen(true)}
                  style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '180px' }}
                >
                  <Plus size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Generate Treasury Rail</span>
                </motion.div>
              </div>
            </div>
          ) : activeSection === 'analytics' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Revenue Intelligence</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <MetricCard label="TOTAL VOLUME" value="$4,281,090.00" trend="+12.5%" icon={BarChart3} color="var(--primary)" />
                <MetricCard label="AVG SETTLEMENT" value="1.82s" trend="99.9%" icon={Zap} color="#f59e0b" />
                <MetricCard label="PAYROLL COUNT" value="128" trend="Active" icon={Users} color="#10b981" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '32px', padding: '2.5rem' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>Monthly Revenue Growth (USD)</h3>
                 <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', val: 4000 }, { name: 'Feb', val: 3000 }, { name: 'Mar', val: 5000 },
                        { name: 'Apr', val: 8000 }, { name: 'May', val: 7500 }, { name: 'Jun', val: 9000 },
                      ]}>
                        <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0a0f1e', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="val" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          ) : activeSection === 'payroll' ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <Users size={80} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Enterprise Payroll</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Automate salaries and tax withholding for your global workforce.</p>
              <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: 700 }}>Launch Payroll Run</button>
            </div>
          ) : activeSection === 'payouts' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Bulk Payouts</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
                <Send size={60} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Global Disbursements</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Upload a CSV to pay thousands of recipients across 140+ countries.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700 }}>Upload CSV</button>
                  <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700 }}>Manual Entry</button>
                </div>
              </div>
            </div>
          ) : activeSection === 'tax' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Tax & Compliance</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {['VAT/GST Report - Q1 2026', 'Corporate Tax Filing', 'Withholding Certs'].map((doc, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <FileText size={24} color="var(--primary)" />
                      <span style={{ fontWeight: 700 }}>{doc}</span>
                    </div>
                    <button style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700 }}>Download</button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'help' ? (
            <div style={{ padding: '1rem', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Enterprise Support</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Direct access to treasury engineering. Average response: 12 minutes.</p>
                <textarea placeholder="Message..." style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', color: '#fff', outline: 'none', marginBottom: '1.5rem' }} />
                <button style={{ width: '100%', padding: '1.2rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800 }}>Summon Priority Agent</button>
              </div>
            </div>
          ) : activeSection === 'settings' ? (
            <SettingsView />
          ) : (
            <>
              {/* Default Overview */}
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Business Overview</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Welcome back, {userData?.firstName || 'Admin'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>KYB VERIFIED</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={fetchUserData} style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--primary)', border: 'none', color: '#fff' }}><RefreshCcw size={20} /></motion.button>
                </div>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <MetricCard label="LIQUIDITY" value={userData?.wallets?.reduce((a: any, b: any) => a + parseFloat(b.balance), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || "$0.00"} trend="+5.2%" icon={Wallet} color="var(--primary)" />
                <MetricCard label="PENDING TRADES" value="0" trend="Active" icon={History} color="#f59e0b" />
                <MetricCard label="ACTIVE EMPLOYEES" value="42" trend="+3" icon={Users} color="#10b981" />
              </div>

              <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Network Ledger</h2>
                  <button style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 700 }}>Export History</button>
                </div>
                <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
                  {transactions.length > 0 ? transactions.map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: i === transactions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ color: log.type === 'DEPOSIT' ? '#10b981' : '#f43f5e' }}>
                            {log.type === 'DEPOSIT' ? <ArrowDownLeft /> : <ArrowUpRight />}
                         </div>
                         <div>
                            <div style={{ fontWeight: 700 }}>{log.desc}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {log.reference.slice(0, 12)}...</div>
                         </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>{log.currency} {log.amount}</div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>SUCCESS</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No activities logged.</div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={generateAccount} 
        isProcessing={isGenerating} 
      />
    </div>
  );
};

export default BusinessDashboard;
