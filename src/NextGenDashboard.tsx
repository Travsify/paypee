import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  Repeat, 
  Send, 
  PieChart, 
  Shield, 
  Settings, 
  Zap, 
  Bell, 
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Globe,
  Bitcoin,
  Plus,
  Cpu,
  BrainCircuit,
  TrendingUp,
  History,
  Wallet,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import SwapModule from './components/NextGen/SwapModule';
import CardsModule from './components/NextGen/CardsModule';
import BusinessModule from './components/NextGen/BusinessModule';
import TeamModule from './components/NextGen/TeamModule';
import './NextGen.css';

// --- Sub-components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <div className="sidebar glass-panel h-full flex flex-col p-6 overflow-y-auto">
    <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setActiveTab('Treasury')}>
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_20px_var(--primary-glow)]">
        <Zap size={22} fill="currentColor" />
      </div>
      <span className="text-xl font-black italic uppercase tracking-tighter">Paypee</span>
    </div>

    <nav className="flex-1 space-y-2">
      {[
        { icon: <LayoutDashboard size={20} />, label: "Treasury" },
        { icon: <Building2 size={20} />, label: "Business" },
        { icon: <Users size={20} />, label: "Team" },
        { icon: <CreditCard size={20} />, label: "Cards" },
        { icon: <Repeat size={20} />, label: "Swap" },
        { icon: <Send size={20} />, label: "Send" },
        { icon: <PieChart size={20} />, label: "Vaults" },
        { icon: <Shield size={20} />, label: "Security" },
      ].map((item, i) => (
        <button 
          key={i} 
          onClick={() => setActiveTab(item.label)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.label ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-dim hover:bg-white/5 hover:text-white'}`}
        >
          {item.icon}
          <span className="text-sm font-bold">{item.label}</span>
          {activeTab === item.label && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>
      ))}
    </nav>

    <div className="mt-auto space-y-2 border-t border-white/5 pt-6">
      <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-dim hover:bg-white/5 hover:text-white transition-all">
        <Settings size={20} />
        <span className="text-sm font-bold">Settings</span>
      </button>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 mt-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Upgrade to Pro</div>
        <div className="text-xs font-bold text-white mb-4">Get lower FX rates and unlimited virtual cards.</div>
        <button className="w-full py-2 rounded-lg bg-white/10 text-[10px] font-black uppercase hover:bg-white/20 transition-all">View Plans</button>
      </div>
    </div>
  </div>
);

const TreasuryHeader = () => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-4xl font-black italic uppercase tracking-tight mb-2">Unified Treasury</h1>
      <p className="text-text-dim font-medium">Managing your global liquidity across 8 active corridors.</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all relative">
          <Bell size={20} className="text-text-muted" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary border-2 border-bg-deep" />
        </button>
      </div>
      <div className="flex items-center gap-3 pl-4 border-l border-white/5">
        <div className="text-right">
          <div className="text-sm font-black text-white">Alexander S.</div>
          <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Premium Entity</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5">
          <div className="w-full h-full rounded-[10px] bg-bg-deep flex items-center justify-center overflow-hidden">
             <img src="https://i.pravatar.cc/100?u=alex" alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NetWorthChart = () => (
  <div className="h-24 w-full mt-4 flex items-end gap-1">
    {[30, 45, 35, 55, 48, 65, 75, 60, 85, 95].map((h, i) => (
      <motion.div 
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ delay: i * 0.1, duration: 1 }}
        className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-sm"
      />
    ))}
  </div>
);

const BalanceCard = () => (
  <div className="glass-panel p-8 relative overflow-hidden mb-8 group">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      <Globe size={180} className="text-primary" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="stat-label">Net Worth (USD Equivalent)</div>
        <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest">+12.4%</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-end">
        <div>
          <div className="flex items-end gap-4 mb-8">
            <div className="text-6xl font-black italic uppercase tracking-tighter">$142,850.<span className="opacity-30">00</span></div>
            <div className="flex items-center gap-1 text-text-dim mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+$2,400 today</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="btn-nextgen btn-primary">
              <Plus size={18} />
              Add Funds
            </button>
            <button className="btn-nextgen btn-ghost">
              <Send size={18} />
              Send Money
            </button>
            <button className="btn-nextgen btn-ghost">
              <Repeat size={18} />
              Swap
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
           <NetWorthChart />
        </div>
      </div>
    </div>
  </div>
);

