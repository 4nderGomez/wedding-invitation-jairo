export class RsvpForm {
    constructor(rsvpModal, rsvpStateManager, rsvpValidator, rsvpApi) {
        this.rsvpModal = rsvpModal;
        this.rsvpStateManager = rsvpStateManager;
        this.rsvpValidator = rsvpValidator;
        this.rsvpApi = rsvpApi;

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

        if(!this.rsvpValidator.validateForm(this.attendingForm)) return;

        const rsvpData = this.buildAttendingPayload();

        try {
            const response = await this.rsvpApi.submitRsvp(rsvpData);

            if(!response.success) return;
            
            this.rsvpModal.closeActiveModal();
            this.rsvpStateManager.showAttendingResult();
        } catch (error) {
            console.error(error.message);
            this.showFormError(this.attendingForm, error.message);
        }
    }

    async submitNotAttendingForm() {
        this.clearFormFeedback(this.attendingForm);
        
        if(!this.rsvpValidator.validateForm(this.notAttendingForm)) return;

        const rsvpData = this.buildNotAttendingPayload();

        try {
            const response = await this.rsvpApi.submitRsvp(rsvpData);

            if(!response.success) return;

            this.rsvpModal.closeActiveModal();
            this.rsvpStateManager.showNotAttendingResult();
        } catch (error) {
            console.error(error.message);
            this.showFormError(this.notAttendingForm, error.message);
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
            companions: this.getCompanions()
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
            companions: []
        };
    }

    getCompanions() {
        const companionCards = document.querySelectorAll(".companion-card");

        return Array.from(companionCards).map((card) => {
            return {
                firstName: card.querySelector('input[name$=".firstName"]')?.value.trim() || null,
                lastName: card.querySelector('input[name$=".lastName"]')?.value.trim() || null,
                ageGroup: card.querySelector('input[name$=".ageGroup"]')?.value || null
            };
        });
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
}