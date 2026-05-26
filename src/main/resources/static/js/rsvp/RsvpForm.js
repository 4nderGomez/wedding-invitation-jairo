export class RsvpForm {
    constructor(rsvpModal, rsvpStateManager, rsvpValidator) {
        this.rsvpModal = rsvpModal;
        this.rsvpStateManager = rsvpStateManager;
        this.rsvpValidator = rsvpValidator;

        this.choiceForm = document.getElementById("rsvpChoiceForm");
        this.openModalButton = document.getElementById("openRsvpModalButton");

        this.attendingForm = document.getElementById("attendingForm");
        this.notAttendingForm = document.getElementById("notAttendingForm");
    }

    init(){
        if(!this.choiceForm || !this.openModalButton || !this.rsvpModal) return;

        this.openModalButton-addEventListener("click", () => {
            const selectedStatus = this.getSelectedAttendanceStatus();

            if(selectedStatus === "ATTENDING") {
                this.rsvpModal.openAttendingModal();
                return;
            }

            if(selectedStatus === "NOT_ATTENDING")
                this.rsvpModal.openAttendingModal();
        });
    }

    getSelectedAttendanceStatus() {
        const selectedOption = this.choiceForm.querySelector(
            'input[name="attendanceStatus"]:checked'
        );

        return selectedOption?.value;
    }

    async submitAttendingForm() {
        if(!this.rsvpValidator.validateForm(this.attendingForm)) return;

        console.log("Formulario asistencia enviado");
        
        this.rsvpModal.closeActiveModal();
        this.rsvpStateManager.showAttendingResult();
    }

    async submitNotAttendingForm() {
        if(!this.rsvpValidator.validateForm(this.notAttendingForm)) return;

        console.log("Formulario no asistencia enviado")

        this.rsvpModal.closeActiveModal();
        this.rsvpStateManager.showAttendingResult();
    }
}