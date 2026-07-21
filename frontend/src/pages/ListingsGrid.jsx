import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import listingService from "../services/listingService";
import {
  Compass,
  Bed,
  Building,
  Waves,
  Tent,
  Sprout,
  ShieldAlert,
  Mountain,
  Castle,
  Snowflake,
  Palmtree,
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "all", label: "All", icon: Compass },
  { id: "ROOMS", label: "Rooms", icon: Bed },
  { id: "ICONIC_CITIES", label: "Iconic Cities", icon: Building },
  { id: "MOUNTAINS", label: "Mountains", icon: Mountain },
  { id: "CASTLES", label: "Castles", icon: Castle },
  { id: "POOLS", label: "Amazing Pools", icon: Waves },
  { id: "CAMPING", label: "Camping", icon: Tent },
  { id: "FARMS", label: "Farms", icon: Sprout },
  { id: "ARCTIC", label: "Arctic", icon: Snowflake },
  { id: "BEACHES", label: "Beaches", icon: Palmtree },
];

const ListingsGrid = ({ searchKeyword }) => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingService.getListings();
        if (response.data) {
          setListings(response.data);
          setFilteredListings(response.data);
        } else {
          toast.error("Failed to load listings.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not connect to the API server.");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Filter listings based on Category & Search
  useEffect(() => {
    let result = listings;

    // Category filter logic (direct database category match)
    if (selectedCategory !== "all") {
      result = listings.filter((l) => l.category === selectedCategory);
    }

    // Search input keyword filter
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(keyword) ||
          l.location.toLowerCase().includes(keyword) ||
          l.country.toLowerCase().includes(keyword),
      );
    }

    setFilteredListings(result);
  }, [selectedCategory, searchKeyword, listings]);

  if (loading) {
    return (
      <div
        className="container section-padding"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            border: "4px solid rgba(254, 66, 77, 0.1)",
            borderLeft: "4px solid var(--color-primary)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      {/* Category Tabs list */}
      <div className="filter-tabs">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-tab ${selectedCategory === cat.id ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="listings-grid">
          {filteredListings.map((listing) => {
            const reviewsCount = listing.reviews?.length || 0;
            const avgRating =
              reviewsCount > 0
                ? (
                    listing.reviews.reduce(
                      (acc, rev) => acc + (rev.rating || 0),
                      0,
                    ) / reviewsCount
                  ).toFixed(1)
                : "New";

            return (
              <div
                key={listing.id}
                className="listing-card animate-fade-in"
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <div className="listing-img-container">
                  <img
                    src={listing.image?.url || listing.image}
                    alt={listing.title}
                    className="listing-img"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000";
                    }}
                  />
                </div>

                <div className="listing-info">
                  <div className="listing-title-row">
                    <span className="listing-title">{listing.title}</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: "#ffb000" }}>★</span>
                      <span>{avgRating}</span>
                    </div>
                  </div>
                  <div
                    className="listing-price-row"
                    style={{ marginTop: "8px" }}
                  >
                    <span className="listing-price">
                      ₹{listing.price?.toLocaleString("en-IN")}
                    </span>{" "}
                    <span>/ night</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border-color)",
            maxWidth: "500px",
            margin: "40px auto",
          }}
        >
          <ShieldAlert
            size={48}
            style={{ color: "var(--color-primary)", marginBottom: "16px" }}
          />
          <h3
            style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "8px" }}
          >
            No Listings Found
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            We couldn't find any places matching your criteria. Try adjusting
            your filters or search keywords!
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;
