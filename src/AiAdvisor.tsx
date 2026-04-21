import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Send as SendIcon, 
  Sparkles, 
  X, 
  MessageSquare, 
  BarChart, 
  Zap,
  Bot,
  Database,
  Shield,
  Activity
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  type?: 'insight' | 'action' | 'normal';
}

const AiAdvisor = ({ transactions = [], userName = 'User' }: { transactions?: any[], userName?: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Hi ${userName}! I am your smart helper. I've checked your money and I'm ready to help. What can I do for you today?`, type: 'normal' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI computing real facts
    setTimeout(() => {
      setIsTyping(false);
      let aiText = "";
      let aiType: Message['type'] = 'normal';
      
      const totalSpend = transactions.filter(t => t.type === 'WITHDRAWAL').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
      const totalIncome = transactions.filter(t => t.type === 'DEPOSIT').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

      const query = input.toLowerCase();
      if (query.includes('spend') || query.includes('spent') || query.includes('burn')) {
         aiText = transactions.length === 0 
           ? "Transaction ledger is currently empty. No spending data available for indexing." 
           : `Money Check Complete: You have spent $${totalSpend.toFixed(2)} and received $${totalIncome.toFixed(2)}. Everything looks good!`;
         aiType = 'insight';
      } else if (query.includes('transfer') || query.includes('send') || query.includes('pay')) {
         aiText = transactions.length === 0 ? "You can't send money until you add some money first." : "Okay, I've got the send money page ready. Please check the details and confirm the send.";
         aiType = 'action';
      } else {
         aiText = `Indexing complete. I currently maintain a record of ${transactions.length} immutable events in your ledger. Would you like a deep-dive into your recent liquidity trends?`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: aiText, type: aiType }]);
    }, 1200);
  };

  return (
    <div style={{ height: 'calc(100vh - 18rem)', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 56, height: 56, background: 'rgba(99, 102, 241, 0.15)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
             <Bot size={32} />
          </div>
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
               <Database size={14} fill="var(--primary)" /> Smart Helper Active
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Your AI Helper</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>COGNITIVE SYNC: 100%</span>
           </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="premium-card custom-scrollbar" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          padding: '2.5rem', 
          background: 'rgba(255,255,255,0.01)',
          borderStyle: 'dashed'
        }}
      >
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  maxWidth: '75%', 
                  padding: '1.5rem', 
                  position: 'relative',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderRadius: m.role === 'user' ? '24px 24px 4px 24px' : '4px 24px 24px 24px',
                  boxShadow: m.role === 'user' ? '0 15px 30px -10px var(--primary-glow)' : 'none'
                }}
              >
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Bot size={14} />
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Helper Response</div>
                  </div>
                )}
                {m.type === 'insight' && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1rem', padding: '0.4rem 0.8rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <Activity size={14} /> ANALYTICS INDEXED
                  </div>
                )}
                {m.type === 'action' && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1rem', padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <Shield size={14} /> SECURITY GATE AUTHORIZED
                  </div>
                )}
                <div style={{ fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.9)' }}>{m.text}</div>
                <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: m.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', fontWeight: 800 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ alignSelf: 'flex-start', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}
              >
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'var(--primary)' }} /> Helper is thinking...
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Ask me anything (like 'How much did I spend?' or 'Help me save money')" 
                className="form-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, padding: '1.4rem', fontSize: '1.1rem', fontWeight: 600 }}
              />
              <button 
                onClick={handleSend} 
                className="btn btn-primary"
                style={{ width: '80px', borderRadius: '18px' }}
              >
                <SendIcon size={24} />
              </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>Command Suggestions:</div>
             <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Check Monthly Spend', 'Send Money', 'Lock Cards', 'Money Summary'].map((s) => (
                  <motion.button 
                    key={s} 
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.06)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(s)} 
                    style={{ 
                      fontSize: '0.85rem', 
                      color: '#fff', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--border)', 
                      padding: '0.6rem 1.25rem', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      fontWeight: 700,
                      transition: 'all 0.2s'
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default AiAdvisor;
