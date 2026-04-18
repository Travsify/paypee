import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Wallet, 
  CreditCard, 
  Zap, 
  Bitcoin, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Cpu, 
  Code2, 
  Lock, 
  Activity,
  BarChart3,
  Layers,
  Terminal
} from 'lucide-react';
import './NextGen.css';

interface LandingV2Props {
  onAuth: () => void;
  setLandingView: (view: 'individual' | 'business' | 'developer') => void;
}

const LandingV2: React.FC<LandingV2Props> = ({ onAuth, setLandingView }) => {
  const [activeLayer, setActiveLayer] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothY, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(smoothY, [0, 0.1, 0.9, 1], [1, 1, 1, 0]);

  // Parallax elements
  const y1 = useTransform(smoothY, [0, 1], [0, -200]);
  const y2 = useTransform(smoothY, [0, 1], [0, -500]);
  const rotate = useTransform(smoothY, [0, 1], [0, 5]);

  return (
    <div ref={containerRef} className="nextgen-dashboard bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      
      {/* 1. SYSTEM BACKGROUND (PERSISTENT) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/5 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] bg-accent-cyan/5 blur-[120px] rounded-full" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      {/* 2. NAVIGATION (MINIMAL & ADAPTIVE) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 glass-panel flex items-center justify-center !rounded-xl border-primary/20">
              <Zap size={20} className="text-primary fill-current" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase">Paypee</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 glass-panel !py-3 !px-8 !rounded-full bg-white/5 border-white/5">
             {['Platform', 'Intelligence', 'Infrastructure', 'Treasury'].map(item => (
               <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">{item}</a>
             ))}
          </div>

          <button className="btn-nextgen btn-primary !py-3 !px-8 !rounded-xl" onClick={onAuth}>
            Launch Console
          </button>
        </div>
      </nav>

      {/* 3. HERO: THE SYSTEM CORE */}
      <section className="relative min-h-screen flex items-center justify-center z-10">
        <motion.div style={{ scale, opacity }} className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                  <Activity size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">System Status: Active // Global Rails Online</span>
                </div>
                
                <h1 className="text-massive mb-10 mix-blend-plus-lighter">
                  Global Money.<br/>
                  <span className="text-gradient">Unified OS.</span>
                </h1>
                
                <p className="text-2xl text-text-dim max-w-xl leading-tight mb-12 font-medium">
                  The first high-fidelity financial operating system. Fluid liquidity, real-time intelligence, and institutional infrastructure in one dashboard.
                </p>
                
                <div className="flex flex-wrap gap-8">
                  <button className="btn-nextgen btn-primary !px-16 !py-8 !text-xl !rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.4)] group" onClick={onAuth}>
                    Get Started <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button className="btn-nextgen btn-ghost !px-12 !py-8 !text-xl !rounded-2xl" onClick={() => setLandingView('developer')}>
                    API Console
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
               <motion.div 
                 style={{ y: y1 }}
                 className="relative group cursor-none"
               >
                  <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-50 animate-pulse" />
                  
                  {/* Floating Live Balance Cards */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 -left-12 z-30 glass-panel !p-5 !rounded-2xl border-primary/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-1">USD Balance</div>
                    <div className="text-2xl font-black italic">$12,450.00</div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -right-8 z-30 glass-panel !p-5 !rounded-2xl border-secondary/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-1">Liquidity</div>
                    <div className="text-2xl font-black italic text-secondary">0.42 BTC</div>
                  </motion.div>

                  {/* The AI Core Visual */}
                  <div className="relative glass-panel !p-0 !rounded-[80px] h-[600px] w-full overflow-hidden border-white/10 shadow-2xl">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-deep to-secondary/10" />
                     
                     {/* Floating Data Modules */}
                     <motion.div 
                       animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                       transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                       className="absolute top-12 left-12 glass-panel !p-6 !rounded-3xl border-primary/20 bg-primary/5"
                     >
                        <BarChart3 size={32} className="text-primary" />
                     </motion.div>

                     <motion.div 
                       animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                       transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                       className="absolute bottom-24 right-12 glass-panel !p-6 !rounded-3xl border-secondary/20 bg-secondary/5"
                     >
                        <Bitcoin size={32} className="text-secondary" />
                     </motion.div>

                     {/* Central System HUD */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                           <div className="w-64 h-64 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
                           <div className="absolute inset-0 w-64 h-64 rounded-full border-t-2 border-primary animate-[spin_10s_linear_infinite]" />
                           <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2">AI Core</div>
                              <div className="text-4xl font-black italic uppercase">Active</div>
                           </div>
                        </div>
                     </div>

                     <div className="absolute bottom-12 left-12 right-12 glass-panel !p-8 bg-black/40 backdrop-blur-3xl border-white/5">
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Intelligence Logs</span>
                           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="space-y-3">
                           {[
                             "⚡ CONVERTED NGN → USDT [PREVENT_LOSS]",
                             "📊 OPTIMIZED ENTITY SUBSCRIPTIONS",
                             "💡 ROUTED SWAP VIA MAPLERAD_V2"
                           ].map((log, i) => (
                             <div key={i} className="text-[10px] font-bold text-white/70 font-mono tracking-tight flex items-center gap-2">
                                <span className="text-primary opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. FLUID DATA SURFACE: THE MODULES */}
      <section className="relative py-32 z-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12 items-end justify-between mb-32">
            <div className="max-w-2xl">
              <div className="badge mb-8 !px-6 !py-2 !rounded-full bg-primary/10 text-primary border-primary/20">The Infrastructure</div>
              <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.8] mb-12">
                Engineered for <br/>
                <span className="text-gradient">Total Control.</span>
              </h2>
            </div>
            <p className="text-xl text-text-dim max-w-md font-medium leading-relaxed mb-4">
              Break free from traditional banking silos. Our system provides modular rails for every financial need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { 
                title: "Unified Treasury", 
                icon: <Wallet size={32} />, 
                color: "var(--primary)", 
                desc: "One ledger. 50+ currencies. Instant settlement. The foundation of global finance.",
                stat: "T+0 Settlement"
              },
              { 
                title: "Virtual Issuing", 
                icon: <CreditCard size={32} />, 
                color: "var(--secondary)", 
                desc: "Deploy USD/NGN virtual cards at scale. Instant issuance with deep spend controls.",
                stat: "Unlimited Nodes"
              },
              { 
                title: "Liquid Crypto", 
                icon: <Bitcoin size={32} />, 
                color: "var(--accent-cyan)", 
                desc: "Bridge fiat and crypto instantly. Access deep institutional liquidity on-demand.",
                stat: "0.1% Slippage"
              }
            ].map((module, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20, rotate: i % 2 === 0 ? 1 : -1 }}
                className="glass-panel !p-12 h-[500px] flex flex-col justify-between group hover:border-primary/50 transition-all cursor-pointer overflow-visible"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-colors" />
                
                <div>
                  <div className="w-20 h-20 rounded-[32px] mb-12 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 shadow-2xl" 
                       style={{ background: `${module.color}15`, color: module.color, border: `1px solid ${module.color}30` }}>
                    {module.icon}
                  </div>
                  <h3 className="text-3xl font-black italic uppercase mb-6">{module.title}</h3>
                  <p className="text-text-dim text-lg leading-relaxed mb-8">{module.desc}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{module.stat}</div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE AI STAR: COGNITIVE INTELLIGENCE */}
      <section className="relative py-64 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            
            <div className="relative order-2 lg:order-1">
               <div className="absolute -inset-20 bg-primary/20 blur-[150px] rounded-full animate-pulse" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="w-full aspect-square glass-panel !rounded-full border-primary/20 relative"
               >
                  <div className="absolute inset-12 rounded-full border border-dashed border-white/10" />
                  <div className="absolute inset-24 rounded-full border border-dashed border-white/5" />
                  
                  {/* Floating AI Nodes */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <motion.div 
                      key={i}
                      className="absolute w-20 h-20 glass-panel !rounded-2xl !p-0 flex items-center justify-center border-primary/40 bg-primary/10"
                      style={{ 
                        top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 40}%)`,
                        left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 40}%)`,
                      }}
                    >
                      {i % 2 === 0 ? <Cpu size={24} /> : <Terminal size={24} />}
                    </motion.div>
                  ))}
               </motion.div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-panel !p-12 !rounded-[60px] bg-black/60 backdrop-blur-3xl border-primary/30 shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                     <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-pulse mb-8 mx-auto">
                        <Cpu size={48} className="text-white" />
                     </div>
                     <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4">Neural Engine</div>
                        <div className="text-4xl font-black italic uppercase mb-2">Paypee AI</div>
                        <div className="text-xs font-bold text-text-dim uppercase tracking-widest">Decision Matrix L4</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="badge mb-8 !bg-accent-purple/10 !text-accent-purple !border-accent-purple/20">Cognitive Wealth</div>
              <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.8] mb-12">
                The IQ of <br/>
                <span className="text-gradient">Modern Capital.</span>
              </h2>
              <p className="text-2xl text-text-dim leading-relaxed mb-16 font-medium">
                Our AI doesn't just show data—it acts on it. Automated hedging, liquidity optimization, and predictive treasury management.
              </p>
              
              <div className="space-y-8">
                 {[
                   { title: "Predictive Flows", desc: "Forecast cash flow with 98% accuracy using deep neural analysis." },
                   { title: "Auto-Hedge", desc: "Protect treasury from volatility with real-time currency balancing." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-1.5 h-16 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: '100%' }}
                          transition={{ duration: 1.5, delay: i * 0.5 }}
                          className="w-full bg-accent-purple"
                        />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black italic uppercase mb-2 group-hover:text-accent-purple transition-colors">{item.title}</h4>
                        <p className="text-text-dim text-lg">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM PLATFORM PREVIEW: THE DASHBOARD LAYER */}
      <section className="relative py-32 z-10 overflow-hidden">
         <div className="container">
            <div className="glass-panel !p-2 !rounded-[60px] border-white/10 shadow-2xl overflow-hidden group">
               <div className="relative h-[800px] w-full bg-surface/50 rounded-[58px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent z-10" />
                  
                  {/* Mock Dashboard Preview */}
                  <div className="p-16 grid grid-cols-12 gap-12 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                     <div className="col-span-3 space-y-8">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-12 w-full glass-panel !rounded-xl" />)}
                     </div>
                     <div className="col-span-6 space-y-12">
                        <div className="h-64 w-full glass-panel !rounded-3xl border-primary/20" />
                        <div className="grid grid-cols-2 gap-8">
                           <div className="h-48 glass-panel !rounded-3xl" />
                           <div className="h-48 glass-panel !rounded-3xl" />
                        </div>
                     </div>
                     <div className="col-span-3 space-y-8">
                        <div className="h-96 w-full glass-panel !rounded-3xl bg-primary/5 border-primary/10" />
                        <div className="h-48 w-full glass-panel !rounded-3xl" />
                     </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.8em] text-primary mb-10">Interface Preview</div>
                        <h2 className="text-7xl font-black italic uppercase mb-12">One System. <br/> Unlimited Scale.</h2>
                        <button className="btn-nextgen btn-primary !px-16 !py-8 !text-xl !rounded-2xl mx-auto" onClick={onAuth}>
                           Enter the System
                        </button>
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
                <div className="w-12 h-12 glass-panel flex items-center justify-center !rounded-xl border-primary/20">
                  <Zap size={24} className="text-primary fill-current" />
                </div>
                <span className="text-4xl font-black italic tracking-tighter uppercase">Paypee</span>
              </div>
              <p className="text-2xl text-text-dim max-w-lg font-medium leading-relaxed mb-12">
                The global operating system for value movement. Unified, institutional, and AI-first.
              </p>
              <div className="flex gap-6">
                {[Globe, Terminal, Code2, Layers].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 glass-panel flex items-center justify-center !rounded-2xl border-white/10 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <Icon size={22} />
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Nodes", links: ["Individual", "Business", "Developer", "Crypto"] },
              { title: "Matrix", links: ["Treasury", "Security", "AI Core", "Virtual Cards"] },
              { title: "Protocol", links: ["API Docs", "SDKs", "Status", "Legal"] }
            ].map((col, i) => (
              <div key={i} className="lg:col-span-2">
                <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">{col.title}</h5>
                <ul className="space-y-6">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-lg font-bold text-text-dim hover:text-primary transition-colors italic">{link}</a>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
