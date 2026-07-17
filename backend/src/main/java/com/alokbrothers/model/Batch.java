package com.alokbrothers.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Fish fish;
    private Double quantityKg;
    private LocalDate arrivalDate;
    private String freshnessStatus;

    // getters/setters
    public Long getId(){
        return id;
    } 
    public void setId(Long id){
        this.id=id;
    }
    public Fish getFish(){
        return fish;
    } 
    public void setFish(Fish f){
        this.fish=f;
    }
    public Double getQuantityKg(){
        return quantityKg;
    } 
    public void setQuantityKg(Double q){
        this.quantityKg=q;
    }
    public LocalDate getArrivalDate(){
        return arrivalDate;
    } public void setArrivalDate(LocalDate d){
        this.arrivalDate=d;
    }
    public String getFreshnessStatus(){
        return freshnessStatus;
    } public void setFreshnessStatus(String s){
        this.freshnessStatus=s;
    }
}
