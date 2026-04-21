import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config';
import { 
  Link as LinkIcon, 
  Plus, 
  Copy, 
  ExternalLink, 
  QrCode, 
  MoreVertical,
  Trash2,
  Check,
  Share2,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  X
} from 'lucide-react';

interface PaymentLink {
  id: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  slug: string;
  createdAt: string;
}

const CollectionsView = () => {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/payment-links`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/payment-links`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, amount: parseFloat(amount), description })
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setAmount('');
        setDescription('');
        fetchLinks();
      }
    } catch (err) {
      alert('Error creating link');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/pay/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Globe size={18} fill="var(--primary)" /> Global Capital Ingress
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Collections</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', fontWeight: 500 }}>
            Generate high-conversion payment links to collect capital from clients and partners across the globe.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '1.25rem 2.5rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}
        >
          <Plus size={22} /> New Payment Link
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
          <div className="spinner" style={{ width: 60, height: 60 }} />
        </div>
      ) : links.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card" 
          style={{ padding: '8rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}
        >
          <div className="mesh-bg" style={{ opacity: 0.1 }} />
          <div style={{ width: 100, height: 100, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <LinkIcon size={50} />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>No active ingress channels</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 3rem', lineHeight: 1.7, fontSize: '1.1rem' }}>
            Create your first reusable payment link and start receiving professional-grade settlements in minutes.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-outline" style={{ padding: '1rem 3rem', borderRadius: '18px', fontSize: '1rem' }}>
            Generate Your First Link
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
          {links.map((link) => (
            <motion.div 
              key={link.id}
              whileHover={{ y: -10, scale: 1.02 }}
              className="premium-card"
              style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'rgba(255,255,255,0.01)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(99, 102, 241, 0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <DollarSign size={26} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <motion.button 
                    onClick={() => copyToClipboard(link.slug)} 
                    whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }} 
                    style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: copiedSlug === link.slug ? 'var(--accent)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   >
                     {copiedSlug === link.slug ? <Check size={18} /> : <Copy size={18} />}
                   </motion.button>
                   <button style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <MoreVertical size={18} />
                   </button>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.01em' }}>{link.title}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, fontWeight: 500 }}>{link.description || 'No description provided for this collection rail.'}</p>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>COLLECTION GOAL</div>
                   <div className="text-glow" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{link.currency} {parseFloat(link.amount).toLocaleString()}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>CHANNEL STATUS</div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} /> LIVE
                   </div>
                 </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '1.25rem' }}>
                <button onClick={() => window.open(`/pay/${link.slug}`, '_blank')} className="btn btn-outline" style={{ flex: 1, padding: '1rem', borderRadius: '16px', fontWeight: 900 }}>
                  <ExternalLink size={18} /> Preview
                </button>
                <button className="btn btn-primary" style={{ flex: 1.5, padding: '1rem', borderRadius: '16px', fontWeight: 900 }}>
                  <Share2 size={18} /> Share Channel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '2rem', backdropFilter: 'blur(15px)' }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="premium-card"
              style={{ padding: '3.5rem', width: '100%', maxWidth: '550px', position: 'relative' }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '12px' }}><X size={24} /></button>
              
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} /> Professional Invoicing
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Configure Channel</h3>
              </div>

              <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label className="form-label">COLLECTION TITLE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Q4 Consulting Settlement"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">SETTLEMENT AMOUNT (USD)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ fontSize: '1.75rem', fontWeight: 900, padding: '1.25rem 1.5rem' }}
                  />
                </div>

                <div>
                  <label className="form-label">DESCRIPTION (INTERNAL / EXTERNAL)</label>
                  <textarea 
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Specify the purpose of this settlement rail..."
                    style={{ height: '120px', resize: 'none', paddingTop: '1.25rem' }}
                  />
                </div>

                <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '20px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                   <Zap size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                     This link will generate a secure checkout experience compatible with global card networks and instant wire transfers.
                   </p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '1.25rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900, marginTop: '1rem' }}
                >
                  {submitting ? 'Provisioning Rail...' : 'Authorize Channel Activation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsView;
