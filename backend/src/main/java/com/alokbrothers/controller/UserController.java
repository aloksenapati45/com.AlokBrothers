package com.alokbrothers.controller;

import com.alokbrothers.model.User;
import com.alokbrothers.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return ResponseEntity.ok((User) principal);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User currentUser = (User) principal;
        
        var fullName = body.get("fullName");
        var email = body.get("email");
        var mobileNumber = body.get("mobileNumber");
        var homeAddress = body.get("homeAddress");
        var adhaarCard = body.get("adhaarCard");
        var panCard = body.get("panCard");
        
        var user = userRepository.findById(currentUser.getId()).orElseThrow();
        if (fullName != null) user.setFullName(fullName);
        if (email != null) user.setEmail(email);
        if (mobileNumber != null) user.setMobileNumber(mobileNumber);
        if (homeAddress != null) user.setHomeAddress(homeAddress);
        if (adhaarCard != null) user.setAdhaarCard(adhaarCard);
        if (panCard != null) user.setPanCard(panCard);
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User currentUser = (User) principal;
        
        var currentPassword = body.get("currentPassword");
        var newPassword = body.get("newPassword");
        
        var user = userRepository.findById(currentUser.getId()).orElseThrow();
        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
        }
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
