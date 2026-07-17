package com.ganesh.wanderlustBackend.service;

import com.ganesh.wanderlustBackend.model.User;
import com.ganesh.wanderlustBackend.model.UserPrincipal;
import com.ganesh.wanderlustBackend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);

        if (user == null){
            throw new UsernameNotFoundException("User not found with this username");
        }

        return new UserPrincipal(user);
    }
}
