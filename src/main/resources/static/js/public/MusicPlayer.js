export class MusicPlayer {
    constructor() {
        this.musicButton = document.getElementById("musicButton");
        this.backgroundMusic = document.getElementById("backgroundMusic");
        this.isPlaying = false;
    }

    init() {
        if (!this.musicButton || !this.backgroundMusic) return;

        this.musicButton.addEventListener("click", () => {
            this.toggleMusic();
        });
    }

    async play() {
        if (!this.backgroundMusic) return;

        try {
            await this.backgroundMusic.play();
            this.isPlaying = true;
            this.musicButton?.classList.add("is-playing");
        } catch (error) {
            console.warn("La música no pudo reproducirse:", error);
        }
    }

    pause() {
        if (!this.backgroundMusic) return;

        this.backgroundMusic.pause();
        this.isPlaying = false;
        this.musicButton?.classList.remove("is-playing");
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
}