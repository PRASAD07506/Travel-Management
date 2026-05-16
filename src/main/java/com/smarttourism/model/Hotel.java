package com.smarttourism.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(nullable = false)
    private String name;

    private Double pricePerNight;
    private Double rating;
    private String amenities;
    
    @Column(length = 500)
    private String room360Url; // URL to the 360 panorama image
}
