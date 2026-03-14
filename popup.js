// --- popup.js ---
document.getElementById("bouton-analyser").addEventListener("click", async () => {
    const textStatut = document.getElementById("statut");
    textStatut.innerText = "1️⃣ Recherche du carré...";

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 1. Demander où est le carré
    chrome.tabs.sendMessage(tab.id, { action: "TROUVER_CARRE" }, (reponse) => {
        if (!reponse || !reponse.succes) {
            textStatut.innerText = "❌ Carré rose introuvable.";
            return;
        }

        textStatut.innerText = "2️⃣ Capture d'écran en cours...";

        // 2. Prendre la photo
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (imageDataUrl) => {
            textStatut.innerText = "3️⃣ Analyse par OpenCV...";
            
            // 3. Renvoyer la photo au content.js pour analyse
            chrome.tabs.sendMessage(tab.id, { 
                action: "ANALYSER_IMAGE", 
                image: imageDataUrl,
                position: reponse.position // On lui rappelle où était le carré
            }, (resultat) => {
                textStatut.innerText = "✅ " + resultat.message;
            });
        });
    });
});