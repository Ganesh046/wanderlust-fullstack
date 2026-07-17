package com.ganesh.wanderlustBackend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "email should be in correct format")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
