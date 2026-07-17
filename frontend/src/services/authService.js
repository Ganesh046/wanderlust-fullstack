import api from '../api';

const authService = {
  login: async (username, password) => {
    return api.post('/login', { username, password });
  },

  signup: async (username, email, password) => {
    return api.post('/register', { username, email, password });
  },

  logout: async () => {
    try {
      return await api.post('/logout');
    } catch (err) {
      // Gracefully fall back since JWT logout is handled on client-side
      return { data: { success: true } };
    }
  }
};

export default authService;
