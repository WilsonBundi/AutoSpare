import api from './api';

export interface Purchase {
  id?: number;
  supplier_id?: number;
  supplier_name?: string;
  purchase_date: string;
  invoice_number?: string;
  total_amount: number;
  paid_amount?: number;
  payment_method?: string;
  notes?: string;
  user_id?: number;
  user_name?: string;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  product_name?: string;
  code?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const purchaseService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/purchases', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  create: async (purchase: Partial<Purchase>, items: PurchaseItem[]) => {
    const response = await api.post('/purchases', { ...purchase, items });
    return response.data;
  },

  update: async (id: number, purchase: Partial<Purchase>) => {
    const response = await api.put(`/purchases/${id}`, purchase);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  },
};
