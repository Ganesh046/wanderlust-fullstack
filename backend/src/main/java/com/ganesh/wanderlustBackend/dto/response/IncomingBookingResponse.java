package com.ganesh.wanderlustBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncomingBookingResponse {

    private Long bookingId;

    private Long listingId;

    private String propertyTitle;

    private String location;

    private String guestUsername;

    private String guestEmail;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Double totalPrice;
}
