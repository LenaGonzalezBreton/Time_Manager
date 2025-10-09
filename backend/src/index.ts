import { AppDataSource } from "./data-source";
import app from "./app";

const port = process.env.API_PORT || 3000;

// Fonction pour réessayer la connexion à la base de données
const connectWithRetry = async (maxRetries = 10, delay = 3000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Tentative de connexion à la base de données (${i + 1}/${maxRetries})...`);
            await AppDataSource.initialize();   // Initialisation de la connexion à la base de données
            console.log("Base de données connectée avec succès");
            return true;                        // Connexion réussie
        } catch (err) {
            console.error(`Erreur de connexion à la base de données, erreur: ${err}`);
            if (i < maxRetries - 1) {           // Si ce n'est pas la dernière tentative
                console.log(`Nouvelle tentative dans ${delay / 1000} secondes...`);
                await new Promise(resolve => setTimeout(resolve, delay));   // Attente avant la prochaine tentative
            } else {
                console.error("Impossible de se connecter à la base de données après plusieurs tentatives");
                throw err; // Erreur après la 10eme tenta
            }
        }
    }
    return false;
};

// Démarrer le serveur après une connexion réussie à la base de données
connectWithRetry()
    .then(() => {
        app.listen(port, () => console.log(`Le Serveur run sur le port: ${port}`));
    })
    .catch((err) => {
        console.error("Erreur fatale:", err);
        process.exit(1);
    });