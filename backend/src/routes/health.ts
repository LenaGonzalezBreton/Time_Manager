import { Router } from "express";
import { AppDataSource } from "../data-source.js";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Système]
 *     summary: Vérifie la santé et la disponibilité
 *     responses:
 *       200:
 *         description: Statut de l'API et de la base de données
 */
router.get("/", async (_req, res) => {
    const now = new Date().toISOString();
    let db: "up" | "down" = "down";

    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.query("SELECT 1");
            db = "up";
        }
    } catch {
        db = "down";
    }

    res.status(200).json({ status: "ok", time: now, db });
});

export default router;