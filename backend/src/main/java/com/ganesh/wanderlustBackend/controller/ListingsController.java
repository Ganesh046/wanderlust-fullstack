package com.ganesh.wanderlustBackend.controller;

import com.ganesh.wanderlustBackend.dto.request.CreateListingRequest;
import com.ganesh.wanderlustBackend.dto.request.UpdateListingRequest;
import com.ganesh.wanderlustBackend.dto.response.ListingDetailsResponse;
import com.ganesh.wanderlustBackend.dto.response.ListingResponse;
import com.ganesh.wanderlustBackend.service.ListingsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ListingsController {
    @Autowired
    private ListingsService listingsService;

    @GetMapping("/listings")
    public List<ListingResponse> getAllListings(){
        return listingsService.getAllListings();
    }

    @GetMapping("/listings/{id}")
    public ListingDetailsResponse getListingById(@PathVariable Long id){
        return listingsService.getListingById(id);
    }

    @PostMapping(value = "/listings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE  )
    public ListingResponse addListing(@Valid @ModelAttribute CreateListingRequest listing){
        return listingsService.addListing(listing);
    }

    @PutMapping(value = "/listings/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ListingDetailsResponse updateListing(@PathVariable Long id, @Valid @ModelAttribute UpdateListingRequest updateListingRequest){
        return listingsService.updateListing(id, updateListingRequest);
    }

    @DeleteMapping("/listings/{id}")
    public void deleteListing(@PathVariable Long id){
        listingsService.deleteListing(id);
    }


    @GetMapping("/listings/my-listings")
    public List<ListingResponse> getMyListings(){
        return listingsService.getMyListings();
    }
}
