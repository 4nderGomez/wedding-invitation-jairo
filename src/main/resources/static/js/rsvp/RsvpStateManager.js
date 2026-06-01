import { RSVP_RESULT_MESSAGES } from "./RsvpResultMessages.js";

export class RsvpStateManager {
    constructor() {
        this.rsvpPanel = document.getElementById("rsvpPanel");
        this.rsvpIntro = document.getElementById("rsvpIntro");
        this.rsvpResult = document.getElementById("rsvpResult");

        this.resultIcon = document.getElementById("rsvpResultIcon");
        this.resultLabel = document.getElementById("rsvpResultLabel");
        this.resultTitle = document.getElementById("rsvpResultTitle");
        this.resultMessage = document.getElementById("rsvpResultMessage");
        this.resultDate = document.getElementById("rsvpResultDate");

        this.weddingDay = document.getElementById("weddingDay");
        this.calendarButton = document.getElementById("calendarButton");
    }

    showAttendingResult() {
        this.showResult(RSVP_RESULT_MESSAGES.ATTENDING);
    }

    showNotAttendingResult() {
        this.showResult(RSVP_RESULT_MESSAGES.NOT_ATTENDING);
    }

    showResult(resultData) {
        this.hideIntro();
        this.showResultCard(resultData);
        this.updateCalendar(resultData);
    }

    hideIntro() {
        if (this.rsvpIntro) {
            this.rsvpIntro.hidden = true;
            this.rsvpIntro.style.display = "none";
        }

        if (this.rsvpPanel) {
            this.rsvpPanel.classList.add("is-submitted");
        }
    }

    showResultCard(resultData) {
        if (!this.rsvpResult) return;

        this.rsvpResult.hidden = false;
        this.rsvpResult.style.display = "flex";
        this.rsvpResult.classList.remove("is-attending", "is-not-attending");
        this.rsvpResult.classList.add(resultData.stateClass);

        if (this.resultIcon) {
            this.resultIcon.textContent = resultData.icon;
        }

        if (this.resultLabel) {
            this.resultLabel.textContent = resultData.label;
        }

        if (this.resultTitle) {
            this.resultTitle.textContent = resultData.title;
        }

        if (this.resultMessage) {
            this.resultMessage.innerHTML = resultData.paragraphs
                .map((paragraph) => `<p>${paragraph}</p>`)
                .join("");
        }

        if (this.resultDate) {
            this.resultDate.textContent = resultData.date;
        }
    }

    updateCalendar(resultData) {
        if (this.weddingDay) {
            this.weddingDay.classList.remove("is-confirmed", "is-declined");
            this.weddingDay.classList.add(resultData.calendarClass);
        }

        if (this.calendarButton) {
            this.calendarButton.classList.remove("is-confirmed", "is-declined");
            this.calendarButton.classList.add(resultData.buttonClass);
        }
    }
}