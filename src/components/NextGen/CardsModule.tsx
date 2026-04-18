import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  BarChart, 
  Settings2,
  Zap,
  Globe,
  MoreHorizontal
} from 'lucide-react';

const CardsModule: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const cards = [
    { id: 1, type: 'BUSINESS', last4: '1024', exp: '12/28', balance: '12,450.00', color: 'var(--primary)' },
    { id: 2, type: 'ADVERTISING', last4: '8842', exp: '08/26', balance: '2,100.50', color: '#ec4899' },
    { id: 3, type: 'OPERATIONS', last4: '9901', exp: '11/27', balance: '4,000.00', color: '#10b981' },
  ];

  return (
    <div className="py-8 px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight mb-2">Virtual Cards</h2>
          <p className="text-text-dim font-medium">Manage your global spending rails with granular control.</p>
        </div>
        <button className="btn-nextgen btn-primary">
          <Plus size={20} />
          Issue New Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Card Stack Selection */}
        <div className="lg:col-span-5 space-y-4">
          {cards.map((card, i) => (
            <motion.div 
              key={card.id}
              onClick={() => setActiveCard(i)}
              whileHover={{ x: 10 }}
              className={`p-6 rounded-3xl cursor-pointer border transition-all ${activeCard === i ? 'bg-white/5 border-primary shadow-[0_0_20px_var(--primary-glow)]' : 'bg-transparent border-white/5 opacity-50 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                  <Zap size={16} style={{ color: card.color }} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-white">{card.type}</div>
                  <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Ending in {card.last4}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">${card.balance}</div>
                  <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">USD</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Card View */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-10 flex flex-col items-center">
            {/* 3D Card Visual */}
            <motion.div 
              key={activeCard}
              initial={{ rotateY: -30, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="virtual-card-preview max-w-md w-full mb-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
              style={{ background: `linear-gradient(135deg, ${cards[activeCard].color}20 0%, #020617 100%)` }}
            >
              <div className="card-mesh" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                   <Zap size={40} style={{ color: cards[activeCard].color }} fill="currentColor" />
                   <div className="font-black italic text-2xl tracking-tighter">PAYPEE</div>
                </div>
                
                <div>
                   <div className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black mb-3">Card Number</div>
                   <div className="text-2xl font-bold tracking-[0.25em] text-white flex items-center gap-4">
                      {showNumbers ? '4582 9901 2341 ' + cards[activeCard].last4 : '•••• •••• •••• ' + cards[activeCard].last4}
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Card Holder</div>
                      <div className="text-sm font-black uppercase italic">ALEXANDER STRIDE</div>
                   </div>
                   <div className="flex gap-8">
                      <div>
                        <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Expires</div>
                        <div className="text-sm font-bold">{cards[activeCard].exp}</div>
                      </div>
                      <div>
                        <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1">CVV</div>
                        <div className="text-sm font-bold">{showNumbers ? '491' : '•••'}</div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Controls */}
            <div className="flex gap-4 mb-12">
               <button 
                  onClick={() => setShowNumbers(!showNumbers)}
                  className="flex flex-col items-center gap-2 group"
               >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                     {showNumbers ? <EyeOff size={22} /> : <Eye size={22} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-white transition-colors">Details</span>
               </button>

               <button 
                  onClick={() => setIsFrozen(!isFrozen)}
                  className="flex flex-col items-center gap-2 group"
               >
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${isFrozen ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'group-hover:bg-primary/20 group-hover:border-primary/50'}`}>
                     {isFrozen ? <Lock size={22} /> : <Unlock size={22} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-white transition-colors">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
               </button>

               <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                     <BarChart size={22} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-white transition-colors">Limits</span>
               </button>

               <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                     <Settings2 size={22} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-white transition-colors">Config</span>
               </button>
            </div>

            {/* Insights Row */}
            <div className="w-full grid grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="stat-label mb-2">Monthly Spend</div>
                  <div className="text-xl font-black italic">$4,210.00</div>
               </div>
               <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="stat-label mb-2">Transactions</div>
                  <div className="text-xl font-black italic">142</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsModule;
