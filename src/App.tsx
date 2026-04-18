import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  Activity,
  ShieldCheck
} from 'lucide-react';
import NextGenDashboard from './NextGenDashboard';
import BusinessDashboard from './BusinessDashboard';
import DeveloperDashboard from './DeveloperDashboard';
import IndividualDashboard from './IndividualDashboard';
import Docs from './Docs';
import Checkout from './Checkout';
import LandingV2 from './LandingV2';
import Auth from './Auth';
import LandingIndividual from './LandingIndividual';
import LandingBusiness from './LandingBusiness';
import LandingDeveloper from './LandingDeveloper';
import { LegalPage } from './LegalPage';
import './NextGen.css';

const App = () => {
  const [view, setView] = useState<'landing' | 'individual' | 'business' | 'developer' | 'auth' | 'checkout' | 'docs'>('landing');
  const [landingView, setLandingView] = useState<'main' | 'individual' | 'business' | 'developer' | 'legal_privacy' | 'legal_terms' | 'legal_pci'>('main');

  // Detect initial view from path
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/pay/')) {
      setView('checkout');
    } else if (path === '/docs') {
      setView('docs');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('paypee_token');
    localStorage.removeItem('paypee_user');
    setView('landing');
  };

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

  // LOGGED IN DASHBOARDS
  if (view === 'individual') return <IndividualDashboard onLogout={handleLogout} />;
  if (view === 'business') return <BusinessDashboard onLogout={handleLogout} />;
  if (view === 'developer') return <DeveloperDashboard onLogout={handleLogout} />;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      
      {/* 1. HEADER (CONDITIONAL) */}
      {(landingView === 'individual' || landingView === 'business' || landingView === 'developer' || landingView.startsWith('legal_')) && (
        <header className="fixed top-0 left-0 w-full z-50 px-8 py-6">
           <div className="container flex justify-between items-center glass-surface !rounded-full !py-3 !px-8 border-white/5 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLandingView('main')}>
                <div className="w-8 h-8 glass-surface-glow flex items-center justify-center !rounded-lg bg-indigo-500/10">
                  <Zap size={16} className="text-indigo-400 fill-current" />
                </div>
                <span className="text-xl font-black italic tracking-tighter uppercase">Paypee</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-10">
                 <button onClick={() => setLandingView('individual')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${landingView === 'individual' ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}>Individuals</button>
                 <button onClick={() => setLandingView('business')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${landingView === 'business' ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}>Businesses</button>
                 <button onClick={() => setLandingView('developer')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${landingView === 'developer' ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}>Developers</button>
              </div>

              <div className="flex items-center gap-4">
                 <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white" onClick={() => setView('auth')}>Login</button>
                 <button className="btn-elite btn-primary-glow !py-2.5 !px-8 !text-xs !rounded-full" onClick={() => setView('auth')}>Join</button>
              </div>
           </div>
        </header>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main>
        {landingView === 'main' && <LandingV2 onAuth={() => setView('auth')} setLandingView={setLandingView} />}
        
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
        
        {landingView.startsWith('legal_') && (
          <LegalPage 
            view={landingView.split('_')[1] as any} 
            onBack={() => setLandingView('main')} 
          />
        )}
      </main>

      {/* 3. FOOTER (ONLY ON SUBPAGES OR IF NEEDED) */}
      {landingView !== 'main' && (
        <footer className="relative py-24 z-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="container">
             <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 glass-surface flex items-center justify-center !rounded-lg border-indigo-500/20">
                    <Zap size={16} className="text-indigo-400 fill-current" />
                  </div>
                  <span className="text-xl font-black italic tracking-tighter uppercase">Paypee</span>
                </div>
                
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

                <div className="flex gap-8">
                   <Twitter size={18} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                   <Github size={18} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                   <Linkedin size={18} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                </div>
             </div>
             <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10 pt-12 border-t border-white/5">
                © 2026 PAYPEE NODE_01 // ALL RIGHTS RESERVED.
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
