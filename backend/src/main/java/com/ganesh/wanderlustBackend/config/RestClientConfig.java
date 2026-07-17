package com.ganesh.wanderlustBackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

// this is created bcz we want to communicate with the 3rd party service
// (RestClient is inbuilt in the new springboot versions we don't need to add the dependency
// just create the bean and spring will manage
@Configuration
public class RestClientConfig {

    @Value("${geocoding.base-url}")
    private String baseUrl;

    @Bean
    public RestClient restClient(){
        return RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
