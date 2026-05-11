package com.wedding.invitationjairo.controller;

import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.service.InvitationLinkService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PublicController {
    private final InvitationLinkService invitationLinkService;

    public PublicController(InvitationLinkService invitationLinkService){
        this.invitationLinkService = invitationLinkService;
    }

    @GetMapping("/i/{code}")
    public String showInvitation(
        @PathVariable
        String code,
        Model model
    ) {
        InvitationLink invitationLink = invitationLinkService.getActiveLinkByCode(code);

        model.addAttribute("invitationCode", invitationLink.getCode());
        model.addAttribute("guestSide", invitationLink.getGuestSide());
        model.addAttribute("groupName", invitationLink.getGroupName());

        return "public/invitation";
    }
}