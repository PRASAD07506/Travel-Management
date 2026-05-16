package com.smarttourism.service;

import com.smarttourism.model.Destination;
import com.smarttourism.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public List<Destination> getRecommendations(String mood, Double maxBudget) {
        List<Destination> destinations;
        if (mood != null && !mood.isEmpty()) {
            destinations = destinationRepository.findByCategory(mood);
        } else {
            destinations = destinationRepository.findAll();
        }

        if (maxBudget != null) {
            return destinations.stream()
                    .filter(d -> d.getBaseCost() <= maxBudget)
                    .collect(Collectors.toList());
        }
        return destinations;
    }
}
