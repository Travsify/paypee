import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings2, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Mail,
  ShieldAlert,
  Search,
  ChevronDown
} from 'lucide-react';

const TeamModule: React.FC = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Alexander Stride', email: 'alex@stridelabs.io', role: 'Owner', status: 'Active', avatar: 'https://i.pravatar.cc/100?u=alex' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@stridelabs.io', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/100?u=sarah' },
    { id: 3, name: 'Marcus Thorne', email: 'marcus@stridelabs.io', role: 'Accountant', status: 'Active', avatar: 'https://i.pravatar.cc/100?u=marcus' },
    { id: 4, name: 'Elena Rodriguez', email: 'elena@stridelabs.io', role: 'Viewer', status: 'Pending', avatar: 'https://i.pravatar.cc/100?u=elena' },
  ]);

  const roles = [
    { name: 'Owner', desc: 'Full treasury control & entity management', color: 'text-primary' },
    { name: 'Admin', desc: 'Can manage team & approve payouts', color: 'text-emerald-400' },
    { name: 'Accountant', desc: 'Can view reports & prepare payments', color: 'text-amber-400' },
    { name: 'Viewer', desc: 'Read-only access to treasury hubs', color: 'text-text-dim' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-8 py-8"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight mb-2">Team Governance</h2>
          <p className="text-text-dim font-medium">Define access controls and monitor team-wide financial activity.</p>
        </div>
        <button className="btn-nextgen btn-primary">
          <UserPlus size={20} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Members List */}
        <div className="lg:col-span-8">
          <div className="glass-panel overflow-hidden">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                   <div className="relative w-full max-w-xs">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                      <input 
                        type="text" 
                        placeholder="Search members..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-primary/50"
                      />
                   </div>
                   <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      Role: All <ChevronDown size={14} />
                   </button>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-dim">4 Members Active</div>
             </div>

             <div className="divide-y divide-white/5">
                {members.map((m) => (
                  <div key={m.id} className="p-6 flex items-center gap-6 hover:bg-white/[0.02] transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 p-0.5">
                        <img src={m.avatar} alt={m.name} className="w-full h-full rounded-[10px] object-cover" />
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-black text-white">{m.name}</div>
                        <div className="text-xs text-text-dim font-medium">{m.email}</div>
                     </div>
                     <div className="w-32">
                        <div className={`text-[10px] font-black uppercase tracking-widest ${m.role === 'Owner' ? 'text-primary' : 'text-white'}`}>{m.role}</div>
                     </div>
                     <div className="w-24">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{m.status}</span>
                        </div>
                     </div>
                     <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={18} className="text-text-dim" />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-8">
              <h3 className="text-lg font-black italic uppercase tracking-tight mb-6 flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Role Definitions
              </h3>
              <div className="space-y-6">
                 {roles.map((r, i) => (
                   <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${r.color}`}>{r.name}</div>
                      <p className="text-xs text-text-dim leading-relaxed font-medium">{r.desc}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-8 bg-rose-500/5 border-rose-500/10">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldAlert size={20} className="text-rose-400" />
                 <h4 className="text-sm font-black italic uppercase tracking-tight">Security Protocol</h4>
              </div>
              <p className="text-xs text-text-dim leading-relaxed mb-6">Multi-signature approvals are enabled for all payouts exceeding <span className="text-white">$10,000.00</span>. Requires 2/3 Admin approvals.</p>
              <button className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all">Review Config</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamModule;
