package com.carwash.controller;


import com.carwash.dto.LoginRequestDTO;
import com.carwash.dto.LoginResponseDTO;
import com.carwash.dto.RegisterRequestDTO;
import com.carwash.model.User;
import com.carwash.service.AuthService;
import com.carwash.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {


    private final AuthService authService;
    private final JwtUtil jwtUtil;  // Add this

    // Register new customer
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO registerDTO) {
        try {
            registerDTO.setRole(User.UserRole.CUSTOMER);
            User user = authService.register(registerDTO);

            // Generate JWT token (same as login)
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

            // Create login response (same format as login endpoint)
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            response.setRole(user.getRole());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDTO) {
        try {
            LoginResponseDTO response = authService.login(loginDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}