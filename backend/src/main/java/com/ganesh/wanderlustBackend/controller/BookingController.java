package com.ganesh.wanderlustBackend.controller;

import com.ganesh.wanderlustBackend.dto.request.CreateBookingRequest;
import com.ganesh.wanderlustBackend.dto.response.BookingResponse;
import com.ganesh.wanderlustBackend.dto.response.IncomingBookingResponse;
import com.ganesh.wanderlustBackend.dto.response.MyTripResponse;
import com.ganesh.wanderlustBackend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public BookingResponse createBooking(@Valid @RequestBody CreateBookingRequest request){
        return bookingService.createBooking(request);
    }


    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId){
        bookingService.deleteBooking(bookingId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-trips")
    public List<MyTripResponse> getMyTrips(){
        return bookingService.getMyTrips();
    }

    @GetMapping("/host/incoming")
    public List<IncomingBookingResponse> getIncomingBookings(){
        return bookingService.getIncomingBookings();
    }
}
