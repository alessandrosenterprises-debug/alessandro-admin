import React, { useEffect, useState } from 'react';
import { useSharedStore } from '../services/shared-store';
import { syncClient } from '../services/sync-client';
import { notificationService } from '../services/notification-service';
import { apiClient } from '../services/api-client';

export const Dashboard: React.FC = () => {
  const { customers, products, promotions, loading, error, setCustomers, setProducts, setPromotions } = useSharedStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect WebSocket
    syncClient.connect()
      .then(() => setIsConnected(true))
      .catch(err => {
        console.error('Failed to connect:', err);
        notificationService.error('Connection Error', 'Failed to connect to real-time sync');
      });

    // Load initial data
    loadData();

    // Subscribe to real-time updates
    const unsubscribeCustomers = syncClient.on('customer.updated', (event) => {
      const { customers: updatedCustomers } = event.data;
      setCustomers(updatedCustomers);
      notificationService.info('Update', 'Customer data refreshed');
    });

    const unsubscribeProducts = syncClient.on('product.changed', (event) => {
      const { products: updatedProducts } = event.data;
      setProducts(updatedProducts);
      notificationService.info('Update', 'Product data refreshed');
    });

    const unsubscribePromos = syncClient.on('promotion.active', (event) => {
      const { promotions: updatedPromos } = event.data;
      setPromotions(updatedPromos);
      notificationService.success('Promotion Active', 'New promotion is now active');
    });

    return () => {
      unsubscribeCustomers();
      unsubscribeProducts();
      unsubscribePromos();
      syncClient.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [customersData, productsData, promotionsData] = await Promise.all([
        apiClient.getCustomers(),
        apiClient.getProducts(),
        apiClient.getPromotions(),
      ]);

      setCustomers(customersData);
      setProducts(productsData);
      setPromotions(promotionsData);
    } catch (err) {
      notificationService.error('Load Error', 'Failed to load data');
      console.error('Failed to load data:', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="status-bar">
        <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2>Customers ({Object.keys(customers).length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="data-list">
              {Object.values(customers).map((customer) => (
                <div key={customer.id} className="data-item">
                  <strong>{customer.name}</strong>
                  <p>{customer.email}</p>
                  <span className={`status ${customer.status}`}>{customer.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Products ({products.length})</h2>
          <div className="data-list">
            {products.map((product) => (
              <div key={product.id} className="data-item">
                <strong>{product.name}</strong>
                <p>${product.price}</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Promotions ({promotions.length})</h2>
          <div className="data-list">
            {promotions.map((promo) => (
              <div key={promo.id} className="data-item">
                <strong>{promo.title}</strong>
                <p>{promo.description}</p>
                <p>{promo.discount}% off</p>
                <span className={`status ${promo.active ? 'active' : 'inactive'}`}>
                  {promo.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard {
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .status-bar {
          padding: 10px;
          margin-bottom: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .status {
          font-weight: 600;
          font-size: 14px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }
        .dashboard-section {
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
        }
        .data-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .data-item {
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          background: #fafafa;
        }
        .error-banner {
          padding: 12px;
          margin-bottom: 20px;
          background: #fee;
          color: #c00;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
import MessagesPage from './MessagesPage';

function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <MessagesPage />
      {/* Add BookingsPage, RequestsPage, EmailsPage here */}
    </div>
  );
}

import BookingsPage from './BookingsPage';
import MessagesPage from './MessagesPage';
import RequestsPage from './RequestsPage';
import EmailsPage from './EmailsPage';

function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <BookingsPage />
      <MessagesPage />
      <RequestsPage />
      <EmailsPage />
    </div>
  );
}

export default Dashboard;
export default Dashboard;

