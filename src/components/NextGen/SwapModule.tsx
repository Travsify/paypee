import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDown, 
  Repeat, 
  Info, 
  Zap, 
  ChevronDown, 
  TrendingUp,
  ShieldCheck,
  Clock
} from 'lucide-react';

const SwapModule: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('1.5');
  const [toAmount, setToAmount] = useState('2310.30');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <Repeat size={22} />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tight">Institutional Swap</h2>
      </div>

      <div className="glass-panel p-8 space-y-4">
        {/* From Section */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">You Sell</span>
            <span className="text-[10px] font-bold text-text-dim">Balance: 12.50 BTC</span>
          </div>
          <div className="flex items-center justify-between">
            <input 
              type="text" 
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-4xl font-black italic uppercase tracking-tighter w-1/2 focus:outline-none"
            />
            <div className="flex items-center gap-2 p-2 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-xl">₿</span>
              <span className="font-black">BTC</span>
              <ChevronDown size={16} className="text-text-dim" />
            </div>
          </div>
        </div>

        {/* Swap Divider */}
        <div className="relative h-4 flex items-center justify-center">
          <div className="absolute w-full h-px bg-white/5" />
          <button className="relative z-10 w-10 h-10 rounded-full bg-primary border-4 border-bg-deep flex items-center justify-center text-white shadow-[0_0_20px_var(--primary-glow)] hover:rotate-180 transition-transform duration-500">
            <ArrowDown size={18} />
          </button>
        </div>

        {/* To Section */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">You Receive (Est.)</span>
            <span className="text-[10px] font-bold text-text-dim">Balance: 42,850.00 USD</span>
          </div>
          <div className="flex items-center justify-between">
            <input 
              type="text" 
              value={toAmount}
              readOnly
              className="bg-transparent text-4xl font-black italic uppercase tracking-tighter w-1/2 focus:outline-none text-emerald-400"
            />
            <div className="flex items-center gap-2 p-2 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-xl">🇺🇸</span>
              <span className="font-black">USD</span>
              <ChevronDown size={16} className="text-text-dim" />
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
                <TrendingUp size={14} className="text-emerald-400" />
                Rate
             </div>
             <div className="text-xs font-black">1 BTC ≈ $64,210.50 USD</div>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
                <Zap size={14} className="text-primary" />
                Slippage Tolerance
             </div>
             <div className="text-xs font-black">0.05% (Institutional)</div>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
                <Clock size={14} className="text-text-muted" />
                Estimated Time
             </div>
             <div className="text-xs font-black text-emerald-400 italic">Instant Execution</div>
          </div>
        </div>

        <button className="w-full py-6 rounded-2xl bg-primary text-white text-lg font-black uppercase tracking-tighter shadow-[0_20px_40px_var(--primary-glow)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
          Execute Instant Swap
          <Zap size={22} fill="currentColor" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim mt-4">
           <ShieldCheck size={14} className="text-emerald-500" />
           Secured by Paypee Liquidity Engine
        </div>
      </div>
    </motion.div>
  );
};

export default SwapModule;
