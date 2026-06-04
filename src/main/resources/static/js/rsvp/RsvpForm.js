export class RsvpForm {
    constructor(rsvpModal, rsvpStateManager, rsvpValidator, rsvpApi, rsvpConfirmModal) {
        this.rsvpModal = rsvpModal;
        this.rsvpStateManager = rsvpStateManager;
        this.rsvpValidator = rsvpValidator;
        this.rsvpApi = rsvpApi;
        this.rsvpConfirmModal = rsvpConfirmModal;

        this.choiceForm = document.getElementById("rsvpChoiceForm");
        this.openModalButton = document.getElementById("openRsvpModalButton");
        this.invitationCodeInput = document.getElementById("invitationCode");

        this.attendingForm = document.getElementById("attendingForm");
        this.notAttendingForm = document.getElementById("notAttendingForm");
    }

    init(){
        if(!this.choiceForm || !this.openModalButton || !this.rsvpModal) return;

        this.openModalButton.addEventListener("click", () => this.openSelectedModal());

        this.attendingForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.submitAttendingForm();
        });

        this.notAttendingForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            this.submitNotAttendingForm();
        });
    }

    openSelectedModal() {
        const selectedStatus = this.getSelectedAttendanceStatus();

        if(selectedStatus === "ATTENDING"){
            this.rsvpModal.openAttendingModal();
            return;
        }

        if(selectedStatus === "NOT_ATTENDING")
            this.rsvpModal.openNotAttendingModal();
    }

    getSelectedAttendanceStatus() {
        const selectedOption = this.choiceForm.querySelector(
            'input[name="attendanceStatus"]:checked'
        );

        return selectedOption?.value;
    }

    async submitAttendingForm() {
        this.clearFormFeedback(this.attendingForm);

        if (!this.rsvpValidator.validateForm(this.attendingForm)) return;

        const confirmed = await this.rsvpConfirmModal.ask(
            "Antes de enviar tu confirmación, revisa que tus datos y acompañantes estén completos. ¿Todo está correcto?"
        );

        if (!confirmed) return;

        const rsvpData = this.buildAttendingPayload();

        try {
            this.setSubmitLoading(this.attendingForm, true, "Enviando...");

            await this.rsvpApi.submitRsvp(rsvpData);

            this.rsvpModal.closeActiveModal();
            this.rsvpStateManager.showAttendingResult();

        } catch (error) {
            console.error(error.message);
            this.showFormError(this.attendingForm, error.message);
        } finally {
            this.setSubmitLoading(this.attendingForm, false);
        }
    }

    async submitNotAttendingForm() {
        this.clearFormFeedback(this.notAttendingForm);

        if (!this.rsvpValidator.validateForm(this.notAttendingForm)) return;

        const confirmed = await this.rsvpConfirmModal.ask(
            "Antes de enviar tu respuesta, revisa que tus datos y mensaje estén correctos. ¿Deseas enviarla ahora?"
        );

        if (!confirmed) return;

        const rsvpData = this.buildNotAttendingPayload();

        try {
            this.setSubmitLoading(this.notAttendingForm, true, "Enviando...");

            await this.rsvpApi.submitRsvp(rsvpData);

            this.rsvpModal.closeActiveModal();
            this.rsvpStateManager.showNotAttendingResult();

        } catch (error) {
            console.error(error.message);
            this.showFormError(this.notAttendingForm, error.message);
        } finally {
            this.setSubmitLoading(this.notAttendingForm, false);
        }
    }

    buildAttendingPayload() {
        return {
            invitationCode: this.getInvitationCode(),
            attendanceStatus: "ATTENDING",
            mainFirstName: this.getValue("attendingFirstName"),
            mainLastName: this.getValue("attendingLastName"),
            phone: this.getValue("attendingPhone"),
            email: this.getValue("attendingEmail"),
            guestSide: this.getValue("attendingGuestSide"),
            fromCity: this.getBooleanValue("attendingFromCity"),
            message: this.getValue("attendingMessage"),
            adultCompanionsCount: this.getCompanionCount("adultCompanionsCount"),
            childCompanionsCount: this.getCompanionCount("childCompanionsCount")
        };
    }

    buildNotAttendingPayload() {
        return {
            invitationCode: this.getInvitationCode(),
            attendanceStatus: "NOT_ATTENDING",
            mainFirstName: this.getValue("notAttendingFirstName"),
            mainLastName: this.getValue("notAttendingLastName"),
            phone: this.getValue("notAttendingPhone"),
            email: null,
            guestSide: this.getValue("notAttendingGuestSide"),
            fromCity: null,
            message: this.getValue("notAttendingMessage"),
            adultCompanionsCount: 0,
            childCompanionsCount: 0
        };
    }

    getCompanionCount(inputId) {
        const input = document.getElementById(inputId);
        const value = input?.value.trim();

        if(!value) return 0;

        return Number(value);
    }

    getInvitationCode() {
        return this.invitationCodeInput?.value.trim() || "";
    }

    getValue(inputId) {
        const input = document.getElementById(inputId);

        return input?.value.trim() || null;
    }

    getBooleanValue(inputId) {
        const input = document.getElementById(inputId);

        if(!input || input.value === "")
            return null;

        return input.value === "true";
    }

    showFormError(form, message) {
        const feedback = form.querySelector("[data-rsvp-feedback]");

        if(!feedback) return;

        feedback.hidden = false;
        feedback.classList.remove("is-success");
        feedback.classList.add("is-error");
        feedback.textContent = message;
    }

    clearFormFeedback(form) {
        const feedback = form.querySelector("[data-rsvp-feedback]");

        if(!feedback) return;

        feedback.hidden = true;
        feedback.classList.remove("is-success", "is-error");
        feedback.textContent = "";
    }

    setSubmitLoading(form, isLoading, loadingText = "Enviando...") {
    const button = form.querySelector('button[type="submit"]');

    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.textContent.trim();
        button.textContent = loadingText;
        button.disabled = true;
        button.classList.add("is-loading");
        return;
    }

    button.textContent = button.dataset.originalText || "Enviar";
    button.disabled = false;
    button.classList.remove("is-loading");
}
}