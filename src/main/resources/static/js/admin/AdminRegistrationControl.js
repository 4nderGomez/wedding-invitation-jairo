export class AdminRegistrationControl {
    constructor() {
        this.endpoint = "/admin/api/settings/registration";

        this.toggleButton = document.getElementById("toggleRegistrationButton");
        this.description = document.getElementById("registrationStatusDescription");
        this.counter = document.getElementById("registrationCounter");

        this.status = null;
    }

    async init() {
        await this.loadStatus();
        this.bindEvents();
    }

    bindEvents() {
        this.toggleButton.addEventListener("click", async () => {
            if (!this.status || this.status.locked) return;

            const nextEnabled = !this.status.enabled;

            if (!nextEnabled && this.status.disableCount === 2) {
                const confirmed = confirm(
                    "Este será el último intento para desactivar el registro. Después quedará bloqueado. ¿Deseas continuar?"
                );

                if (!confirmed) return;
            }

            await this.updateStatus(nextEnabled);
        });
    }

    async loadStatus() {
        const response = await fetch(this.endpoint);

        if (!response.ok) {
            throw new Error("No se pudo cargar el estado del registro.");
        }

        this.status = await response.json();
        this.render();
    }

    async updateStatus(enabled) {
        const csrfToken = document.querySelector("input[name='_csrf']")?.value;

        const response = await fetch(`${this.endpoint}?enabled=${enabled}`, {
            method: "PATCH",
            headers: csrfToken ? {
                "X-CSRF-TOKEN": csrfToken
            } : {}
        });

        if (!response.ok) {
            const errorText = await response.text();

            console.error("URL:", response.url);
            console.error("STATUS:", response.status);
            console.error("BODY:", errorText);

            throw new Error("No se pudo actualizar el registro.");
        }

        this.status = await response.json();
        this.render();
    }

    render() {
        this.toggleButton.classList.remove("is-enabled", "is-disabled", "is-locked");

        this.counter.textContent = `Intentos usados: ${this.status.disableCount} de ${this.status.maxDisableCount}`;

        if (this.status.locked) {
            this.toggleButton.textContent = "Bloqueado";
            this.toggleButton.classList.add("is-locked");
            this.toggleButton.disabled = true;

            this.description.textContent = "El control de registro fue bloqueado porque ya se usaron los 3 intentos de desactivación.";
            return;
        }

        this.toggleButton.disabled = false;

        if (this.status.enabled) {
            this.toggleButton.textContent = "Registro habilitado";
            this.toggleButton.classList.add("is-enabled");
            this.description.textContent = "Los invitados pueden confirmar su asistencia.";
        } else {
            this.toggleButton.textContent = "Registro deshabilitado";
            this.toggleButton.classList.add("is-disabled");
            this.description.textContent = "El botón Continuar está desactivado. Los invitados ya no pueden registrarse.";
        }
    }
}