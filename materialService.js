import api from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const materialService = {
  getMaterials: async (params = {}) => {
    const response = await api.get('/materials', { params });
    return response.data;
  },

  createMaterial: async (formData) => {
    const response = await api.post('/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteMaterial: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },

  downloadMaterialUrl: (id) => {
    return `${API_BASE}/materials/${id}/download`;
  },
};
