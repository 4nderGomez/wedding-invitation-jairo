export class AdminSidebar {
    constructor() {
        this.navLinks = document.querySelectorAll(".nav-link");
        this.sections = document.querySelectorAll("main section[id]");
    }

    init() {
        this.bindEvents();
        this.observeSections();
    }

    bindEvents() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                this.clearActiveLinks();
                link.classList.add("is-active");
            });
        });
    }

    observeSections() {
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