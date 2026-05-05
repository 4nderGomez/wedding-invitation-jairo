package com.wedding.invitationjairo.model;

import com.wedding.invitationjairo.enums.AgeGroup;
import com.wedding.invitationjairo.enums.GuestType;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "guest_companions")
public class GuestCompanion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Relación con guest_group
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_group_id", nullable = false)
    private GuestGroup guestGroup;

    //Datos del acompañante
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 150)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_group", nullable = false)
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "guest_type", nullable = false)
    private GuestType guestType = GuestType.COMPANION;

    //Fecha de registro
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    //Constructor
    public GuestCompanion(){

    }

    /* --- Getter and setters --- */
    //id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    //guest_group_id
    public GuestGroup getGuestGroup() {
        return guestGroup;
    }

    public void setGuestGroup(GuestGroup guestGroup) {
        this.guestGroup = guestGroup;
    }

    //firstName
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    //lastName
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    //ageGroup
    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(AgeGroup ageGroup) {
        this.ageGroup = ageGroup;
    }

    //guestType
    public GuestType getGuestType() {
        return guestType;
    }

    public void setGuestType(GuestType guestType) {
        this.guestType = guestType;
    }

    //createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
