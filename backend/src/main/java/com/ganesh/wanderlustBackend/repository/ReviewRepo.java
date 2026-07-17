package com.ganesh.wanderlustBackend.repository;

import com.ganesh.wanderlustBackend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
}
