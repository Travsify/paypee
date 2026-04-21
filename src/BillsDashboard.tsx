import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Tv, 
  Trophy, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Search,
  Wifi,
  CreditCard,
  Droplets,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Wallet
} from 'lucide-react';

const BillCategory = ({ icon: Icon, name, active, onClick }: any) => (
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{ 
      padding: '2.5rem 1.5rem', 
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.01)', 
      border: active ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)', 
      borderRadius: '24px', 
      textAlign: 'center', 
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: active ? '#fff' : 'var(--text-muted)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
     {active && <motion.div layoutId="categoryGlow" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }} />}
     <div style={{ 
       width: 56, 
       height: 56, 
       borderRadius: '16px', 
       background: active ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
       display: 'flex', 
       alignItems: 'center', 
       justifyContent: 'center',
       color: active ? '#fff' : 'var(--text-muted)',
       boxShadow: active ? '0 10px 20px -5px var(--primary-glow)' : 'none',
       position: 'relative',
       zIndex: 2
     }}>
        <Icon size={28} />
     </div>
     <div style={{ fontSize: '0.9rem', fontWeight: 900, position: 'relative', zIndex: 2, letterSpacing: '0.01em' }}>{name}</div>
  </motion.button>
);

const BillsDashboard = () => {
  const [category, setCategory] = useState('AIRTIME');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const providers: Record<string, any[]> = {
     AIRTIME: [
        { id: '1', name: 'MTN Nigeria', icon: <Smartphone color="#facc15" />, desc: 'Airtime & Data Protocol' },
        { id: '2', name: 'Airtel Nigeria', icon: <Smartphone color="#ef4444" />, desc: 'Airtime & Data Protocol' },
        { id: '3', name: 'Glo Nigeria', icon: <Smartphone color="#10b981" />, desc: 'Airtime & Data Protocol' },
        { id: '4', name: '9mobile', icon: <Smartphone color="#10b981" />, desc: 'Airtime & Data Protocol' }
     ],
     UTILITY: [
        { id: '10', name: 'EKEDC (Lagos)', icon: <Zap color="#6366f1" />, desc: 'Electricity Settlement' },
        { id: '11', name: 'IKEDC (Lagos)', icon: <Zap color="#6366f1" />, desc: 'Electricity Settlement' },
        { id: '12', name: 'PHEDC (Rivers)', icon: <Zap color="#6366f1" />, desc: 'Electricity Settlement' }
     ],
     CABLE: [
        { id: '20', name: 'DSTV Nigeria', icon: <Tv color="#3b82f6" />, desc: 'Digital Satellite Protocol' },
        { id: '21', name: 'GOTV Nigeria', icon: <Tv color="#3b82f6" />, desc: 'Digital Satellite Protocol' },
        { id: '22', name: 'StarTimes', icon: <Tv color="#3b82f6" />, desc: 'Digital Satellite Protocol' }
     ],
     BETTING: [
        { id: '30', name: 'Bet9ja', icon: <Trophy color="#22c55e" />, desc: 'Capital Deployment' },
        { id: '31', name: 'SportyBet', icon: <Trophy color="#ef4444" />, desc: 'Capital Deployment' },
        { id: '32', name: '1xBet', icon: <Trophy color="#3b82f6" />, desc: 'Capital Deployment' }
     ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
       
       {/* Header */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                <Cpu size={16} fill="var(--primary)" /> Recurring Settlement Rails
             </div>
             <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Bills & Utilities</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: 500, maxWidth: '600px' }}>
                Settle global airtime, infrastructure utilities, and corporate services instantly via the Paypee rail.
             </p>
          </div>
          <div style={{ position: 'relative' }}>
             <input type="text" placeholder="Search billing protocol..." className="form-input" style={{ width: '320px', paddingLeft: '3.5rem', borderRadius: '18px' }} />
             <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          </div>
       </div>

       {/* Category Selection */}
       <div style={{ display: 'flex', gap: '1.5rem' }}>
          <BillCategory icon={Smartphone} name="Airtime & Data" active={category === 'AIRTIME'} onClick={() => setCategory('AIRTIME')} />
          <BillCategory icon={Zap} name="Electricity" active={category === 'UTILITY'} onClick={() => setCategory('UTILITY')} />
          <BillCategory icon={Tv} name="Cable TV" active={category === 'CABLE'} onClick={() => setCategory('CABLE')} />
          <BillCategory icon={Trophy} name="Service Ingress" active={category === 'BETTING'} onClick={() => setCategory('BETTING')} />
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3.5rem', alignItems: 'flex-start' }}>
          
          {/* Provider Selection */}
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Available Registries</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{providers[category].length} VETTED</div>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {providers[category].map(p => (
                   <motion.div 
                      key={p.id}
                      whileHover={{ x: 10 }}
                      onClick={() => setSelectedProvider(p)}
                      style={{ 
                         display: 'flex', 
                         justifyContent: 'space-between', 
                         alignItems: 'center', 
                         padding: '1.75rem 2rem', 
                         background: selectedProvider?.id === p.id ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)', 
                         border: selectedProvider?.id === p.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)', 
                         borderRadius: '24px',
                         cursor: 'pointer',
                         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                   >
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.icon}
                         </div>
                         <div>
                            <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#fff' }}>{p.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.desc}</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {selectedProvider?.id === p.id && <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px' }}>SELECTED</div>}
                        <ChevronRight size={20} color={selectedProvider?.id === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)'} />
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Execution Panel */}
          <div className="premium-card" style={{ padding: '3.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: '2rem' }}>
             <AnimatePresence mode="wait">
                {selectedProvider ? (
                   <motion.div 
                     key={selectedProvider.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                   >
                      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                         <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                             {React.cloneElement(selectedProvider.icon as any, { size: 36 })}
                         </div>
                         <h4 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{selectedProvider.name}</h4>
                         <div style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '2px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={14} /> AUTHORIZED SETTLEMENT
                         </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="form-label">CUSTOMER IDENTIFIER</label>
                            <div style={{ position: 'relative' }}>
                               <input placeholder="Phone / Account No." className="form-input" style={{ fontSize: '1.1rem', fontWeight: 800, paddingLeft: '3.5rem' }} />
                               <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                                  <Smartphone size={20} />
                               </div>
                            </div>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="form-label">SETTLEMENT AMOUNT (NGN)</label>
                            <div style={{ position: 'relative' }}>
                               <input placeholder="0.00" type="number" className="form-input" style={{ fontSize: '1.1rem', fontWeight: 800, paddingLeft: '3.5rem' }} />
                               <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontWeight: 900 }}>
                                  ₦
                               </div>
                            </div>
                         </div>

                         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>Protocol Fee</div>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>₦0.00</div>
                         </div>

                         <button className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.1rem', marginTop: '1.5rem' }}>
                            Authorize Bill Payment
                         </button>
                      </div>
                   </motion.div>
                ) : (
                   <div style={{ height: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                      <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <Zap size={48} />
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Awaiting Selection</div>
                      <p style={{ maxWidth: '250px', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500 }}>Choose a billing registry from the terminal to begin settlement.</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
       </div>

       {/* Verified Banner */}
       <div style={{ marginTop: '2rem', padding: '2.5rem 3rem', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '28px', background: 'rgba(16, 185, 129, 0.02)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ShieldCheck size={36} />
          </div>
          <div>
             <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', marginBottom: '0.4rem', letterSpacing: '0.01em' }}>Verified Settlement Pipeline</div>
             <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, fontWeight: 500 }}>
                All utility settlements are finalized in real-time via the Paypee primary financial grid. Transaction hashes are generated instantly for institutional audit trails.
             </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
             <button className="btn btn-outline" style={{ padding: '1rem 2rem', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 900, background: 'rgba(255,255,255,0.02)' }}>Protocol Specs</button>
          </div>
       </div>

       {/* Decorative Flair */}
       <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', opacity: 0.02, pointerEvents: 'none', zIndex: 0 }}>
          <AlertCircle size={600} />
       </div>
    </div>
  );
};

export default BillsDashboard;
