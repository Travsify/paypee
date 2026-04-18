import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Webhook, 
  Copy, 
  Play, 
  Check, 
  Settings,
  ShieldAlert,
  Zap,
  ArrowRight,
  ChevronLeft,
  Bitcoin
} from 'lucide-react';

interface LandingDeveloperProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const LandingDeveloper: React.FC<LandingDeveloperProps> = ({ onBack, onGetStarted }) => {
  const codeExample = `const paypee = require('paypee-node')('pp_live_...');

// Create a global virtual account
const account = await paypee.accounts.create({
  currency: 'USD',
  customer: 'cus_9a12h12k',
  type: 'virtual'
});

console.log(account.account_number); // 5500123498`;

  return (
    <div className="landing-developer">
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur py-6">
        <div className="container flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Ecosystem
          </button>
          <div className="text-2xl font-black tracking-tighter text-white">
            PAYPEE <span className="text-primary">DEVELOPER</span>
          </div>
          <button className="btn btn-primary px-6 py-2 rounded-xl text-sm" onClick={onGetStarted}>
            Get API Keys
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section section-padding relative overflow-hidden min-h-[90vh] flex items-center pt-32">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <div className="stagger-load">
              <div className="badge mb-8">Built for Builders</div>
              <h1 className="mb-8 leading-tight tracking-tighter">
                Connect Africa with <br/>
                <span className="text-gradient">Two lines of code.</span>
              </h1>
              <p className="text-xl text-white/50 mb-12 max-w-xl leading-relaxed">
                The most powerful financial APIs in Africa. Build wallets, issue cards, and enable global payouts with our robust, developer-first infrastructure.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="btn btn-primary btn-lg px-12" onClick={onGetStarted}>
                  Get API Keys <Code2 size={20} />
                </button>
                <button className="btn btn-outline btn-lg px-12">
                  Read Documentation
                </button>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-2 premium-border shadow-[0_40px_100px_rgba(99,102,241,0.2)]"
            >
              <div className="bg-[#010409] rounded-[30px] p-8 lg:p-12 font-mono text-sm overflow-hidden relative">
                <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  <span className="ml-6 text-white/30 tracking-widest text-xs uppercase font-bold">payout_service.js</span>
                </div>
                <pre className="text-emerald-400 leading-relaxed text-base lg:text-lg">
                  <code>{codeExample}</code>
                </pre>
                
                <div className="absolute bottom-8 right-8 flex gap-4">
                  <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                    <Copy size={20} className="text-white/40" />
                  </button>
                  <button className="p-4 bg-primary/20 rounded-2xl hover:bg-primary/30 transition-colors border border-primary/20">
                    <Play size={20} className="text-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Pillars */}
      <section className="section-padding bg-surface/30 relative">
        <div className="container">
          <div className="text-center mb-24 stagger-load">
            <div className="badge mx-auto mb-6">Capabilities</div>
            <h2 className="mb-8 leading-tight">Engineered for <br/> <span className="text-gradient">Maximum Performance.</span></h2>
            <p className="max-w-2xl mx-auto text-lg text-white/40">Robust, reliable, and ridiculously fast. Our APIs are built by developers, for developers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Terminal size={28} />, 
                title: "Unified API", 
                desc: "One integration to rule them all. Manage multiple currencies and providers through a single, elegant interface.",
                color: "var(--primary)"
              },
              { 
                icon: <Webhook size={28} />, 
                title: "Real-time Webhooks", 
                desc: "Never miss a beat. Get instant notifications for payments, transfers, and account status changes with 99.99% delivery.",
                color: "#10b981"
              },
              { 
                icon: <Bitcoin size={28} />, 
                title: "Crypto Liquidity", 
                desc: "Direct access to digital asset liquidity with white-label fiat rails. No provider mention, purely your brand.",
                color: "#f59e0b"
              }
            ].map((p, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="glass-card p-12 transition-all duration-500 group border-transparent hover:border-white/10"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110" style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
                  {p.icon}
                </div>
                <h3 className="text-2xl mb-6 group-hover:text-white transition-colors">{p.title}</h3>
                <p className="text-white/40 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Infrastructure */}
      <section className="section-padding">
        <div className="container">
          <div className="glass-card p-12 lg:p-24 overflow-hidden relative border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
              <div className="stagger-load">
                <div className="badge mb-8">Infrastructure</div>
                <h2 className="mb-8 leading-tight">Infrastructure that <br/> scales with your vision.</h2>
                <p className="text-lg text-white/40 mb-12 leading-relaxed">We handle the complexity of banking licenses and regulatory compliance so you can focus on building your core product.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    "99.99% API Uptime",
                    "< 120ms Global Latency",
                    "SDKs for Node, Python, Go",
                    "PCI-DSS Level 1 Certified"
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Check size={18} />
                      </div>
                      <span className="font-mono text-sm text-white/60 font-bold">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
                <div className="relative z-10 glass-card p-12 stagger-load border-white/10">
                  <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
                    <div className="font-black text-xl tracking-tighter">API Performance</div>
                    <div className="badge border-emerald-500/30 text-emerald-400 bg-emerald-500/5 uppercase text-[10px] tracking-widest font-bold">OPTIMAL STATUS</div>
                  </div>
                  <div className="space-y-10">
                    {['Auth', 'Wallets', 'Virtual Cards', 'Digital Assets'].map((label, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-3 text-white/40 uppercase tracking-widest font-black">
                          <span>{label}</span>
                          <span className="text-emerald-400">99.99%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ delay: i * 0.1, duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding text-center">
        <div className="container stagger-load">
          <h2 className="text-5xl lg:text-7xl mb-12 font-black tracking-tighter">Ready to build the future?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="btn btn-primary btn-lg px-20 text-xl" onClick={onGetStarted}>
              Get API Keys Now
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

export default LandingDeveloper;
