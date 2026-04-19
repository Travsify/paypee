import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Wallet, ShieldCheck, Copy, Check, Trash2, RefreshCw, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
      title={`Copy ${label}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '8px', 
        background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} opacity={0.6} color="#fff" />}
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
  hideBalance?: boolean;
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
  return data.network || data.bankName || data.bank_name || data.bank || data.provider || data?.data?.network;
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
  onRefresh,
  hideBalance = false
}) => {
  const accNo = getAccountNumber(details);
  const bank = getBankName(details);
  
  let accName = details?.accountInformation?.accountName || details?.accountName || details?.accountHolder;
  if (!accName || accName === "Valued Customer" || accName === "Paypee / TechStream Ltd") {
    accName = userName || "Valued Customer";
  }

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  return (
    <div style={{ perspective: '1200px', minWidth: '360px', height: '100%', minHeight: '280px', position: 'relative' }}>
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, rotateY,
          width: '100%', height: '100%', 
          padding: '2rem', borderRadius: '28px', 
          background: gradient, color: '#fff', 
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', 
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          overflow: 'hidden', position: 'relative'
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <Zap size={180} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>{symbol}</span>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{currency}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.6, letterSpacing: '0.5px' }}>{type} ASSET</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onRefresh && (
              <motion.button 
                whileHover={{ rotate: 180, background: 'rgba(255,255,255,0.2)' }}
                onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <RefreshCw size={16} />
              </motion.button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.5px', color: '#10b981' }}>VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Available Balance</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: '0.4rem', letterSpacing: '-0.04em' }}>
            <span style={{ fontSize: '1.5rem', opacity: 0.6, fontWeight: 700 }}>{symbol}</span>
            <span className="text-glow">{hideBalance ? '••••••' : parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Actions Row */}
        {(onSwap || onPayout) && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', position: 'relative', zIndex: 10 }}>
            {onSwap && (
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onSwap(); }}
                style={{ flex: 1, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.8rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Convert
              </motion.button>
            )}
            {onPayout && (
              <motion.button 
                whileHover={{ scale: 1.05, background: '#f8fafc' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onPayout(); }}
                style={{ flex: 1, background: '#fff', border: 'none', color: '#000', padding: '0.8rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Withdraw
              </motion.button>
            )}
          </div>
        )}

        {/* Footer Details */}
        <div style={{ 
          marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)', 
          position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ 
                fontSize: '0.7rem', 
                fontWeight: 900, 
                padding: '0.3rem 0.8rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {bank ? (['USDC', 'USDT', 'BTC'].includes(currency.toUpperCase()) ? `${bank.toUpperCase()} NETWORK` : bank.toUpperCase()) : 'PROVISIONING...'}
              </div>
              {bank && <CopyButton text={bank} label="Bank/Network" />}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1px', color: 'rgba(255,255,255,0.95)' }}>
                {accNo ? (accNo.length > 20 ? accNo.slice(0, 8) + '...' + accNo.slice(-8) : accNo.match(/.{1,4}/g)?.join(' ')) : '•••• •••• ••••'}
              </div>
              {accNo && <CopyButton text={accNo} label="Account/Address" />}
            </div>
            
            {!['USDC', 'USDT', 'BTC'].includes(currency.toUpperCase()) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8 }}>{accName}</div>
                {accName && <CopyButton text={accName} label="Account Name" />}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {accNo && (
              <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                <QRCodeSVG value={accNo} size={70} />
              </div>
            )}
            
            {onDelete && (
              <motion.button 
                whileHover={{ scale: 1.1, background: 'rgba(244, 63, 94, 0.3)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                   e.stopPropagation();
                   const targetId = details?.walletId || details?.id;
                   if (targetId && confirm('Terminate this asset rail? This action is irreversible.')) {
                      onDelete(targetId);
                   }
                }}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', width: '100%' }}
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;
