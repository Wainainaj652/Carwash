package com.carwash.service;


import com.carwash.model.Service;
import com.carwash.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    // Get all active services
    public List<Service> getAllActiveServices() {
        return serviceRepository.findByActiveTrue();
    }

    // Get service by ID
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + id));
    }

    // Create new service
    public Service createService(Service service) {
        // Validate service
        if (service.getName() == null || service.getName().trim().isEmpty()) {
            throw new RuntimeException("Service name is required");
        }
        if (service.getPrice() == null || service.getPrice().doubleValue() <= 0) {
            throw new RuntimeException("Service price must be greater than 0");
        }

        service.setActive(true);
        return serviceRepository.save(service);
    }

    // Update existing service
    public Service updateService(Long id, Service updatedService) {
        Service existingService = getServiceById(id);

        // Update fields if provided
        if (updatedService.getName() != null) {
            existingService.setName(updatedService.getName());
        }
        if (updatedService.getDescription() != null) {
            existingService.setDescription(updatedService.getDescription());
        }
        if (updatedService.getPrice() != null) {
            existingService.setPrice(updatedService.getPrice());
        }
        if (updatedService.getDurationMinutes() != null) {
            existingService.setDurationMinutes(updatedService.getDurationMinutes());
        }

        return serviceRepository.save(existingService);
    }

    // Deactivate service (soft delete)
    public void deactivateService(Long id) {
        Service service = getServiceById(id);
        service.setActive(false);
        serviceRepository.save(service);
    }

    // Search services by name
    public List<Service> searchServices(String keyword) {
        return serviceRepository.findByNameContainingIgnoreCase(keyword);
    }
}