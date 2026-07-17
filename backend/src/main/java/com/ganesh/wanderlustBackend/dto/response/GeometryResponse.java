package com.ganesh.wanderlustBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeometryResponse {

    public Double latitude;
    private Double longitude;
}
