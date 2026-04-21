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
  ArrowRightLeft,
  Lock,
  ExternalLink
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
        padding: '1rem 1.25rem', 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s'
      }}
    >
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-inter)', color: '#fff' }}>{value}</div>
      </div>
      {copied ? <Check size={18} color="var(--accent)" /> : <Copy size={18} color="var(--text-muted)" />}
    </div>
  );
};

const WalletRailItem: React.FC<WalletRailItemProps> = ({ currency, balance, symbol, details, userName, onDelete, onSend, onTopUp, onSwap }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const accNo = details?.iban || details?.accountNumber || details?.account_number || details?.virtual_account_number || details?.address || details?.nuban || details?.accountInformation?.accountNumber || details?.data?.account_number;
  const bankName = details?.accountInformation?.bankName || details?.bankName || details?.bank_name || details?.bank || details?.provider || 'Global Liquidity Hub';
  let accountName = details?.accountInformation?.accountName || details?.accountName || details?.accountHolder;
  if (!accountName || accountName === "Valued Customer" || accountName.includes("Paypee") || accountName.includes("TechStream")) {
    accountName = userName || "Valued Customer";
  }

  const colorMap: Record<string, string> = {
    USD: '#3b82f6',
    EUR: '#6366f1',
    GBP: '#8b5cf6',
    NGN: '#10b981',
    BTC: '#f59e0b',
    USDT: '#26a17b'
  };

  const iconMap: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    NGN: '🇳🇬',
    BTC: '₿',
    USDT: '₮'
  };

  return (
    <motion.div 
      layout
      className="premium-card"
      style={{ 
        padding: 0,
        marginBottom: '1.25rem',
        cursor: 'pointer',
        background: isExpanded ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        overflow: 'hidden'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '18px', 
            background: (colorMap[currency] || '#fff') + '15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            border: `1px solid ${(colorMap[currency] || '#fff')}33`,
            boxShadow: `0 0 20px ${(colorMap[currency] || '#fff')}10`
          }}>
            {iconMap[currency] || <Zap size={24} />}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{currency} Wallet</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>{bankName}</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{symbol}{parseFloat(balance).toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 900, letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} /> LIVE RAIL
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ padding: '0 2rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
                  <CopyValue label="Account Holder" value={accountName} />
                  <CopyValue label="Identification" value={accNo || 'PROVISIONING...'} />
                  <CopyValue label="Institution" value={bankName} />
               </div>

               <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div onClick={(e) => { e.stopPropagation(); if (onSend) onSend(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                     <motion.div whileHover={{ scale: 1.1, background: 'rgba(99, 102, 241, 0.2)' }} whileTap={{ scale: 0.9 }} style={{ width: 56, height: 56, borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.1)' }}>
                        <ArrowUpRight size={24} />
                     </motion.div>
                     <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Payout</span>
                  </div>

                  <div onClick={(e) => { e.stopPropagation(); if (onTopUp) onTopUp(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                     <motion.div whileHover={{ scale: 1.1, background: 'rgba(16, 185, 129, 0.2)' }} whileTap={{ scale: 0.9 }} style={{ width: 56, height: 56, borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.1)' }}>
                        <ArrowDownLeft size={24} />
                     </motion.div>
                     <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Deposit</span>
                  </div>

                  <div onClick={(e) => { e.stopPropagation(); if (onSwap) onSwap(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                     <motion.div whileHover={{ scale: 1.1, background: 'rgba(245, 158, 11, 0.2)' }} whileTap={{ scale: 0.9 }} style={{ width: 56, height: 56, borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.1)' }}>
                        <ArrowRightLeft size={24} />
                     </motion.div>
                     <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Swap</span>
                  </div>
               </div>
               
               <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.03)', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                     <ShieldCheck size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem' }}>Institutional Rail Active</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                        All settlements on this node are secured by regional Tier-1 clearing partners and logged on the immutable Paypee ledger.
                     </div>
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
