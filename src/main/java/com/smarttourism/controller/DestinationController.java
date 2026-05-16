package com.smarttourism.controller;

import com.smarttourism.model.Destination;
import com.smarttourism.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<Destination>> recommend(
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) Double maxBudget) {
        return ResponseEntity.ok(destinationService.getRecommendations(mood, maxBudget));
    }
}
