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
  Zap
} from 'lucide-react';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';

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

const SubAccountItem = ({ name, type, balance, flag }: { name: string, type: string, balance: string, flag: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ fontSize: '1.5rem' }}>{flag}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{type} Account</div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{balance}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 800 }}>ACTIVE</div>
    </div>
  </div>
);

const BusinessDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('https://paypee-api.onrender.com/api/users/me', { headers }).then(res => res.json()),
      fetch('https://paypee-api.onrender.com/api/transactions', { headers }).then(res => res.json())
    ]).then(([uData, txData]) => {
      if(!uData.error) setUserData(uData);
      if(Array.isArray(txData)) setTransactions(txData);
    });
  }, []);

  const getTotalUSD = () => {
    if (!userData || !userData.wallets) return "0.00";
    const sum = userData.wallets.reduce((acc: number, w: any) => acc + parseFloat(w.balance), 0);
    return "$" + sum.toFixed(2);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#020617', color: '#fff', overflow: 'hidden' }}>
      <VerificationGate kycStatus={userData?.kycStatus || 'PENDING'} accountType="BUSINESS" />
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

        <div style={{ flex: 1 }}>
           <SidebarItem icon={LayoutDashboard} label="Treasury Dashboard" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
          <SidebarItem icon={Layers} label="Accounts & IBANs" active={activeSection === 'accounts'} onClick={() => setActiveSection('accounts')} />
          <SidebarItem icon={Users} label="Payroll Engine" active={activeSection === 'payroll'} onClick={() => setActiveSection('payroll')} />
          <SidebarItem icon={Send} label="Bulk Payouts" active={activeSection === 'payouts'} onClick={() => setActiveSection('payouts')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
          <SidebarItem icon={FileText} label="Tax Reports" active={activeSection === 'tax'} onClick={() => setActiveSection('tax')} />
        </div>

        <div>
          <SidebarItem icon={Settings} label="Admin Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
          <SidebarItem icon={HelpCircle} label="Help Center" active={activeSection === 'help'} onClick={() => setActiveSection('help')} />
          <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          {activeSection === 'settings' ? (
           <SettingsView />
         ) : activeSection === 'accounts' ? (
           <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Global Virtual Accounts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {userData?.wallets?.map((w: any) => (
                  <div key={w.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <Building2 size={32} color="var(--primary)" />
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>{w.currency} Account</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paypee Direct</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>ACCOUNT NUMBER</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px' }}>0123456789</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--accent)' }}>{w.currency} {parseFloat(w.balance).toFixed(2)}</div>
                      <button style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
         ) : activeSection === 'payroll' ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <Users size={80} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Payroll Engine</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Schedule and automate salary payments for your global team.</p>
              <button 
                onClick={() => {
                  if (userData?.kycStatus !== 'VERIFIED') {
                    alert('KYB Verification required to perform payroll operations.');
                  }
                }}
                style={{ 
                  background: userData?.kycStatus === 'VERIFIED' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                  color: userData?.kycStatus === 'VERIFIED' ? '#fff' : '#64748b', 
                  border: 'none', 
                  padding: '1.2rem 2.5rem', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed' 
                }}
              >
                {userData?.kycStatus === 'VERIFIED' ? 'Initialize Payroll Run' : 'Verify Account to Access Payroll'}
              </button>
            </div>
         ) : activeSection === 'payouts' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Bulk Payouts</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
                <Send size={60} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Instant Global Disbursements</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Upload a CSV file to pay up to 5,000 recipients across 140+ countries instantly via the Bitnob network.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => {
                      if (userData?.kycStatus !== 'VERIFIED') {
                        alert('KYB Verification required for bulk payouts.');
                      }
                    }}
                    style={{ 
                      background: userData?.kycStatus === 'VERIFIED' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                      color: userData?.kycStatus === 'VERIFIED' ? '#fff' : '#64748b', 
                      border: 'none', 
                      padding: '1rem 2rem', 
                      borderRadius: '12px', 
                      fontWeight: 700, 
                      cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed' 
                    }}
                  >
                    {userData?.kycStatus === 'VERIFIED' ? 'Upload CSV' : 'Verify to Unlock'}
                  </button>
                  <button 
                    onClick={() => {
                      if (userData?.kycStatus !== 'VERIFIED') {
                        alert('KYB Verification required for manual entry.');
                      }
                    }}
                    style={{ 
                      background: userData?.kycStatus === 'VERIFIED' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.05)', 
                      color: '#fff', 
                      border: '1px solid var(--border)', 
                      padding: '1rem 2rem', 
                      borderRadius: '12px', 
                      fontWeight: 700, 
                      cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed' 
                    }}
                  >
                    Manual Entry
                  </button>
                </div>
              </div>
            </div>
         ) : activeSection === 'analytics' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Flow Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <MetricCard label="Net Inbound" value="$14,200.00" trend="+18.2%" icon={ArrowDownLeft} color="#10b981" />
                <MetricCard label="Net Outbound" value="$8,400.00" trend="-4.1%" icon={ArrowUpRight} color="#f43f5e" />
                <MetricCard label="Average TX Fee" value="$0.12" trend="-15%" icon={Zap} color="var(--secondary)" />
              </div>
              <div style={{ height: '300px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                [Interactive Flow Chart Coming Soon]
              </div>
            </div>
         ) : activeSection === 'tax' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Tax Compliance</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { name: 'VAT/GST Report - Q1 2026', date: 'March 2026', size: '2.4 MB' },
                  { name: 'Withholding Tax Certs', date: 'Feb 2026', size: '1.1 MB' },
                  { name: 'Annual Corporate Return', date: 'Jan 2026', size: '15.8 MB' }
                ].map((doc, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <FileText size={24} color="var(--primary)" />
                      <div>
                        <div style={{ fontWeight: 700 }}>{doc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.date} • {doc.size}</div>
                      </div>
                    </div>
                    <button style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Download PDF</button>
                  </div>
                ))}
              </div>
            </div>
         ) : activeSection === 'help' ? (
            <div style={{ padding: '1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <HelpCircle size={80} color="var(--secondary)" style={{ marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Business Support Center</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Your dedicated account manager is available for priority treasury assistance.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '24px' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Direct Line</h4>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>+1 800-PAYPEE-BIZ</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '24px' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Enterprise Support</h4>
                  <div style={{ color: 'var(--secondary)', fontWeight: 700 }}>biz-support@paypee.com</div>
                </div>
              </div>
            </div>
         ) : (
           <>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{userData?.businessName || (userData ? userData.email.split('@')[0].toUpperCase() + ' Ltd.' : 'TechStream Ltd.')}</h1>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>VERIFIED BUSINESS</div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Treasury Operations • Mainnet Node: #7721</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <RefreshCcw size={18} color="var(--text-muted)" />
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative' }}>
                  <Bell size={20} color="var(--text-muted)" />
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', border: '2px solid #020617' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
                    alt="Admin" 
                    style={{ width: '32px', height: '32px', borderRadius: '10px' }} 
                  />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userData?.firstName || 'Admin'}</div>
                </div>
              </div>
            </header>

            {/* Analytics Summary */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <MetricCard label="Total Treasury Volume" value={getTotalUSD()} trend="+12.4%" icon={TrendingUp} color="var(--accent)" />
              <MetricCard label="Pending Disbursements" value="0.00" trend="Up to date" icon={Send} color="var(--primary)" />
              <MetricCard label="Average Settlement" value="1.8s" trend="Optimized" icon={Zap} color="var(--secondary)" />
              <MetricCard label="Security Compliance" value="100%" trend="Active" icon={ShieldCheck} color="var(--accent)" />
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              {/* Sub-accounts Management */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Global Sub-accounts</h2>
                  <button style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} /> Create New
                  </button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem' }}>
                  {userData && userData.wallets ? userData.wallets.map((w: any, idx: number) => (
                    <SubAccountItem 
                       key={idx} 
                       name={w.currency + " Operations"} 
                       type={w.currency + " Virtual"} 
                       balance={w.currency === 'USD' ? '$' + parseFloat(w.balance).toFixed(2) : parseFloat(w.balance).toFixed(2) + ' ' + w.currency} 
                       flag={w.currency === 'USD' ? "🇺🇸" : w.currency === 'GBP' ? "🇬🇧" : w.currency === 'EUR' ? "🇪🇺" : "🇳🇬"} 
                    />
                  )) : (
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No wallets deployed.</div>
                  )}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ marginTop: '1.5rem', padding: '1rem', textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    View Unified Ledger Statement
                  </motion.div>
                </div>
              </section>

              {/* Quick Treasury Actions */}
              <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Treasury Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '24px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                      <Send size={20} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Bulk Payouts</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay up to 5k employees.</p>
                  </div>
                  <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '24px', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '1rem' }}>
                      <Plus size={20} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Collect Funds</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate payment links.</p>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Auto-Treasury Active</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>20% of all incoming NGN is being automatically converted to USDC to hedge inflation.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Modify Rule</div>
                     <div style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>History</div>
                  </div>
                  <BarChart3 size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1 }} />
                </div>
              </section>
            </div>

            {/* Global Activity Feed */}
            <section style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Network Event Log</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>LIVE UPDATES</div>
                   <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)' }} />
                </div>
              </div>
              <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', padding: '1rem' }}>
                 {transactions.length > 0 ? transactions.map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: i === transactions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ color: 'var(--primary)' }}>
                             {log.type === 'DEPOSIT' || log.type === 'TRANSFER_IN' ? <ArrowDownLeft /> : <ArrowUpRight />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.type.replace('_', ' ')}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.reference} • {log.currency} {log.amount}</div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(log.createdAt).toLocaleTimeString()} <ExternalLink size={14} />
                       </div>
                    </div>
                 )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No network events detected.</div>
                 )}
              </div>
            </section>
           </>
         )}
      </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
