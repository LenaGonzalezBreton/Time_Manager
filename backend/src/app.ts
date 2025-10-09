import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { setupSwagger } from "./swagger";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Swagger - DOIT être défini AVANT la route "/"
setupSwagger(app);
console.log("Swagger configuré sur /docs");

// /health : liveness + readiness
app.get("/health", async (_req, res) => {
    const now = new Date().toISOString();
    let db: "up" | "down" = "down";

    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.query("SELECT 1");
            db = "up";
        }
    } catch (err) {
        db = "down";
    }

    res.status(200).json({ status: "ok", time: now, db });
});

// Redirection pour Swagger
app.get("/", (_req, res) => res.redirect("/docs"));

export default app;