package com.wedding.invitationjairo.controller;

import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.service.InvitationLinkService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.Duration;

@Controller
public class PublicController {
    private static final String INVITATION_COOKIE = "jj_invitation";
    private static final String BRIDE_INVITATION_CODE = "familia-novia";
    private static final String GROOM_INVITATION_CODE = "familia-novio";
    /*
     * Este valor únicamente indica que el invitado
     * entró por el dominio general.
     */
    private static final String GENERAL_INVITATION_CODE =
        "general";
    private final InvitationLinkService invitationLinkService;


    public PublicController(InvitationLinkService invitationLinkService) {
        this.invitationLinkService = invitationLinkService;
    }


    /*
     * =========================================================
     * ENTRADA PRINCIPAL
     * =========================================================
     *
     * https://jairoyjennifer.com
     */
    @GetMapping("/")
    public String showMainInvitation(
        @CookieValue(
            name = INVITATION_COOKIE,
            required = false
        )
        String invitationCode,

        Model model
    ) {

        /*
         * Si ya existe una cookie válida,
         * conservamos la procedencia.
         */
        if (
            BRIDE_INVITATION_CODE.equals(invitationCode)
            ||
            GROOM_INVITATION_CODE.equals(invitationCode)
        ) {

            InvitationLink invitationLink =
                invitationLinkService
                    .getActiveLinkByCode(
                        invitationCode
                    );

            model.addAttribute(
                "invitationCode",
                invitationLink.getCode()
            );

            model.addAttribute(
                "guestSide",
                invitationLink.getGuestSide()
            );

            model.addAttribute(
                "groupName",
                invitationLink.getGroupName()
            );

            return "public/invitation";
        }


        /*
         * Si es la primera vez y entró directamente
         * por jairoyjennifer.com, no asumimos
         * NOVIO ni NOVIA.
         *
         * El invitado lo indicará en el RSVP.
         */
        model.addAttribute(
            "invitationCode",
            GENERAL_INVITATION_CODE
        );

        model.addAttribute(
            "guestSide",
            null
        );

        model.addAttribute(
            "groupName",
            "Invitación"
        );

        return "public/invitation";
    }


    /*
     * =========================================================
     * LINK DE LA NOVIA
     * =========================================================
     */
    @GetMapping("/invitacion-novia")
    public String brideInvitation(
        HttpServletResponse response
    ) {

        saveInvitationCookie(
            response,
            BRIDE_INVITATION_CODE
        );

        return "redirect:/";
    }

    @GetMapping("/invitacion-novio")
    public String groomInvitation(
        HttpServletResponse response
    ) {

        saveInvitationCookie(
            response,
            GROOM_INVITATION_CODE
        );

        return "redirect:/";
    }

    private void saveInvitationCookie(
        HttpServletResponse response,
        String invitationCode
    ) {

        ResponseCookie cookie =
            ResponseCookie
                .from(
                    INVITATION_COOKIE,
                    invitationCode
                )
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(
                    Duration.ofDays(365)
                )
                .build();

        response.addHeader(
            HttpHeaders.SET_COOKIE,
            cookie.toString()
        );
    }
}