package com.alokbrothers.controller;

import com.alokbrothers.model.Role;
import com.alokbrothers.model.User;
import com.alokbrothers.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserRepository userRepository;

    public CustomerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(Role.ROLE_CUSTOMER))
                .collect(Collectors.toList());
    }

    @PostMapping
    public User createCustomer(@RequestBody User user) {
        user.setRoles(Set.of(Role.ROLE_CUSTOMER));
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("defaultpass");
        }
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            user.setUsername("cust_" + System.currentTimeMillis());
        }
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateCustomer(@PathVariable Long id, @RequestBody User updated) {
        User user = userRepository.findById(id).orElseThrow();
        user.setBusinessName(updated.getBusinessName());
        user.setFullName(updated.getFullName()); // contact
        user.setMobileNumber(updated.getMobileNumber()); // phone
        user.setEmail(updated.getEmail());
        user.setHomeAddress(updated.getHomeAddress()); // city
        user.setCustomerType(updated.getCustomerType());
        user.setTotalOrders(updated.getTotalOrders());
        user.setTotalSpent(updated.getTotalSpent());
        user.setOutstanding(updated.getOutstanding());
        user.setJoinDate(updated.getJoinDate());
        user.setStatus(updated.getStatus());
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
