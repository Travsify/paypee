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
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('https://paypee-api.onrender.com/api/users/me', { headers }).then(res => res.json()),
      fetch('https://paypee-api.onrender.com/api/transactions', { headers }).then(res => res.json()),
      fetch('https://paypee-api.onrender.com/api/cards', { headers }).then(res => res.json())
    ]).then(([uData, txData, cardData]) => {
      if(!uData.error) setUserData(uData);
      if(Array.isArray(txData)) setTransactions(txData);
      if(Array.isArray(cardData)) setCards(cardData);
    });
  }, []);

  const getBalance = (currency: string) => {
    if (!userData || !userData.wallets) return "0.00";
    const wallet = userData.wallets.find((w: any) => w.currency === currency);
    return wallet ? parseFloat(wallet.balance).toFixed(2) : "0.00";
  };

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
          <SidebarItem icon={ShieldCheck} label="Security" active={activeSection === 'security'} onClick={() => setActiveSection('security')} />
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
         ) : activeSection === 'wallets' ? (
           <div style={{ padding: '1rem' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>My Wallets</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
               {userData?.wallets?.map((w: any) => (
                 <BalanceCard key={w.id} currency={w.currency} symbol={w.currency === 'USD' ? '$' : '₦'} amount={parseFloat(w.balance).toFixed(2)} gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" />
               ))}
               <motion.div 
                 whileHover={{ y: -5 }}
                 style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '180px' }}
               >
                 <Plus size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                 <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Request New Wallet</span>
               </motion.div>
             </div>
           </div>
         ) : activeSection === 'cards' ? (
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Virtual Cards</h2>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Plus size={20} /> Issue New Card
                </motion.button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {cards.map((card, i) => (
                  <div key={i} style={{ 
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                    borderRadius: '24px', 
                    padding: '2rem', 
                    aspectRatio: '1.6 / 1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Zap size={28} color="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.6 }}>ACTIVE VIRTUAL</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', letterSpacing: '4px', fontWeight: 700 }}>
                      **** **** **** {card.cardNumber.slice(-4)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ opacity: 0.5, fontSize: '0.7rem', marginBottom: '0.2rem' }}>CARD HOLDER</div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{userData?.email.split('@')[0].toUpperCase()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ opacity: 0.5, fontSize: '0.7rem', marginBottom: '0.2rem' }}>EXPIRY</div>
                        <div style={{ fontWeight: 600 }}>{card.expiry}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         ) : activeSection === 'transfers' ? (
           <div style={{ padding: '1rem', maxWidth: '800px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Transfer Funds</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600 }}>SOURCE WALLET</label>
                  <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none' }}>
                    {userData?.wallets?.map((w: any) => (
                      <option key={w.id} value={w.id}>{w.currency} Wallet - Balance: {parseFloat(w.balance).toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600 }}>RECIPIENT ACCOUNT / LIGHTNING ADDRESS</label>
                  <input type="text" placeholder="e.g. user@paypee or lightning_addr..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600 }}>AMOUNT</label>
                  <input type="number" placeholder="0.00" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '14px', color: '#fff', fontSize: '1.5rem', fontWeight: 700, outline: 'none' }} />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}
                >
                  Confirm Transfer
                </motion.button>
              </div>
           </div>
         ) : activeSection === 'security' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Security & Privacy</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', status: 'Enabled', icon: ShieldCheck },
                  { title: 'Biometric Login', desc: 'Secure your mobile sessions with FaceID or Fingerprint.', status: 'Disabled', icon: Smartphone },
                  { title: 'Transaction PIN', desc: 'Mandatory PIN for all outbound money movement.', status: 'Set', icon: Zap }
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.6rem 1.2rem', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
                  </div>
                ))}
              </div>
            </div>
         ) : activeSection === 'support' ? (
            <div style={{ padding: '1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <HelpCircle size={80} color="var(--primary)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>How can we help?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Our engineering and support team is available 24/7 to assist with your global capital flow.</p>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Start Live Chat</button>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', color: '#fff' }}>Email support@paypee.com</button>
              </div>
            </div>
         ) : (
           <>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Hello, {userData ? userData.email.split('@')[0] : 'Sarah'}! 👋</h1>
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
                <BalanceCard currency="USD" symbol="$" amount={getBalance("USD")} gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" />
                <BalanceCard currency="NGN" symbol="₦" amount={getBalance("NGN")} gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                <BalanceCard currency="EUR" symbol="€" amount={getBalance("EUR")} gradient="linear-gradient(135deg, #374151 0%, #111827 100%)" />
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
                  {transactions.length > 0 ? transactions.map((tx, i) => (
                    <TransactionItem 
                      key={i}
                      type={tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? 'in' : 'out'} 
                      title={tx.reference} 
                      date={new Date(tx.createdAt).toLocaleString()} 
                      amount={tx.amount.toString()} 
                      status={tx.status} 
                    />
                  )) : (
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No recent transactions.</div>
                  )}
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
                  <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 600 }}>
                    {cards.length > 0 ? "**** **** **** " + cards[0].cardNumber.slice(-4) : "**** **** **** 0000"}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ opacity: 0.5, fontSize: '0.65rem', marginBottom: '0.2rem' }}>CARD HOLDER</div>
                      <div style={{ fontWeight: 600 }}>{userData ? userData.email.split('@')[0].toUpperCase() : 'USER'}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.5, fontSize: '0.65rem', marginBottom: '0.2rem' }}>EXPIRES</div>
                      <div style={{ fontWeight: 600 }}>{cards.length > 0 ? cards[0].expiry : "00/00"}</div>
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
