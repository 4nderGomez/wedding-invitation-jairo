export class MusicPlayer {
    constructor() {
        this.musicButton = document.getElementById("musicButton");
        this.backgroundMusic = document.getElementById("backgroundMusic");

        this.wasPlayingBeforeHidden = false;
    }

    init() {
        if (!this.backgroundMusic) return;

        this.updateButtonText();
        this.bindEvents();
    }

    showButton() {
        this.musicButton?.classList.add("is-visible");
    }

    bindEvents() {
        this.musicButton?.addEventListener("click", () => {
            this.toggleMusic();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pauseByLeavingPage();
            } else {
                this.resumeAfterReturning();
            }
        });

        window.addEventListener("blur", () => {
            this.pauseByLeavingPage();
        });

        window.addEventListener("pagehide", () => {
            this.pauseByLeavingPage();
        });
    }

    async play() {
        if (!this.backgroundMusic) return;

        try {
            await this.backgroundMusic.play();

            this.updateButtonText();
        } catch (error) {
            console.warn("La música no pudo reproducirse:", error);
        }
    }

    pause() {
        if (!this.backgroundMusic) return;

        this.backgroundMusic.pause();
        this.updateButtonText();
    }

    toggleMusic() {
        if (this.backgroundMusic.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    updateButtonText() {
        if (!this.musicButton || !this.backgroundMusic) return;

        const isPlaying = !this.backgroundMusic.paused;

        this.musicButton.classList.toggle("is-playing", isPlaying);

        const label = isPlaying ? "Pausar música" : "Reproducir música";

        this.musicButton.setAttribute("aria-label", label);
        this.musicButton.setAttribute("title", label);
    }

    pauseByLeavingPage() {
        if (!this.backgroundMusic || this.backgroundMusic.paused) return;

        this.wasPlayingBeforeHidden = true;
        this.pause();
    }

    resumeAfterReturning() {
        if (!this.wasPlayingBeforeHidden) return;

        this.play();
        this.wasPlayingBeforeHidden = false;
    }
}