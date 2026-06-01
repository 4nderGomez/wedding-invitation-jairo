export class RsvpConfirmModal {
    constructor() {
        this.modal = document.getElementById("rsvpConfirmModal");
        this.message = document.getElementById("rsvpConfirmMessage");
        this.acceptButton = document.getElementById("acceptRsvpConfirm");
        this.cancelButton = document.getElementById("cancelRsvpConfirm");

        this.resolvePromise = null;
    }

    init() {
        this.acceptButton?.addEventListener("click", () => {
            this.close();
            this.resolvePromise?.(true);
        });

        this.cancelButton?.addEventListener("click", () => {
            this.close();
            this.resolvePromise?.(false);
        });

        this.modal?.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.close();
                this.resolvePromise?.(false);
            }
        });
    }

    ask(message) {
        if (!this.modal) return Promise.resolve(true);

        if (this.message) {
            this.message.textContent = message;
        }

        this.open();

        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    open() {
        this.modal.classList.add("active");
        this.modal.setAttribute("aria-hidden", "false");
    }

    close() {
        this.modal.classList.remove("active");
        this.modal.setAttribute("aria-hidden", "true");
    }
}