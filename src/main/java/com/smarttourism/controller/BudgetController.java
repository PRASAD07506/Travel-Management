package com.smarttourism.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    @GetMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeBudget(
            @RequestParam int days,
            @RequestParam int travelers,
            @RequestParam double hotelPricePerNight,
            @RequestParam double baseCost) {
        
        double totalHotelCost = hotelPricePerNight * days * ((travelers + 1) / 2); // Assume 2 pax per room
        double totalFoodCost = 50.0 * days * travelers; // Estimated $50 per day per pax
        double totalTransportCost = baseCost * travelers; // Flight/Train
        double totalCost = totalHotelCost + totalFoodCost + totalTransportCost;

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("hotel", totalHotelCost);
        breakdown.put("food", totalFoodCost);
        breakdown.put("transport", totalTransportCost);
        breakdown.put("total", totalCost);
        
        return ResponseEntity.ok(breakdown);
    }
}
