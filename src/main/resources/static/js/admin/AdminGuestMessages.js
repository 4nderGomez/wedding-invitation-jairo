export class AdminGuestMessages {
    constructor() {
        this.endpoint = "/admin/api/guests/messages";

        this.messages = [];

        this.feed = document.getElementById("messagesFeed");
        this.emptyState = document.getElementById("messagesEmptyState");

        this.searchInput = document.getElementById("messageSearchInput");
        this.attendanceFilter = document.getElementById("messageAttendanceFilter");
        this.clearButton = document.getElementById("clearMessageFiltersButton");
    }

    async init() {
        await this.loadMessages();
        this.bindEvents();
    }

    async refresh() {
        await this.loadMessages();
    }

    async loadMessages() {
        try {
            const response = await fetch(this.endpoint);

            if (!response.ok) {
                throw new Error("No se pudieron cargar los mensajes.");
            }

            this.messages = await response.json();
            this.render(this.messages);
        } catch (error) {
            console.error(error);
        }
    }

    bindEvents() {
        this.searchInput.addEventListener("input", () => {
            this.applyFilters();
        });

        this.attendanceFilter.addEventListener("change", () => {
            this.applyFilters();
        });

        this.clearButton.addEventListener("click", () => {
            this.searchInput.value = "";
            this.attendanceFilter.value = "";
            this.render(this.messages);
        });
    }

    applyFilters() {
        const searchTerm = this.normalizeText(this.searchInput.value);
        const attendance = this.attendanceFilter.value;

        const filteredMessages = this.messages.filter((message) => {
            const fullName = this.normalizeText(message.fullName);
            const matchesName = fullName.includes(searchTerm);
            const matchesAttendance = !attendance || message.attendanceStatus === attendance;

            return matchesName && matchesAttendance;
        });

        this.render(filteredMessages);
    }

    render(messages) {
        this.feed.innerHTML = "";

        if (!messages || messages.length === 0) {
            this.emptyState.hidden = false;
            return;
        }

        this.emptyState.hidden = true;

        messages.forEach((message) => {
            const article = document.createElement("article");
            article.classList.add("message-card");

            article.innerHTML = `
                <div class="message-item">
                    <p class="message-text">
                        ${this.safeText(message.message)}
                    </p>

                    <div class="message-meta">
                        <p class="message-author">
                            Atte: <strong>${this.safeText(message.fullName)}</strong>
                        </p>

                        ${this.formatAttendance(message.attendanceStatus)}
                    </div>
                </div>
            `;

            this.feed.appendChild(article);
        });
    }

    formatAttendance(attendanceStatus) {
        if (attendanceStatus === "ATTENDING") {
            return `<span class="message-status is-attending">Sí asistirá</span>`;
        }

        if (attendanceStatus === "NOT_ATTENDING") {
            return `<span class="message-status is-declined">No asistirá</span>`;
        }

        return "";
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