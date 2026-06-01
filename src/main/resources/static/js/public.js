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
});