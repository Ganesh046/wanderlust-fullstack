package com.ganesh.wanderlustBackend.repository;

import com.ganesh.wanderlustBackend.model.Booking;
import com.ganesh.wanderlustBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByGuestOrderByCheckInDesc(User guest);

    List<Booking> findByListingOwnerOrderByCheckInDesc(User owner);
}
