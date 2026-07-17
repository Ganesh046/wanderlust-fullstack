package com.ganesh.wanderlustBackend.controller;

import com.ganesh.wanderlustBackend.dto.request.CreateReviewRequest;
import com.ganesh.wanderlustBackend.dto.response.ReviewResponse;
import com.ganesh.wanderlustBackend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listings/{listingId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ReviewResponse createReview(@PathVariable Long listingId, @Valid @RequestBody CreateReviewRequest request){
        return reviewService.createReview(listingId, request);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long listingId, @PathVariable Long reviewId){
        reviewService.deleteReview(listingId, reviewId);

        return ResponseEntity.noContent().build();
    }
}
