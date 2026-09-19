export class SiteNavigation {
    constructor() {
        this.nav = document.querySelector(".site-nav");
        this.toggleButton = document.getElementById("siteNavToggle");
        this.closeButton = document.getElementById("siteNavClose");
        this.menu = document.getElementById("siteNavMenu");
        this.backdrop = document.getElementById("siteNavBackdrop");

        this.navLinks = this.menu ? Array.from(
            this.menu.querySelectorAll(
                ".site-nav-link"
            )
        ) : [];

        this.sectionObserver = null;
        this.sectionStates = new Map();
        this.navTargets = [];
        this.isMenuOpen = false;
        this.previouslyFocusedElement = null;
    }

    init() {
        if (!this.nav || !this.toggleButton || !this.closeButton || !this.menu || !this.backdrop)
            return;

        this.setMenuAccessibility(false);
        this.bindEvents();
        this.initActiveSectionObserver();
    }

    bindEvents() {
        this.toggleButton.addEventListener("click", () => {
                    this.toggleMenu();
                }
            );

        this.closeButton.addEventListener("click", () => {
                    this.closeMenu(true);
                }
            );

        this.backdrop.addEventListener("click", () => {
            this.closeMenu(true);
        });

        this.menu.addEventListener("click", (event) => {
                    const link = event.target.closest(".site-nav-link");

                    if (!link)
                        return;

                    this.closeMenu(false);
                }
            );

        document.addEventListener("keydown", (event) => {
                    if (!this.isMenuOpen)
                        return;

                    if (event.key === "Escape") {
                        event.preventDefault();
                        this.closeMenu(true);

                        return;
                    }

                    if (event.key === "Tab")
                        this.handleFocusTrap(event);
                }
            );
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu(true);

            return;
        }

        this.openMenu();
    }

    openMenu() {
        if (this.isMenuOpen)
            return;

        this.isMenuOpen = true;
        this.previouslyFocusedElement = document.activeElement;
        this.setMenuAccessibility(true);
        this.nav.classList.add("is-open");

        document.body.classList.add("site-nav-open");

        window.setTimeout(() => {
                if (!this.isMenuOpen)
                    return;

                this.closeButton.focus({preventScroll: true});
            },
            450
        );
    }

    closeMenu(restoreFocus = false) {
        if (!this.isMenuOpen)
            return;

        this.isMenuOpen = false;
        this.nav.classList.remove("is-open");

        document.body.classList.remove("site-nav-open");

        this.setMenuAccessibility(false);

        if (restoreFocus) {
            window.setTimeout(() => {
                    this.toggleButton
                        ?.focus({
                            preventScroll: true
                        });
                },
                300
            );
        }
    }

    setMenuAccessibility(isOpen) {
        this.toggleButton.setAttribute("aria-expanded", String(isOpen));
        this.toggleButton.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
        this.menu.setAttribute("aria-hidden", String(!isOpen));
        this.backdrop.setAttribute("aria-hidden", String(!isOpen));

        if (isOpen)
            this.menu.removeAttribute("inert");
        else
            this.menu.setAttribute("inert", "");
    }

    handleFocusTrap(event) {
        const focusableElements =
            Array.from(
                this.menu.querySelectorAll(
                    `
                    button:not([disabled]),
                    a[href],
                    [tabindex]:not([tabindex="-1"])
                    `
                )
            );

        if (!focusableElements.length)
            return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();

            return;
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();

        }
    }

    initActiveSectionObserver() {
        if (!("IntersectionObserver" in window))
            return;

        this.navTargets = this.navLinks.map((link) => {
                        const selector = link.getAttribute("href");

                        if (!selector?.startsWith("#"))
                            return null;

                        const section = document.querySelector(selector);

                        if (!section)
                            return null;

                        return {
                            link,
                            section
                        };

                    }
                )
                .filter(Boolean);

        if (!this.navTargets.length)
            return;

        this.navTargets.forEach(({ section }) => {
                    this.sectionStates
                        .set(section, 0);
                }
            );

        this.sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                            this.sectionStates
                                .set(
                                    entry.target,
                                    entry.isIntersecting
                                        ? entry.intersectionRatio
                                        : 0
                                );
                        }
                    );

                    this.updateActiveSection();
                },
                {
                    root: null,
                    rootMargin:
                        "-24% 0px -58% 0px",
                    threshold: [
                        0,
                        0.08,
                        0.18,
                        0.35,
                        0.6
                    ]
                }
            );

        this.navTargets.forEach(({ section }) => {
                this.sectionObserver.observe(section);
            }
        );
    }

    updateActiveSection() {
        const activeTarget =
            this.navTargets
                .map(
                    (target) => ({
                        ...target,

                        ratio:
                            this.sectionStates
                                .get(
                                    target.section
                                )
                            ?? 0
                    })
                )
                .filter(
                    ({ ratio }) =>
                        ratio > 0
                )
                .sort(
                    (a, b) =>
                        b.ratio -
                        a.ratio
                )[0];

        if (!activeTarget)
            return;

        this.navLinks.forEach((link) => {
                const isActive = link === activeTarget.link;

                link.classList.toggle("is-active", isActive);

                if (isActive)
                    link.setAttribute("aria-current", "location");
                else
                    link.removeAttribute("aria-current");
            }
        );
    }
}