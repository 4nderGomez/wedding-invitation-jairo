export class RsvpModal {
    constructor() {
        this.attendingModal = document.getElementById("attendingModal");
        this.notAttendingModal = document.getElementById("notAttendingModal");
        this.closeButtons = document.querySelectorAll("[data-close-modal]");

        this.activeModal = null;
        this.previousFocusedElement = null;
    }

    init() {
        this.closeButtons.forEach((button) => {
            button.addEventListener("click", () => this.closeActiveModal());
        });

        this.attendingModal?.addEventListener("click", (event) => {
            if (event.target === this.attendingModal) {
                this.closeActiveModal();
            }
        });

        this.notAttendingModal?.addEventListener("click", (event) => {
            if (event.target === this.notAttendingModal) {
                this.closeActiveModal();
            }
        });

        document.addEventListener("keydown", (event) => {
                if (event.key !== "Escape")
                    return;

                const confirmModal = document.getElementById("rsvpConfirmModal");

                const confirmModalIsOpen = confirmModal && (confirmModal.getAttribute("aria-hidden")
                        === "false" || confirmModal.classList.contains("active")
                    );

                if (confirmModalIsOpen)
                    return;

                this.closeActiveModal();
            }
        );
    }

    openAttendingModal() {
        this.openModal(this.attendingModal);
    }

    openNotAttendingModal() {
        this.openModal(this.notAttendingModal);
    }

    openModal(modal) {
        if (!modal) return;

        this.activeModal = modal;
        this.previousFocusedElement = document.activeElement;

        modal.inert = false;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("rsvp-modal-open");
    }

    closeActiveModal() {
        if (!this.activeModal) return;

        if (this.activeModal.contains(document.activeElement))
            document.activeElement?.blur();

        this.activeModal.classList.remove("active");

        this.activeModal.inert = true;

        this.activeModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("rsvp-modal-open");

        this.previousFocusedElement?.focus({preventScroll: true});

        this.activeModal = null;
        this.previousFocusedElement = null;
    }
}