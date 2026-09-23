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
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Duration;

@Controller
public class PublicController {
    private static final String INVITATION_COOKIE = "jj_invitation";
    private static final String BRIDE_INVITATION_CODE = "familia-novia";
    private static final String GROOM_INVITATION_CODE = "familia-novio";
    private final InvitationLinkService invitationLinkService;

    public PublicController(InvitationLinkService invitationLinkService) {
        this.invitationLinkService = invitationLinkService;
    }

    @GetMapping("/")
    public String showMainInvitation(@CookieValue(name = INVITATION_COOKIE, required = false)
        String invitationCode,
        Model model) {
        String resolvedInvitationCode = resolveInvitationCode(invitationCode);

        return renderInvitation(
            resolvedInvitationCode,
            model
        );
    }

    @GetMapping("/invitacion-novia")
    public String brideInvitation(HttpServletResponse response) {
        saveInvitationCookie(response, BRIDE_INVITATION_CODE);

        return "redirect:/";
    }

    @GetMapping("/invitacion-novio")
    public String groomInvitation(HttpServletResponse response) {
        saveInvitationCookie(response, GROOM_INVITATION_CODE);

        return "redirect:/";
    }


    /*
     * =========================================================
     * ENLACES ANTIGUOS
     * =========================================================
     *
     * Conservamos /i/{code} para no romper enlaces anteriores.
     *
     * Ejemplo:
     *
     * /i/familia-novia
     *
     * terminará automáticamente en:
     *
     * /
     */
    @GetMapping("/i/{code}")
    public String legacyInvitation(@PathVariable String code, HttpServletResponse response) {
        invitationLinkService.getActiveLinkByCode(code);

        saveInvitationCookie(
            response,
            code
        );

        return "redirect:/";
    }

    private String renderInvitation(String invitationCode, Model model) {
        InvitationLink invitationLink = invitationLinkService.getActiveLinkByCode(invitationCode);

        model.addAttribute("invitationCode", invitationLink.getCode());
        model.addAttribute("guestSide", invitationLink.getGuestSide());
        model.addAttribute("groupName", invitationLink.getGroupName());

        return "public/invitation";
    }

    /*
     * =========================================================
     * RESOLVER CÓDIGO
     * =========================================================
     *
     * Si alguien entra directamente a:
     *
     * jairoyjennifer.com
     *
     * sin haber pasado antes por alguno de los dos links,
     * utilizamos familia-novia como entrada predeterminada.
     */
    private String resolveInvitationCode(String invitationCode) {
        if (GROOM_INVITATION_CODE.equals(invitationCode))
            return GROOM_INVITATION_CODE;

        return BRIDE_INVITATION_CODE;
    }

    /*
     * =========================================================
     * GUARDAR PROCEDENCIA
     * =========================================================
     */
    private void saveInvitationCookie(HttpServletResponse response, String invitationCode) {
        ResponseCookie cookie = ResponseCookie
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