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
  Globe,
  Trophy,
  X,
  ChevronDown,
  RefreshCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { API_BASE } from '../config';

const BillsView = () => {
  const [activeCategory, setActiveCategory] = useState('airtime');
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
  const [pin, setPin] = useState('');

  const categories = [
    { id: 'airtime', name: 'Airtime', icon: <Smartphone />, color: '#10b981' },
    { id: 'data', name: 'Mobile Data', icon: <Wifi />, color: '#3b82f6' },
    { id: 'electricity', name: 'Electricity', icon: <Lightbulb />, color: '#f59e0b' },
    { id: 'cable', name: 'Cable TV', icon: <Tv />, color: '#ef4444' },
    { id: 'internet', name: 'Internet', icon: <Globe />, color: '#8b5cf6' },
    { id: 'betting', name: 'Betting', icon: <Trophy />, color: '#22d3ee' }
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const getNetworkLogo = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('mtn')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a5/MTN_Logo.svg';
    if (n.includes('airtel')) return 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Airtel_logo_logotype.png';
    if (n.includes('glo')) return 'https://upload.wikimedia.org/wikipedia/commons/8/87/Glo_button.png';
    if (n.includes('9mobile') || n.includes('etisalat')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/9mobile_Logo.png/600px-9mobile_Logo.png';
    if (n.includes('smile')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Smile_Communications_logo.svg/512px-Smile_Communications_logo.svg.png';
    if (n.includes('spectranet')) return 'https://spectranet.com.ng/assets/images/spectranet-logo.png';
    if (n.includes('dstv')) return 'https://upload.wikimedia.org/wikipedia/commons/5/5e/DStv_Logo_2012.svg';
    if (n.includes('gotv')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/GOtv_Logo.svg/512px-GOtv_Logo.svg.png';
    if (n.includes('startimes')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/StarTimes_logo.svg/512px-StarTimes_logo.svg.png';
    if (n.includes('ikeja') || n.includes('ikedc')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Ikeja_Electric_logo.png/220px-Ikeja_Electric_logo.png';
    if (n.includes('ibadan') || n.includes('ibedc')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/IBEDC_logo.jpg/220px-IBEDC_logo.jpg';
    if (n.includes('eko') || n.includes('ekedc')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Eko_Electricity_Distribution_Company_logo.png/220px-Eko_Electricity_Distribution_Company_logo.png';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=020617,1e293b&textColor=ffffff`;
  };

  const fetchProviders = async (cat: string) => {
    setLoading(true);
    setProviders([]);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/bills/providers?category=${cat}`, {
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
      const res = await fetch(`${API_BASE}/api/bills/products?billerId=${billerId}`, {
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
      const res = await fetch(`${API_BASE}/api/users/me`, {
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
      fetchProducts(selectedProvider.identifier || selectedProvider.id);
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
      const res = await fetch(`${API_BASE}/api/bills/pay`, {
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
          category: activeCategory,
          pin
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedProvider(null);
          setAmount('');
          setCustomerId('');
          setSelectedProductId('');
          setPin('');
        }, 3000);
      } else {
        alert(data.error || 'Failed to process payment');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const activeCatObj = categories.find(c => c.id === activeCategory);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '6rem' }}>
      {/* Sleek Hero Banner */}
      <div className="premium-card" style={{ padding: '4rem 3rem', textAlign: 'center', marginBottom: '4rem', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)' }}>
         <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />
         <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />
         
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }} 
           animate={{ scale: 1, opacity: 1 }}
           style={{ width: 80, height: 80, background: 'rgba(34, 211, 238, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--accent)', border: '1px solid rgba(34, 211, 238, 0.2)', boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)' }}
         >
            <Zap size={40} fill="currentColor" />
         </motion.div>
         <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Pay any bill, <br /><span style={{ color: 'var(--accent)' }}>instantly.</span></h2>
         <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>No hidden fees, no delays. Select a service below to settle your utilities globally in seconds.</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedProvider ? (
          <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Select Service Category</h3>
               <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ 
                    background: activeCategory === cat.id ? `linear-gradient(145deg, ${cat.color}20, ${cat.color}05)` : 'rgba(255,255,255,0.02)', 
                    border: '1px solid ' + (activeCategory === cat.id ? `${cat.color}60` : 'rgba(255,255,255,0.05)'),
                    borderRadius: '28px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: activeCategory === cat.id ? `0 20px 40px ${cat.color}15` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    width: 64, height: 64, 
                    background: activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)', 
                    borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 1.25rem', color: activeCategory === cat.id ? '#fff' : 'var(--text-muted)',
                    boxShadow: activeCategory === cat.id ? `0 10px 20px ${cat.color}40` : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {React.cloneElement(cat.icon as any, { size: 32 })}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: activeCategory === cat.id ? '#fff' : 'var(--text-muted)', letterSpacing: '-0.01em' }}>{cat.name}</div>
                  
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="active-dot"
                      style={{ width: 6, height: 6, background: cat.color, borderRadius: '50%', margin: '0.75rem auto 0', boxShadow: `0 0 10px ${cat.color}` }} 
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="premium-card" style={{ padding: '3rem', background: 'rgba(255,255,255,0.01)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                 <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Choose Provider</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>Available {activeCatObj?.name} billers in your region</p>
                 </div>
                 <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search billers..." className="form-input" style={{ paddingLeft: '3.5rem', background: 'rgba(255,255,255,0.03)' }} />
                 </div>
               </div>

               {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><RefreshCcw className="animate-spin" size={40} color="var(--primary)" /></div>
               ) : providers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <Activity size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>No providers available</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '350px', margin: '0 auto' }}>We're currently updating the list of billers for this category. Please check back shortly.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                    {providers.map((p) => (
                      <motion.div
                        key={p.identifier || p.id}
                        whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedProvider({ ...p, id: p.identifier || p.id })}
                        style={{ 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '24px', padding: '2rem 1.5rem', 
                          cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', 
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ 
                          width: 72, height: 72, 
                          background: '#fff', borderRadius: '20px', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', overflow: 'hidden', padding: '0.75rem',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.2)' 
                        }}>
                          <img src={p.logo || getNetworkLogo(p.name)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>{p.name}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="payment-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: 20 }}>
            <div className="premium-card" style={{ padding: '3.5rem', maxWidth: '650px', margin: '0 auto', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
               <button onClick={() => setSelectedProvider(null)} className="btn btn-outline" style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', width: 44, height: 44, borderRadius: '50%', padding: 0 }}><X size={20} /></button>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
                  <div style={{ width: 90, height: 90, background: '#fff', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', padding: '1rem' }}>
                     <img src={selectedProvider.logo || getNetworkLogo(selectedProvider.name)} alt={selectedProvider.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Biller Authorization</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>{selectedProvider.name}</div>
                  </div>
               </div>

               <form onSubmit={handlePayBill} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <label className="form-label">SOURCE WALLET</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={selectedWalletId} 
                        onChange={(e) => setSelectedWalletId(e.target.value)} 
                        required 
                        className="form-input"
                        style={{ appearance: 'none' }}
                      >
                        <option value="" disabled style={{ background: '#0a0f1e' }}>Choose Payment Wallet</option>
                        {wallets.map(w => {
                          const getCurrencySymbol = (currency: string) => {
                            const symbols: any = { NGN: '₦', USD: '$', EUR: '€', GBP: '£', USDT: '₮', USDC: '🔵', BTC: '₿' };
                            return symbols[currency] || currency;
                          };
                          return (
                            <option key={w.id} value={w.id} style={{ background: '#0a0f1e' }}>
                              {w.currency} Wallet — {getCurrencySymbol(w.currency)}{parseFloat(w.balance).toLocaleString()}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown size={20} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                    </div>
                  </div>

                  {products.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      <label className="form-label">SELECT PACKAGE</label>
                      <div style={{ position: 'relative' }}>
                        <select 
                          value={selectedProductId} 
                          onChange={(e) => { 
                            setSelectedProductId(e.target.value); 
                            const p = products.find(prod => prod.id === e.target.value); 
                            if (p && p.amount) setAmount(p.amount.toString()); 
                          }} 
                          required 
                          className="form-input"
                          style={{ appearance: 'none' }}
                        >
                          <option value="" disabled style={{ background: '#0a0f1e' }}>Select Plan</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id} style={{ background: '#0a0f1e' }}>{p.name} {p.amount ? `— ₦${parseFloat(p.amount).toLocaleString()}` : ''}</option>
                          ))}
                        </select>
                        <ChevronDown size={20} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="form-label">
                      {activeCategory === 'electricity' ? 'METER NUMBER' : activeCategory === 'cable' ? 'IUC / SMARTCARD NUMBER' : 'RECIPIENT NUMBER'}
                    </label>
                    <input 
                      type="text" 
                      value={customerId} 
                      onChange={(e) => setCustomerId(e.target.value)} 
                      placeholder={activeCategory === 'electricity' ? '0000 0000 0000' : 'Enter identification number'} 
                      required 
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">PAYMENT AMOUNT (NGN)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-muted)' }}>₦</span>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        placeholder="0.00" 
                        required 
                        className="form-input"
                        style={{ paddingLeft: '4rem', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }} 
                      />
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <Lock size={18} color="var(--primary)" />
                        <span style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--primary)' }}>AUTHORIZE TRANSACTION</span>
                     </div>
                     <input 
                      type="password" 
                      maxLength={4} 
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      className="form-input"
                      style={{ textAlign: 'center', fontSize: '2.5rem', letterSpacing: '1.5rem', fontWeight: 900, padding: '1rem', background: 'rgba(0,0,0,0.3)' }} 
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting || success || pin.length < 4}
                    className={success ? "btn btn-accent" : "btn btn-primary"}
                    style={{ width: '100%', padding: '1.4rem', fontSize: '1.2rem', fontWeight: 900, borderRadius: '24px' }}
                  >
                    {submitting ? <RefreshCcw className="animate-spin" /> : success ? <><CheckCircle2 size={24} /> Payment Successful</> : 'Confirm & Settle Bill'}
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--accent)' }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>PCI-DSS COMPLIANT RAIL</span>
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
