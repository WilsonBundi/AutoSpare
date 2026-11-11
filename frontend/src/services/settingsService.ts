import api from './api';

export interface Settings {
  id?: number;
  shop_name: string;
  shop_address?: string;
  shop_phone?: string;
  shop_email?: string;
  currency?: string;
  tax_rate?: number;
  receipt_footer?: string;
  logo_url?: string;
  low_stock_alert_threshold?: number;
}

export const settingsService = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  update: async (settings: Partial<Settings>) => {
    const response = await api.put('/settings', settings);
    return response.data;
  },
};
