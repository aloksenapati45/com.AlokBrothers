package com.alokbrothers.controller;

import com.alokbrothers.model.OrderEntity;
import com.alokbrothers.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public OrderEntity updateOrder(@PathVariable Long id, @RequestBody OrderEntity updated) {
        OrderEntity order = orderRepository.findById(id).orElseThrow();
        order.setCustomer(updated.getCustomer());
        order.setPhone(updated.getPhone());
        order.setFish(updated.getFish());
        order.setQty(updated.getQty());
        order.setRate(updated.getRate());
        order.setAmount(updated.getAmount());
        order.setStatus(updated.getStatus());
        order.setPayStatus(updated.getPayStatus());
        order.setDate(updated.getDate());
        order.setDelivery(updated.getDelivery());
        order.setNote(updated.getNote());
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
