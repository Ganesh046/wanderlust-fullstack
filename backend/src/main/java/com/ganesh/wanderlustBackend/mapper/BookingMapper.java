package com.ganesh.wanderlustBackend.mapper;

import com.ganesh.wanderlustBackend.dto.request.CreateBookingRequest;
import com.ganesh.wanderlustBackend.dto.response.*;
import com.ganesh.wanderlustBackend.model.Booking;
import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.model.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public Booking toEntity(CreateBookingRequest request){
        Booking booking = new Booking();

        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());

        return booking;
    }

    public BookingResponse toResponse(Booking booking){
        BookingResponse response = new BookingResponse();

        response.setId(booking.getId());
        response.setListingId(booking.getListing().getId());
        response.setGuestId(booking.getGuest().getId());
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setTotalPrice(booking.getTotalPrice());

        return response;
    }

    public BookingDatesResponse toBookingDatesResponse(Booking booking){
        BookingDatesResponse bookingDatesResponse = new BookingDatesResponse();

        bookingDatesResponse.setId(booking.getId());
        bookingDatesResponse.setCheckIn(booking.getCheckIn());
        bookingDatesResponse.setCheckOut(booking.getCheckOut());

        return bookingDatesResponse;
    }


    public MyTripResponse toMyTripsResponse(Booking booking){
        MyTripResponse response = new MyTripResponse();
        Listing listing = booking.getListing();

        response.setBookingId(booking.getId());
        response.setListingId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setImage(new ImageResponse(listing.getImage().getUrl()));
        response.setLocation(listing.getLocation());
        response.setCountry(listing.getCountry());
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setTotalPrice(booking.getTotalPrice());

        return response;
    }


    public IncomingBookingResponse toIncomingBookingResponse(Booking booking){
        Listing listing = booking.getListing();
        User guest = booking.getGuest();

        IncomingBookingResponse response = new IncomingBookingResponse();

        response.setBookingId(booking.getId());
        response.setListingId(listing.getId());

        response.setPropertyTitle(listing.getTitle());
        response.setLocation(listing.getLocation());

        response.setGuestUsername(guest.getUsername());
        response.setGuestEmail(guest.getEmail());

        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setTotalPrice(booking.getTotalPrice());

        return response;
    }
}
