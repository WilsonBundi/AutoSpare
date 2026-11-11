import api from './api';

export interface SupplierPricing {
  id?: number;
  supplier_id: number;
  product_id: number;
  buying_price: number;
  last_updated?: string;
  product_name?: string;
  product_code?: string;
  supplier_name?: string;
}

export const supplierPricingService = {
  getBySupplier: async (supplierId: number) => {
    const response = await api.get(`/supplier-pricing/supplier/${supplierId}`);
    return response.data;
  },

  getByProduct: async (productId: number) => {
    const response = await api.get(`/supplier-pricing/product/${productId}`);
    return response.data;
  },

  create: async (data: Omit<SupplierPricing, 'id' | 'last_updated'>) => {
    const response = await api.post('/supplier-pricing', data);
    return response.data;
  },

  delete: async (supplierId: number, productId: number) => {
    const response = await api.delete(`/supplier-pricing/${supplierId}/${productId}`);
    return response.data;
  },
};
