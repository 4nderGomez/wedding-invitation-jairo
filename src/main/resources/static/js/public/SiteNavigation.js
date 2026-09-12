export class SiteNavigation {

    constructor() {

        this.nav = document.querySelector(".site-nav");
        this.toggleButton = document.getElementById("siteNavToggle");
        this.closeButton = document.getElementById("siteNavClose");
        this.menu = document.getElementById("siteNavMenu");
        this.backdrop = document.getElementById("siteNavBackdrop");
        this.navLinks = Array.from(document.querySelectorAll(".site-nav-link"));
        this.sectionObserver = null;
    }


    init() {
        if (
            !this.nav ||
            !this.toggleButton ||
            !this.closeButton ||
            !this.menu ||
            !this.backdrop
        ) {
            return;
        }

        this.setMenuAccessibility(false);
        this.bindEvents();
        this.initActiveSectionObserver();
    }


    bindEvents() {
        this.toggleButton.addEventListener("click", () => {
                    this.openMenu();
                }
            );

        this.closeButton.addEventListener("click", () => {
                    this.closeMenu(true);
                }
            );

        this.backdrop.addEventListener("click", () => {
                    this.closeMenu(true);
                }
            );

        this.navLinks.forEach((link) => {
                link.addEventListener("click", () => {
                        this.closeMenu();
                    }
                );
            });

        document.addEventListener("keydown", (event) => {
                const menuIsOpen = this.nav.classList.contains("is-open");

                if (event.key === "Escape" && menuIsOpen)
                    this.closeMenu(true);
            }
        );
    }


    toggleMenu() {

        const menuIsOpen =
            this.nav.classList
                .contains("is-open");


        if (menuIsOpen) {

            this.closeMenu();

            return;
        }


        this.openMenu();
    }


    openMenu() {
        this.nav.classList.add("is-open");
        document.body.classList.add("site-nav-open");

        this.setMenuAccessibility(true);

        window.setTimeout(() => {
                this.closeButton.focus();
            }, 120);
    }


    closeMenu(restoreFocus = false) {
        const menuIsOpen = this.nav.classList.contains("is-open");

        if (!menuIsOpen) return;

        this.nav.classList.remove("is-open");

        document.body.classList.remove("site-nav-open");

        this.setMenuAccessibility(false);

        if (restoreFocus) {
            window.setTimeout(() => {
                this.toggleButton.focus();
            }, 50
            );
        }
    }

    setMenuAccessibility(isOpen) {
        this.toggleButton.setAttribute("aria-expanded", String(isOpen));
        this.toggleButton.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación" );
        this.menu.setAttribute("aria-hidden", String(!isOpen));
        this.backdrop .setAttribute("aria-hidden", String(!isOpen));

        if (isOpen)
            this.menu.removeAttribute("inert");
        else
            this.menu.setAttribute("inert", "");
    }

    initActiveSectionObserver() {
        if (!("IntersectionObserver" in window))
            return;

        const targets =this.navLinks.map((link) => {
                    const selector =link.getAttribute("href");

                    if(!selector?.startsWith("#"))
                        return null;

                    const section = document.querySelector(selector);

                    return section ? {link, section} : null;
                }).filter(Boolean);

        if (!targets.length)
            return;

        this.sectionObserver =
            new IntersectionObserver(

                (entries) => {

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


                    if (
                        !visibleEntries.length
                    ) {
                        return;
                    }


                    const activeId =
                        `#${
                            visibleEntries[0]
                                .target
                                .id
                        }`;


                    this.navLinks
                        .forEach((link) => {

                            const isActive =
                                link.getAttribute(
                                    "href"
                                ) === activeId;


                            link.classList
                                .toggle(
                                    "is-active",
                                    isActive
                                );


                            if (isActive) {

                                link.setAttribute(
                                    "aria-current",
                                    "location"
                                );

                            } else {

                                link.removeAttribute(
                                    "aria-current"
                                );

                            }
                        });

                },
                {
                    root: null,
                    rootMargin:
                        "-24% 0px -58% 0px",
                    threshold: [
                        0.01,
                        0.12,
                        0.3
                    ]
                }
            );

        targets.forEach(
            ({ section }) => {
                this.sectionObserver
                    .observe(section);
            }
        );
    }
}