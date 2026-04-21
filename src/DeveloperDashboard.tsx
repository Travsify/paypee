import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Key, 
  Activity, 
  Webhook, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Copy, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldCheck, 
  Zap,
  Code2,
  Database,
  Search,
  ChevronRight,
  ExternalLink,
  Cpu,
  LayoutDashboard,
  FileJson,
  Link,
  Globe,
  Wallet,
  Bot,
  Plus,
  History,
  RefreshCcw,
  Lock
} from 'lucide-react';
import { API_BASE } from './config';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';
import AiAdvisor from './AiAdvisor';
import AccountCreationModal from './AccountCreationModal';
import BalanceCard from './components/BalanceCard';

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

const APIKeyCard = ({ label, keyVal, isLive }: { label: string, keyVal: string, isLive: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          padding: '0.2rem 0.6rem', 
          borderRadius: '6px', 
          background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          color: isLive ? '#10b981' : '#f59e0b'
        }}>{isLive ? 'LIVE' : 'SANDBOX'}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ 
          flex: 1, 
          background: 'rgba(0,0,0,0.3)', 
          padding: '0.8rem 1rem', 
          borderRadius: '12px', 
          fontFamily: 'monospace', 
          fontSize: '0.9rem', 
          color: visible ? '#fff' : 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {visible ? keyVal : '••••••••••••••••••••••••••••••••'}
        </div>
        <button onClick={() => setVisible(!visible)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer', color: '#fff' }}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button onClick={handleCopy} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer', color: copied ? '#10b981' : '#fff' }}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
};

const DeveloperDashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [mode, setMode] = useState<'sandbox' | 'live'>('sandbox');
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [uData, keysData, txData] = await Promise.all([
        fetch(`${API_BASE}/api/users/me`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/apikeys`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/transactions`, { headers }).then(res => res.json())
      ]);
      if(!uData.error) setUserData(uData);
      if(Array.isArray(keysData)) setApiKeys(keysData);
      if(Array.isArray(txData)) setTransactions(txData);
    } catch (err) {
      console.error('Failed to fetch developer data:', err);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const generateAccount = async (currency: string) => {
    setIsGenerating(true);
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/accounts/provision`, {
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
        alert(err.error || 'Failed to generate staging account.');
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
           alert(err.error || 'Failed to delete staging account.');
        }
     } catch (err) {
        console.error('Delete account error:', err);
     }
  };

  const isVerified = userData?.kycStatus === 'VERIFIED';

  const navigate = (section: string) => {
    const publicSections = ['overview', 'settings', 'docs'];
    if (!isVerified && !publicSections.includes(section)) {
        setActiveSection('blocked');
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
               <Code2 size={20} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Paypee <span style={{ color: 'var(--primary)', fontSize: '0.6rem', verticalAlign: 'top', marginLeft: '2px' }}>DEV</span></span>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
             <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
             <SidebarItem icon={Wallet} label="Test Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
             <SidebarItem icon={Key} label="API Keys" active={activeSection === 'keys'} onClick={() => navigate('keys')} />
             <SidebarItem icon={Webhook} label="Webhooks" active={activeSection === 'webhooks'} onClick={() => navigate('webhooks')} />
             <SidebarItem icon={Activity} label="Traffic" active={activeSection === 'traffic'} onClick={() => navigate('traffic')} />
             <SidebarItem icon={Database} label="Logs" active={activeSection === 'logs'} onClick={() => navigate('logs')} />
             <SidebarItem icon={BookOpen} label="Docs" active={activeSection === 'docs'} onClick={() => navigate('docs')} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1.5rem' }} className="desktop-only">
            <SidebarItem icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
            <SidebarItem icon={HelpCircle} label="API Support" onClick={() => navigate('help')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={onLogout} />
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
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
          <MobileNavButton icon={LayoutDashboard} label="Home" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
          <MobileNavButton icon={Wallet} label="Wallets" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
          <MobileNavButton icon={BookOpen} label="Docs" active={activeSection === 'docs'} onClick={() => navigate('docs')} />
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
                  <SidebarItem icon={Key} label="API Keys" active={activeSection === 'keys'} onClick={() => { navigate('keys'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Webhook} label="Webhooks" active={activeSection === 'webhooks'} onClick={() => { navigate('webhooks'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Activity} label="Traffic" active={activeSection === 'traffic'} onClick={() => { navigate('traffic'); setShowMobileMenu(false); }} />
                  <SidebarItem icon={Database} label="Logs" active={activeSection === 'logs'} onClick={() => { navigate('logs'); setShowMobileMenu(false); }} />
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
              accountType="DEVELOPER"
              onStatusChange={(status) => setUserData((prev: any) => ({ ...prev, kycStatus: status }))}
            />
          )}
          {activeSection === 'blocked' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', minHeight: '60vh' }}>
              <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2rem' }}><Cpu size={40} /></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Developer Verification Required</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6, marginBottom: '2.5rem' }}>To access live API keys and production wallets, you need to complete identity verification.</p>
        <button onClick={() => navigate('overview')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Return Home</button>
            </div>
          )}

          {activeSection === 'wallets' && (
             <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Test Wallets</h2>
                <div className="balance-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                   {userData?.wallets?.map((w: any) => {
                      const symbols: any = { USD: '$', EUR: '€', NGN: '₦', GBP: '£', BTC: '₿' };
                      const gradients: any = {
                        USD: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        NGN: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        EUR: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                      };
                      return (
                        <BalanceCard 
                          key={w.id}
                          currency={w.currency}
                          symbol={symbols[w.currency] || w.currency}
                          amount={parseFloat(w.balance).toFixed(2)}
                          gradient={gradients[w.currency] || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"}
                          details={w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {}}
                          userName={userData?.firstName + " (DEV)"}
                          type="DEVELOPER"
                          onDelete={deleteAccount}
                        />
                      );
                   })}
                   <motion.div 
                     whileHover={isVerified ? { scale: 1.02, y: -5 } : {}}
                      onClick={() => {
                        if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
                        else { setIsAccountModalOpen(true); }
                      }}
                      style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: isVerified ? 'pointer' : 'not-allowed', minHeight: '200px', opacity: isVerified ? 1 : 0.5 }}
                  >
                     <Plus size={40} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                     <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Add Test Wallet</span>
                  </motion.div>
                </div>
             </div>
          )}

          {activeSection === 'overview' && (
            <>
              <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <div className="mobile-only" style={{ display: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>DEVELOPER CONSOLE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                     <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Dashboard</h1>
                     <div style={{ padding: '0.3rem 0.8rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>V2.1.0</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}><div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} /> LIVE</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}><Terminal size={14} /> Latency: 42ms</div>
                  </div>
                </div>
                <div className="dashboard-header-right" style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '0.4rem', display: 'flex', gap: '0.2rem' }}>
                      <button onClick={() => setMode('sandbox')} style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: mode === 'sandbox' ? 'var(--primary)' : 'transparent', color: mode === 'sandbox' ? '#fff' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>SANDBOX</button>
                      <button onClick={() => setMode('live')} style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: mode === 'live' ? 'var(--primary)' : 'transparent', color: mode === 'live' ? '#fff' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>LIVE CORE</button>
                   </div>
                </div>
              </div>

              <div className="dashboard-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                   <section>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Key size={22} color="var(--primary)" /> API Credentials</h2>
                      <APIKeyCard label="Public API Key" keyVal="pk_live_51MszZESFp9J2vW2x8N8zR3K..." isLive={mode === 'live'} />
                      <APIKeyCard label="Secret API Key" keyVal="sk_live_51MszZESFp9J2vW2xQo9m8L..." isLive={mode === 'live'} />
                      <motion.button whileHover={{ x: 5 }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Rotate all credentials <ChevronRight size={16} /></motion.button>
                   </section>

                   <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={22} color="var(--primary)" /> System Traffic</h2>
                         <button onClick={fetchUserData} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>SNAPSHOT REFRESH</button>
                      </div>
                      <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', overflowX: 'auto' }}>
                         {[
                           { method: 'POST', endpoint: '/v1/payouts', status: 201, time: '2s ago', latency: '156ms' },
                           { method: 'GET', endpoint: '/v1/accounts/NG5546...', status: 200, time: '5s ago', latency: '42ms' },
                           { method: 'POST', endpoint: '/v1/cards/issue', status: 400, time: '12s ago', latency: '210ms' },
                           { method: 'GET', endpoint: '/v1/users/me', status: 200, time: '1m ago', latency: '35ms' },
                         ].map((log, i) => (
                            <div key={i} style={{ display: 'flex', padding: '1.25rem', borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.03)', fontSize: '0.8rem', alignItems: 'center', minWidth: '450px' }}>
                               <div style={{ width: '45px' }}>
                                  <span style={{ fontWeight: 700, color: log.status >= 400 ? '#f43f5e' : '#10b981' }}>{log.status}</span>
                                </div>
                               <div style={{ flex: 2, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)' }}>{log.method}</span>
                                  <span style={{ fontFamily: 'monospace', opacity: 0.8, wordBreak: 'break-all' }}>{log.endpoint}</span>
                               </div>
                               <div style={{ width: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>{log.latency}</div>
                               <div style={{ width: '80px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{log.time}</div>
                            </div>
                         ))}
                      </div>
                   </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                   <section>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Resources</h2>
                      <div className="balance-card-slider no-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                         {[
                           { icon: <BookOpen />, label: "Documentation", color: "var(--primary)" },
                           { icon: <Webhook />, label: "Webhooks", color: "var(--secondary)" },
                           { icon: <Cpu />, label: "SDKs", color: "var(--accent)" },
                           { icon: <FileJson />, label: "API Ref", color: "#64748b" }
                         ].map((item, i) => (
                           <motion.div key={i} whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', textAlign: 'center', cursor: 'pointer' }}>
                              <div style={{ color: item.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.label}</div>
                           </motion.div>
                         ))}
                      </div>
                   </section>

                   <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                         <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Staging Wallets</h2>
                         <button onClick={() => {
                           if (!isVerified) { alert('You must complete Identity Verification before provisioning a staging account.'); }
                           else { setIsAccountModalOpen(true); }
                         }} style={{ background: 'transparent', border: 'none', color: isVerified ? 'var(--primary)' : '#64748b', fontWeight: 700, cursor: isVerified ? 'pointer' : 'not-allowed' }}>{isVerified ? '+ NEW RAIL' : '🔒 VERIFY FIRST'}</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         {userData?.wallets?.slice(0, 3).map((w: any) => (
                           <div key={w.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                {w.currency === 'USD' ? '🇺🇸' : w.currency === 'NGN' ? '🇳🇬' : '🇪🇺'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                 <div style={{ fontSize: '0.9rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.currency} Wallet</div>
                                 <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{JSON.parse(w.metadata || '{}').iban}</div>
                              </div>
                              <div style={{ fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{parseFloat(w.balance).toFixed(2)}</div>
                           </div>
                         ))}
                         {(!userData?.wallets || userData.wallets.length === 0) && (
                            <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No staging rails found.</div>
                         )}
                      </div>
                   </section>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <AccountCreationModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSelect={generateAccount} 
        isProcessing={isGenerating} 
        existingCurrencies={userData?.wallets?.map((w: any) => w.currency) || []}
      />
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

export default DeveloperDashboard;
