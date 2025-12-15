package com.carwash.dto;

import com.carwash.model.Vehicle.VehicleType;
import lombok.Data;

@Data
public class VehicleDTO {
    private Long id;
    private String make;
    private String model;
    private String licensePlate;
    private String color;
    private VehicleType type;
}