import { AppDataSource } from "./data-source";
import app from "./app";

const port = Number(process.env.API_PORT) || 5000;

// 1) Démarrer HTTP d'abord
app.listen(port, () => console.log(`HTTP up on :${port}`));

// 2) Essayer la DB en arrière-plan (sans bloquer)
(async function connectWithRetry(maxRetries = 10, delay = 3000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (!AppDataSource.isInitialized) {
                console.log(`Connexion BDD, nouvelle tentative ${i + 1}/${maxRetries}...`);
                await AppDataSource.initialize();
                console.log("BDD connectée !");
            }
            return;
        } catch (err) {
            console.error(`BDD erreur: ${err}`);
            if (i < maxRetries - 1) {
                console.log(`Nouvelle tentative dans ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                console.error("La BDD est innaccessible, l'API reste dispo, /health montre bdd:\"down\"");
            }
        }
    }
})();