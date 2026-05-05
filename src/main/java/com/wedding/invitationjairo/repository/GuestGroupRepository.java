package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.model.GuestGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface GuestGroupRepository extends JpaRepository<GuestGroup, Long>{
    List<GuestGroup> findByGuestSide(GuestSide guestSide);

    List<GuestGroup> findByAttendanceStatus(AttendanceStatus attendanceStatus);

    List<GuestGroup> findByRegisteredAtBetween(LocalDateTime start, LocalDateTime end);

    long countByAttendanceStatus(AttendanceStatus attendanceStatus);

    long countByGuestSide(GuestSide guestSide);
}
