export class SiteNavigation {
    constructor() {
        this.nav = document.querySelector(".site-nav");
        this.toggleButton = document.querySelector(".site-nav-toggle");
        this.navLinks = document.querySelectorAll(".site-nav-menu a");
    }

    init() {
        if (!this.nav || !this.toggleButton) {
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        this.toggleButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleMenu();
        });

        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                this.closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            const clickedInsideNav = this.nav.contains(event.target);

            if (!clickedInsideNav) {
                this.closeMenu();
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.nav.classList.toggle("is-open");
    }

    closeMenu() {
        this.nav.classList.remove("is-open");
    }
}