import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger.js";
import apiRouter from "./routes/index.js";

// Création de l'application Express
const app = express();
// Middleware - Support pour les deux ports de dev (3000 et 5173)
const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    "http://localhost:5173"
];
app.use(cors({
    origin: (origin, callback) => {
        // Autorise les requêtes sans origin (comme Postman) ou les origins dans la liste
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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
app.post("/echo", (req, res) => {
    res.status(201).json({ received: req.body });
});
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
export default app;