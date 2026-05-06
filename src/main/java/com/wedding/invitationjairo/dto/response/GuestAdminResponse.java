package com.wedding.invitationjairo.dto.response;

import com.wedding.invitationjairo.enums.AgeGroup;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.enums.GuestType;

import java.time.LocalDateTime;

public class GuestAdminResponse {
    private Long id;
    private String fullName;
    private GuestSide guestSide;
    private GuestType guestType;
    private String phone;
    private String email;
    private AgeGroup ageGroup;
    private AttendanceStatus attendanceStatus;
    private LocalDateTime registeredAt;

    //Constructor 1
    public GuestAdminResponse() {

    }

    //Constructor 2
    public GuestAdminResponse(
        Long id,
        String fullName,
        GuestSide guestSide,
        GuestType guestType,
        String phone,
        String email,
        AgeGroup ageGroup,
        AttendanceStatus attendanceStatus,
        LocalDateTime registeredAt
    ){
        this.id = id;
        this.fullName = fullName;
        this.guestSide = guestSide;
        this.guestType = guestType;
        this.phone = phone;
        this.email = email;
        this.ageGroup = ageGroup;
        this.attendanceStatus = attendanceStatus;
        this.registeredAt = registeredAt;
    }

    /* --- Guetters and setters */
    //id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    //fullName
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    //guestSide
    public GuestSide getGuestSide() {
        return guestSide;
    }

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
    }

    //guestType
    public GuestType getGuestType() {
        return guestType;
    }

    public void setGuestType(GuestType guestType) {
        this.guestType = guestType;
    }

    //phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    //email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    //ageGroup
    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(AgeGroup ageGroup) {
        this.ageGroup = ageGroup;
    }

    //attendanceStatus
    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    //registeredAt
    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}