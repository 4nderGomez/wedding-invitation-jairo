export class RsvpValidator {
    validateForm(form) {
        if(!form) return false;

        const requiredFields = form.querySelectorAll("[required>]");
        let isValid = true;

        requiredFields.forEach((field) => {
            if(!field.value.trim()) {
                this.markFiledAsInvalid(field);
                isValid = false;
            } else
                this.clearFieldError(field);
        });

        return isValid;
    }

    markFieldAsInvalid(field) {
        field.classList.add("is-invalid");

        const formGroup = field.closest(".form-group");

        if(!formGroup) return;

        let errorMessage = formGroup.querySelector(".field-error");

        if(!errorMessage) {
            errorMessage = document.createElement("small");
            errorMessage.className = "field-error";
            formGroup.appendChild(errorMessage);
        }

        errorMessage.textContent = "Este campo es obligatorio";
    }

    clearFieldError(field) {
        field.classList.remove("is-invalid");

        const formGroup = field.closest(".form-group");
        const errorMessage = formGroup?.querySelector(".field-error");

        if(errorMessage)
            errorMessage.remove();
    }
}