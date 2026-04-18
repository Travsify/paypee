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

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const fetchProviders = async (cat: string) => {
    setLoading(true);
    setProviders([]);
    try {
      const token = localStorage.getItem('paypee_token');
      // Maplerad category mapping
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

  const fetchProducts = async (billerId: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/bills/products?billerId=${billerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else setProducts([]);
    } catch (err) {
      setProducts([]);
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

  useEffect(() => {
    if (selectedProvider) {
      fetchProducts(selectedProvider.id);
    } else {
      setProducts([]);
      setSelectedProductId('');
    }
  }, [selectedProvider]);

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
          productId: selectedProductId,
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
          setSelectedProductId('');
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
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Sleek Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '32px', padding: '3rem', textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
         <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#6366f1', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
         <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: '#22d3ee', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }} />
         
         <Zap size={48} color="#22d3ee" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.5))' }} />
         <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Pay any bill, instantly.</h2>
         <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>No hidden fees, no delays. Select a service below to settle your utilities globally in seconds.</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedProvider ? (
          <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>What do you need to pay?</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -5, scale: 1.02, background: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ 
                    background: activeCategory === cat.id ? `linear-gradient(135deg, ${cat.color}22 0%, transparent 100%)` : 'rgba(255,255,255,0.02)', 
                    border: '1px solid ' + (activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)'),
                    borderRadius: '24px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: activeCategory === cat.id ? `0 10px 30px ${cat.color}22` : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ width: 64, height: 64, background: `${cat.color}22`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem', color: activeCategory === cat.id ? '#fff' : '#e2e8f0' }}>{cat.name}</div>
                </motion.div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '2.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Select a Provider</h3>
                 <div style={{ position: 'relative', width: '250px' }} className="desktop-only">
                   <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                   <input type="text" placeholder="Search..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', outline: 'none' }} />
                 </div>
               </div>

               {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
               ) : providers.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                   <Activity size={40} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                   <div style={{ color: '#94a3b8', fontWeight: 600 }}>No live providers found in this region.</div>
                 </div>
               ) : (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                   {providers.map((p) => (
                     <motion.div
                       key={p.id}
                       whileHover={{ scale: 1.05, y: -5 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setSelectedProvider(p)}
                       style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                     >
                       <div style={{ width: 56, height: 56, background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <img src={p.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`} alt={p.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                       </div>
                       <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0' }}>{p.name}</div>
                     </motion.div>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="payment-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '3rem', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
               <button onClick={() => setSelectedProvider(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div style={{ width: 80, height: 80, background: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                     <img src={selectedProvider.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedProvider.name}`} alt={selectedProvider.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ color: '#22d3ee', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>SECURE PAYMENT</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{selectedProvider.name}</div>
                  </div>
               </div>

               <form onSubmit={handlePayBill}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '1px' }}>SOURCE WALLET</label>
                    <select value={selectedWalletId} onChange={(e) => setSelectedWalletId(e.target.value)} required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem', color: '#fff', fontSize: '1rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option value="" disabled>Select Wallet to Pay From</option>
                      {wallets.map(w => (
                        <option key={w.id} value={w.id}>{w.currency} - {parseFloat(w.balance).toFixed(2)}</option>
                      ))}
                    </select>
                  </div>

                  {products.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '1px' }}>SELECT PACKAGE / PRODUCT</label>
                      <select value={selectedProductId} onChange={(e) => { setSelectedProductId(e.target.value); const p = products.find(prod => prod.id === e.target.value); if (p && p.amount) setAmount(p.amount.toString()); }} required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem', color: '#fff', fontSize: '1rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option value="" disabled>Select a Plan</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} {p.amount ? `- ₦${p.amount}` : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '1px' }}>{activeCategory === 'AIRTIME' || activeCategory === 'DATA' ? 'PHONE NUMBER' : 'CUSTOMER / METER ID'}</label>
                    <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder={activeCategory === 'AIRTIME' ? 'e.g. 08012345678' : 'Enter ID number'} required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem', color: '#fff', fontSize: '1.1rem', outline: 'none' }} />
                  </div>

                  <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '1px' }}>AMOUNT TO PAY</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: 900, color: '#94a3b8' }}>₦</span>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.25rem 1.25rem 1.25rem 3.5rem', color: '#fff', fontSize: '1.8rem', fontWeight: 900, outline: 'none' }} />
                    </div>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting || success}
                    style={{ width: '100%', background: success ? '#10b981' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '1.5rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: success ? '0 10px 30px rgba(16,185,129,0.3)' : '0 15px 30px rgba(99,102,241,0.4)', transition: 'all 0.3s' }}
                  >
                    {submitting ? 'Processing Payment securely...' : success ? '✓ Payment Successful' : 'Authorize Payment'}
                  </motion.button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', color: '#10b981' }}>
                    <ShieldCheck size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>256-BIT ENCRYPTED</span>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillsView;
