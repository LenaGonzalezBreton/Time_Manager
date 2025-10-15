// backend/src/routes/roles.ts
import { Router } from "express";
import { getIndicateurs, postIndicateur, putIndicateur, deleteIndicateur } from "../controllers/indicateurs.controller";

const router = Router();

/**
 * @openapi
 * /api/indicateurs:
 *   get:
 *     tags: [Indicateurs]
 *     summary: Liste des indicateurs disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getIndicateurs);

/**
 * @openapi
 * /api/indicateurs:
 *   post:
 *     tags: [Indicateurs]
 *     summary: Créé un nouvel indicateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [taux_retard, taux_presence, heures_travaillees, duree_retards, id_utilisateur]
 *             properties:
 *               taux_retard:
 *                 type: number
 *                 example: "20"
 *               taux_presence:
 *                 type: number
 *                 example: "80"
 *               heures_travaillees:
 *                 type: string
 *                 example: "320:30"
 *               duree_retards:
 *                 type: string
 *                 example: "13:45"
 *               id_utilisateur:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Indicateur créé
 *       409:
 *         description: Doublon
 */
router.post("/", postIndicateur);

/**
 * @openapi
 * /api/indicateurs/{id}:
 *   put:
 *     tags: [Indicateurs]
 *     summary: Met à jour un indicateur
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
 *               taux_retard: { type: number, example: "20" }
 *               taux_presence: { type: number, example: "80" }
 *               heures_travaillees: { type: string, example: "345:35" }
 *               duree_retards: { type: string, example: "01:25" }
 *               id_utilisateur: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Indicateur mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putIndicateur);

/**
 * @openapi
 * /api/indicateurs/{id}:
 *   delete:
 *     tags: [Indicateurs]
 *     summary: Supprime un indicateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteIndicateur);

export default router;