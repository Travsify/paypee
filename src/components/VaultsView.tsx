import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config';
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  Plus, 
  ShieldCheck, 
  ArrowRightLeft,
  X,
  Zap,
  Info,
  Shield,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Vault {
  id: string;
  name: string;
  balance: string;
  currency: string;
  type: string;
  createdAt: string;
}

const VaultsView = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  
  // Form state
  const [vaultName, setVaultName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchVaults = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/vaults`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setVaults(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
    fetchVaults();
    fetchWallets();
  }, []);

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/vaults`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: vaultName,
          amount: parseFloat(amount),
          walletId: selectedWalletId
        })
      });
      
      if (res.ok) {
        setIsCreateModalOpen(false);
        setVaultName('');
        setAmount('');
        fetchVaults();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create vault');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Shield size={18} fill="var(--primary)" /> Capital Preservation
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Smart Vaults</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', fontWeight: 500 }}>
            Institutional-grade locked storage for your long-term capital with integrated yield generation.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '1.25rem 2.5rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}
        >
          <Plus size={22} /> Initialize New Vault
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
          <div className="spinner" style={{ width: 60, height: 60 }} />
        </div>
      ) : vaults.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card" 
          style={{ padding: '8rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}
        >
          <div className="mesh-bg" style={{ opacity: 0.1 }} />
          <div style={{ width: 100, height: 100, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <ShieldCheck size={50} />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>No active vaults detected</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: 1.7, fontSize: '1.1rem' }}>
            Secure your assets against volatility and earn up to 12% APY by moving them into a smart vault today.
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-outline" style={{ padding: '1rem 3rem', borderRadius: '18px', fontSize: '1rem' }}>
            Start Your First Vault
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
          {vaults.map((vault) => (
            <motion.div 
              key={vault.id}
              whileHover={{ y: -10, scale: 1.02 }}
              className="holographic-card"
              style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}
            >
              <div className="mesh-bg" style={{ opacity: 0.2 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
                <div style={{ width: 60, height: 60, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.1)' }}>
                  <Lock size={30} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1.25rem', borderRadius: '100px', letterSpacing: '1.5px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>LOCKED</div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>{vault.name}</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{vault.currency} RESERVE NODE</div>
              </div>

              <div style={{ marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                <div className="text-glow" style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                  <span style={{ opacity: 0.5, fontSize: '1.5rem', marginRight: '0.5rem' }}>{vault.currency}</span>
                  {parseFloat(vault.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 800, marginTop: '0.75rem' }}>
                  <TrendingUp size={18} /> +12.0% APY Compounding
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 10 }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '1rem', borderRadius: '16px', fontWeight: 900, background: 'rgba(255,255,255,0.05)' }}>Release</button>
                <button className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '16px', fontWeight: 900 }}>Top Up</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Institutional-Grade Features Section */}
      <div className="premium-card" style={{ padding: '4rem', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h4 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Vault Architecture</h4>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Engineered for absolute security and maximum capital efficiency.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Lock size={32} /></div>
            <div>
              <h5 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Multi-Sig Security</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>Funds are distributed across cold-storage nodes requiring multiple authorization keys for settlement.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', flexShrink: 0 }}><TrendingUp size={32} /></div>
            <div>
              <h5 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Yield Optimization</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>Integrated with regional T1 liquidity pools to provide consistent, low-risk yield on idle capital.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Clock size={32} /></div>
            <div>
              <h5 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Cooling Period</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>A mandatory 24h cooldown on large withdrawals prevents impulsive decisions and secures against theft.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '2rem', backdropFilter: 'blur(15px)' }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="premium-card"
              style={{ padding: '3.5rem', width: '100%', maxWidth: '550px', position: 'relative' }}
            >
              <button onClick={() => setIsCreateModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '12px' }}><X size={24} /></button>
              
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} /> New Reserve Node
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Initialize Vault</h3>
              </div>

              <form onSubmit={handleCreateVault} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label className="form-label">VAULT IDENTIFIER</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Q4 Expansion Capital"
                    className="form-input"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">SETTLEMENT SOURCE</label>
                  <select 
                    className="form-input"
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                    required
                    style={{ appearance: 'none' }}
                  >
                    <option value="">Choose Funding Rail</option>
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.currency} Wallet (Balance: {parseFloat(w.balance).toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">INITIAL RESERVE AMOUNT</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="form-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      style={{ fontSize: '1.75rem', fontWeight: 900, padding: '1.25rem 1.5rem' }}
                    />
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '20px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                   <Info size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                     Vault funds are isolated from your primary liquidity and cannot be accessed via virtual cards until the settlement period concludes.
                   </p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '1.25rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, marginTop: '1rem' }}
                >
                  {submitting ? 'Encrypting & Locking...' : 'Authorize Vault Creation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultsView;
