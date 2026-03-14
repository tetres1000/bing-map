// --- content.js ---

// 1. Fonction pour trouver la position exacte du carré à l'écran
function trouverPositionDuCarre() {
    // On cherche un élément <path> qui possède ces 3 classes en même temps
    const carre = document.querySelector('path.pathdata.shadow.LineString');

    if (carre) {
        // La fonction magique qui nous donne la position (x, y) et la taille
        const position = carre.getBoundingClientRect();
        
        console.log("Carré trouvé !", position);
        
        return {
            x: position.left,
            y: position.top,
            width: position.width,
            height: position.height
        };
    } else {
        console.error("Le carré de la tâche est introuvable sur cette page.");
        return null;
    }
}
// 2. On écoute les messages venant de notre extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    // C'est cette ligne et cette accolade { qui manquaient ou étaient mal placées !
    if (message.action === "ANALYSER_CARTE") {
        
        // On cherche où est le carré
        const position = trouverPositionDuCarre();
        
        if (position) {
            // Si on l'a trouvé, on répond à l'extension avec les coordonnées
            sendResponse({ succes: true, position: position });
        } else {
            // Si on ne l'a pas trouvé, on prévient l'extension que ça a raté
            sendResponse({ succes: false });
        }
        
    } // Fin du bloc if

    return true; // Nécessaire pour dire qu'on va répondre
});