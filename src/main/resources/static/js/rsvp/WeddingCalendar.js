export class WeddingCalendar {
    constructor() {
        this.calendarButton = document. getElementById("calendarButton");
    }

    init() {
        if(!this.calendarButton) return;

        this.calendarButton.href = this.buildGoogleCalendarUrl();
    }

    buildGoogleCalendarUrl() {
        const title = encodeURIComponent("Boda de Jairo & Jennifer");
        const details = encodeURIComponent(
            "Acompáñanos a celebrar la boda de Jairo Gabriel Pinacho Rodríguez y Jennifer Pacheco García."
        );
        const location = encodeURIComponent(
            "Parroquia de Ntra. Sra. de la Inmaculada Concepción, Santa María Huatulco"
        );

        const startDate = "20261121T170000";
        const endDate = "20261121T230000";

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    }
}