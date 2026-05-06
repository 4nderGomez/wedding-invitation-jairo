package com.wedding.invitationjairo.dto.response;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.enums.GuestType;

import java.time.LocalDateTime;

public class TodayRegistrationResponse {
    private Long id;
    private String fullName;
    private GuestSide guestSide;
    private GuestType guestType;
    private String phone;
    private String email;
    private AttendanceStatus attendanceStatus;
    private LocalDateTime registeredAt;

    public TodayRegistrationResponse() {
        
    }

    public TodayRegistrationResponse(
            Long id,
            String fullName,
            GuestSide guestSide,
            GuestType guestType,
            String phone,
            String email,
            AttendanceStatus attendanceStatus,
            LocalDateTime registeredAt
    ) {
        this.id = id;
        this.fullName = fullName;
        this.guestSide = guestSide;
        this.guestType = guestType;
        this.phone = phone;
        this.email = email;
        this.attendanceStatus = attendanceStatus;
        this.registeredAt = registeredAt;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public GuestSide getGuestSide() {
        return guestSide;
    }

    public GuestType getGuestType() {
        return guestType;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
    }

    public void setGuestType(GuestType guestType) {
        this.guestType = guestType;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}