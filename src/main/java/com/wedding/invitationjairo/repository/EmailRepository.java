package com.wedding.invitationjairo.repository;

import com.wedding.invitationjairo.enums.EmailStatus;
import com.wedding.invitationjairo.model.EmailLog;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmailRepository extends JpaRepository<EmailLog, Long> {
    List<EmailLog> findByGuestGroupId(Long guestGroupId);

    List<EmailLog> findByStatus(EmailStatus status);

    void deleteByGuestGroupId(Long guestGroupId);
}
