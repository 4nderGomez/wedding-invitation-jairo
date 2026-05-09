package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.request.GuestCompanionRequest;
import com.wedding.invitationjairo.dto.request.GuestConfirmationRequest;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.model.GuestCompanion;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.repository.GuestGroupRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class GuestService {

    private final GuestGroupRepository guestGroupRepository;
    private final InvitationLinkService invitationLinkService;
    private final AppSettingService appSettingService;
    private final EmailService emailService;

    public GuestService(
            GuestGroupRepository guestGroupRepository,
            InvitationLinkService invitationLinkService,
            AppSettingService appSettingService,
            EmailService emailService
    ) {
        this.guestGroupRepository = guestGroupRepository;
        this.invitationLinkService = invitationLinkService;
        this.appSettingService = appSettingService;
        this.emailService = emailService;
    }

    @Transactional
    public GuestGroup confirmGuestAttendance(GuestConfirmationRequest request) {
        validateRegistrationIsEnabled();

        InvitationLink invitationLink = invitationLinkService.getActiveLinkByCode(request.getInvitationCode());

        GuestGroup guestGroup = new GuestGroup();
        guestGroup.setInvitationLink(invitationLink);
        guestGroup.setMainFirstName(request.getMainFirstName());
        guestGroup.setMainLastName(request.getMainLastName());
        guestGroup.setGuestSide(request.getGuestSide());
        guestGroup.setAttendanceStatus(request.getAttendanceStatus());
        guestGroup.setPhone(request.getPhone());
        guestGroup.setEmail(request.getEmail());
        guestGroup.setMessage(request.getMessage());

        if (request.getAttendanceStatus() == AttendanceStatus.ATTENDING) {
            guestGroup.setCompanions(buildCompanions(request.getCompanions(), guestGroup));
        } else {
            guestGroup.setCompanions(new ArrayList<>());
        }

        GuestGroup savedGuestGroup = guestGroupRepository.save(guestGroup);

        if(savedGuestGroup.getAttendanceStatus() == AttendanceStatus.ATTENDING
            && savedGuestGroup.getEmail() != null
            && !savedGuestGroup.getEmail().isBlank()) 
            emailService.sendConfirmationEmail(savedGuestGroup);

        return savedGuestGroup;
    }

    private void validateRegistrationIsEnabled() {
        boolean registrationEnabled = appSettingService.getBooleanSetting("registration_enabled");

        if (!registrationEnabled) {
            throw new IllegalStateException("El registro de invitados está cerrado");
        }
    }

    private List<GuestCompanion> buildCompanions(
            List<GuestCompanionRequest> companionRequests,
            GuestGroup guestGroup
    ) {
        List<GuestCompanion> companions = new ArrayList<>();

        if (companionRequests == null || companionRequests.isEmpty()) {
            return companions;
        }

        for (GuestCompanionRequest companionRequest : companionRequests) {
            GuestCompanion companion = new GuestCompanion();
            companion.setGuestGroup(guestGroup);
            companion.setFirstName(companionRequest.getFirstName());
            companion.setLastName(companionRequest.getLastName());
            companion.setAgeGroup(companionRequest.getAgeGroup());
            companion.setGuestType(GuestType.COMPANION);

            companions.add(companion);
        }

        return companions;
    }
}
