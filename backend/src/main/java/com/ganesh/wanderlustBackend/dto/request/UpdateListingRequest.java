package com.ganesh.wanderlustBackend.dto.request;

import com.ganesh.wanderlustBackend.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListingRequest {

    @NotBlank(message = "title should not be blank")
    private String title;

    @NotBlank(message = "description should not be blank")
    private String description;

    private MultipartFile image;

    @NotNull
    @Positive(message = "price should be positive")
    private Double price;

    @NotBlank(message = "location should not be blank")
    private String location;

    @NotBlank(message = "country should not be blank")
    private String country;

    @NotNull(message = "Category is required")
    private Category category;
}
