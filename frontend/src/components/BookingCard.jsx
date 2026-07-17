import React, { useState } from "react";
import toast from "react-hot-toast";
import bookingService from "../services/bookingService";

const BookingCard = ({ listingId, price, user, navigate, bookings = [] }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Helper to check if dates overlap with existing bookings
  const checkOverlap = (inStr, outStr) => {
    if (!inStr || !outStr || !bookings || bookings.length === 0) return false;
    const newIn = new Date(inStr);
    const newOut = new Date(outStr);
    if (isNaN(newIn.getTime()) || isNaN(newOut.getTime())) return false;

    return bookings.some((b) => {
      const bIn = new Date(b.checkIn);
      const bOut = new Date(b.checkOut);
      // Standard overlap check: A < D and B > C
      return newIn < bOut && newOut > bIn;
    });
  };

  const datesOverlap = checkOverlap(checkIn, checkOut);

  const getBookingDetails = () => {
    if (!checkIn || !checkOut || datesOverlap) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (
      isNaN(inDate.getTime()) ||
      isNaN(outDate.getTime()) ||
      outDate <= inDate
    )
      return null;

    const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const basePrice = (price || 0) * nights;
    const serviceFee = Math.round(basePrice * 0.1);
    const tax = Math.round(basePrice * 0.18);
    const total = basePrice + serviceFee + tax;

    return { nights, basePrice, serviceFee, tax, total };
  };

  const bookingDetails = getBookingDetails();

  const handleReserve = async () => {
    if (!user) {
      toast.error("You must be logged in to reserve this stay!");
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select valid check-in and check-out dates.");
      return;
    }

    if (datesOverlap) {
      toast.error("The selected dates overlap with an existing booking!");
      return;
    }

    const details = getBookingDetails();
    if (!details) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    setSubmittingBooking(true);
    try {
      const response = await bookingService.createBooking({
        listingId,
        checkIn,
        checkOut,
      });

      if (response.data) {
        toast.success("Your stay reservation is confirmed!");
        navigate("/trips");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete booking.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-price-row">
        <span className="booking-price">
          ₹{price?.toLocaleString("en-IN")}
        </span>
        <span className="booking-per-night">/ night</span>
      </div>

      <div className="booking-date-inputs-container">
        <div className="booking-dates-flex">
          <div className="booking-checkin-wrapper">
            <label className="booking-label">CHECK-IN</label>
            <input
              type="date"
              className="booking-date-input"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (
                  checkOut &&
                  new Date(e.target.value) >= new Date(checkOut)
                ) {
                  setCheckOut("");
                }
              }}
            />
          </div>
          <div className="booking-checkout-wrapper">
            <label className="booking-label">CHECKOUT</label>
            <input
              type="date"
              className="booking-date-input"
              value={checkOut}
              min={
                checkIn
                  ? new Date(
                      new Date(checkIn).getTime() + 24 * 60 * 60 * 1000,
                    )
                      .toISOString()
                      .split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
      </div>

      {datesOverlap && (
        <div
          style={{
            color: "var(--color-primary)",
            fontWeight: 600,
            fontSize: "0.85rem",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          ⚠️ These dates overlap with an existing booking. Please choose other dates.
        </div>
      )}

      {/* Price Calculations */}
      {bookingDetails && (
        <div className="booking-calc-container">
          <div className="booking-calc-row">
            <span>
              ₹{price?.toLocaleString("en-IN")} x {bookingDetails.nights} nights
            </span>
            <span>₹{bookingDetails.basePrice?.toLocaleString("en-IN")}</span>
          </div>
          <div className="booking-calc-row">
            <span>Service Fee (10%)</span>
            <span>₹{bookingDetails.serviceFee?.toLocaleString("en-IN")}</span>
          </div>
          <div className="booking-calc-row">
            <span>GST Tax (18%)</span>
            <span>₹{bookingDetails.tax?.toLocaleString("en-IN")}</span>
          </div>
          <hr className="booking-calc-divider" />
          <div className="booking-calc-row total-row">
            <span>Total</span>
            <span>₹{bookingDetails.total?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={submittingBooking || !bookingDetails || datesOverlap}
        className="btn-primary btn-reserve"
        style={{
          opacity: !bookingDetails || submittingBooking || datesOverlap ? 0.7 : 1,
          cursor:
            !bookingDetails || submittingBooking || datesOverlap
              ? "not-allowed"
              : "pointer",
        }}
      >
        {submittingBooking
          ? "Confirming Reservation..."
          : datesOverlap
            ? "Dates Unavailable"
            : bookingDetails
              ? "Reserve Stay"
              : "Select Check-in & Checkout"}
      </button>

      <p className="booking-notice">
        {user
          ? "You won't be charged yet. This completes reservation."
          : "You must log in to make a reservation."}
      </p>
    </div>
  );
};

export default BookingCard;
