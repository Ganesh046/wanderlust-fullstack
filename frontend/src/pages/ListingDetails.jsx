import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import listingService from "../services/listingService";
import { AuthContext } from "../context/AuthContext";
import { Star, MapPin, Edit3, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Subcomponents
import BookingCard from "../components/BookingCard";
import ListingMap from "../components/ListingMap";
import ReviewSection from "../components/ReviewSection";

// Stylesheet
import "./ListingDetails.css";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);

  const fetchListingDetails = async () => {
    try {
      const response = await listingService.getListingDetails(id);
      if (response.data) {
        const listingData = response.data;
        setListing(listingData);

        // Load coordinates directly from the database geometry field
        const geom = listingData.geometry;
        if (geom) {
          if (geom.coordinates && Array.isArray(geom.coordinates)) {
            setCoordinates(geom.coordinates);
          } else if (geom.latitude !== undefined && geom.longitude !== undefined) {
            setCoordinates([geom.longitude, geom.latitude]); // [lon, lat]
          }
        }
      } else {
        toast.error("Listing details not found.");
        navigate("/listings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching listing details.");
      navigate("/listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const handleDeleteListing = async () => {
    if (
      window.confirm(
        "Are you absolutely sure you want to delete this beautiful place? This action cannot be undone.",
      )
    ) {
      try {
        await listingService.deleteListing(id);
        toast.success("Listing deleted successfully!");
        navigate("/listings");
      } catch (err) {
        toast.error(err.response?.data?.message || "Authorization error.");
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-loader-container">
        <div className="detail-loader-spinner"></div>
      </div>
    );
  }

  const isOwner = user && listing?.owner?.username === user.username;

  // Calculate average rating
  const reviewCount = listing?.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? (
          listing.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          reviewCount
        ).toFixed(1)
      : "New";

  return (
    <div className="detail-container section-padding">
      {/* Header */}
      <div className="detail-header">
        <h1 className="detail-title">{listing.title}</h1>

        <div className="detail-meta">
          <div className="detail-rating">
            <Star size={16} fill="#FFB100" stroke="none" />
            <span>
              {avgRating} ({reviewCount} reviews)
            </span>
          </div>
          <span>&middot;</span>
          <div className="detail-location">
            <MapPin size={16} />
            <span>
              {listing.location}, {listing.country}
            </span>
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="detail-img-gallery">
        <img
          src={listing.image?.url || listing.image}
          alt={listing.title}
          className="show-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000";
          }}
        />
      </div>

      {/* Details Grid */}
      <div className="detail-grid">
        {/* Info Left */}
        <div>
          <div className="host-section">
            <div className="host-avatar">
              {listing.owner?.username?.charAt(0).toUpperCase() || "O"}
            </div>
            <div>
              <p className="host-label">Hosted by</p>
              <h4 className="host-name">
                {listing.owner?.username || "Owner"}
              </h4>
            </div>
          </div>

          <div className="about-section">
            <h3 className="about-title">About this place</h3>
            <p className="about-desc">{listing.description}</p>
          </div>

          {/* Action buttons for owner */}
          {isOwner && (
            <div className="owner-actions">
              <Link
                to={`/listings/${id}/edit`}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                <Edit3 size={18} />
                <span>Edit Details</span>
              </Link>
              <button
                onClick={handleDeleteListing}
                className="btn-primary btn-delete-listing"
              >
                <Trash2 size={18} />
                <span>Delete Listing</span>
              </button>
            </div>
          )}

          {/* Guest Reviews */}
          <ReviewSection
            listingId={id}
            reviews={listing.reviews}
            user={user}
            onReviewChanged={fetchListingDetails}
          />
        </div>

        {/* Booking Card Right */}
        <div>
          <BookingCard
            listingId={id}
            price={listing.price}
            user={user}
            navigate={navigate}
            bookings={listing.bookings}
          />
        </div>
      </div>

      {/* Map Section */}
      <ListingMap
        coordinates={coordinates}
        title={listing.title}
        location={listing.location}
        country={listing.country}
      />
    </div>
  );
};

export default ListingDetails;
