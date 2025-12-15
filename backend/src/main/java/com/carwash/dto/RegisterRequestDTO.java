package com.carwash.dto;

import com.carwash.model.User.UserRole;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private UserRole role = UserRole.CUSTOMER;  // Default to CUSTOMER
}