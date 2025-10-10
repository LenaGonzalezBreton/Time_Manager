import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";
import apiRouter from "./routes";

// Création de l'application Express
const app = express();
// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Setup de swagger
setupSwagger(app);

// Routeur principal de l'API
app.use("/api", apiRouter);

// Redirection pour swagger
app.get("/", (_req, res) => res.redirect("/docs"));

// Middleware d’erreurs pour renvoyer les status des services
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Erreur serveur";
    res.status(status).json({ message });
});

export default app;