import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import * as path from "path";

export const AppDataSource = new DataSource({
    type: "postgres",                                                                   // Type de base de données
    url: process.env.DATABASE_URL || "postgres://user:password@db:5432/time_manager",   // URL de connexion à la base de données (contient user, password, host, port, database)
    entities: [path.join(__dirname, "entities", "*.{ts,js}")],                                      // Chemin vers les entités, * permet de prendre tous les fichiers .ts et .js
    migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],                                  // Chemin vers les migrations
    synchronize: false,                                                                 // toujours false en prod
    logging: true,                                                                      // True temporairement pour voir les requêtes SQL / Penser a retirer pour prod
});