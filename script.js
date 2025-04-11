// Attendre que tout le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments clés de la page
    const scrollProgress = document.querySelector(".scrollProgress"); // élément représentant la progression (barre qui grandit)
    const scrollBar = document.querySelector(".barVertical");         // conteneur de la barre verticale
    const circle = document.querySelector(".circle");                 // point de départ de la barre
    const circleBas = document.querySelector(".circleBas");          // point d’arrêt de la barre

    // Fonction utilitaire : calcule la position verticale (par rapport au haut du document) d’un élément
    function getOffsetTop(elem) {
        let offsetTop = 0;
        while (elem) {
            offsetTop += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return offsetTop;
    }

    // Déterminer les limites haute et basse de la zone de progression de la barre
    const barTop = getOffsetTop(circle) + circle.offsetHeight; // position juste en dessous du point de départ
    const barBottom = getOffsetTop(circleBas);                 // position du point final
    const totalBarHeight = barBottom - barTop;                 // hauteur totale utilisable pour l’animation

    // Fonction principale exécutée à chaque scroll
    function updateScrollBar() {
        const scrollTop = window.scrollY || window.pageYOffset;       // position actuelle du scroll vertical
        const triggerPoint = getOffsetTop(circle) - 450;              // point de déclenchement de la barre (450px avant .circle)

        let progress = 0;

        // Si le scroll est dans la zone d’animation de la barre
        if (scrollTop >= triggerPoint && scrollTop <= barBottom) {
            const visibleHeight = Math.min(scrollTop - triggerPoint, totalBarHeight); // hauteur visible actuelle
            progress = Math.max(0, visibleHeight / totalBarHeight) * 100;             // pourcentage de progression
            scrollProgress.style.height = `${progress}%`;                             // mise à jour de la hauteur de la barre
            scrollBar.style.opacity = 1;                                              // rendre la barre visible
        } 
        // Si on est au-dessus du point de déclenchement
        else if (scrollTop < triggerPoint) {
            scrollProgress.style.height = `0%`;   // barre vide
            scrollBar.style.opacity = 0;          // barre invisible
        } 
        // Si on est en bas de la page, après la zone
        else {
            progress = 100;
            scrollProgress.style.height = `100%`; // barre remplie à 100%
            scrollBar.style.opacity = 1;
        }

        // Affichage conditionnel du contenu selon la hauteur de la barre
        document.querySelectorAll(".horizontalLine").forEach((line) => {
            const associatedContent = line.parentElement;               // bloc parent du contenu et de la ligne horizontale
            const lineY = getOffsetTop(line);                          // position de la ligne horizontale dans la page
            const barCurrentY = barTop + (progress / 100) * totalBarHeight; // position actuelle de l’extrémité de la barre

            // Si la barre dépasse la ligne horizontale
            if (barCurrentY >= lineY) {
                associatedContent.classList.add("visibleContent");
                associatedContent.classList.remove("hiddenContent");
                line.classList.add("visibleContent");
                line.classList.remove("hiddenContent");
            } else {
                associatedContent.classList.add("hiddenContent");
                associatedContent.classList.remove("visibleContent");
                line.classList.add("hiddenContent");
                line.classList.remove("visibleContent");
            }
        });
    }

    // Lier la fonction à l’événement scroll
    window.addEventListener("scroll", updateScrollBar);

    // Appel initial pour afficher les éléments déjà visibles au chargement
    updateScrollBar();
});
