export class RsvpConfirmModal {
    constructor() {
        this.modal = document.getElementById("rsvpConfirmModal");
        this.message = document.getElementById("rsvpConfirmMessage");
        this.acceptButton = document.getElementById("acceptRsvpConfirm");
        this.cancelButton = document.getElementById("cancelRsvpConfirm");
        this.resolvePromise = null;
        this.previousFocusedElement = null;
        this.countdownSeconds = 3;
        this.countdownTimer = null;
        this.isCountingDown = false;
        this.defaultAcceptText = this.acceptButton?.textContent.trim() || "Sí, enviar respuesta";
        this.defaultCancelText = this.cancelButton?.textContent.trim() || "Revisar datos";
    }

    init() {
        if (!this.modal)
            return;

        this.modal.inert = true;
        this.acceptButton?.addEventListener("click", () => {
                    this.startCountdown();
                }
            );

        this.cancelButton?.addEventListener("click", () => {
                    this.cancelConfirmation();
                }
            );

        this.modal.addEventListener("click", (event) => {
                if (event.target === this.modal)
                    this.cancelConfirmation();
            }
        );

        document.addEventListener("keydown", (event) => {
                if (event.key !== "Escape" || !this.isOpen())
                    return;

                event.preventDefault();
                this.cancelConfirmation();
            }
        );
    }

    ask(message) {
        if (!this.modal)
            return Promise.resolve(true);

        this.resetCountdown();

        if (this.message)
            this.message.textContent = message;

        this.previousFocusedElement = document.activeElement;

        return new Promise((resolve) => {
                this.resolvePromise = resolve;
                this.open();
            }
        );
    }

    open() {
        if (!this.modal)
            return;

        this.setUnderlyingModalInert(true);
        this.modal.inert = false;
        this.modal.setAttribute("aria-hidden", "false");
        this.modal.classList.add("active");

        requestAnimationFrame(() => {
                this.cancelButton?.focus({
                        preventScroll: true
                    });
            }
        );
    }

    close() {
        if (!this.modal)
            return;

        this.clearCountdownTimer();
        this.setUnderlyingModalInert(false);

        if (this.modal.contains(document.activeElement)) {
            const focusTarget = this.previousFocusedElement;

            if (focusTarget && focusTarget.isConnected && typeof focusTarget.focus === "function") {
                focusTarget.focus({
                    preventScroll: true
                });
            } else
                document.activeElement?.blur();
        }

        this.modal.classList.remove("active");
        this.modal.inert = true;
        this.modal.setAttribute("aria-hidden", "true");
        this.restoreButtons();
        this.previousFocusedElement = null;
    }

    startCountdown() {
        if (this.isCountingDown || !this.resolvePromise)
            return;

        this.isCountingDown = true;

        let secondsLeft = this.countdownSeconds;

        if (this.acceptButton) {
            this.acceptButton.disabled = true;
            this.acceptButton.classList.add("is-counting");
        }

        if (this.cancelButton) {
            this.cancelButton.textContent = "Cancelar envío";
            this.cancelButton.focus({
                preventScroll: true
            });
        }

        this.renderCountdown(secondsLeft);

        this.countdownTimer = window.setInterval(() => {
                    secondsLeft -= 1;
                    if (secondsLeft <= 0) {
                        this.clearCountdownTimer();
                        this.isCountingDown = false;
                        this.resolveAndClose(true);

                        return;
                    }

                    this.renderCountdown(secondsLeft);
                },
                1000
            );
    }

    renderCountdown(secondsLeft) {
        if (!this.acceptButton)
            return;

        this.acceptButton.textContent = `Enviar en ${secondsLeft} s`;
    }

    cancelConfirmation() {
        this.resolveAndClose(false);
    }

    resolveAndClose(result) {
        const resolver = this.resolvePromise;

        this.resolvePromise = null;
        this.close();

        resolver?.(result);
    }

    isOpen() {
        if (!this.modal)
            return false;

        return (this.modal.getAttribute("aria-hidden") === "false");
    }

    clearCountdownTimer() {
        if (!this.countdownTimer)
            return;

        window.clearInterval(this.countdownTimer);

        this.countdownTimer = null;
    }

    resetCountdown() {
        this.clearCountdownTimer();
        this.isCountingDown = false;
        this.restoreButtons();
    }

    restoreButtons() {
        if (this.acceptButton) {
            this.acceptButton.disabled = false;
            this.acceptButton.textContent = this.defaultAcceptText;
            this.acceptButton.classList.remove("is-counting");
        }

        if (this.cancelButton) {
            this.cancelButton.disabled = false;
            this.cancelButton.textContent = this.defaultCancelText;
        }
    }

    setUnderlyingModalInert(inertState) {
        const openedModals = document.querySelectorAll(
                `
                    .rsvp-modal.active,
                    .rsvp-modal[aria-hidden="false"]
                `
            );

        openedModals.forEach((modal) => {
                modal.inert = inertState;
            }
        );
    }
}