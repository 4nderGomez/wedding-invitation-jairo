package com.wedding.invitationjairo.model;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.enums.AgeGroup;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guest_groups")
public class GuestGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Relación con -> invitation_links
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_link_id", nullable = false)
    private InvitationLink invitationLink;

    //Datos principales
    @Column(name = "main_first_name", nullable = false, length = 100)
    private String mainFirstName;

    @Column(name = "main_last_name", nullable = false, length = 150)
    private String mainLastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "guest_side", nullable = false)
    private GuestSide guestSide;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    private AttendanceStatus attendanceStatus;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "message_", columnDefinition = "TEXT")
    private String message;

    //Número de acompañantes: adultos y niños
    @Column(name = "adult_companions_count", nullable = false)
    private Integer adultCompanionsCount = 0;

    @Column(name = "child_companions_count", nullable = false)
    private Integer childCompanionsCount = 0;

    //Defaults
    @Enumerated(EnumType.STRING)
    @Column(name = "guest_type", nullable = false)
    private GuestType guestType = GuestType.PRINCIPAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_group", nullable = false)
    private AgeGroup ageGroup = AgeGroup.ADULT;

    //Fechas
    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //Constructor
    public GuestGroup(){

    }

    /* --- Getter and setters --- */
    //Id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    //invitationLink
    public InvitationLink getInvitationLink() {
        return invitationLink;
    }

    public void setInvitationLink(InvitationLink invitationLink) {
        this.invitationLink = invitationLink;
    }

    //firstName
    public String getMainFirstName() {
        return mainFirstName;
    }

    public void setMainFirstName(String mainFirstName) {
        this.mainFirstName = mainFirstName;
    }

    //lastName
    public String getMainLastName() {
        return mainLastName;
    }

    public void setMainLastName(String mainLastName) {
        this.mainLastName = mainLastName;
    }

    //guestSide
    public GuestSide getGuestSide() {
        return guestSide;
    }

    public void setGuestSide(GuestSide guestSide) {
        this.guestSide = guestSide;
    }

    //attendanceStatus
    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    //phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    //email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    //message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    //Acompañantes
    public Integer getAdultCompanionsCount() {
        return adultCompanionsCount;
    }

    public void setAdultCompanionsCount(Integer adultCompanionsCount) {
        this.adultCompanionsCount = adultCompanionsCount;
    }

    public Integer getChildCompanionsCount() {
        return childCompanionsCount;
    }

    public void setChildCompanionsCount(Integer childCompanionsCount) {
        this.childCompanionsCount = childCompanionsCount;
    }

    //guestType
    public GuestType getGuestType() {
        return guestType;
    }

    public void setGuestType(GuestType guestType) {
        this.guestType = guestType;
    }

    //ageGroup
    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(AgeGroup ageGroup) {
        this.ageGroup = ageGroup;
    }

    //registeredAt
    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    //updatedAt
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getTotalGuestsCount() {
        return 1 + adultCompanionsCount + childCompanionsCount;
    }

    public Integer getTotalAdultsCount() {
        return 1 +  adultCompanionsCount;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
