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
  Cpu
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

  React.useEffect(() => {
    const token = localStorage.getItem('paypee_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('https://paypee-api.onrender.com/api/users/me', { headers }).then(res => res.json()),
      fetch('https://paypee-api.onrender.com/api/keys', { headers }).then(res => res.json())
    ]).then(([uData, keysData]) => {
      if(!uData.error) setUserData(uData);
      if(Array.isArray(keysData)) setApiKeys(keysData);
    });
  }, []);

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
          <Terminal size={28} color="var(--primary)" />
          Paypee Dev
        </div>

        <div style={{ flex: 1 }}>
          <SidebarItem icon={Activity} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
          <SidebarItem icon={Key} label="API Keys" active={activeSection === 'apikeys'} onClick={() => setActiveSection('apikeys')} />
          <SidebarItem icon={Webhook} label="Webhooks" active={activeSection === 'webhooks'} onClick={() => setActiveSection('webhooks')} />
          <SidebarItem icon={Database} label="Logs & Events" active={activeSection === 'logs'} onClick={() => setActiveSection('logs')} />
          <SidebarItem icon={BookOpen} label="SDK & Docs" active={activeSection === 'docs'} onClick={() => setActiveSection('docs')} />
        </div>

        <div>
          <SidebarItem icon={Settings} label="Project Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
          <SidebarItem icon={HelpCircle} label="API Support" active={activeSection === 'support'} onClick={() => setActiveSection('support')} />
          <SidebarItem icon={LogOut} label="Sign Out" onClick={onLogout} />
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
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Developer Dashboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Project: <span style={{ color: '#fff', fontWeight: 600 }}>TechStream_Global_App</span> • ID: <span style={{ fontFamily: 'monospace' }}>prj_9823h_00x</span></p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem', borderRadius: '99px', display: 'flex', border: '1px solid var(--border)' }}>
                  <button onClick={() => setMode('sandbox')} style={{ background: mode === 'sandbox' ? 'var(--primary)' : 'transparent', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '99px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>SANDBOX</button>
                  <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#10b981' : 'transparent', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '99px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>LIVE</button>
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                   <Bell size={20} color="var(--text-muted)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                   <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code2 size={18} /></div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userData ? userData.email.split('@')[0] : 'Dev_Admin'}</div>
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
  );
};

export default DeveloperDashboard;
