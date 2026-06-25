// Shared State Management with Zustand

import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  active: boolean;
  expiresAt: string;
}

interface SharedState {
  customers: Record<string, Customer>;
  products: Product[];
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  lastSyncTime: number | null;

  // Actions
  setCustomers: (customers: Customer[]) => void;
  updateCustomer: (customerId: string, data: Partial<Customer>) => void;
  setProducts: (products: Product[]) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  setPromotions: (promotions: Promotion[]) => void;
  updatePromotion: (promoId: string, data: Partial<Promotion>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  sync: (data: Partial<SharedState>) => void;
}

export const useSharedStore = create<SharedState>((set) => ({
  customers: {},
  products: [],
  promotions: [],
  loading: false,
  error: null,
  lastSyncTime: null,

  setCustomers: (customers) =>
    set({
      customers: customers.reduce(
        (acc, customer) => ({ ...acc, [customer.id]: customer }),
        {}
      ),
      lastSyncTime: Date.now(),
    }),

  updateCustomer: (customerId, data) =>
    set((state) => ({
      customers: {
        ...state.customers,
        [customerId]: { ...state.customers[customerId], ...data },
      },
    })),

  setProducts: (products) =>
    set({
      products,
      lastSyncTime: Date.now(),
    }),

  updateProduct: (productId, data) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, ...data } : p
      ),
    })),

  setPromotions: (promotions) =>
    set({
      promotions,
      lastSyncTime: Date.now(),
    }),

  updatePromotion: (promoId, data) =>
    set((state) => ({
      promotions: state.promotions.map((p) =>
        p.id === promoId ? { ...p, ...data } : p
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  sync: (data) => set(data),
}));
