package com.wedding.invitationjairo.model;

import com.wedding.invitationjairo.enums.EmailStatus;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
public class EmailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Relación con guest_group
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_group_id", nullable = false)
    private GuestGroup guestGroup;

    //Datos del correo
    @Column(name = "recipient_email", nullable = false, length = 150)
    private String recipientEmail;

    @Column(name = "subject", nullable = false, length = 200)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EmailStatus status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    //Constructor
    public EmailLog() {

    }

    /* --- Getter and Setters --- */
    //id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        
        this.id = id;
    }

    //guestGroup
    public GuestGroup getGuestGroup() {
        return guestGroup;
    }

    public void setGuestGroup(GuestGroup guestGroup) {
        this.guestGroup = guestGroup;
    }

    //recipientEmail
    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    //subject
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    //status
    public EmailStatus getStatus() {
        return status;
    }

    public void setStatus(EmailStatus status) {
        this.status = status;
    }

    //errorMessage
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    //sentAt
    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
