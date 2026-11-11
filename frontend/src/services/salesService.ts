import api from './api';

export interface Sale {
  id: number;
  sale_number: string;
  sale_date: string;
  customer_id?: number;
  customer_name?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string;
  payment_status: string;
  notes?: string;
  user_id: number;
  cashier_name?: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name?: string;
  code?: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
}

export const salesService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/sales', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  create: async (sale: Partial<Sale>, items: SaleItem[]) => {
    const response = await api.post('/sales', { ...sale, items });
    return response.data;
  },

  voidSale: async (id: number, reason: string) => {
    const response = await api.post(`/sales/${id}/void`, { reason });
    return response.data;
  },
};
