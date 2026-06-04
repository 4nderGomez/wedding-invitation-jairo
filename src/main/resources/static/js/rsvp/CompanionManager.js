export class CompanionManager {
    constructor() {
        this.adultCompanionsInput = document.getElementById("adultCompanionsCount");
        this.childCompanionsInput = document.getElementById("childCompanionsCount");
        this.guestTotal = document.getElementById("guestTotal");
    }

    init() {
        if (!this.adultCompanionsInput || !this.childCompanionsInput || !this.guestTotal) return;

        this.adultCompanionsInput.addEventListener("input", () => this.updateGuestTotal());
        this.childCompanionsInput.addEventListener("input", () => this.updateGuestTotal());

        this.updateGuestTotal();
    }

    updateGuestTotal() {
        if (!this.guestTotal) return;

        const mainGuest = 1;
        const adults = this.getValidCount(this.adultCompanionsInput);
        const children = this.getValidCount(this.childCompanionsInput);

        this.guestTotal.textContent = mainGuest + adults + children;
    }

    getValidCount(input) {
        const value = input?.value.trim();

        if (!value) return 0;

        const count = Number(value);

        if (!Number.isInteger(count)) return 0;
        if (count < 0) return 0;
        if (count > 20) return 20;

        return count;
    }

    reset() {
        if (this.adultCompanionsInput) {
            this.adultCompanionsInput.value = "";
        }

        if (this.childCompanionsInput) {
            this.childCompanionsInput.value = "";
        }

        this.updateGuestTotal();
    }
}