const CurrencyGrid = () => {
  const currencies = [
    { code: 'USD', name: 'US Dollar', balance: '42,850.00', icon: '🇺🇸', trend: '+0.2%' },
    { code: 'NGN', name: 'Nigerian Naira', balance: '12,400,000.00', icon: '🇳🇬', trend: '-2.1%' },
    { code: 'EUR', name: 'Euro', balance: '8,210.50', icon: '🇪🇺', trend: '+0.1%' },
    { code: 'BTC', name: 'Bitcoin', balance: '1.2405', icon: '₿', trend: '+5.4%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {currencies.map((curr, i) => (
        <div key={i} className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="text-2xl">{curr.icon}</div>
            <div className={`text-[10px] font-black ${curr.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {curr.trend}
            </div>
          </div>
          <div className="text-xs font-black text-text-dim uppercase tracking-widest mb-1">{curr.code}</div>
          <div className="text-xl font-black italic text-white mb-4">{curr.balance}</div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-primary/40 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

const AIPanel = () => (
  <div className="ai-panel glass-panel h-full flex flex-col p-6 border-l border-white/5">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
        <Cpu size={18} />
      </div>
      <h3 className="text-lg font-black italic uppercase tracking-tight">Paypee AI</h3>
      <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </div>
    </div>

    <div className="flex-1 space-y-6">
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
          <BrainCircuit size={40} className="text-secondary" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3">Treasury Alert</div>
        <h4 className="text-sm font-bold text-white mb-2 leading-relaxed">High NGN Volatility Detected</h4>
        <p className="text-xs text-text-dim leading-relaxed mb-4">I recommend hedging 60% of your NGN balance to USDT to preserve value. Current loss risk: 4.2%.</p>
        <button className="w-full py-3 rounded-xl bg-secondary text-white text-[10px] font-black uppercase shadow-[0_10px_20px_var(--secondary-glow)] hover:scale-[1.02] transition-all">Execute Auto-Hedge</button>
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Opportunity</div>
        <h4 className="text-sm font-bold text-white mb-2">Optimize Cloud Spend</h4>
        <p className="text-xs text-text-dim leading-relaxed">Your AWS billing is currently on a retail card. Switching to a Paypee Business Card could save you $42/mo in FX fees.</p>
      </div>

      <div className="pt-6 border-t border-white/5">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-4">Recent AI Actions</h5>
        <div className="space-y-4">
          {[
            { action: "Converted 2M NGN to USD", time: "2h ago", status: "Secured" },
            { action: "Paid Google Workspace", time: "5h ago", status: "Optimized" },
            { action: "Vault Auto-Funded", time: "Yesterday", status: "Savings" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-white">{item.action}</div>
                <div className="text-[8px] font-medium text-text-dim uppercase tracking-widest">{item.time}</div>
              </div>
              <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-auto">
       <div className="relative">
          <input 
            type="text" 
            placeholder="Ask your financial assistant..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs focus:outline-none focus:border-primary/50 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary p-1 hover:bg-primary/10 rounded-lg transition-all">
            <Send size={16} />
          </button>
       </div>
    </div>
  </div>
);

const ActivityFeed = () => (
  <div className="glass-panel p-8">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-black italic uppercase tracking-tight">Real-Time Activity</h3>
      <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">View All History</button>
    </div>
    <div className="space-y-6">
      {[
        { type: 'out', label: 'Transfer to Goldman Sachs', category: 'Finance', amount: '-$12,400.00', time: '14:20:12', icon: <ArrowUpRight size={18} /> },
        { type: 'in', label: 'Payment from Stripe', category: 'Sales', amount: '+$4,210.50', time: '12:05:44', icon: <ArrowDownLeft size={18} /> },
        { type: 'swap', label: 'Swapped BTC for USDC', category: 'Treasury', amount: '0.45 BTC', time: '09:12:11', icon: <Repeat size={18} /> },
        { type: 'card', label: 'Subscription: OpenAI API', category: 'Ops', amount: '-$1,200.00', time: '04:00:00', icon: <CreditCard size={18} /> },
      ].map((tx, i) => (
        <div key={i} className="flex items-center gap-4 group cursor-pointer">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
            tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 
            tx.type === 'out' ? 'bg-rose-500/10 text-rose-400' :
            tx.type === 'swap' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
          }`}>
            {tx.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-black text-white">{tx.label}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim mt-0.5">{tx.category} • {tx.time}</div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-black ${tx.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</div>
            <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-0.5">Settled</div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <MoreVertical size={16} className="text-text-dim" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TransfersModule = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-12">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
        <Send size={22} />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tight">Global Transfer</h2>
    </div>
    <div className="glass-panel p-10">
      <div className="space-y-12">
        {/* Progress */}
        <div className="flex justify-between items-center px-4 relative">
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2" />
          {[
            { n: 1, l: "Recipient", active: true },
            { n: 2, l: "Amount" },
            { n: 3, l: "Review" },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${s.active ? 'bg-primary text-white' : 'bg-bg-deep border border-white/10 text-text-dim'}`}>{s.n}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${s.active ? 'text-white' : 'text-text-dim'}`}>{s.l}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
           <div className="stat-label">Select Recipient</div>
           <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Goldman Sachs", acc: "**** 9901", flag: "🇺🇸" },
                { name: "Binance Int.", acc: "0x44...f21", flag: "🌐" },
                { name: "Stripe Corp", acc: "**** 1245", flag: "🇺🇸" },
                { name: "Paypee User", acc: "@stride", flag: "⚡" },
              ].map((r, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
                   <div className="flex items-center justify-between mb-4">
                      <div className="text-xl">{r.flag}</div>
                      <ChevronRight size={16} className="text-text-dim" />
                   </div>
                   <div className="text-sm font-black text-white">{r.name}</div>
                   <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1">{r.acc}</div>
                </div>
              ))}
              <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all">
                 <Plus size={24} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Add New</span>
              </div>
           </div>
        </div>

        <button className="w-full py-6 rounded-2xl bg-primary text-white text-lg font-black uppercase tracking-tighter flex items-center justify-center gap-3">
          Continue to Amount
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  </motion.div>
);

const SecurityModule = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Shield size={22} />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tight">Security & Trust</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={18} />
           </div>
           <h4 className="text-lg font-black italic uppercase">Verification Status</h4>
        </div>
        <div className="space-y-6">
           {[
             { l: "Identity Verified", s: "Success", c: "text-emerald-400" },
             { l: "Proof of Address", s: "Success", c: "text-emerald-400" },
             { l: "Business License", s: "Processing", c: "text-amber-400" },
             { l: "Liveness Check", s: "Required", c: "text-primary" },
           ].map((v, i) => (
             <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-sm font-bold text-white">{v.l}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${v.c}`}>{v.s}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="glass-panel p-8">
         <h4 className="text-lg font-black italic uppercase mb-8">Security Logs</h4>
         <div className="space-y-4">
            {[
              { a: "Login from New Device", t: "12:40 PM", l: "Lagos, NG" },
              { a: "API Key Created", t: "Yesterday", l: "192.168.1.1" },
              { a: "Password Reset", t: "2 days ago", l: "London, UK" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <div className="flex-1">
                    <div className="text-xs font-bold text-white">{log.a}</div>
                    <div className="text-[10px] text-text-dim">{log.t} • {log.l}</div>
                 </div>
                 <ChevronRight size={14} className="text-text-dim" />
              </div>
            ))}
         </div>
         <button className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase hover:bg-white/10 transition-all">Enable 2FA Hardware</button>
      </div>
    </div>
  </motion.div>
);

// --- Main Page ---

const NextGenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Treasury');

  return (
    <div className="nextgen-dashboard">
      <div className="nextgen-bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="dashboard-grid relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="h-full overflow-y-auto px-4 custom-scrollbar">
          <TreasuryHeader />
          
          <AnimatePresence mode="wait">
            {activeTab === 'Treasury' && (
              <motion.div key="treasury" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <BalanceCard />
                <CurrencyGrid />
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">
                  <div className="xl:col-span-8">
                    <ActivityFeed />
                  </div>
                  <div className="xl:col-span-4">
                    <div className="glass-panel p-8 h-full flex flex-col">
                        <h3 className="text-lg font-black italic uppercase tracking-tight mb-8">Card Exposure</h3>
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="virtual-card-preview mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform hover:rotate-y-12 transition-transform duration-700">
                            <div className="card-mesh" />
                            <div className="card-glow" />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                              <div className="flex justify-between items-start">
                                <Zap size={32} className="text-primary fill-current" />
                                <div className="font-black italic text-xl">PAYPEE</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold tracking-[0.25em] mb-4">4582 •••• •••• 1024</div>
                                <div className="flex justify-between items-end">
                                  <div>
                                    <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Holder</div>
                                    <div className="text-xs font-black uppercase">Alexander S.</div>
                                  </div>
                                  <div>
                                    <div className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Expiry</div>
                                    <div className="text-xs font-bold">12/28</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <span className="text-xs font-bold text-text-dim uppercase tracking-widest">Global Limit</span>
                                <span className="text-xs font-black">$5,000 / $10,000</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-1/2" />
                            </div>
                            <button className="w-full mt-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase hover:bg-white/10 transition-all" onClick={() => setActiveTab('Cards')}>Manage Card Stack</button>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Cards' && <CardsModule key="cards" />}
            {activeTab === 'Swap' && <SwapModule key="swap" />}
            {activeTab === 'Send' && <TransfersModule key="send" />}
            {activeTab === 'Security' && <SecurityModule key="security" />}
            {activeTab === 'Business' && <BusinessModule key="business" />}
            {activeTab === 'Team' && <TeamModule key="team" />}
            
            {activeTab === 'Vaults' && (
               <motion.div key="vaults" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <PieChart size={22} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tight">Active Vaults</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { name: "Emergency Fund", balance: "12,400.00", color: "var(--primary)" },
                       { name: "Tesla Model S", balance: "4,200.00", color: "var(--secondary)" },
                       { name: "Crypto Treasury", balance: "8,900.00", color: "#fbbf24" },
                     ].map((v, i) => (
                       <div key={i} className="glass-panel p-8 group cursor-pointer hover:border-primary/50 transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <Lock size={22} style={{ color: v.color }} />
                          </div>
                          <h4 className="text-lg font-black italic uppercase mb-2">{v.name}</h4>
                          <div className="text-2xl font-black mb-6">${v.balance}</div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full" style={{ width: '40%', background: v.color }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AIPanel />
      </div>
    </div>
  );
};

export default NextGenDashboard;
