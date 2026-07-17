package com.ganesh.wanderlustBackend.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Geometry {

    private Double latitude;
    private Double longitude;

}
