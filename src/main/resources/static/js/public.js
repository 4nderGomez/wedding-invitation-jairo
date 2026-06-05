import { MusicPlayer } from "./public/MusicPlayer.js";
import { InvitationIntro } from "./public/InvitationIntro.js";
import { CountdownTimer } from "./public/CountdownTimer.js";
import { GalleryCarousel } from "./public/GalleryCarousel.js";
import { RsvpModal } from "./rsvp/RsvpModal.js"
import { RsvpStateManager} from "./rsvp/RsvpStateManager.js";
import { RsvpValidator } from "./rsvp/RsvpValidator.js";
import { RsvpApi } from "./rsvp/RsvpApi.js";
import { RsvpConfirmModal} from "./rsvp/RsvpConfirmModal.js"
import { RsvpForm } from "./rsvp/RsvpForm.js";
import { CompanionManager } from "./rsvp/CompanionManager.js";
import { WeddingCalendar } from "./rsvp/WeddingCalendar.js";

async function loadRegistrationStatus() {
    try {
        const response = await fetch("/admin/api/settings/registration");

        if (!response.ok) {
            throw new Error("No se pudo cargar el estado del registro.");
        }

        const status = await response.json();

        const button = document.getElementById("openRsvpModalButton");

        if (!button) return;

        if (!status.enabled || status.locked) {
            button.disabled = true;
            button.textContent = "Botón desactivado";
            button.classList.add("is-disabled");

            if (!document.querySelector(".registration-disabled-message")) {
                const warning = document.createElement("p");

                warning.classList.add("registration-disabled-message");
                warning.textContent = "Ya no puedes registrarte.";

                button.insertAdjacentElement("afterend", warning);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const musicPlayer = new MusicPlayer();
    const invitationIntro = new InvitationIntro(musicPlayer);
    const countdownTimer = new CountdownTimer("2026-11-21T17:00:00");
    const galleryCarousel = new GalleryCarousel();

    const rsvpModal = new RsvpModal();
    const rsvpStateManager = new RsvpStateManager();
    const rsvpValidator = new RsvpValidator();
    const rsvpApi = new RsvpApi();
    const rsvpConfirmModal = new RsvpConfirmModal();
    const rsvpForm = new RsvpForm(
        rsvpModal,
        rsvpStateManager,
        rsvpValidator,
        rsvpApi,
        rsvpConfirmModal
    );
    const companionManager = new CompanionManager();
    const weddingCalendar = new WeddingCalendar();

    musicPlayer.init();
    invitationIntro.init();
    countdownTimer.init();
    galleryCarousel.init();
    rsvpModal.init();
    rsvpForm.init();
    companionManager.init();
    weddingCalendar.init();
    rsvpConfirmModal.init();
    loadRegistrationStatus();
});