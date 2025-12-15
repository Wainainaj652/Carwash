package com.carwash.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;          // Toyota, Honda, etc.

    @Column(nullable = false)
    private String model;         // Camry, Civic, etc.

    @Column(nullable = false)
    private String licensePlate;

    @Column(nullable = false)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;     // SEDAN, SUV, TRUCK, etc.

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;            // Vehicle owner

    // Vehicle types enum
    public enum VehicleType {
        SEDAN,
        SUV,
        TRUCK,
        VAN,
        MOTORCYCLE
    }
}