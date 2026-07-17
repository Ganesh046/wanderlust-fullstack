import api from '../api';

const bookingService = {
  createBooking: async (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  getMyTrips: async () => {
    return api.get('/bookings/my-trips');
  },

  getHostIncoming: async () => {
    return api.get('/bookings/host/incoming');
  },

  cancelBooking: async (bookingId) => {
    return api.delete(`/bookings/${bookingId}`);
  }
};

export default bookingService;
