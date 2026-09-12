export class InvitationIntro {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.entry = document.getElementById("introScreen");
        this.enterButton = document.getElementById("enterInvitationButton");
        this.hero = document.querySelector(".hero");
        this.exitDuration = 850;
        this.isEntering = false;
    }

    init() {
        if (!this.entry || !this.enterButton)
            return;

        if ("scrollRestoration" in history)
            history.scrollRestoration = "manual";

        this.resetScrollPosition();

        document.documentElement.classList.add("invitation-entry-active");
        document.body.classList.add("invitation-entry-active");

        this.enterButton.addEventListener("click", () => {
                this.enterInvitation();
            }
        );

        window.setTimeout(() => {
                this.enterButton.focus();
            },
            120
        );
    }

    async enterInvitation() {
        if (this.isEntering)
            return;

        this.isEntering = true;
        this.enterButton.disabled = true;
        this.resetScrollPosition();

        try {
            await this.musicPlayer?.play();
        } catch (error) {
            console.warn(
                "No se pudo iniciar la música al entrar.",
                error
            );
        }

        this.openInvitation();
    }

    openInvitation() {
        this.resetScrollPosition();
        this.entry.classList.add("is-leaving");

        document.documentElement.classList.remove("invitation-entry-active");
        document.body.classList.remove("invitation-entry-active");
        document.body.classList.add("invitation-started");

        requestAnimationFrame(() => {
                this.resetScrollPosition();
            }
        );

        window.setTimeout(() => {
                this.entry.remove();
                this.resetScrollPosition();
            },
            this.exitDuration
        );
    }

    resetScrollPosition() {
        if (this.hero) {
            const heroTop =
                this.hero.getBoundingClientRect().top
                + window.scrollY;

            window.scrollTo({
                top: heroTop,
                left: 0,
                behavior: "auto"
            });

            return;
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto"
        });
    }
}