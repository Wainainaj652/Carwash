package com.carwash.repository;

import com.carwash.model.Booking;
import com.carwash.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by customer - KEEP THIS
    List<Booking> findByCustomer(User customer);

    // REMOVE OR FIX THIS LINE - Booking doesn't have userId field
    // List<Booking> findByUserId(Long userId);  // REMOVE THIS

    // Find bookings by assigned staff
    List<Booking> findByAssignedStaff(User staff);

    // Find bookings by status
    List<Booking> findByStatus(Booking.BookingStatus status);

    // Find bookings between dates (for scheduling)
    List<Booking> findByBookingDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find bookings for a specific date
    List<Booking> findByBookingDateTimeAfterAndBookingDateTimeBefore(
            LocalDateTime startOfDay, LocalDateTime endOfDay);

    Long countByStatus(Booking.BookingStatus status);

    @Query("SELECT SUM(s.price) FROM Booking b JOIN b.service s WHERE b.status = 'COMPLETED'")
    Double findTotalRevenue();

    @Query("SELECT SUM(s.price) FROM Booking b JOIN b.service s WHERE b.status = 'COMPLETED' AND b.bookingDateTime BETWEEN :start AND :end")
    Double findRevenueBetweenDates(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}