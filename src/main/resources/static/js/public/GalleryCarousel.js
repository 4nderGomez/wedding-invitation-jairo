export class GalleryCarousel {
    constructor() {
        this.section = document.getElementById("photos");
        this.carousel = document.getElementById("galleryCarousel");
        this.track = document.getElementById("galleryTrack");
        this.wrapper = this.track?.parentElement ?? null;
        this.prevButton = document.getElementById("galleryPrev");
        this.nextButton = document.getElementById("galleryNext");
        this.lightbox = document.getElementById("galleryLightbox");
        this.lightboxImage = document.getElementById("lightboxImage");
        this.lightboxClose = document.getElementById("lightboxClose");
        this.lightboxPrev = document.getElementById("lightboxPrev");
        this.lightboxNext = document.getElementById("lightboxNext");
        this.slides = this.track ? Array.from(this.track.querySelectorAll(".gallery-slide")) : [];
        this.clones = [];
        this.offset = 0;
        this.cycleWidth = 0;
        this.slideStep = 0;
        this.desktopSpeed = 40;
        this.mobileSpeed = 32;
        this.animationFrameId = null;
        this.lastFrameTime = null;
        this.tween = null;
        this.isVisible = false;
        this.isDragging = false;
        this.isLightboxOpen = false;
        this.dragDistance = 0;
        this.preventSlideClick = false;
        this.currentLightboxIndex = 0;
        this.lastFocusedElement = null;
        this.observer = null;
        this.resizeFrame = null;
        this.preloadedFullImages = new Set();
        this.isDragging = false;
        this.isPointerDown = false;
        this.pointerStartX = 0;
        this.pointerStartY = 0;
        this.lastPointerX = 0;
        this.activePointerId = null;
        this.dragThreshold = 10;
    }

    init() {
        if (!this.track || !this.wrapper || this.slides.length === 0)
            return;

        this.prepareSlides();
        this.createInfiniteLoop();
        this.bindEvents();
        this.initVisibilityObserver();

        requestAnimationFrame(() => {
                this.measure();
                this.render();
            }
        );
    }

    prepareSlides() {
        this.slides.forEach( (slide, index) => {
                slide.dataset.galleryIndex = String(index);
                slide.setAttribute("role", "button");
                slide.setAttribute("tabindex", "0");
            }
        );
    }

    createInfiniteLoop() {
        const fragment = document.createDocumentFragment();

        this.slides.forEach(
            (slide, index) => {
                const clone = slide.cloneNode(true);

                clone.dataset.galleryIndex = String(index);
                clone.dataset.galleryClone = "true";
                clone.setAttribute("aria-hidden", "true");
                clone.removeAttribute("role");
                clone.removeAttribute("tabindex");


                const image = clone.querySelector("img");

                if (image) {
                    image.alt = "";
                    image.loading = "lazy";
                    image.decoding = "async";
                }

                this.clones.push(clone);

                fragment.appendChild(clone);
            }
        );

        this.track.appendChild(fragment);
    }

    bindEvents() {
        this.prevButton?.addEventListener("click", () => {
                    this.movePrev();
                }
            );

        this.nextButton?.addEventListener("click", () => {
                    this.moveNext();
                }
            );

        this.track.addEventListener("click", (event) => {
                if (this.preventSlideClick)
                    return;

                const slide = event.target.closest(".gallery-slide");

                if (!slide)
                    return;

                const index = Number(slide.dataset.galleryIndex);

                if (Number.isNaN(index))
                    return;

                this.openLightbox(index);
            }
        );

        this.track.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ")
                    return;

                const slide = event.target.closest(".gallery-slide");

                if (!slide || slide.dataset.galleryClone === "true")
                    return;

                event.preventDefault();

                this.openLightbox(Number(slide.dataset.galleryIndex));
            }
        );

        this.lightboxClose?.addEventListener("click", () => {
                    this.closeLightbox();
                }
            );

        this.lightboxPrev?.addEventListener("click", (event) => {
                    event.stopPropagation();

                    this.showLightboxPrev();
                }
            );

        this.lightboxNext?.addEventListener("click", (event) => {
                    event.stopPropagation();

                    this.showLightboxNext();
                }
            );

        this.lightbox?.addEventListener("click", (event) => {
                    if (event.target === this.lightbox)
                        this.closeLightbox();
                }
            );

        document.addEventListener("keydown", (event) => {
                this.handleKeyboard(event);
            }
        );

        window.addEventListener("resize", () => {
                if ( this.resizeFrame !== null)
                    return;

                this.resizeFrame =requestAnimationFrame(() => {
                            this.resizeFrame = null;
                            this.measure();
                        }
                    );
            }, {
                passive: true
            }
        );

        document.addEventListener("visibilitychange", () => {
                this.lastFrameTime = null;
                this.updatePlayback();
            }
        );

        this.bindDrag();
    }

    bindDrag() {
        this.wrapper.addEventListener("pointerdown",(event) => {
                if (event.pointerType === "mouse" && event.button !== 0)
                    return;

                this.isPointerDown = true;
                this.isDragging = false;
                this.activePointerId = event.pointerId;
                this.pointerStartX = event.clientX;
                this.pointerStartY = event.clientY;
                this.lastPointerX = event.clientX;
                this.dragDistance = 0;
                this.tween = null;
                this.updatePlayback();
            }
        );

        this.wrapper.addEventListener("pointermove", (event) => {
                if (!this.isPointerDown || event.pointerId !== this.activePointerId)
                    return;

                const totalX = event.clientX - this.pointerStartX;
                const totalY = event.clientY - this.pointerStartY;

                if (!this.isDragging) {
                    const horizontalDistance = Math.abs(totalX);
                    const verticalDistance = Math.abs(totalY);

                    if (horizontalDistance < this.dragThreshold)
                        return;

                    if (verticalDistance > horizontalDistance) {
                        this.isPointerDown = false;
                        this.activePointerId = null;
                        this.updatePlayback();

                        return;
                    }

                    this.isDragging = true;
                    this.wrapper.classList.add("is-dragging");

                    try {
                        this.wrapper.setPointerCapture(event.pointerId);
                    } catch {
                        
                    }

                    this.lastPointerX = event.clientX;

                    return;
                }

                const deltaX = event.clientX - this.lastPointerX;

                this.lastPointerX = event.clientX;
                this.dragDistance += Math.abs(deltaX);
                this.offset -= deltaX;
                this.normalizeOffset();
                this.render();
            }
        );

        const finishPointer = (event) => {
                if (event.pointerId !== this.activePointerId)
                    return;

                const wasDragging = this.isDragging;

                this.isPointerDown = false;
                this.isDragging = false;
                this.activePointerId = null;
                this.wrapper.classList.remove("is-dragging");

                if ( wasDragging &&
                    this.wrapper
                        .hasPointerCapture?.(
                            event.pointerId
                        )
                ) {
                    try {
                        this.wrapper.releasePointerCapture(event.pointerId);
                    } catch {
                        // Nada que hacer.
                    }
                }

                if (wasDragging) {
                    this.preventSlideClick = true;

                    requestAnimationFrame(() => {
                            this.preventSlideClick = false;
                        }
                    );

                }

                this.updatePlayback();
            };

        this.wrapper.addEventListener("pointerup", finishPointer);
        this.wrapper.addEventListener("pointercancel", finishPointer);
    }

    initVisibilityObserver() {
        const target = this.section ?? this.carousel;

        if (!target)
            return;

        if (!("IntersectionObserver" in window)) {
            this.isVisible = true;
            this.updatePlayback();

            return;
        }

        this.observer = new IntersectionObserver((entries) => {
                    const entry = entries[0];

                    this.isVisible = entry.isIntersecting;

                    if (this.isVisible) {
                        requestAnimationFrame(() => {
                                this.measure();
                                this.updatePlayback();
                            }
                        );
                    } else
                        this.updatePlayback();
                }, {
                    root: null,
                    threshold: [
                        0,
                        0.08,
                        0.2
                    ]
                }
            );

        this.observer.observe(target);
    }

    measure() {
        if (!this.slides[0] || !this.clones[0] || !this.track)
            return;

        const firstOriginal = this.slides[0];
        const firstClone = this.clones[0];
        const styles = window.getComputedStyle(this.track);
        const gap = parseFloat(
                styles.columnGap ||
                styles.gap
            ) || 0;
        const slideWidth = firstOriginal.getBoundingClientRect().width;

        this.slideStep = slideWidth + gap;
        this.cycleWidth = firstClone.offsetLeft - firstOriginal.offsetLeft;

        if (this.cycleWidth <= 0 && this.slideStep > 0)
            this.cycleWidth = this.slideStep * this.slides.length;

        this.normalizeOffset();
        this.render();
        this.updatePlayback();
    }

    getSpeed() {
        return (
            window.innerWidth <= 768
                ? this.mobileSpeed
                : this.desktopSpeed
        );
    }

    shouldMove() {
        return (
            this.isVisible &&
            !document.hidden &&
            !this.isPointerDown &&
            !this.isDragging &&
            !this.isLightboxOpen &&
            this.cycleWidth > 0
        );
    }

    updatePlayback() {
        const needsFrame = this.tween !== null || this.shouldMove();

        if (needsFrame) {
            if (this.animationFrameId === null) {
                this.lastFrameTime = null;
                this.requestFrame();
            }

            return;
        }

        this.stopFrame();
    }

    requestFrame() {
        if (this.animationFrameId !== null)
            return;

        this.animationFrameId = requestAnimationFrame((time) => {
                    this.animate(time);
                }
            );
    }

    stopFrame() {
        if (this.animationFrameId !== null)
            cancelAnimationFrame(this.animationFrameId);

        this.animationFrameId = null;
        this.lastFrameTime = null;
    }

    animate(time) {
        this.animationFrameId = null;

        if (this.lastFrameTime === null)
            this.lastFrameTime = time;

        const delta = Math.min(
                (
                    time -
                    this.lastFrameTime
                ) / 1000,
                0.05
            );

        this.lastFrameTime = time;

        if (this.tween)
            this.updateTween(time);
        else if (
            this.shouldMove()) {
            this.offset += this.getSpeed() * delta;
            this.normalizeOffset();
        }

        this.render();

        if (this.tween !== null || this.shouldMove())
            this.requestFrame();
        else
            this.lastFrameTime = null;
    }

    render() {
        this.track.style.transform =
            `translate3d(
                ${-this.offset}px,
                0,
                0
            )`;
    }

    normalizeOffset() {
        if (this.cycleWidth <= 0)
            return;

        this.offset =(
                (
                    this.offset %
                    this.cycleWidth
                ) +
                this.cycleWidth
            ) %
            this.cycleWidth;
    }

    moveNext() {
        this.moveBySlide(1);
    }

    movePrev() {
        this.moveBySlide(-1);
    }

    moveBySlide(direction) {
        if (this.slideStep <= 0 || this.cycleWidth <= 0)
            this.measure();

        if (this.slideStep <= 0)
            return;

        if (direction < 0 && this.offset < this.slideStep) {
            this.offset += this.cycleWidth;
            this.render();
        }

        this.tween = {
            start: this.offset,
            target:
                this.offset +
                (
                    direction *
                    this.slideStep
                ),
            startedAt:
                performance.now(),
            duration:
                720
        };

        this.updatePlayback();
    }


    updateTween(time) {
        if (!this.tween)
            return;

        const progress = Math.min(
                (
                    time -
                    this.tween.startedAt
                ) /
                this.tween.duration,
                1
            );

        const eased = 1 -
            Math.pow(
                1 - progress,
                5
            );

        this.offset = this.tween.start +
            (
                this.tween.target -
                this.tween.start
            ) * eased;

        if (progress >= 1) {
            this.tween = null;
            this.normalizeOffset();
        }

    }

    openLightbox(index) {
        if (!this.lightbox || !this.lightboxImage)
            return;

        this.currentLightboxIndex = index;
        this.isLightboxOpen = true;
        this.lastFocusedElement = document.activeElement;
        this.updateLightboxImage();
        this.lightbox.classList.add("active");
        this.lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("gallery-open");

        this.updatePlayback();

        requestAnimationFrame(() => {
                this.lightboxClose
                    ?.focus({
                        preventScroll: true
                    });
            }
        );
    }

    closeLightbox() {
        if (!this.lightbox)
            return;

        this.isLightboxOpen = false;
        this.lightbox.classList.remove("active");
        this.lightbox.setAttribute("aria-hidden","true");

        document.body.classList.remove("gallery-open");

        this.lastFocusedElement?.focus?.({
                preventScroll: true
            });

        this.updatePlayback();
    }

    showLightboxNext() {
        this.currentLightboxIndex = (
                this.currentLightboxIndex +
                1
            ) %
            this.slides.length;

        this.updateLightboxImage();
    }


    showLightboxPrev() {
        this.currentLightboxIndex = (
                this.currentLightboxIndex -
                1 +
                this.slides.length
            ) %
            this.slides.length;

        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const image = this.slides[
                this.currentLightboxIndex
            ]?.querySelector(
                "img"
            );

        if (!image || !this.lightboxImage)
            return;

        const fullSrc =
            image.dataset.fullSrc ||
            image.currentSrc ||
            image.src;


        const fullSrcset = image.dataset.fullSrcset;

        this.lightboxImage.removeAttribute("srcset" );

        if (fullSrcset) {
            this.lightboxImage.srcset = fullSrcset;
            this.lightboxImage.sizes = "(max-width: 768px) 82vw, 760px";
        }

        this.lightboxImage.src = fullSrc;
        this.lightboxImage.alt = image.alt;
        this.lightboxImage.fetchPriority = "high";

        this.preloadLightboxNeighbors();
    }


    preloadLightboxNeighbors() {
        const indexes = [ (
                this.currentLightboxIndex -
                1 +
                this.slides.length
            ) %
            this.slides.length,

            (
                this.currentLightboxIndex +
                1
            ) %
            this.slides.length

        ];

        indexes.forEach( (index) => {
                if (this.preloadedFullImages.has(index))
                    return;

                const image = this.slides[index]?.querySelector("img");

                if (!image)
                    return;

                const preload = new Image();

                preload.decoding = "async";

                if (image.dataset.fullSrcset) {
                    preload.srcset = image.dataset.fullSrcset;
                    preload.sizes = "(max-width: 768px) 82vw, 760px";
                }

                preload.src =
                    image.dataset.fullSrc ||
                    image.currentSrc ||
                    image.src;

                this.preloadedFullImages.add(index);
            }
        );

    }

    handleKeyboard(event) {

        if (
            !this.isLightboxOpen
        ) {
            return;
        }


        switch (event.key) {

            case "Escape":

                this.closeLightbox();

                break;


            case "ArrowRight":

                this.showLightboxNext();

                break;


            case "ArrowLeft":

                this.showLightboxPrev();

                break;

        }

    }

}