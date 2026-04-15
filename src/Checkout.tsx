import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  Globe
} from 'lucide-react';

const Checkout = ({ slug, onBack }: { slug: string, onBack: () => void }) => {
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<'CARD' | 'BITCOIN' | 'BANK' | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetch(`https://paypee-api-kmhv.onrender.com/api/pub/payment-links/${slug}`)
      .then(res => res.json())
      .then(data => {
        setLink(data);
        setLoading(false);
      });
  }, [slug]);

  const handlePay = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setPaid(true);
      setLoading(false);
    }, 2000);
  };

  if (loading && !link) return <div style={loaderStyle}>Loading Secure Checkout...</div>;
  if (!link) return <div style={loaderStyle}>Payment Link Expired or Invalid</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={cardStyle}
      >
        {!paid ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={logoWrapperStyle}><Globe size={24} color="#fff" /></div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{link.user.businessName || link.user.firstName}</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{link.title}</p>
            </div>

            <div style={amountDisplaystyle}>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>$</span>
              <span style={{ fontSize: '3.5rem', fontWeight: 900 }}>{parseFloat(link.amount).toFixed(2)}</span>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569', letterSpacing: '0.1em' }}>CHOOSE PAYMENT METHOD</p>
              <PaymentMethod 
                icon={<Zap size={20} />} 
                title="Bitcoin Lightning" 
                desc="Instant confirmation • Low fees"
                active={method === 'BITCOIN'}
                onClick={() => setMethod('BITCOIN')}
              />
              <PaymentMethod 
                icon={<Building2 size={20} />} 
                title="Bank Transfer" 
                desc="Pay via local transfer"
                active={method === 'BANK'}
                onClick={() => setMethod('BANK')}
              />
              <PaymentMethod 
                icon={<CreditCard size={20} />} 
                title="Credit/Debit Card" 
                desc="Secure processing"
                active={method === 'CARD'}
                onClick={() => setMethod('CARD')}
              />
            </div>

            <button 
              onClick={handlePay}
              disabled={!method || loading}
              style={{ ...payButtonStyle, opacity: (!method || loading) ? 0.5 : 1 }}
            >
              {loading ? 'Processing...' : `Pay $${parseFloat(link.amount).toFixed(2)} Now`}
            </button>

            <div style={footerStyle}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Secured by Paypee High-Latency Settlement Engine</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={successIconStyle}>
              <CheckCircle2 size={60} />
            </motion.div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Payment Received</h2>
            <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Your payment of ${parseFloat(link.amount).toFixed(2)} for "{link.title}" was successful.</p>
            <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '2rem' }}>Receipt: #PAY-{(Math.random()*100000).toFixed(0)}</div>
            <button onClick={() => window.location.reload()} style={receiptButtonStyle}>Download Receipt</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const PaymentMethod = ({ icon, title, desc, active, onClick }: any) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
      border: active ? '2px solid var(--primary)' : '2px solid transparent'
    }}
  >
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    <div style={{ flex: 1 }}>
       <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
       <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</div>
    </div>
    <ChevronRight size={18} color="#1e293b" />
  </div>
);

const cardStyle: React.CSSProperties = { background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '32px', padding: '3rem', maxWidth: '450px', width: '100%', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' };
const logoWrapperStyle: React.CSSProperties = { width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' };
const amountDisplaystyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem' };
const payButtonStyle: React.CSSProperties = { width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.2rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' };
const footerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', fontSize: '0.75rem', color: '#475569' };
const loaderStyle: React.CSSProperties = { minHeight: '100vh', background: '#020617', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const successIconStyle: React.CSSProperties = { width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' };
const receiptButtonStyle: React.CSSProperties = { background: 'transparent', border: '1px solid #1e293b', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' };

export default Checkout;
