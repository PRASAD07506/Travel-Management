package com.smarttourism.service;

import com.smarttourism.model.Hotel;
import com.smarttourism.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getHotelsByDestination(Long destinationId) {
        return hotelRepository.findByDestinationId(destinationId);
    }
}
