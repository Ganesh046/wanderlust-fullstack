package com.ganesh.wanderlustBackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "title should not be blank")
    private String title;

    @NotBlank(message = "description should not be blank")
    private String description;

    @NotNull(message = "image is required")
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "url",
                    column = @Column(name="img_url")
            ),
            @AttributeOverride(
                    name = "publicId",
                    column = @Column(name = "img_public_id")
            )
    })
    private Image image;

    @NotNull
    @Positive(message = "price should not be negative")
    private Double price;

    @NotBlank(message = "location should not be blank")
    private String location;

    @NotBlank(message = "country should not be blank")
    private String country;

    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Embedded
    private Geometry geometry;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();
}
