import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, Plus, MessageSquareDot, X } from "lucide-react";
import toast from "react-hot-toast";
import reviewService from "../services/reviewService";

const ReviewSection = ({ listingId, reviews = [], user, onReviewChanged }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment for your review.");
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await reviewService.createReview(listingId, {
        rating, comment
      });
      if (response.data) {
        toast.success("Thank you for your feedback!");
        setShowReviewModal(false);
        setComment("");
        setRating(5);
        if (onReviewChanged) onReviewChanged();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Delete this review?")) {
      try {
        await reviewService.deleteReview(listingId, reviewId);
        toast.success("Review deleted.");
        if (onReviewChanged) onReviewChanged();
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not delete review.");
      }
    }
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3 className="reviews-title">Guest Reviews</h3>
        {user ? (
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn-outline"
          >
            <Plus size={16} />
            <span>Leave a Review</span>
          </button>
        ) : (
          <span className="reviews-auth-notice">
            <Link
              to="/login"
              style={{ color: "var(--color-primary)", fontWeight: 600 }}
            >
              Login
            </Link>{" "}
            to post reviews.
          </span>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="reviews-grid">
          {reviews.map((rev) => {
            const isAuthor = user && rev.author?.username === user.username;
            return (
              <div key={rev.id} className="review-card">
                <div className="review-author-row">
                  <div className="review-author-avatar">
                    {rev.author?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h5 className="review-author-name">
                      {rev.author?.username || "Explorer"}
                    </h5>
                    <div className="review-rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? "#FFB100" : "none"}
                          stroke={
                            i < rev.rating ? "none" : "var(--text-light)"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="review-comment">{rev.comment}</p>

                {isAuthor && (
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="btn-delete-review hover-danger"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="reviews-empty-state">
          <MessageSquareDot size={32} className="reviews-empty-icon" />
          <p>
            No reviews yet for this stay. Be the first to share your experience!
          </p>
        </div>
      )}

      {/* Leave Review Overlay Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowReviewModal(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <h3 className="modal-header-title">Review Stay</h3>
            <p className="modal-header-subtitle">
              How was your experience exploring this retreat?
            </p>

            <form onSubmit={handlePostReview}>
              <div className="form-group">
                <label className="form-label">Stay Rating</label>
                <div className="star-rating-form">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <React.Fragment key={val}>
                      <input
                        type="radio"
                        id={`star-${val}`}
                        name="rating"
                        value={val}
                        checked={rating === val}
                        onChange={() => setRating(val)}
                      />
                      <label htmlFor={`star-${val}`}>★</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="comment">
                  Your Feedback
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="4"
                  placeholder="Share details about the hospitality, environment, and views..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="btn-secondary"
                  style={{ padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary"
                  style={{ padding: "10px 20px" }}
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
