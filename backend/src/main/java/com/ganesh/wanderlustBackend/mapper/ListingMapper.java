package com.ganesh.wanderlustBackend.mapper;

import com.ganesh.wanderlustBackend.dto.request.CreateListingRequest;
import com.ganesh.wanderlustBackend.dto.request.UpdateListingRequest;
import com.ganesh.wanderlustBackend.dto.response.*;
import com.ganesh.wanderlustBackend.model.Geometry;
import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.model.Review;
import com.ganesh.wanderlustBackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ListingMapper {

    @Autowired
    private final ReviewMapper reviewMapper;
    @Autowired
    private BookingMapper bookingMapper;

    public ListingMapper(ReviewMapper reviewMapper) {
        this.reviewMapper = reviewMapper;
    }

    public Listing toEntity(CreateListingRequest request){
        Listing listing = new Listing();

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
//        listing.setImage(request.getImage());
        listing.setPrice(request.getPrice());
        listing.setLocation(request.getLocation());
        listing.setCountry(request.getCountry());
        listing.setCategory(request.getCategory());

        return listing;
    }




    public ListingResponse toResponse(Listing listing){
        ListingResponse response = new ListingResponse();

        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setImage(new ImageResponse(listing.getImage().getUrl()));
        response.setPrice(listing.getPrice());
        response.setLocation(listing.getLocation());
        response.setCountry(listing.getCountry());
        response.setCategory(listing.getCategory());

        User owner = listing.getOwner();

        if(owner != null){
            response.setOwner(
                    new OwnerResponse(
                            owner.getId(),
                            owner.getUsername()
                    )
            );
        }

        Geometry geometry = listing.getGeometry();
        if (geometry != null){
            response.setGeometry(
                    new GeometryResponse(
                            geometry.getLatitude(),
                            geometry.getLongitude()
                    )
            );
        }

        // instead of thiss use the stream
//        List<ReviewResponse> reviewResponses = new ArrayList<>();
//        for(Review review: listing.getReviews()){
//            reviewResponses.add(reviewMapper.toResponse(review));
//        }
        List<ReviewResponse> reviewResponses =
                listing.getReviews()
                        .stream()
                        .map(reviewMapper::toResponse)
                        .toList();

        response.setReviews(reviewResponses);

        return response;
    }



    public ListingDetailsResponse toDetailsResponse(Listing listing){
        ListingDetailsResponse response = new ListingDetailsResponse();

        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setImage(new ImageResponse(listing.getImage().getUrl()));
        response.setPrice(listing.getPrice());
        response.setLocation(listing.getLocation());
        response.setCountry(listing.getCountry());
        response.setCategory(listing.getCategory());

        User owner = listing.getOwner();

        if(owner != null){
            response.setOwner(
                    new OwnerResponse(
                            owner.getId(),
                            owner.getUsername()
                    )
            );
        }

        Geometry geometry = listing.getGeometry();
        if (geometry != null){
            response.setGeometry(
                    new GeometryResponse(
                            geometry.getLatitude(),
                            geometry.getLongitude()
                    )
            );
        }

        List<ReviewResponse> reviewResponses =
                listing.getReviews()
                        .stream()
                        .map(reviewMapper::toResponse)
                        .toList();

        response.setReviews(reviewResponses);

        List<BookingDatesResponse> bookingResponses = listing.getBookings()
                .stream()
                .map(bookingMapper::toBookingDatesResponse)
                .toList();

        response.setBookings(bookingResponses);

        return response;
    }


    //update mapper function
    public void updateEntity(Listing currListing, UpdateListingRequest updatedListingReq) {

        currListing.setTitle(updatedListingReq.getTitle());
        currListing.setDescription(updatedListingReq.getDescription());
//        currListing.setImage(updatedListingReq.getImage()); this is done in the service only
        currListing.setPrice(updatedListingReq.getPrice());
        currListing.setLocation(updatedListingReq.getLocation());
        currListing.setCountry(updatedListingReq.getCountry());
        currListing.setCategory(updatedListingReq.getCategory());
    }
}
