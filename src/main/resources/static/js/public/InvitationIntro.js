export class InvitationIntro {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.startButton = document.getElementById("startInvitationButton");
        this.welcomeScreen = document.getElementById("welcomeScreen");
        this.invitationContent = document.getElementById("invitationContent");
    }

    init() {
        if (!this.startButton || !this.welcomeScreen || !this.invitationContent) return;

        document.body.classList.add("intro-active");

        this.startButton.addEventListener("click", () => {
            this.startInvitation();
        });
    }

    async startInvitation() {
        await this.musicPlayer?.play();
        this.welcomeScreen.classList.add("is-hidden");
        this.invitationContent.classList.add("is-visible");

        document.body.classList.remove("intro-active");

        setTimeout(() => {
            this.welcomeScreen.remove();
        }, 700);
    }
}