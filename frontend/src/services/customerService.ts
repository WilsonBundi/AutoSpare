import api from './api';

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customer_type: string;
  credit_limit: number;
  current_balance: number;
  is_active: boolean;
}

export const customerService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/customers', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: Partial<Customer>) => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  update: async (id: number, customer: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  getDebtors: async () => {
    const response = await api.get('/customers/debtors');
    return response.data;
  },
};
