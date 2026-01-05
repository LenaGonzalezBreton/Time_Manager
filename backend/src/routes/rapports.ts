// backend/src/routes/rapports.ts
import { Router } from "express";
import { getRapports, postRapportsRecompute } from "../controllers/rapports.controller";

const router = Router();

/**
 * @openapi
 * /api/rapports:
 *   get:
 *     tags: [Rapports]
 *     summary: Retourne un rapport agrégé basé sur les indicateurs
 *     description: Permet de filtrer par utilisateur ou équipe, période et KPIs. La granularité peut être en synthèse (summary) ou journalière (daily).
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: Identifiant utilisateur (exclusif avec teamId)
 *         schema: { type: integer }
 *       - in: query
 *         name: teamId
 *         description: Identifiant équipe (exclusif avec userId)
 *         schema: { type: integer }
 *       - in: query
 *         name: startDate
 *         description: Date de début (format YYYY-MM-DD)
 *         schema: { type: string, example: "2025-01-01" }
 *       - in: query
 *         name: endDate
 *         description: Date de fin (format YYYY-MM-DD)
 *         schema: { type: string, example: "2025-01-31" }
 *       - in: query
 *         name: kpis
 *         description: CSV des KPI (taux_presence,taux_retard,minutes_travaillees,minutes_retards)
 *         schema: { type: string, example: "taux_presence,minutes_travaillees" }
 *       - in: query
 *         name: granularity
 *         description: Granularité des résultats
 *         schema: { type: string, enum: [summary, daily], example: "summary" }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getRapports);

/**
 * @openapi
 * /api/rapports/recalcul:
 *   post:
 *     tags: [Rapports]
 *     summary: Déclenche un recalcul des indicateurs (brouillon)
 *     responses:
 *       202:
 *         description: Accepté (non implémenté)
 */
router.post("/recalcul", postRapportsRecompute);

export default router;
