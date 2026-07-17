package com.ganesh.wanderlustBackend.repository;

import com.ganesh.wanderlustBackend.model.Listing;
import com.ganesh.wanderlustBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepo extends JpaRepository<Listing, Long> {

    List<Listing> findByOwner(User owner);
}
