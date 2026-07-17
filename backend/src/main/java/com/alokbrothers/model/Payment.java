package com.alokbrothers.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private String status; // PENDING, PAID, FAILED

    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getOrderId(){return orderId;} public void setOrderId(Long o){this.orderId=o;}
    public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal a){this.amount=a;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
}
