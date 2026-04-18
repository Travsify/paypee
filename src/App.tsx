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
      {landingView === 'main' && (
        <header className="fixed top-0 left-0 right-0 z-[100] nav-blur h-[88px] flex items-center">
          <div className="container flex justify-between items-center relative h-full">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => { setView('landing'); setLandingView('main'); }}
              className="flex items-center gap-4 cursor-pointer p-0 bg-transparent border-none text-white transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">PAYPEE</span>
            </motion.button>
            
            <div className="desktop-only absolute left-1/2 -translate-x-1/2 flex items-center gap-10">
               <button onClick={() => { setView('landing'); setLandingView('individual'); }} className="nav-link">Individuals</button>
               <button onClick={() => { setView('landing'); setLandingView('business'); }} className="nav-link">Businesses</button>
               <button onClick={() => { setView('landing'); setLandingView('developer'); }} className="nav-link">Developers</button>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn btn-outline h-11 px-6 rounded-xl text-xs" onClick={() => setView('auth')}>Login</button>
              <button className="btn btn-primary h-11 px-8 rounded-xl text-xs shadow-lg shadow-primary/20" onClick={() => setView('auth')}>Open Account</button>
            </div>
          </div>
        </header>
      )}

      <main>
        {landingView === 'main' && <LandingV2 onAuth={() => setView('auth')} />}
        
        {landingView === 'individual' && (
          <LandingIndividual 
            onBack={() => setLandingView('main')} 
            onGetStarted={() => setView('auth')} 
          />
        )}
        {landingView === 'business' && (
          <LandingBusiness 
            onBack={() => setLandingView('main')} 
            onGetStarted={() => setView('auth')} 
          />
        )}
        {landingView === 'developer' && (
          <LandingDeveloper 
            onBack={() => setLandingView('main')} 
            onGetStarted={() => setView('auth')} 
          />
        )}
        {landingView.startsWith('legal_') && <LegalPage view={landingView.split('_')[1] as any} onBack={() => setLandingView('main')} />}
      </main>

      <MobileBottomNav />

      {/* Modern Footer */}
      <footer style={{ padding: '6rem 0 10rem', borderTop: '1px solid var(--border)', background: 'rgba(2, 6, 23, 0.5)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div className="logo" style={{ marginBottom: '1.5rem' }}>
                <img src="/logo.png" alt="" style={{ height: '32px' }} /> Paypee
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                The financial operating system for the global African.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Products</h4>
              <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Virtual Cards</span>
                <span>Global Accounts</span>
                <span>Payouts & Swaps</span>
                <span>Utility Payments</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Resources</h4>
              <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Developer Docs</span>
                <span>API Reference</span>
                <span>System Status</span>
                <span>Help Center</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Legal</h4>
              <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span onClick={() => setLandingView('legal_privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
                <span onClick={() => setLandingView('legal_terms')} style={{ cursor: 'pointer' }}>Terms of Service</span>
                <span onClick={() => setLandingView('legal_pci')} style={{ cursor: 'pointer' }}>Compliance</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>&copy; 2026 Paypee Technologies Ltd. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Twitter size={18} />
              <Linkedin size={18} />
              <Github size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
