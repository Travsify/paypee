import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertCircle, Info, Zap, Sparkles } from 'lucide-react';

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
    SUCCESS: 'var(--accent)',
    WARNING: '#f59e0b',
    INFO: 'var(--primary)'
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle2 size={16} color="var(--accent)" />;
      case 'ERROR': return <AlertCircle size={16} color="#f43f5e" />;
      case 'WARNING': return <Info size={16} color="#f59e0b" />;
      default: return <Zap size={16} color="var(--primary)" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="premium-card"
      style={{ 
        position: 'fixed', 
        top: '6rem', 
        right: '2.5rem', 
        width: '420px', 
        zIndex: 10000, 
        padding: 0,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
        backdropFilter: 'blur(30px)'
      }}
    >
      <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Bell size={20} />
           </div>
           <div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>Security Intel</span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>SMART HELPER</div>
           </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose} 
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '0.6rem', borderRadius: '10px' }}
        >
          <X size={18} />
        </motion.button>
      </div>

      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '1rem 0' }} className="custom-scrollbar">
        {notifications.length === 0 ? (
          <div style={{ padding: '6rem 3rem', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
               <Sparkles size={32} style={{ opacity: 0.2, color: 'var(--primary)' }} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Neutral Operations</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>No anomalous activity detected.</div>
          </div>
        ) : notifications.map(n => (
          <motion.div 
            key={n.id} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              padding: '1.5rem 2rem', 
              borderBottom: '1px solid rgba(255,255,255,0.03)', 
              background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)', 
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            whileHover={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {!n.read && (
               <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: typeColors[n.type] || 'var(--primary)', boxShadow: `0 0 15px ${typeColors[n.type] || 'var(--primary)'}` }} />
            )}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: typeColors[n.type] || 'var(--primary)', 
                marginTop: '0.4rem', 
                flexShrink: 0, 
                boxShadow: `0 0 12px ${typeColors[n.type] || 'var(--primary)'}`,
                animation: !n.read ? 'pulse 2s infinite' : 'none'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '0.5rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {n.title}
                  {getIcon(n.type)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontWeight: 500 }}>{n.message}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                     {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                   </div>
                   {!n.read && (
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>NEW</div>
                   )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
         <button className="btn btn-outline" style={{ width: '100%', borderRadius: '12px', padding: '0.8rem', fontSize: '0.85rem', fontWeight: 900 }}>
            Archive All Activity
         </button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;
