// API Client Service - Handles all HTTP communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class APIClient {
  private baseURL: string;
  private adminToken?: string;
  private refreshTimeout?: NodeJS.Timeout;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.adminToken = this.getStoredToken();
  }

  private getStoredToken(): string | undefined {
    return localStorage.getItem('admin_token') || undefined;
  }

  setToken(token: string) {
    this.adminToken = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.adminToken = undefined;
    localStorage.removeItem('admin_token');
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (!skipAuth && this.adminToken) {
      headers.set('Authorization', `Bearer ${this.adminToken}`);
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401) {
        this.clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Customer management endpoints
  async getCustomers() {
    return this.request('/api/admin/customers');
  }

  async getCustomer(customerId: string) {
    return this.request(`/api/admin/customers/${customerId}`);
  }

  async updateCustomer(customerId: string, data: any) {
    return this.request(`/api/admin/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Products endpoints
  async getProducts() {
    return this.request('/api/admin/products');
  }

  async updateProduct(productId: string, data: any) {
    return this.request(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Promotions endpoints
  async getPromotions() {
    return this.request('/api/admin/promotions');
  }

  async createPromotion(data: any) {
    return this.request('/api/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePromotion(promoId: string, data: any) {
    return this.request(`/api/admin/promotions/${promoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async notifyCustomer(customerId: string, notification: any) {
    return this.request(`/api/admin/notify/${customerId}`, {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  // Broadcast to all customers
  async broadcastNotification(notification: any) {
    return this.request('/api/admin/broadcast', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }
}

export const apiClient = new APIClient();
