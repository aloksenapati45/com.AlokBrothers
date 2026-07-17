package com.alokbrothers.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String fullName;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String email;
    private String homeAddress;
    private String adhaarCard;
    private String panCard;
    
    // CRM Fields
    private String businessName;
    private String customerType; // Wholesaler, Retailer
    private Integer totalOrders;
    private Double totalSpent;
    private Double outstanding;
    private String joinDate;
    private String status; // Active, Inactive

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getHomeAddress() { return homeAddress; }
    public void setHomeAddress(String homeAddress) { this.homeAddress = homeAddress; }
    public String getAdhaarCard() { return adhaarCard; }
    public void setAdhaarCard(String adhaarCard) { this.adhaarCard = adhaarCard; }
    public String getPanCard() { return panCard; }
    public void setPanCard(String panCard) { this.panCard = panCard; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }
    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }
    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }
    public Double getOutstanding() { return outstanding; }
    public void setOutstanding(Double outstanding) { this.outstanding = outstanding; }
    public String getJoinDate() { return joinDate; }
    public void setJoinDate(String joinDate) { this.joinDate = joinDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
