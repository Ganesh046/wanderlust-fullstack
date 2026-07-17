package com.ganesh.wanderlustBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyTripResponse {

    private Long bookingId;

    private Long listingId;

    private String title;

    private ImageResponse image;

    private String location;

    private String country;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Double totalPrice;
}
