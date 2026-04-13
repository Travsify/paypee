import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone,
  Plus, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Euro,
  Navigation
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

const BalanceCard = ({ currency, amount, symbol, gradient }: { currency: string, amount: string, symbol: string, gradient: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    style={{ 
      minWidth: '260px', 
      padding: '1.5rem', 
      borderRadius: '24px', 
      background: gradient, 
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>{currency} Balance</span>
      <div style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
        {currency === 'USD' ? <DollarSign size={18} /> : currency === 'EUR' ? <Euro size={18} /> : <span>₦</span>}
      </div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{symbol}{amount}</div>
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
      <span style={{ color: '#10b981', fontWeight: 700 }}>+2.4%</span>
      <span style={{ opacity: 0.6 }}>from last week</span>
    </div>
    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
      <Wallet size={100} />
    </div>
  </motion.div>
);

const TransactionItem = ({ type, title, date, amount, status }: { type: 'in' | 'out', title: string, date: string, amount: string, status: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ 
        width: '45px', 
        height: '45px', 
        borderRadius: '14px', 
        background: type === 'in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: type === 'in' ? '#10b981' : '#f43f5e'
      }}>
        {type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{date}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{type === 'in' ? '+' : '-'}{amount}</div>
      <div style={{ 
        fontSize: '0.7rem', 
        textTransform: 'uppercase', 
        fontWeight: 800, 
        color: status === 'Completed' ? '#10b981' : '#f59e0b' 
      }}>{status}</div>
    </div>
  </div>
);

const IndividualDashboard = ({ onLogout }: { onLogout?: () => void }) => {
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
          <Zap size={28} fill="var(--primary)" />
          Paypee
        </div>

        <div style={{ flex: 1 }}>
          <SidebarItem icon={Home} label="Dashboard" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
          <SidebarItem icon={Wallet} label="My Wallets" active={activeSection === 'wallets'} onClick={() => setActiveSection('wallets')} />
          <SidebarItem icon={CreditCard} label="Virtual Cards" active={activeSection === 'cards'} onClick={() => setActiveSection('cards')} />
          <SidebarItem icon={Navigation} label="Transfers" active={activeSection === 'transfers'} onClick={() => setActiveSection('transfers')} />
          <SidebarItem icon={ShieldCheck} label="Security" active={activeSection === 'security'} onClick={() => setActiveSection('settings')} />
        </div>

        <div>
          <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
          <SidebarItem icon={HelpCircle} label="Support" active={activeSection === 'support'} onClick={() => setActiveSection('support')} />
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
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Hello, Sarah! 👋</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back. Here's what's happening with your money.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--border)', 
                      padding: '0.6rem 1rem 0.6rem 2.5rem',
                      borderRadius: '12px',
                      color: '#fff',
                      outline: 'none',
                      width: '240px'
                    }} 
                  />
                  <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative' }}>
                  <Bell size={20} color="var(--text-muted)" />
                  <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid #020617' }} />
                </div>
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
                  alt="Profile" 
                  style={{ width: '45px', height: '45px', borderRadius: '14px', border: '2px solid var(--primary)' }} 
                />
              </div>
            </header>

            {/* Balance Section */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Overview</h2>
                <button style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>See all accounts</button>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                <BalanceCard currency="USD" symbol="$" amount="12,450.00" gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" />
                <BalanceCard currency="NGN" symbol="₦" amount="2,450,000.00" gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                <BalanceCard currency="EUR" symbol="€" amount="1,840.50" gradient="linear-gradient(135deg, #374151 0%, #111827 100%)" />
              </div>
            </section>

            {/* Quick Actions & Transactions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
              {/* Recent Transactions */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Transactions</h2>
                  <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem' }}>
                  <TransactionItem type="out" title="Amazon Web Services" date="12 April, 2026 • 2:34 PM" amount="145.00" status="Completed" />
                  <TransactionItem type="in" title="Apple Inc. Dividend" date="11 April, 2026 • 10:15 AM" amount="1,240.00" status="Completed" />
                  <TransactionItem type="out" title="Starbucks Coffee" date="10 April, 2026 • 8:45 AM" amount="12.50" status="Completed" />
                  <TransactionItem type="out" title="Netflix Subscription" date="09 April, 2026 • 11:30 PM" amount="15.99" status="Completed" />
                  <TransactionItem type="in" title="Payment from Freelance" date="08 April, 2026 • 5:20 PM" amount="3,500.00" status="Pending" />
                </div>
              </section>

              {/* Card Preview & Quick Actions */}
              <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Card</h2>
                <div style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                  borderRadius: '24px', 
                  padding: '1.5rem', 
                  aspectRatio: '1.6 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Zap size={24} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>VIRTUAL DEBIT</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 600 }}>**** **** **** 4021</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ opacity: 0.5, fontSize: '0.65rem', marginBottom: '0.2rem' }}>CARD HOLDER</div>
                      <div style={{ fontWeight: 600 }}>SARAH CHEN</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.5, fontSize: '0.65rem', marginBottom: '0.2rem' }}>EXPIRES</div>
                      <div style={{ fontWeight: 600 }}>08/29</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }} />
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Send Money', icon: ArrowUpRight, color: 'var(--primary)' },
                    { label: 'Receive', icon: ArrowDownLeft, color: '#10b981' },
                    { label: 'Cards', icon: CreditCard, color: '#f59e0b' },
                    { label: 'Pay Bills', icon: Smartphone, color: '#ec4899' }
                  ].map((action, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
                      style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid var(--border)', 
                        padding: '1.2rem', 
                        borderRadius: '20px', 
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ color: action.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                        <action.icon size={24} />
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{action.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  style={{ marginTop: '2rem', background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={20} color="#fff" />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Create New Wallet</div>
                  </div>
                  <ChevronRight size={18} color="var(--primary)" />
                </motion.div>
              </section>
            </div>
           </>
         )}
      </main>
    </div>
  );
};

export default IndividualDashboard;
