package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.dto.response.GeocodingResponse;
import com.ganesh.wanderlustBackend.exception.GeocodingException;
import com.ganesh.wanderlustBackend.exception.LocationNotFoundException;
import com.ganesh.wanderlustBackend.model.Geometry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GeocodingService {

    @Autowired
    private RestClient restClient;

    public Geometry getCoordinates(String location, String country){

        try {
            String query = location + ", " + country;

            GeocodingResponse[] response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search") // appends /search after base url
                            .queryParam("q", query)
                            .queryParam("format", "jsonv2")
                            .queryParam("limit", 1)
                            .build())
                    .retrieve()
                    .body(GeocodingResponse[].class);

            if (response == null || response.length == 0) {
                throw new LocationNotFoundException("The provided location could not be found.");
            }

            GeocodingResponse result = response[0];
            Double latitude = Double.parseDouble(result.getLat());
            Double longitude = Double.parseDouble(result.getLon());

            return new Geometry(latitude, longitude);
        }catch (RestClientException ex){
            throw new GeocodingException("Unable to fetch coordinates at the moment.");
        }
    }
}
