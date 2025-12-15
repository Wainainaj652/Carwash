package com.carwash.controller;


import com.carwash.dto.*;
import com.carwash.model.Booking;
import com.carwash.model.User;
import com.carwash.service.BookingService;
import com.carwash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    // Helper method to get current user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Helper to convert Booking to BookingDTO
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setBookingDateTime(booking.getBookingDateTime());
        dto.setStatus(booking.getStatus());
        dto.setNotes(booking.getNotes());
        dto.setRating(booking.getRating());
        dto.setReview(booking.getReview());

        // Set service details
        BookingDTO.ServiceDTO serviceDTO = new BookingDTO.ServiceDTO();
        serviceDTO.setId(booking.getService().getId());
        serviceDTO.setName(booking.getService().getName());
        serviceDTO.setDescription(booking.getService().getDescription());
        serviceDTO.setPrice(booking.getService().getPrice().doubleValue());
        serviceDTO.setDurationMinutes(booking.getService().getDurationMinutes());
        dto.setService(serviceDTO);

        // Set vehicle details
        BookingDTO.VehicleDTO vehicleDTO = new BookingDTO.VehicleDTO();
        vehicleDTO.setId(booking.getVehicle().getId());
        vehicleDTO.setMake(booking.getVehicle().getMake());
        vehicleDTO.setModel(booking.getVehicle().getModel());
        vehicleDTO.setLicensePlate(booking.getVehicle().getLicensePlate());
        dto.setVehicle(vehicleDTO);

        // Set assigned staff name if exists
        if (booking.getAssignedStaff() != null) {
            dto.setAssignedStaffName(booking.getAssignedStaff().getFullName());
        }

        return dto;
    }

    // POST /api/bookings - Create new booking (CUSTOMER)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingDTO createBookingDTO) {
        try {
            User currentUser = getCurrentUser();

            Booking booking = bookingService.createBooking(
                    currentUser,
                    createBookingDTO.getServiceId(),
                    createBookingDTO.getVehicleId(),
                    createBookingDTO.getBookingDateTime(),
                    createBookingDTO.getNotes()
            );

            return ResponseEntity.ok(convertToDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/bookings/my-bookings - Get my bookings (CUSTOMER)
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings() {
        User currentUser = getCurrentUser();

        List<Booking> bookings = bookingService.getCustomerBookings(currentUser);

        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookingDTOs);
    }

    // GET /api/bookings/{id} - Get specific booking
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            User currentUser = getCurrentUser();

            // Check permissions: customer can view their own, staff/admin can view all
            if (currentUser.getRole().equals(User.UserRole.CUSTOMER) &&
                    !booking.getCustomer().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }

            return ResponseEntity.ok(convertToDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/bookings/{id}/status - Update booking status (STAFF)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody UpdateStatusDTO updateStatusDTO) {
        try {
            User currentUser = getCurrentUser();

            // Only staff can update status
            if (!currentUser.getRole().equals(User.UserRole.STAFF)) {
                return ResponseEntity.status(403).body("Only staff can update booking status");
            }

            Booking booking = bookingService.updateBookingStatus(id, updateStatusDTO.getStatus());
            return ResponseEntity.ok(convertToDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/bookings/{id}/rate - Rate booking (CUSTOMER after completion)
    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateBooking(@PathVariable Long id,
                                         @RequestBody RateBookingDTO rateBookingDTO) {
        try {
            User currentUser = getCurrentUser();

            Booking booking = bookingService.rateBooking(
                    id,
                    rateBookingDTO.getRating(),
                    rateBookingDTO.getReview(),
                    currentUser
            );

            return ResponseEntity.ok(convertToDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}