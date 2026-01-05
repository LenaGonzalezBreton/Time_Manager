// backend/src/routes/roles.ts
import { Router } from "express";
import { getJoursFeries, postJourFerie, putJourFerie, deleteJourFerie } from "../controllers/jours_feries.controller";

const router = Router();

/**
 * @openapi
 * /api/jours-feries:
 *   get:
 *     tags: [JoursFeries]
 *     summary: Liste des jours fériés
 *     responses:
 *       200: { description: OK }
 */
router.get("/", getJoursFeries);

/**
 * @openapi
 * /api/jours-feries:
 *   post:
 *     tags: [JoursFeries]
 *     summary: Crée un jour férié
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jour_ferie]
 *             properties:
 *               jour_ferie: { type: string, example: "2025-05-01" }
 *     responses:
 *       201: { description: Créé }
 *       409: { description: Doublon }
 */
router.post("/", postJourFerie);

/**
 * @openapi
 * /api/jours-feries/{id}:
 *   put:
 *     tags: [JoursFeries]
 *     summary: Met à jour un jour férié
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jour_ferie: { type: string, example: "2025-11-11" }
 *     responses:
 *       200: { description: Mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putJourFerie);

/**
 * @openapi
 * /api/jours-feries/{id}:
 *   delete:
 *     tags: [JoursFeries]
 *     summary: Supprime un jour férié
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteJourFerie);

export default router;

