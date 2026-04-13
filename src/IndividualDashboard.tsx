import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  Send as SendIcon, 
  History, 
  ShieldCheck, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Zap, 
  ChevronRight, 
  Search, 
  Bell, 
  User, 
  ArrowUpRight, 
  ArrowDownLeft,
  Smartphone,
  Lock,
  Bot,
  LayoutDashboard
} from 'lucide-react';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';
import VaultsDashboard from './VaultsDashboard';
import BillsDashboard from './BillsDashboard';
import AiAdvisor from './AiAdvisor';
import PayoutModal from './PayoutModal';

import AccountCreationModal from './AccountCreationModal';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.div 
    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '0.8rem 1.2rem', 
      borderRadius: '12px', 
      cursor: 'pointer',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? 700 : 500,
      marginBottom: '0.4rem',
      transition: 'all 0.2s'
    }}
  >
    <Icon size={20} />
    <span style={{ fontSize: '0.9rem' }}>{label}</span>
  </motion.div>
);

const BalanceCard = ({ currency, symbol, amount, gradient, details }: { currency: string, symbol: string, amount: string, gradient: string, details?: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={{ 
      padding: '2rem', 
      borderRadius: '24px', 
      background: gradient, 
      color: '#fff', 
      minWidth: '280px',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)'
    }}
  >
    <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
       <Wallet size={150} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.8 }}>{currency} TREASURY NODE</div>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>LIVE</div>
    </div>
    <div style={{ fontSize: '2.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>{symbol}</span>
      {amount}
    </div>
    <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
       <div style={{ fontSize: '0.6rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem', fontWeight: 800 }}>Primary Settlement ID</div>
       <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace', wordBreak: 'break-all' }}>{details?.iban || details?.accountNumber || 'PROVISIONING_NODE...'}</div>
       <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.4rem', fontWeight: 600 }}>{details?.bankName || 'Paypee High-Speed Rail'}</div>
    </div>
    <div className="glow-overlay" />
  </motion.div>
);

const IndividualDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [userRes, txRes, cardRes] = await Promise.all([
        fetch('https://paypee-api.onrender.com/api/users/me', { headers }),
        fetch('https://paypee-api.onrender.com/api/transactions', { headers }),
        fetch('https://paypee-api.onrender.com/api/cards', { headers })
      ]);
      const user = await userRes.json();
      const txData = txRes.ok ? await txRes.json() : [];
      const cardData = cardRes.ok ? await cardRes.json() : [];
      setUserData(user);
      setTransactions(Array.isArray(txData) ? txData : []);
      setCards(Array.isArray(cardData) ? cardData : []);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

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
        alert(err.error || 'Failed to generate account.');
      }
    } catch (err) {
      console.error('Account generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getWalletBalance = () => {
    const wallet = userData?.wallets?.find((w: any) => w.currency === 'USD');
    return wallet ? parseFloat(wallet.balance).toFixed(2) : "0.00";
  };

  const toggleCardFreeze = async (cardId: string) => {
    try {
      const response = await fetch(`https://paypee-api.onrender.com/api/cards/${cardId}/toggle-freeze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchUserData();
      }
    } catch (err) {
      console.error('Failed to toggle freeze:', err);
    }
  };

  const showCardPIN = async (cardId: string) => {
    try {
      const response = await fetch(`https://paypee-api.onrender.com/api/cards/${cardId}/pin`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Your PIN is: ${data.pin}. Please keep it secret.`);
      }
    } catch (err) {
      console.error('Failed to fetch PIN:', err);
    }
  };

  const isVerified = userData?.kycStatus === 'VERIFIED';

  // Block navigation to protected sections until verified
  const navigate = (section: string) => {
    const openSections = ['overview', 'settings', 'support'];
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
        accountType="INDIVIDUAL"
        onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#0a0f1e', borderRight: '1px solid var(--border)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>PAYPEE</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
          <SidebarItem icon={Wallet} label="Accounts" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
          <SidebarItem icon={CreditCard} label="Virtual Cards" active={activeSection === 'cards'} onClick={() => navigate('cards')} />
          <SidebarItem icon={Lock} label="Smart Vaults" active={activeSection === 'vaults'} onClick={() => navigate('vaults')} />
          <SidebarItem icon={Zap} label="Bill Payments" active={activeSection === 'bills'} onClick={() => navigate('bills')} />
          <SidebarItem icon={Bot} label="AI Advisor" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
          <SidebarItem icon={History} label="Transactions" active={activeSection === 'history'} onClick={() => navigate('history')} />
          <SidebarItem icon={ShieldCheck} label="Security" active={activeSection === 'security'} onClick={() => navigate('security')} />
        </div>

        <div>
          <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
          <SidebarItem icon={HelpCircle} label="Support" active={activeSection === 'support'} onClick={() => navigate('support')} />
          <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', position: 'relative' }}>
        {activeSection === 'kyc_blocked' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', textAlign: 'center', gap: '1.5rem' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Verification Required</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', lineHeight: 1.7 }}>
              This feature is locked until your identity is verified. Complete your KYC to unlock full access to all Paypee features including transfers, cards, and vaults.
            </p>
            <button
              onClick={() => setActiveSection('overview')}
              style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
            >
              Return to Overview
            </button>
          </div>
        )}
        {activeSection === 'vaults' && <VaultsDashboard />}
        {activeSection === 'history' && (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Transaction History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {transactions.length === 0 ? (
                   <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found</div>
                ) : (
                  transactions.map((tx, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                      style={{ background: 'rgba(255,255,255,0.015)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <div style={{ padding: '0.75rem', background: tx.type === 'DEPOSIT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: tx.type === 'DEPOSIT' ? '#10b981' : '#f43f5e', borderRadius: '14px' }}>
                            {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{tx.desc}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{tx.date} • {tx.type}</div>
                          </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: tx.type === 'DEPOSIT' ? '#10b981' : '#fff' }}>{tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}</div>
                          <div style={{ fontSize: '0.65rem', color: tx.status === 'COMPLETED' ? '#10b981' : '#f59e0b', fontWeight: 800, marginTop: '0.2rem' }}>{tx.status}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
        )}
        {activeSection === 'support' && (
            <div style={{ padding: '1rem', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Contact Support</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Our global support team is available 24/7 to assist you with account inquiries, transfers, and technical issues.</p>
                <textarea 
                  placeholder="Describe your issue..." 
                  style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none', marginBottom: '1rem', resize: 'none' }}
                />
                <button 
                  onClick={() => { alert('Support ticket created successfully! We will get back to you shortly.'); setActiveSection('overview'); }}
                  style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Submit Ticket
                </button>
              </div>
            </div>
        )}
        {activeSection === 'bills' && <BillsDashboard />}
        {activeSection === 'ai' && <AiAdvisor transactions={transactions} userName={userData?.firstName} />}
        {activeSection === 'settings' && (
            <SettingsView />
        )}
        {activeSection === 'wallets' && (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>My Accounts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {userData?.wallets?.map((w: any) => (
                  <BalanceCard 
                    key={w.id} 
                    currency={w.currency} 
                    symbol={w.currency === 'USD' ? '$' : w.currency === 'NGN' ? '₦' : w.currency === 'EUR' ? '€' : '£'} 
                    amount={parseFloat(w.balance).toFixed(2)} 
                    gradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" 
                    details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                  />
                ))}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    setIsAccountModalOpen(true);
                  }}
                  style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '180px' }}
                >
                  <Plus size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Generate Account</span>
                </motion.div>
              </div>
            </div>
            )}
            {activeSection === 'cards' && (
             <div style={{ padding: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Virtual Cards</h2>
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => {
                     if (userData?.kycStatus !== 'VERIFIED') {
                       alert('KYC Verification required to issue virtual cards.');
                     } else {
                       // Logic for issuing
                     }
                   }}
                   style={{ 
                     background: userData?.kycStatus === 'VERIFIED' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                     color: userData?.kycStatus === 'VERIFIED' ? '#fff' : '#64748b', 
                     border: 'none', 
                     padding: '0.8rem 1.5rem', 
                     borderRadius: '14px', 
                     fontWeight: 600, 
                     cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '0.5rem' 
                   }}
                 >
                   <Plus size={20} /> Issue New Card
                 </motion.button>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                 {cards.map((card, i) => (
                   <div key={i} style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden' }}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                        padding: '2.5rem', 
                        aspectRatio: '1.6 / 1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={24} /></div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>VIRTUAL DEBIT</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', letterSpacing: '4px', fontWeight: 700 }}>
                          **** **** **** {card.cardNumber.slice(-4)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ opacity: 0.5, fontSize: '0.7rem', marginBottom: '0.2rem' }}>CARD HOLDER</div>
                            <div style={{ fontWeight: 600 }}>{userData?.firstName?.toUpperCase()} {userData?.lastName?.toUpperCase()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ opacity: 0.5, fontSize: '0.7rem', marginBottom: '0.2rem' }}>EXPIRY</div>
                            <div style={{ fontWeight: 600 }}>{card.expiry}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ padding: '2rem', display: 'flex', gap: '1rem', background: '#0a0f1e' }}>
                        <button onClick={() => toggleCardFreeze(card.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{card.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}</button>
                        <button onClick={() => showCardPIN(card.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Show PIN</button>
                        <button onClick={() => window.alert('Daily Limit: $' + card.dailyLimit)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Limits</button>
                      </div>

                      <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                               <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Smart Merchant Locking</div>
                               <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Automatically decline high-risk categories</div>
                            </div>
                            <div style={{ width: '40px', height: '22px', background: 'var(--primary)', borderRadius: '11px', padding: '2px', display: 'flex', justifyContent: 'flex-end' }}>
                               <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%' }} />
                            </div>
                         </div>
                         <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['Ads', 'Cloud', 'Travel', 'Gambling'].map(cat => (
                              <div key={cat} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: cat === 'Gambling' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${cat === 'Gambling' ? '#f43f5e' : 'var(--border)'}`, fontSize: '0.7rem', fontWeight: 700, color: cat === 'Gambling' ? '#f43f5e' : '#fff' }}>
                                {cat === 'Gambling' ? 'LOCKED' : cat}
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
            )}
            {activeSection === 'transfers' && (
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
                     onClick={() => {
                       if (userData?.kycStatus !== 'VERIFIED') {
                         alert('Please complete your KYC verification to initiate transfers.');
                       } else {
                         setIsPayoutOpen(true);
                       }
                     }}
                     style={{ 
                       width: '100%', 
                       background: userData?.kycStatus === 'VERIFIED' ? 'var(--primary)' : '#1e293b', 
                       color: userData?.kycStatus === 'VERIFIED' ? '#fff' : '#64748b', 
                       border: 'none', 
                       padding: '1.2rem', 
                       borderRadius: '16px', 
                       fontSize: '1.1rem', 
                       fontWeight: 700, 
                       cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed', 
                       boxShadow: userData?.kycStatus === 'VERIFIED' ? '0 20px 40px -10px rgba(99, 102, 241, 0.4)' : 'none' 
                     }}
                   >
                     {userData?.kycStatus === 'VERIFIED' ? 'Confirm Transfer' : 'Verify Account to Transfer'}
                   </motion.button>
               </div>
            </div>
            )}
            {activeSection === 'security' && (
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
            )}
            {activeSection === 'overview' && (
             <>
               <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                 <div>
                   <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Good Morning, {userData?.firstName || 'User'}</h1>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                         <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                         NETWORK_SYNC_ACTIVE
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                         <ShieldCheck size={16} color="var(--primary)" />
                         ENCRYPTION_LOCKED
                      </div>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid var(--border)' }}>
                       <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{userData?.firstName || 'Profile'}</div>
                       <ChevronRight size={16} opacity={0.3} />
                    </div>
                 </div>
               </header>

               <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.7fr)', gap: '3rem' }}>
                  {/* Left Column: Treasury & History */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <section>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={22} color="var(--primary)" /> Live Nodes</h2>
                         <button onClick={() => setActiveSection('wallets')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>MANAGE_INFRA <ExternalLink size={14} /></button>
                       </div>
                       <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                          {userData?.wallets && userData.wallets.length > 0 ? (
                            userData.wallets.map((w: any) => {
                              const gradients: Record<string, string> = {
                                USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                GBP: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                                NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                              };
                              const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
                              return (
                                <BalanceCard 
                                  key={w.id} 
                                  currency={w.currency} 
                                  symbol={symbols[w.currency] || w.currency} 
                                  amount={parseFloat(w.balance).toFixed(2)} 
                                  gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #334155 100%)"} 
                                  details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                                />
                              );
                            })
                          ) : (
                            <div onClick={() => setIsAccountModalOpen(true)} style={{ width: '100%', padding: '3rem', background: 'rgba(99, 102, 241, 0.03)', border: '2px dashed rgba(99, 102, 241, 0.2)', borderRadius: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                               <div style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}><Plus size={32} /></div>
                               <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Treasury Nodes</h3>
                               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto' }}>Tap here to provision your first high-speed global currency account.</p>
                            </div>
                          )}
                       </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Ledger</h2>
                        <button onClick={() => setActiveSection('history')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>STREAM_VIEW <ChevronRight size={16} /></button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {transactions.length > 0 ? transactions.slice(0, 4).map((tx, i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                             style={{ background: 'rgba(255,255,255,0.015)', padding: '1.2rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                           >
                             <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tx.type === 'DEPOSIT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: tx.type === 'DEPOSIT' ? '#10b981' : '#f43f5e', borderRadius: '14px' }}>
                                   {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                   <div style={{ fontWeight: 800, fontSize: '1rem' }}>{tx.desc}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{tx.date} • {tx.type}</div>
                                </div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: tx.type === 'DEPOSIT' ? '#10b981' : '#fff' }}>{tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>{tx.status}</div>
                             </div>
                           </motion.div>
                        )) : (
                          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px solid var(--border)' }}>
                             <History size={40} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                             <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Zero activity on network ledger.</div>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Virtual Cards & Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                     <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                           <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Virtual Node</h2>
                           <button onClick={() => setActiveSection('cards')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>NEW_ISSUE +</button>
                        </div>
                        {cards.length > 0 ? (
                           <div style={{ 
                             padding: '2rem', 
                             background: 'linear-gradient(135deg, #1e1e2e 0%, #0a0a0f 100%)', 
                             borderRadius: '28px', 
                             border: '1px solid rgba(255,255,255,0.1)',
                             position: 'relative',
                             overflow: 'hidden',
                             aspectRatio: '1.58'
                           }}>
                              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem' }}>
                                 <Zap size={24} color="var(--primary)" />
                              </div>
                              <div style={{ marginTop: '2.5rem', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '4px', fontFamily: 'monospace' }}>•••• •••• •••• {cards[0].cardNumber.slice(-4)}</div>
                              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                 <div>
                                    <div style={{ fontSize: '0.55rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Node Operator</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{userData?.firstName?.toUpperCase()} {userData?.lastName?.toUpperCase()}</div>
                                 </div>
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" style={{ height: 28 }} />
                              </div>
                           </div>
                        ) : (
                           <div onClick={() => setActiveSection('cards')} style={{ padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '32px', textAlign: 'center', cursor: 'pointer' }}>
                              <CreditCard size={40} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                              <div style={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Card Hub Empty</div>
                              <button style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', background: 'transparent', border: 'none' }}>Issue Secure Card</button>
                           </div>
                        )}
                     </section>

                     <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Quick Switch</h2>
                        {[
                          { icon: <Send size={20} />, label: "Initiate Payout", desc: "Send to bank or crypto", action: () => setIsPayoutOpen(true), color: "var(--primary)" },
                          { icon: <Zap size={20} />, label: "Settlement Gas", desc: "Airtime & Utilities", action: () => setActiveSection('bills'), color: "var(--secondary)" },
                          { icon: <History size={20} />, label: "Flow Analysis", desc: "Export ledger logs", action: () => setActiveSection('history'), color: "var(--accent)" }
                        ].map((act, i) => (
                          <motion.button 
                            key={i}
                            whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={act.action}
                            style={{ 
                              width: '100%', 
                              padding: '1.25rem', 
                              background: 'rgba(255,255,255,0.02)', 
                              border: '1px solid var(--border)', 
                              borderRadius: '22px', 
                              color: '#fff', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1.25rem', 
                              cursor: 'pointer',
                              textAlign: 'left'
                            } as any}
                          >
                            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color }}>{act.icon}</div>
                            <div>
                               <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{act.label}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.desc}</div>
                            </div>
                          </motion.button>
                        ))}
                     </section>
                  </div>
               </div>
             </>
            )}
      </main>
      </div>
      <PayoutModal 
        isOpen={isPayoutOpen} 
        onClose={() => setIsPayoutOpen(false)} 
        balance={getWalletBalance()} 
        onSuccess={() => {
          fetchUserData();
        }} 
      />
      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={generateAccount} 
        isProcessing={isGenerating} 
      />
    </div>
  );
};

export default IndividualDashboard;
