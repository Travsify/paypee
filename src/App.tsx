import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Globe, 
  CreditCard, 
  Zap, 
  Wallet, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Repeat,
  Lock,
  Code2,
  Cpu,
  Star,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Smartphone,
  Check,
  Activity,
  Terminal,
  Navigation,
  Layers,
  Fingerprint,
  Database,
  Webhook,
  Server
} from 'lucide-react';
import IndividualDashboard from './IndividualDashboard';
import BusinessDashboard from './BusinessDashboard';
import DeveloperDashboard from './DeveloperDashboard';
import Docs from './Docs';
import Checkout from './Checkout';
import LandingV2 from './LandingV2';
import Auth from './Auth';
import LandingIndividual from './LandingIndividual';
import LandingBusiness from './LandingBusiness';
import LandingDeveloper from './LandingDeveloper';
import { LegalPage } from './LegalPage';

const StatItem = ({ value, label, icon }: { value: string, label: string, icon: React.ReactNode }) => {
  return (
    <motion.div 
      className="stat-card"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="stat-chart">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label" style={{ letterSpacing: '2px', fontWeight: 600 }}>{label}</div>
    </motion.div>
  );
};

const getInitialView = () => {
  const path = window.location.pathname;
  if (path.startsWith('/pay/')) return 'checkout';
  if (path === '/docs') return 'docs';
  
  const token = localStorage.getItem('paypee_token');
  const userStr = localStorage.getItem('paypee_user');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.role) {
        return user.role.toLowerCase() as any;
      }
    } catch (e) {
      console.error('Session restore failed', e);
    }
  }
  return 'landing';
};

