import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CheckCircle2, 
  User, 
  Building2, 
  Code2,
  Mail,
  Lock,
  ChevronLeft
} from 'lucide-react';

interface AuthProps {
  onComplete: (type: 'individual' | 'business' | 'developer') => void;
  onBack: () => void;
}

const Auth = ({ onComplete, onBack }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'developer'>('individual');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? JSON.stringify({ email, password })
        : JSON.stringify({ email, password, role: accountType.toUpperCase(), firstName, lastName, businessName });

      const res = await fetch(`https://paypee-api-kmhv.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store JWT token locally
      localStorage.setItem('paypee_token', data.token);
      localStorage.setItem('paypee_user', JSON.stringify(data.user));

      onComplete(accountType);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signupBenefits = {
    individual: [
      "Get your free global account in 3 minutes",
      "Claim your first virtual debit card",
      "Unlock zero-fee transfers for the first 30 days"
    ],
    business: [
      "Fast-track your corporate onboarding",
      "Get access to multi-currency IBANs instantly",
      "Access API sandbox for immediate integration"
    ],
    developer: [
      "Generate your free API test keys instantly",
      "Get $100 in sandbox credits for testing",
      "Join the community of African fintech builders"
    ]
  };

  const loginFeatures = {
    individual: [
      "Manage your global spend in real-time",
      "Freeze or replace virtual cards instantly",
      "Track your international transfers and bills"
    ],
    business: [
      "Execute bulk payroll to thousands of employees",
      "Automate treasury conversions to stablecoins",
      "Export detailed tax and reconciliation reports"
    ],
    developer: [
      "Monitor live API latency and webhook deliveries",
      "Roll and manage production API keys securely",
      "Access comprehensive network event logs"
    ]
  };

  return (
    <div className="auth-shell" style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#fff' }}>
      {/* Left Side: Value Proposition */}
      <div className="desktop-only" style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ marginBottom: '4rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>
            <Sparkles size={32} fill="var(--primary)" />
            Paypee
          </div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {isLogin ? (
              <>
                Welcome Back to <br />
                <span style={{ color: 'var(--primary)' }}>Paypee.</span>
              </>
            ) : (
              <>
                Start Your Global <br />
                <span style={{ color: 'var(--primary)' }}>Journey.</span>
              </>
            )}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
            {isLogin 
              ? "Sign in to manage your money, API keys, and corporate treasury operations." 
              : "Join thousands of users moving value across borders with institutional-grade speed and security."}
          </p>
        </motion.div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={accountType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '24px', backdropFilter: 'blur(10px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                {accountType === 'individual' ? <ShieldCheck size={24} /> : accountType === 'business' ? <Building2 size={24} /> : <Code2 size={24} />}
                <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>For {accountType}s</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {(isLogin ? loginFeatures[accountType] : signupBenefits[accountType]).map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.05 }} />
      </div>

      {/* Right Side: Auth Form */}
      <div className="auth-form-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4rem', maxWidth: '600px', margin: '0 auto', justifyContent: 'center', position: 'relative' }}>
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <ChevronLeft size={18} /> Back to Website
        </button>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"} 
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.9rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} /> {errorMsg}
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.3rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid var(--border)', flexWrap: 'nowrap' }}>
          {[
            { id: 'individual', icon: User, label: 'Individual' },
            { id: 'business', icon: Building2, label: 'Business' },
            { id: 'developer', icon: Code2, label: 'Developer' }
          ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setAccountType(t.id as any)}
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: 'none',
                background: accountType === t.id ? 'var(--primary)' : 'transparent',
                color: accountType === t.id ? '#fff' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && accountType === 'individual' && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>First Name</label>
                <input 
                  type="text" 
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sarah"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Last Name</label>
                <input 
                  type="text" 
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Chen"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>
          )}

          {!isLogin && (accountType === 'business') && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Business Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="TechStream Ltd."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
                <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          {!isLogin && accountType === 'developer' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sarah Chen"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
                />
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
              {isLogin && <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>Forgot Password?</button>}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <input type="checkbox" required style={{ marginTop: '0.2rem' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                I agree to the <span style={{ color: 'var(--primary)' }}>Terms of Service</span> and <span style={{ color: 'var(--primary)' }}>Privacy Policy</span>.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', justifyContent: 'center' }}
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={20} />
              </motion.div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Trusted Security</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', opacity: 0.5 }}>
           <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={14} /> PCI-DSS</span>
           <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Lock size={14} /> 256-bit AES</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
