export class GalleryCarousel {
    constructor() {
        this.track = document.getElementById("galleryTrack");
        this.prevButton = document.getElementById("galleryPrev");
        this.nextButton = document.getElementById("galleryNext");

        this.lightbox = document.getElementById("galleryLightbox");
        this.lightboxImage = document.getElementById("lightboxImage");
        this.lightboxClose = document.getElementById("lightboxClose");
        this.lightboxPrev = document.getElementById("lightboxPrev");
        this.lightboxNext = document.getElementById("lightboxNext");

        this.slides = Array.from(document.querySelectorAll(".gallery-slide"));
        this.currentIndex = 0;
        this.currentLightboxIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlaySpeed = 2600;
    }

    init() {
        if (!this.track || this.slides.length === 0) return;

        this.prevButton?.addEventListener("click", () => this.movePrev());
        this.nextButton?.addEventListener("click", () => this.moveNext());

        this.slides.forEach((slide, index) => {
            slide.addEventListener("click", () => this.openLightbox(index));
        });

        this.lightboxClose?.addEventListener("click", () => this.closeLightbox());

        this.lightboxPrev?.addEventListener("click", (event) => {
            event.stopPropagation();
            this.showLightboxPrev();
        });

        this.lightboxNext?.addEventListener("click", (event) => {
            event.stopPropagation();
            this.showLightboxNext();
        });

        this.lightbox?.addEventListener("click", (event) => {
            if (event.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        document.addEventListener("keydown", (event) => this.handleKeyboard(event));
        window.addEventListener("resize", () => this.updateCarousel());

        this.startAutoPlay();
        this.updateCarousel();
    }

    moveNext() {
        const maxIndex = this.getMaxIndex();

        if (this.currentIndex >= maxIndex) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }

        this.updateCarousel();
    }

    movePrev() {
        const maxIndex = this.getMaxIndex();

        if (this.currentIndex <= 0) {
            this.currentIndex = maxIndex;
        } else {
            this.currentIndex--;
        }

        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.slides[0]) return;

        const slideWidth = this.slides[0].getBoundingClientRect().width;
        const gap = this.getTrackGap();
        const movement = this.currentIndex * (slideWidth + gap);

        this.track.style.transform = `translateX(-${movement}px)`;
    }

    getTrackGap() {
        const trackStyles = window.getComputedStyle(this.track);
        return parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    }

    getVisibleSlidesCount() {
        const wrapper = this.track.parentElement;

        if (!wrapper || !this.slides[0]) return 1;

        const slideWidth = this.slides[0].getBoundingClientRect().width;
        const gap = this.getTrackGap();

        if (slideWidth === 0) return 1;

        return Math.max(1, Math.floor((wrapper.offsetWidth + gap) / (slideWidth + gap)));
    }

    getMaxIndex() {
        const visibleSlides = this.getVisibleSlidesCount();
        return Math.max(0, this.slides.length - visibleSlides);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.moveNext();
        }, this.autoPlaySpeed);
    }

    openLightbox(index) {
        const image = this.slides[index].querySelector("img");

        if (!image || !this.lightbox || !this.lightboxImage) return;

        this.currentLightboxIndex = index;
        this.lightboxImage.src = image.getAttribute("src");
        this.lightboxImage.alt = image.alt;

        this.lightbox.classList.add("active");
        this.lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("gallery-open");
    }

    closeLightbox() {
        if (!this.lightbox) return;

        this.lightbox.classList.remove("active");
        this.lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("gallery-open");
    }

    showLightboxNext() {
        this.currentLightboxIndex++;

        if (this.currentLightboxIndex >= this.slides.length) {
            this.currentLightboxIndex = 0;
        }

        this.updateLightboxImage();
    }

    showLightboxPrev() {
        this.currentLightboxIndex--;

        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.slides.length - 1;
        }

        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const image = this.slides[this.currentLightboxIndex].querySelector("img");

        if (!image || !this.lightboxImage) return;

        this.lightboxImage.src = image.getAttribute("src");
        this.lightboxImage.alt = image.alt;
    }

    handleKeyboard(event) {
        const lightboxIsOpen = this.lightbox?.classList.contains("active");

        if (!lightboxIsOpen) return;

        if (event.key === "Escape") {
            this.closeLightbox();
        }

        if (event.key === "ArrowRight") {
            this.showLightboxNext();
        }

        if (event.key === "ArrowLeft") {
            this.showLightboxPrev();
        }
    }
}