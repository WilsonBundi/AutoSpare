import api from './api';

export interface Product {
  id: number;
  name: string;
  code?: string;
  barcode?: string;
  category_id?: number;
  category_name?: string;
  buying_price: number;
  selling_price: number;
  wholesale_price?: number;
  unit: string;
  current_stock: number;
  reorder_level: number;
  location?: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export const productService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Partial<Product>) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getLowStock: async (threshold?: number) => {
    const response = await api.get('/products/low-stock', { params: { threshold } });
    return response.data;
  },
};
