package com.wedding.invitationjairo.dto.response;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;

import java.time.LocalDateTime;

public class TodayRegistrationResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private GuestSide guestSide;
    private String phone;
    private String email;
    private Integer adultCompanionsCount;
    private Integer childCompanionsCount;
    private AttendanceStatus attendanceStatus;
    private LocalDateTime registeredAt;

    public TodayRegistrationResponse() {
        
    }

    public TodayRegistrationResponse(
            Long id,
            String firstName,
            String lastName,
            GuestSide guestSide,
            String phone,
            String email,
            Integer adultCompanionsCount,
            Integer childCompanionsCount,
            AttendanceStatus attendanceStatus,
            LocalDateTime registeredAt
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.guestSide = guestSide;
        this.phone = phone;
        this.email = email;
        this.adultCompanionsCount = adultCompanionsCount;
        this.childCompanionsCount = childCompanionsCount;
        this.attendanceStatus = attendanceStatus;
        this.registeredAt = registeredAt;
    }

    public Long getId() {
        return id;
    }

    public GuestSide getGuestSide() {
        return guestSide;
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

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getAdultCompanionsCount() {
        return adultCompanionsCount;
    }

    public void setAdultCompanionsCount(Integer adultCompanionsCount) {
        this.adultCompanionsCount = adultCompanionsCount;
    }

    public Integer getChildCompanionsCount() {
        return childCompanionsCount;
    }

    public void setChildCompanionsCount(Integer childCompanionsCount) {
        this.childCompanionsCount = childCompanionsCount;
    }
}