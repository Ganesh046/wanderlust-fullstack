package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.dto.request.CreateBookingRequest;
import com.ganesh.wanderlustBackend.dto.response.BookingResponse;
import com.ganesh.wanderlustBackend.dto.response.IncomingBookingResponse;
import com.ganesh.wanderlustBackend.dto.response.MyTripResponse;
import com.ganesh.wanderlustBackend.exception.InvalidBookingException;
import com.ganesh.wanderlustBackend.exception.ResourceNotFoundException;
import com.ganesh.wanderlustBackend.exception.UnauthorizedUserException;
import com.ganesh.wanderlustBackend.mapper.BookingMapper;
import com.ganesh.wanderlustBackend.model.Booking;
import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.repository.BookingRepo;
import com.ganesh.wanderlustBackend.repository.ListingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ListingRepo listingRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingMapper mapper;

    private Listing getListingByIdOrThrow(Long listingId){
        return listingRepo.findById(listingId)
                .orElseThrow(() ->new ResourceNotFoundException("Listing not found"));
    }

    private Booking getBookingByIdOrThrow(Long bookingId){
        return bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private void validateBookingAvailability(Listing listing, CreateBookingRequest request){
        for (Booking existingBooking: listing.getBookings()){
            boolean noOverlap =
                    ! request.getCheckOut().isAfter(existingBooking.getCheckIn())
                 || ! request.getCheckIn().isBefore(existingBooking.getCheckOut());

            if (!noOverlap){
                throw new InvalidBookingException("Already booked for the selected dates.");
            }
        }
    }


    public BookingResponse createBooking(CreateBookingRequest request){

        // checking the date validation
        if(!request.getCheckOut().isAfter(request.getCheckIn())){
            throw new InvalidBookingException("Check-out date must be after check-in date.");
        }

        //loading listing and current user (authenticated)
        Listing listing = getListingByIdOrThrow(request.getListingId());
        User currUser = userService.getCurrentUser();

        //checking booking overlapping
        validateBookingAvailability(listing, request);

        Booking booking = mapper.toEntity(request);
        booking.setListing(listing);
        booking.setGuest(currUser);

        // calculate total nights and total price(baseprice + service fee + gst)
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double basePrice = listing.getPrice() * nights;
        double serviceFee = Math.round(basePrice *0.10 );
        double gstTax = Math.round(basePrice * 0.18 );
        double totalPrice = basePrice + serviceFee + gstTax;

        // set total price to the booking
        booking.setTotalPrice(totalPrice);

        listing.getBookings().add(booking);     // to maintain bidirectional consistency

        Booking savedBooking = bookingRepo.save(booking);   // save to db

        return  mapper.toResponse(savedBooking);
    }


    public void deleteBooking(Long bookingId){
        Booking booking = getBookingByIdOrThrow(bookingId);

        User currUser = userService.getCurrentUser();

        if(!booking.getGuest().getId().equals(currUser.getId())){
            throw new UnauthorizedUserException("Only the guest who made the booking can cancel it.");
        }

        booking.getListing().getBookings().remove(booking);     // to maintain bidirectional consistency

        bookingRepo.delete(booking);    // remove from the db
    }


    public List<MyTripResponse> getMyTrips(){
        User currUser = userService.getCurrentUser();

         List<Booking> bookings = bookingRepo.findByGuestOrderByCheckInDesc(currUser);

         return bookings.stream().map(mapper::toMyTripsResponse).toList();
    }


    public List<IncomingBookingResponse> getIncomingBookings(){
        User owner = userService.getCurrentUser();


        return bookingRepo.findByListingOwnerOrderByCheckInDesc(owner)
                .stream()
                .map(mapper::toIncomingBookingResponse)
                .toList();
    }
}
