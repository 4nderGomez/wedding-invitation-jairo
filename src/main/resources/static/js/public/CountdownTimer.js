export class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate).getTime();

        this.daysElement = document.getElementById("days");
        this.hoursElement = document.getElementById("hours");
        this.minutesElement = document.getElementById("minutes");
        this.secondsElement = document.getElementById("seconds");

        this.intervalId = null;
    }

    init() {
        if(!this.daysElement || !this.hoursElement || !this.minutesElement || !this.secondsElement)
            return;

        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if(distance <= 0) {
            this.stop();
            this.render(0, 0, 0, 0);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        this.render(days, hours, minutes, seconds);
    }

    render(days, hours, minutes, seconds) {
        this.daysElement.textContent = String(days).padStart(2, "0");
        this.hoursElement.textContent = String(hours).padStart(2, "0");
        this.minutesElement.textContent = String(minutes).padStart(2, "0");
        this.secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    stop() {
        if(this.intervalId)
            clearInterval(this.intervalId);
    }
}