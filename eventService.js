import api from './api';

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (formData) => {
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEvent: async (id, formData) => {
    const response = await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  cancelRegistration: async (id) => {
    const response = await api.post(`/events/${id}/cancel`);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/events/my-registrations');
    return response.data;
  },

  getEventAttendees: async (id) => {
    const response = await api.get(`/events/${id}/attendees`);
    return response.data;
  },
};
