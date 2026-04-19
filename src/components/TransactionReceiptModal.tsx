import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Printer, CheckCircle2, Zap } from 'lucide-react';

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
  const statusColor = transaction.status === 'SUCCESS' || transaction.status === 'COMPLETED' ? '#22d3ee' : '#f43f5e';

  return (
    <AnimatePresence>
      <div className="paypee-modal-overlay" style={{ zIndex: 2000 }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="receipt-container"
          style={{
            background: '#fff',
            color: '#000',
            width: '95%',
            maxWidth: '450px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '32px',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <button 
            onClick={onClose} 
            className="no-print"
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '60px', height: '60px', background: '#6366f1', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap size={32} color="#fff" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Transaction Receipt</h2>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Paypee Global Settlements</div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem', background: 'rgba(0,0,0,0.02)', padding: '2rem', borderRadius: '24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              {isDeposit ? 'Amount Received' : 'Amount Sent'}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>
              {transaction.currency} {parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ color: statusColor, fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
               <CheckCircle2 size={16} /> {transaction.status}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <ReceiptRow label="Transaction Type" value={transaction.type} />
             <ReceiptRow label="Description" value={transaction.desc || (isDeposit ? 'Incoming Settlement' : 'Transfer Payout')} />
             <ReceiptRow label="Date & Time" value={new Date(transaction.createdAt).toLocaleString()} />
             <ReceiptRow label="Reference" value={transaction.reference} />
             <ReceiptRow label="Source Wallet" value={transaction.currency + ' Wallet'} />
             {transaction.metadata?.bankCode && <ReceiptRow label="Destination Bank" value={transaction.metadata.bankCode} />}
             {transaction.metadata?.accountNumber && <ReceiptRow label="Account Number" value={transaction.metadata.accountNumber} />}
          </div>

          <div style={{ borderTop: '2px dashed #e2e8f0', margin: '2.5rem 0', paddingTop: '2rem' }}>
             <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginBottom: '2rem' }}>
                Thank you for using Paypee. For support, contact hi@paypee.co
             </div>
             
             <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handlePrint} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                   <Printer size={18} /> Print
                </button>
                <button onClick={handleShare} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', color: '#000', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>
                   <Share2 size={18} /> Share
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ReceiptRow = ({ label, value }: { label: string, value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
    <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
    <span style={{ fontWeight: 700, fontSize: '0.85rem', textAlign: 'right', maxWidth: '200px', wordBreak: 'break-all' }}>{value}</span>
  </div>
);

export default TransactionReceiptModal;
