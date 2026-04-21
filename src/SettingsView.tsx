import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CreditCard,
  Settings,
  Shield,
  Eye,
  Camera,
  Globe,
  Activity,
  Zap,
  Check
} from 'lucide-react';

const SettingsView = ({ initialTab = 'profile' }: { initialTab?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'profile', label: 'Identity Profile', desc: 'Personal credentials', icon: User },
    { id: 'security', label: 'Security & Access', desc: 'Protocol management', icon: ShieldCheck },
    { id: 'notifications', label: 'Sentinel Alerts', desc: 'Operation updates', icon: Bell },
    { id: 'cards', label: 'Capital Sources', desc: 'Settlement methods', icon: CreditCard }
  ];

  const [toggles, setToggles] = useState({
    biometrics: true,
    settlements: true,
    failedTx: true,
    logins: true
  });

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', gap: '4rem', height: '100%', alignItems: 'flex-start' }}>
      
      {/* Settings Navigation */}
      <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          <Settings size={16} /> System Configuration
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>Preferences</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem 1.5rem',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                borderRadius: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '12px', 
                background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? '0 10px 20px -5px var(--primary-glow)' : 'none'
              }}>
                <tab.icon size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>{tab.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tab.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(244, 63, 94, 0.05)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.1)', borderRadius: '20px', textAlign: 'left', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
             <LogOut size={20} /> Terminate All Sessions
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="premium-card" style={{ flex: 1, padding: '4rem', background: 'rgba(255,255,255,0.01)', position: 'relative', minHeight: '600px' }}>
        
        <AnimatePresence mode="wait">
          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Security & Access</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Manage institutional credentials and encryption protocols.</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '0.6rem 1.25rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                   <Shield size={16} /> SECURE PROTOCOL ACTIVE
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 2FA Section */}
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: 56, height: 56, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Smartphone size={28} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>Multi-Factor Authentication</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Authenticator App verification enabled.</div>
                        </div>
                     </div>
                     <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>Configure</button>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                      <CheckCircle2 size={18} /> Verified via Google Authenticator Protocol
                   </div>
                </div>

                {/* Biometric Section */}
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: 56, height: 56, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Fingerprint size={28} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>Biometric Authorization</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Use FaceID / TouchID for rapid protocol clearance.</div>
                        </div>
                     </div>
                     <div 
                      onClick={() => toggleSwitch('biometrics')}
                      style={{ 
                        width: 52, 
                        height: 28, 
                        background: toggles.biometrics ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                        borderRadius: '20px', 
                        position: 'relative', 
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                     >
                        <motion.div 
                          animate={{ x: toggles.biometrics ? 26 : 4 }}
                          style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} 
                        />
                     </div>
                   </div>
                </div>

                {/* Password Management */}
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Key size={28} />
                        </div>
                        <div>
                           <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>Access Password</div>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Last rotation: 92 days ago. <span style={{ color: 'var(--primary)' }}>Rotation recommended.</span></div>
                        </div>
                     </div>
                     <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>Rotate</button>
                   </div>
                </div>
              </div>

              <div style={{ marginTop: '3.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>Active Session Registry</h4>
                <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', overflow: 'hidden' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                         <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
                         <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>MacBook Pro v14.1 (macOS)</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lagos, Nigeria • 102.89.44.120 • Chrome v121</div>
                         </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 900, letterSpacing: '1px', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>CURRENT TERMINAL</div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 2rem', background: 'transparent' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                         <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                         <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>iPhone 15 Pro (iOS Native)</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>London, UK • 81.102.9.21 • Paypee v2.4.1</div>
                         </div>
                      </div>
                      <button style={{ background: 'transparent', border: 'none', color: '#f43f5e', fontSize: '0.85rem', fontWeight: 900, cursor: 'pointer', padding: '0.5rem 1rem' }}>Terminate</button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                  <div>
                     <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Identity Profile</h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Calibrate your personal credentials and contact matrix.</p>
                  </div>
               </div>
               
               <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '3.5rem', background: 'rgba(255,255,255,0.01)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Profile" style={{ width: 100, height: 100, borderRadius: '32px', background: 'var(--primary)', border: '2px solid var(--accent)', objectFit: 'cover' }} />
                    <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', border: '4px solid #0a0f1e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                       <Camera size={18} />
                    </button>
                  </div>
                  <div>
                     <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Sarah Connor</div>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 800 }}>
                        <CheckCircle2 size={14} /> LEVEL 3 VERIFIED PRO
                     </div>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <label className="form-label">GIVEN NAME</label>
                     <input type="text" defaultValue="Sarah" className="form-input" style={{ fontSize: '1.1rem', fontWeight: 700 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <label className="form-label">FAMILY NAME</label>
                     <input type="text" defaultValue="Connor" className="form-input" style={{ fontSize: '1.1rem', fontWeight: 700 }} />
                  </div>
               </div>
               <div style={{ marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label className="form-label">PRIMARY COMMUNICATION CHANNEL (EMAIL)</label>
                  <div style={{ position: 'relative' }}>
                    <input type="email" defaultValue="sarah.c@techstream.io" className="form-input" style={{ fontSize: '1.1rem', fontWeight: 700, paddingLeft: '3.5rem' }} />
                    <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                  </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem' }}>
                  <button className="btn btn-outline" style={{ padding: '1rem 2.5rem', borderRadius: '18px', fontWeight: 800 }}>Discard</button>
                  <button className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '18px', fontWeight: 900 }}>Save Identity Changes</button>
               </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div style={{ marginBottom: '3.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Sentinel Alerts</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Configure the sensitivity of the Paypee Sentinel monitoring system.</p>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { id: 'settlements', title: "Settlement Liquidity Alerts", desc: "Notification upon successful protocol settlement arrival.", icon: Zap },
                  { id: 'failedTx', title: "Critical Rail Failure Alerts", desc: "Immediate reporting for declined or anomalous transactions.", icon: Activity },
                  { id: 'logins', title: "New Terminal Access Alerts", desc: "Security broadcast when account is accessed from a unique IP.", icon: Globe }
                ].map((item, idx) => (
                   <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <item.icon size={24} />
                         </div>
                         <div>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>{item.title}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.desc}</div>
                         </div>
                      </div>
                      <div 
                        onClick={() => toggleSwitch(item.id as keyof typeof toggles)}
                        style={{ 
                          width: 52, 
                          height: 28, 
                          background: toggles[item.id as keyof typeof toggles] ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                          borderRadius: '20px', 
                          position: 'relative', 
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <motion.div 
                          animate={{ x: toggles[item.id as keyof typeof toggles] ? 26 : 4 }}
                          style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} 
                        />
                     </div>
                   </div>
                ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'cards' && (
            <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                  <div>
                     <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Capital Sources</h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>Manage authorized external settlement channels.</p>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px', fontWeight: 900 }}>+ Add Protocol</button>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    style={{ background: 'linear-gradient(135deg, #1e293b 0%, #020617 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', padding: '2.5rem', position: 'relative', overflow: 'hidden', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                       <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', fontStyle: 'italic', color: '#fff' }}>VISA</div>
                       <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                          <ShieldCheck size={20} />
                       </div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                       <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px', marginBottom: '1.25rem', color: '#fff' }}>•••• •••• •••• 4242</div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>
                          <span>SARAH CONNOR</span>
                          <span>12 / 28</span>
                       </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', opacity: 0.05, transform: 'rotate(-15deg)' }}><CreditCard size={180} /></div>
                  </motion.div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative flair */}
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', opacity: 0.03, pointerEvents: 'none' }}>
           <Settings size={350} />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
