import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Printer, CheckCircle2, Zap, Lock, ShieldCheck, Globe, ArrowRight } from 'lucide-react';

interface TransactionReceiptModalProps {
  transaction: any;
  onClose: () => void;
}

const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Paypee Transaction Receipt',
          text: `Receipt for ${transaction.currency} ${transaction.amount} - ${transaction.desc}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Sharing is not supported on this browser');
    }
  };

  const isDeposit = transaction.type === 'DEPOSIT';
  const statusColor = transaction.status === 'SUCCESS' || transaction.status === 'COMPLETED' ? '#10b981' : '#f43f5e';

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30000, padding: '2rem', backdropFilter: 'blur(15px)' }}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="no-print"
          style={{
            background: '#fff',
            color: '#000',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '32px',
            padding: '3rem',
            position: 'relative',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden'
          }}
        >
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100 }}
          >
            <X size={22} color="#000" />
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ padding: '0.6rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
               <ShieldCheck size={16} color="var(--primary)" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>SECURE SETTLEMENT RECEIPT</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.2)' }}>
              <Zap size={40} color="#fff" fill="#fff" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#000' }}>Proof of Payment</h2>
            <div style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>Paypee Global Settlements • Node {Math.floor(1000 + Math.random() * 9000)}</div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3.5rem', background: '#f8fafc', padding: '2.5rem', borderRadius: '28px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.75rem' }}>
              {isDeposit ? 'Net Credits' : 'Net Debits'}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#000', letterSpacing: '-0.04em' }}>
              {transaction.currency} {parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ color: statusColor, fontWeight: 900, fontSize: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <CheckCircle2 size={20} /> {transaction.status}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <ReceiptRow label="Transaction Rail" value={transaction.type} />
             <ReceiptRow label="Protocol Desc" value={transaction.desc || (isDeposit ? 'Incoming Ingress' : 'Egress Payout')} />
             <ReceiptRow label="Timestamp" value={new Date(transaction.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })} />
             <ReceiptRow label="Immutable Ref" value={transaction.reference} />
             
             <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '18px', border: '1px solid #dcfce7' }}>
                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#16a34a', marginBottom: '0.4rem', letterSpacing: '1px' }}>VELOCITY</div>
                   <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#065f46' }}>Instant</div>
                </div>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '18px', border: '1px solid #dbeafe' }}>
                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#2563eb', marginBottom: '0.4rem', letterSpacing: '1px' }}>NETWORKS</div>
                   <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e40af' }}>Global Rail</div>
                </div>
             </div>
          </div>

          <div style={{ borderTop: '2px dashed #e2e8f0', margin: '3rem 0', paddingTop: '2.5rem' }}>
             <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '3rem', lineHeight: 1.7, fontWeight: 500 }}>
                This settlement record is cryptographically signed and stored on the immutable Paypee ledger. For auditing, visit paypee.co/verify
             </div>
             
             <div style={{ display: 'flex', gap: '1.25rem' }}>
                <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, padding: '1.25rem', borderRadius: '20px', background: '#000', border: 'none', fontSize: '1.1rem', fontWeight: 900 }}>
                   <Printer size={20} /> Print Receipt
                </button>
                <button onClick={handleShare} className="btn btn-outline" style={{ flex: 1, padding: '1.25rem', borderRadius: '20px', background: '#f8fafc', color: '#000', border: '1px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 900 }}>
                   <Share2 size={20} /> Share Proof
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ReceiptRow = ({ label, value }: { label: string, value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 700 }}>{label}</span>
    <span style={{ fontWeight: 900, fontSize: '0.95rem', textAlign: 'right', maxWidth: '240px', wordBreak: 'break-all', color: '#000' }}>{value}</span>
  </div>
);

export default TransactionReceiptModal;
