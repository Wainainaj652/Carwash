package com.carwash.repository;

import com.carwash.model.User;
import com.carwash.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // Find all vehicles for a specific user
    List<Vehicle> findByUser(User user);

    // Find vehicle by license plate
    Optional<Vehicle> findByLicensePlate(String licensePlate);
}