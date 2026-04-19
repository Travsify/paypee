import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  show: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, show, onClose }) => {
  if (!show) return null;

  const typeColors: Record<string, string> = {
    ERROR: '#f43f5e',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    INFO: '#6366f1'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', 
        top: '5.5rem', 
        right: '2rem', 
        width: '380px', 
        background: '#0a0f1e', 
        border: '1px solid var(--border)', 
        borderRadius: '24px', 
        boxShadow: '0 30px 60px rgba(0,0,0,0.8)', 
        zIndex: 1000, 
        overflow: 'hidden' 
      }}
    >
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <Bell size={18} color="#6366f1" />
           <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>Recent Activity</span>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '50%' }}><X size={16} /></button>
      </div>
      <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
            <Bell size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <div>No activity yet</div>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.03)', position: 'relative' }}>
            {!n.read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: typeColors[n.type] || '#6366f1' }} />}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColors[n.type] || '#6366f1', marginTop: '0.3rem', flexShrink: 0, boxShadow: `0 0 10px ${typeColors[n.type] || '#6366f1'}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {n.title}
                  {n.type === 'SUCCESS' && <CheckCircle2 size={14} color="#10b981" />}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{n.message}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.6rem', fontWeight: 600 }}>{new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
         <button style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View All Activity</button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
