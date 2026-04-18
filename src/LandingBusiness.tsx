import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  Globe2, 
  ArrowRight,
  ChevronRight,
  Users,
  Briefcase,
  Layers,
  ChevronLeft,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';

interface LandingBusinessProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const LandingBusiness: React.FC<LandingBusinessProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="landing-business">
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur py-6">
        <div className="container flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Ecosystem
          </button>
          <div className="text-2xl font-black tracking-tighter text-white">
            PAYPEE <span className="text-primary">BUSINESS</span>
          </div>
          <button className="btn btn-primary px-6 py-2 rounded-xl text-sm" onClick={onGetStarted}>
            Contact Sales
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section section-padding relative min-h-[90vh] flex items-center pt-32">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-24 stagger-load">
            <div className="badge mb-8">Enterprise Grade</div>
            <h1 className="mb-8 leading-tight tracking-tighter">
              Scale your business across <br/>
              <span className="text-gradient">The African Continent.</span>
            </h1>
            <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
              Paypee provides the infrastructure for ambitious businesses to accept payments, manage treasury, and payout globally with zero friction.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="btn btn-primary btn-lg px-12" onClick={onGetStarted}>
                Open Business Account <ArrowRight size={20} />
              </button>
              <button className="btn btn-outline btn-lg px-12">
                Talk to Sales
              </button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-image-container premium-border"
          >
            <div className="glass-card p-4 overflow-hidden">
              <div className="bg-[#020617] rounded-[32px] p-8 lg:p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                  <div className="glass-card p-10 col-span-2">
                    <div className="flex justify-between items-center mb-12">
                      <div className="flex items-center gap-3">
                        <TrendingUp size={24} className="text-primary" />
                        <h3 className="text-xl">Revenue Growth</h3>
                      </div>
                      <div className="badge border-emerald-500/30 text-emerald-400 bg-emerald-500/5">LIVE MONITORING</div>
                    </div>
                    <div className="h-64 flex items-end gap-5">
                      {[60, 40, 80, 50, 90, 70, 100, 85, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 rounded-t-xl relative group">
                          <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1, duration: 1.2, ease: "easeOut" }}
                            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="glass-card p-8 group hover:bg-white/[0.05] transition-colors">
                      <div className="text-white/40 text-xs uppercase tracking-widest font-bold mb-3">Total Treasury</div>
                      <div className="text-4xl font-black text-white">$2,450,000</div>
                    </div>
                    <div className="glass-card p-8 group hover:bg-white/[0.05] transition-colors border-emerald-500/20">
                      <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Payout Success</div>
                      <div className="text-4xl font-black text-white">99.98%</div>
                    </div>
                    <div className="glass-card p-8 group hover:bg-white/[0.05] transition-colors border-pink/20">
                      <div className="text-pink text-xs uppercase tracking-widest font-bold mb-3">Active Currencies</div>
                      <div className="text-4xl font-black text-white">12+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding bg-surface/30 relative">
        <div className="container">
          <div className="text-center mb-24 stagger-load">
            <div className="badge mx-auto mb-6">Enterprise Solutions</div>
            <h2 className="mb-8 leading-tight">Infrastructure for <br/> <span className="text-gradient">The Modern African Giant.</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">From startups to Fortune 500s, Paypee offers the tools to manage high-volume transactions and complex financial workflows.</p>
          </div>

          <div className="grid-standard gap-16">
            <div className="stagger-load space-y-10">
              {[
                { icon: <Globe size={28} className="text-primary" />, title: "Cross-Border Treasury", desc: "Manage multiple currencies and optimize your liquidity across global markets with a single dashboard." },
                { icon: <Users size={28} className="text-emerald-400" />, title: "Bulk Payouts & Payroll", desc: "Pay thousands of vendors, employees, and partners in seconds across 50+ countries." },
                { icon: <ShieldCheck size={28} className="text-pink" />, title: "Custom Compliance", desc: "Enterprise-grade KYC/AML workflows tailored specifically to your business requirements." }
              ].map((s, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="flex gap-8 p-8 glass-card group cursor-pointer border-transparent hover:border-white/10"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl mb-3 group-hover:text-primary transition-colors">{s.title}</h4>
                    <p className="text-white/40 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <div className="glass-card p-12 lg:p-16 h-full flex flex-col justify-center bg-gradient-to-br from-surface to-surface-light border-white/5">
                <div className="grid grid-cols-2 gap-10">
                  {[
                    { val: "50+", label: "Countries Supported", desc: "Global reach" },
                    { val: "24/7", label: "Priority Support", desc: "Always here" },
                    { val: "120ms", label: "API Response", desc: "Lightning fast" },
                    { val: "100%", label: "Uptime SLA", desc: "Rock solid" }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 glass-card border-white/5 hover:bg-white/5 transition-colors">
                      <div className="text-5xl font-black mb-2 text-white tracking-tighter">{stat.val}</div>
                      <div className="text-xs uppercase tracking-widest text-primary font-bold mb-1">{stat.label}</div>
                      <div className="text-sm text-white/20">{stat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container">
          <div className="glass-card p-16 lg:p-32 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10 stagger-load">
              <h2 className="text-5xl lg:text-7xl mb-12 font-black tracking-tighter">Ready to transform your <br/> business finance?</h2>
              <p className="text-xl text-white/40 mb-16 max-w-2xl mx-auto leading-relaxed">Join the leading African businesses building on Paypee. Get a dedicated account manager and tailored pricing today.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="btn btn-primary btn-lg px-16 text-xl" onClick={onGetStarted}>
                  Get Enterprise Access <ArrowRight size={20} />
                </button>
                <button className="btn btn-outline btn-lg px-16 text-xl">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingBusiness;
