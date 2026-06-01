package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.request.GuestCompanionRequest;
import com.wedding.invitationjairo.dto.request.GuestConfirmationRequest;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.model.GuestCompanion;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.repository.GuestCompanionRepository;
import com.wedding.invitationjairo.repository.GuestGroupRepository;
import com.wedding.invitationjairo.util.GuestDataNormalizer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GuestService {

    private final GuestGroupRepository guestGroupRepository;
    private final GuestCompanionRepository guestCompanionRepository;
    private final InvitationLinkService invitationLinkService;
    private final AppSettingService appSettingService;
    private final EmailService emailService;

    public GuestService(
            GuestGroupRepository guestGroupRepository,
            GuestCompanionRepository guestCompanionRepository,
            InvitationLinkService invitationLinkService,
            AppSettingService appSettingService,
            EmailService emailService
    ) {
        this.guestGroupRepository = guestGroupRepository;
        this.guestCompanionRepository = guestCompanionRepository;
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

    private void validateGuestIsNotDuplicated(GuestConfirmationRequest request) {
        validateMainGuestIsNotDuplicated(request);
        validateCompanionsAreNotDuplicated(request);
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

        List<GuestCompanion> companions = guestCompanionRepository.findAll();

        for (GuestCompanion registeredCompanion : companions) {
            String registeredCompanionFullName = GuestDataNormalizer.normalizeFullName(
                    registeredCompanion.getFirstName(),
                    registeredCompanion.getLastName()
            );

            if (requestFullName != null && requestFullName.equals(registeredCompanionFullName)) {
                throwDuplicateGuestException();
            }
        }
    }

    private void validateCompanionsAreNotDuplicated(GuestConfirmationRequest request) {
        if (request.getCompanions() == null || request.getCompanions().isEmpty()) {
            return;
        }

        Set<String> namesInCurrentRequest = new HashSet<>();

        String mainGuestFullName = GuestDataNormalizer.normalizeFullName(
                request.getMainFirstName(),
                request.getMainLastName()
        );

        if (mainGuestFullName != null) {
            namesInCurrentRequest.add(mainGuestFullName);
        }

        List<GuestGroup> guestGroups = guestGroupRepository.findAll();
        List<GuestCompanion> registeredCompanions = guestCompanionRepository.findAll();

        for (GuestCompanionRequest companionRequest : request.getCompanions()) {
            String companionFullName = GuestDataNormalizer.normalizeFullName(
                    companionRequest.getFirstName(),
                    companionRequest.getLastName()
            );

            if (companionFullName == null) {
                continue;
            }

            if (namesInCurrentRequest.contains(companionFullName)) {
                throwDuplicateGuestException();
            }

            for (GuestGroup registeredGuest : guestGroups) {
                String registeredGuestFullName = GuestDataNormalizer.normalizeFullName(
                        registeredGuest.getMainFirstName(),
                        registeredGuest.getMainLastName()
                );

                if (companionFullName.equals(registeredGuestFullName)) {
                    throwDuplicateGuestException();
                }
            }

            for (GuestCompanion registeredCompanion : registeredCompanions) {
                String registeredCompanionFullName = GuestDataNormalizer.normalizeFullName(
                        registeredCompanion.getFirstName(),
                        registeredCompanion.getLastName()
                );

                if (companionFullName.equals(registeredCompanionFullName)) {
                    throwDuplicateGuestException();
                }
            }

            namesInCurrentRequest.add(companionFullName);
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
