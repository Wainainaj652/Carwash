package com.carwash.dto;

import com.carwash.model.Booking.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingDTO {
    private Long id;
    private ServiceDTO service;
    private VehicleDTO vehicle;
    private LocalDateTime bookingDateTime;
    private BookingStatus status;
    private String notes;
    private Integer rating;
    private String review;
    private String assignedStaffName;

    // Nested DTO for service details
    @Data
    public static class ServiceDTO {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer durationMinutes;
    }

    // Nested DTO for vehicle details
    @Data
    public static class VehicleDTO {
        private Long id;
        private String make;
        private String model;
        private String licensePlate;
    }
}