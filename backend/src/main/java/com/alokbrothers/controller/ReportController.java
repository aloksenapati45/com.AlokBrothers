package com.alokbrothers.controller;

import com.alokbrothers.model.OrderEntity;
import com.alokbrothers.repository.UserRepository;
import com.alokbrothers.repository.OrderRepository;
import com.alokbrothers.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;

    public ReportController(OrderRepository orderRepository, UserRepository userRepository, SupplierRepository supplierRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<OrderEntity> orders = orderRepository.findAll();
        double totalSales = orders.stream().filter(o -> "Paid".equals(o.getPayStatus())).mapToDouble(OrderEntity::getAmount).sum();
        long activeCustomers = userRepository.findAll().stream().filter(u -> u.getRoles() != null && u.getRoles().contains(com.alokbrothers.model.Role.ROLE_CUSTOMER)).count();
        long activeSuppliers = supplierRepository.count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalSales", totalSales);
        response.put("activeCustomers", activeCustomers);
        response.put("activeSuppliers", activeSuppliers);
        response.put("totalOrders", orders.size());
        
        // Mocking some chart data for the report
        response.put("monthlyRevenue", List.of(
            Map.of("name", "Jan", "sales", 150000),
            Map.of("name", "Feb", "sales", 200000),
            Map.of("name", "Mar", "sales", 180000),
            Map.of("name", "Apr", "sales", 250000),
            Map.of("name", "May", "sales", 300000),
            Map.of("name", "Jun", "sales", 280000)
        ));

        return response;
    }
}
