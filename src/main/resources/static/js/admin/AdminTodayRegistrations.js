export class AdminTodayRegistrations {
    constructor(deleteModal) {
    this.endpoint = "/admin/api/guests/today";
    this.deleteEndpoint = "/admin/api/guests";

    this.deleteModal = deleteModal;

    this.tableBody = document.getElementById("todayRegistrationsTableBody");
    this.emptyState = document.getElementById("todayEmptyState");
    this.tableWrapper = document.getElementById("todayTableWrapper");
}

    async init() {
        await this.loadTodayRegistrations();
        
        this.bindEvents();
    }

    async loadTodayRegistrations() {
        try {
            const response = await fetch(this.endpoint);

            if(!response.ok)
                throw new Error("No se pudieron cargar los registros de hoy.");

            const registrations = await response.json();
            this.render(registrations);
        } catch (error) {
            console.error(error);
        }
    }

    render(registrations) {
        this.tableBody.innerHTML = "";

        if (!registrations || registrations.length === 0) {
            this.emptyState.hidden = false;
            this.tableWrapper.hidden = true;
            return;
        }

        this.emptyState.hidden = true;
        this.tableWrapper.hidden = false;

        registrations.forEach((guest) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${this.safeText(guest.firstName)}</td>
                <td>${this.safeText(guest.lastName)}</td>
                <td>${this.formatGuestSide(guest.guestSide)}</td>
                <td>${this.safeText(guest.phone)}</td>
                <td>${this.safeText(guest.email)}</td>
                <td>${guest.adultCompanionsCount ?? 0}</td>
                <td>${guest.childCompanionsCount ?? 0}</td>
                <td>${this.formatAttendance(guest.attendanceStatus)}</td>
                <td>
                    <button 
                        type="button" 
                        class="delete-button"
                        data-guest-id="${guest.id}"
                    >
                        Eliminar
                    </button>
                </td>
            `;

            this.tableBody.appendChild(row);
        });
    }

    safeText(value) {
        return value && value.trim() !== "" ? value : "-";
    }

    formatGuestSide(guestSide) {
        if(guestSide === "NOVIO") return "Novio";
        if(guestSide === "NOVIA") return "Novia";
        return "-";
    }

    formatAttendance(attendanceStatus) {
        if(attendanceStatus === "ATTENDING")
            return `<span class="status-badge is-attending">Sí asistirá</span>`;

        if(attendanceStatus === "NOT_ATTENDING")
            return `<span class="status-badge is-declined">No asistirá</span>`;

        return "-";
    }

    bindEvents() {
        this.tableBody.addEventListener("click", async (event) => {
            const deleteButton = event.target.closest(".delete-button");

            if (!deleteButton) return;

            const guestId = deleteButton.dataset.guestId;
            const confirmed = await this.deleteModal.open();

            if (!confirmed) return;

            await this.deleteGuest(guestId);
        });
    }

    async deleteGuest(guestId) {
        try {
            const csrfToken = document.querySelector("input[name='_csrf']")?.value;

            const response = await fetch(`${this.deleteEndpoint}/${guestId}`, {
                method: "DELETE",
                headers: csrfToken ? {
                    "X-CSRF-TOKEN": csrfToken
                } : {}
            });

            if (!response.ok) {
                throw new Error("No se pudo eliminar el registro.");
            }

            await this.refresh();

            document.dispatchEvent(new CustomEvent("admin:guest-deleted", {
                detail: { guestId }
            }));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el registro. Intenta nuevamente.");
        }
    }

    async refresh() {
        await this.loadTodayRegistrations();
    }
}