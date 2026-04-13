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

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020617', color: '#fff', overflow: 'hidden' }}>
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
         ) : (
           <>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h1 style={{ fontSize: '1.75rem', margin: 0 }}>TechStream Ltd.</h1>
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
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sarah C. (Admin)</div>
                </div>
              </div>
            </header>

            {/* Analytics Summary */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <MetricCard label="Total Revenue (Apr)" value="$1.24M" trend="+12.4%" icon={TrendingUp} color="var(--accent)" />
              <MetricCard label="Pending Disbursements" value="$450,200" trend="-4.2%" icon={Send} color="var(--primary)" />
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
                  <SubAccountItem name="UK Operations" type="GBP Virtual" balance="£142,500.00" flag="🇬🇧" />
                  <SubAccountItem name="Lagos Main Office" type="NGN Collection" balance="₦45,000,000.00" flag="🇳🇬" />
                  <SubAccountItem name="EU Expansion" type="EUR IBAN" balance="€18,400.00" flag="🇪🇺" />
                  <SubAccountItem name="US Treasury" type="USD Domestic" balance="$340,900.00" flag="🇺🇸" />
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
                 {[
                   { event: "Payment Received", sub: "Lagos Office • ₦2,500,000", time: "Just now", icon: <ArrowDownLeft /> },
                   { event: "Auto-conversion Triggered", sub: "NGN → USDC • $1,204.00", time: "2 mins ago", icon: <RefreshCcw /> },
                   { event: "Bulk Payout Initiated", sub: "UK Payroll • 142 Recipients", time: "15 mins ago", icon: <Send /> }
                 ].map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: i === 2 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ color: 'var(--primary)' }}>{log.icon}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.event}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.sub}</div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {log.time} <ExternalLink size={14} />
                       </div>
                    </div>
                 ))}
              </div>
            </section>
           </>
         )}
      </main>
    </div>
  );
};

export default BusinessDashboard;
