import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger le .env à la racine du repo
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

import { AppDataSource } from "./data-source.js";
import app from "./app.js";
// Définition du port d'écoute
const port = Number(process.env.API_PORT) || 5000;

// Démarrage du serveur
app.listen(port, () => console.log(`HTTP up on :${port}`));

// Tentatives de connexion DB en arrière plan
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