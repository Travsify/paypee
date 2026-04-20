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
  
  // Handle mobile auth link seamless login
  const urlParams = new URLSearchParams(window.location.search);
  const urlAuthToken = urlParams.get('auth');
  if (urlAuthToken) {
    localStorage.setItem('paypee_token', urlAuthToken);
    // Assume user is individual for mobile verify flow
    localStorage.setItem('paypee_user', JSON.stringify({ role: 'INDIVIDUAL' }));
    
    // Save KYC step data for mobile scan
    const step = urlParams.get('step');
    if (step) sessionStorage.setItem('mobile_verify_step', step);
    const idType = urlParams.get('idType');
    if (idType) sessionStorage.setItem('mobile_verify_idType', idType);
    const idNumber = urlParams.get('idNumber');
    if (idNumber) sessionStorage.setItem('mobile_verify_idNumber', idNumber);
    const dob = urlParams.get('dob');
    if (dob) sessionStorage.setItem('mobile_verify_dob', dob);

    // Remove auth from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return 'individual';
  }

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

  // Set up Auto-Logout after 30 minutes of inactivity (only when logged in)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 30 minutes = 1,800,000 ms
      timeoutId = setTimeout(() => {
        if (view === 'individual' || view === 'business' || view === 'developer') {
          handleLogout();
          alert('You have been logged out due to inactivity.');
        }
      }, 1800000); 
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
      {landingView !== 'main' && (
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
      )}

      <main>
        {landingView === 'main' && <LandingV2 onAuth={() => setView('auth')} />}
        
        {landingView === 'individual' && <LandingIndividual onAuth={() => setView('auth')} />}
        {landingView === 'business' && <LandingBusiness onAuth={() => setView('auth')} />}
        {landingView === 'developer' && <LandingDeveloper onAuth={() => setView('auth')} />}
        {landingView === 'legal_privacy' && <LegalPage view="privacy" onBack={() => setLandingView('main')} />}
        {landingView === 'legal_terms' && <LegalPage view="terms" onBack={() => setLandingView('main')} />}
        {landingView === 'legal_pci' && <LegalPage view="pci" onBack={() => setLandingView('main')} />}
      </main>
      
      <MobileBottomNav />

      {landingView !== 'main' && (
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
      )}
    </div>
  );
};

export default App;
