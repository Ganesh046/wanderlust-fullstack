import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import { Compass, Eye, Calendar, Compass as ExploreIcon, Loader2, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTrips = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyTrips();
      if (response.data) {
        setTrips(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not fetch travel trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully.');
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.bookingId !== bookingId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('You must log in to view your trips.');
      navigate('/login');
      return;
    }

    if (user) {
      fetchTrips();
    }
  }, [user, authLoading]);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="container section-padding" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading travel plans...</span>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ maxWidth: '1200px' }}>
      
      {/* Header */}
      <div className="dashboard-header animate-fade-in" style={{
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(254, 66, 77, 0.04) 0%, rgba(254, 66, 77, 0) 100%)',
        padding: '30px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color-dark)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)' }}>Your Travel Plans</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>My Trips</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>Keep track of your upcoming and past stay bookings.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : trips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {trips.map((trip) => {
            if (!trip || !trip.title) return null;
            const listingImage = trip.image?.url || trip.image;
            
            return (
              <div key={trip.bookingId} className="listing-card animate-fade-in" style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'default',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div className="listing-img-container" style={{ height: '200px' }}>
                  <img
                    src={listingImage}
                    alt={trip.title}
                    className="listing-img"
                    style={{ height: '100%' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000';
                    }}
                  />
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{trip.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                    <Compass size={14} />
                    <span>{trip.location}, {trip.country}</span>
                  </p>

                  <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Check-in:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatDate(trip.checkIn)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Checkout:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatDate(trip.checkOut)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Paid Amount</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{trip.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/listings/${trip.listingId}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}>
                        <Eye size={12} />
                        <span>View Details</span>
                      </Link>
                      <button
                        onClick={() => handleCancelBooking(trip.bookingId)}
                        disabled={cancellingId === trip.bookingId}
                        className="btn-outline"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          borderRadius: 'var(--radius-pill)',
                          borderColor: '#ff385c',
                          color: '#ff385c',
                          background: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {cancellingId === trip.bookingId ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-color)',
          maxWidth: '500px',
          margin: '20px auto'
        }}>
          <ExploreIcon size={48} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>No Trips Booked Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Explore beautiful stays, cabins, and lofts to start planning your next escape.
          </p>
          <Link to="/listings" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: 'var(--radius-pill)' }}>
            Explore Stays
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
