package com.wedding.invitationjairo.service;

import com.wedding.invitationjairo.exception.ResourceNotFoundException;
import com.wedding.invitationjairo.model.InvitationLink;
import com.wedding.invitationjairo.repository.InvitationLinkRepository;

import org.springframework.stereotype.Service;

@Service
public class InvitationLinkService {
    private final InvitationLinkRepository invitationLinkRepository;

    public InvitationLinkService(InvitationLinkRepository invitationLinkRepository) {
        this.invitationLinkRepository = invitationLinkRepository;
    }

    public InvitationLink getActiveLinkByCode(String code) {
        return invitationLinkRepository.findByCodeAndActiveTrue(code)
            .orElseThrow(() -> new ResourceNotFoundException("Link de invitación no valida o inactivo"));
    }

    public InvitationLink getByCode(String code) {
        return invitationLinkRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Link de invitación no encontrado"));
    }
}
