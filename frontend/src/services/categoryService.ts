import api from './api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (category: Partial<Category>) => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  update: async (id: number, category: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
