package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.response.DashboardSummaryResponse;
import com.wedding.invitationjairo.dto.response.GuestAdminResponse;
import com.wedding.invitationjairo.dto.response.TodayRegistrationResponse;
import com.wedding.invitationjairo.enums.AgeGroup;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.exception.ResourceNotFoundException;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.repository.GuestGroupRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
    private final GuestGroupRepository guestGroupRepository;

    public AdminService(GuestGroupRepository guestGroupRepository) {
        this.guestGroupRepository = guestGroupRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {
        List<GuestGroup> guestGroups = guestGroupRepository.findAll();

        long principalGuests = guestGroups.stream()
                .filter(group -> group.getAttendanceStatus() == AttendanceStatus.ATTENDING)
                .count();

        long adultCompanions = guestGroups.stream()
                .filter(group -> group.getAttendanceStatus() == AttendanceStatus.ATTENDING)
                .mapToLong(group -> safeCount(group.getAdultCompanionsCount()))
                .sum();

        long childCompanions = guestGroups.stream()
                .filter(group -> group.getAttendanceStatus() == AttendanceStatus.ATTENDING)
                .mapToLong(group -> safeCount(group.getChildCompanionsCount()))
                .sum();

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
        return guestGroupRepository.findAll()
                .stream()
                .map(this::mapPrincipalGuestToAdminResponse)
                .toList();
    }

    public List<TodayRegistrationResponse> getTodayRegistrations() {
        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        return guestGroupRepository.findByRegisteredAtBetween(startOfDay, startOfNextDay)
                .stream()
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

    private long safeCount(Integer value) {
        return value == null ? 0 : value;
    }
}
