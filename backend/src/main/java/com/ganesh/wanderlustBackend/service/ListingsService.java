package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.dto.request.CreateListingRequest;
import com.ganesh.wanderlustBackend.dto.request.UpdateListingRequest;
import com.ganesh.wanderlustBackend.dto.response.ListingDetailsResponse;
import com.ganesh.wanderlustBackend.dto.response.ListingResponse;
import com.ganesh.wanderlustBackend.exception.ResourceNotFoundException;
import com.ganesh.wanderlustBackend.exception.UnauthorizedUserException;
import com.ganesh.wanderlustBackend.model.Geometry;
import com.ganesh.wanderlustBackend.model.Image;
import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.mapper.ListingMapper;
import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.repository.ListingRepo;
import com.ganesh.wanderlustBackend.repository.UserRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListingsService {

    @Autowired
    private ListingRepo listingRepo;

//    @Autowired
//    private UserRepo userRepo;

    @Autowired
    private ListingMapper mapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private UserService userService;




    //function to validate owner
    private void validateOwner(Listing listing){
        User currentUser = userService.getCurrentUser();
        if(!listing.getOwner().getId().equals(currentUser.getId())){
            throw new UnauthorizedUserException("Only owner has the right to do this operation");
        }
    }

    //function to get the listing
    private Listing getListingByIdOrThrow(Long id){
        return listingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing Not found"));
    }


    //get all listings
    public List<ListingResponse> getAllListings() {
        List<Listing> listings = listingRepo.findAll();

        List<ListingResponse> listingResponses = new ArrayList<>();
        for(Listing listing: listings){
            listingResponses.add(mapper.toResponse(listing));
        }

        return listingResponses;

//        we can do this if want when you explore stram()
//        return listingRepo.findAll()
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
    }

    //get listing by id
    public ListingDetailsResponse getListingById(Long id) {
       Listing listing = getListingByIdOrThrow(id);

       return mapper.toDetailsResponse(listing);
    }

    //add listing
    public ListingResponse addListing(CreateListingRequest createListingRequest) {

        //mapping the requestdto to the entity
        Listing listing = mapper.toEntity(createListingRequest);

        //upload image
         Image uploadImage= cloudinaryService.uploadImage(createListingRequest.getImage());
         listing.setImage(uploadImage);

         //get coordinates
        Geometry geometry=geocodingService.getCoordinates(createListingRequest.getLocation(), createListingRequest.getCountry());
        listing.setGeometry(geometry);

        // getting the current user and setting the owner to the listing
        User owner = userService.getCurrentUser();
        listing.setOwner(owner);

        //saving to the db
        Listing savedListing = listingRepo.save(listing);

        //mappring entity to the responsedto and returning that
        return mapper.toResponse(savedListing) ;
    }

    //update listing
    public ListingDetailsResponse updateListing(Long id, UpdateListingRequest updatedListingReq) {
      Listing currListing = getListingByIdOrThrow(id);

        // validate the owner
        validateOwner(currListing);

        // if the new image is uploaded ->
        // 1.add the new image to the cloudinary from the request
        // 2.delete existing image from the cloudinary

        MultipartFile newImage = updatedListingReq.getImage();

        if( newImage != null && !newImage.isEmpty()){
            Image newImg = cloudinaryService.uploadImage(newImage);
            cloudinaryService.deleteImage(currListing.getImage().getPublicId());
            currListing.setImage(newImg);
        }

        //check whether location or country changed if yes then get and set new geometry coordinates
        if(!currListing.getLocation().equals(updatedListingReq.getLocation())
                || !currListing.getCountry().equals(updatedListingReq.getCountry())
        ){
            Geometry geometry =geocodingService.getCoordinates(updatedListingReq.getLocation(), updatedListingReq.getCountry());
            currListing.setGeometry(geometry);
        }

        // mapping
        mapper.updateEntity(currListing, updatedListingReq);
        //save to the db
        Listing updatedListing =  listingRepo.save(currListing);
        // map to response and return
        return mapper.toDetailsResponse(updatedListing);

    }

    //delete listing
    public void deleteListing(Long id) {
        Listing listing = getListingByIdOrThrow(id);

        //validate owner
        validateOwner(listing);

        //delete image from cloudinary
        cloudinaryService.deleteImage(listing.getImage().getPublicId());

        //delete listing from DB
        listingRepo.delete(listing);
    }



    // get my listings

    public List<ListingResponse> getMyListings(){
        User currUser = userService.getCurrentUser();

        return listingRepo.findByOwner(currUser)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}
