import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/admin/recent-activity');
    return response.data;
  },

  getStudents: async (params = {}) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },
};
