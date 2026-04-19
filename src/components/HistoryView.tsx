import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Zap
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

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('paypee_token');
      const res = await fetch(`${API_BASE}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
      case 'COMPLETED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'DEPOSIT': return <ArrowDownLeft size={20} color="#10b981" />;
      case 'WITHDRAWAL': return <ArrowUpRight size={20} color="#ef4444" />;
      case 'TRANSFER': return <ArrowRightLeft size={20} color="var(--primary)" />;
      case 'CARD_PAYMENT': return <CreditCard size={20} color="#8b5cf6" />;
      case 'BILLS': return <Zap size={20} color="#f59e0b" />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ledger History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Immutable audit trail of all regional and global settlement events.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search reference or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.25rem 1rem 3.5rem', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
          {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PAYMENT', 'BILLS'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{ padding: '0.6rem 1.2rem', background: filterType === type ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: 'none', borderRadius: '12px', color: filterType === type ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {type === 'CARD_PAYMENT' ? 'CARD' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: '#0a0f1e', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
              <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>TRANSACTION</th>
              <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>REFERENCE</th>
              <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>AMOUNT</th>
              <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>DATE</th>
              <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions matching your criteria.</td></tr>
            ) : filteredTransactions.map((tx) => (
              <tr 
                key={tx.id} 
                onClick={() => onTransactionClick?.(tx)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', cursor: onTransactionClick ? 'pointer' : 'default' }} 
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} 
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{tx.desc || 'System Transaction'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tx.category}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, background: 'rgba(99, 102, 241, 0.05)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{tx.reference}</code>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: tx.type === 'DEPOSIT' ? '#10b981' : '#fff' }}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.currency} {parseFloat(tx.amount).toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleTimeString()}</div>
                </td>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: getStatusColor(tx.status) }}>
                    {tx.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : tx.status === 'PENDING' ? <Clock size={16} /> : <XCircle size={16} />}
                    {tx.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination placeholder */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Showing {filteredTransactions.length} of {transactions.length} entries</div>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'not-allowed' }}><ChevronLeft size={18} /></button>
              <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#fff', cursor: 'pointer' }}><ChevronRight size={18} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
