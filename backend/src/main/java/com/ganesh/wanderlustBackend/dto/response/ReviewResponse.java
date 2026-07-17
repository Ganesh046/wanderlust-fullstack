package com.ganesh.wanderlustBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private OwnerResponse author;
}
