package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.response.DashboardSummaryResponse;
import com.wedding.invitationjairo.dto.response.GuestAdminResponse;
import com.wedding.invitationjairo.dto.response.TodayRegistrationResponse;
import com.wedding.invitationjairo.enums.AgeGroup;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.exception.ResourceNotFoundException;
import com.wedding.invitationjairo.model.GuestCompanion;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.repository.GuestCompanionRepository;
import com.wedding.invitationjairo.repository.GuestGroupRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    private final GuestGroupRepository guestGroupRepository;
    private final GuestCompanionRepository guestCompanionRepository;

    public AdminService(
        GuestGroupRepository guestGroupRepository,
        GuestCompanionRepository guestCompanionRepository
    ) {
        this.guestGroupRepository = guestGroupRepository;
        this.guestCompanionRepository = guestCompanionRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {
        long principalGuests = guestGroupRepository.countByAttendanceStatus(AttendanceStatus.ATTENDING);
        long adultCompanions = guestCompanionRepository.countByAgeGroup(AgeGroup.ADULT);
        long childCompanions = guestCompanionRepository.countByAgeGroup(AgeGroup.CHILD);

        long totalAdults = principalGuests + adultCompanions;
        long totalChildren = childCompanions;
        long totalGuests = totalAdults + totalChildren;
        long totalConfirmations = guestGroupRepository.count();

        return new DashboardSummaryResponse(
            totalGuests,
            totalAdults,
            totalChildren,
            totalConfirmations
        );
    }

    public List<GuestAdminResponse> getAllGuestsForAdmin() {
        List<GuestGroup> guestGroups = guestGroupRepository.findAll();
        List<GuestAdminResponse> guests = new ArrayList<>();

        for(GuestGroup guestGroup : guestGroups) {
            guests.add(mapPrincipalGuestToAdminResponse(guestGroup));

            if(guestGroup.getCompanions() != null){
                for(GuestCompanion companion : guestGroup.getCompanions())
                    guests.add(mapCompanionToAdminResponse(guestGroup, companion));
            }
        }

        return guests;
    }

    public List<TodayRegistrationResponse> getTodayRegistrations() {
        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        List<GuestGroup> guestGroups = guestGroupRepository.findByRegisteredAtBetween(
                startOfDay,
                startOfNextDay
        );

        return guestGroups.stream()
                .map(this::mapToTodayRegistrationResponse)
                .toList();
    }

    public void deleteGuestGroup(Long guestGroupId) {
        GuestGroup guestGroup = guestGroupRepository.findById(guestGroupId)
            .orElseThrow(() -> new ResourceNotFoundException("Invitado no encontrado"));

            guestGroupRepository.delete(guestGroup);
    }

    private GuestAdminResponse mapPrincipalGuestToAdminResponse(GuestGroup guestGroup) {
        String fullName = guestGroup.getMainFirstName() + " " + guestGroup.getMainLastName();

        return new GuestAdminResponse(
                guestGroup.getId(),
                fullName,
                guestGroup.getGuestSide(),
                GuestType.PRINCIPAL,
                guestGroup.getPhone(),
                guestGroup.getEmail(),
                AgeGroup.ADULT,
                guestGroup.getAttendanceStatus(),
                guestGroup.getRegisteredAt()
        );
    }

    private GuestAdminResponse mapCompanionToAdminResponse(
        GuestGroup group,
        GuestCompanion companion
    ) {
        String fullName = companion.getFirstName() + " " + companion.getLastName();

        return new GuestAdminResponse(
            companion.getId(),
            fullName,
            group.getGuestSide(),
            GuestType.COMPANION,
            "-",
            "-",
            companion.getAgeGroup(),
            group.getAttendanceStatus(),
            group.getRegisteredAt()
        );
    }

    private TodayRegistrationResponse mapToTodayRegistrationResponse(GuestGroup guestGroup) {
        String fullName = guestGroup.getMainFirstName() + " " + guestGroup.getMainLastName();

        return new TodayRegistrationResponse(
            guestGroup.getId(),
            fullName,
            guestGroup.getGuestSide(),
            GuestType.PRINCIPAL,
            guestGroup.getPhone(),
            guestGroup.getEmail(),
            guestGroup.getAttendanceStatus(),
            guestGroup.getRegisteredAt()
        );
    }
}
