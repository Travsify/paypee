import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, Copy, Check } from 'lucide-react';

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
}

const getAccountNumber = (details: any) => {
  if (!details) return null;
  const flat = details.iban || 
               details.accountNumber || 
               details.account_number || 
               details.virtual_account_number || 
               details.address || 
               details.nuban;
  if (flat) return flat;
  
  if (details.data) {
    return details.data.account_number || 
           details.data.accountNumber || 
           details.data.virtual_account_number || 
           details.data.address;
  }
  return null;
};

const getBankName = (details: any) => {
  if (!details) return null;
  return details.bankName || details.bank_name || details.bank || details.provider;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ currency, symbol, amount, gradient, details, userName, type = 'INDIVIDUAL' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const accNo = getAccountNumber(details);
  const bank = getBankName(details);
  
  // Use specialized account name, or passed userName, or generic fallback
  let accName = details?.accountInformation?.accountName || details?.accountName || details?.accountHolder;
  if (!accName || accName === "Valued Customer" || accName === "Paypee / TechStream Ltd") {
    accName = userName || "Valued Customer";
  }
  
  return (
    <div style={{ perspective: '1000px', minWidth: '320px', height: '200px', cursor: 'pointer' }} onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* FRONT: Balance View */}
        <div style={{ 
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
          padding: '2rem', borderRadius: '24px', background: gradient, color: '#fff', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}><Wallet size={120} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.9 }}>{currency} {type} WALLET</div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>TAP TO VIEW INFO</div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
            <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>{symbol}</span>
            {amount}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>•••• {accNo ? accNo.slice(-4) : 'REFRESH'}</div>
        </div>

        {/* BACK: Account Details View */}
        <div style={{ 
          position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
          padding: '1.5rem', borderRadius: '24px', background: '#ffffff', color: '#0f172a', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column', gap: '0.8rem'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>VIRTUAL SETTLEMENT NODE</div>
             <ShieldCheck size={18} color="var(--primary)" />
           </div>
           
           <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <div style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Account Name</div>
                <CopyButton text={accName} label="Account Name" />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{accName}</div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Account Number</div>
                  <CopyButton text={accNo || ""} label="Account Number" />
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'monospace' }}>{accNo || 'GENERATING...'}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Bank Name</div>
                  <CopyButton text={bank || ""} label="Bank Name" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{bank || 'Provisioning...'}</div>
              </div>
           </div>

           <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: '60%', height: '30px', background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px)', opacity: 0.3 }} />
              <div style={{ fontSize: '0.5rem', fontWeight: 800, opacity: 0.4 }}>SECURE_PAYPEE_LEDGER</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;
