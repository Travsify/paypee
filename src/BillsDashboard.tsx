import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Tv, 
  Activity, 
  ChevronRight, 
  ShieldCheck,
  RefreshCcw,
  Search,
  Wifi,
  Wallet,
  CheckCircle2
} from 'lucide-react';

const BillsDashboard = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [billers, setBillers] = useState<any[]>([]);
  const [selectedBiller, setSelectedBiller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Payment Form
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [userWallets, setUserWallets] = useState<any[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState('');

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const [catRes, userRes] = await Promise.all([
        fetch('https://paypee-api-kmhv.onrender.com/api/bills/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://paypee-api-kmhv.onrender.com/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const catData = await catRes.json();
      const userData = await userRes.json();
      
      if (Array.isArray(catData)) {
        setCategories(catData);
        if (catData.length > 0) setActiveCategoryId(catData[0].id);
      }
      if (userData.wallets) {
        setUserWallets(userData.wallets);
        const ngnWallet = userData.wallets.find((w: any) => w.currency === 'NGN');
        if (ngnWallet) setSelectedWalletId(ngnWallet.id);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      fetchBillers(activeCategoryId);
      setSelectedBiller(null);
      setProducts([]);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    if (selectedBiller) {
      fetchProducts(selectedBiller.id);
    }
  }, [selectedBiller]);

  const fetchBillers = async (catId: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/bills/billers?category=${catId}&country=NG`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBillers(data);
    } catch (err) {}
  };

  const fetchProducts = async (billerId: string) => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`https://paypee-api-kmhv.onrender.com/api/bills/products?billerId=${billerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {}
  };

  const handlePay = async (e: any) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/bills/pay', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(amount || selectedProduct?.amount || '0'),
          sourceWalletId: selectedWalletId,
          billerId: selectedBiller.id,
          productId: selectedProduct.id,
          meter_number: customerId,
          phone_number: customerId
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setSelectedBiller(null); setAmount(''); setCustomerId(''); }, 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Payment failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading bills system...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bills & Utilities</h2>
        <p style={{ color: 'var(--text-muted)' }}>Pay for airtime, internet, power, and cable TV instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <CategoryItem 
            key={cat.id} 
            cat={cat} 
            active={activeCategoryId === cat.id} 
            onClick={() => setActiveCategoryId(cat.id)} 
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
        {/* Billers List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> Select Provider
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {billers.map(b => (
              <motion.div 
                key={b.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedBiller(b)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.25rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${selectedBiller?.id === b.id ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={b.image} style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }} alt="" />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.name}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', padding: '2.5rem' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment Successful</h3>
                <p style={{ color: 'var(--text-muted)' }}>Your bill has been settled and finalized.</p>
              </div>
            ) : selectedBiller ? (
              <form onSubmit={handlePay}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <img src={selectedBiller.image} style={{ width: 64, height: 64, borderRadius: '16px', marginBottom: '1rem' }} alt="" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedBiller.name}</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SELECT PRODUCT</label>
                    <select 
                      style={inputStyle} 
                      onChange={e => setSelectedProduct(products.find(p => p.id === e.target.value))}
                      required
                    >
                      <option value="">Select a plan</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.amount ? ` - ${p.amount}` : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CUSTOMER ID / PHONE</label>
                    <input 
                      placeholder="e.g. 08012345678" 
                      value={customerId}
                      onChange={e => setCustomerId(e.target.value)}
                      required 
                      style={inputStyle} 
                    />
                  </div>

                  {(!selectedProduct || !selectedProduct.amount) && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AMOUNT (NGN)</label>
                      <input 
                        placeholder="0.00" 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required 
                        style={inputStyle} 
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PAY FROM</label>
                    <select style={inputStyle} value={selectedWalletId} onChange={e => setSelectedWalletId(e.target.value)}>
                      {userWallets.map(w => (
                        <option key={w.id} value={w.id}>{w.currency} Wallet (${parseFloat(w.balance).toFixed(2)})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    disabled={processing}
                    style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {processing ? <RefreshCcw size={20} className="animate-spin" /> : 'Confirm Payment'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.02)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Zap size={32} style={{ opacity: 0.3 }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Select a provider<br />to pay your bill</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ cat, active, onClick }: any) => {
  const Icon = cat.id.includes('airtime') ? Smartphone : cat.id.includes('data') ? Wifi : cat.id.includes('utility') ? Zap : Tv;
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ 
        padding: '1.25rem', 
        background: active ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
        border: '1px solid var(--border)', 
        borderRadius: '20px', 
        textAlign: 'center', 
        cursor: 'pointer',
        transition: 'all 0.3s',
        color: active ? '#fff' : 'inherit'
      }}
    >
       <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', color: active ? '#fff' : 'var(--primary)' }}>
          <Icon size={24} />
       </div>
       <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{cat.name}</div>
    </motion.div>
  );
};

const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '14px', color: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600 };

export default BillsDashboard;
