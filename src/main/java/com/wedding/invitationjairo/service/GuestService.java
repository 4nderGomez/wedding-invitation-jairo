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
        validateRequiredRequestData(request);

        InvitationLink invitationLink = invitationLinkService.getActiveLinkByCode(cleanText(request.getInvitationCode()));

        GuestGroup guestGroup = new GuestGroup();

        guestGroup.setInvitationLink(invitationLink);
        guestGroup.setMainFirstName(cleanText(request.getMainFirstName()));
        guestGroup.setMainLastName(cleanText(request.getMainLastName()));
        guestGroup.setGuestSide(request.getGuestSide());
        guestGroup.setAttendanceStatus(request.getAttendanceStatus());
        guestGroup.setPhone(cleanText(request.getPhone()));
        guestGroup.setMessage(cleanText(request.getMessage()));

        if (request.getAttendanceStatus() == AttendanceStatus.ATTENDING) {
            guestGroup.setEmail(cleanText(request.getEmail()));
            guestGroup.setCompanions(buildCompanions(request.getCompanions(), guestGroup));
        } else {
            guestGroup.setEmail(null);
            guestGroup.setCompanions(new ArrayList<>());
        }

        GuestGroup savedGuestGroup = guestGroupRepository.save(guestGroup);

        sendConfirmationEmailIfNeeded(savedGuestGroup);

        return savedGuestGroup;
    }

    private void validateRegistrationIsEnabled() {
        boolean registrationEnabled = appSettingService.getBooleanSetting("registration_enabled");

        if (!registrationEnabled) {
            throw new IllegalStateException("El registro de invitados está cerrado");
        }
    }

    private void validateRequiredRequestData(GuestConfirmationRequest request) {
        if(request == null)
            throw new IllegalArgumentException("La solicitud de confirmación no puede estar vacía");

        if(isBlank(request.getInvitationCode()))
            throw new IllegalArgumentException("El código de invitación es obligatorio");

        if(request.getAttendanceStatus() == null)
            throw new IllegalArgumentException("El estado de asistencia es obligatorio");

        if(isBlank(request.getMainFirstName()))
            throw new IllegalArgumentException(("El nombre del invitado principal es obligatorio"));

        if(isBlank(request.getMainLastName()))
            throw new IllegalArgumentException(("Los apellidos del invitado principal son obligatorios"));

        if(request.getGuestSide() == null)
            throw new IllegalArgumentException("Debes indicar de parte de quién viene el invitado");

        if(request.getAttendanceStatus() == AttendanceStatus.ATTENDING && request.getCompanions() != null)
            validateCompanions(request.getCompanions());
    }

    private void validateCompanions(List<GuestCompanionRequest> companions){
        for(GuestCompanionRequest companion : companions) {
            if(companion == null)
                throw new IllegalArgumentException("Hay un compañero vacío");

            if(isBlank(companion.getFirstName()))
                throw new IllegalArgumentException("El nombre del acompañante es obligatorio");

            if(isBlank(companion.getLastName()))
                throw new IllegalArgumentException("Los apellidos del acompañante son obligatorios");

            if(companion.getAgeGroup() == null)
                throw new IllegalArgumentException("La edad del acompañante es obligatoria");
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
            companion.setFirstName(cleanText(companionRequest.getFirstName()));
            companion.setLastName(cleanText(companionRequest.getLastName()));
            companion.setAgeGroup(companionRequest.getAgeGroup());
            companion.setGuestType(GuestType.COMPANION);

            companions.add(companion);
        }

        return companions;
    }

    private void sendConfirmationEmailIfNeeded(GuestGroup savedGuestGroup) {
        if(savedGuestGroup.getAttendanceStatus() != AttendanceStatus.ATTENDING)
            return;

        if(isBlank(savedGuestGroup.getEmail()))
            return;

        emailService.sendConfirmationEmail(savedGuestGroup);
    }

    private String cleanText(String value) {
        if(value == null)
            return null;

        String cleanedValue = value.trim();
        
        return cleanedValue.isEmpty() ? null : cleanedValue;
    }

    private boolean isBlank(String value){
        return value == null || value.trim().isEmpty();
    }
}
