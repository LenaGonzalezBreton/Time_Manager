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
                title: "Time Manager API",
                version: "1.0.0",
                description:
                    "API REST (Express + TypeORM) pour Time Manager. Routes Users, Teams, Clocks, Reports, etc.",
            },
            servers: [
                { url: `http://localhost:${process.env.API_PORT || 5000}`, description: "Local" },
            ],
            tags: [
                { name: "System", description: "Santé et diagnostics" },
                { name: "Roles", description: "Rôles des utilisateurs" },
                { name: "Utilisateurs", description: "Gestion des utilisateurs" },
                { name: "Equipes", description: "Gestion des équipes" },
                { name: "Horaire", description: "Arrivées/Départs" },
                { name: "Indicateurs", description: "Rapports & KPI" },
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