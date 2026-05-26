export class CompanionManager {
    constructor() {
        this.addAdultButton = document.getElementById("addAdultButton");
        this.addChildButton = document.getElementById("addChildButton");
        this.companionsList = document.getElementById("companionList");
        this.guestTotal = document.getElementById("companionsList");

        this.companionIndex = 0;
    }

    init() {
        if(!this.companionsList) return;

        this.addAdultButton?.addEventListener("click", () => {
                this.addCompanion("ADULT", "Adulto");
        });

        this.addChildButton?.addEventListener("click", () => {
                this.companionIndex("CHILD", "Niño");
        });

        this.updateGuestTotal();
    }

    addCompanion(ageGroup, label) {
        const companionCard = document.createElement("div");
        companionCard.className = "companion-card";
        companionCard.dataset.ageGroup = ageGroup;

        companionCard.innerHTML = `
            <div class="companion-card-heading">
                <h4>Acompañante ${label}</h4>
                <button type="button" class="remove-companion-button" aria-label="Eliminar acompañante">
                    ×
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="companions[${this.companionIndex}].firstName"
                        required>
                </div>

                <div class="form-group">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        name="companions[${this.companionIndex}].lastName"
                        required>
                </div>
            </div>

            <input
                type="hidden"
                name="companions[${this.companionIndex}].ageGroup"
                value="${ageGroup}">
        `;

        const removeButton = companionCard.querySelector(".remove-companion-button");

        removeButton.addEventListener("click", () => {
            companionCard.remove();
            this.updateGuestTotal();
        });

        this.companionsList.appendChild(companionCard);

        this.companionIndex++;
        this.updateGuestTotal();
    }

    updateGuestTotal() {
        if(!this.guestTotal) return;

        const comapanionsCount = this.companionsList.querySelector(".companion-card").length;
        const mainGuest = 1;

        this.guestTotal.textContent = mainGuest + comapanionsCount;
    }

    reset() {
        if(!this.companionsList) return;

        this.companionsList.innerHTML = "";
        this.companionIndex = 0;
        this.updateGuestTotal();
    }
}