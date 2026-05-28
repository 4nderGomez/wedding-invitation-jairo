package com.wedding.invitationjairo.model;

import com.wedding.invitationjairo.enums.AttendanceStatus;
import com.wedding.invitationjairo.enums.GuestSide;
import com.wedding.invitationjairo.enums.GuestType;
import com.wedding.invitationjairo.enums.AgeGroup;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;


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
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "guest_side", nullable = false)
    private GuestSide guestSide;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "attendance_status", nullable = false)
    private AttendanceStatus attendanceStatus;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "message_", columnDefinition = "TEXT")
    private String message;

    //Defaults
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "guest_type", nullable = false)
    private GuestType guestType = GuestType.PRINCIPAL;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "age_group", nullable = false)
    private AgeGroup ageGroup = AgeGroup.ADULT;

    //Fechas
    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //Relación con acompañantes
    @OneToMany(mappedBy = "guestGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuestCompanion> companions;

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

    //companions
    public List<GuestCompanion> getCompanions() {
        return companions;
    }

    public void setCompanions(List<GuestCompanion> companions) {
        this.companions = companions;
    }
}
