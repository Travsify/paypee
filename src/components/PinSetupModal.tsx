import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';
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
    <div className="paypee-modal-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="paypee-modal-content"
        style={{ maxWidth: '420px' }}
      >
        <div style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(99,102,241,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Lock size={32} color="#6366f1" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Set Transaction PIN</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Protect your transfers and swaps with a 4-digit security PIN.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>NEW 4-DIGIT PIN</label>
                <input 
                  type="password" 
                  maxLength={4} 
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '1rem', color: '#fff', fontWeight: 900 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>CONFIRM PIN</label>
                <input 
                  type="password" 
                  maxLength={4} 
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '1rem', color: '#fff', fontWeight: 900 }}
                />
              </div>
              <button 
                className="btn btn-primary" 
                disabled={pin.length < 4 || pin !== confirmPin}
                onClick={() => setStep(2)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 800, marginTop: '1rem' }}
              >
                Continue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>VERIFY PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input 
                    type="password" 
                    placeholder="Enter your login password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem 1rem 1rem 3rem', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>Back</button>
                <button 
                  className="btn btn-primary" 
                  disabled={!password || isLoading}
                  onClick={handleSetPin}
                  style={{ flex: 2, padding: '1rem', borderRadius: '12px', fontWeight: 800 }}
                >
                  {isLoading ? 'Setting PIN...' : 'Finish Setup'}
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PinSetupModal;
