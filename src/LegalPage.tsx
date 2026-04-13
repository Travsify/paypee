import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const LegalPage = ({ view, onBack }: { view: 'privacy' | 'terms' | 'pci', onBack: () => void }) => {
  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      icon: <FileText size={40} color="var(--primary)" />,
      badge: "DATA PROTECTION",
      updated: "Last Updated: April 2026",
      body: (
        <>
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other necessary KYC (Know Your Customer) documentation required by global regulations.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services. Specifically: to process your global transactions efficiently, to send you notices and updates, to personalize your experience, and to combat illicit activities such as fraud or money laundering.</p>

          <h3>3. Sharing of Information</h3>
          <p>We may share your information with our banking partners and regulatory bodies as mandated strictly by law. We do not sell your personal data to any third party.</p>
        </>
      )
    },
    terms: {
      title: "Terms of Service",
      icon: <FileText size={40} color="var(--primary)" />,
      badge: "LEGAL AGREEMENT",
      updated: "Last Updated: April 2026",
      body: (
        <>
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or using the Paypee platform, virtual cards, API APIs, or robust treasury dashboards, you agree to be bound by these Terms. If you do not agree, you may not access our services.</p>

          <h3>2. User Responsibilities & Conduct</h3>
          <p>You agree to comply with all applicable local and international laws when utilizing Paypee rails. Any illegal financial activity, circumvention of KYC, or exploitation of our APIs will result in immediate termination and asset freezing.</p>

          <h3>3. Funds, Fees, and Settlement</h3>
          <p>All FX rates and transaction fees are presented transparently before execution. Due to the high liquidity volatile nature of cross-border FX, displayed target rates are valid for 15 minutes.</p>
        </>
      )
    },
    pci: {
      title: "Security & PCI DSS",
      icon: <ShieldCheck size={40} color="var(--accent)" />,
      badge: "SECURITY INFRASTRUCTURE",
      updated: "Audited: January 2026",
      body: (
        <>
          <h3>Payment Card Industry Data Security Standard (PCI DSS)</h3>
          <p>Paypee is certified as a PCI DSS Level 1 Service Provider. This is the highest level of assessment available involving an independent third-party QSA (Qualified Security Assessor). Your virtual and physical card data is encrypted and vaulted off-site. We never store raw magnetic stripe, CVV, or PIN data.</p>
          
          <h3>ISO 27001 Certification</h3>
          <p>Our information security management system is ISO 27001 certified. We enforce strict multi-factor authentication (MFA) and granular API key permissions across all critical systems.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Lock color="#10b981" size={32} />
                <div>
                   <div style={{ fontWeight: 800 }}>256-bit AES</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>At-rest & In-transit</div>
                </div>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CheckCircle2 color="#10b981" size={32} />
                <div>
                   <div style={{ fontWeight: 800 }}>MPC Custody</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Multi-party computation</div>
                </div>
             </div>
          </div>
        </>
      )
    }
  };

  const content = contentMap[view];

  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600 }}>&larr; Back to Home</button>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                 {content.icon}
              </div>
              <div>
                 <div className="badge">{content.badge}</div>
                 <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{content.title}</h1>
                 <p style={{ color: 'var(--text-muted)' }}>{content.updated}</p>
              </div>
           </div>

           <div style={{ height: '1px', background: 'var(--border)', margin: '3rem 0' }} />

           <div className="legal-content" style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem' }}>
              {content.body}
           </div>
        </motion.div>
      </div>
    </div>
  );
};
