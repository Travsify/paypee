import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  BarChart3, 
  ArrowUpRight,
  Globe,
  QrCode,
  Smartphone,
  CreditCard,
  History,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const CollectionsDashboard = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Link creation state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/collections/links', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch links:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateLink = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch('https://paypee-api-kmhv.onrender.com/api/collections/links', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, amount: parseFloat(amount), currency, description })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setTitle(''); setAmount(''); setDescription('');
        fetchLinks();
      }
    } catch (err) {
      console.error('Failed to create link:', err);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment Collections</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate secure payment links and receive funds from anyone, anywhere.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Create Payment Link
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={LinkIcon} label="Active Links" value={links.length.toString()} color="#6366f1" />
        <StatCard icon={TrendingUp} label="Total Collected" value="$0.00" color="#10b981" />
        <StatCard icon={BarChart3} label="Conversion Rate" value="0%" color="#f59e0b" />
      </div>

      <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Payment Links</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#fff', cursor: 'pointer' }}>Filter</button>
             <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#fff', cursor: 'pointer' }}>Export</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading links...</div>
        ) : links.length === 0 ? (
          <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't created any payment links yet.</p>
            <button onClick={() => setIsModalOpen(true)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Create Now</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Link Name</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map(link => (
                  <tr key={link.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1.2rem 2rem' }}>
                      <div style={{ fontWeight: 600 }}>{link.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{link.slug}</div>
                    </td>
                    <td style={{ padding: '1.2rem 2rem' }}>
                      <div style={{ fontWeight: 700 }}>{link.currency} {parseFloat(link.amount).toFixed(2)}</div>
                    </td>
                    <td style={{ padding: '1.2rem 2rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>ACTIVE</span>
                    </td>
                    <td style={{ padding: '1.2rem 2rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => copyToClipboard(`https://paypee.me/checkout/${link.slug}`, link.id)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {copiedId === link.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copiedId === link.id ? 'Copied' : 'Copy'}
                        </button>
                        <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal title="Create Payment Link" onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleCreateLink}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>LINK TITLE</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Freelance Invoice #102" required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CURRENCY</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AMOUNT</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DESCRIPTION (OPTIONAL)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this payment for?" style={{ ...inputStyle, height: '80px', resize: 'none' }} />
              </div>
              <button style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Generate Link
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
    <div style={{ width: 48, height: 48, borderRadius: '16px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

const Modal = ({ title, children, onClose }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '480px', position: 'relative' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>{title}</h3>
      {children}
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
    </motion.div>
  </div>
);

const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.8rem 1rem', color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' as const };

export default CollectionsDashboard;
