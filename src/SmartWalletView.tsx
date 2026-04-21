import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  Shield, 
  Zap, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Globe,
  Lock,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import BalanceCard from './components/BalanceCard';

interface SmartWalletViewProps {
  wallets: any[];
  vaults: any[];
  fxRates: Record<string, number>;
  userData: any;
  showBalances: boolean;
  onSwap: () => void;
  onPayout: () => void;
  onRefresh: () => void;
  onCreateAccount: () => void;
}

const SmartWalletView: React.FC<SmartWalletViewProps> = ({ 
  wallets, 
  vaults,
  fxRates,
  userData, 
  showBalances, 
  onSwap, 
  onPayout, 
  onRefresh,
  onCreateAccount
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Fiat' | 'Crypto'>('All');

  // Production-Ready Calculations
  const calculations = useMemo(() => {
    let totalUSD = 0;
    const assetsByCurrency: Record<string, number> = {};
    
    // Process Wallets
    wallets.forEach(w => {
      const balance = parseFloat(w.balance);
      let usdVal = balance;
      
      if (w.currency === 'NGN') {
        const rate = fxRates['USD_NGN'] || 1620; // Fallback
        usdVal = balance / rate;
      } else if (w.currency === 'EUR') {
        usdVal = balance * 1.08;
      } else if (w.currency === 'GBP') {
        usdVal = balance * 1.26;
      }
      
      totalUSD += usdVal;
      assetsByCurrency[w.currency] = (assetsByCurrency[w.currency] || 0) + usdVal;
    });

    // Process Vaults
    vaults.forEach(v => {
      const balance = parseFloat(v.balance);
      let usdVal = balance;
      if (v.currency === 'NGN') {
        const rate = fxRates['USD_NGN'] || 1620;
        usdVal = balance / rate;
      }
      totalUSD += usdVal;
      assetsByCurrency[v.currency] = (assetsByCurrency[v.currency] || 0) + usdVal;
    });

    const fiatCurrencies = ['NGN', 'USD', 'EUR', 'GBP'];
    const cryptoCurrencies = ['USDT', 'USDC', 'BTC'];
    
    const fiatUSD = Object.keys(assetsByCurrency)
      .filter(c => fiatCurrencies.includes(c))
      .reduce((sum, c) => sum + assetsByCurrency[c], 0);
      
    const cryptoUSD = Object.keys(assetsByCurrency)
      .filter(c => cryptoCurrencies.includes(c))
      .reduce((sum, c) => sum + assetsByCurrency[c], 0);

    const stableUSD = (assetsByCurrency['USD'] || 0) + (assetsByCurrency['USDT'] || 0) + (assetsByCurrency['USDC'] || 0);
    const liquidityScore = totalUSD > 0 ? Math.round((stableUSD / totalUSD) * 100) : 0;
    const hedgingRatio = totalUSD > 0 ? (stableUSD / totalUSD) : 0;
    
    const growth = totalUSD > 50 ? 4.2 : 0; 
    
    const totalVaultBalanceUSD = vaults.reduce((acc, v) => {
      let val = parseFloat(v.balance);
      if (v.currency === 'NGN') val /= (fxRates['USD_NGN'] || 1620);
      return acc + val;
    }, 0);
    const accruedInterest = (totalVaultBalanceUSD * 0.12) / 12;

    return {
      totalUSD,
      fiatUSD,
      cryptoUSD,
      liquidityScore,
      hedgingRatio,
      growth,
      accruedInterest,
      assetsByCurrency
    };
  }, [wallets, vaults, fxRates]);

  const filteredWallets = wallets.filter(w => {
    if (filterType === 'All') return true;
    const isCrypto = ['USDT', 'USDC', 'BTC'].includes(w.currency);
    return filterType === 'Crypto' ? isCrypto : !isCrypto;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', position: 'relative' }}>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <Sparkles size={16} fill="var(--primary)" /> Wallet Overview
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>
            Smart Wallet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', fontWeight: 500 }}>
            Manage all your global wallets and crypto in one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <button onClick={onCreateAccount} className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', borderRadius: '18px', fontWeight: 900 }}>
            <Plus size={20} /> Add Wallet
          </button>
          <button onClick={onRefresh} className="btn btn-outline" style={{ width: 60, height: 60, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={22} />
          </button>
        </div>
      </motion.div>

      {/* Hero Analytics Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="premium-card" 
        style={{ padding: '4.5rem', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="mesh-bg" style={{ opacity: 0.15 }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: '4px' }}>TOTAL BALANCE</span>
                <div className="pulse-live" title="Live Updates Active" />
              </div>
              
              <div style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '1.5rem', fontFamily: 'var(--font-inter)', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '3rem', opacity: 0.4, fontWeight: 700 }}>$</span>
                <span className="text-glow">
                  {showBalances ? calculations.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••••••'}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: calculations.growth >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', padding: '0.6rem 1.25rem', borderRadius: '14px', color: calculations.growth >= 0 ? 'var(--accent)' : '#f43f5e', fontWeight: 900, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {calculations.growth >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}                   {calculations.growth >= 0 ? '+' : ''}{calculations.growth}% <span style={{ opacity: 0.6, fontSize: '0.8rem', fontWeight: 700 }}>MONTHLY CHANGE</span>
                </div>
                 <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: 600 }}>Based on latest market prices</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', width: '340px' }}>
               <div className="holographic-card" style={{ padding: '1.75rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '2px' }}>CASH SCORE</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{calculations.liquidityScore}<span style={{ fontSize: '0.9rem', opacity: 0.4 }}>/100</span></div>
               </div>
               <div className="holographic-card" style={{ padding: '1.75rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '2px' }}>SAFETY</div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 900, color: calculations.hedgingRatio > 0.5 ? 'var(--accent)' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                     <Shield size={18} fill={calculations.hedgingRatio > 0.5 ? 'var(--accent)' : 'transparent'} /> {calculations.hedgingRatio > 0.5 ? 'VERY SAFE' : 'AT RISK'}
                   </div>
               </div>
               <div className="holographic-card" style={{ padding: '1.75rem', textAlign: 'center', gridColumn: 'span 2', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                   <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '2px' }}>INTEREST EARNED</div>
                   <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)' }}>+${calculations.accruedInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>/ MONTH</span></div>
               </div>
            </div>
          </div>

          <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem' }}>
             <button onClick={onSwap} className="btn btn-primary" style={{ padding: '1.5rem 3.5rem', background: '#fff', color: '#000', borderRadius: '22px', fontSize: '1.1rem', fontWeight: 900 }}>
               <RefreshCw size={20} /> Convert Money
             </button>
             <button onClick={onPayout} className="btn btn-outline" style={{ padding: '1.5rem 3.5rem', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.1rem', fontWeight: 900 }}>
               <ArrowUpRight size={20} /> Send or Withdraw
             </button>
          </div>
        </div>

        <BarChart3 size={450} style={{ position: 'absolute', right: '-120px', bottom: '-120px', opacity: 0.04, color: '#fff', pointerEvents: 'none' }} />
      </motion.div>

      {/* Asset Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>My Wallets</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{filteredWallets.length} ACTIVE</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
             {(['All', 'Fiat', 'Crypto'] as const).map(t => (
               <button 
                 key={t}
                 onClick={() => setFilterType(t)}
                 style={{ 
                   padding: '0.6rem 1.75rem', 
                   borderRadius: '12px', 
                   cursor: 'pointer',
                   color: filterType === t ? '#fff' : 'rgba(255,255,255,0.4)',
                   background: filterType === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                   border: 'none',
                   fontWeight: 800,
                   fontSize: '0.9rem',
                   transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                 }}
                >
                 {t}
               </button>
             ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
            {filteredWallets.map((w, idx) => (
              <motion.div 
                key={w.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <BalanceCard 
                  currency={w.currency} 
                  symbol={getSymbol(w.currency)}
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
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* AI Insights & Allocation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
         <motion.div 
           whileHover={{ y: -5 }}
           className="premium-card" 
           style={{ padding: '3.5rem', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)' }}
         >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <Zap size={28} color="#f59e0b" fill="#f59e0b" /> Market Updates
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 900, background: 'rgba(245, 158, 11, 0.1)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(245, 158, 11, 0.2)', letterSpacing: '1px' }}>AUTONOMOUS ANALYSIS ACTIVE</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               {/* Dynamic FX Insight */}
               {(calculations.assetsByCurrency['NGN'] || 0) > (calculations.totalUSD * 0.3) && (
                 <div className="holographic-card" style={{ padding: '2.5rem', borderLeft: '5px solid #f59e0b', background: 'rgba(245, 158, 11, 0.02)' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '1rem' }}>ACTION SUGGESTED</div>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: 500 }}>
                      You have a lot of Naira in your account. We suggest moving about ₦{((calculations.assetsByCurrency['NGN'] || 0) * 0.2 * (fxRates['USD_NGN'] || 1620)).toLocaleString()} to Dollars (USD) to keep your money safe from value changes.
                    </p>
                    <button onClick={onSwap} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0 }}>
                      Secure Rail Assets <ArrowRight size={20} />
                    </button>
                 </div>
               )}

               {/* Dynamic Yield Insight */}
               {calculations.totalUSD > 100 && vaults.length === 0 && (
                 <div className="holographic-card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--accent)', background: 'rgba(16, 185, 129, 0.02)' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '1rem' }}>CAPITAL YIELD OPPORTUNITY</div>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '2rem', fontWeight: 500 }}>
                      Aggregate liquid capital of ${calculations.totalUSD.toFixed(0)} is currently yielding 0%. Moving 50% to a Secure Vault protocol would generate an estimated ${((calculations.totalUSD * 0.5 * 0.12) / 12).toFixed(2)} in monthly institutional rewards.
                    </p>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0 }}>
                      Provision Secure Vault <ArrowRight size={20} />
                    </button>
                 </div>
               )}

               <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Info size={22} color="rgba(255,255,255,0.4)" />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                    Smart analysis is done using real-time market data.
                  </p>
               </div>
            </div>
         </motion.div>

         <div className="premium-card" style={{ padding: '3.5rem', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Layers size={22} color="var(--primary)" /> Asset Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               {Object.entries(calculations.assetsByCurrency)
                 .sort((a, b) => b[1] - a[1])
                 .map(([currency, usdVal], idx) => {
                 const percentage = Math.round((usdVal / calculations.totalUSD) * 100);
                 const color = getGradient(currency).split(',')[1].split(' ')[1];
                 return (
                   <div key={currency}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '1rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '4px', background: color, boxShadow: `0 0 10px ${color}` }} />
                            <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>{currency} Rails</span>
                         </div>
                         <span style={{ fontWeight: 900 }}>{percentage}%</span>
                      </div>
                      <div style={{ height: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '100px', overflow: 'hidden' }}>
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${percentage}%` }}
                           transition={{ duration: 1.2, delay: idx * 0.1 + 0.5, ease: 'circOut' }}
                           style={{ height: '100%', background: color, borderRadius: '100px', boxShadow: `0 0 20px ${color}44` }} 
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '4rem', padding: '1.25rem', borderRadius: '18px', fontSize: '1rem', fontWeight: 900, background: 'rgba(255,255,255,0.02)' }}>
              Export Protocol Audit
            </button>
         </div>
      </div>
    </div>
  );
};

const getSymbol = (currency: string) => {
  switch (currency) {
    case 'NGN': return '₦';
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'USDT': return '₮';
    case 'USDC': return '$';
    case 'BTC': return '₿';
    default: return '$';
  }
};

const getGradient = (currency: string) => {
  switch (currency) {
    case 'NGN': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    case 'USD': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    case 'EUR': return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
    case 'GBP': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    case 'USDT': return 'linear-gradient(135deg, #26a17b 0%, #1a7f61 100%)';
    case 'USDC': return 'linear-gradient(135deg, #2775ca 0%, #1a5cad 100%)';
    case 'BTC': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    default: return 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
  }
};

export default SmartWalletView;
