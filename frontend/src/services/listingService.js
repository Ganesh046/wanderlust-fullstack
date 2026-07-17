import api from '../api';

const listingService = {
  getListings: async () => {
    return api.get('/listings');
  },

  getListingDetails: async (id) => {
    return api.get(`/listings/${id}`);
  },

  createListing: async (data, options = {}) => {
    return api.post('/listings', data, options);
  },

  updateListing: async (id, data, options = {}) => {
    return api.put(`/listings/${id}`, data, options);
  },

  deleteListing: async (id) => {
    return api.delete(`/listings/${id}`);
  },

  getOwnedListings: async () => {
    return api.get('/listings/my-listings');
  }
};

export default listingService;
