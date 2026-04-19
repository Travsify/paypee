import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, Copy, Check, Trash2, RefreshCw } from 'lucide-react';

const CopyButton = ({ text, label }: { text: string, label: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        padding: '0.2rem 0.5rem', 
        borderRadius: '6px', 
        background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} opacity={0.5} />}
      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: copied ? '#10b981' : 'inherit' }}>
        {copied ? 'COPIED' : 'COPY'}
      </span>
    </motion.div>
  );
};

interface BalanceCardProps {
  currency: string;
  symbol: string;
  amount: string;
  gradient: string;
  details?: any;
  userName?: string;
  type?: 'INDIVIDUAL' | 'BUSINESS' | 'DEVELOPER';
  onDelete?: (id: string) => void;
  onSwap?: () => void;
  onPayout?: () => void;
  onRefresh?: () => void;
}

const getAccountNumber = (details: any) => {
  if (!details) return null;
  let data = details;
  if (typeof details === 'string') {
    try { data = JSON.parse(details); } catch (e) { return null; }
  }
  const flat = data.iban || 
               data.accountNumber || 
               data.account_number || 
               data.virtual_account_number || 
               data.address || 
               data.nuban;
  if (flat) return flat;
  
  if (data.data) {
    return data.data.account_number || 
           data.data.accountNumber || 
           data.data.virtual_account_number || 
           data.data.address;
  }
  return null;
};

const getBankName = (details: any) => {
  if (!details) return null;
  let data = details;
  if (typeof details === 'string') {
    try { data = JSON.parse(details); } catch (e) { return null; }
  }
  return data.bankName || data.bank_name || data.bank || data.provider;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ 
  currency, 
  symbol, 
  amount, 
  gradient, 
  details, 
  userName, 
  type = 'INDIVIDUAL', 
  onDelete,
  onSwap,
  onPayout,
  onRefresh
}) => {
  const accNo = getAccountNumber(details);
  const bank = getBankName(details);
  
  let accName = details?.accountInformation?.accountName || details?.accountName || details?.accountHolder;
  if (!accName || accName === "Valued Customer" || accName === "Paypee / TechStream Ltd") {
    accName = userName || "Valued Customer";
  }
  
  return (
    <div style={{ perspective: '1000px', minWidth: '320px', height: '220px', position: 'relative' }}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ 
          width: '100%', height: '100%', 
          padding: '1.5rem', borderRadius: '24px', 
          background: gradient, color: '#fff', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)', 
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          overflow: 'hidden', position: 'relative'
        }}
      >
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', opacity: 0.05, transform: 'rotate(15deg)' }}>
          <Wallet size={160} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontWeight: 900, fontSize: '1rem' }}>{symbol}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.9 }}>{currency} {type}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {onRefresh && (
              <motion.button 
                whileHover={{ rotate: 180 }}
                onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <RefreshCw size={14} />
              </motion.button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={14} color="#34d399" />
              <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.5px' }}>SECURED</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.2rem', letterSpacing: '-1px' }}>
            <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>{symbol}</span>
            {amount}
          </div>
        </div>

        {/* Actions */}
        {(onSwap || onPayout) && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', position: 'relative', zIndex: 10 }}>
            {onSwap && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSwap(); }}
                style={{ flex: 1, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.6rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}
              >
                Convert
              </button>
            )}
            {onPayout && (
              <button 
                onClick={(e) => { e.stopPropagation(); onPayout(); }}
                style={{ flex: 1, background: '#fff', border: 'none', color: '#000', padding: '0.6rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Withdraw
              </button>
            )}
          </div>
        )}

        {/* Account Details Footer */}

        <div style={{ 
          marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', 
          position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {bank || 'Provisioning Account...'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px' }}>
                {accNo ? accNo.match(/.{1,4}/g)?.join(' ') : '•••• •••• ••••'}
              </div>
              {accNo && <CopyButton text={accNo} label="Copy Account" />}
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.9, marginTop: '0.2rem' }}>{accName}</div>
          </div>
          
          {onDelete && (
            <motion.button 
              whileHover={{ scale: 1.1, background: 'rgba(244, 63, 94, 0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                 e.stopPropagation();
                 const targetId = details?.walletId || details?.id;
                 if (targetId && confirm('Are you sure you want to terminate this rail?')) {
                    onDelete(targetId);
                 }
              }}
              style={{ background: 'rgba(0,0,0,0.1)', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(5px)' }}
            >
              <Trash2 size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;
