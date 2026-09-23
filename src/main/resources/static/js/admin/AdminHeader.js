export class AdminHeaderClock {
    constructor() {
        this.dateElement = document.getElementById("adminCurrentDate");
        this.timeElement = document.getElementById("adminCurrentTime");
        this.intervalId = null;
    }

    init() {
        if (!this.dateElement || !this.timeElement)
            return;

        this.update();

        this.intervalId = window.setInterval(() => this.update(),
                30_000
            );
    }

    update() {
        const now = new Date();

        this.dateElement.textContent = this.formatDate(now);
        this.timeElement.textContent = this.formatTime(now);
    }

    formatDate(date) {
        const formatted = new Intl.DateTimeFormat("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            ).format(date);

        return this.capitalize(formatted);
    }

    formatTime(date) {
        return new Intl.DateTimeFormat("es-MX", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ).format(date);
    }

    capitalize(text) {
        if (!text)
            return "";

        return (text.charAt(0).toUpperCase() + text.slice(1));
    }
}