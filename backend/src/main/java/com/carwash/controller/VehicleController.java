package com.carwash.controller;

import com.carwash.dto.CreateVehicleDTO;
import com.carwash.dto.VehicleDTO;
import com.carwash.model.User;
import com.carwash.model.Vehicle;
import com.carwash.service.UserService;
import com.carwash.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserService userService;

    private User getCurrentUser() {
        // Hardcode a user for testing
        return userService.findByEmail("customer@test.com")
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Helper to convert Vehicle to VehicleDTO
    private VehicleDTO convertToDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setMake(vehicle.getMake());
        dto.setModel(vehicle.getModel());
        dto.setLicensePlate(vehicle.getLicensePlate());
        dto.setColor(vehicle.getColor());
        dto.setType(vehicle.getType());
        return dto;
    }

    // GET /api/vehicles - Get all vehicles for current user
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getMyVehicles() {
        User currentUser = getCurrentUser();
        List<Vehicle> vehicles = vehicleService.getUserVehicles(currentUser);

        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDTOs);
    }

    // GET /api/vehicles/{id} - Get specific vehicle
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        User currentUser = getCurrentUser();

        // Check if vehicle belongs to user
        if (!vehicleService.vehicleBelongsToUser(id, currentUser)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(convertToDTO(vehicle));
    }

    // POST /api/vehicles - Add new vehicle
    @PostMapping
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody CreateVehicleDTO createVehicleDTO) {
        User currentUser = getCurrentUser();

        // Create Vehicle entity from DTO
        Vehicle vehicle = new Vehicle();
        vehicle.setMake(createVehicleDTO.getMake());
        vehicle.setModel(createVehicleDTO.getModel());
        vehicle.setLicensePlate(createVehicleDTO.getLicensePlate());
        vehicle.setColor(createVehicleDTO.getColor());
        vehicle.setType(createVehicleDTO.getType());

        // Save vehicle
        Vehicle savedVehicle = vehicleService.addVehicle(vehicle, currentUser);

        return ResponseEntity.ok(convertToDTO(savedVehicle));
    }

    // DELETE /api/vehicles/{id} - Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        User currentUser = getCurrentUser();

        try {
            vehicleService.deleteVehicle(id, currentUser);
            return ResponseEntity.ok("Vehicle deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}