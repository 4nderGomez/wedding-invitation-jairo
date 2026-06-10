package com.wedding.invitationjairo.model;

import com.wedding.invitationjairo.enums.GuestSide;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitation_links")
public class InvitationLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "group_name", nullable = false, length = 150)
    private String groupName;

    @Enumerated(EnumType.STRING)
    @Column(name = "guest_side", nullable = false)
    private GuestSide guestSide;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //Constructor
    public InvitationLink(){
        
    }

    /* --- Getter and setters --- */
    //id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    //Code
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    //groupName
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    //guestSide
    public GuestSide getGuestSide() {
        return guestSide;
    }

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
    }

    //active
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    //createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    //updatedAt
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
