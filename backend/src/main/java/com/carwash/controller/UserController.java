package com.carwash.controller;

import com.carwash.model.User;
import com.carwash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // Helper to get current user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/users/profile - Get my profile
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {
        try {
            User user = getCurrentUser();

            // Return user info without password
            Map<String, Object> profile = Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "phoneNumber", user.getPhoneNumber(),
                    "role", user.getRole(),
                    "active", user.isActive()
            );

            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/users/profile - Update my profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateData) {
        try {
            User currentUser = getCurrentUser();

            // Update fields if provided
            if (updateData.containsKey("fullName")) {
                currentUser.setFullName(updateData.get("fullName"));
            }
            if (updateData.containsKey("phoneNumber")) {
                currentUser.setPhoneNumber(updateData.get("phoneNumber"));
            }

            // Save updated user
            userService.updateUser(currentUser);

            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/users/change-password - Change password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            User currentUser = getCurrentUser();

            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Old and new password required");
            }

            // Verify old password
            if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
                return ResponseEntity.badRequest().body("Old password is incorrect");
            }

            // Update to new password (encrypted)
            currentUser.setPassword(passwordEncoder.encode(newPassword));
            userService.updateUser(currentUser);

            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/users/vehicles - Get my vehicles (moved from VehicleController)
    @GetMapping("/vehicles")
    public ResponseEntity<?> getMyVehicles() {
        try {
            User currentUser = getCurrentUser();
            // This would need VehicleService injected
            return ResponseEntity.ok("This endpoint needs VehicleService integration");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
