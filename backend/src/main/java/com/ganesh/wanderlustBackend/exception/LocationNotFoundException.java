package com.ganesh.wanderlustBackend.exception;

public class LocationNotFoundException extends RuntimeException{

    public LocationNotFoundException(String message){
        super(message);
    }
}
