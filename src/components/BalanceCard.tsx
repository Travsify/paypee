import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Wallet, ShieldCheck, Copy, Check, Trash2, RefreshCw, Zap, ExternalLink } from 'lucide-react';
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
      whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      title={`Copy ${label}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '10px', 
        background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} opacity={0.6} color="#fff" />}
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
  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

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
    <div style={{ perspective: '1500px', width: '100%', height: '100%', minHeight: '320px', position: 'relative' }}>
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        className="holographic-card"
        style={{ 
          rotateX, rotateY,
          width: '100%', height: '100%', 
          padding: '2.5rem', 
          background: gradient, 
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          position: 'relative',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <div className="mesh-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>{symbol}</span>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{currency}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7, letterSpacing: '0.5px' }}>{type} WALLET</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onRefresh && (
              <motion.button 
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                className="btn btn-outline"
                style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none' }}
              >
                <RefreshCw size={18} />
              </motion.button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', color: '#10b981' }}>VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Balance</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: '0.5rem', letterSpacing: '-0.04em' }}>
            <span style={{ fontSize: '1.8rem', opacity: 0.6, fontWeight: 800 }}>{symbol}</span>
            <span className="text-glow" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
              {hideBalance ? '••••••' : parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Actions Row */}
        {(onSwap || onPayout) && (
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem', position: 'relative', zIndex: 10 }}>
            {onSwap && (
              <motion.button 
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); onSwap(); }}
                className="btn btn-outline"
                style={{ flex: 1, padding: '1rem', borderRadius: '18px', fontWeight: 900, fontSize: '0.95rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Instant Swap
              </motion.button>
            )}
            {onPayout && (
              <motion.button 
                whileHover={{ scale: 1.02, background: '#f8fafc' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); onPayout(); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '1rem', borderRadius: '18px', fontWeight: 900, fontSize: '0.95rem', background: '#fff', color: '#000', border: 'none' }}
              >
                Withdraw
              </motion.button>
            )}
          </div>
        )}

        {/* Footer Details */}
        <div style={{ 
          marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.15)', 
          position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 900, 
                padding: '0.4rem 1rem',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                 {bank ? (['USDC', 'USDT', 'BTC', 'PYUSD'].includes(currency.toUpperCase()) ? `${bank.toUpperCase()} NETWORK` : bank.toUpperCase()) : 'PROVISIONING...'}
              </div>
              {bank && <CopyButton text={bank} label="Bank/Network" />}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-inter)', letterSpacing: '1px', color: '#fff' }}>
                {accNo ? (accNo.length > 20 ? accNo.slice(0, 8) + '...' + accNo.slice(-8) : accNo.match(/.{1,4}/g)?.join(' ')) : '•••• •••• ••••'}
              </div>
              {accNo && <CopyButton text={accNo} label="Account/Address" />}
            </div>
            
            {!['USDC', 'USDT', 'BTC', 'PYUSD'].includes(currency.toUpperCase()) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px' }}>{accName}</div>
                {accName && <CopyButton text={accName} label="Account Name" />}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {accNo && (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                style={{ background: '#fff', padding: '0.6rem', borderRadius: '16px', boxShadow: '0 15px 30px rgba(0,0,0,0.4)', cursor: 'pointer' }}
              >
                <QRCodeSVG value={accNo} size={80} />
              </motion.div>
            )}
            
            {onDelete && (
              <motion.button 
                whileHover={{ scale: 1.1, background: 'rgba(244, 63, 94, 0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                   e.stopPropagation();
                   const targetId = details?.walletId || details?.id;
                    if (targetId && confirm('Delete this wallet? This action is irreversible.')) {
                      onDelete(targetId);
                   }
                }}
                className="btn btn-outline"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '12px', width: '100%' }}
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;
