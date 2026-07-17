package com.ganesh.wanderlustBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDatesResponse {

    private Long id;
    private LocalDate checkIn;
    private LocalDate checkOut;
}
