package com.ganesh.wanderlustBackend.repository;

import com.ganesh.wanderlustBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
