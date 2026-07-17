package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.dto.request.CreateReviewRequest;
import com.ganesh.wanderlustBackend.dto.response.ReviewResponse;
import com.ganesh.wanderlustBackend.exception.ResourceNotFoundException;
import com.ganesh.wanderlustBackend.exception.UnauthorizedUserException;
import com.ganesh.wanderlustBackend.mapper.ReviewMapper;
import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.model.Review;
import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.repository.ListingRepo;
import com.ganesh.wanderlustBackend.repository.ReviewRepo;
import com.ganesh.wanderlustBackend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ListingRepo listingRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewMapper mapper;


    // get listing by id or throw exception
    private Listing getListingByIdOrThrow(Long id){
        return listingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
    }

    private Review getReviewByIdOrThrow(Long id){
        return reviewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review Not Found"));
    }





    public ReviewResponse createReview(Long listingId, CreateReviewRequest request){

        //load the listing and the current user
        Listing listing = getListingByIdOrThrow(listingId);
        User currUser = userService.getCurrentUser();

        // map to the Review entity
        Review review = mapper.toEntity(request);

        //set author and listing
        review.setAuthor(currUser);
        review.setListing(listing);

        listing.getReviews().add(review); // to maintain bidirectional consistency

        Review savedReview = reviewRepo.save(review);  // save to db
        return mapper.toResponse(savedReview);  //
    }


    public void deleteReview(Long listingId, Long reviewId){

        // load the required like listing,review,currUser
        Listing listing = getListingByIdOrThrow(listingId);
        Review review = getReviewByIdOrThrow(reviewId);
        User currUser = userService.getCurrentUser();

        // check the review is from the correct listing
        if( !review.getListing().getId().equals(listing.getId())){
            throw new RuntimeException("review is not belonged to this listing");
        }

        //check the author is same
        if(!review.getAuthor().getId().equals(currUser.getId())){
            throw new UnauthorizedUserException("Only the review author can perform this operation.");
        }

        listing.getReviews().remove(review);    // to maintain the bidirectional consistency

        reviewRepo.delete(review);  // delete review from the db
    }
}
