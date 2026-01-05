import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Express } from "express";

export function buildSwaggerSpec() {
    // Détecter si on est en mode dev (fichiers .ts) ou prod (fichiers .js compilés)
    const isDev = process.env.NODE_ENV !== 'production';
    const ext = isDev ? 'ts' : 'js';
    const baseDir = isDev ? './src' : './dist';

    // Définir les options pour swaggerJSDoc
    const options: swaggerJSDoc.Options = {
        // Informations générales sur l'API
        definition: {
            openapi: "3.0.3",
            info: {
                title: "API Time Manager",
                version: "1.0.0",
                description:
                    "API REST (Express + TypeORM) pour Time Manager. Routes Utilisateurs, Équipes, Horaires, Rapports, etc.",
            },
            servers: [
                { url: `http://localhost:${process.env.API_PORT || 5000}`, description: "Local" },
            ],
            tags: [
                { name: "Système", description: "Santé et diagnostics" },
                { name: "Rapports", description: "Rapports et KPI" },
                { name: "Roles", description: "Rôles des utilisateurs" },
                { name: "Utilisateurs", description: "Gestion des utilisateurs" },
                { name: "Equipes", description: "Gestion des équipes" },
                { name: "Horaires", description: "Arrivées/Départs" },
                { name: "Indicateurs", description: "Indicateurs et KPI" },
                { name: "Absences", description: "Gestion des absences" },
                { name: "CiblesIndicateur", description: "Cibles pour les indicateurs (utilisateur/équipe)" },
                { name: "JoursFeries", description: "Calendrier des jours fériés" },
                { name: "Planning", description: "Planning hebdomadaire par rôle" },
                { name: "TypesAbsence", description: "Catalogues des types d'absence" },
                { name: "TypesHoraire", description: "Catalogues des types d'horaire" },
            ],
        },
        // fichiers à scanner pour les annotations JSDoc OpenAPI
        apis: [
            `${baseDir}/app.${ext}`,
            `${baseDir}/routes/**/*.${ext}`
        ],
    };

    return swaggerJSDoc(options);
}
// Configurer Swagger dans une application Express
export function setupSwagger(app: Express) {
    const spec = buildSwaggerSpec();
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
    app.get("/docs.json", (_req, res) => res.json(spec));
}