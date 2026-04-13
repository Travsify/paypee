import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  RefreshCcw,
  ArrowRight,
  Bot
} from 'lucide-react';

const VaultCard = ({ name, balance, currency, type, apy, isAiEnabled }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', borderRadius: '24px', padding: '2rem', minWidth: '320px' }}
  >
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ padding: '0.6rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
           <Lock size={20} />
        </div>
        {isAiEnabled && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800 }}>
              <Bot size={12} /> AI ACTIVE
           </div>
        )}
     </div>
     <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.2rem' }}>{name.toUpperCase()}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currency} {balance}</div>
     </div>
     <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>ESTIMATED APY</div>
           <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 800 }}>{apy}%</div>
        </div>
        <button style={{ background: 'transparent', border: '1px solid #1e293b', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', color: '#fff', cursor: 'pointer' }}>Manage</button>
     </div>
  </motion.div>
);

const VaultsDashboard = () => {
  const [vaults, setVaults] = useState([
    { id: '1', name: 'Emergency Fund', balance: '12,450.00', currency: 'USD', type: 'SAVINGS', apy: '4.5', isAiEnabled: true },
    { id: '2', name: 'Tax Reserve 2026', balance: '8,000,000.00', currency: 'NGN', type: 'TAX', apy: '0.0', isAiEnabled: false },
    { id: '3', name: 'Global Treasury', balance: '25,000.00', currency: 'EUR', type: 'TREASURY', apy: '3.2', isAiEnabled: true },
  ]);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
         <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vaults & Treasury</h1>
            <p style={{ color: '#64748b' }}>Store capital with AI-driven protection and automated yield.</p>
         </div>
         <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Vault
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
         {vaults.map(vault => <VaultCard key={vault.id} {...vault} />)}
         <motion.div 
            whileHover={{ y: -5 }}
            style={{ border: '2px dashed #1e293b', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer', minHeight: '220px' }}
         >
            <Plus size={40} color="#1e293b" style={{ marginBottom: '1rem' }} />
            <span style={{ fontWeight: 600, color: '#475569' }}>Create Global Vault</span>
         </motion.div>
      </div>

      <section style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)', border: '1px solid #1e293b', borderRadius: '32px', padding: '3rem' }}>
         <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>
               <Bot size={32} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Volatility Shield</h3>
               <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Automatically hedge your NGN balances to USD stablecoins when the market fluctuates by more than 2%.</p>
            </div>
            <div style={{ position: 'relative', width: '60px', height: '32px', background: 'var(--primary)', borderRadius: '16px', padding: '4px', cursor: 'pointer' }}>
               <div style={{ position: 'absolute', right: '4px', top: '4px', width: '24px', height: '24px', background: '#fff', borderRadius: '50%' }} />
            </div>
         </div>
      </section>
    </div>
  );
};

export default VaultsDashboard;
