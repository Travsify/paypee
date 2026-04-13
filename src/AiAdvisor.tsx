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
  Bot
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  type?: 'insight' | 'action' | 'normal';
}

const AiAdvisor = ({ transactions = [], userName = 'User' }: { transactions?: any[], userName?: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Hello ${userName}! I'm your Paypee AI Intelligence. Ask me anything about your balance, spending, or even request a transfer.`, type: 'normal' }
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
           ? "You have 0 transactions recorded yet. No spending data to analyze!" 
           : `I've analyzed your real traffic. You have spent $${totalSpend.toFixed(2)} and received $${totalIncome.toFixed(2)} based on your transaction history.`;
         aiType = 'insight';
      } else if (query.includes('transfer') || query.includes('send') || query.includes('pay')) {
         aiText = transactions.length === 0 ? "You can't initiate transfers yet because you have no funds." : "Understood. Please go to the Transfers tab to execute money movement securely. I am not authorized to move money outside of API requests.";
         aiType = 'action';
      } else {
         aiText = `As an AI embedded in your finance hub, I can see you have ${transactions.length} total transactions on record. Let me know if you want deeper analytics on them!`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: aiText, type: aiType }]);
    }, 1200);
  };

  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
           <Bot size={28} />
        </div>
        <div>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Financial Advisor</h2>
           <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Powered by Paypee Intelligence Engine</p>
        </div>
      </div>

      <div style={chatContainerStyle} ref={scrollRef}>
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  ...messageStyle, 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  border: m.role === 'assistant' ? '1px solid #1e293b' : 'none',
                  borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px'
                }}
              >
                {m.type === 'insight' && <div style={badgeStyle}><BarChart size={12} /> SPENDING INSIGHT</div>}
                {m.type === 'action' && <div style={{ ...badgeStyle, background: '#10b98122', color: '#10b981' }}><Zap size={12} /> ACTION PREPARED</div>}
                <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{m.text}</div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div style={{ alignSelf: 'flex-start', padding: '1rem', color: '#64748b' }}>AI is thinking...</motion.div>
            )}
          </AnimatePresence>
      </div>

      <div style={inputContainerStyle}>
          <input 
            type="text" 
            placeholder="Ask anything (e.g. 'Show me my burn rate' or 'Send $10 to Sam')" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={inputStyle}
          />
          <button onClick={handleSend} style={sendButtonStyle}><SendIcon size={20} /></button>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
         <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>SUGGESTIONS:</p>
         {['Monthly MRR', 'Card Spend Check', 'Lock Cloud Cards'].map((s) => (
           <button key={s} onClick={() => setInput(s)} style={sugButtonStyle}>{s}</button>
         ))}
      </div>
    </div>
  );
};

const chatContainerStyle: React.CSSProperties = { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '1.5rem' };
const messageStyle: React.CSSProperties = { maxWidth: '80%', padding: '1.25rem', position: 'relative' };
const inputContainerStyle: React.CSSProperties = { display: 'flex', gap: '1rem' };
const inputStyle: React.CSSProperties = { flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.2rem', color: '#fff', outline: 'none' };
const sendButtonStyle: React.CSSProperties = { width: '60px', borderRadius: '16px', background: 'var(--primary)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const badgeStyle: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '0.75rem', padding: '0.3rem 0.6rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' };
const sugButtonStyle: React.CSSProperties = { fontSize: '0.7rem', color: '#64748b', background: 'transparent', border: '1px solid #1e293b', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' };

export default AiAdvisor;
