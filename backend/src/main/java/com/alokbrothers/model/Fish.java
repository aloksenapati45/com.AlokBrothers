package com.alokbrothers.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Fish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private BigDecimal pricePerKg;
    private Double qty;
    private String unit;
    private BigDecimal buyPrice;
    private BigDecimal sellPrice;
    private String supplier;
    private String status;
    private String lastUpdated;

    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCategory(){return category;} public void setCategory(String category){this.category=category;}
    public Double getQty(){return qty;} public void setQty(Double q){this.qty=q;}
    public String getUnit(){return unit;} public void setUnit(String u){this.unit=u;}
    public BigDecimal getBuyPrice(){return buyPrice;} public void setBuyPrice(BigDecimal bp){this.buyPrice=bp;}
    public BigDecimal getSellPrice(){return sellPrice;} public void setSellPrice(BigDecimal sp){this.sellPrice=sp;}
    public String getSupplier(){return supplier;} public void setSupplier(String s){this.supplier=s;}
    public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
    public String getLastUpdated(){return lastUpdated;} public void setLastUpdated(String lu){this.lastUpdated=lu;}
}
