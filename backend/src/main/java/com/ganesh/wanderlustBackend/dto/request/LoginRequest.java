package com.ganesh.wanderlustBackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "username is required")
    private String username;

    @NotBlank(message = "password is required")
    private String password;
}
