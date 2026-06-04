package com.wedding.invitationjairo.dto.request;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GuestConfirmationRequest {
    @NotBlank
    private String invitationCode;

    @NotNull
    private AttendanceStatus attendanceStatus;

    @NotBlank
    private String mainFirstName;

    @NotBlank
    private String mainLastName;

    @NotNull
    private GuestSide guestSide;

    private String phone;

    @Email
    private String email;

    private Boolean fromCity;

    private String message;

    private Integer adultCompanionsCount = 0;

    private Integer childCompanionsCount = 0;

    //Constructor
    public GuestConfirmationRequest() {

    }

    /* --- Getters and setters --- */
    //invitationCode
    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
    }

    //attendanceStatus
    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    //mainFirstName
    public String getMainFirstName() {
        return mainFirstName;
    }

    public void setMainFirstName(String mainFirstName) {
        this.mainFirstName = mainFirstName;
    }

    //mainLastName
    public String getMainLastName() {
        return mainLastName;
    }

    public void setMainLastName(String mainLastName) {
        this.mainLastName = mainLastName;
    }

    //guestSide
    public GuestSide getGuestSide() {
        return guestSide;
    }

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
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

    //fromCity
    public Boolean getFromCity() {
        return fromCity;
    }

    public void setFromCity(Boolean fromCity) {
        this.fromCity = fromCity;
    }

    //message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    //Acompañantes
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