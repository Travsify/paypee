import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building2, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft,
  ArrowRightLeft
} from 'lucide-react';

interface WalletRailItemProps {
  currency: string;
  balance: string;
  symbol: string;
  details: any;
  userName: string;
  onDelete?: (id: string) => void;
  onSend?: () => void;
  onTopUp?: () => void;
  onSwap?: () => void;
}

const CopyValue = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={copy}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.75rem 1rem', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '12px', 
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s'
      }}
    >
      <div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace' }}>{value}</div>
      </div>
      {copied ? <Check size={16} color="var(--accent)" /> : <Copy size={16} color="var(--text-muted)" />}
    </div>
  );
};

const WalletRailItem: React.FC<WalletRailItemProps> = ({ currency, balance, symbol, details, userName, onDelete, onSend, onTopUp, onSwap }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const accNo = details?.iban || details?.accountNumber || details?.account_number || details?.virtual_account_number || details?.address || details?.nuban || details?.accountInformation?.accountNumber || details?.data?.account_number;
  const bankName = details?.accountInformation?.bankName || details?.bankName || details?.bank_name || details?.bank || details?.provider || 'Providus Bank';
  let accountName = details?.accountInformation?.accountName || details?.accountName || details?.accountHolder;
  if (!accountName || accountName === "Valued Customer" || accountName.includes("Paypee") || accountName.includes("TechStream")) {
    accountName = userName || "Valued Customer";
  }

  const colorMap: Record<string, string> = {
    USD: '#3b82f6',
    EUR: '#6366f1',
    GBP: '#8b5cf6',
    NGN: '#10b981',
    BTC: '#f59e0b'
  };

  const iconMap: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    NGN: '🇳🇬',
    BTC: '₿'
  };

  const walletId = details?.walletId || details?.id;

  return (
    <motion.div 
      layout
      style={{ 
        background: '#0a0f1e', 
        borderRadius: '24px', 
        border: '1px solid var(--border)', 
        overflow: 'hidden',
        marginBottom: '1rem',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '16px', 
            background: (colorMap[currency] || '#fff') + '15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            border: `1px solid ${(colorMap[currency] || '#fff')}33`
          }}>
            {iconMap[currency] || <Zap size={20} />}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{currency} Wallet</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{bankName}</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{symbol}{balance}</div>
            <div className="desktop-only" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, letterSpacing: '1px' }}>LIVE</div>
          </div>
          {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '0.5rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                  <CopyValue label="Account Name" value={accountName} />
                  <CopyValue label="Account Number" value={accNo || 'GENERATING...'} />
                  <CopyValue label="Bank / Provider" value={bankName} />
               </div>

               <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
                  <div onClick={(e) => { e.stopPropagation(); if (onSend) onSend(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: '1px solid rgba(99, 102, 241, 0.2)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}>
                        <ArrowUpRight size={20} />
                     </div>
                     <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Send</span>
                  </div>

                  <div onClick={(e) => { e.stopPropagation(); if (onTopUp) onTopUp(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: '1px solid rgba(16, 185, 129, 0.2)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}>
                        <ArrowDownLeft size={20} />
                     </div>
                     <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Top Up</span>
                  </div>

                  <div onClick={(e) => { e.stopPropagation(); if (onSwap) onSwap(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: '1px solid rgba(245, 158, 11, 0.2)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}>
                        <ArrowRightLeft size={20} />
                     </div>
                     <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Swap</span>
                  </div>
               </div>
               
               <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    This constitutes a legal virtual banking node. All transactions are settled via regional T1 partners and stored on the immutable Paypee network ledger.
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletRailItem;
