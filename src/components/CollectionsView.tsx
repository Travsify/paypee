import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock
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
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/payment-links', {
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
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/payment-links', {
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
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Collections</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Create reusable payment links and collect global capital instantly.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 30px -10px var(--primary)' }}
        >
          <Plus size={20} /> Create Payment Link
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="spinner" /></div>
      ) : links.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '32px', padding: '6rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
            <LinkIcon size={40} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Zero active links</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>Generate your first payment link to start receiving funds from anywhere in the world.</p>
          <button onClick={() => setIsModalOpen(true)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Generate Link</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {links.map((link) => (
            <motion.div 
              key={link.id}
              whileHover={{ y: -5 }}
              style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '28px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <DollarSign size={22} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <motion.button onClick={() => copyToClipboard(link.slug)} whileHover={{ scale: 1.1 }} style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: copiedSlug === link.slug ? '#10b981' : '#fff', cursor: 'pointer' }}>
                     {copiedSlug === link.slug ? <Check size={16} /> : <Copy size={16} />}
                   </motion.button>
                   <button style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#fff', cursor: 'pointer' }}>
                     <MoreVertical size={16} />
                   </button>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>{link.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{link.description || 'No description provided.'}</p>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>LINK AMOUNT</div>
                   <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{link.currency} {parseFloat(link.amount).toLocaleString()}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>STATUS</div>
                   <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>LIVE & ACTIVE</div>
                 </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button onClick={() => window.open(`/pay/${link.slug}`, '_blank')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <ExternalLink size={16} /> Preview
                </button>
                <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <Share2 size={16} /> Share Link
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="paypee-modal-overlay">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="paypee-modal-content"
              style={{ maxWidth: '520px' }}
            >
              <div style={{ padding: '2.5rem' }}>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Create Payment Link</h3>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Create Payment Link</h3>
               <form onSubmit={handleCreateLink}>
                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '1px' }}>LINK TITLE</label>
                   <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Design Consulting Fee" required style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none' }} />
                 </div>
                 <div style={{ marginBottom: '1.5rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '1px' }}>AMOUNT (USD)</label>
                   <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', fontSize: '1.25rem', fontWeight: 900, outline: 'none' }} />
                 </div>
                 <div style={{ marginBottom: '2rem' }}>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '1px' }}>DESCRIPTION (OPTIONAL)</label>
                   <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add some context for your customer..." style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', color: '#fff', outline: 'none', height: '100px', resize: 'none' }} />
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={submitting} style={{ flex: 2, background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                      {submitting ? 'Creating...' : 'Create Link'}
                    </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsView;
