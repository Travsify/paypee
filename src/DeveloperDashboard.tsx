import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import SettingsView from './SettingsView';
import VerificationGate from './VerificationGate';
import AiAdvisor from './AiAdvisor';
import AccountCreationModal from './AccountCreationModal';

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

  const fetchUserData = async () => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [uData, keysData, txData] = await Promise.all([
        fetch('https://paypee-api.onrender.com/api/users/me', { headers }).then(res => res.json()),
        fetch('https://paypee-api.onrender.com/api/apikeys', { headers }).then(res => res.json()),
        fetch('https://paypee-api.onrender.com/api/transactions', { headers }).then(res => res.json())
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

  const isVerified = userData?.kycStatus === 'VERIFIED';

  const navigate = (section: string) => {
    const openSections = ['overview', 'settings', 'support', 'docs'];
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
        accountType="DEVELOPER" 
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
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', margin: '0 -0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', marginBottom: '3rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>PAYPEE <span style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>DEV</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => navigate('overview')} />
          <SidebarItem icon={Wallet} label="Accounts" active={activeSection === 'wallets'} onClick={() => navigate('wallets')} />
          <SidebarItem icon={History} label="Transactions" active={activeSection === 'history'} onClick={() => navigate('history')} />
          <SidebarItem icon={Key} label="API Keys" active={activeSection === 'keys'} onClick={() => navigate('keys')} />
          <SidebarItem icon={Webhook} label="Webhooks" active={activeSection === 'webhooks'} onClick={() => navigate('webhooks')} />
          <SidebarItem icon={Activity} label="Traffic Logs" active={activeSection === 'logs'} onClick={() => navigate('logs')} />
          <SidebarItem icon={Bot} label="AI Advisor" active={activeSection === 'ai'} onClick={() => navigate('ai')} />
          <SidebarItem icon={FileJson} label="API Docs" active={activeSection === 'docs'} onClick={() => navigate('docs')} />
          <SidebarItem icon={ShieldCheck} label="Security" active={activeSection === 'security'} onClick={() => navigate('security')} />
          <SidebarItem icon={HelpCircle} label="Support" active={activeSection === 'support'} onClick={() => navigate('support')} />
        </nav>
      </div>

        <div style={{ marginTop: 'auto' }}>
          <SidebarItem icon={Settings} label="Project Settings" active={activeSection === 'settings'} onClick={() => navigate('settings')} />
          <SidebarItem icon={LogOut} label="Sign Out" onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          {activeSection === 'kyc_blocked' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', textAlign: 'center', gap: '1.5rem' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                  <ShieldCheck size={40} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account Verification Required</h2>
                <p style={{ color: '#64748b', maxWidth: '420px', lineHeight: 1.7 }}>
                  This feature is locked until your developer account is verified. Complete your KYC/KYB to unlock live API keys, Webhooks, Traffic Logs, and more.
                </p>
                <button
                  onClick={() => setActiveSection('overview')}
                  style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
                >
                  Return to Overview
                </button>
              </div>
         ) : activeSection === 'settings' ? (
           <SettingsView />
         ) : activeSection === 'ai' ? (
           <AiAdvisor transactions={transactions} userName={userData?.firstName || 'Developer'} />
         ) : activeSection === 'wallets' ? (
           <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Treasury Accounts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {userData?.wallets?.map((w: any) => {
                  const details = w.metadata ? (typeof w.metadata === 'string' ? JSON.parse(w.metadata) : w.metadata) : {};
                  return (
                    <div key={w.id} style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '2px' }}>{w.currency} SETTLEMENT RAIL</div>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800 }}>LIVE_NODE</div>
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>{w.currency === 'USD' ? '$' : w.currency === 'NGN' ? '₦' : w.currency === 'EUR' ? '€' : '£'}{parseFloat(w.balance).toFixed(2)}</div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ fontSize: '0.55rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 800 }}>Account Reference</div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: '#6366f1' }}>{details.iban || details.accountNumber || 'PROVISIONING...'}</div>
                      </div>
                    </div>
                  );
                })}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setIsAccountModalOpen(true)}
                  style={{ border: '2px dashed var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '180px' }}
                >
                  <Plus size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Provision Account</span>
                </motion.div>
              </div>
            </div>
         ) : activeSection === 'history' ? (
           <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Transaction Tokens</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {transactions.length === 0 ? (
                   <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No API transactions logged yet.</div>
                ) : (
                  transactions.map((tx, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                      style={{ background: 'rgba(255,255,255,0.015)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{tx.desc}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'monospace' }}>TX_REF: {tx.reference}</div>
                          </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>${tx.amount}</div>
                          <div style={{ fontSize: '0.7rem', color: tx.status === 'COMPLETED' ? '#10b981' : '#f59e0b', fontWeight: 800, marginTop: '0.2rem' }}>{tx.status}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
         ) : activeSection === 'keys' ? (
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>API Authentication Keys</h2>
                <button 
                  onClick={() => {
                    if (userData?.kycStatus !== 'VERIFIED') {
                      alert('Developer KYB Verification required to access Production API Keys.');
                    }
                  }}
                  style={{ 
                    background: userData?.kycStatus === 'VERIFIED' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                    color: userData?.kycStatus === 'VERIFIED' ? '#fff' : '#64748b', 
                    border: 'none', 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: '14px', 
                    fontWeight: 600, 
                    cursor: userData?.kycStatus === 'VERIFIED' ? 'pointer' : 'not-allowed' 
                  }}
                >
                  {userData?.kycStatus === 'VERIFIED' ? 'Generate New KeyPair' : 'Verify to Unlock Keys'}
                </button>
              </div>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <APIKeyCard label="Primary Secret Key" keyVal={apiKeys.length > 0 ? apiKeys[0].key : "sk_live_hidden_example"} isLive={mode === 'live'} />
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Restricted Keys</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Create keys with scoped permissions for specific features like Card Issuing or Payouts only.</p>
                  <div style={{ textDecoration: 'none' }}>
                   <button 
                     onClick={() => window.location.href = '#'}
                     style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                   >
                      <Globe size={18} /> Public Docs
                   </button>
                 </div>
                </div>
              </div>
            </div>
         ) : activeSection === 'webhooks' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Webhook Management</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: 600 }}>LISTENER URL</label>
                   <input type="text" placeholder="https://your-server.com/paypee-webhook" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none' }} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>EVENT SUBSCRIPTIONS</label>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                     {['transfer.success', 'transfer.failed', 'card.created', 'card.charged', 'wallet.funded', 'kyc.updated'].map((e, idx) => (
                       <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                         <input type="checkbox" defaultChecked={idx < 3} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                         <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{e}</span>
                       </div>
                     ))}
                   </div>
                </div>
                <button style={{ marginTop: '2.5rem', width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Save Webhook Configuration</button>
              </div>
            </div>
         ) : activeSection === 'logs' ? (
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Traffic Logs</h2>
              <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--primary)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>All Events</div>
                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Errors</div>
                  </div>
                  <Search size={18} color="var(--text-muted)" />
                </div>
                <div style={{ padding: '1rem' }}>
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', flex: 2 }}>
                           <span style={{ color: i % 3 === 0 ? '#f43f5e' : '#10b981', fontWeight: 800 }}>{i % 3 === 0 ? '400' : '200'}</span>
                           <span style={{ fontWeight: 700 }}>POST</span>
                           <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>/v1/payouts/execute</span>
                        </div>
                        <div style={{ flex: 1, color: 'var(--text-muted)' }}>{20 + i}ms</div>
                        <div style={{ flex: 1, textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>2 mins ago</div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
         ) : activeSection === 'docs' ? (
            <div style={{ padding: '1rem' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Integration SDKs</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                 {[
                   { name: 'Node.js SDK', version: 'v2.4.1', color: '#68a063' },
                   { name: 'Python SDK', version: 'v1.12.0', color: '#3776ab' },
                   { name: 'Ruby Gem', version: 'v0.9.4', color: '#cc342d' },
                   { name: 'Go Module', version: 'v1.0.1', color: '#00add8' }
                 ].map((sdk, i) => (
                   <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '24px' }}>
                     <div style={{ width: '50px', height: '50px', background: sdk.color + '22', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sdk.color }}>
                       <Cpu size={28} />
                     </div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{sdk.name}</h3>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Latest Version: {sdk.version}</div>
                     <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem', borderRadius: '12px', fontWeight: 600 }}>Install via CLI</button>
                   </div>
                 ))}
               </div>
            </div>
         ) : activeSection === 'support' ? (
            <div style={{ padding: '1rem', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Developer Support</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>Direct access to our infrastructure engineering team. Please include your Project ID and endpoint details.</p>
                <textarea 
                  placeholder="Describe the integration issue..." 
                  style={{ width: '100%', height: '180px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', color: '#fff', outline: 'none', marginBottom: '1.5rem', resize: 'none' }}
                />
                <button 
                  onClick={() => { alert('Dev Support Ticket Created! Our engineers will review your request.'); setActiveSection('overview'); }}
                  style={{ width: '100%', padding: '1.2rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Create Engineer Ticket
                </button>
              </div>
            </div>
         ) : (
           <>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Developer Dashboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Project: <span style={{ color: '#fff', fontWeight: 600 }}>TechStream_Global_App</span> • ID: <span style={{ fontFamily: 'monospace' }}>prj_9823h_00x</span></p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem', borderRadius: '99px', display: 'flex', border: '1px solid var(--border)' }}>
                  <button onClick={() => setMode('sandbox')} style={{ background: mode === 'sandbox' ? 'var(--primary)' : 'transparent', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '99px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>SANDBOX</button>
                  <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#10b981' : 'transparent', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '99px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>LIVE</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                   <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code2 size={18} /></div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userData?.firstName || (userData ? userData.email.split('@')[0] : 'Dev_Admin')}</div>
                </div>
              </div>
            </header>

            {/* API Keys Section */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>API Access Keys</h2>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Roll All Keys</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 {apiKeys.filter(k => k.isLive === (mode === 'live')).length > 0 ? apiKeys.filter(k => k.isLive === (mode === 'live')).map((k, i) => (
                    <APIKeyCard key={i} label={`API Key (${k.id.slice(-4)})`} keyVal={k.key} isLive={k.isLive} />
                 )) : (
                    <div style={{ gridColumn: 'span 2', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px' }}>No keys active for {mode} mode.</div>
                 )}
              </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
               {/* Webhook Configuration */}
               <section>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Webhooks</h2>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem' }}>
                     <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>ENDPOINT URL</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <input type="text" value="https://api.techstream.io/webhooks/paypee" readOnly style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', fontSize: '0.9rem' }} />
                           <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 1.5rem', fontWeight: 600 }}>Update</button>
                        </div>
                     </div>
                     
                     <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>SUBSCRIBED EVENTS</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                           {['transfer.succeded', 'card.created', 'wallet.funded', 'kyb.approved', 'payout.initiated'].map((e, idx) => (
                              <div key={idx} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                 <Check size={14} /> {e}
                              </div>
                           ))}
                           <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Add Event</div>
                        </div>
                     </div>
                     
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>Active</span></div>
                        <div style={{ color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>View Recent Deliveries <ChevronRight size={16} /></div>
                     </div>
                  </div>
               </section>

               {/* SDK & Resources */}
               <section>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Resources</h2>
                  <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}><Zap size={20} /></div>
                        <div style={{ fontWeight: 700 }}>Sandbox Guidelines</div>
                     </div>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Use card number <span style={{ color: '#fff', fontWeight: 600 }}>4242 4242...</span> to simulate success. Use <span style={{ color: '#fff', fontWeight: 600 }}>5105...</span> to simulate decline.</p>
                     <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--primary)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center', cursor: 'pointer' }}>Read Full Guide</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     {[
                       { label: 'Node.js SDK', icon: <ExternalLink size={16} /> },
                       { label: 'Python Library', icon: <ExternalLink size={16} /> },
                       { label: 'Go Client', icon: <ExternalLink size={16} /> },
                       { label: 'Postman Collection', icon: <Database size={16} /> }
                     ].map((r, i) => (
                        <motion.div key={i} whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{r.label}</span>
                           <span style={{ color: 'var(--text-muted)' }}>{r.icon}</span>
                        </motion.div>
                     ))}
                  </div>
               </section>
            </div>

            {/* API Activity Log */}
            <section style={{ marginTop: '3rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Last 24h API Activity</h2>
               <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ flex: 1 }}>STATUS</div>
                     <div style={{ flex: 2 }}>ENDPOINT</div>
                     <div style={{ flex: 1 }}>LATENCY</div>
                     <div style={{ flex: 1, textAlign: 'right' }}>TIMESTAMP</div>
                  </div>
                  {[
                    { status: 200, method: 'POST', endpoint: '/v1/wallets/create', latency: '142ms', time: '12:45:01' },
                    { status: 200, method: 'GET', endpoint: '/v1/balance/total', latency: '45ms', time: '12:44:58' },
                    { status: 400, method: 'POST', endpoint: '/v1/cards/issue', latency: '89ms', time: '12:43:12' },
                    { status: 201, method: 'POST', endpoint: '/v1/transfers', latency: '210ms', time: '12:40:05' }
                  ].map((log, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 1.5rem', fontSize: '0.85rem', borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.status >= 400 ? '#f43f5e' : '#10b981' }} />
                           <span style={{ fontWeight: 700, color: log.status >= 400 ? '#f43f5e' : '#10b981' }}>{log.status}</span>
                        </div>
                        <div style={{ flex: 2, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                           <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)' }}>{log.method}</span>
                           <span style={{ fontFamily: 'monospace', opacity: 0.8 }}>{log.endpoint}</span>
                        </div>
                        <div style={{ flex: 1, color: 'var(--text-muted)' }}>{log.latency}</div>
                        <div style={{ flex: 1, textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{log.time}</div>
                     </div>
                  ))}
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

export default DeveloperDashboard;
