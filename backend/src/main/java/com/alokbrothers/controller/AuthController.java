package com.alokbrothers.controller;

import com.alokbrothers.model.User;
import com.alokbrothers.repository.UserRepository;
import com.alokbrothers.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil){
        this.userRepository = userRepository; this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        var username = body.get("username");
        var password = body.get("password");
        var userOpt = userRepository.findByUsername(username);
        if(userOpt.isPresent() && userOpt.get().getPassword().equals(password)){
            var token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body){
        var username = body.get("username");
        var password = body.get("password");
        var firstName = body.get("firstName");
        var lastName = body.get("lastName");
        var email = body.get("email");
        var mobileNumber = body.get("mobileNumber");

        if(username == null || password == null || firstName == null || lastName == null || email == null || mobileNumber == null){
            return ResponseEntity.badRequest().body(Map.of("error","firstName, lastName, email, mobileNumber, username and password are required"));
        }
        if(userRepository.findByUsername(username).isPresent()){
            return ResponseEntity.status(409).body(Map.of("error","username exists"));
        }
        var user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setFullName((firstName + " " + lastName).trim());
        user.setEmail(email);
        user.setMobileNumber(mobileNumber);
        user.setRoles(java.util.Set.of(com.alokbrothers.model.Role.ROLE_CUSTOMER));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message","registered"));
    }
}
