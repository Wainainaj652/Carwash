package com.carwash.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User customer;        // Who booked

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;      // Which service

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;      // Which vehicle

    @Column(nullable = false)
    private LocalDateTime bookingDateTime;  // When appointment is

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Integer rating;       // 1-5 stars
    private String review;

    @ManyToOne
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;   // Staff assigned by admin

    // Booking status enum
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}