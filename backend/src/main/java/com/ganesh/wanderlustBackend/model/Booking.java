package com.ganesh.wanderlustBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Double totalPrice;

    @ManyToOne
    private Listing listing;

    @ManyToOne
    private User guest;
}
