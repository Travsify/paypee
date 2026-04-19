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
  Info
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
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/vaults', {
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
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/users/me', {
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
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/vaults', {
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
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Smart Vaults</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Protect your long-term capital with high-security locked savings.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 30px -10px var(--primary)' }}
        >
          <Plus size={20} /> Create New Vault
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner" />
        </div>
      ) : vaults.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '32px', padding: '6rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
            <ShieldCheck size={40} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>No active vaults found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>Start saving for specific goals or secure your assets in locked vaults to earn yield and prevent impulsive spending.</p>
          <button onClick={() => setIsCreateModalOpen(true)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Begin Saving</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {vaults.map((vault) => (
            <motion.div 
              key={vault.id}
              whileHover={{ y: -5 }}
              style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '28px', padding: '2rem', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.05)', filter: 'blur(30px)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={24} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', letterSpacing: '1px' }}>LOCKED</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{vault.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{vault.currency} Portfolio Vault</div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{vault.currency} {parseFloat(vault.balance).toFixed(2)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                  <TrendingUp size={14} /> +0.0% APY Accumulating
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Release</button>
                <button style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Add Funds</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Benefits section */}
      <div style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        <div>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Lock size={28} /></div>
          <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Impenetrable Security</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Funds in vaults require multi-factor authentication and a 24h cooling period before withdrawal to external nodes.</p>
        </div>
        <div>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><TrendingUp size={28} /></div>
          <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Yield Generation</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Stablecoin and fiat vaults automatically participate in regional T1 liquidity pools to generate passive yield.</p>
        </div>
        <div>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Zap size={28} /></div>
          <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Instant Settlement</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Internal movement between your primary wallets and vaults is processed instantly on the Paypee ledger.</p>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '32px', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create New Vault</h3>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X /></button>
              </div>

              <form onSubmit={handleCreateVault}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>VAULT PURPOSE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Real Estate Savings"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>SOURCE WALLET</label>
                  <select 
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="">Select Wallet</option>
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.currency} - Balance: {parseFloat(w.balance).toFixed(2)}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>INITIAL FUNDING AMOUNT</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem 1rem', color: '#fff', fontSize: '1.5rem', fontWeight: 900, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                   <Info size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Vault funds are excluded from your primary balance and cannot be spent via virtual cards until released back to a wallet.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 10px 30px -10px var(--primary)' }}
                >
                  {submitting ? 'Locking Funds...' : 'Initialize & Lock Vault'}
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
