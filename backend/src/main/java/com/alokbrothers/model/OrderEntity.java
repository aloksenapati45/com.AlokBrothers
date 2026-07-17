package com.alokbrothers.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String customer;
    private String phone;
    private String fish;
    private Integer qty;
    private Double rate;
    private Double amount;
    private String status;
    private String payStatus;
    private String date;
    private String delivery;
    private String note;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getFish() { return fish; }
    public void setFish(String fish) { this.fish = fish; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPayStatus() { return payStatus; }
    public void setPayStatus(String payStatus) { this.payStatus = payStatus; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getDelivery() { return delivery; }
    public void setDelivery(String delivery) { this.delivery = delivery; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
