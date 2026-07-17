package com.ganesh.wanderlustBackend.controller;

import com.ganesh.wanderlustBackend.dto.request.LoginRequest;
import com.ganesh.wanderlustBackend.dto.request.RegisterRequest;
import com.ganesh.wanderlustBackend.dto.response.LoginResponse;
import com.ganesh.wanderlustBackend.dto.response.UserResponse;
import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request){
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest){
        return userService.loginUser(loginRequest);
    }

}
