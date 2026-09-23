export class AdminSidebar {
    constructor() {
        this.navigation = document.querySelector(".admin-bottom-nav");
        this.navLinks = document.querySelectorAll(".admin-bottom-nav .nav-link");
        this.sections = document.querySelectorAll("main section[id]");
        this.observer = null;
    }

    init() {
        if (!this.navigation || !this.navLinks.length)
            return;

        this.bindEvents();
        this.observeSections();
    }

    bindEvents() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                    const href = link.getAttribute("href");

                    if (!href || !href.startsWith("#"))
                        return;

                    const sectionId = href.substring(1);

                    this.setActiveLink(sectionId);
                }
            );
        });
    }

    observeSections() {
        if (!this.sections.length)
            return;

        this.observer =
            new IntersectionObserver((entries) => {
                    const visibleEntries =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )

                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (!visibleEntries.length)
                        return;


                    const activeSection = visibleEntries[0].target;

                    this.setActiveLink(activeSection.id);
                }, {
                    root: null,

                    threshold: [
                        0.15,
                        0.30,
                        0.50,
                        0.70
                    ],

                    rootMargin:
                        "-15% 0px -55% 0px"
                }
            );

        this.sections.forEach((section) => {
                this.observer.observe(section);
            }
        );
    }

    setActiveLink(sectionId) {
        this.clearActiveLinks();

        const activeLink = document.querySelector(`.admin-bottom-nav .nav-link[href="#${sectionId}"]`);

        if (!activeLink) 
            return;

        activeLink.classList.add("is-active");
        activeLink.setAttribute("aria-current", "page");
    }

    clearActiveLinks() {
        this.navLinks.forEach((link) => {
                link.classList.remove("is-active"
                );
                link.removeAttribute("aria-current"
                );
            }
        );
    }
}