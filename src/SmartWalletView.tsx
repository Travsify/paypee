import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Plus, 
  Shield, 
  Zap, 
  BarChart3, 
  PieChart, 
  Globe,
  Wallet as WalletIcon
} from 'lucide-react';
import BalanceCard from './components/BalanceCard';

interface SmartWalletViewProps {
  wallets: any[];
  userData: any;
  showBalances: boolean;
  onSwap: () => void;
  onPayout: () => void;
  onRefresh: () => void;
  onCreateAccount: () => void;
}

const SmartWalletView: React.FC<SmartWalletViewProps> = ({ 
  wallets, 
  userData, 
  showBalances, 
  onSwap, 
  onPayout, 
  onRefresh,
  onCreateAccount
}) => {
  // Calculate total balance in a base currency (e.g. USD)
  // In a real app, this would use live FX rates
  const totalBalanceUSD = wallets.reduce((acc, w) => {
    let val = parseFloat(w.balance);
    if (w.currency === 'NGN') val /= 1500;
    if (w.currency === 'EUR') val *= 1.08;
    if (w.currency === 'GBP') val *= 1.25;
    return acc + val;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Section with Smart Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <WalletIcon size={32} color="var(--primary)" /> Smart Wallet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Autonomous multi-asset management powered by Paypee AI.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onCreateAccount} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            <Plus size={18} /> New Asset
          </button>
          <button onClick={onRefresh} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            <RefreshCw size={18} /> Sync
          </button>
        </div>
      </div>

      {/* Hero Analytics Card */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(2, 6, 23, 0.4) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '2px', marginBottom: '0.5rem' }}>TOTAL NET WORTH</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
                {showBalances ? `$${totalBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '1.1rem' }}>
                <TrendingUp size={24} /> +4.2%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>vs last 30 days</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Liquidity Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>98/100</div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.75rem' }}>
                <div style={{ width: '98%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Hedging Status</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} /> Active
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Protected against NGN volatility</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Smart Yield</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>$12.45</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Accrued interest this month</div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <BarChart3 size={300} style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.05, color: 'var(--primary)' }} />
      </div>

      {/* Asset Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Assets</h3>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
             <span style={{ color: '#fff', fontWeight: 600, borderBottom: '2px solid var(--primary)', paddingBottom: '0.25rem' }}>All Assets</span>
             <span style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Fiat</span>
             <span style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Crypto</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {wallets.map((w) => {
             const isCrypto = ['BTC', 'USDT', 'USDC'].includes(w.currency);
             return (
               <motion.div 
                 key={w.id}
                 whileHover={{ y: -5 }}
                 transition={{ type: 'spring', stiffness: 300 }}
               >
                 <BalanceCard 
                   currency={w.currency} 
                   symbol={w.currency === 'NGN' ? '₦' : '$'} // Simplification for demo
                   gradient={getGradient(w.currency)}
                   details={w.metadata} 
                   amount={parseFloat(w.balance).toFixed(2)} 
                   userName={userData?.firstName}
                   onSwap={onSwap}
                   onPayout={onPayout}
                   onRefresh={onRefresh}
                   hideBalance={!showBalances}
                 />
               </motion.div>
             );
          })}
        </div>
      </div>

      {/* Smart Actions & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
         <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Zap size={20} color="var(--accent)" /> AI Insights
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>OPPORTUNITY DETECTED</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>USD/NGN rate is at a 7-day high. Swapping 20% of your NGN to USD now could increase your purchasing power.</p>
                  <button onClick={onSwap} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.75rem', cursor: 'pointer', padding: 0 }}>Execute Swap →</button>
               </div>
               <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>TREASURY OPTIMIZATION</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You have $5,400 sitting idle. Moving $2,000 to your 'Education Vault' could earn you 12% APY.</p>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.75rem', cursor: 'pointer', padding: 0 }}>Go to Vaults →</button>
               </div>
            </div>
         </div>

         <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Asset Allocation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {wallets.slice(0, 4).map((w, idx) => (
                 <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                       <span style={{ color: 'var(--text-muted)' }}>{w.currency}</span>
                       <span style={{ fontWeight: 700 }}>{Math.round(Math.random() * 40 + 10)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                       <div style={{ width: `${Math.random() * 80 + 20}%`, height: '100%', background: getGradient(w.currency).split(',')[1], borderRadius: '3px' }} />
                    </div>
                 </div>
               ))}
            </div>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem', fontSize: '0.85rem' }}>View Full Analytics</button>
         </div>
      </div>
    </div>
  );
};

const getGradient = (currency: string) => {
  switch (currency) {
    case 'NGN': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    case 'USD': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    case 'EUR': return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
    case 'GBP': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    case 'USDT': return 'linear-gradient(135deg, #26a17b 0%, #1a7f61 100%)';
    case 'USDC': return 'linear-gradient(135deg, #2775ca 0%, #1a5cad 100%)';
    default: return 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
  }
};

export default SmartWalletView;
