package com.smarttourism.controller;

import com.smarttourism.model.Hotel;
import com.smarttourism.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping("/destination/{destId}")
    public ResponseEntity<List<Hotel>> getHotels(@PathVariable Long destId) {
        return ResponseEntity.ok(hotelService.getHotelsByDestination(destId));
    }
}
