package com.carwash.service;


import com.carwash.model.User;
import com.carwash.model.Vehicle;
import com.carwash.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    // Add new vehicle for a user
    public Vehicle addVehicle(Vehicle vehicle, User user) {
        // Set the vehicle owner
        vehicle.setUser(user);

        // Save to database
        return vehicleRepository.save(vehicle);
    }

    // Get all vehicles for a user
    public List<Vehicle> getUserVehicles(User user) {
        return vehicleRepository.findByUser(user);
    }

    // Get vehicle by ID
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    // Delete vehicle
    public void deleteVehicle(Long id, User user) {
        Vehicle vehicle = getVehicleById(id);

        // Check if vehicle belongs to user
        if (!vehicle.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own vehicles");
        }

        vehicleRepository.delete(vehicle);
    }

    // Check if vehicle belongs to user
    public boolean vehicleBelongsToUser(Long vehicleId, User user) {
        Vehicle vehicle = getVehicleById(vehicleId);
        return vehicle.getUser().getId().equals(user.getId());
    }
}