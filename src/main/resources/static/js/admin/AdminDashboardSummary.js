export class AdminDashboardSummary {
    constructor() {
        this.endpoint = "/admin/api/dashboard/summary";

        this.totalGuests = document.getElementById("totalGuests");
        this.totalAdults = document.getElementById("totalAdults");
        this.totalChildren = document.getElementById("totalChildren");
        this.totalConfirmations = document.getElementById("totalConfirmations");
        this.totalDeclines = document.getElementById("totalDeclines");
    }

    async init() {
        await this.loadSummary();
    }

    async refresh() {
        await this.loadSummary();
    }

    async loadSummary() {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error("No se pudo cargar el resumen del dashboard.");
            }

            const summary = await response.json();
            this.render(summary);
        } catch (error) {
            console.error(error);
        }
    }

    render(summary) {
        this.totalGuests.textContent = summary.totalGuests ?? 0;
        this.totalAdults.textContent = summary.totalAdults ?? 0;
        this.totalChildren.textContent = summary.totalChildren ?? 0;
        this.totalConfirmations.textContent = summary.totalConfirmations ?? 0;
        this.totalDeclines.textContent = summary.totalDeclines ?? 0;
    }
}