import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Tv, 
  Droplets, 
  Wifi, 
  Lightbulb,
  Search,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Activity,
  X
} from 'lucide-react';

const BillsView = () => {
  const [activeCategory, setActiveCategory] = useState('AIRTIME');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  
  // Form state
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: 'AIRTIME', name: 'Airtime', icon: <Smartphone />, color: '#10b981' },
    { id: 'DATA', name: 'Mobile Data', icon: <Wifi />, color: '#3b82f6' },
    { id: 'UTILITY', name: 'Electricity', icon: <Lightbulb />, color: '#f59e0b' },
    { id: 'TV', name: 'Cable TV', icon: <Tv />, color: '#ef4444' }
  ];

  const fetchProviders = async (cat: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/bills/providers?category=${cat}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProviders(data);
      else setProviders([]);
    } catch (err) {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.wallets) setWallets(data.wallets);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProviders(activeCategory);
    fetchWallets();
  }, [activeCategory]);

  const handlePayBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/bills/pay', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletId: selectedWalletId,
          amount: parseFloat(amount),
          providerId: selectedProvider.id,
          customerId,
          category: activeCategory
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedProvider(null);
          setAmount('');
          setCustomerId('');
        }, 3000);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to process payment');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bills & Utilities</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Instant settlement for airtime, data, and utility nodes across regional grids.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'flex-start' }}>
        <div>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveCategory(cat.id); setSelectedProvider(null); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem 1.5rem', 
                  background: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
                  border: '1px solid ' + (activeCategory === cat.id ? 'var(--primary)' : 'var(--border)'),
                  borderRadius: '16px',
                  color: activeCategory === cat.id ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ color: activeCategory === cat.id ? '#fff' : cat.color }}>{cat.icon}</div>
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Provider Search */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${activeCategory.toLowerCase()} providers...`}
              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.25rem 1.5rem 1.25rem 4rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          {/* Provider Grid */}
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
          ) : providers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
              <Activity size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <div style={{ color: 'var(--text-muted)' }}>No live billers found in this region.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {providers.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.02, background: 'rgba(99, 102, 241, 0.05)' }}
                  onClick={() => setSelectedProvider(p)}
                  style={{ 
                    padding: '1.5rem', 
                    background: selectedProvider?.id === p.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', 
                    border: '1px solid ' + (selectedProvider?.id === p.id ? 'var(--primary)' : 'var(--border)'),
                    borderRadius: '24px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: 64, height: 64, background: '#fff', borderRadius: '16px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={p.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`} alt={p.name} style={{ width: '80%' }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{p.name}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Sidebar */}
        <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', padding: '2rem', position: 'sticky', top: '2rem' }}>
          {selectedProvider ? (
            <form onSubmit={handlePayBill}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <ArrowRight size={20} color="var(--primary)" /> Finalize Payment
               </h3>

               <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={selectedProvider.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedProvider.name}`} style={{ width: 40, height: 40, borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>BILLER</div>
                    <div style={{ fontWeight: 800 }}>{selectedProvider.name}</div>
                  </div>
                  <button onClick={() => setSelectedProvider(null)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
               </div>

               <div style={{ marginBottom: '1.5rem' }}>
                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>SOURCE WALLET</label>
                 <select 
                   value={selectedWalletId}
                   onChange={(e) => setSelectedWalletId(e.target.value)}
                   required
                   style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none' }}
                 >
                   <option value="">Select Wallet</option>
                   {wallets.map(w => (
                     <option key={w.id} value={w.id}>{w.currency} - {parseFloat(w.balance).toFixed(2)}</option>
                   ))}
                 </select>
               </div>

               <div style={{ marginBottom: '1.5rem' }}>
                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>{activeCategory === 'AIRTIME' ? 'PHONE NUMBER' : 'CUSTOMER / METER ID'}</label>
                 <input 
                   type="text" 
                   value={customerId}
                   onChange={(e) => setCustomerId(e.target.value)}
                   placeholder="e.g. 08012345678"
                   required
                   style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none' }}
                 />
               </div>

               <div style={{ marginBottom: '2rem' }}>
                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>AMOUNT</label>
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   placeholder="0.00"
                   required
                   style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1rem', color: '#fff', fontSize: '1.5rem', fontWeight: 900, outline: 'none' }}
                 />
               </div>

               <motion.button 
                 whileTap={{ scale: 0.98 }}
                 type="submit"
                 disabled={submitting || success}
                 style={{ width: '100%', background: success ? '#10b981' : 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 10px 30px -10px var(--primary)' }}
               >
                 {submitting ? 'Processing...' : success ? '✓ Payment Success' : 'Finalize Payment'}
               </motion.button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
               <div style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                 <Smartphone size={32} />
               </div>
               <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Select a Provider</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Choose a utility or airtime provider from the left to begin your instant settlement.</p>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '16px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span style={{ fontSize: '0.7rem', color: 'rgba(16, 185, 129, 0.8)', fontWeight: 700, letterSpacing: '0.5px' }}>SECURE GATEWAY ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsView;
