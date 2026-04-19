import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Fingerprint, 
  Lock, 
  User, 
  Bell, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle,
  Mail,
  LogOut,
  CreditCard
} from 'lucide-react';

const SettingsView = ({ initialTab = 'profile' }: { initialTab?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'profile', label: 'Profile details', icon: User },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'cards', label: 'Payment Methods', icon: CreditCard }
  ];

  return (
    <div style={{ display: 'flex', gap: '3rem', height: '100%' }}>
      {/* Settings Navigation */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.9rem 1rem',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '12px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', background: 'transparent', color: '#f43f5e', border: 'none', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', width: '100%' }}>
             <LogOut size={18} /> Log out on all devices
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Security & Access</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your password, two-factor authentication, and connected devices.</p>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <ShieldCheck size={14} /> HIGH SECURITY
              </div>
            </div>

            {/* 2FA Section */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Smartphone size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure your account with an authenticator app.</div>
                    </div>
                 </div>
                 <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Manage</button>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
                  <CheckCircle2 size={16} /> Enabled via Google Authenticator
               </div>
            </div>

            {/* Biometric Section */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Fingerprint size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Biometric Login (WebAuthn)</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use TouchID or FaceID for faster logins on this device.</div>
                    </div>
                 </div>
                 <div className="toggle-switch active" style={{ width: 40, height: 22, background: 'var(--primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                 </div>
               </div>
            </div>

            {/* Password Management */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(0,0,0,0.2)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Key size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Password</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last changed 3 months ago</div>
                    </div>
                 </div>
                 <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Change</button>
               </div>
            </div>

            {/* Connected Devices */}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Sessions</h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                  <div>
                     <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>MacBook Pro (macOS)</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lagos, Nigeria • Chrome Browser</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>CURRENT DEVICE</div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(0,0,0,0.1)' }}>
                  <div>
                     <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>iPhone 14 Pro (iOS)</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>London, UK • Paypee App</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: '#f43f5e', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Revoke</button>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Profile Details</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Update your personal information and contact details.</p>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--accent)' }} />
                <div>
                   <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Upload new picture</button>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At least 800x800 px recommended. JPG or PNG.</div>
                </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>First Name</label>
                   <input type="text" defaultValue="Sarah" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Last Name</label>
                   <input type="text" defaultValue="Connor" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                </div>
             </div>
             <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" defaultValue="sarah.c@techstream.io" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
             </div>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem' }}>Cancel</button>
                <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Save Changes</button>
             </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Notification Preferences</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose what alerts you want to receive and how.</p>
             </div>
             <div style={{ border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                {[
                  { title: "Successful Settlements", desc: "Get notified when a settlement arrives in your account." },
                  { title: "Failed Transactions", desc: "Immediate alerts for any declined or failed payments." },
                  { title: "New Login Alerts", desc: "Security alerts when your account is accessed from a new device." }
                ].map((item, idx) => (
                   <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: idx === 2 ? 'none' : '1px solid var(--border)' }}>
                      <div>
                         <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{item.title}</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                      <div className="toggle-switch active" style={{ width: 40, height: 22, background: 'var(--primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                         <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'cards' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Payment Methods</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your saved cards and bank accounts.</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>+ Add New</button>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', fontStyle: 'italic' }}>VISA</div>
                      <ShieldCheck size={20} color="var(--primary)" />
                   </div>
                   <div style={{ fontSize: '1.25rem', letterSpacing: '2px', marginBottom: '1rem' }}>**** **** **** 4242</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <span>Sarah C.</span>
                      <span>12/28</span>
                   </div>
                   <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}><CreditCard size={100} /></div>
                </div>
             </div>
          </motion.div>
        )}

        {/* Decorative flair */}
        <ShieldCheck size={200} color="var(--primary)" style={{ position: 'absolute', bottom: '-50px', right: '-50px', opacity: 0.05, filter: 'blur(2px)' }} />
      </div>
    </div>
  );
};

export default SettingsView;
