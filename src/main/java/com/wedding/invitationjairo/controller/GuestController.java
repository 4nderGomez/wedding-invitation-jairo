package com.wedding.invitationjairo.controller;

import com.wedding.invitationjairo.dto.request.GuestConfirmationRequest;
import com.wedding.invitationjairo.dto.response.ApiResponse;
import com.wedding.invitationjairo.service.GuestService;

import jakarta.validation.Valid;

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
    public ResponseEntity<ApiResponse> confirmAttendance(
        @Valid
        @RequestBody
        GuestConfirmationRequest request
    ) {
        guestService.confirmGuestAttendance(request);

        return ResponseEntity.ok(
            ApiResponse.ok("Confirmación registrada correctamente")
        );
    }
}