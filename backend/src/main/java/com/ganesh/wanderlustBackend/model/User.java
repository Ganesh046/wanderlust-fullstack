package com.ganesh.wanderlustBackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "email should be in the correct format")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "password is required")
    private String password;

    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<Listing> listings = new ArrayList<>();
}
