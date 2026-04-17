import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
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
  LayoutDashboard,
  Activity,
  ExternalLink,
  Send,
  Repeat,
  RefreshCcw,
  SmartphoneIcon
} from 'lucide-react';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';
import VaultsDashboard from './VaultsDashboard';
import BillsDashboard from './BillsDashboard';
import AiAdvisor from './AiAdvisor';
import PayoutModal from './PayoutModal';
import SwapModal from './SwapModal';

import BalanceCard from './components/BalanceCard';
import WalletRailItem from './components/WalletRailItem';
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

const IndividualDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [uRes, txRes, cRes] = await Promise.all([
        fetch('https://paypee-api-kmhv.onrender.com/api/users/me', { headers }),
        fetch('https://paypee-api-kmhv.onrender.com/api/transactions', { headers }),
        fetch('https://paypee-api-kmhv.onrender.com/api/cards', { headers })
      ]);

      const uData = await uRes.json();
      const txData = await txRes.json();
      const cData = await cRes.json();

      if (!uData.error) setUserData(uData);
      if (Array.isArray(txData)) setTransactions(txData);
      if (Array.isArray(cData)) setCards(cData);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const generateAccount = async (currency: string, bvn?: string, kycData?: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://paypee-api-kmhv.onrender.com/api/accounts/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({ currency: currency.toUpperCase(), bvn, kycData })
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

  const deleteAccount = async (id: string) => {
     try {
        const response = await fetch(`https://paypee-api-kmhv.onrender.com/api/accounts/${id}`, {
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

  const getWalletBalance = () => {
    const wallet = userData?.wallets?.find((w: any) => w.currency === 'USD');
    return wallet ? parseFloat(wallet.balance).toFixed(2) : "0.00";
  };

  const isVerified = userData?.kycStatus === 'VERIFIED';
  const navigate = (section: string) => {
    const openSections = ['overview', 'settings', 'help'];
    if (!isVerified && !openSections.includes(section)) {
        setActiveSection('kyc_blocked');
        return;
    }
    setActiveSection(section);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <VerificationGate 
        kycStatus={userData?.kycStatus || 'PENDING'} 
        accountType="INDIVIDUAL"
        onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
      />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar - Hidden on Mobile */}
        <aside className="dashboard-aside" style={{ width: '280px', borderRight: '1px solid var(--border)', background: '#0a0f1e', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginBottom: '3rem' }}>
            <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Zap size={20} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Paypee</span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
            <SidebarItem icon={Wallet} label="Smart Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
            <SidebarItem icon={CreditCard} label="Virtual Cards" active={activeSection === 'cards'} onClick={() => navigate('cards')} />
            <SidebarItem icon={History} label="History" active={activeSection === 'history'} onClick={() => navigate('history')} />
            <SidebarItem icon={Send} label="Transfer" active={activeSection === 'transfers'} onClick={() => navigate('transfers')} />
            <SidebarItem icon={Lock} label="Vaults" active={activeSection === 'vaults'} onClick={() => navigate('vaults')} />
            <SidebarItem icon={Zap} label="Bills & Utilities" active={activeSection === 'bills'} onClick={() => navigate('bills')} />
            <SidebarItem icon={Bot} label="AI Advisor" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
            <SidebarItem icon={HelpCircle} label="Help" onClick={() => navigate('help')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
          </div>
        </aside>

        {/* Mobile Navigation Bar */}
        <div className="mobile-nav">
           <div onClick={() => navigate('overview')} style={{ textAlign: 'center', color: activeSection === 'overview' ? 'var(--primary)' : 'var(--text-muted)' }}>
              <LayoutDashboard size={20} />
              <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>Home</div>
           </div>
           <div onClick={() => navigate('wallets')} style={{ textAlign: 'center', color: activeSection === 'wallets' ? 'var(--primary)' : 'var(--text-muted)' }}>
              <Wallet size={20} />
              <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>Wallets</div>
           </div>
           <div onClick={() => setIsPayoutOpen(true)} style={{ textAlign: 'center', background: 'var(--primary)', padding: '10px', borderRadius: '50%', marginTop: '-30px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
              <Send size={24} color="#fff" />
           </div>
           <div onClick={() => navigate('cards')} style={{ textAlign: 'center', color: activeSection === 'cards' ? 'var(--primary)' : 'var(--text-muted)' }}>
              <CreditCard size={20} />
              <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>Cards</div>
           </div>
           <div onClick={() => navigate('ai')} style={{ textAlign: 'center', color: activeSection === 'ai' ? 'var(--primary)' : 'var(--text-muted)' }}>
              <Bot size={20} />
              <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 600 }}>AI</div>
           </div>
        </div>

        <main className="dashboard-main" style={{ flex: 1, padding: '3rem 4rem', paddingBottom: '100px', overflowY: 'auto', maxHeight: '100vh', scrollbarWidth: 'none' }}>
          {activeSection === 'kyc_blocked' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account Verification Required</h2>
              <p style={{ color: '#94a3b8', maxWidth: '420px', lineHeight: 1.7 }}>To maintain the highest security standards, please verify your identity to unlock all premium features including Wallets, Cards, and Transfers.</p>
              <button onClick={() => navigate('overview')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer' }}>Return to Overview</button>
            </div>
          )}
          
          {activeSection === 'ai' && <AiAdvisor transactions={transactions} userName={userData?.firstName} />}
          {activeSection === 'settings' && <SettingsView />}
          {activeSection === 'vaults' && <VaultsDashboard />}
          {activeSection === 'wallets' && (
            <div style={{ padding: '0' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>My Bank Accounts</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userData?.wallets?.map((w: any) => {
                    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
                    return (
                      <WalletRailItem 
                        key={w.id}
                        currency={w.currency}
                        symbol={symbols[w.currency] || w.currency}
                        balance={parseFloat(w.balance).toFixed(2)}
                        details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                        userName={`${userData?.firstName} ${userData?.lastName}`}
                        onDelete={() => deleteAccount(w.id)}
                        onSend={() => setIsPayoutOpen(true)}
                        onTopUp={() => alert(`To top up your ${w.currency} wallet, please initiate a transfer to your provisioned account number.`)}
                        onSwap={() => setIsSwapOpen(true)}
                      />
                    );
                  })}
                  <motion.div 
                    whileHover={isVerified ? { scale: 1.01, x: 5 } : {}}
                    onClick={() => {
                      if (!isVerified) {
                        alert("You must complete Identity Verification before provisioning a bank account.");
                      } else {
                        setIsAccountModalOpen(true);
                      }
                    }}
                    style={{ 
                      border: '2px dashed var(--border)', 
                      borderRadius: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem', 
                      padding: '1.25rem 1.5rem', 
                      cursor: isVerified ? 'pointer' : 'not-allowed', 
                      background: 'rgba(255,255,255,0.02)',
                      opacity: isVerified ? 1 : 0.5 
                    }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: '16px', background: isVerified ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {isVerified ? <Plus size={24} color="var(--primary)" /> : <Lock size={20} color="var(--text-muted)" />}
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: isVerified ? 'var(--text-muted)' : '#64748b', display: 'block' }}>Create Bank Account</span>
                      {!isVerified && <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>Verification Required</span>}
                    </div>
                  </motion.div>
               </div>
            </div>
          )}

          {activeSection === 'cards' && (
             <div style={{ padding: '0' }}>
               <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Card Issuing Node</h2>
                 <button style={{ background: isVerified ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: isVerified ? '#fff' : '#64748b', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Plus size={20} /> Issue Secure Card
                 </button>
               </div>
               {cards.length > 0 ? (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                    {cards.map((card, i) => (
                      <div key={i} style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 100%)', padding: '2.5rem', aspectRatio: '1.6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Zap color="#fff" size={28} />
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>PLATINUM_CORE</span>
                           </div>
                           <div style={{ fontSize: 'calc(1rem + 1vw)', fontWeight: 700, letterSpacing: '4px', fontFamily: 'monospace' }}>**** **** **** {card.cardNumber.slice(-4)}</div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                              <div>
                                 <div style={{ opacity: 0.5, fontSize: '0.6rem', marginBottom: '0.2rem' }}>CARD HOLDER</div>
                                 <div style={{ fontWeight: 700 }}>{userData?.firstName?.toUpperCase()} {userData?.lastName?.toUpperCase()}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                 <div style={{ opacity: 0.5, fontSize: '0.6rem', marginBottom: '0.2rem' }}>EXPIRY</div>
                                 <div style={{ fontWeight: 700 }}>{card.expiry}</div>
                              </div>
                           </div>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                           <button style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>Toggle Freeze</button>
                           <button style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>Reveal CVV</button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div style={{ padding: '4rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--border)', borderRadius: '32px', textAlign: 'center' }}>
                    <CreditCard size={60} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Virtual Cards Active</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Issue a virtual USD or NGN card for global online payments.</p>
                    <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700 }}>Get Started</button>
                 </div>
               )}
             </div>
          )}

          {activeSection === 'overview' && (
             <>
               <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                 <div>
                   <div className="mobile-only" style={{ display: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>PERSONAL PROFILE</div>
                   <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Good Morning, {userData?.firstName || 'User'}</h1>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                         <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                         NETWORK_SYNC_ACTIVE
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                         <ShieldCheck size={18} color="var(--primary)" />
                         ENCRYPTION_LOCKED
                      </div>
                   </div>
                 </div>
                 <div className="dashboard-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={22} color="#fff" /></div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{userData?.firstName || 'User'}</div>
                 </div>
               </div>

               <div className="dashboard-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.7fr)', gap: '4rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <section>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Bank Accounts</h2>
                         <button onClick={fetchUserData} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>REFRESH STATUS <RefreshCcw size={14} /></button>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {userData?.wallets?.slice(0, 3).map((w: any) => {
                            const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', NGN: '₦' };
                            return (
                               <WalletRailItem 
                                  key={w.id}
                                  currency={w.currency}
                                  symbol={symbols[w.currency] || w.currency}
                                  balance={parseFloat(w.balance).toFixed(2)}
                                  details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                                  userName={`${userData?.firstName} ${userData?.lastName}`}
                                  onDelete={() => deleteAccount(w.id)}
                                  onSend={() => setIsPayoutOpen(true)}
                                  onTopUp={() => alert(`To top up your ${w.currency} wallet, please initiate a transfer to your provisioned account number.`)}
                                  onSwap={() => setIsSwapOpen(true)}
                                />
                            );
                          })}
                          <motion.div 
                            whileHover={isVerified ? { scale: 1.01, x: 5 } : {}}
                            onClick={() => {
                              if (!isVerified) {
                                alert("You must complete Identity Verification before provisioning a bank account.");
                              } else {
                                setIsAccountModalOpen(true);
                              }
                            }}
                            style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', cursor: isVerified ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.02)', opacity: isVerified ? 1 : 0.5 }}
                          >
                            <div style={{ width: 48, height: 48, borderRadius: '16px', background: isVerified ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {isVerified ? <Plus size={24} color="var(--primary)" /> : <Lock size={20} color="var(--text-muted)" />}
                            </div>
                            <div>
                              <span style={{ fontWeight: 800, color: isVerified ? 'var(--text-muted)' : '#64748b', display: 'block' }}>Create Bank Account</span>
                              {!isVerified && <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>Verification Required</span>}
                            </div>
                          </motion.div>
                       </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Network History</h2>
                         <button onClick={() => navigate('history')} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>VIEW ALL LEDGER</button>
                      </div>
                      <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden' }}>
                        {transactions.length > 0 ? (
                          transactions.slice(0, 5).map((tx, i) => (
                             <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: i === transactions.slice(0, 5).length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                   <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.type === 'DEPOSIT' ? '#10b981' : '#f43f5e' }}>{tx.type === 'DEPOSIT' ? <ArrowDownLeft /> : <ArrowUpRight />}</div>
                                   <div>
                                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tx.desc}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                                   </div>
                                </div>
                                <div style={{ textAlign: 'right', flex: '1 0 auto' }}>
                                   <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{tx.currency} {parseFloat(tx.amount).toFixed(2)}</div>
                                   <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>COMPLETED</div>
                                </div>
                             </div>
                          ))
                        ) : (
                          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Zero activity on network ledger.</div>
                        )}
                      </div>
                    </section>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <section>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Quick Rails</h2>
                      <div style={{ display: 'grid', gap: '1.25rem' }}>
                         {[
                           { icon: <Send size={20} />, label: "Initiate Payout", desc: "Send to bank or crypto", action: () => navigate('transfers') },
                           { icon: <Zap size={20} />, label: "Settlement Gas", desc: "Airtime & Utilities", action: () => navigate('bills') },
                           { icon: <Activity size={20} />, label: "Flow Analysis", desc: "Export ledger logs", action: () => navigate('history') }
                         ].map((rail, i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }} 
                             onClick={rail.action}
                             style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', gap: '1.5rem', alignItems: 'center', cursor: 'pointer' }}
                           >
                              <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{rail.icon}</div>
                              <div>
                                 <div style={{ fontWeight: 800, fontSize: '1rem' }}>{rail.label}</div>
                                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rail.desc}</div>
                              </div>
                           </motion.div>
                         ))}
                      </div>
                    </section>

                    <section>
                       <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Cards</h2>
                       <div style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center' }}>
                          <CreditCard size={48} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                          <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Card Hub Empty</h4>
                          <button onClick={() => navigate('cards')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, marginTop: '1rem' }}>Get Secure Card</button>
                       </div>
                    </section>
                  </div>
               </div>
             </>
          )}

          {activeSection === 'history' && (
            <div style={{ padding: '0' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Full Network History</h2>
              <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden' }}>
                 {transactions.length > 0 ? (
                    transactions.map((tx, i) => (
                      <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.03)', gap: '1rem' }}>
                         <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.type === 'DEPOSIT' ? '#10b981' : '#f43f5e' }}>{tx.type === 'DEPOSIT' ? <ArrowDownLeft /> : <ArrowUpRight />}</div>
                            <div>
                               <div style={{ fontWeight: 700, fontSize: '1rem' }}>{tx.desc}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleString()}</div>
                            </div>
                         </div>
                         <div style={{ textAlign: 'right', flex: '1 0 auto' }}>
                           <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{tx.currency} {parseFloat(tx.amount).toFixed(2)}</div>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{tx.reference}</div>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</div>
                 )}
              </div>
            </div>
          )}
        </main>
      </div>
      <PayoutModal 
        isOpen={isPayoutOpen} 
        onClose={() => setIsPayoutOpen(false)} 
        onSuccess={fetchUserData} 
        wallets={userData?.wallets || []} 
      />
      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={generateAccount} 
        isProcessing={isGenerating} 
        existingCurrencies={userData?.wallets?.map((w: any) => w.currency) || []}
      />
      <SwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        onSuccess={fetchUserData}
        wallets={userData?.wallets || []}
      />
    </div>
  );
};

export default IndividualDashboard;
