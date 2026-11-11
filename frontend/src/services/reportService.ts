import api from './api';

export const reportService = {
  getDailySales: async (date?: string) => {
    const response = await api.get('/reports/daily-sales', { params: { date } });
    return response.data;
  },

  getSalesByCategory: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/reports/sales-by-category', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getTopSellingProducts: async (startDate?: string, endDate?: string, limit?: number) => {
    const response = await api.get('/reports/top-products', {
      params: { start_date: startDate, end_date: endDate, limit }
    });
    return response.data;
  },

  getProfitReport: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/reports/profit', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getStockValuation: async () => {
    const response = await api.get('/reports/stock-valuation');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
};
