//import { MusicPlayer } from "./public/MusicPlayer.js";
import { CountdownTimer } from "./public/CountdownTimer.js";
import { GalleryCarousel } from "./public/GalleryCarousel.js";

/*const musicPlayer = new MusicPlayer();
musicPlayer.init();*/

document.addEventListener("DOMContentLoaded", () => {
    const countdownTimer = new CountdownTimer("2026-11-21T17:00:00");
    const galleryCarousel = new GalleryCarousel();

    countdownTimer.init();
    galleryCarousel.init();
})