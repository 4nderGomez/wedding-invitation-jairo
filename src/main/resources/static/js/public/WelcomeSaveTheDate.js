export class WelcomeSaveTheDate {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.section = document.getElementById("welcome");
        this.content = document.getElementById("welcomeContent");
        this.openButton = document.getElementById("openSaveTheDateButton");
        this.closeButton = document.getElementById("closeSaveTheDateButton");
        this.videoLayer = document.getElementById("welcomeSaveTheDateLayer");
        this.video = document.getElementById("welcomeSaveTheDateVideo");
        this.musicWasPlaying = false;
        this.videoIsOpen = false;
        this.videoHasEnded = false;
        this.lockedScrollY = 0;
    }

    init() {
        if (
            !this.section ||
            !this.content ||
            !this.openButton ||
            !this.closeButton ||
            !this.videoLayer ||
            !this.video
        )
            return;

        this.setVideoAccessibility(false);
        this.hideCloseButton();

        this.openButton.addEventListener("click", () => {
                this.openVideo();
            }
        );

        this.closeButton.addEventListener("click", () => {
                if (!this.videoHasEnded)
                    return;

                this.closeVideo();
            }
        );
        
        this.video.addEventListener("ended", () => {
                this.handleVideoEnded();
            }
        );

        this.video.addEventListener("error", () => {
                this.handleVideoError();
            }
        );
    }

    async openVideo() {
        if (this.videoIsOpen)
            return;

        this.videoIsOpen = true;
        this.videoHasEnded = false;
        this.lockPageScroll();
        this.hideCloseButton();

        const backgroundMusic = this.musicPlayer ?.backgroundMusic;

        this.musicWasPlaying =Boolean(
                backgroundMusic &&
                !backgroundMusic.paused
            );

        if (this.musicWasPlaying)
            this.musicPlayer.pause();

        this.section.classList.add("is-video-open");
        this.openButton.setAttribute("aria-expanded", "true");
        this.content.setAttribute("aria-hidden", "true");
        this.content.setAttribute("inert", "");
        this.setVideoAccessibility(true);
        this.video.currentTime = 0;

        try {
            await this.video.play();
        } catch (error) {
            console.warn("El Save the date no pudo iniciar.", error);

            this.videoHasEnded = true;
            this.showCloseButton();
        }
    }

    handleVideoEnded() {
        if (!this.videoIsOpen)
            return;

        this.videoHasEnded = true;
        this.showCloseButton();
    }

    handleVideoError() {
        if (!this.videoIsOpen)
            return;

        console.error("Ocurrió un error reproduciendo el Save the date.");

        this.videoHasEnded = true;
        this.showCloseButton();
    }

    showCloseButton() {
        this.closeButton.disabled = false;
        this.closeButton.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
                this.closeButton.classList
                    .add(
                        "is-visible"
                    );

            }
        );

        window.setTimeout(() => {
                this.closeButton.focus();
            },
            450
        );
    }

    hideCloseButton() {
        this.closeButton.classList.remove("is-visible");
        this.closeButton.disabled = true;
        this.closeButton.setAttribute("aria-hidden", "true");
    }

    closeVideo() {
        if (
            !this.videoIsOpen ||
            !this.videoHasEnded
        )
            return;

        this.videoIsOpen = false;
        this.video.pause();
        this.hideCloseButton();
        this.section.classList.remove("is-video-open");
        this.openButton.setAttribute("aria-expanded", "false");
        this.setVideoAccessibility(false);
        this.content.removeAttribute("aria-hidden");
        this.content.removeAttribute("inert");
        this.unlockPageScroll();
        this.resumePageMusic();

        window.setTimeout(() => {
                this.video.currentTime = 0;
                this.videoHasEnded = false;
                this.openButton.focus();
            },
            150
        );
    }

    lockPageScroll() {
        this.lockedScrollY =
            window.scrollY ||
            window.pageYOffset ||
            0;

        document.documentElement.classList.add("welcome-video-lock");
        document.body.classList.add("welcome-video-lock");
        document.body.style.position = "fixed";
        document.body.style.top = `-${this.lockedScrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
    }

    unlockPageScroll() {
        document.documentElement.classList.remove("welcome-video-lock");
        document.body.classList.remove("welcome-video-lock");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";

        window.scrollTo(
            {
                top:
                    this.lockedScrollY,

                left: 0,

                behavior:
                    "instant"
            }
        );
    }

    setVideoAccessibility(isVisible) {
        this.videoLayer.setAttribute("aria-hidden", String(!isVisible));

        if (isVisible)
            this.videoLayer.removeAttribute("inert");
        else
            this.videoLayer.setAttribute("inert", "");
    }

    async resumePageMusic() {
        if (!this.musicWasPlaying)
            return;

        this.musicWasPlaying = false;

        try {
            await this.musicPlayer ?.play();
        } catch (error) {
            console.warn("No se pudo reanudar la música de la invitación.", error);
        }
    }
}