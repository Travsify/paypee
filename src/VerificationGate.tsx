import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  AlertCircle,
  XCircle,
  RefreshCcw,
  Bell,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface VerificationGateProps {
  kycStatus: string;
  accountType: 'INDIVIDUAL' | 'BUSINESS' | 'DEVELOPER';
  onStatusChange?: (newStatus: string) => void;
  forceShow?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

import { API_BASE } from './config';

const VerificationGate: React.FC<VerificationGateProps> = ({ kycStatus: initialStatus, accountType, onStatusChange, forceShow }) => {
  const [kycStatus, setKycStatus] = useState(initialStatus);
  const [showModal, setShowModal] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idType, setIdType] = useState(accountType === 'BUSINESS' ? 'CAC' : 'NIN');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [idImage, setIdImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showMobileScan, setShowMobileScan] = useState(false);
  const [isCapturingId, setIsCapturingId] = useState(true); // Toggle between ID and Face

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const token = localStorage.getItem('paypee_token');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/verify/status`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.kycStatus && data.kycStatus !== kycStatus) {
        setKycStatus(data.kycStatus);
        if (onStatusChange) onStatusChange(data.kycStatus);
      }
    } catch (_) {}
  }, [token, kycStatus, onStatusChange]);

  // Resume mobile verify from sessionStorage
  useEffect(() => {
    const step = sessionStorage.getItem('mobile_verify_step');
    if (step === '2') {
      setKycStep(2);
      setShowModal(true);
      const sIdType = sessionStorage.getItem('mobile_verify_idType');
      const sIdNumber = sessionStorage.getItem('mobile_verify_idNumber');
      const sDob = sessionStorage.getItem('mobile_verify_dob');
      if (sIdType) setIdType(sIdType);
      if (sIdNumber) setIdNumber(sIdNumber);
      if (sDob) setDob(sDob);
      
      // Cleanup
      sessionStorage.removeItem('mobile_verify_step');
      sessionStorage.removeItem('mobile_verify_idType');
      sessionStorage.removeItem('mobile_verify_idNumber');
      sessionStorage.removeItem('mobile_verify_dob');
    }
  }, []);

  useEffect(() => {
    if (kycStep === 2 && !faceImage && !loading) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(s => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
           console.error(err);
           setError('Camera permission is required for biometric liveness match.');
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [kycStep, faceImage, loading]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // High resolution (720p) for better OCR and document detection
        ctx.filter = 'brightness(1.02) contrast(1.05)';
        ctx.drawImage(videoRef.current, 0, 0, 1280, 720);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
        
        if (isCapturingId) {
          setIdImage(dataUrl);
          setIsCapturingId(false); // Move to face capture next
        } else {
          setFaceImage(dataUrl);
          if (stream) stream.getTracks().forEach(t => t.stop());
        }
      }
    }
  };

  // Poll every 10s while PROCESSING, otherwise 30s for notifications
  useEffect(() => {
    fetchStatus();

    const interval = setInterval(fetchStatus, kycStatus === 'PROCESSING' ? 10000 : 30000);
    return () => clearInterval(interval);
  }, [kycStatus, fetchStatus]);

  const handleNextStep = () => {
    setError('');
    if (!idNumber.trim()) { setError('Please enter your ID number.'); return; }
    if (idType === 'NIN' && idNumber.trim().length !== 11) {
      setError('NIN must be exactly 11 digits.'); return;
    }
    if (idType === 'CAC' && idNumber.trim().length < 5) {
      setError('Please enter a valid CAC/RC number.'); return;
    }
    if (showDob && !dob) {
      setError('Please select your Date of Birth.');
      return;
    }
    setKycStep(2);
    setIsCapturingId(true);
  };

  const handleVerify = async () => {
    console.log('[FRONTEND DEBUG] 🎬 Verification button clicked!');
    setError('');
    if (!idImage) {
      setError('Please capture a clear photo of your ID document showing all four edges.');
      setIsCapturingId(true);
      return;
    }
    if (!faceImage) { 
      console.warn('[FRONTEND DEBUG] ❌ No selfie captured yet.');
      setError('Please capture a live selfie to proceed.'); 
      setIsCapturingId(false);
      return; 
    }

    setLoading(true);
    const token = localStorage.getItem('paypee_token');
    
    try {
      if (stream) {
        console.log('[FRONTEND DEBUG] 🎥 Stopping camera stream...');
        stream.getTracks().forEach(t => t.stop());
      }

      const res = await fetch(`${API_BASE}/api/verify/identity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          idType, 
          idNumber: idNumber.trim(), 
          dob, 
          faceImage,
          idImage
        })
      });

      const data = await res.json();

      if (res.ok) {
        setKycStatus(data.status);
        if (onStatusChange) onStatusChange(data.status);
        if (data.status === 'VERIFIED') {
          setTimeout(() => window.location.reload(), 2000);
        }
        setShowModal(false);
        await fetchStatus();
      } else {
        const backendError = data.error || 'Verification failed. Please check your details.';
        const hint = data.status === 'REJECTED' ? ' Ensure your face is clearly visible, well-lit, and matches your ID.' : '';
        setError(backendError + hint);
        if (data.status === 'REJECTED') {
          setKycStatus('REJECTED');
          await fetchStatus();
        }
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const idTypeOptions = accountType === 'BUSINESS'
    ? [{ value: 'CAC', label: 'CAC / RC Number', desc: 'Corporate Affairs Commission registration' }]
    : [
        { value: 'NIN', label: 'National ID (NIN)', desc: '11-digit National Identification Number' },
        { value: 'PASSPORT', label: 'International Passport', desc: 'Valid Nigerian Passport Number' },
        { value: 'DRIVERS_LICENSE', label: 'Driver\'s License', desc: 'Valid Nigerian Driver\'s License' },
        { value: 'VOTERS_CARD', label: 'Voter\'s Card (VIN)', desc: 'Valid Voter Identification Number' }
      ];

  const statusConfig = {
    PENDING:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: <ShieldAlert size={18} />, text: 'Complete your verification to unlock all features.' },
    PROCESSING: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   icon: <Clock size={18} />,       text: 'Your verification is being processed...' },
    REJECTED:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',    icon: <XCircle size={18} />,     text: 'Verification failed. Please retry with correct details.' },
  };

  const cfg = statusConfig[kycStatus as keyof typeof statusConfig];
  const isBusiness = accountType === 'BUSINESS';
  const showDob = !isBusiness && (idType === 'NIN' || idType === 'BVN' || idType === 'PASSPORT');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const data = await res.json();
      setNotifications(data);
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  if (kycStatus === 'VERIFIED' && !forceShow) {
    return (
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#fff', width: '45px', height: '45px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
        >
          <Bell size={20} />
          {notifications.some(n => !n.read) && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '12px', height: '12px', background: '#f43f5e', borderRadius: '50%', border: '2px solid #0f172a' }} />
          )}
        </button>
        <AnimatePresence>
          {showNotifications && (
            <NotificationPanel notifications={notifications} show={showNotifications} onClose={() => setShowNotifications(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Status Banner */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        style={{
          background: cfg?.bg || 'rgba(99,102,241,0.1)',
          borderBottom: `1px solid ${cfg?.color || '#6366f1'}33`,
          color: '#fff',
          padding: '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: forceShow ? '#f59e0b' : cfg?.color }}>
          {forceShow ? <ShieldAlert size={18} /> : cfg?.icon}
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
            {forceShow ? 'Card Issuer requires additional details (DOB & Selfie).' : cfg?.text}
          </span>
          {kycStatus === 'PROCESSING' && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <RefreshCcw size={14} color={cfg?.color} />
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <Bell size={18} />
            {notifications.some(n => !n.read) && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#f43f5e', borderRadius: '50%' }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationPanel notifications={notifications} show={showNotifications} onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>

          {(kycStatus === 'PENDING' || kycStatus === 'REJECTED' || forceShow) && (
            <button
              onClick={() => { setShowModal(true); setKycStep(1); setError(''); }}
              style={{ background: forceShow ? '#f59e0b' : cfg?.color, border: 'none', color: '#fff', padding: '0.4rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {forceShow ? 'Update Now' : kycStatus === 'REJECTED' ? 'Retry Verification' : 'Verify Now'} <ChevronRight size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {/* KYC Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="paypee-modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="paypee-modal-content"
              style={{ maxWidth: '520px' }}
            >
              <div style={{ padding: '2.5rem' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: 72, height: 72, background: 'rgba(99,102,241,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', margin: '0 auto 1.25rem' }}>
                  {kycStep === 2 ? <User size={36} /> : accountType === 'BUSINESS' ? <Building2 size={36} /> : <User size={36} />}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {kycStep === 2 ? (isCapturingId ? 'ID Document Photo' : 'Liveness Face Match') : kycStatus === 'REJECTED' ? 'Retry Verification' : accountType === 'BUSINESS' ? 'Business Verification' : 'Identity Verification'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {kycStep === 2 
                    ? isCapturingId 
                      ? `Please place your ${idType} card within the frame. Ensure all four edges are showing and text is readable. No scans or photocopies.`
                      : `Now, take a live selfie. Ensure your face is well-lit and fits the oval frame.`
                    : kycStatus === 'REJECTED' 
                    ? 'Your previous attempt failed. Please check your ID number carefully and ensure your document photo is clear.'
                    : `Verify your ${accountType === 'BUSINESS' ? 'business registration' : 'identity'} to unlock global transfers, card issuance, and all Paypee features.`
                  }
                </p>
              </div>

              {kycStep === 1 ? (
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>
                      VERIFICATION TYPE
                    </label>
                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                      {idTypeOptions.map(opt => (
                        <div
                          key={opt.value}
                          onClick={() => setIdType(opt.value)}
                          style={{ background: idType === opt.value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)', border: `2px solid ${idType === opt.value ? '#6366f1' : '#1e293b'}`, borderRadius: '14px', padding: '0.9rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}
                        >
                          <div style={{ width: 18, height: 18, borderRadius: '50%', border: idType === opt.value ? '5px solid #6366f1' : '2px solid #475569', transition: 'all 0.2s', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opt.label}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{opt.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
                      {idType === 'NIN' ? 'NIN NUMBER' : idType === 'CAC' ? 'CAC / RC NUMBER' : 'ID NUMBER'}
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={e => { setIdNumber(e.target.value); setError(''); }}
                      placeholder={idType === 'CAC' ? 'e.g. RC123456 or BN123456' : idType === 'NIN' ? 'Enter 11-digit NIN' : 'Enter your ID number'}
                      maxLength={20}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${error ? '#f43f5e' : '#1e293b'}`, borderRadius: '12px', padding: '0.9rem 1.1rem', color: '#fff', fontSize: '1rem', fontWeight: 600, letterSpacing: '2px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
                    />
                  </div>

                  {showDob && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
                        DATE OF BIRTH
                      </label>
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={e => { setDob(e.target.value); setError(''); }}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${error ? '#f43f5e' : '#1e293b'}`, borderRadius: '12px', padding: '0.9rem 1.1rem', color: '#fff', fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', colorScheme: 'dark' }}
                      />
                    </div>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1.25rem', color: '#f43f5e', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        <AlertCircle size={16} /> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    disabled={!idNumber.trim()}
                    style={{ width: '100%', background: (!idNumber.trim()) ? '#1e293b' : '#6366f1', color: (!idNumber.trim()) ? '#475569' : '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: (!idNumber.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    Continue <ChevronRight size={18} />
                  </motion.button>
                </>
              ) : showMobileScan ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '1rem 0' }}>
                   <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <QRCodeSVG 
                       value={window.location.origin + window.location.pathname + `?auth=${token}&step=2&idType=${idType}&idNumber=${idNumber}&dob=${dob}`} 
                       size={180}
                       level="H"
                       includeMargin={true}
                     />
                   </div>
                   <button
                     onClick={() => setShowMobileScan(false)}
                     style={{ background: 'transparent', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', padding: '0.5rem' }}
                   >
                     Back to Desktop Camera
                   </button>
                </div>
              ) : (
                <>
                  <div style={{ background: '#1e293b', borderRadius: '24px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '2px dashed #475569', position: 'relative', overflow: 'hidden' }}>
                     {isCapturingId && idImage ? (
                       <img src={idImage} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} alt="Captured ID" />
                     ) : !isCapturingId && faceImage ? (
                       <img src={faceImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Captured Selfie" />
                     ) : !loading ? (
                       <>
                         <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCapturingId ? 'none' : 'scaleX(-1)' }} />
                         <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {isCapturingId ? (
                             <div style={{ width: '85%', height: '70%', border: '3px solid #6366f1', borderRadius: '12px', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
                               <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800 }}>ALIGN ID WITHIN FRAME</div>
                             </div>
                           ) : (
                             <div style={{ width: 160, height: 210, border: '4px solid #10b981', borderRadius: '50% 50% 40% 40%', opacity: 0.9, boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }} />
                           )}
                         </div>
                       </>
                     ) : (
                       <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ color: '#fff' }}><RefreshCcw size={40} /></motion.div>
                         <span style={{ color: '#fff', fontWeight: 800, letterSpacing: '1px' }}>PROCESSING...</span>
                       </div>
                     )}
                     <canvas ref={canvasRef} width="1280" height="720" style={{ display: 'none' }} />
                  </div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1.25rem', color: '#f43f5e', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left' }}
                      >
                        <AlertCircle size={20} style={{ flexShrink: 0 }} /> <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {(!idImage || (idImage && !faceImage)) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={captureImage}
                        style={{ width: '100%', background: '#f59e0b', color: '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        {isCapturingId ? 'Capture ID Document' : 'Capture Selfie'}
                      </motion.button>
                      {isCapturingId && idImage && (
                         <button
                           onClick={() => setIdImage(null)}
                           style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '1rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                         >
                           Retake ID Photo
                         </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setFaceImage(null); setIsCapturingId(false); }}
                        disabled={loading}
                        style={{ flex: '1', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #475569', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
                      >
                        Retake Selfie
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerify}
                        disabled={loading}
                        style={{ flex: '2', background: loading ? '#1e293b' : '#6366f1', color: loading ? '#475569' : '#fff', border: 'none', padding: '1.1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 10px 30px -10px rgba(99,102,241,0.5)' }}
                      >
                        {loading ? 'Processing...' : 'Submit & Verify'}
                      </motion.button>
                    </div>
                  )}
                </>
              )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerificationGate;

// ==================
// Notification Panel
// ==================
const NotificationPanel = ({ notifications, show, onClose }: { notifications: Notification[], show: boolean, onClose: () => void }) => {
  if (!show) return null;

  const typeColors: Record<string, string> = {
    ERROR: '#f43f5e',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    INFO: '#6366f1'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: '4.5rem', right: '2rem', width: '380px', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', zIndex: 5000, overflow: 'hidden' }}
    >
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <Bell size={18} color="#6366f1" />
           <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>Recent Activity</span>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '50%' }}><X size={16} /></button>
      </div>
      <div style={{ maxHeight: '450px', overflowY: 'auto', background: '#0a0f1e' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
            <Bell size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <div>No activity yet</div>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', background: n.read ? 'transparent' : 'rgba(99,102,241,0.03)', position: 'relative' }}>
            {!n.read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: typeColors[n.type] || '#6366f1' }} />}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColors[n.type] || '#6366f1', marginTop: '0.3rem', flexShrink: 0, boxShadow: `0 0 10px ${typeColors[n.type] || '#6366f1'}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {n.title}
                  {n.type === 'SUCCESS' && <CheckCircle2 size={14} color="#10b981" />}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{n.message}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.6rem', fontWeight: 600 }}>{new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#0f172a', textAlign: 'center' }}>
         <button style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View All Activity</button>
      </div>
    </motion.div>
  );
};
