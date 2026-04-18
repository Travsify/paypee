import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  BarChart4, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronRight,
  Plus,
  Zap,
  Briefcase,
  LayoutGrid
} from 'lucide-react';

const BusinessModule: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Building2 size={22} />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tight">Enterprise Console</h1>
          </div>
          <p className="text-text-dim font-medium">Global treasury oversight for <span className="text-white">Stride Labs Inc.</span></p>
        </div>
        <div className="flex items-center gap-4">
           <button className="btn-nextgen btn-ghost">
             <LayoutGrid size={18} />
             Reports
           </button>
           <button className="btn-nextgen btn-primary">
             <Plus size={18} />
             New Disbursement
           </button>
        </div>
      </div>

      {/* Corporate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Aggregate Treasury", value: "$2.4M", trend: "+14%", icon: <Briefcase /> },
          { label: "Team Disbursements", value: "$840k", trend: "+5.2%", icon: <Send /> },
          { label: "Active Nodes", value: "14", trend: "Optimized", icon: <Zap /> },
          { label: "Compliance Score", value: "98/100", trend: "Healthy", icon: <ShieldCheck /> },
        ].map((m, i) => (
          <div key={i} className="glass-panel p-6 group cursor-pointer hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                  {m.icon}
               </div>
               <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{m.trend}</div>
            </div>
            <div className="stat-label mb-1">{m.label}</div>
            <div className="text-3xl font-black italic text-white">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Cash Flow */}
        <div className="xl:col-span-8 space-y-8">
           <div className="glass-panel p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black italic uppercase tracking-tight">Enterprise Liquidity Flow</h3>
                 <div className="flex gap-2">
                    {['1D', '1W', '1M', '1Y'].map(p => (
                      <button key={p} className={`px-3 py-1 rounded-lg text-[10px] font-black ${p === '1M' ? 'bg-primary text-white' : 'bg-white/5 text-text-dim'}`}>{p}</button>
                    ))}
                 </div>
              </div>
              <div className="h-64 w-full flex items-end gap-2">
                 {[40, 60, 45, 80, 55, 90, 70, 100, 85, 110].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                       <div className="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/40 transition-all" style={{ height: `${h}%` }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-deep border border-white/10 px-2 py-1 rounded text-[10px] font-black whitespace-nowrap">
                             +${(h * 10).toLocaleString()}k
                          </div>
                       </div>
                       <span className="text-[8px] font-black text-text-dim">M0{i+1}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-8">
              <h3 className="text-lg font-black italic uppercase tracking-tight mb-8">Recent Payout Reconciliations</h3>
              <div className="space-y-6">
                 {[
                   { entity: "Remote Team Payroll", amount: "$42,000.00", status: "Settled", time: "2h ago" },
                   { entity: "AWS Cloud Services", amount: "$12,450.20", status: "Optimized", time: "5h ago" },
                   { entity: "Marketing - Meta Ads", amount: "$8,000.00", status: "Settled", time: "1d ago" },
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                            <ArrowUpRight size={18} />
                         </div>
                         <div>
                            <div className="text-sm font-black text-white">{p.entity}</div>
                            <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{p.time}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-white">{p.amount}</div>
                         <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{p.status}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Insights */}
        <div className="xl:col-span-4 space-y-8">
           <div className="glass-panel p-8">
              <h3 className="text-lg font-black italic uppercase tracking-tight mb-8">Team Efficiency</h3>
              <div className="space-y-8">
                 {[
                   { label: "Admin Operations", val: 88 },
                   { label: "Finance Approval", val: 94 },
                   { label: "Treasury Sync", val: 72 },
                 ].map((s, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-text-dim">{s.label}</span>
                         <span className="text-white">{s.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${s.val}%` }} 
                            className="h-full bg-primary"
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-8 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                 <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-black italic uppercase mb-4">Node Security</h4>
              <p className="text-xs text-text-dim leading-relaxed mb-6">Your business entity is currently operating on Grade-A rails. All treasury movements are PCI-DSS Level 1 compliant.</p>
              <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase hover:bg-white/10 transition-all">Audit Security Logs</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessModule;
