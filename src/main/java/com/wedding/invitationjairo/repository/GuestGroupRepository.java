package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.model.GuestGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface GuestGroupRepository extends JpaRepository<GuestGroup, Long>{
    long countByAttendanceStatus(AttendanceStatus attendanceStatus);

    @Query("""
        SELECT COALESCE(SUM(1 + g.adultCompanionsCount + g.childCompanionsCount), 0)
        FROM GuestGroup g
        WHERE g.attendanceStatus = com.wedding.invitationjairo.enums.AttendanceStatus.ATTENDING
    """)
    long countTotalGuestsAttending();

    @Query("""
        SELECT COALESCE(SUM(1 + g.adultCompanionsCount), 0)
        FROM GuestGroup g
        WHERE g.attendanceStatus = com.wedding.invitationjairo.enums.AttendanceStatus.ATTENDING
    """)
    long countTotalAdultsAttending();

    @Query("""
        SELECT COALESCE(SUM(g.childCompanionsCount), 0)
        FROM GuestGroup g
        WHERE g.attendanceStatus = com.wedding.invitationjairo.enums.AttendanceStatus.ATTENDING
    """)
    long countTotalChildrenAttending();

    List<GuestGroup> findByGuestSide(GuestSide guestSide);

    List<GuestGroup> findByAttendanceStatus(AttendanceStatus attendanceStatus);

    List<GuestGroup> findByRegisteredAtBetween(LocalDateTime start, LocalDateTime end);

    long countByGuestSide(GuestSide guestSide);
}
