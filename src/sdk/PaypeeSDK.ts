/**
 * Paypee Official Universal SDK (v1.0.0-alpha)
 * Infrastructure for the Modern Global Business.
 */

export class Paypee {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, options?: { isSandbox?: boolean }) {
    this.apiKey = apiKey;
    this.baseUrl = options?.isSandbox 
      ? 'https://paypee-api-sandbox.onrender.com/api' 
      : 'https://paypee-api-kmhv.onrender.com/api';
  }

  private async request(path: string, method: string = 'GET', body?: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Paypee API Error');
    }

    return response.json();
  }

  // ==========================================
  // Wallets & IBANs
  // ==========================================

  async getWallets() {
    return this.request('/wallets');
  }

  async createGlobalAccount(currency: 'EUR' | 'GBP' | 'CNY') {
    return this.request('/accounts/provision', 'POST', { currency });
  }

  // ==========================================
  // Virtual Cards
  // ==========================================

  async issueCard(walletId: string) {
    return this.request('/cards', 'POST', { walletId });
  }

  async freezeCard(cardId: string) {
    return this.request(`/cards/${cardId}/toggle-freeze`, 'POST');
  }

  // ==========================================
  // AI & Autonomous Treasury
  // ==========================================

  async getAiInsights() {
    return this.request('/ai/insights');
  }

  async triggerAutoHedge() {
    return this.request('/ai/hedge', 'POST');
  }

  // ==========================================
  // Payment Links
  // ==========================================

  async createPaymentLink(data: { title: string; amount: number; currency: string }) {
    return this.request('/payment-links', 'POST', data);
  }

  // ==========================================
  // Bills & Utility Payments
  // ==========================================

  async getBillProviders(category: 'AIRTIME' | 'UTILITY' | 'CABLE' | 'BETTING') {
    return this.request(`/bills/providers?category=${category}`);
  }

  async payBill(data: { walletId: string; amount: number; providerId: string; customerId: string; category: string }) {
    return this.request('/bills/pay', 'POST', data);
  }
}

// Example Usage:
// const paypee = new Paypee('sk_live_...');
// const account = await paypee.createGlobalAccount('EUR');
