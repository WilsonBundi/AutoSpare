import api from './api';

export interface Expense {
  id?: number;
  expense_date: string;
  category: string;
  description?: string;
  amount: number;
  payment_method?: string;
  notes?: string;
  user_id?: number;
  user_name?: string;
}

export const expenseService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/expenses', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (expense: Partial<Expense>) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  update: async (id: number, expense: Partial<Expense>) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getSummary: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/expenses/summary', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },
};
