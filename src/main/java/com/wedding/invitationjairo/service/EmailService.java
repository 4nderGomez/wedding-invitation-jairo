package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.enums.EmailStatus;
import com.wedding.invitationjairo.model.EmailLog;
import com.wedding.invitationjairo.model.GuestGroup;
import com.wedding.invitationjairo.repository.EmailRepository;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final EmailRepository emailRepository;

    public EmailService(EmailRepository emailRepository) {
        this.emailRepository = emailRepository;
    }

    public void sendConfirmationEmail(GuestGroup guestGroup) {
        try {
            /*
             * Aquí irá más adelante la lógica real para:
             * 1. Generar el PDF.
             * 2. Adjuntar el PDF.
             * 3. Enviar el correo.
             */

            saveEmailLog(
                    guestGroup,
                    EmailStatus.SENT,
                    null
            );

        } catch (Exception exception) {
            saveEmailLog(
                    guestGroup,
                    EmailStatus.FAILED,
                    exception.getMessage()
            );
        }
    }

    private void saveEmailLog(
            GuestGroup guestGroup,
            EmailStatus status,
            String errorMessage
    ) {
        EmailLog emailLog = new EmailLog();

        emailLog.setGuestGroup(guestGroup);
        emailLog.setRecipientEmail(guestGroup.getEmail());
        emailLog.setSubject("Confirmación de asistencia | Jairo & Jennifer");
        emailLog.setStatus(status);
        emailLog.setErrorMessage(errorMessage);

        emailRepository.save(emailLog);
    }
}
