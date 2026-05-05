package com.wedding.invitationjairo.dto.request;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

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

    @Valid
    private List<GuestCompanionRequest> companions = new ArrayList<>();

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

    //
}