package com.ganesh.wanderlustBackend.mapper;

import com.ganesh.wanderlustBackend.dto.request.CreateReviewRequest;
import com.ganesh.wanderlustBackend.dto.response.OwnerResponse;
import com.ganesh.wanderlustBackend.dto.response.ReviewResponse;
import com.ganesh.wanderlustBackend.model.Review;
import com.ganesh.wanderlustBackend.model.User;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public Review toEntity(CreateReviewRequest request){

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return review;
    }

    public ReviewResponse toResponse(Review review){
        ReviewResponse reviewRes = new ReviewResponse();

        reviewRes.setId(review.getId());
        reviewRes.setRating(review.getRating());
        reviewRes.setComment(review.getComment());

        User author = review.getAuthor();

        if (author != null){
            reviewRes.setAuthor(
                    new OwnerResponse(
                            author.getId(),
                            author.getUsername()
                    )
            );
        }


        return reviewRes;
    }
}
