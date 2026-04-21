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
  X,
  ShieldCheck,
  Camera,
  Scan,
  Smartphone,
  Eye,
  Activity,
  Lock,
  Globe
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import NotificationPanel from './components/NotificationPanel';
import { API_BASE } from './config';

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
  const [isCapturingId, setIsCapturingId] = useState(true);

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
        ctx.filter = 'brightness(1.02) contrast(1.05)';
        ctx.drawImage(videoRef.current, 0, 0, 1280, 720);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
        
        if (isCapturingId) {
          setIdImage(dataUrl);
          setIsCapturingId(false);
        } else {
          setFaceImage(dataUrl);
          if (stream) stream.getTracks().forEach(t => t.stop());
        }
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, kycStatus === 'PROCESSING' ? 10000 : 30000);
    return () => clearInterval(interval);
  }, [kycStatus, fetchStatus]);

  const handleNextStep = () => {
    setError('');
    if (!idNumber.trim()) { setError('Identification ID is required.'); return; }
    if (idType === 'NIN' && idNumber.trim().length !== 11) {
      setError('NIN must be exactly 11 digits for protocol validation.'); return;
    }
    if (idType === 'CAC' && idNumber.trim().length < 5) {
      setError('Please provide a valid CAC/RC institutional ID.'); return;
    }
    if (showDob && !dob) {
      setError('Date of Birth is required for compliance screening.');
      return;
    }
    setKycStep(2);
    setIsCapturingId(true);
  };

  const handleVerify = async () => {
    setError('');
    if (!idImage) {
      setError('Please upload a clear photo of your ID.');
      setIsCapturingId(true);
      return;
    }
    if (!faceImage) { 
      setError('Please take a selfie so we can verify it\'s you.'); 
      setIsCapturingId(false);
      return; 
    }

    setLoading(true);
    const token = localStorage.getItem('paypee_token');
    
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }

      const res = await fetch(`${API_BASE}/api/verify/identity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idType, idNumber: idNumber.trim(), dob, faceImage, idImage })
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
        const backendError = data.error || 'Verification failed. Please try again.';
        const hint = data.status === 'REJECTED' ? ' Make sure the photo is clear and matches your details.' : '';
        setError(backendError + hint);
        if (data.status === 'REJECTED') {
          setKycStatus('REJECTED');
          await fetchStatus();
        }
      }
    } catch (err: any) {
      setError(`Something went wrong: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const idTypeOptions = accountType === 'BUSINESS'
    ? [{ value: 'CAC', label: 'Business Registration', desc: 'CAC / RC Number', icon: Building2 }]
    : [
        { value: 'NIN', label: 'NIN', desc: '11-digit NIN Number', icon: ShieldCheck },
        { value: 'PASSPORT', label: 'Passport', desc: 'International Passport', icon: Globe },
        { value: 'DRIVERS_LICENSE', label: 'Driver\'s License', desc: 'Government issued license', icon: Activity },
        { value: 'VOTERS_CARD', label: 'Voter\'s Card', desc: 'Personal Identification', icon: User }
      ];

  const statusConfig = {
    PENDING:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   icon: <ShieldAlert size={18} />, text: 'Action Required: Please verify your account to unlock all features.' },
    PROCESSING: { color: 'var(--primary)', bg: 'rgba(99,102,241,0.08)',   icon: <Clock size={18} />,       text: 'Checking your details... this usually takes a few minutes.' },
    REJECTED: { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', icon: <XCircle size={18} />, text: 'Verification failed. Please check your information and try again.' },
  };

  const cfg = statusConfig[kycStatus as keyof typeof statusConfig];
  const isBusiness = accountType === 'BUSINESS';
  const showDob = !isBusiness && (idType === 'NIN' || idType === 'BVN' || idType === 'PASSPORT');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
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
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        style={{
          background: 'rgba(10, 15, 30, 0.8)',
          backdropFilter: 'blur(30px)',
          borderBottom: `1px solid ${forceShow ? 'rgba(245,158,11,0.2)' : (cfg?.color + '33')}`,
          color: '#fff',
          padding: '1rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: forceShow ? 'rgba(245,158,11,0.1)' : cfg?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: forceShow ? '#f59e0b' : cfg?.color, border: `1px solid ${forceShow ? 'rgba(245,158,11,0.2)' : (cfg?.color + '44')}` }}>
             {forceShow ? <ShieldAlert size={20} /> : cfg?.icon}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.01em' }}>
              {forceShow ? 'Institutional Compliance Required' : cfg?.text}
            </div>
            {kycStatus === 'PROCESSING' && (
               <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCcw size={10} className="animate-spin" /> Synchronizing with Maplerad Core...
               </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AnimatePresence>
            {showNotifications && (
              <NotificationPanel notifications={notifications} show={showNotifications} onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>

          {(kycStatus === 'PENDING' || kycStatus === 'REJECTED' || forceShow) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowModal(true); setKycStep(1); setError(''); }}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 900, background: forceShow ? '#f59e0b' : cfg?.color }}
            >
              {forceShow ? 'Provision Now' : kycStatus === 'REJECTED' ? 'Restart Protocol' : 'Begin Verification'} <ChevronRight size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="paypee-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="paypee-modal-content"
              style={{ maxWidth: '560px', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', zIndex: 1, padding: '3.5rem' }}>
                <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.6rem', borderRadius: '50%' }}>
                  <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                  <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1.5rem', border: '1px solid rgba(99,102,241,0.15)' }}>
                    {kycStep === 2 ? (isCapturingId ? <Scan size={40} /> : <Eye size={40} />) : accountType === 'BUSINESS' ? <Building2 size={40} /> : <ShieldCheck size={40} />}
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
                    {kycStep === 2 ? (isCapturingId ? 'Document Capture' : 'Biometric Match') : kycStatus === 'REJECTED' ? 'Policy Reclamation' : accountType === 'BUSINESS' ? 'Business Registry' : 'Identity Protocol'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {kycStep === 2 
                      ? isCapturingId 
                        ? `Place your ${idType} clearly within the optical frame. All four corners must be visible. No glare or shadows.`
                        : `Initialization of biometric liveness check. Position your face within the digital oval and maintain stability.`
                      : kycStatus === 'REJECTED' 
                      ? 'Previous validation attempt was unsuccessful. Please audit your document clarity and input accuracy.'
                      : `Comply with global fintech standards to unlock institutional-grade capital movement and issuance rails.`
                    }
                  </p>
                </div>

                {kycStep === 1 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                        1. SELECT IDENTIFICATION PROTOCOL
                      </label>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {idTypeOptions.map(opt => (
                          <motion.div
                            key={opt.value}
                            whileHover={{ background: 'rgba(255,255,255,0.03)', x: 4 }}
                            onClick={() => setIdType(opt.value)}
                            style={{ 
                              background: idType === opt.value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.01)', 
                              border: `1px solid ${idType === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}`, 
                              borderRadius: '20px', 
                              padding: '1.25rem 1.5rem', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1.25rem', 
                              transition: 'all 0.2s' 
                            }}
                          >
                            <div style={{ width: 44, height: 44, borderRadius: '12px', background: idType === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idType === opt.value ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                              <opt.icon size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: '1rem', color: idType === opt.value ? '#fff' : 'rgba(255,255,255,0.8)' }}>{opt.label}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{opt.desc}</div>
                            </div>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${idType === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`, padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {idType === opt.value && <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary)' }} />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        2. SECURE DATA ENTRY
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>{idType === 'NIN' ? 'NIN ID NUMBER' : idType === 'CAC' ? 'CORPORATE REGISTRY ID' : 'DOCUMENT ID NUMBER'}</span>
                          <input
                            type="text"
                            value={idNumber}
                            onChange={e => { setIdNumber(e.target.value); setError(''); }}
                            placeholder={idType === 'CAC' ? 'e.g. RC000000' : 'Enter Identification Number'}
                            className="form-input"
                            style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}
                          />
                        </div>

                        {showDob && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>DATE OF BIRTH (COMPLIANCE CHECK)</span>
                            <input 
                              type="date" 
                              value={dob} 
                              onChange={e => { setDob(e.target.value); setError(''); }}
                              className="form-input"
                              style={{ colorScheme: 'dark' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '16px', padding: '1.25rem', color: '#f43f5e', fontSize: '0.9rem', fontWeight: 700 }}
                        >
                          <AlertCircle size={20} /> {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextStep}
                      disabled={!idNumber.trim()}
                      className="btn btn-primary"
                      style={{ padding: '1.25rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900, background: !idNumber.trim() ? 'rgba(255,255,255,0.05)' : 'var(--primary)', color: !idNumber.trim() ? 'rgba(255,255,255,0.2)' : '#fff' }}
                    >
                      Initialize Biometric Phase <ChevronRight size={20} />
                    </motion.button>
                  </div>
                ) : showMobileScan ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                     <div style={{ background: '#fff', padding: '2rem', borderRadius: '32px', display: 'inline-block', marginBottom: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                       <QRCodeSVG 
                         value={window.location.origin + window.location.pathname + `?auth=${token}&step=2&idType=${idType}&idNumber=${idNumber}&dob=${dob}`} 
                         size={220}
                         level="H"
                         includeMargin={true}
                       />
                     </div>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', fontWeight: 500 }}>Scan with your mobile device to complete biometrics with a high-resolution camera.</p>
                     <button
                       onClick={() => setShowMobileScan(false)}
                       className="btn btn-outline"
                       style={{ width: '100%', padding: '1rem', borderRadius: '14px' }}
                     >
                       Revert to Internal Camera
                     </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div style={{ position: 'relative', borderRadius: '32px', height: '360px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                       {isCapturingId && idImage ? (
                         <img src={idImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="ID Protocol" />
                       ) : !isCapturingId && faceImage ? (
                         <img src={faceImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Biometric Match" />
                       ) : !loading ? (
                         <>
                           <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCapturingId ? 'none' : 'scaleX(-1)' }} />
                           <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {isCapturingId ? (
                               <div style={{ width: '85%', height: '65%', border: '2px solid var(--primary)', borderRadius: '16px', boxShadow: '0 0 0 1000px rgba(2,6,23,0.6)' }}>
                                 <div style={{ position: 'absolute', top: '-2.5rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>ALIGN DOCUMENT</div>
                               </div>
                             ) : (
                               <div style={{ width: 180, height: 240, border: '2px solid var(--accent)', borderRadius: '50% 50% 40% 40%', boxShadow: '0 0 0 1000px rgba(2,6,23,0.6)' }}>
                                  <div style={{ position: 'absolute', top: '-2.5rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>ALIGN BIOMETRICS</div>
                               </div>
                             )}
                           </div>
                         </>
                       ) : (
                         <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
                           <RefreshCcw size={48} className="animate-spin" color="var(--primary)" />
                           <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>PROCESSING PROTOCOL...</span>
                         </div>
                       )}
                       <canvas ref={canvasRef} width="1280" height="720" style={{ display: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {(!idImage || (idImage && !faceImage)) ? (
                         <div style={{ display: 'flex', gap: '1rem' }}>
                           <motion.button
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={captureImage}
                             className="btn btn-primary"
                             style={{ flex: 1, padding: '1.25rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900 }}
                           >
                             <Camera size={20} /> {isCapturingId ? 'Capture ID Data' : 'Capture Biometrics'}
                           </motion.button>
                           {isCapturingId ? (
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setShowMobileScan(true)}
                                className="btn btn-outline"
                                style={{ width: '64px', padding: 0, borderRadius: '18px' }}
                              >
                                 <Smartphone size={24} />
                              </motion.button>
                           ) : idImage && (
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                onClick={() => { setIdImage(null); setIsCapturingId(true); }}
                                className="btn btn-outline"
                                style={{ width: '64px', padding: 0, borderRadius: '18px' }}
                              >
                                 <RefreshCcw size={24} />
                              </motion.button>
                           )}
                         </div>
                       ) : (
                         <div style={{ display: 'flex', gap: '1.25rem' }}>
                           <motion.button
                             whileTap={{ scale: 0.98 }}
                             onClick={() => { setFaceImage(null); setIsCapturingId(false); }}
                             disabled={loading}
                             className="btn btn-outline"
                             style={{ flex: 1, padding: '1.1rem', borderRadius: '18px', fontWeight: 900 }}
                           >
                             Recalibrate Selfie
                           </motion.button>
                           <motion.button
                             whileTap={{ scale: 0.98 }}
                             onClick={handleVerify}
                             disabled={loading}
                             className="btn btn-primary"
                             style={{ flex: 2, padding: '1.1rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900 }}
                           >
                             {loading ? 'Submitting...' : 'Authorize Submission'}
                           </motion.button>
                         </div>
                       )}
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '16px', padding: '1.25rem', color: '#f43f5e', fontSize: '0.9rem', fontWeight: 700 }}
                        >
                          <AlertCircle size={22} style={{ flexShrink: 0 }} /> {error}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
