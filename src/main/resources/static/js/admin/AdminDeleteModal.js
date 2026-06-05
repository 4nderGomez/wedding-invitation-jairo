export class AdminDeleteModal {
    constructor() {
        this.confirmModal = document.getElementById("deleteConfirmModal");
        this.loadingModal = document.getElementById("deleteLoadingModal");

        this.cancelButton = document.getElementById("cancelDeleteButton");
        this.confirmButton = document.getElementById("confirmDeleteButton");

        this.countdownSeconds = 5;
        this.intervalId = null;
        this.timeoutId = null;
        this.resolvePromise = null;
    }

    init() {
        this.cancelButton.addEventListener("click", () => {
            this.cancel();
        });

        this.confirmButton.addEventListener("click", () => {
            this.startCountdown();
        });
    }

    open() {
        this.reset();
        this.confirmModal.hidden = false;
        document.body.classList.add("is-modal-open");

        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    startCountdown() {
        let secondsLeft = this.countdownSeconds;

        this.confirmButton.disabled = true;
        this.confirmButton.textContent = `Sí (${secondsLeft})`;

        this.intervalId = setInterval(() => {
            secondsLeft--;
            this.confirmButton.textContent = `Sí (${secondsLeft})`;

            if (secondsLeft <= 0) {
                clearInterval(this.intervalId);
            }
        }, 1000);

        this.timeoutId = setTimeout(() => {
            this.showLoading();
        }, this.countdownSeconds * 1000);
    }

    showLoading() {
        this.confirmModal.hidden = true;
        this.loadingModal.hidden = false;

        setTimeout(() => {
            const resolver = this.resolvePromise;

            this.closeAll();

            if (resolver) {
                resolver(true);
            }
        }, 3000);
    }

    cancel() {
        const resolver = this.resolvePromise;

        this.closeAll();

        if (resolver) {
            resolver(false);
        }
    }

    closeAll() {
        this.confirmModal.hidden = true;
        this.loadingModal.hidden = true;

        document.body.classList.remove("is-modal-open");

        this.reset();
    }

    reset() {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);

        this.intervalId = null;
        this.timeoutId = null;

        this.confirmButton.disabled = false;
        this.confirmButton.textContent = "Sí";

        this.resolvePromise = null;
    }
}