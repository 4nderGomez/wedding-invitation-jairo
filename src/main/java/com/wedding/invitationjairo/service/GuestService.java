package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.request.GuestConfirmationRequest;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.repository.GuestGroupRepository;
import com.wedding.invitationjairo.util.GuestDataNormalizer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        validateGuestIsNotDuplicated(request);

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
            guestGroup.setAdultCompanionsCount(normalizeCompanionCount(request.getAdultCompanionsCount()));
            guestGroup.setChildCompanionsCount(normalizeCompanionCount(request.getChildCompanionsCount()));
        } else {
            guestGroup.setEmail(null);
            guestGroup.setAdultCompanionsCount(0);
            guestGroup.setChildCompanionsCount(0);
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

        if(request.getAttendanceStatus() == AttendanceStatus.ATTENDING) {
            validateCompanionsCount(request.getAdultCompanionsCount(), "adultos");
            validateCompanionsCount(request.getChildCompanionsCount(), "niños");
        }
    }

    private void validateCompanionsCount(Integer count, String label) {
        if(count == null) return;

        if(count < 0 || count > 20) {
            throw new IllegalArgumentException(
                "La cantidad de " + label + " debe estar entre 0 y 20"
            );
        }
    }

    private Integer normalizeCompanionCount(Integer count) {
        return count == null ? 0 : count;
    }

    private void sendConfirmationEmailIfNeeded(GuestGroup savedGuestGroup) {
        if(savedGuestGroup.getAttendanceStatus() != AttendanceStatus.ATTENDING)
            return;

        if(isBlank(savedGuestGroup.getEmail()))
            return;

        emailService.sendConfirmationEmail(savedGuestGroup);
    }

    private void validateGuestIsNotDuplicated(GuestConfirmationRequest request) {
        validateMainGuestIsNotDuplicated(request);
    }

    private void validateMainGuestIsNotDuplicated(GuestConfirmationRequest request) {
        String requestFullName = GuestDataNormalizer.normalizeFullName(
                request.getMainFirstName(),
                request.getMainLastName()
        );

        String requestEmail = GuestDataNormalizer.normalizeEmail(request.getEmail());
        String requestPhone = GuestDataNormalizer.normalizePhone(request.getPhone());

        List<GuestGroup> guestGroups = guestGroupRepository.findAll();

        for (GuestGroup registeredGuest : guestGroups) {
            String registeredFullName = GuestDataNormalizer.normalizeFullName(
                    registeredGuest.getMainFirstName(),
                    registeredGuest.getMainLastName()
            );

            String registeredEmail = GuestDataNormalizer.normalizeEmail(
                    registeredGuest.getEmail()
            );

            String registeredPhone = GuestDataNormalizer.normalizePhone(
                    registeredGuest.getPhone()
            );

            if (requestFullName != null && requestFullName.equals(registeredFullName)) {
                throwDuplicateGuestException();
            }

            if (requestEmail != null && requestEmail.equals(registeredEmail)) {
                throwDuplicateGuestException();
            }

            if (requestPhone != null && requestPhone.equals(registeredPhone)) {
                throwDuplicateGuestException();
            }
        }
    }

    private void throwDuplicateGuestException() {
        throw new IllegalArgumentException(
                "Ya existe un registro con estos datos. Si necesitas corregir tu respuesta, comunícate con los novios."
        );
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
