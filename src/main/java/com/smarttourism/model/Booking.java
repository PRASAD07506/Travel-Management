package com.smarttourism.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String type; // HOTEL, VEHICLE, GUIDE
    private Long referenceId; // ID of the booked entity

    private Double totalCost;
    private String status; // PENDING, CONFIRMED, CANCELLED
    
    private LocalDate bookingDate;
}
