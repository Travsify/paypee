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
  Terminal 
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

  if (kycStatus === 'VERIFIED') return null;

  const handleVerify = async () => {
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
          idType: accountType === 'INDIVIDUAL' ? 'NIN' : 'CAC',
          idNumber: 'AUTO_VERIFY' // Demo placeholder
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        // Refresh page after a delay to show VERIFIED status
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        alert(data.error || 'Verification failed');
      }
    } catch (err) {
      alert('Network error during verification');
    } finally {
      setLoading(false);
    }
  };

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
            {kycStatus !== 'VERIFIED'
              ? `Verification Required: Complete your ${accountType === 'INDIVIDUAL' ? 'KYC' : 'KYB'} to unlock all features.` 
              : 'Verifying your account details...'}
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
                maxWidth: '600px', 
                width: '100%',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}
              >✕</button>

              {!submitted ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      {accountType === 'INDIVIDUAL' ? 'Identity Verification' : 'Entity Verification'}
                    </h2>
                    <p style={{ color: '#64748b' }}>We need a few documents to verify your {accountType.toLowerCase()} profile and enable global transfers.</p>
                  </div>

                  <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                    {accountType === 'INDIVIDUAL' ? (
                      <>
                        <div style={docItemStyle}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Upload size={20} color="#4f46e5" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Government Issued ID</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Passport, License or ID Card</div>
                                </div>
                            </div>
                            <button style={uploadButtonStyle}>Upload</button>
                        </div>
                        <div style={docItemStyle}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <User size={20} color="#4f46e5" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Selfie Check</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Live liveness detection</div>
                                </div>
                            </div>
                            <button style={uploadButtonStyle}>Start</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={docItemStyle}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Building2 size={20} color="#4f46e5" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Certificate of Incorporation</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Official government document</div>
                                </div>
                            </div>
                            <button style={uploadButtonStyle}>Upload</button>
                        </div>
                        <div style={docItemStyle}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Upload size={20} color="#4f46e5" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>Proof of Address</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Utility bill or bank statement</div>
                                </div>
                            </div>
                            <button style={uploadButtonStyle}>Upload</button>
                        </div>
                      </>
                    )}
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerify}
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      background: '#4f46e5', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '1.2rem', 
                      borderRadius: '16px', 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Processing...' : 'Submit Verification Docs'}
                  </motion.button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ 
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
                  }}>
                    <CheckCircle2 size={50} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Documents Submitted!</h2>
                  <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Our compliance team is reviewing your application. You'll receive a notification within 24 hours.</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'left' }}>
                    <Clock size={24} color="#f59e0b" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Review in Progress</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated time: 12 - 24 hours</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowModal(false)}
                    style={{ 
                      marginTop: '3rem',
                      background: 'transparent', 
                      border: 'none', 
                      color: '#4f46e5', 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const docItemStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid #1e293b',
  borderRadius: '20px',
  padding: '1.2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const uploadButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #1e293b',
  color: '#fff',
  padding: '0.6rem 1.2rem',
  borderRadius: '10px',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
};

export default VerificationGate;
