import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import listingService from "../services/listingService";
import bookingService from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import {
  Compass,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ClipboardList,
  Bed,
  Loader2,
  Sparkles,
  Mail,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("listings"); // 'listings' or 'bookings'

  // Host state
  const [ownedListings, setOwnedListings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loadingHost, setLoadingHost] = useState(true);

  const fetchHostData = async () => {
    setLoadingHost(true);
    try {
      const [listingsRes, bookingsRes] = await Promise.all([
        listingService.getOwnedListings(),
        bookingService.getHostIncoming(),
      ]);

      if (listingsRes.data) {
        setOwnedListings(listingsRes.data);
      }
      if (bookingsRes.data) {
        setIncomingBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch hosting dashboard data.");
    } finally {
      setLoadingHost(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("You must log in to view the host dashboard.");
      navigate("/login");
      return;
    }

    if (user) {
      fetchHostData();
    }
  }, [user, authLoading]);

  const handleDeleteListing = async (listingId) => {
    if (
      window.confirm(
        "Are you absolutely sure you want to delete this place? This will also remove associated guest reviews.",
      )
    ) {
      try {
        await listingService.deleteListing(listingId);
        toast.success("Property deleted successfully.");
        fetchHostData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete listing.");
      }
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (authLoading || (!user && loadingHost)) {
    return (
      <div
        className="container section-padding"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Loader2
          size={40}
          className="animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
        <span
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          Loading host control center...
        </span>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ maxWidth: "1200px" }}>
      {/* Dashboard Welcome Header */}
      <div
        className="dashboard-header animate-fade-in"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "32px",
          background:
            "linear-gradient(135deg, rgba(254, 66, 77, 0.04) 0%, rgba(254, 66, 77, 0) 100%)",
          padding: "30px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color-dark)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <Sparkles size={18} style={{ color: "var(--color-primary)" }} />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "var(--color-primary)",
              }}
            >
              Wanderlust Host Control
            </span>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            Host Dashboard
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              marginTop: "4px",
            }}
          >
            Welcome, {user?.username}. Manage your listed stays and monitor
            guest bookings here.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            to="/listings/new"
            className="btn-primary"
            style={{ padding: "12px 24px", borderRadius: "var(--radius-pill)" }}
          >
            <Plus size={16} />
            <span>Wanderlust Your Home</span>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          marginBottom: "32px",
          gap: "24px",
        }}
      >
        <button
          onClick={() => setActiveTab("listings")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 4px 16px 4px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            color:
              activeTab === "listings"
                ? "var(--color-primary)"
                : "var(--text-muted)",
            borderBottom:
              activeTab === "listings"
                ? "3px solid var(--color-primary)"
                : "3px solid transparent",
            transition: "var(--transition-smooth)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ClipboardList size={18} />
          <span>My Listings ({ownedListings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 4px 16px 4px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            color:
              activeTab === "bookings"
                ? "var(--color-primary)"
                : "var(--text-muted)",
            borderBottom:
              activeTab === "bookings"
                ? "3px solid var(--color-primary)"
                : "3px solid transparent",
            transition: "var(--transition-smooth)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Calendar size={18} />
          <span>Guest Bookings ({incomingBookings.length})</span>
        </button>
      </div>

      {/* Tab A Content: My Listings */}
      {activeTab === "listings" && (
        <div className="animate-fade-in">
          {loadingHost ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                  }}
                >
                  Your Active Listings
                </h2>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {ownedListings.length} Properties
                </span>
              </div>

              {ownedListings.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {ownedListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="listing-card"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        cursor: "default",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div
                        className="listing-img-container"
                        style={{ height: "170px" }}
                      >
                        <img
                          src={listing.image?.url || listing.image}
                          alt={listing.title}
                          className="listing-img"
                          style={{ height: "100%" }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000";
                          }}
                        />
                      </div>
                      <div style={{ padding: "16px" }}>
                        <h4
                          style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            color: "var(--text-main)",
                            marginBottom: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {listing.title}
                        </h4>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            marginBottom: "12px",
                          }}
                        >
                          <Compass size={12} />
                          <span>
                            {listing.location}, {listing.country}
                          </span>
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 800,
                              color: "var(--text-main)",
                            }}
                          >
                            ₹{listing.price?.toLocaleString("en-IN")}
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                color: "var(--text-muted)",
                              }}
                            >
                              /night
                            </span>
                          </span>
                          <span
                            style={{
                              background: "var(--color-primary-light)",
                              color: "var(--color-primary)",
                              fontSize: "0.75rem",
                              padding: "3px 8px",
                              borderRadius: "var(--radius-pill)",
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {listing.category?.toLowerCase().replace("_", " ")}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link
                            to={`/listings/${listing.id}`}
                            className="btn-secondary"
                            style={{
                              flex: 1,
                              padding: "8px",
                              fontSize: "0.75rem",
                              justifyContent: "center",
                            }}
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </Link>
                          <Link
                            to={`/listings/${listing.id}/edit`}
                            className="btn-secondary"
                            style={{
                              flex: 1,
                              padding: "8px",
                              fontSize: "0.75rem",
                              justifyContent: "center",
                            }}
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="btn-outline"
                            style={{
                              padding: "8px 12px",
                              borderColor: "#ff4136",
                              color: "#ff4136",
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px dashed var(--border-color)",
                    maxWidth: "500px",
                    margin: "10px auto",
                  }}
                >
                  <Bed
                    size={36}
                    style={{ color: "var(--text-light)", marginBottom: "12px" }}
                  />
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    No Listings Active
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      marginBottom: "20px",
                    }}
                  >
                    Share your properties or spare rooms with explorers
                    worldwide.
                  </p>
                  <Link
                    to="/listings/new"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      padding: "10px 20px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Add Your Property
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab B Content: Guest Bookings */}
      {activeTab === "bookings" && (
        <div className="animate-fade-in">
          {loadingHost ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
          ) : (
            <div>
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginBottom: "20px",
                }}
              >
                Incoming Guest Bookings
              </h2>

              {incomingBookings.length > 0 ? (
                <div
                  style={{
                    overflowX: "auto",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                      fontSize: "0.9rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "var(--bg-secondary)",
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                          Property / Stay
                        </th>
                        <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                          Guest details
                        </th>
                        <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                          Check-in & Out
                        </th>
                        <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                          Gross Payout
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomingBookings.map((bk) => {
                        const listingId = bk.listing?.id || bk.listingId;
                        const propertyTitle =
                          bk.listing?.title ||
                          bk.propertyTitle ||
                          "Unknown Property";
                        const location =
                          bk.listing?.location || bk.location || "";
                        const guestName =
                          bk.guest?.username || bk.guestUsername || "Anonymous";
                        const guestEmail =
                          bk.guest?.email || bk.guestEmail || "N/A";
                        const bkId = bk.id || bk.bookingId;

                        return (
                          <tr
                            key={bkId}
                            style={{
                              borderBottom: "1px solid var(--border-color)",
                              background: "#FFFFFF",
                            }}
                          >
                            <td style={{ padding: "14px 16px" }}>
                              <Link
                                to={`/listings/${listingId}`}
                                style={{
                                  fontWeight: 700,
                                  color: "var(--text-main)",
                                  textDecoration: "none",
                                }}
                                className="nav-hover"
                              >
                                {propertyTitle}
                              </Link>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-muted)",
                                  display: "block",
                                }}
                              >
                                {location}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "var(--text-main)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <User
                                    size={12}
                                    style={{ color: "var(--color-primary)" }}
                                  />
                                  {guestName}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--text-muted)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <Mail size={12} />
                                  {guestEmail}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ fontWeight: 600 }}>
                                {formatDate(bk.checkIn)}
                              </span>
                              <span
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {" "}
                                to{" "}
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {formatDate(bk.checkOut)}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "14px 16px",
                                fontWeight: 800,
                                color: "var(--color-primary)",
                              }}
                            >
                              ₹{bk.totalPrice?.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px dashed var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Sparkles
                    size={32}
                    style={{ marginBottom: "8px", color: "var(--text-light)" }}
                  />
                  <p>
                    No bookings received yet. Once guests reserve your
                    properties, details will display here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
