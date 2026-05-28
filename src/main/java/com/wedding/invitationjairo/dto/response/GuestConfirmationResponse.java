package com.wedding.invitationjairo.dto.response;

import com.wedding.invitationjairo.enums.AttendanceStatus;

public class GuestConfirmationResponse {
    private boolean success;
    private String message;
    private Long guestGroupId;
    private AttendanceStatus attendanceStatus;

    public GuestConfirmationResponse(){

    }

    public GuestConfirmationResponse(
        boolean succes,
        String message,
        Long guestGroupId,
        AttendanceStatus attendanceStatus
    ) {
        this.success = success;
        this.message = message;
        this.guestGroupId = guestGroupId;
        this.attendanceStatus = attendanceStatus;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean succes) {
        this.success = succes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getGuestGroupId() {
        return guestGroupId;
    }

    public void setGuestGroupId(Long guestGroupId) {
        this.guestGroupId = guestGroupId;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