const App = () => {
  const [view, setView] = useState<'landing' | 'individual' | 'business' | 'developer' | 'auth' | 'checkout' | 'docs'>(getInitialView());
  const [landingView, setLandingView] = useState<'main' | 'individual' | 'business' | 'developer' | 'legal_privacy' | 'legal_terms' | 'legal_pci'>('main');
  const [activeTab, setActiveTab] = useState<'individual' | 'business' | 'developer'>('individual');
  const [devLanguage, setDevLanguage] = useState<'node' | 'python' | 'go'>('node');
  
  const codeSnippets: Record<string, string> = {
    node: `import Paypee from '@paypee/sdk';\n\nconst paypee = new Paypee('sk_live_...');\nconst account = await paypee.createGlobalAccount('EUR');`,
    python: `from paypee import Paypee\n\npaypee = Paypee('sk_live_...')\naccount = paypee.create_global_account('EUR')`,
    go: `import "github.com/paypee/sdk-go"\n\nclient := paypee.NewClient("sk_live_...")\naccount, _ := client.CreateGlobalAccount("EUR")`
  };
  
  // Empty useEffect for cleanup (initialization is now synchronous)
  useEffect(() => {}, []);

  // Set up Auto-Logout after 5 minutes of inactivity (only when logged in)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 5 minutes = 300,000 ms
      timeoutId = setTimeout(() => {
        if (view === 'individual' || view === 'business' || view === 'developer') {
          handleLogout();
          alert('You have been logged out due to inactivity.');
        }
      }, 300000); 
    };

    if (view === 'individual' || view === 'business' || view === 'developer') {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('scroll', resetTimer);
      window.addEventListener('click', resetTimer);
      resetTimer(); // Initialize
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [view]);


  if (view === 'checkout') {
    const slug = window.location.pathname.split('/pay/')[1];
    return <Checkout slug={slug} onBack={() => setView('landing')} />;
  }

  if (view === 'docs') {
    return <Docs onBack={() => setView('landing')} />;
  }

  if (view === 'auth') {
    return (
      <Auth 
        onComplete={(type) => setView(type)} 
        onBack={() => setView('landing')} 
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('paypee_token');
    localStorage.removeItem('paypee_user');
    setView('landing');
  };

  if (view === 'individual') {
    return <IndividualDashboard onLogout={handleLogout} />;
  }
  if (view === 'business') {
    return <BusinessDashboard onLogout={handleLogout} />;
  }
  if (view === 'developer') {
    return <DeveloperDashboard onLogout={handleLogout} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };


  const audienceContent = {
    individual: {
      title: "Freedom for Global Citizens",
      subtitle: "Move your money as fast as you think. No borders, no delays.",
      steps: [
        { title: "Multi-currency Wallet", desc: "Hold and manage NGN, USD, GBP, and EUR in a single secure account.", icon: <Wallet /> },
        { title: "Instant Virtual Cards", desc: "Issue USD cards in seconds to pay for global services easily.", icon: <CreditCard /> },
        { title: "Global Remittance", desc: "Send money home or abroad via high-speed digital rails.", icon: <Globe /> }
      ],
      visual: <Smartphone size={160} color="var(--accent)" opacity={0.6} />,
      label: "Personal Finance"
    },
    business: {
      title: "Infrastructure for Enterprises",
      subtitle: "Scale your business across Africa and beyond with unified settlement.",
      steps: [
        { title: "Treasury Operations", desc: "Consolidate and manage global revenue streams from one dashboard.", icon: <BarChart3 /> },
        { title: "Mass Disbursements", desc: "Pay employees, vendors, and partners in 10+ currencies instantly.", icon: <Repeat /> },
        { title: "Collection Rails", desc: "Accept bank transfers and card payments with 99.9% success rate.", icon: <Building2 /> }
      ],
      visual: <Activity size={160} color="var(--primary)" opacity={0.6} />,
      label: "Enterprise Grade"
    },
    developer: {
      title: "The API for African Finance",
      subtitle: "Build, test, and ship financial products in days, not months.",
      steps: [
        { title: "Unified SDKs", desc: "One integration for 50+ local and international banking networks.", icon: <Terminal /> },
        { title: "Real-time Webhooks", desc: "Instant notifications for every event in your financial flow.", icon: <Webhook /> },
        { title: "Enterprise Sandbox", desc: "A robust testing environment that mimics production perfectly.", icon: <Database /> }
      ],
      visual: <Code2 size={160} color="var(--secondary)" opacity={0.6} />,
      label: "Developer First"
    }
  };

  const MobileBottomNav = () => (
    <div className="mobile-bottom-nav mobile-only">
       <button onClick={() => { setView('landing'); setLandingView('main'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'main' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 800 }}>
          <Layers size={22} /> <span>HOME</span>
       </button>
       <button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'individual' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 800 }}>
          <Users size={22} /> <span>PERSONAL</span>
       </button>
       <button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'business' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 800 }}>
          <Building2 size={22} /> <span>BUSINESS</span>
       </button>
       <button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'developer' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 800 }}>
          <Terminal size={22} /> <span>DEV</span>
       </button>
    </div>
  );

  return (
    <div className="app-shell">
      <header style={{ position: 'sticky', top: 0, zIndex: 2000, background: 'rgba(2, 6, 23, 0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', height: '72px' }}>
          <motion.button 
            onClick={() => { setView('landing'); setLandingView('main'); }} 
            className="logo"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 900 }}
          >
            <img src="/logo.png" alt="Paypee Logo" style={{ height: '32px' }} />
            Paypee
          </motion.button>
          
          <div className="desktop-only" style={{ display: 'flex', gap: '3rem' }}>
             <button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'individual' ? '#fff' : 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>Individuals</button>
             <button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'business' ? '#fff' : 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>Businesses</button>
             <button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: landingView === 'developer' ? '#fff' : 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>Developers</button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button className="btn btn-outline" onClick={() => setView('auth')} style={{ padding: '0.5rem 0.8rem', fontSize: '0.75rem' }}>Login</button>
            <button className="btn btn-primary" onClick={() => setView('auth')} style={{ padding: '0.5rem 0.8rem', fontSize: '0.75rem' }}>Get Started</button>
          </div>
        </div>
        
      </header>

      <main>
        {false && <LandingV2 onAuth={() => setView('auth')} />}
        {landingView === 'main' && (
          <>
            {/* Old Landing Content */}
            <section className="hero container perspective-3d" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
          <div className="info-row" style={{ alignItems: 'center', textAlign: 'left', marginBottom: 0, gap: '2rem' }}>
             <div className="hero-text-content">
                <motion.div 
                  className="badge"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} style={{ marginRight: '0.5rem' }} /> NEXT-GEN FINANCIAL RAILS
                </motion.div>
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ textAlign: 'left', fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}
                >
                  Global Finance. <br />
                  <span style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>Africa-Native.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ margin: '0 0 2.5rem 0', fontSize: '1.25rem', maxWidth: '540px', color: 'var(--text-muted)' }}
                >
                  The unified platform for cross-border 
                  payments, automated treasury, and high-speed settlement for Individuals, Businesses, and Developers.
                </motion.p>
                <motion.div 
                  className="hero-btns"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <button className="btn btn-primary" onClick={() => setView('auth')} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                    Start Building <ArrowRight size={20} />
                  </button>
                  <button className="btn btn-outline" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                    API Reference
                  </button>
                </motion.div>

                <motion.div 
                  className="status-indicators"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{ marginTop: '2.5rem', display: 'flex', gap: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} /> 
                    System Status: Operational
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={16} color="var(--primary)" /> ISO 27001 Certified
                  </div>
                </motion.div>
             </div>

             <div className="hero-visual-content" style={{ position: 'relative', height: '550px' }}>
                <motion.div 
                  className="tilt-card" 
                  initial={{ scale: 0.9, rotateX: 20, rotateY: -20, opacity: 0 }}
                  animate={{ scale: 1, rotateX: 0, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.2, type: 'spring', damping: 15 }}
                  style={{ 
                    position: 'absolute', 
                    right: '5%', 
                    top: '15%', 
                    width: '400px', 
                    height: '250px', 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    borderRadius: '32px',
                    boxShadow: '0 50px 100px -20px rgba(79, 70, 229, 0.5)',
                    zIndex: 2,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.6rem' }}>
                          <Cpu size={32} color="#fff" />
                       </div>
                       <span style={{ fontWeight: 800, letterSpacing: '4px', fontSize: '0.85rem', opacity: 0.9, color: '#fff' }}>PAYPEE SECURE</span>
                   </div>
                   <div style={{ fontSize: '1.7rem', letterSpacing: '5px', fontWeight: 600, color: '#fff' }}>**** **** **** 0048</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#fff' }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Authorized Entity</div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>PAYPEE TECHNOLOGIES</div>
                       </div>
                        <div style={{ textAlign: 'right' }}>
                           <div style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' }}>EXPIRES 12/30</div>
                        </div>
                   </div>
                   <div className="glow-overlay" />
                </motion.div>

                <motion.div 
                  className="float"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  style={{ position: 'absolute', left: '0%', top: '5%', width: '240px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.25rem', backdropFilter: 'blur(30px)', zIndex: 4 }}
                >
                   <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--accent)', alignItems: 'center' }}>
                       <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
                          <CheckCircle2 size={18} />
                       </div>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>+ $4,500.20</span>
                   </div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>Real-time Settlement Hub</div>
                </motion.div>

                <motion.div 
                  className="float"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  style={{ position: 'absolute', right: '0%', bottom: '10%', width: '220px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.25rem', backdropFilter: 'blur(30px)', zIndex: 1 }}
                >
                   <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--secondary)', alignItems: 'center' }}>
                       <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
                          <Zap size={18} />
                       </div>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>NGN Collection</span>
                   </div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>Paypee Virtual Account</div>
                </motion.div>

                <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                   transition={{ duration: 8, repeat: Infinity }}
                   style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', zIndex: 0, filter: 'blur(80px)' }} 
                />
             </div>
          </div>
        </section>
        
        {/* Logo Cloud Section - THE ONLY PLACE FOR PARTNER LOGOS */}
        <section className="logo-cloud">
          <div className="container">
             <div className="section-header" style={{ marginBottom: '3rem', opacity: 0.5 }}>
                <p style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 700 }}>POWERING OUR NETWORK</p>
             </div>
             <div className="logo-grid">
                <div className="logo-item"><Globe size={24} /> CLEARING</div>
                <div className="logo-item"><Zap size={24} /> LIQUIDITY</div>
                <div className="logo-item"><ShieldCheck size={24} /> CENTRAL BANK</div>
                <div className="logo-item"><Building2 size={24} /> STELLAR</div>
                <div className="logo-item"><Lock size={24} /> FIREBLOCKS</div>
             </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section container">
           <div className="stats-grid">
              <StatItem value="$2.4B+" label="Volume Processed" icon={<Repeat size={40} color="var(--primary)" />} />
              <StatItem value="12.5M+" label="Active Wallets" icon={<Users size={40} color="var(--accent)" />} />
              <StatItem value="99.99%" label="System Uptime" icon={<Zap size={40} color="var(--secondary)" />} />
           </div>
        </section>

        {/* Master Your Money - Bento Grid (Now White-labeled) */}
        <section className="section container" id="features">
          <motion.div 
             className="section-header"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={containerVariants}
             style={{ marginBottom: '5rem' }}
          >
            <motion.div variants={itemVariants} className="badge">PRODUCT SUITE</motion.div>
            <motion.h2 variants={itemVariants} style={{ fontSize: '3.5rem' }}>Master Your Money</motion.h2>
            <motion.p variants={itemVariants} style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>High-fidelity financial tools for the hyper-connected era.</motion.p>
          </motion.div>

          <motion.div 
            className="grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
          >
            {[
              { icon: <Globe />, title: "IBANs & Virtual ACs", desc: "Local collection in NGN, USD, GBP, and EUR via our robust banking network. Real-time settlement and automated reconciliation.", span: 2 },
              { icon: <CreditCard />, title: "USD Mastercards", desc: "Issue virtual cards instantly via our secure cards infrastructure. Spend anywhere online without limits.", span: 1 },
              { icon: <Zap />, title: "Lightning Rails", desc: "Move value in milliseconds across borders for a fraction of a cent using next-gen lightning rails.", span: 1 },
              { icon: <ShieldCheck />, title: "Asset Custody", desc: "Regulated custody for both fiat and digital assets within one unified, highly secure ledger.", span: 2 },
              { icon: <Smartphone />, title: "Fintech SDKs", desc: "Embed payment flows directly into your mobile app with a few lines of code.", span: 1 },
              { icon: <Cpu />, title: "Treasury Engine", desc: "Auto-convert incoming fiat to stablecoins instantly to preserve business value and hedge against inflation.", span: 2 }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                className="card tilt-card" 
                variants={itemVariants}
                style={{ gridColumn: `span ${f.span}` }}
                whileHover={{ translateZ: 20 }}
              >
                <div className="card-icon">{f.icon}</div>
                <h3 style={{ fontSize: '1.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '1rem', opacity: 0.8 }}>{f.desc}</p>
                <div className="glow-overlay" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Audience Section - 3-Way Stepped Reveal */}
        <section className="section container" id="solutions">
          <div className="toggle-container" style={{ marginBottom: '4rem', background: 'var(--glass)', padding: '0.4rem', borderRadius: '99px', maxWidth: 'fit-content', margin: '0 auto 4rem' }}>
            <button className={`toggle-btn ${activeTab === 'individual' ? 'active' : ''}`} onClick={() => setActiveTab('individual')}>Individuals</button>
            <button className={`toggle-btn ${activeTab === 'business' ? 'active' : ''}`} onClick={() => setActiveTab('business')}>Businesses</button>
            <button className={`toggle-btn ${activeTab === 'developer' ? 'active' : ''}`} onClick={() => setActiveTab('developer')}>Developers</button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="info-row" style={{ alignItems: 'flex-start' }}>
                <div className="info-content">
                  <h3>{audienceContent[activeTab as keyof typeof audienceContent].title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>{audienceContent[activeTab as keyof typeof audienceContent].subtitle}</p>
                  
                  <div className="stepped-container">
                     {audienceContent[activeTab as keyof typeof audienceContent].steps.map((step, idx) => (
                        <motion.div className="step-item" key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} viewport={{ once: true }}>
                           <div className="step-content">
                              <div className="step-number">0{idx + 1}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                 <div style={{ color: 'var(--primary)' }}>{step.icon}</div>
                                 <h4 style={{ margin: 0 }}>{step.title}</h4>
                              </div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{step.desc}</p>
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', width: 'fit-content' }}
                                onClick={() => setView('auth')}
                              >
                                View {activeTab === 'developer' ? 'Developer Hub' : 'Dashboard Demo'} <ArrowRight size={14} />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </div>
                </div>

                <div className="hero-visual-content" style={{ position: 'sticky', top: '2rem' }}>
                   <div className="card floating-glass" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', background: 'var(--glass)', borderColor: 'var(--glass-border)', overflow: 'hidden' }}>
                      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                         {audienceContent[activeTab as keyof typeof audienceContent].visual}
                      </motion.div>
                      <div style={{ textAlign: 'center', zIndex: 2 }}>
                         <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>{audienceContent[activeTab as keyof typeof audienceContent].label}</div>
                         <div className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>PAYPEE OPTIMIZED</div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 1. Global Liquidity Map Section */}
        <section className="section container" style={{ overflow: 'hidden' }}>
          <div className="info-row" style={{ alignItems: 'center' }}>
            <div className="info-content">
              <div className="badge">GLOBAL NETWORK</div>
              <h3>Borderless Value <br /> Across 200+ Nodes.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Our liquidity network connects African payment rails directly to the world. 
                Move value from Lagos to London in under 60 seconds with 0% slippage.
              </p>
              <div style={{ marginTop: '2rem' }}>
                 <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>54 countries</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>African Coverage</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{"<"} 2s</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Settlement</div>
                 </div>
              </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '450px' }}>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 style={{ width: '100%', height: '100%', background: 'var(--glass)', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
               >
                  <Globe size={300} color="var(--primary)" opacity={0.1} />
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=MapUser" 
                    alt="Network User" 
                    style={{ position: 'absolute', top: '20%', left: '30%', width: '60px', borderRadius: '50%', border: '2px solid var(--accent)' }} 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', top: '25%', left: '45%', width: 12, height: 12, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 20px var(--accent)' }} 
                  />
                  <div style={{ position: 'absolute', top: '60%', left: '55%', width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 20px var(--primary)' }} />
               </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Hybrid Ledger Engine Section */}
        <section className="section container" id="infrastructure">
           <div className="section-header">
              <div className="badge">CORE INFRASTRUCTURE</div>
              <h2>Hybrid Rail Architecture</h2>
              <p style={{ color: 'var(--text-muted)' }}>The perfect blend of traditional banking and high-speed digital rails.</p>
           </div>
           <div className="grid">
              {[
                { title: "Fiat Liquidity", icon: <Building2 />, desc: "Direct integrations with major clearing houses for deep local liquidity." },
                { title: "Digital Bridges", icon: <Zap />, desc: "Next-gen bridges for near-instant cross-border settlement." },
                { title: "Multi-Chain Ops", icon: <Layers />, desc: "Seamless swaps between local currency stablecoins and international digital assets." }
              ].map((item, idx) => (
                <motion.div key={idx} className="card" whileHover={{ y: -5 }}>
                   <div className="card-icon" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{item.icon}</div>
                   <h3>{item.title}</h3>
                   <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* 3. The Onboarding Journey */}
        <section className="section container">
           <div className="section-header">
              <div className="badge">GET STARTED</div>
              <h2>Launch in 3 Simple Steps</h2>
           </div>
           <div className="grid" style={{ marginTop: '4rem' }}>
              {[
                { title: "Onboard", desc: "Digital KYB/KYC that takes minutes via automated verification.", vector: "https://api.dicebear.com/7.x/avataaars/svg?seed=Onboard" },
                { title: "Integrate", desc: "Drop our SDK into your app and scale with our robust Paypee API.", vector: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Integrate" },
                { title: "Scale", desc: "Go live on Mainnet and start moving real volume globally.", vector: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Scale" }
              ].map((step, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                   <motion.div whileHover={{ scale: 1.05 }} style={{ width: '140px', height: '140px', margin: '0 auto 2rem', background: 'var(--glass)', borderRadius: '40px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={step.vector} alt={step.title} style={{ width: '90px' }} />
                   </motion.div>
                   <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{idx + 1}. {step.title}</div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 4. Enterprise Security Stack */}
        <section className="section container" id="security" style={{ background: 'rgba(2, 6, 23, 0.5)', borderRadius: '40px', padding: '6rem 4rem' }}>
           <div className="info-row">
              <div className="info-visual-content">
                 <div style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                      style={{ position: 'absolute', width: '300px', height: '300px', border: '1px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
                    />
                    <div style={{ position: 'relative', zIndex: 2, padding: '3rem', background: 'var(--glass)', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                       <Lock size={100} color="var(--primary)" />
                    </div>
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ position: 'absolute', top: '10%', right: '15%', background: '#10b981', padding: '0.5rem', borderRadius: '8px' }}><Check size={20} color="#fff" /></motion.div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', left: '15%', background: '#10b981', padding: '0.5rem', borderRadius: '8px' }}><Check size={20} color="#fff" /></motion.div>
                 </div>
              </div>
              <div className="info-content">
                 <div className="badge">FORT KNOX SECURITY</div>
                 <h3>Institutional Grade <br /> Defense Systems.</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We use multi-party computation (MPC) technology and institutional custody for extreme wallet security.</p>
                 <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><CheckCircle2 color="var(--accent)" /> SOC2 Type II Compliant</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}><CheckCircle2 color="var(--accent)" /> Real-time Fraud Detection</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CheckCircle2 color="var(--accent)" /> 256-bit AES Encryption</li>
                 </ul>
              </div>
           </div>
        </section>

        {/* 5. Interactive API Playground */}
        <section className="section container">
           <div className="info-row" style={{ alignItems: 'flex-start' }}>
              <div className="info-content">
                 <div className="badge">PLAYGROUND</div>
                 <h3>Simulate Your <br /> First Transaction.</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Experience the power of our unified Paypee API. See the live response from our settlement engine.</p>
                 <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ color: 'var(--text-muted)' }}>PAYMENT TYPE</div><div style={{ fontWeight: 800 }}>SWIFT Alternative</div></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ color: 'var(--text-muted)' }}>SETTLEMENT</div><div style={{ fontWeight: 800, color: 'var(--accent)' }}>Instant</div></div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Run Simulator</button>
                 </div>
              </div>
              <div style={{ flex: 1.5, marginLeft: '4rem' }}>
                 <div className="code-window">
                    <div className="code-header"><span style={{ fontSize: '0.75rem', fontWeight: 600 }}>API RESPONSE</span></div>
                    <div className="code-body">
                       <pre style={{ margin: 0, color: '#10b981' }}><code>{`{
  "id": "set_paypee_9823h...",
  "status": "completed",
  "source": "50,000 NGN",
  "target": "34.20 USD",
  "fx_rate": "1462.00",
  "timestamp": "2026-04-13"
}`}</code></pre>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Developer Section - SDK Tabs */}
        <section className="section container" id="developers" style={{ background: 'linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.05), transparent)' }}>
          <div className="info-row">
            <div className="info-content">
              <div className="badge">DEVELOPER ECOSYSTEM</div>
              <h3>Infrastructure <br /> for the Modern Dev.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Unified API for 50+ banking partners globally. Node, Python, and Go SDKs available.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                 {['node', 'python', 'go'].map((lang) => (
                    <button key={lang} className={`btn ${devLanguage === lang ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }} onClick={() => setDevLanguage(lang as any)}>
                       {lang}
                    </button>
                 ))}
              </div>
            </div>
            
            <motion.div className="code-window" initial={{ rotateY: 10, opacity: 0 }} whileInView={{ rotateY: 0, opacity: 1 }} viewport={{ once: true }}>
               <div className="code-header"> Paypee SDK </div>
               <div className="code-body" style={{ background: '#0f172a' }}>
                  <pre style={{ margin: 0, color: '#f8fafc' }}><code>{codeSnippets[devLanguage as keyof typeof codeSnippets]}</code></pre>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section container">
          <div className="section-header" style={{ marginBottom: '5rem' }}>
             <div className="badge">PARTNER SUCCESS</div>
             <h2>Built for Global Ambition</h2>
          </div>
          <div className="grid">
            {[
              { text: "Paypee has completely transformed international payroll for us across Africa.", author: "Sarah Chen", role: "CFO at TechStream", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
              { text: "We went from sandbox to live production in exactly 48 hours. The speed is unmatched.", author: "James Okoro", role: "Founder of ShopQuick", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
              { text: "Finally, a fintech rail that understands the needs of modern global businesses.", author: "Elena Rossi", role: "CTO at Borderless", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" }
            ].map((t, i) => (
              <motion.div key={i} className="testimonial-card" whileHover={{ y: -10 }}>
                <div className="trust-badge"><ShieldCheck size={24} /></div>
                <img src={t.avatar} alt={t.author} className="testimonial-avatar" />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="author-info">
                   <h5 style={{ margin: 0, color: '#fff' }}>{t.author}</h5>
                   <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section container" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', borderRadius: '40px', padding: '6rem 2rem' }}>
           <h2 style={{ fontSize: '3rem', color: '#fff' }}>The Future is Borderless.</h2>
           <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
             Join the thousands of developers building the next generation of African finance.
           </p>
           <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
             <button className="btn" onClick={() => setView('auth')} style={{ background: '#fff', color: 'var(--primary)', padding: '1rem 2.5rem' }}>Get API Keys</button>
             <button className="btn btn-outline" onClick={() => setView('auth')} style={{ borderColor: '#fff', color: '#fff', padding: '1rem 2.5rem' }}>Talk to Sales</button>
           </div>
         </section>
          </>
        )}
        
        {landingView === 'individual' && <LandingIndividual onAuth={() => setView('auth')} />}
        {landingView === 'business' && <LandingBusiness onAuth={() => setView('auth')} />}
        {landingView === 'developer' && <LandingDeveloper onAuth={() => setView('auth')} />}
        {landingView === 'legal_privacy' && <LegalPage view="privacy" onBack={() => setLandingView('main')} />}
        {landingView === 'legal_terms' && <LegalPage view="terms" onBack={() => setLandingView('main')} />}
        {landingView === 'legal_pci' && <LegalPage view="pci" onBack={() => setLandingView('main')} />}
      </main>
      
      <MobileBottomNav />

      <footer style={{ padding: '6rem 0 3rem', borderTop: '1px solid var(--border)', marginBottom: '5rem' }}>
        <div className="container">
          <div className="info-row" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1.5 }}>
              <div className="logo" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <img src="/logo.png" alt="Paypee" style={{ height: '28px' }} />
                 Paypee
              </div>
              <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>Global liquidity infrastructure connecting Africa to the world. Secure, fast, and unified.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Twitter size={20} color="var(--text-muted)" />
                <Github size={20} color="var(--text-muted)" />
                <Linkedin size={20} color="var(--text-muted)" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ marginBottom: '1.5rem', color: '#fff' }}>Individuals</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li><button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Global Wallets</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Virtual Cards</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>P2P Transfers</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('individual'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Bill Payments</button></li>
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ marginBottom: '1.5rem', color: '#fff' }}>Businesses</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li><button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Treasury Ops</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Payroll Engine</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Payment Links</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('business'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Bulk Payouts</button></li>
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ marginBottom: '1.5rem', color: '#fff' }}>Developers</h5>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: 2.5, fontSize: '0.9rem' }}>
                <li><button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>API Reference</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>SDK Libraries</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>System Status</button></li>
                <li><button onClick={() => { setView('landing'); setLandingView('developer'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Developer Forum</button></li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '4rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <span>© 2026 Paypee Technologies Ltd. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <button onClick={() => { setView('landing'); setLandingView('legal_privacy'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Privacy Policy</button>
              <button onClick={() => { setView('landing'); setLandingView('legal_terms'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>Terms of Service</button>
              <button onClick={() => { setView('landing'); setLandingView('legal_pci'); }} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>PCI DSS | ISO 27001</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
