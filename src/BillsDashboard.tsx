import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Tv, 
  Trophy, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const BillCategory = ({ icon: Icon, name, active, onClick }: any) => (
  <motion.div 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{ 
      padding: '1.5rem', 
      background: active ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
      border: '1px solid #1e293b', 
      borderRadius: '20px', 
      textAlign: 'center', 
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: active ? '#fff' : 'inherit'
    }}
  >
     <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <Icon size={24} />
     </div>
     <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{name}</div>
  </motion.div>
);

const BillsDashboard = () => {
  const [category, setCategory] = useState('AIRTIME');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const providers: Record<string, any[]> = {
     AIRTIME: [
        { id: '1', name: 'MTN Nigeria', icon: <Smartphone color="#facc15" /> },
        { id: '2', name: 'Airtel Nigeria', icon: <Smartphone color="#ef4444" /> },
        { id: '3', name: 'Glo Nigeria', icon: <Smartphone color="#10b981" /> }
     ],
     UTILITY: [
        { id: '10', name: 'EKEDC (Lagos)', icon: <Activity color="#6366f1" /> },
        { id: '11', name: 'IKEDC (Lagos)', icon: <Activity color="#6366f1" /> }
     ],
     CABLE: [
        { id: '20', name: 'DSTV Nigeria', icon: <Tv color="#3b82f6" /> },
        { id: '21', name: 'GOTV Nigeria', icon: <Tv color="#3b82f6" /> }
     ],
     BETTING: [
        { id: '30', name: 'Bet9ja', icon: <Trophy color="#22c55e" /> },
        { id: '31', name: 'SportyBet', icon: <Trophy color="#ef4444" /> }
     ]
  };

  return (
    <div style={{ padding: '1rem' }}>
       <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Bills & Utilities</h1>
          <p style={{ color: '#64748b' }}>Settle airtime, data, and utilities instantly from your Paypee balance.</p>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
          <BillCategory icon={Smartphone} name="Airtime & Data" active={category === 'AIRTIME'} onClick={() => setCategory('AIRTIME')} />
          <BillCategory icon={Activity} name="Electricity" active={category === 'UTILITY'} onClick={() => setCategory('UTILITY')} />
          <BillCategory icon={Tv} name="Cable TV" active={category === 'CABLE'} onClick={() => setCategory('CABLE')} />
          <BillCategory icon={Trophy} name="Betting" active={category === 'BETTING'} onClick={() => setCategory('BETTING')} />
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
          <div>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Choose Provider</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {providers[category].map(p => (
                   <motion.div 
                      key={p.id}
                      onClick={() => setSelectedProvider(p)}
                      style={{ 
                         display: 'flex', 
                         justifyContent: 'space-between', 
                         alignItems: 'center', 
                         padding: '1.5rem', 
                         background: 'rgba(255,255,255,0.02)', 
                         border: `1px solid ${selectedProvider?.id === p.id ? 'var(--primary)' : '#1e293b'}`, 
                         borderRadius: '20px',
                         cursor: 'pointer'
                      }}
                   >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ width: 40, height: 40, background: '#0f172a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.icon}
                         </div>
                         <div style={{ fontWeight: 700 }}>{p.name}</div>
                      </div>
                      <ChevronRight size={18} color="#475569" />
                   </motion.div>
                ))}
             </div>
          </div>

          <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '32px', padding: '2rem' }}>
             {selectedProvider ? (
                <>
                   <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <div style={{ width: 64, height: 64, background: '#0f172a', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                         {selectedProvider.icon}
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedProvider.name}</h4>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                         <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>CUSTOMER IDENTIFIER</label>
                         <input placeholder="Phone / Account No." style={{ width: '100%', background: 'transparent', border: '1px solid #1e293b', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none' }} />
                      </div>
                      <div>
                         <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem' }}>AMOUNT</label>
                         <input placeholder="0.00" type="number" style={{ width: '100%', background: 'transparent', border: '1px solid #1e293b', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none' }} />
                      </div>
                      <button style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', marginTop: '1rem' }}>
                         Pay Bill
                      </button>
                   </div>
                </>
             ) : (
                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#475569' }}>
                   <Smartphone size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                   <div style={{ fontWeight: 700 }}>Select a provider<br />to continue</div>
                </div>
             )}
          </div>
       </div>

       <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ color: 'var(--primary)' }}><ShieldCheck size={32} /></div>
          <div>
             <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Verified Settlement</div>
             <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>All bill payments are finalized in real-time via our primary financial grid.</p>
          </div>
       </div>
    </div>
  );
};

export default BillsDashboard;
