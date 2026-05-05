package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.model.InvitationLink;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface InvitationLinkRepository extends JpaRepository<InvitationLink, Long>{
    Optional<InvitationLink> findByCode(String code);

    Optional<InvitationLink> findByCodeAndActiveTrue(String code);
}
