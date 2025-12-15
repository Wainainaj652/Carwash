package com.carwash.controller;

import com.carwash.dto.ServiceDTO;
import com.carwash.model.Service;
import com.carwash.model.User;
import com.carwash.service.ServiceService;
import com.carwash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ServiceController {

    private final ServiceService serviceService;
    private final UserService userService;

    // Helper to convert Service to ServiceDTO
    private ServiceDTO convertToDTO(Service service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDurationMinutes(service.getDurationMinutes());
        return dto;
    }

    // Helper to get current user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/services - Get all active services (Public)
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<Service> services = serviceService.getAllActiveServices();

        List<ServiceDTO> serviceDTOs = services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(serviceDTOs);
    }

    // GET /api/services/{id} - Get service by ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);

        if (!service.isActive()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(convertToDTO(service));
    }

    // POST /api/services - Create new service (ADMIN only)
    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceDTO serviceDTO) {
        try {
            User currentUser = getCurrentUser();

            // Only admin can create services
            if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body("Only admin can create services");
            }

            // Convert DTO to Entity
            Service service = new Service();
            service.setName(serviceDTO.getName());
            service.setDescription(serviceDTO.getDescription());
            service.setPrice(serviceDTO.getPrice());
            service.setDurationMinutes(serviceDTO.getDurationMinutes());

            Service createdService = serviceService.createService(service);
            return ResponseEntity.ok(convertToDTO(createdService));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/services/{id} - Update service (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ServiceDTO serviceDTO) {
        try {
            User currentUser = getCurrentUser();

            if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body("Only admin can update services");
            }

            // Convert DTO to Entity for update
            Service updatedService = new Service();
            updatedService.setName(serviceDTO.getName());
            updatedService.setDescription(serviceDTO.getDescription());
            updatedService.setPrice(serviceDTO.getPrice());
            updatedService.setDurationMinutes(serviceDTO.getDurationMinutes());

            Service service = serviceService.updateService(id, updatedService);
            return ResponseEntity.ok(convertToDTO(service));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/services/{id} - Deactivate service (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();

            if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body("Only admin can delete services");
            }

            serviceService.deactivateService(id);
            return ResponseEntity.ok("Service deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/services/search?q= - Search services (Public)
    @GetMapping("/search")
    public ResponseEntity<List<ServiceDTO>> searchServices(@RequestParam String q) {
        List<Service> services = serviceService.searchServices(q);

        List<ServiceDTO> serviceDTOs = services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(serviceDTOs);
    }
}