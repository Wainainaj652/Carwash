package com.carwash.dto;



import com.carwash.model.User;
import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private String email;
    private String fullName;
    private User.UserRole role;
}