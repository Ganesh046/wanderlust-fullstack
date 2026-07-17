package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.dto.request.LoginRequest;
import com.ganesh.wanderlustBackend.dto.request.RegisterRequest;
import com.ganesh.wanderlustBackend.dto.response.LoginResponse;
import com.ganesh.wanderlustBackend.dto.response.UserResponse;
import com.ganesh.wanderlustBackend.exception.UserNotFoundException;
import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.repository.UserRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;



    // Get the currently authenticated user
    public User getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepo.findByUsername(username);
//                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found"));
    }



    public UserResponse registerUser(@Valid RegisterRequest request) {
       User user = new User();

       user.setUsername(request.getUsername());
       user.setEmail(request.getEmail());
       user.setPassword(passwordEncoder.encode(request.getPassword()));

       User savedUser = userRepo.save(user);

        UserResponse response = new UserResponse(
                savedUser.getId(), savedUser.getUsername(), savedUser.getEmail()
        );

//        response.setId(savedUser.getId());
//        response.setUsername(savedUser.getUsername());
//        response.setEmail(savedUser.getEmail());

        return response;
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

         UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateJwtToken(userDetails.getUsername());


        return new LoginResponse(
                userDetails.getUsername(),
                token
        );
    }
}
