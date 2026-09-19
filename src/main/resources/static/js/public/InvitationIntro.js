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

        this.startEntryAnimation();

        this.enterButton
            .addEventListener("click", () => {
                    this.enterInvitation();
                }
            );

        window.setTimeout(() => {
                if (!this.isEntering) {
                    this.enterButton.focus({
                        preventScroll: true
                    });
                }
            },
            1600
        );
    }

    startEntryAnimation() {
        if (!this.entry)
            return;

        requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                        if (!this.entry)
                            return;

                        this.entry.classList.add("is-ready");
                    }
                );
            }
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
            console.warn("No se pudo iniciar la música al entrar.",error);
        }

        this.openInvitation();
    }

    openInvitation() {
        this.resetScrollPosition();
        this.entry.classList.remove("is-ready");
        this.entry.classList.add("is-leaving");

        document.documentElement.classList.remove("invitation-entry-active");
        document.body.classList.remove("invitation-entry-active");
        document.body.classList.add("invitation-started");

        this.musicPlayer?.showButton();

        requestAnimationFrame(() => {
                this.resetScrollPosition();
            }
        );

        window.setTimeout(() => {
                this.entry?.remove();
                this.entry = null;
                this.resetScrollPosition();

                document.dispatchEvent(
                    new CustomEvent(
                        "invitation:entered"
                    )
                );
            },
            this.exitDuration
        );
    }

    resetScrollPosition() {
        if (this.hero) {
            const heroTop =
                this.hero
                    .getBoundingClientRect()
                    .top
                +
                window.scrollY;

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