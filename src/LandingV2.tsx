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
  Bitcoin
} from 'lucide-react';

interface LandingV2Props {
  onAuth: () => void;
}

const LandingV2: React.FC<LandingV2Props> = ({ onAuth }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const heroImages = [
    { src: "/hero_finance_africa_1776472358279.png", label: "Global Finance" },
    { src: "/virtual_card_paypee_1776472492359.png", label: "Virtual Power" },
    { src: "/diverse_people_paypee_1776472528598.png", label: "Inclusive Banking" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { 
      title: "Global Liquidity", 
      desc: "Instant access to local and international currency liquidity across 50+ countries.",
      icon: <Globe size={24} />,
      gradient: "from-primary to-indigo-400"
    },
    { 
      title: "Unified Infrastructure", 
      desc: "A single API for cards, accounts, and cross-border settlement rails.",
      icon: <Cpu size={24} />,
      gradient: "from-emerald-400 to-teal-500"
    },
    { 
      title: "Digital Assets", 
      desc: "Seamlessly bridge traditional finance with next-gen digital asset liquidity.",
      icon: <Bitcoin size={24} />,
      gradient: "from-pink-500 to-rose-400"
    }
  ];

  return (
    <div className="landing-v2">
      {/* Premium Multi-Image Hero Section */}
      <section className="relative min-h-[100vh] lg:min-h-[95vh] flex items-center pt-24 overflow-hidden">
        <div className="hero-glow"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 stagger-load"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="badge py-2 px-4 bg-primary/10 border-primary/20 text-primary animate-pulse">
                  <Star size={14} className="fill-current" /> 
                  <span className="ml-2 font-black tracking-widest text-[10px] uppercase">The Fintech Operating System</span>
                </div>
              </div>
              <h1 className="mb-10 leading-[0.9] tracking-tighter text-6xl lg:text-8xl font-black">
                Global Finance. <br/>
                <span className="text-gradient">Unified & Instant.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/50 mb-14 max-w-xl leading-relaxed">
                Empowering businesses and creators with the infrastructure to move value anywhere, anytime. One platform for cards, accounts, and global liquidity.
              </p>
              
              <div className="flex flex-wrap gap-5 lg:gap-8 mb-20">
                <button className="btn btn-primary btn-lg px-12 py-5 rounded-2xl group w-full sm:w-auto text-lg shadow-[0_20px_40px_rgba(99,102,241,0.3)]" onClick={onAuth}>
                  Get Started <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn btn-outline btn-lg px-12 py-5 rounded-2xl w-full sm:w-auto text-lg border-white/10 hover:bg-white/5">
                  API Reference
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
                <div>
                  <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter">50+</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black mt-2">Countries</div>
                </div>
                <div>
                  <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter">120ms</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black mt-2">API Latency</div>
                </div>
                <div>
                  <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter">99.9%</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black mt-2">Reliability</div>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Animated Hero Visual */}
            <div className="lg:col-span-6 relative h-[500px] lg:h-[700px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroImage}
                    initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.05, rotateY: -15 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full hero-image-container premium-border shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                  >
                    <img 
                      src={heroImages[currentHeroImage].src} 
                      alt="" // Decorative for the visual layout
                      className="w-full h-full object-cover rounded-[56px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[56px]" />
                    
                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-white/40 font-black mb-3">Live Environment</div>
                        <div className="text-3xl font-black text-white tracking-tight">
                          {heroImages[currentHeroImage].label}
                        </div>
                      </div>
                      <div className="badge py-2 px-4 bg-white/10 backdrop-blur-xl border-white/20 text-white font-bold text-[10px] tracking-widest uppercase">
                        SECURE Rails
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Indicators */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                  {heroImages.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentHeroImage(i)}
                      className={`w-1 h-16 rounded-full transition-all duration-700 ${currentHeroImage === i ? 'bg-primary h-24' : 'bg-white/5 hover:bg-white/20'}`}
                    />
                  ))}
                </div>

                {/* Micro-Interaction: Live Transaction Feed */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 glass-card p-6 min-w-[280px] hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Instant Swap</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">NGN &rarr; USD Successful</div>
                    </div>
                  </div>
                </motion.div>

                {/* Micro-Interaction: Global Nodes */}
                <motion.div 
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-6 -right-6 glass-card p-6 min-w-[240px] hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Universal Reach</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">54+ Nodes Active</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Capabilities Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-24 stagger-load">
            <div className="badge mx-auto mb-6">Capabilities</div>
            <h2 className="mb-6 leading-tight">Everything you need to <br/> <span className="text-gradient">Scale Global Finance.</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">From individual wallets to enterprise-grade treasury systems, we provide the full stack.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Multi-Currency Wallets", 
                desc: "Hold, manage, and settle in 50+ fiat currencies and digital assets in one unified ledger.",
                icon: <Wallet size={32} />,
                color: "var(--primary)"
              },
              { 
                title: "Global Payouts", 
                desc: "Disburse funds to billions of bank accounts and mobile wallets globally with T+0 settlement.",
                icon: <Zap size={32} />,
                color: "#10b981"
              },
              { 
                title: "Virtual Card Issuing", 
                desc: "Issue USD and NGN virtual cards instantly for global subscriptions and ad spend.",
                icon: <CreditCard size={32} />,
                color: "#ec4899"
              },
              { 
                title: "Digital Asset Liquidity", 
                desc: "Access institutional-grade liquidity for digital assets with seamless fiat on/off-ramps.",
                icon: <Bitcoin size={32} />,
                color: "#f59e0b"
              },
              { 
                title: "Autonomous Compliance", 
                desc: "Built-in KYC/KYB and AML monitoring that scales with your volume automatically.",
                icon: <ShieldCheck size={32} />,
                color: "#8b5cf6"
              },
              { 
                title: "Unified SDKs", 
                desc: "Integrate our entire financial stack with a single, elegant API and robust documentation.",
                icon: <Code2 size={32} />,
                color: "#3b82f6"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -12 }}
                className="glass-card p-12 group transition-all duration-500 hover:bg-white/[0.05]"
              >
                <div className="w-16 h-16 rounded-3xl mb-10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ background: `${feature.color}15`, color: feature.color, border: `1px solid ${feature.color}30` }}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl mb-6 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-base">{feature.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/20 group-hover:text-primary transition-colors cursor-pointer">
                  Learn more <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Infrastructure Section */}
      <section className="section-padding bg-surface/30 relative">
        <div className="container">
          <div className="glass-card p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
              <div className="stagger-load">
                <div className="badge mb-8">Infrastructure</div>
                <h2 className="mb-8 leading-tight">Built for extreme <br/> reliability and scale.</h2>
                <p className="text-white/40 mb-12 text-lg leading-relaxed">
                  We've engineered our platform to handle billions in volume with zero downtime. Our hybrid architecture blends traditional banking with high-speed digital rails.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { label: "Uptime", value: "99.99%", desc: "High availability" },
                    { label: "Settlement", value: "T+0", desc: "Instant funding" },
                    { label: "Security", value: "MPC", desc: "Multi-party custody" },
                    { label: "Latency", value: "120ms", desc: "Global average" }
                  ].map((stat, i) => (
                    <div key={i} className="border-l-2 border-primary/20 pl-6">
                      <div className="text-3xl font-black mb-1">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-white/30 font-bold mb-1">{stat.label}</div>
                      <div className="text-sm text-white/20">{stat.desc}</div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary mt-16 px-10">
                  Read API Docs
                </button>
              </div>

              <div className="relative">
                <div className="hero-image-container people-mask">
                  <img 
                    src="/diverse_people_paypee_1776472528598.png" 
                    alt="Scale" 
                    className="w-full h-auto opacity-80"
                  />
                </div>
                {/* Floating trust badges */}
                <div className="absolute top-10 -left-10 glass-card p-6 animate-float">
                  <ShieldCheck className="text-emerald-400 mb-2" size={32} />
                  <div className="text-sm font-bold">SOC2 COMPLIANT</div>
                </div>
                <div className="absolute bottom-10 -right-10 glass-card p-6 animate-float" style={{ animationDelay: '2s' }}>
                  <Globe className="text-primary mb-2" size={32} />
                  <div className="text-sm font-bold">PCI-DSS LEVEL 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Premium CTA */}
      <section className="section-padding text-center relative overflow-hidden">
        <div className="hero-glow opacity-30"></div>
        <div className="container stagger-load relative z-10">
          <h2 className="text-6xl lg:text-8xl mb-12 font-black tracking-tighter">Ready to Build?</h2>
          <p className="text-white/40 max-w-2xl mx-auto text-xl mb-16 leading-relaxed">
            Join thousands of developers and businesses using Paypee to power the future of global commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="btn btn-primary btn-lg px-20 text-xl" onClick={onAuth}>
              Get API Keys
            </button>
            <button className="btn btn-outline btn-lg px-20 text-xl">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingV2;
