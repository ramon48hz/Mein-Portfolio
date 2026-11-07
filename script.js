/* ==========================================================
   PROJEKTDETAILSEITEN – VIDEO-KARUSSELL

   Funktionen:
   - Navigation über Pfeiltasten
   - Horizontales Scrollen
   - Fortschrittsanzeige
   - Unterstützung für Touch und Trackpad
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("video-slider");
    const prevButton = document.getElementById("video-prev");
    const nextButton = document.getElementById("video-next");
    const progressBar = document.getElementById("video-progress");

    // Nur ausführen, wenn das Karussell existiert
    if (!slider || !prevButton || !nextButton || !progressBar) {
        return;
    }

    const getScrollAmount = () => {
        const card = slider.querySelector(".project-video-card");

        if (!card) return 300;

        const gap = parseFloat(getComputedStyle(slider).gap) || 0;

        return card.getBoundingClientRect().width + gap;
    };

    // Ein Video nach links
    prevButton.addEventListener("click", () => {
        slider.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    });

    // Ein Video nach rechts
    nextButton.addEventListener("click", () => {
        slider.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });
    });

    // Fortschrittsanzeige aktualisieren
    const updateProgress = () => {

        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (maxScroll <= 0) {
            progressBar.style.width = "100%";
            return;
        }

        const progress = slider.scrollLeft / maxScroll;

        // Fortschrittsbalken beginnt sichtbar
        const percentage = 20 + progress * 80;

        progressBar.style.width = `${percentage}%`;
    };

    slider.addEventListener("scroll", updateProgress, {
        passive: true
    });

    window.addEventListener("resize", updateProgress);

    updateProgress();

});
/* ==========================================
   FOTOGRAFIE – LIGHTBOX

   Öffnet Fotos in einer grossen Ansicht.
   Navigation per Buttons und Tastatur.
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Galerie und Lightbox suchen
    const gallery = document.querySelector("#photo-gallery");
    const lightbox = document.querySelector("#photo-lightbox");

    // Nur ausführen, wenn die Elemente vorhanden sind.
    // Dadurch funktioniert das Script auch auf anderen Seiten.
    if (!gallery || !lightbox) return;

    // Alle Bilder innerhalb der Galerie
    const galleryItems = Array.from(
        gallery.querySelectorAll(".photo-gallery-item")
    );

    // Lightbox-Elemente
    const lightboxImage = document.querySelector("#photo-lightbox-image");
    const closeButton = document.querySelector("#photo-lightbox-close");
    const prevButton = document.querySelector("#photo-lightbox-prev");
    const nextButton = document.querySelector("#photo-lightbox-next");
    const counter = document.querySelector("#photo-lightbox-counter");

    // Aktuell geöffnetes Bild
    let currentIndex = 0;

    // Merken, welches Element vor der Lightbox aktiv war
    let previousFocus = null;

    /* ======================================
       BILD ANZEIGEN
    ====================================== */

    function showImage(index) {

        // Index am Anfang/Ende wieder von vorne beginnen
        currentIndex = (index + galleryItems.length) % galleryItems.length;

        // Bild aus der Galerie übernehmen
        const image = galleryItems[currentIndex].querySelector("img");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        // Bildzähler aktualisieren
        counter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }


    /* ======================================
       LIGHTBOX ÖFFNEN
    ====================================== */

    function openLightbox(index) {

        previousFocus = document.activeElement;

        showImage(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        // Scrollen im Hintergrund verhindern
        document.body.style.overflow = "hidden";

        // Fokus auf Schliessen-Button setzen
        closeButton.focus();
    }


    /* ======================================
       LIGHTBOX SCHLIESSEN
    ====================================== */

    function closeLightbox() {

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        // Hintergrund wieder scrollbar machen
        document.body.style.overflow = "";

        // Bildquelle entfernen
        lightboxImage.src = "";

        // Fokus zurücksetzen
        if (previousFocus) {
            previousFocus.focus();
        }
    }


    /* ======================================
       KLICK AUF GALERIEBILDER
    ====================================== */

    galleryItems.forEach((item, index) => {

        item.addEventListener("click", () => {
            openLightbox(index);
        });

    });


    /* ======================================
       NAVIGATION
    ====================================== */

    prevButton.addEventListener("click", () => {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showImage(currentIndex + 1);
    });

    closeButton.addEventListener("click", closeLightbox);


    /* ======================================
       KLICK AUF DUNKLEN HINTERGRUND
    ====================================== */

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    /* ======================================
       TASTATURSTEUERUNG
    ====================================== */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }

    });

});

/* ==========================================
   ANIMATIONEN – SCROLL REVEAL
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Prüfen, ob reduzierte Animationen gewünscht sind
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Bei reduzierter Bewegung keine Animationen ausführen
    if (reducedMotion) return;

    // Alle Elemente mit der Klasse .reveal suchen
    const revealElements = document.querySelectorAll(".reveal");

    // Keine Elemente vorhanden? Script beenden.
    if (revealElements.length === 0) return;

    // Prüfen, ob IntersectionObserver unterstützt wird
    if (!("IntersectionObserver" in window)) return;

    // Animationsmodus aktivieren
    document.documentElement.classList.add("js-animations");

    // Observer erstellen
    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            // Nur reagieren, wenn Element sichtbar wird
            if (!entry.isIntersecting) return;

            // Element einblenden
            entry.target.classList.add("is-visible");

            // Element danach nicht mehr beobachten
            observer.unobserve(entry.target);

        });

    }, {

        // Animation starten, sobald ein Teil sichtbar wird
        threshold: 0.1,

        // Etwas früher auslösen
        rootMargin: "0px 0px -40px 0px"

    });

    // Alle Elemente beobachten
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

});