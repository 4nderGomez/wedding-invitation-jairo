export class AdminGuestsTable {
    constructor(deleteModal) {
        this.endpoint = "/admin/api/guests";
        this.deleteEndpoint = "/admin/api/guests";

        this.deleteModal = deleteModal;

        this.guests = [];

        this.tableBody = document.getElementById("guestsTableBody");
        this.tableWrapper = document.getElementById("guestsTableWrapper");
        this.emptyState = document.getElementById("guestsEmptyState");

        this.searchInput = document.getElementById("guestSearchInput");
        this.sideFilter = document.getElementById("guestSideFilter");
        this.typeFilter = document.getElementById("guestTypeFilter");
        this.attendanceFilter = document.getElementById("guestAttendanceFilter");
        this.clearButton = document.getElementById("clearGuestFiltersButton");
    }

    async init() {
        if (!this.deleteModal) {
            throw new Error("AdminDeleteModal no fue inyectado en AdminGuestsTable.");
        }

        await this.loadGuests();
        this.bindEvents();
    }

    async refresh() {
        await this.loadGuests();
    }

    async loadGuests() {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error("No se pudieron cargar los invitados.");
            }

            const guests = await response.json();

            this.guests = guests.sort((a, b) => {
                return this.normalizeText(a.firstName).localeCompare(this.normalizeText(b.firstName));
            });

            this.applyFilters();
        } catch (error) {
            console.error(error);
        }
    }

    bindEvents() {
        this.searchInput.addEventListener("input", () => this.applyFilters());
        this.sideFilter.addEventListener("change", () => this.applyFilters());
        this.typeFilter.addEventListener("change", () => this.applyFilters());
        this.attendanceFilter.addEventListener("change", () => this.applyFilters());

        this.clearButton.addEventListener("click", () => {
            this.searchInput.value = "";
            this.sideFilter.value = "";
            this.typeFilter.value = "";
            this.attendanceFilter.value = "";

            this.render(this.guests);
        });

        this.tableBody.addEventListener("click", async (event) => {
            const deleteButton = event.target.closest(".delete-button");

            if (!deleteButton) return;

            const guestId = deleteButton.dataset.guestId;
            const confirmed = await this.deleteModal.open();

            if (!confirmed) return;

            await this.deleteGuest(guestId);
        });
    }

    applyFilters() {
        const searchTerm = this.normalizeText(this.searchInput.value);
        const side = this.sideFilter.value;
        const type = this.typeFilter.value;
        const attendance = this.attendanceFilter.value;

        const filteredGuests = this.guests.filter((guest) => {
            const firstName = this.normalizeText(guest.firstName);
            const lastName = this.normalizeText(guest.lastName);
            const fullName = `${firstName} ${lastName}`;

            const matchesSearch =
                !searchTerm ||
                firstName.includes(searchTerm) ||
                lastName.includes(searchTerm) ||
                fullName.includes(searchTerm);

            const matchesSide = !side || guest.guestSide === side;
            const matchesAttendance = !attendance || guest.attendanceStatus === attendance;

            const matchesType =
                !type ||
                (type === "ADULT" && (guest.adultCompanionsCount ?? 0) > 0) ||
                (type === "CHILD" && (guest.childCompanionsCount ?? 0) > 0);

            return matchesSearch && matchesSide && matchesAttendance && matchesType;
        });

        this.render(filteredGuests);
    }

    render(guests) {
        this.tableBody.innerHTML = "";

        if (!guests || guests.length === 0) {
            this.emptyState.hidden = false;
            this.tableWrapper.hidden = true;
            return;
        }

        this.emptyState.hidden = true;
        this.tableWrapper.hidden = false;

        guests.forEach((guest) => {
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
                <td>${this.formatDate(guest.registeredAt)}</td>
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
                throw new Error("No se pudo eliminar el invitado.");
            }

            await this.refresh();

            document.dispatchEvent(new CustomEvent("admin:guest-deleted", {
                detail: { guestId }
            }));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el invitado. Intenta nuevamente.");
        }
    }

    formatGuestSide(guestSide) {
        if (guestSide === "NOVIO") return "Novio";
        if (guestSide === "NOVIA") return "Novia";
        return "-";
    }

    formatAttendance(attendanceStatus) {
        if (attendanceStatus === "ATTENDING") {
            return `<span class="status-badge is-attending">Sí asistirá</span>`;
        }

        if (attendanceStatus === "NOT_ATTENDING") {
            return `<span class="status-badge is-declined">No asistirá</span>`;
        }

        return "-";
    }

    formatDate(value) {
        if (!value) return "-";

        const date = new Date(value);

        return new Intl.DateTimeFormat("es-MX", {
            dateStyle: "medium"
        }).format(date);
    }

    safeText(value) {
        return value && value.trim() !== "" ? value : "-";
    }

    normalizeText(value) {
        return (value ?? "")
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
}