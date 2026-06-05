package com.wedding.invitationjairo.dto.response;

import com.wedding.invitationjairo.enums.AttendanceStatus;

public class GuestMessageResponse {
    private Long id;
    private String fullName;
    private String message;
    private AttendanceStatus attendanceStatus;

    public GuestMessageResponse() {

    }

    public GuestMessageResponse(
        Long id,
        String fullName,
        String message,
        AttendanceStatus attendanceStatus
    ) {
        this.id = id;
        this.fullName = fullName;
        this.message = message;
        this.attendanceStatus = attendanceStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }
}
