import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  RefreshCcw,
  FileText
} from 'lucide-react';

import { API_BASE } from '../config';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  reference: string;
  desc: string;
  category: string;
  createdAt: string;
}

interface HistoryViewProps {
  onTransactionClick?: (tx: any) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onTransactionClick }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
      setLoading(false);
      setTimeout(() => setRefreshing(false), 800);
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesSearch = (tx.desc?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'var(--accent)';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'DEPOSIT': return <ArrowDownLeft size={22} color="var(--accent)" />;
      case 'WITHDRAWAL': return <ArrowUpRight size={22} color="#ef4444" />;
      case 'TRANSFER': return <ArrowRightLeft size={22} color="var(--primary)" />;
      case 'CARD_PAYMENT': return <CreditCard size={22} color="#8b5cf6" />;
      case 'BILLS': return <Zap size={22} color="#f59e0b" />;
      default: return <Activity size={22} />;
    }
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <FileText size={18} fill="var(--primary)" /> Immutable Audit Trail
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Ledger History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', fontWeight: 500 }}>
            Every regional and global settlement event is logged on the encrypted Paypee ledger.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchTransactions} className="btn btn-outline" style={{ borderRadius: '18px', padding: '1rem 1.5rem' }}>
            <RefreshCcw size={20} className={refreshing ? 'spin-animation' : ''} /> {refreshing ? 'Syncing...' : 'Sync'}
          </button>
          <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900 }}>
            <Download size={20} /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '320px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Filter by reference, description or category..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '4rem', background: 'rgba(255,255,255,0.03)' }}
          />
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', padding: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'BILLS'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{ 
                padding: '0.75rem 1.25rem', 
                background: filterType === type ? 'rgba(99, 102, 241, 0.15)' : 'transparent', 
                border: 'none', 
                borderRadius: '14px', 
                color: filterType === type ? 'var(--primary)' : 'var(--text-muted)', 
                fontWeight: 900, 
                fontSize: '0.8rem', 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {type === 'CARD_PAYMENT' ? 'CARD' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1.75rem 2.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Event / Destination</th>
                <th style={{ padding: '1.75rem 2.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Reference Rail</th>
                <th style={{ padding: '1.75rem 2.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Amount Delta</th>
                <th style={{ padding: '1.75rem 2.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '1.75rem 2.5rem', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '8rem', textAlign: 'center' }}><RefreshCcw className="animate-spin" size={48} color="var(--primary)" /></td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '10rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', opacity: 0.5 }}>
                     <Activity size={60} />
                     <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>No settlement records found</div>
                  </div>
                </td></tr>
              ) : filteredTransactions.map((tx) => (
                <motion.tr 
                  layout
                  key={tx.id} 
                  onClick={() => onTransactionClick?.(tx)}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', cursor: onTransactionClick ? 'pointer' : 'default' }} 
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1.5rem 2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.04)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {getTypeIcon(tx.type)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.01em' }}>{tx.desc || 'Protocol Execution'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{tx.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 2.5rem' }}>
                    <code style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 900, background: 'rgba(99, 102, 241, 0.08)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>{tx.reference}</code>
                  </td>
                  <td style={{ padding: '1.5rem 2.5rem' }}>
                    <div className="text-glow" style={{ fontWeight: 900, fontSize: '1.3rem', color: tx.type === 'DEPOSIT' ? 'var(--accent)' : '#fff' }}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.currency} {parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 2.5rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{new Date(tx.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(tx.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td style={{ padding: '1.5rem 2.5rem' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      fontSize: '0.8rem', 
                      fontWeight: 900, 
                      color: getStatusColor(tx.status),
                      background: `${getStatusColor(tx.status)}15`,
                      padding: '0.5rem 1.25rem',
                      borderRadius: '100px',
                      border: `1px solid ${getStatusColor(tx.status)}30`,
                      letterSpacing: '1px'
                    }}>
                      {tx.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : tx.status === 'PENDING' ? <Clock size={16} /> : <XCircle size={16} />}
                      {tx.status}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Modern Pagination Footer */}
        <div style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Showing <span style={{ color: '#fff' }}>{filteredTransactions.length}</span> results of <span style={{ color: '#fff' }}>{transactions.length}</span> events
           </div>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ width: 44, height: 44, padding: 0, borderRadius: '14px', opacity: 0.5, cursor: 'not-allowed' }}>
                <ChevronLeft size={22} />
              </button>
              <button className="btn btn-outline" style={{ width: 44, height: 44, padding: 0, borderRadius: '14px' }}>
                <ChevronRight size={22} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
