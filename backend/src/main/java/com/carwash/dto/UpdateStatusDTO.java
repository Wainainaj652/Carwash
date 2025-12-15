package com.carwash.dto;


import com.carwash.model.Booking.BookingStatus;
import lombok.Data;

@Data
public class UpdateStatusDTO {
    private BookingStatus status;
}