# Intended Use of Services & Crypto Integration Description

**Entity:** Pickpadi Global Inclusive Limited (RC: 8229347)  
**Compliance Officer:** Patrick Achua  
**Date:** April 2026

## 1. Executive Summary
Paypee is a next-generation financial operating system designed to bridge the gap between traditional fiat currencies and digital assets for African businesses and individuals. Our primary goal is to facilitate seamless cross-border value transfer, treasury management, and multi-currency payouts by leveraging both traditional banking rails and blockchain infrastructure.

## 2. Intended Use of Services
Paypee intends to use the services provided by **Bitnob** and **Quidax** to enhance its institutional liquidity and settle cross-border transactions efficiently. Our use case focuses on:

*   **Cross-Border Remittance:** Utilizing stablecoin liquidity to settle transactions between Nigeria and global markets, reducing settlement times from days to minutes.
*   **Treasury Management:** Holding and managing corporate assets in USD-pegged stablecoins to mitigate local currency volatility for our B2B clients.
*   **Virtual Card Funding:** Providing a mechanism for users to fund their USD virtual cards using crypto-to-fiat conversion layers.
*   **Developer Infrastructure:** Offering APIs for third-party developers to integrate global payment rails into their applications.

## 3. Crypto Functionalities Integration
Crypto functionalities are core to the Paypee "Engine" but are presented via a simplified interface to the end user.

### a. Stablecoin Settlement (USDT/USDC)
We integrate with Quidax/Bitnob APIs to perform real-time conversion between NGN (Nigerian Naira) and USD stablecoins. This allows us to offer competitive FX rates for users sending money to Europe, the US, or other African countries.

### b. Bitcoin Lightning Network (via Bitnob)
We leverage Bitnob's Lightning Network infrastructure to enable micro-payments and instant global transfers with minimal fees. This is particularly targeted at the "Individual" segment for remittances.

### c. Custody and Security
Paypee does **not** provide self-custody wallets to users. All digital assets are held in institutional-grade MPC (Multi-Party Computation) wallets managed through our partners (Bitnob/Quidax). This ensures that we maintain a high level of security and compliance while abstracting the complexity of private key management from the user.

### d. Compliance and Monitoring
Every crypto-linked transaction undergoes:
*   **On-chain Analysis:** Screening for high-risk wallet addresses using industry-standard tools.
*   **Liveness Check:** Mandatory biometric verification for all users attempting to interact with crypto-linked features (via Prembly).

## 4. Target Audience
*   **Individuals:** Remote workers and freelancers receiving global payments.
*   **Businesses:** Importers and exporters needing efficient FX liquidity.
*   **Developers:** Fintechs looking to build on top of Paypee's multi-currency rails.

---
**Signed,**  
Operations Lead, Pickpadi Global Inclusive Limited
