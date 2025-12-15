package com.carwash.repository;

import com.carwash.model.User;
import com.carwash.model.User.UserRole;  // Changed to inner enum import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    Long countByRole(UserRole role);
}