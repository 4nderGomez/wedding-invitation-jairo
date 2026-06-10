export class AdminSidebar {
    constructor() {
        this.sidebar = document.querySelector(".admin-sidebar");
        this.toggleButton = document.querySelector(".sidebar-toggle-button");
        this.navLinks = document.querySelectorAll(".nav-link");
        this.sections = document.querySelectorAll("main section[id]");
    }

    init() {
        if (!this.sidebar) {
            return;
        }

        this.bindEvents();
        this.observeSections();
    }

    bindEvents() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                this.clearActiveLinks();
                link.classList.add("is-active");
                this.closeMobileMenu();
            });
        });

        if (this.toggleButton) {
            this.toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        document.addEventListener("click", (event) => {
            const clickedInsideSidebar = this.sidebar.contains(event.target);
            const clickedToggleButton = this.toggleButton?.contains(event.target);

            if (!clickedInsideSidebar && !clickedToggleButton) {
                this.closeMobileMenu();
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeMobileMenu();
            }
        });
    }

    observeSections() {
        if (!this.sections.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        this.setActiveLink(sectionId);
                    }
                });
            },
            {
                root: null,
                threshold: 0.35,
                rootMargin: "-120px 0px -45% 0px"
            }
        );

        this.sections.forEach((section) => observer.observe(section));
    }

    toggleMobileMenu() {
        this.sidebar.classList.toggle("is-open");
        this.updateToggleButton();
    }

    closeMobileMenu() {
        this.sidebar.classList.remove("is-open");
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (!this.toggleButton) {
            return;
        }

        const isOpen = this.sidebar.classList.contains("is-open");

        this.toggleButton.textContent = isOpen ? "×" : "☰";
        this.toggleButton.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú de administración" : "Abrir menú de administración"
        );
    }

    setActiveLink(sectionId) {
        this.clearActiveLinks();

        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (activeLink) {
            activeLink.classList.add("is-active");
        }
    }

    clearActiveLinks() {
        this.navLinks.forEach((link) => {
            link.classList.remove("is-active");
        });
    }
}