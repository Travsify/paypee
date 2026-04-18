import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Code2,
  BarChart4,
  Star,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Wallet,
  Bitcoin,
  Layers,
  Repeat,
  Terminal,
  Lock,
  Users,
  CheckCircle2,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface LandingV2Props {
  onAuth: () => void;
  setLandingView: (view: any) => void;
}

const LandingV2: React.FC<LandingV2Props> = ({ onAuth, setLandingView }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const heroImages = [
    { src: "/hero_finance_africa_1776472358279.png", label: "Global Liquidity" },
    { src: "/virtual_card_paypee_1776472492359.png", label: "Virtual Power" },
    { src: "/diverse_people_paypee_1776472528598.png", label: "Human Centric" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-v2 bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      
      {/* Dynamic Background Liquidity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-pink-500/5 blur-[150px] rounded-full" />
      </div>
      
      {/* 1. HERO SECTION: The Fintech OS */}
      <section className="relative min-h-screen flex items-center pt-32 lg:pt-0 overflow-hidden z-10">
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">The Operating System for Global Money</span>
              </div>
              
              <h1 className="text-7xl lg:text-[130px] font-black leading-[0.8] tracking-tighter italic uppercase mb-10 mix-blend-plus-lighter">
                Global Finance. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-pink-500">Unified & Instant.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-text-dim max-w-xl leading-relaxed mb-12 font-medium">
                The high-fidelity infrastructure for modern value movement. One dashboard for global accounts, virtual cards, and AI-driven wealth intelligence.
              </p>
              
              <div className="flex flex-wrap gap-6 mb-16">
                <button className="btn-nextgen btn-primary !px-16 !py-8 !text-lg !rounded-3xl shadow-[0_20px_60px_rgba(99,102,241,0.4)]" onClick={onAuth}>
                  Get Started <ArrowRight size={22} />
                </button>
                <button className="btn-nextgen btn-ghost !px-12 !py-8 !text-lg !rounded-3xl border-white/10" onClick={() => setLandingView('developer')}>
                  Explore API
                </button>
              </div>

              <div className="flex items-center gap-16 border-t border-white/5 pt-12">
                {[
                  { val: "50+", label: "Countries" },
                  { val: "100ms", label: "Avg Latency" },
                  { val: "100%", label: "Redundancy" }
                ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="text-4xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{stat.val}</div>
                    <div className="text-[10px] uppercase tracking-[0.4em] text-text-dim font-black mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="lg:col-span-5 relative">
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-[60px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative h-[650px] lg:h-[800px] w-full glass-panel !rounded-[60px] !p-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentHeroImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={heroImages[currentHeroImage].src} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-12 left-12 right-12">
                       <div className="glass-panel p-8 !bg-black/40 !backdrop-blur-3xl border-white/10">
                          <div className="text-[10px] uppercase tracking-[0.4em] text-text-dim font-black mb-3">Live Environment</div>
                          <div className="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
                            {heroImages[currentHeroImage].label}
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-400" />
                             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Sockets Active</span>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF: Trusted Infrastructure */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Backed by the world's most robust networks</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
            {['Mastercard', 'Visa', 'Fincra', 'Maplerad', 'Circle', 'Binance'].map((partner) => (
              <span key={partner} className="text-2xl font-black italic tracking-tighter text-white">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES: The Fintech Stack */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-3xl mb-24">
            <div className="badge mb-6">Capabilities</div>
            <h2 className="text-6xl font-black italic uppercase leading-[0.9] mb-8">
              Everything you need to <br/>
              <span className="text-gradient">Move Value Globally.</span>
            </h2>
            <p className="text-xl text-white/40 leading-relaxed font-medium">
              We've abstracted the complexity of banking, cards, and crypto into a single, elegant interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {[
              { title: "Unified Treasury", icon: <Wallet size={32} />, color: "var(--primary)", desc: "Hold and manage 50+ fiat and digital currencies in one frictionless ledger." },
              { title: "Virtual Power", icon: <CreditCard size={32} />, color: "#ec4899", desc: "Issue USD and NGN virtual cards for global subscriptions in seconds." },
              { title: "Global Rails", icon: <Zap size={32} />, color: "#10b981", desc: "Disburse funds to banks and mobile wallets in 100+ countries instantly." },
              { title: "Digital Liquidity", icon: <Bitcoin size={32} />, color: "#f59e0b", desc: "Bridge traditional finance with institutional digital asset liquidity." },
              { title: "Unified API", icon: <Code2 size={32} />, color: "#3b82f6", desc: "The world's most robust financial infrastructure, accessible via one SDK." },
              { title: "AI Intelligence", icon: <Cpu size={32} />, color: "#8b5cf6", desc: "Embedded proactive financial intelligence that monitors treasury health." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -12 }}
                className="glass-panel p-12 group hover:border-primary/50 transition-all"
              >
                <div className="w-16 h-16 rounded-3xl mb-10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3" style={{ background: `${feature.color}15`, color: feature.color, border: `1px solid ${feature.color}30` }}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase mb-6">{feature.title}</h3>
                <p className="text-text-dim leading-relaxed mb-10">{feature.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors cursor-pointer">
                   Node Connection: Stable <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CRYPTO ENGINE: Next-Gen Liquidity */}
      <section className="section-padding relative overflow-hidden bg-white/[0.01] z-10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-panel p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <Bitcoin size={48} className="text-primary/20 animate-pulse group-hover:text-primary/40 transition-colors" />
                </div>
                <div className="mb-12">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Deep Liquidity Matrix</div>
                  <h3 className="text-4xl font-black italic uppercase mb-6">Institutional Swap Engine.</h3>
                  <p className="text-text-dim leading-relaxed mb-10 font-medium">Access deep liquidity pools across major protocols. Settle digital assets with fiat instantly on institutional-grade rails.</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "USDT / NGN", rate: "1,540.20", trend: "+0.2%", provider: "Maplerad" },
                    { label: "BTC / USD", rate: "64,210.50", trend: "-1.1%", provider: "Bitnob" },
                  ].map((pair, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                          {pair.label.split(' / ')[0]}
                        </div>
                        <div>
                           <div className="font-black tracking-tight text-white">{pair.label}</div>
                           <div className="text-[8px] font-black text-text-dim uppercase tracking-widest">via {pair.provider}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-white italic">{pair.rate}</div>
                        <div className={`text-[10px] font-bold ${pair.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{pair.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="btn-nextgen btn-primary w-full mt-10" onClick={onAuth}>Deploy Swap Rail</button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="badge mb-8">Crypto & Web3</div>
              <h2 className="text-6xl font-black italic uppercase leading-[0.95] mb-10">
                Bridge the gap <br/>
                <span className="text-gradient">Traditional & Digital.</span>
              </h2>
              <ul className="space-y-8">
                {[
                  { title: "Universal Liquidity", desc: "Aggregated liquidity from top-tier exchanges for best-price execution." },
                  { title: "Fiat On/Off Ramps", desc: "Seamlessly move from local fiat to digital assets and back in seconds." },
                  { title: "Stablecoin Treasury", desc: "Manage your business treasury in USDC, USDT, and more with full transparency." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                      <Repeat size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black italic uppercase mb-2">{item.title}</h4>
                      <p className="text-white/40 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIRTUAL CARDS: Power in your hands */}
      <section className="section-padding relative z-10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="badge mb-6 mx-auto">Card Issuing</div>
            <h2 className="text-6xl font-black italic uppercase mb-8">The World is <br/> <span className="text-gradient">Your Marketplace.</span></h2>
            <p className="text-text-dim text-lg font-medium">Issue high-fidelity virtual cards in seconds. Pay for global subscriptions, cloud infra, and marketing with institutional-grade controls.</p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="glass-panel p-10 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8">
                    <CreditCard size={24} />
                  </div>
                  <h4 className="text-2xl font-black italic uppercase mb-4">Elastic Limits</h4>
                  <p className="text-text-dim leading-relaxed">Define real-time spending thresholds. Adjust, freeze, or recycle cards with zero latency via API or Console.</p>
                </div>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-bg-deep bg-surface-light flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-bg-deep bg-primary flex items-center justify-center text-[10px] font-black">+14k</div>
                </div>
              </div>

              <div className="lg:scale-110 z-10 group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-[52px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                 <div className="glass-panel !bg-bg-deep !rounded-[48px] p-12 h-[480px] flex flex-col justify-between relative overflow-hidden border-white/10">
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all"></div>
                    <div>
                      <div className="flex justify-between items-start mb-16">
                        <Zap size={40} className="text-primary" />
                        <span className="font-black italic tracking-tighter text-2xl">PAYPEE</span>
                      </div>
                      <div className="space-y-2 mb-12">
                        <div className="text-[10px] uppercase tracking-[0.4em] text-text-dim font-black">Card ID: PP-8842-X</div>
                        <div className="text-2xl font-bold tracking-[0.25em] text-white">4582 •••• •••• 1024</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.4em] text-text-dim font-black mb-1">Entity Holder</div>
                        <div className="text-lg font-black italic uppercase text-white">STRIDE LABS INC.</div>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black italic">
                        PLATINUM RAILS
                      </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-10 flex flex-col justify-between h-[450px]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-8">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-2xl font-black italic uppercase mb-4">Proactive Security</h4>
                  <p className="text-text-dim leading-relaxed">AI-driven fraud detection monitors every byte of transaction data. Automated merchant-lock for high-risk corridors.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-emerald-400" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
                    <span>Safety Score: 98%</span>
                    <span>Monitoring Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     </section>

      {/* 6. GLOBAL TREASURY: 50+ Currencies */}
      <section className="section-padding relative overflow-hidden bg-white/[0.01] z-10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
               <div className="glass-panel !p-12 bg-surface/40 group">
                <div className="flex justify-between items-center mb-12">
                  <h4 className="text-xl font-black italic uppercase tracking-tight">Enterprise Treasury Hub</h4>
                  <Globe size={24} className="text-primary group-hover:rotate-180 transition-transform duration-1000" />
                </div>
                <div className="space-y-6">
                  {[
                    { curr: "USD", name: "US Dollar", amount: "42,850.00", flag: "🇺🇸", trend: "Stable" },
                    { curr: "NGN", name: "Nigerian Naira", amount: "12,400,000.00", flag: "🇳🇬", trend: "+12%" },
                    { curr: "EUR", name: "Euro", amount: "8,210.50", flag: "🇪🇺", trend: "Stable" },
                  ].map((balance, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl">{balance.flag}</div>
                        <div>
                          <div className="font-black text-white italic">{balance.curr}</div>
                          <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{balance.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-white italic">{balance.amount}</div>
                        <div className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{balance.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-nextgen btn-primary w-full mt-10" onClick={onAuth}>Deploy Treasury Node</button>
              </div>
            </div>

            <div>
              <div className="badge mb-8">Unified Treasury</div>
              <h2 className="text-6xl font-black italic uppercase leading-[0.95] mb-10">
                A Unified Ledger for <br/>
                <span className="text-gradient">Every Border.</span>
              </h2>
              <p className="text-xl text-text-dim leading-relaxed font-medium mb-12">
                Abstract away the fragmentation of global banking. Manage your liquidity in one frictionless system that settles in milliseconds.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { val: "T+0", label: "Settlement Speed" },
                  { val: "54", label: "Global Corridors" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 glass-panel border-white/5 bg-white/[0.03] group hover:border-primary/50 transition-all">
                    <div className="text-3xl font-black text-white italic tracking-tighter mb-2 group-hover:text-primary transition-colors">{stat.val}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-text-dim font-black">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEVELOPER EXPERIENCE: Infrastructure as Code */}
      <section className="section-padding relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-[40px] bg-[#0f172a] border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">POST /v1/wallets/create</div>
                </div>
                <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                  <pre className="text-emerald-400">
                    {`{
  "currency": "USD",
  "name": "Treasury_Alpha",
  "metadata": {
    "node": "region_west_1",
    "tier": "enterprise"
  }
}`}
                  </pre>
                  <div className="h-px bg-white/5 my-6" />
                  <pre className="text-white/40">
                    {`// response 201
{
  "id": "wal_01hq92...",
  "status": "active",
  "ledger_id": "ldg_88v..."
}`}
                  </pre>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 glass-card p-6 min-w-[200px] shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black italic uppercase">Docs Ready</div>
                    <div className="text-[10px] text-white/40 font-bold">SDK v4.2.1 Active</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="badge mb-8">Developers</div>
              <h2 className="text-6xl font-black italic uppercase leading-[0.95] mb-10">
                Built by Devs, <br/>
                <span className="text-gradient">For the Visionaries.</span>
              </h2>
              <p className="text-xl text-white/40 leading-relaxed font-medium mb-12">
                Our APIs are designed for reliability and speed. Integrate complex financial flows with a few lines of code.
              </p>
              <ul className="space-y-6">
                {[
                  "Complete SDKs for Node.js, Python, and Go.",
                  "Comprehensive Webhook Engine for real-time events.",
                  "Sandbox environment with mirrored production rails.",
                  "99.99% API Uptime guaranteed by SLA."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    <span className="font-bold text-white/60">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECURITY & COMPLIANCE: Built on Trust */}
      <section className="section-padding relative overflow-hidden bg-white/[0.01]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="badge mb-6 mx-auto">Security</div>
            <h2 className="text-6xl font-black italic uppercase mb-8">Bank-Grade <br/> <span className="text-gradient">Security by Default.</span></h2>
            <p className="text-white/40 text-lg">We maintain the highest standards of data protection and regulatory compliance globally.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "PCI-DSS Level 1", desc: "Highest level of payment security certification." },
              { title: "AES-256 Encryption", desc: "Military-grade encryption for all data at rest and transit." },
              { title: "Global KYC/KYB", desc: "Automated identity verification in 150+ countries." },
              { title: "24/7 Monitoring", desc: "Real-time threat detection and AI-powered fraud prevention." }
            ].map((item, i) => (
              <div key={i} className="p-10 glass-card bg-surface/20 text-center">
                <Lock size={32} className="mx-auto mb-8 text-primary opacity-50" />
                <h4 className="text-xl font-black italic uppercase mb-4">{item.title}</h4>
                <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS: Human Proof */}
      <section className="section-padding relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <div className="badge mb-8">Stories</div>
              <h2 className="text-5xl font-black italic uppercase leading-tight mb-8">
                The New Standard <br/>
                <span className="text-gradient">of Success.</span>
              </h2>
              <div className="flex items-center gap-4 mb-10">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-current" />)}
                </div>
                <span className="font-black italic uppercase text-xs tracking-widest text-white/30">4.9/5 Average Rating</span>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "Sarah Chen", role: "Founder, Stride Labs", quote: "Paypee changed how we handle global payouts. What used to take days now happens in milliseconds." },
                  { name: "Marcus Thorne", role: "CTO, NexaPay", quote: "The API documentation is flawless. We integrated the crypto swap engine in less than 48 hours." }
                ].map((t, i) => (
                  <div key={i} className="glass-card p-10 bg-white/[0.02]">
                    <p className="text-lg text-white/60 italic leading-relaxed mb-10">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${t.name}`} alt="" />
                      </div>
                      <div>
                        <div className="font-black italic uppercase text-white tracking-tight">{t.name}</div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA: Ready to scale? */}
      <section className="section-padding relative">
        <div className="container">
          <div className="glass-card bg-gradient-to-br from-primary/30 to-pink-500/20 p-1 rounded-[64px]">
            <div className="bg-[#020617] rounded-[63px] p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-primary blur-[120px] rounded-full" />
                <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-pink-500 blur-[120px] rounded-full" />
              </div>
              
              <div className="relative z-10">
                <div className="badge mx-auto mb-10">Join the Future</div>
                <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-12">
                  Scale your business <br/>
                  <span className="text-gradient">Beyond Borders.</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
                  <button className="btn btn-primary btn-lg px-16 py-8 rounded-3xl text-xl shadow-2xl shadow-primary/30" onClick={onAuth}>Open Your Account Now</button>
                  <button className="btn btn-outline btn-lg px-14 py-8 rounded-3xl text-xl">Contact Enterprise</button>
                </div>
                <p className="mt-12 text-white/30 font-bold uppercase tracking-[0.3em] text-[10px]">No credit card required. Setup in 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER: Professional Ecosystem */}
      <footer className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-black tracking-tighter italic uppercase">PAYPEE</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-sm">
                Paypee is a financial technology company, not a bank. Banking services are provided by our partner banks.
              </p>
              <div className="flex gap-4 mt-8">
                {[Globe, Repeat, Bitcoin, Users].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
            
            {[
              { title: "Products", links: ["Individual", "Business", "Developer", "Crypto", "Virtual Cards"] },
              { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { title: "Legal", links: ["Terms", "Privacy", "Security", "AML Policy"] }
            ].map((col, i) => (
              <div key={i} className="lg:col-span-2">
                <h5 className="font-black italic uppercase text-xs tracking-widest text-white mb-8">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm font-bold text-white/30 hover:text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 PAYPEE INC. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              <span className="hover:text-white cursor-pointer transition-colors">STATUS: OPERATIONAL</span>
              <span className="hover:text-white cursor-pointer transition-colors">SECURITY: PCI-DSS L1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
