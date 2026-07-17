package com.ganesh.wanderlustBackend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "Listing id is required")
    private Long listingId;

    @NotNull(message = "check-in date is required")
    private LocalDate checkIn;

    @NotNull(message = "check-out date is required")
    private LocalDate checkOut;
}
