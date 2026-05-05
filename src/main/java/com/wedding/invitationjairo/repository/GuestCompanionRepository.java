package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.enums.AgeGroup;
import com.wedding.invitationjairo.model.GuestCompanion;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestCompanionRepository extends JpaRepository<GuestCompanion, Long>{
    long countByAgeGroup(AgeGroup ageGroup);

    long countByGuestGroupId(Long guestGroupId);
}
