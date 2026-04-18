import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Wallet, 
  CreditCard, 
  Zap, 
  Bitcoin, 
  Globe, 
  Cpu, 
  Terminal, 
  Activity,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  MessageSquare
} from 'lucide-react';
import './NextGen.css';

interface LandingV2Props {
  onAuth: () => void;
  setLandingView: (view: any) => void;
}

const LandingV2: React.FC<LandingV2Props> = ({ onAuth, setLandingView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax transforms
  const yParallaxFast = useTransform(smoothY, [0, 1], [0, -400]);
  const yParallaxSlow = useTransform(smoothY, [0, 1], [0, -150]);
  const scaleHero = useTransform(smoothY, [0, 0.2], [1, 0.9]);
  const opacityHero = useTransform(smoothY, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#020617] text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 1. PERSISTENT SYSTEM BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="liquidity-orb orb-primary" />
        <div className="liquidity-orb orb-secondary" />
        <div className="liquidity-orb orb-purple opacity-30" />
        
        {/* Scanned Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      {/* 2. NAVIGATION (SYSTEM STATUS BAR) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6">
        <div className="container flex justify-between items-center glass-surface !rounded-full !py-3 !px-8 border-white/5 bg-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 glass-surface-glow flex items-center justify-center !rounded-lg bg-indigo-500/10">
              <Zap size={16} className="text-indigo-400 fill-current" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">Paypee</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
             {['Platform', 'Intelligence', 'Treasury', 'Nodes'].map(item => (
               <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">{item}</a>
             ))}
          </div>

          <button className="btn-elite btn-primary-glow !py-2.5 !px-8 !text-xs !rounded-full" onClick={onAuth}>
            Launch Console
          </button>
        </div>
      </nav>

      {/* 3. HERO: THE SYSTEM COCKPIT */}
      <section className="relative min-h-screen flex items-center justify-center z-10 pt-20">
        <motion.div style={{ scale: scaleHero, opacity: opacityHero }} className="container relative">
          
          {/* ASYMMETRICAL DATA ELEMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-10">
                  <Activity size={14} className="text-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Node_01: Online // Global Rails active</span>
                </div>
                
                <h1 className="text-hero mb-10 mix-blend-plus-lighter">
                  Global Finance.<br/>
                  <span className="text-gradient">Unified & Instant.</span>
                </h1>
                
                <p className="text-2xl text-slate-400 max-w-xl leading-snug mb-14 font-medium">
                  The LIVE financial operating system. Multi-layered liquidity, real-time intelligence, and institutional rails in one dashboard.
                </p>
                
                <div className="flex flex-wrap gap-8">
                  <button className="btn-elite btn-primary-glow !rounded-2xl group shadow-[0_20px_60px_rgba(99,102,241,0.5)]" onClick={onAuth}>
                    Initialize Account <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button className="btn-elite btn-outline-glass !rounded-2xl" onClick={() => setLandingView('developer')}>
                    API Interface
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 relative h-[600px]">
               {/* FLOATING SYSTEM MODULES */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 right-0 w-80 glass-surface glass-surface-glow !p-8 bg-indigo-500/5"
               >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Total Treasury</div>
                      <div className="text-4xl font-black italic">$1,284,500.42</div>
                    </div>
                    <TrendingUp size={20} className="text-emerald-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-white/40 uppercase">USD Settlement</span>
                       <span className="text-emerald-400">T+0 Active</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-10 -left-20 w-72 glass-surface !p-6 border-white/5 bg-white/5 backdrop-blur-3xl"
               >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Bitcoin size={20} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black uppercase text-white/30">Asset Liquidity</div>
                       <div className="text-xl font-black italic">42.85 BTC</div>
                    </div>
                  </div>
                  <div className="data-log w-fit">NET_POS: +12.4% [SCANNED]</div>
               </motion.div>

               {/* Live Transaction Snippet */}
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 1 }}
                 className="absolute top-1/2 -right-10 glass-surface !p-4 !rounded-2xl border-white/5 bg-black/40 text-[10px] font-mono"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white/60 uppercase tracking-widest">Incoming: EUR 12,000 via SEPA_Instant</span>
                  </div>
               </motion.div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 4. THE FINANCIAL ENGINE: FEATURE SURFACES */}
      <section className="relative py-48 z-10 overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mb-32">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
               <Layers size={14} className="text-cyan-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Infrastructure Stack</span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.8] mb-12">
               Engineered for <br/>
               <span className="text-gradient">Unlimited Velocity.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Multi-Currency Wallet (Mini Product Preview) */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="lg:col-span-7 glass-surface !p-12 !rounded-[48px] border-white/5 bg-white/5 group relative overflow-hidden h-[600px]"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10">
                 <h3 className="text-4xl font-black italic uppercase mb-6">Unified Treasury</h3>
                 <p className="text-slate-400 text-xl max-w-md leading-relaxed mb-12">Institutional-grade ledger for 50+ currencies. Bridge fiat and digital assets with zero latency.</p>
                 
                 {/* Internal UI Preview */}
                 <div className="glass-surface !p-8 !rounded-3xl border-white/5 bg-black/40 space-y-8">
                    {[
                      { curr: 'USD', bal: '124,500.00', color: '#6366f1' },
                      { curr: 'NGN', bal: '45,000,000.00', color: '#22d3ee' },
                      { curr: 'USDT', bal: '89,420.00', color: '#ec4899' }
                    ].map((w, i) => (
                      <div key={i} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: w.color }} />
                          <div>
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{w.curr} Account</div>
                            <div className="text-2xl font-black italic">{w.bal}</div>
                          </div>
                        </div>
                        <ChevronRight className="text-white/10 group-hover/item:text-white transition-colors" />
                      </div>
                    ))}
                 </div>
               </div>
            </motion.div>

            {/* Virtual Cards (Mini Product Preview) */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="lg:col-span-5 glass-surface !p-12 !rounded-[48px] border-white/5 bg-white/5 group h-[600px] flex flex-col justify-between"
            >
               <div>
                  <h3 className="text-4xl font-black italic uppercase mb-6">Global Issuing</h3>
                  <p className="text-slate-400 text-xl leading-relaxed">Deploy programmable cards instantly. Control spend, manage limits, and authorize nodes in real-time.</p>
               </div>
               <div className="relative h-64 mt-12">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-[32px] rotate-6 shadow-[0_20px_50px_rgba(99,102,241,0.4)] overflow-hidden">
                     <div className="absolute inset-0 bg-black/20" />
                     <div className="p-8 h-full flex flex-col justify-between">
                        <Zap size={32} className="text-white fill-current" />
                        <div>
                           <div className="text-xs font-mono mb-2 tracking-[0.2em]">ENTITY NODE_01</div>
                           <div className="text-2xl font-black italic">4284 •••• •••• 1024</div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-10 -left-4 w-full h-full glass-surface-glow !p-8 backdrop-blur-3xl !rounded-[32px] border-white/20 bg-white/5 -rotate-3 transition-transform group-hover:-rotate-6 group-hover:-translate-x-4">
                     <div className="flex justify-between items-start">
                        <CreditCard size={32} className="text-indigo-400" />
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Virtual V2</div>
                     </div>
                     <div className="mt-12">
                        <div className="text-2xl font-black italic">$24,000.00</div>
                        <div className="text-[9px] font-bold text-white/40 uppercase mt-1">Authorized Spend</div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. THE AI CORE: WEALTH COCKPIT (CENTRAL MODULE) */}
      <section className="relative py-64 z-10 overflow-hidden">
        <div className="container relative">
           <div className="text-center mb-32 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                 <Cpu size={14} className="text-purple-400" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Cognitive Wealth Engine</span>
              </div>
              <h2 className="text-6xl lg:text-9xl font-black italic uppercase leading-[0.8] mb-12">
                 Intelligent <br/>
                 <span className="text-gradient">Command.</span>
              </h2>
              <p className="text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                 Your AI-CFO doesn't just display data—it executes on it. Automated hedging, liquidity optimization, and predictive treasury.
              </p>
           </div>

           <div className="ai-core-container">
              <div className="ai-glow-orb" />
              <div className="glass-surface !p-2 !rounded-[80px] border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.2)] bg-black/60 relative z-10">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[78px]">
                    
                    {/* Insights Feed */}
                    <div className="lg:col-span-5 p-12 border-r border-white/5 bg-white/5">
                       <div className="flex items-center gap-3 mb-12">
                          <Activity size={18} className="text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Live Insights</span>
                       </div>
                       <div className="space-y-8">
                          {[
                            { title: "Volatility Alert", desc: "Detected 2.4% NGN drop forecast. Ready to hedge.", status: "Urgent" },
                            { title: "Yield Optimization", desc: "Suggested move of $200k to Liquid Vault B.", status: "Optimal" },
                            { title: "Risk Mitigation", desc: "Unauthorized attempt on Node_04 blocked.", status: "Secured" }
                          ].map((insight, i) => (
                            <div key={i} className="group cursor-pointer">
                               <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">{insight.status}</div>
                               <h4 className="text-xl font-black italic uppercase mb-2 group-hover:text-indigo-400 transition-colors">{insight.title}</h4>
                               <p className="text-slate-500 text-sm leading-relaxed">{insight.desc}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Chat/Assistant UI */}
                    <div className="lg:col-span-7 p-12 flex flex-col justify-between h-[600px] relative">
                       <div className="absolute top-0 right-0 p-12 opacity-5">
                          <Cpu size={300} className="text-indigo-500" />
                       </div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex gap-4">
                             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                                <MessageSquare size={18} />
                             </div>
                             <div className="glass-surface !p-6 !rounded-2xl !rounded-tl-none border-white/10 bg-white/5 max-w-[80%]">
                                <p className="text-sm font-medium leading-relaxed">System status optimal. I've automatically hedged 12% of your NGN holdings into USDT due to market volatility. Would you like to review the settlement logs?</p>
                             </div>
                          </div>
                          <div className="flex gap-4 justify-end">
                             <div className="glass-surface !p-6 !rounded-2xl !rounded-tr-none border-indigo-500/20 bg-indigo-500/10 max-w-[80%]">
                                <p className="text-sm font-bold text-indigo-400 italic uppercase tracking-wider">Yes, show me the logs.</p>
                             </div>
                          </div>
                       </div>

                       <div className="relative mt-12 z-10">
                          <input 
                            type="text" 
                            placeholder="Execute system command..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-sm font-mono focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/20"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4">
                             <div className="px-3 py-1.5 rounded-lg bg-black/40 text-[10px] font-black text-white/40 border border-white/5">CMD + K</div>
                             <button className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white"><ArrowRight size={18} /></button>
                          </div>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. GLOBAL RAILS: MAP MODULE */}
      <section className="relative py-48 z-10">
         <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                    <Globe size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Global Settlement Layer</span>
                  </div>
                  <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.8] mb-12">
                    Money Moves <br/>
                    <span className="text-gradient">Like a Message.</span>
                  </h2>
                  <p className="text-2xl text-slate-400 leading-relaxed mb-16 font-medium">
                    Bridge the gap between emerging markets and global capital. Instant settlements, zero-fee rails, and automated compliance.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-12">
                     <div>
                        <div className="text-5xl font-black italic mb-2">50+</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Settlement Corridors</div>
                     </div>
                     <div>
                        <div className="text-5xl font-black italic mb-2">12ms</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Average Latency</div>
                     </div>
                  </div>
               </div>
               
               <div className="relative">
                  <div className="absolute -inset-20 bg-indigo-500/10 blur-[150px] rounded-full" />
                  <div className="glass-surface !p-2 !rounded-[60px] border-white/5 bg-white/5 backdrop-blur-3xl overflow-hidden relative z-10">
                     <div className="aspect-square w-full relative">
                        {/* Animated Nodes Map Mockup */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-3/4 h-3/4 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                           <div className="absolute w-full h-full border-2 border-dashed border-indigo-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                 <Globe size={100} className="text-indigo-500/20 mx-auto mb-8" />
                                 <div className="text-[10px] font-black uppercase tracking-[1em] text-white/20">Global Nodes Online</div>
                              </div>
                           </div>
                        </div>
                        
                        {/* Connection Lines/Nodes */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                           <motion.div 
                             key={i}
                             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                             transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                             className="absolute w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]"
                             style={{ 
                               top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 40}%)`,
                               left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 40}%)`,
                             }}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. FOOTER: SYSTEM TERMINAL */}
      <footer className="relative py-32 z-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-24">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 glass-surface flex items-center justify-center !rounded-xl border-indigo-500/20">
                  <Zap size={24} className="text-indigo-400 fill-current" />
                </div>
                <span className="text-4xl font-black italic tracking-tighter uppercase">Paypee</span>
              </div>
              <p className="text-2xl text-slate-400 max-w-lg font-medium leading-relaxed mb-12">
                The global financial operating system for the intelligent economy. Unified, institutional, and lived.
              </p>
              <div className="flex gap-6">
                {[Globe, Terminal, Activity, Layers].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 glass-surface flex items-center justify-center !rounded-2xl border-white/10 hover:border-indigo-500 hover:text-indigo-500 transition-all cursor-pointer">
                    <Icon size={22} />
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Nodes", links: ["Individual", "Business", "Developer", "Institutional"] },
              { title: "Matrix", links: ["Treasury", "Security", "AI Core", "Liquidity"] },
              { title: "Protocol", links: ["API Docs", "SDKs", "Status", "Legal"] }
            ].map((col, i) => (
              <div key={i} className="lg:col-span-2">
                <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">{col.title}</h5>
                <ul className="space-y-6">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-lg font-bold text-slate-500 hover:text-indigo-400 transition-colors italic">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">© 2026 PAYPEE NODE_01 // ALL RIGHTS RESERVED.</div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>SYSTEM_STABLE</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>SECURED_SSL_V4</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
