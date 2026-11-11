import api from './api';

export interface CashSession {
  id?: number;
  user_id?: number;
  user_name?: string;
  opening_balance?: number;
  closing_balance?: number;
  expected_closing?: number;
  variance?: number;
  session_start?: string;
  session_end?: string;
  notes?: string;
}

export const cashSessionService = {
  openSession: async (openingBalance: number, notes?: string) => {
    const response = await api.post('/cash-sessions/open', {
      opening_balance: openingBalance,
      notes,
    });
    return response.data;
  },

  closeSession: async (id: number, closingBalance: number, notes?: string) => {
    const response = await api.post(`/cash-sessions/${id}/close`, {
      closing_balance: closingBalance,
      notes,
    });
    return response.data;
  },

  getActiveSession: async () => {
    const response = await api.get('/cash-sessions/active');
    return response.data;
  },

  getAll: async (filters?: any) => {
    const response = await api.get('/cash-sessions', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/cash-sessions/${id}`);
    return response.data;
  },
};
