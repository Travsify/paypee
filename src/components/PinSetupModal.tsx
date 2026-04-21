import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, KeyRound, Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { API_BASE } from '../config';

interface PinSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetPin = async () => {
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/set-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('paypee_token')}`
        },
        body: JSON.stringify({ pin, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to set PIN');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000, padding: '2rem', backdropFilter: 'blur(15px)' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="premium-card"
        style={{ padding: '3.5rem', width: '100%', maxWidth: '500px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '12px' }}><X size={24} /></button>

        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(99, 102, 241, 0.15)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.1)' }}>
            <Lock size={40} color="var(--primary)" />
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Shield size={18} fill="var(--primary)" /> Protocol Security
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#fff' }}>Configure PIN</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>Initialize your 4-digit security key to authorize high-value settlements.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '1.25rem', borderRadius: '18px', fontSize: '0.95rem', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 700 }}
          >
            {error}
          </motion.div>
        )}

        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>CHOOSE NEW PIN</label>
                <input 
                  type="password" 
                  maxLength={4} 
                  placeholder="••••"
                  className="form-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '3rem', textAlign: 'center', letterSpacing: '1.5rem', padding: '1.5rem', height: '100px', fontWeight: 900, background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>CONFIRM NEW PIN</label>
                <input 
                  type="password" 
                  maxLength={4} 
                  placeholder="••••"
                  className="form-input"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '3rem', textAlign: 'center', letterSpacing: '1.5rem', padding: '1.5rem', height: '100px', fontWeight: 900, background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
            </div>
            
            <button 
              className="btn btn-primary" 
              disabled={pin.length < 4 || pin !== confirmPin}
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 900 }}
            >
              Authorize Stage 1
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <label className="form-label">IDENTITY VERIFICATION (PASSWORD)</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={22} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                <input 
                  type="password" 
                  placeholder="Enter your system password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '4.5rem', fontSize: '1.1rem' }}
                />
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '20px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
               <ShieldCheck size={26} color="var(--primary)" style={{ flexShrink: 0 }} />
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                 This PIN will be encrypted using 256-bit AES and stored on your hardware security module (HSM).
               </p>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1, padding: '1.25rem', borderRadius: '20px', fontWeight: 900 }}>
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                className="btn btn-primary" 
                disabled={!password || isLoading}
                onClick={handleSetPin}
                style={{ flex: 2, padding: '1.25rem', borderRadius: '20px', fontWeight: 900, fontSize: '1.1rem' }}
              >
                {isLoading ? 'Finalizing...' : 'Commit Security PIN'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PinSetupModal;
