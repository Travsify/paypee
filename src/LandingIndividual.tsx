import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Globe,
  Wallet,
  Star,
  ChevronLeft,
  Bitcoin
} from 'lucide-react';

interface LandingIndividualProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const LandingIndividual: React.FC<LandingIndividualProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="landing-individual">
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur py-6">
        <div className="container flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Ecosystem
          </button>
          <div className="text-2xl font-black tracking-tighter text-white">
            PAYPEE <span className="text-primary">INDIVIDUAL</span>
          </div>
          <button className="btn btn-primary px-6 py-2 rounded-xl text-sm" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section section-padding relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="stagger-load"
            >
              <div className="badge mb-8">
                <Star size={14} className="fill-current text-primary" /> 
                <span className="ml-2">For Global Citizens</span>
              </div>
              <h1 className="mb-8 leading-tight">
                Your money, <br />
                <span className="text-gradient">Without Borders.</span>
              </h1>
              <p className="text-xl text-white/50 mb-12 max-w-xl leading-relaxed">
                Experience the ultimate freedom of global banking. Open USD, EUR, and GBP wallets in seconds, issue virtual cards, and move money at the speed of light.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="btn btn-primary btn-lg px-12" onClick={onGetStarted}>
                  Open Your Account <ArrowRight size={20} />
                </button>
                <button className="btn btn-outline btn-lg px-12">
                  View Card Plans
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative"
            >
              <div className="hero-image-container animate-float premium-border">
                <img 
                  src="/virtual_card_paypee_1776472492359.png" 
                  alt="Paypee Virtual Card" 
                  className="w-full h-auto rounded-[48px]"
                />
              </div>
              
              {/* Floating Social Proof Card */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -right-10 glass-card p-8 min-w-[300px] hidden md:block"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="font-bold">Global Wallet</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Active & Secure</div>
                  </div>
                </div>
                <div className="text-3xl font-black text-white">$12,450.00</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="text-center mb-24 stagger-load">
            <div className="badge mx-auto mb-6">Capabilities</div>
            <h2 className="mb-8 leading-tight">Everything you need to <br/> <span className="text-gradient">Manage Global Wealth.</span></h2>
            <p className="max-w-2xl mx-auto text-lg text-white/40">We've built a world-class financial infrastructure so you can focus on building your dreams.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Wallet size={32} />, title: "Global Multi-Currency", desc: "Hold and manage NGN, USD, GBP, and EUR in one place with institutional security.", color: "var(--primary)" },
              { icon: <CreditCard size={32} />, title: "Infinite Virtual Cards", desc: "Create unlimited virtual USD cards for international subscriptions and shopping.", color: "#ec4899" },
              { icon: <Zap size={32} />, title: "Instant FX Swaps", desc: "Swap between currencies at mid-market rates instantly. No hidden fees, ever.", color: "#10b981" },
              { icon: <Bitcoin size={32} />, title: "Digital Assets", desc: "Seamlessly hold and trade digital assets with direct fiat on/off-ramps.", color: "#f59e0b" }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="glass-card p-10 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform hover:scale-110" style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>
                  {f.icon}
                </div>
                <h3 className="text-2xl mb-6">{f.title}</h3>
                <p className="text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* People-Connected Section */}
      <section className="section-padding bg-surface/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
            <div className="hero-image-container people-mask order-2 lg:order-1">
              <img 
                src="/diverse_people_paypee_1776472528598.png" 
                alt="Paypee Community" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="stagger-load order-1 lg:order-2">
              <div className="badge mb-8">Community</div>
              <h2 className="mb-8 leading-tight">Built for the next <br/> <span className="text-gradient">Generation of Creators.</span></h2>
              <p className="text-lg text-white/40 mb-12 leading-relaxed">
                Join over 500,000 individuals who are breaking financial barriers. Whether you're a freelancer, a digital nomad, or a global traveler, Paypee is built for you.
              </p>
              <div className="space-y-8">
                {[
                  "Connect with your global audience effortlessly",
                  "Receive payments from platforms like Upwork and Fiverr",
                  "Spend locally with the best exchange rates in Africa"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="font-bold text-lg text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-16 px-12" onClick={onGetStarted}>
                Join the Community <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding text-center">
        <div className="container stagger-load">
          <h2 className="text-5xl lg:text-7xl mb-12 font-black tracking-tighter">Start your global journey.</h2>
          <button className="btn btn-primary btn-lg px-20" onClick={onGetStarted}>
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingIndividual;
