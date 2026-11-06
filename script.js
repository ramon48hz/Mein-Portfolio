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