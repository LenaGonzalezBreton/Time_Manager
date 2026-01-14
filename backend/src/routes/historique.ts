import { Router } from "express";
import { getAllHistorique, getHistoriqueByUser, getMesModifications } from "../controllers/historique.controller.js";
import { requireManager } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/historique:
 *   get:
 *     tags: [Historique]
 *     summary: Récupérer tout l'historique des modifications (managers uniquement)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *     responses:
 *       200: { description: Liste des modifications }
 *       403: { description: Accès refusé }
 */
router.get("/", requireManager, getAllHistorique);

/**
 * @openapi
 * /api/historique/utilisateur/{id}:
 *   get:
 *     tags: [Historique]
 *     summary: Récupérer l'historique d'un utilisateur spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200: { description: Historique de l'utilisateur }
 */
router.get("/utilisateur/:id", getHistoriqueByUser);

/**
 * @openapi
 * /api/historique/mes-modifications:
 *   get:
 *     tags: [Historique]
 *     summary: Récupérer les modifications faites par l'utilisateur connecté
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200: { description: Liste des modifications }
 *       401: { description: Non authentifié }
 */
router.get("/mes-modifications", getMesModifications);

export default router;
