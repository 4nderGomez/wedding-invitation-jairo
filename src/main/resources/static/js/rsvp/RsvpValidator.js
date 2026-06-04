export class RsvpValidator {
    validateForm(form) {
        if(!form) return false;

        const fields = form.querySelectorAll("input, select, textarea");
        let isValid = true;

        fields.forEach((field) => {
            if(!this.validateField(field))
                isValid = false;
        });

        return isValid;
    }

    validateField(field) {
        if(!field) return true;

        const value = field.value.trim();

        if(field.hasAttribute("required") && value === "") {
            this.markFieldAsInvalid(field, "Este campo es obligatorio");
            return false;
        }

        if(value === "") {
            this.clearFieldError(field);
            return true;
        }

        if(this.isNameField(field) && !this.isValidName(value)) {
            this.markFieldAsInvalid(field, "Escribe solo letras y espacios");
            return false;
        }

        if(this.isPhoneField(field) && !this.isValidPhone(value)) {
            this.markFieldAsInvalid(field, "Escribe un teléfono valido de 10 dígitos");
            return false;
        }

        if(this.isEmailField(field) && !this.isValidEmail(value)) {
            this.markFieldAsInvalid(field, "Escribe un correo electrónico válido");
            return false;
        }

        if(this.isCompanionCountField(field) && !this.isValidCompanionCount(value)) {
            this.markFieldAsInvalid(field, "Escribe un número entero entre 0 y 20");
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    isNameField(field) {
        const id = field.id?.toLowerCase() || "";
        const name = field.name?.toLowerCase() || "";

        return (
            id.includes("firstname") ||
            id.includes("lastname") ||
            name.includes("firstname") ||
            name.includes("lastname")
        );
    }

    isPhoneField(field) {
        const id = field.id?.toLowerCase() || "";
        const name = field.name?.toLowerCase() || "";

        return id.includes("phone") || name.includes("phone");
    }

    isEmailField(field) {
        return field.type === "email";
    }

    isCompanionCountField(field) {
        return (
            field.id == "adultCompanionsCount" || field.id == "childCompanionsCount"
        );
    }

    isValidName(value) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.'-]{2,60}$/.test(value);
    }

    isValidPhone(value) {
        const digitalOnly = value.replace(/\D/g, "");
        
        return digitalOnly.length === 10;
    }

    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    isValidCompanionCount(value) {
        if(value === "") return true;

        const count = Number(value);

        return Number.isInteger(count) && count >= 0 && count <= 20;
    }

    markFieldAsInvalid(field, message) {
        field.classList.add("is-invalid");

        const formGroup = field.closest(".form-group");

        if(!formGroup) return;

        let errorMessage = formGroup.querySelector(".field-error");

        if(!errorMessage) {
            errorMessage = document.createElement("small");
            errorMessage.className = "field-error";
            formGroup.appendChild(errorMessage);
        }

        errorMessage.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove("is-invalid");

        const formGroup = field.closest(".form-group");
        const errorMessage = formGroup?.querySelector(".field-error");

        if(errorMessage)
            errorMessage.remove();
    }
}