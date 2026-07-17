import api from '../api';

const reviewService = {
  createReview: async (listingId, reviewData) => {
    return api.post(`/listings/${listingId}/reviews`, reviewData);
  },

  deleteReview: async (listingId, reviewId) => {
    return api.delete(`/listings/${listingId}/reviews/${reviewId}`);
  }
};

export default reviewService;
