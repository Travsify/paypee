import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ChevronRight, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  Terminal,
  AlertCircle
} from 'lucide-react';

interface VerificationGateProps {
  kycStatus: string;
  accountType: 'INDIVIDUAL' | 'BUSINESS' | 'DEVELOPER';
  onVerifySuccess?: () => void;
}

const VerificationGate: React.FC<VerificationGateProps> = ({ kycStatus, accountType, onVerifySuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [idType, setIdType] = useState(accountType === 'BUSINESS' ? 'CAC' : 'NIN');
  const [idNumber, setIdNumber] = useState('');

  if (kycStatus === 'VERIFIED') return null;

  const handleVerify = async () => {
    setError('');

    if (!idNumber.trim()) {
      setError('Please enter your ID number.');
      return;
    }

    // Basic validation
    if (idType === 'NIN' && idNumber.trim().length !== 11) {
      setError('NIN must be exactly 11 digits.');
      return;
    }
    if (idType === 'BVN' && idNumber.trim().length !== 11) {
      setError('BVN must be exactly 11 digits.');
      return;
    }
    if (idType === 'CAC' && idNumber.trim().length < 5) {
      setError('Please enter a valid CAC/RC number.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('paypee_token');
    
    try {
      const response = await fetch('https://paypee-api.onrender.com/api/verify/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idType,
          idNumber: idNumber.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        if (onVerifySuccess) onVerifySuccess();
        // Refresh page after a delay to show VERIFIED status
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError(data.error || 'Verification failed. Please check your details and try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const idTypeOptions = accountType === 'BUSINESS' 
    ? [{ value: 'CAC', label: 'CAC / RC Number', desc: 'Corporate Affairs Commission registration' }]
    : [
        { value: 'NIN', label: 'National ID (NIN)', desc: '11-digit National Identification Number' },
        { value: 'BVN', label: 'Bank Verification (BVN)', desc: '11-digit Bank Verification Number' },
      ];

  return (
    <>
      {/* Top Banner */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        style={{ 
          background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#fff',
          padding: '0.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          borderRadius: '0 0 16px 16px',
          margin: '0 0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldAlert size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {kycStatus === 'PENDING'
              ? `Verification Required: Complete your ${accountType === 'INDIVIDUAL' ? 'KYC' : 'KYB'} to unlock all features.` 
              : 'Your verification is being reviewed...'}
          </span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: '1px solid rgba(255,255,255,0.4)', 
            color: '#fff', 
            padding: '0.4rem 1.2rem', 
            borderRadius: '8px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Verify Now <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Verification Modal overlay */}
      <AnimatePresence>
        {showModal && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(2, 6, 23, 0.9)', 
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 2000,
            padding: '2rem'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ 
                background: '#0a0f1e', 
                border: '1px solid #1e293b', 
                borderRadius: '32px', 
                padding: '3rem', 
                maxWidth: '550px', 
                width: '100%',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <button 
                onClick={() => { setShowModal(false); setError(''); }}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}
              >✕</button>

              {!submitted ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      borderRadius: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#4f46e5',
                      margin: '0 auto 1.5rem'
                    }}>
                      {accountType === 'INDIVIDUAL' ? <User size={40} /> : accountType === 'BUSINESS' ? <Building2 size={40} /> : <Terminal size={40} />}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      {accountType === 'INDIVIDUAL' ? 'Identity Verification' : 'Business Verification'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Enter your {accountType === 'BUSINESS' ? 'CAC registration' : 'government ID'} details to verify your account and unlock global transfers.
                    </p>
                  </div>

                  {/* ID Type Selection */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                      VERIFICATION TYPE
                    </label>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {idTypeOptions.map((opt) => (
                        <div 
                          key={opt.value}
                          onClick={() => setIdType(opt.value)}
                          style={{
                            background: idType === opt.value ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: idType === opt.value ? '2px solid #4f46e5' : '2px solid #1e293b',
                            borderRadius: '16px',
                            padding: '1rem 1.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: idType === opt.value ? '6px solid #4f46e5' : '2px solid #475569',
                            transition: 'all 0.2s'
                          }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{opt.label}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{opt.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ID Number Input */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                      {idType === 'NIN' ? 'NIN NUMBER' : idType === 'BVN' ? 'BVN NUMBER' : 'RC / CAC NUMBER'}
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => { setIdNumber(e.target.value); setError(''); }}
                      placeholder={idType === 'NIN' ? 'Enter 11-digit NIN' : idType === 'BVN' ? 'Enter 11-digit BVN' : 'Enter RC number (e.g., RC123456)'}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: error ? '2px solid #f43f5e' : '2px solid #1e293b',
                        borderRadius: '14px',
                        padding: '1rem 1.25rem',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        letterSpacing: '2px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => { if (!error) e.target.style.borderColor = '#4f46e5'; }}
                      onBlur={(e) => { if (!error) e.target.style.borderColor = '#1e293b'; }}
                      maxLength={idType === 'CAC' ? 20 : 11}
                    />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        background: 'rgba(244, 63, 94, 0.1)', 
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        borderRadius: '12px', 
                        padding: '1rem', 
                        marginBottom: '1.5rem',
                        color: '#f43f5e',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}

                  {/* Security Note */}
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <ShieldAlert size={16} color="#475569" />
                    <span style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                      Your data is encrypted end-to-end and verified through Prembly's secure identity infrastructure. We never store raw ID documents.
                    </span>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerify}
                    disabled={loading || !idNumber.trim()}
                    style={{ 
                      width: '100%', 
                      background: (!idNumber.trim() || loading) ? '#1e293b' : '#4f46e5', 
                      color: (!idNumber.trim() || loading) ? '#475569' : '#fff', 
                      border: 'none', 
                      padding: '1.2rem', 
                      borderRadius: '16px', 
                      fontSize: '1.05rem', 
                      fontWeight: 700, 
                      cursor: (!idNumber.trim() || loading) ? 'not-allowed' : 'pointer',
                      boxShadow: idNumber.trim() ? '0 20px 40px -10px rgba(99, 102, 241, 0.4)' : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {loading ? 'Verifying with Prembly...' : 'Verify My Identity'}
                  </motion.button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#10b981',
                      margin: '0 auto 2rem',
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <CheckCircle2 size={50} />
                  </motion.div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Verified!</h2>
                  <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>
                    Your {accountType === 'BUSINESS' ? 'business' : 'identity'} has been successfully verified. All features are now unlocked.
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'left' }}>
                    <CheckCircle2 size={24} color="#10b981" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>Verification Complete</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Refreshing your dashboard...</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerificationGate;
