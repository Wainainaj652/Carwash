package com.carwash.service;


import com.carwash.model.Booking;
import com.carwash.model.Service;
import com.carwash.model.User;
import com.carwash.model.Vehicle;
import com.carwash.repository.BookingRepository;
import com.carwash.repository.ServiceRepository;
import com.carwash.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceService serviceService;
    private final VehicleRepository vehicleRepository;
    private final VehicleService vehicleService;

    // Create new booking
    public Booking createBooking(User customer, Long serviceId, Long vehicleId,
                                 LocalDateTime bookingDateTime, String notes) {

        // Get service
        Service service = serviceService.getServiceById(serviceId);

        // Get vehicle
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        // Check if vehicle belongs to customer
        if (!vehicleService.vehicleBelongsToUser(vehicleId, customer)) {
            throw new RuntimeException("Vehicle does not belong to you");
        }

        // Check if booking time is in future
        if (bookingDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Booking time must be in the future");
        }

        // Check for overlapping bookings (simple check - can be improved)
        List<Booking> existingBookings = bookingRepository
                .findByBookingDateTimeBetween(
                        bookingDateTime.minusMinutes(30),
                        bookingDateTime.plusMinutes(service.getDurationMinutes() + 30)
                );

        if (!existingBookings.isEmpty()) {
            throw new RuntimeException("Time slot not available");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setService(service);
        booking.setVehicle(vehicle);
        booking.setBookingDateTime(bookingDateTime);
        booking.setNotes(notes);
        booking.setStatus(Booking.BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    // Get bookings for customer
    public List<Booking> getCustomerBookings(User customer) {
        return bookingRepository.findByCustomer(customer);
    }

    // Get booking by ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Update booking status (for staff)
    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // Assign booking to staff (for admin)
    public Booking assignBookingToStaff(Long bookingId, User staff) {
        Booking booking = getBookingById(bookingId);

        // Check if user is staff
        if (!staff.getRole().equals(User.UserRole.STAFF)) {
            throw new RuntimeException("User is not a staff member");
        }

        booking.setAssignedStaff(staff);
        return bookingRepository.save(booking);
    }

    // Rate booking (for customer after completion)
    public Booking rateBooking(Long bookingId, Integer rating, String review, User customer) {
        Booking booking = getBookingById(bookingId);

        // Check if booking belongs to customer
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("You can only rate your own bookings");
        }

        // Check if booking is completed
        if (!booking.getStatus().equals(Booking.BookingStatus.COMPLETED)) {
            throw new RuntimeException("You can only rate completed bookings");
        }

        // Check rating range
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        booking.setRating(rating);
        booking.setReview(review);

        return bookingRepository.save(booking);
    }

    // Get all bookings (for staff/admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get bookings by status
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}