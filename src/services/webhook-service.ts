// Webhook Service - For triggering events and webhooks

export interface WebhookEvent {
  event: string;
  payload: any;
  timestamp: string;
  source: 'admin' | 'customer';
}

export class WebhookService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  private webhookSecret = import.meta.env.VITE_WEBHOOK_SECRET;

  async triggerEvent(eventType: string, payload: any, token: string): Promise<any> {
    const event: WebhookEvent = {
      event: eventType,
      payload,
      timestamp: new Date().toISOString(),
      source: 'admin',
    };

    try {
      const response = await fetch(`${this.apiUrl}/api/webhooks/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Webhook-Secret': this.webhookSecret || '',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Webhook trigger failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Webhook trigger error:', error);
      throw error;
    }
  }

  // Specific event triggers
  async notifyCustomerUpdate(customerId: string, data: any, token: string) {
    return this.triggerEvent('customer.updated', { customerId, ...data }, token);
  }

  async notifyProductChange(productId: string, data: any, token: string) {
    return this.triggerEvent('product.changed', { productId, ...data }, token);
  }

  async notifyPromotionActive(promoId: string, data: any, token: string) {
    return this.triggerEvent('promotion.active', { promoId, ...data }, token);
  }

  async broadcastMessage(message: string, token: string) {
    return this.triggerEvent('message.broadcast', { message }, token);
  }
}

export const webhookService = new WebhookService();
