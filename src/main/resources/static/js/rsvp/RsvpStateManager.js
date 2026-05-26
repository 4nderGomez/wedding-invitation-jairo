export class RsvpStateManager {
    constructor() {
        this.rsvpPanel = document.getElementById("rsvpPanel");
        this.rsvpIntro = document.getElementById("rsvpIntro");
        this.rsvpResult = document.getElementById("rsvpResult");

        this.resultLabel = document.getElementById("rsvpResultLabel");
        this.resultTitle = document.getElementById("rsvpResultTitle");
        this.resultMessage = document.getElementById("rsvpResultMessage");

        this.weddingDay = document.getElementById("weddingDay");
        this.calendarButton = document.getElementById("calendarButton");
    }

    showAttendingResult() {
        this.showResult({
            stateClass: "is-attending",
            calendarClass: "is-confirmed",
            buttonClass: "is-confirmed",
            label: "Respuesta enviada",
            title: "Tus datos han sido enviados correctamente",
            message: "Te esperamos en este gran día para celebrar el incio de la familia Pinacho Pacheco"
        });
    }
    
    showNotAttendingResult() {
        this.showResult({
            stateClass: "is-not-attending",
            calendarClass: "is-declined",
            buttonClass: "is-declined",
            label: "Respuesta enviada",
            title: "Tus datos han sido enviados correctamente",
            message: "Hemos recibido tu espuesta y agradecemos muchos tus palabras para los novios"
        });
    }

    showResult({stateClass, calendarClass, buttonClass, label, title, message}) {
        if(this.rsvpIntro)
            this.rsvpIntro.hidden = true;

        if(this.rsvpResult) {
            this.rsvpResult.hidden = false;
            this.rsvpResult.classList.remove("is-attending", "is-not-attending");
            this.rsvpResult.classList.add(stateClass);
        }

        if(this.rsvpPanel)
            this.rsvpPanel.classList.add("is-submitted");

        if(this.resultLabel)
            this.resultLabel.textContent = label;

        if(this.resultTitle)
            this.resultTitle.textContent = title;

        if(this.resultMessage)
            this.resultMessage = message;

        if(this.weddingDay){
            this.weddingDay.classList.remove("is-confirmed", "is-declined");
            this.weddingDay.classList.add(calendarClass);
        }

        if(this.calendarButton) {
            this.calendarButton.classList.remove("is-confirmed", "is-declined");
            this.calendarButton.classList.add(buttonClass);
        }
    }
}