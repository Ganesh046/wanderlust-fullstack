package com.ganesh.wanderlustBackend.dto.response;

import com.ganesh.wanderlustBackend.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListingDetailsResponse {

    private Long id;

    private String title;

    private String description;

    private ImageResponse image;

    private Double price;

    private String location;

    private String country;

    private Category category;

    private OwnerResponse owner;

    private GeometryResponse geometry;

    private List<ReviewResponse> reviews;

    private List<BookingDatesResponse> bookings;
}
