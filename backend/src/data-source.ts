import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import dotenv from "dotenv";

// Charger un unique fichier .env à la racine du repo (no-op si absent)
// - En dev local: le backend le charge depuis ../../.env
// - En Docker: les variables sont fournies par l'orchestrateur; ce chargement est sans effet
const rootEnvPath = path.resolve(__dirname, "..", "..", ".env");
dotenv.config({ path: rootEnvPath });

// Lecture/validation minimale des variables d'environnement
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL manquante. Définissez-la via le fichier .env à la racine du dépôt ou une variable d'environnement."
    );
}

const logging = String(process.env.TYPEORM_LOGGING || process.env.SQL_DEBUG || "").toLowerCase() === "true";

export const AppDataSource = new DataSource({
    type: "postgres",                                                                   // Type de base de données
    url: databaseUrl,                                                                    // URL de connexion à la base de données (contient user, password, host, port, database)
    entities: [path.join(__dirname, "entities", "*.{ts,js}")],                        // Chemin vers les entités, * permet de prendre tous les fichiers .ts et .js
    migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],                    // Chemin vers les migrations
    synchronize: false,                                                                 // toujours false en prod
    logging,                                                                             // Activable via TYPEORM_LOGGING=true
});