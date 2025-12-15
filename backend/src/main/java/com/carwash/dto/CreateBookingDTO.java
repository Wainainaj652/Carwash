package com.carwash.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateBookingDTO {
    private Long serviceId;
    private Long vehicleId;
    private LocalDateTime bookingDateTime;
    private String notes;
}