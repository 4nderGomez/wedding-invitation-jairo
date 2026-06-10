export class InvitationIntro {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.startButton = document.getElementById("startInvitationButton");
        this.welcomeScreen = document.getElementById("welcomeScreen");
        this.invitationContent = document.getElementById("invitationContent");
    }

    init() {
        if (!this.startButton || !this.welcomeScreen || !this.invitationContent) {
            document.body.classList.remove("intro-active");
            return;
        }

        document.body.classList.add("intro-active");

        this.startButton.addEventListener("click", () => {
            this.startInvitation();
        });
    }

    async startInvitation() {
        try {
            await this.musicPlayer?.play();
        } catch (error) {
            console.warn("La música no pudo iniciar, pero la invitación continuará.", error);
        }

        this.musicPlayer?.showButton();

        this.welcomeScreen.classList.add("is-hidden");
        this.invitationContent.classList.add("is-visible");

        document.body.classList.remove("intro-active");
        document.body.classList.add("invitation-started");

        setTimeout(() => {
            this.welcomeScreen.remove();
        }, 1200);
    }
}