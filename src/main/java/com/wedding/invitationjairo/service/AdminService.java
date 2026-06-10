package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.dto.response.DashboardSummaryResponse;
import com.wedding.invitationjairo.repository.EmailRepository;
import com.wedding.invitationjairo.dto.response.GuestAdminResponse;
import com.wedding.invitationjairo.dto.response.TodayRegistrationResponse;
import com.wedding.invitationjairo.dto.response.GuestMessageResponse;
import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.exception.ResourceNotFoundException;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.repository.GuestGroupRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
        private final GuestGroupRepository guestGroupRepository;
        private final EmailRepository emailRepository;

        public AdminService(
                GuestGroupRepository guestGroupRepository,
                EmailRepository emailRepository
        ) {
        this.guestGroupRepository = guestGroupRepository;
        this.emailRepository = emailRepository;
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

                long totalConfirmations = guestGroups.stream()
                        .filter(group -> group.getAttendanceStatus() == AttendanceStatus.ATTENDING)
                        .count();

                long totalDeclines = guestGroups.stream()
                        .filter(group -> group.getAttendanceStatus() == AttendanceStatus.NOT_ATTENDING)
                        .count();
                
                long totalAdults = principalGuests + adultCompanions;
                long totalChildren = childCompanions;
                long totalGuests = totalAdults + totalChildren; 

                return new DashboardSummaryResponse(
                        totalGuests,
                        totalAdults,
                        totalChildren,
                        totalConfirmations,
                        totalDeclines
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

        @Transactional
        public void deleteGuestGroup(Long guestGroupId) {
                GuestGroup guestGroup = guestGroupRepository.findById(guestGroupId)
                        .orElseThrow(() -> new ResourceNotFoundException("Invitado no encontrado"));

                emailRepository.deleteByGuestGroupId(guestGroupId);

                guestGroupRepository.delete(guestGroup);
        }

        private GuestAdminResponse mapPrincipalGuestToAdminResponse(GuestGroup guestGroup) {
                return new GuestAdminResponse(
                        guestGroup.getId(),
                        guestGroup.getMainFirstName(),
                        guestGroup.getMainLastName(),
                        guestGroup.getGuestSide(),
                        guestGroup.getPhone(),
                        guestGroup.getEmail(),
                        safeCount(guestGroup.getAdultCompanionsCount()),
                        safeCount(guestGroup.getChildCompanionsCount()),
                        guestGroup.getAttendanceStatus(),
                        guestGroup.getRegisteredAt()
                );
        }

        private TodayRegistrationResponse mapToTodayRegistrationResponse(GuestGroup guestGroup) {
                return new TodayRegistrationResponse(
                        guestGroup.getId(),
                        guestGroup.getMainFirstName(),
                        guestGroup.getMainLastName(),
                        guestGroup.getGuestSide(),
                        guestGroup.getPhone(),
                        guestGroup.getEmail(),
                        guestGroup.getAdultCompanionsCount(),
                        guestGroup.getChildCompanionsCount(),
                        guestGroup.getAttendanceStatus(),
                        guestGroup.getRegisteredAt()
                );
        }

        private Integer safeCount(Integer value) {
                return value == null ? 0 : value;
        }

        public List<GuestMessageResponse> getGuestMessages() {
                return guestGroupRepository.findAll()
                        .stream()
                        .filter(group -> group.getMessage()!= null)
                        .filter(group -> !group.getMessage().isBlank())
                        .map(this::mapToGuestMessageResponse)
                        .toList();
        }

        private GuestMessageResponse mapToGuestMessageResponse(GuestGroup guestGroup) {
                String fullName = guestGroup.getMainFirstName() + " " + guestGroup.getMainLastName();

                return new GuestMessageResponse(
                        guestGroup.getId(),
                        fullName,
                        guestGroup.getMessage(),
                        guestGroup.getAttendanceStatus()
                );
        }
}
