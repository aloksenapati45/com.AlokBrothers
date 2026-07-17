package com.alokbrothers.model;

import jakarta.persistence.*;

@Entity
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String contact;
    private String phone;
    private String email;
    private String city;
    private String state;
    private String fishTypes; // stored as comma separated string
    private String pricePer;
    private Integer minOrder;
    private Integer reliability;
    private String payTerms;
    private String status;
    private String lastPurchase;
    private Double totalPurchased;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getFishTypes() { return fishTypes; }
    public void setFishTypes(String fishTypes) { this.fishTypes = fishTypes; }
    public String getPricePer() { return pricePer; }
    public void setPricePer(String pricePer) { this.pricePer = pricePer; }
    public Integer getMinOrder() { return minOrder; }
    public void setMinOrder(Integer minOrder) { this.minOrder = minOrder; }
    public Integer getReliability() { return reliability; }
    public void setReliability(Integer reliability) { this.reliability = reliability; }
    public String getPayTerms() { return payTerms; }
    public void setPayTerms(String payTerms) { this.payTerms = payTerms; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLastPurchase() { return lastPurchase; }
    public void setLastPurchase(String lastPurchase) { this.lastPurchase = lastPurchase; }
    public Double getTotalPurchased() { return totalPurchased; }
    public void setTotalPurchased(Double totalPurchased) { this.totalPurchased = totalPurchased; }
}
