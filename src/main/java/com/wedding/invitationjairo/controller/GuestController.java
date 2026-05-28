package com.wedding.invitationjairo.controller;

import com.wedding.invitationjairo.dto.request.GuestConfirmationRequest;
import com.wedding.invitationjairo.dto.response.GuestConfirmationResponse;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.service.GuestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<GuestConfirmationResponse> confirmGuestAttendance(
            @RequestBody GuestConfirmationRequest request
    ) {
        GuestGroup savedGuestGroup = guestService.confirmGuestAttendance(request);

        GuestConfirmationResponse response = new GuestConfirmationResponse(
                true,
                "Respuesta registrada correctamente.",
                savedGuestGroup.getId(),
                savedGuestGroup.getAttendanceStatus()
        );

        return ResponseEntity.ok(response);
    }
}