# Service Level Agreement (SLA): KYC & Identity Verification

**Provider:** Prembly (IdentityPass)  
**Client:** Pickpadi Global Inclusive Limited  
**Agreement Version:** 2026.1.B

## 1. Scope of Services
Prembly (IdentityPass) provides real-time verification services for the following identity documents and biometric checks:
*   National Identification Number (NIN)
*   Corporate Affairs Commission (CAC / RC) Business Verification
*   Bank Verification Number (BVN)
*   International Passport
*   Biometric Liveness Match (Facial Recognition)

## 2. Performance Metrics
### 2.1 Service Availability (Uptime)
*   **Target:** 99.9% Uptime 24/7/365.
*   **Maintenance:** Scheduled maintenance will be communicated at least 48 hours in advance and will not exceed 2 hours per month.

### 2.2 Response Time (Latency)
*   **API Response:** 95% of API requests shall be fulfilled within 1.5 seconds.
*   **Verification Result (Database Query):** 90% of government database queries (NIN/CAC) shall return results within 5 seconds.
*   **Liveness Analysis:** Facial matching results shall be delivered within 8 seconds.

## 3. Data Integrity & Compliance
*   **Accuracy:** Prembly guarantees that the data returned is an exact match of the government registry at the time of the query.
*   **Security:** All data in transit is encrypted using TLS 1.3. Data at rest is encrypted with AES-256.
*   **Privacy:** Prembly complies with the NDPR (Nigeria Data Protection Regulation) and GDPR standards.

## 4. Support & Incident Management
*   **Level 1 Support:** 24/7 access to technical documentation and status pages.
*   **Critical Issues (P0):** Response within 30 minutes for total service outage.
*   **High Priority (P1):** Response within 4 hours for degraded performance.

## 5. Security Protocols
*   **IP Whitelisting:** Paypee's production servers must be whitelisted for API access.
*   **Token Rotation:** API keys are rotated every 90 days as per security policy.

---
*Note: This document is a summary of the Master Service Agreement (MSA) between Pickpadi Global Inclusive Limited and Prembly.*
