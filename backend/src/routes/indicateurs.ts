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
 *             required: [type_cible, id_cible, date_periode]
 *             properties:
 *               type_cible:
 *                 type: string
 *                 enum: [utilisateur, equipe]
 *                 example: "utilisateur"
 *               id_cible:
 *                 type: integer
 *                 example: 1
 *               date_periode:
 *                 type: string
 *                 description: Date de la période (format YYYY-MM-DD)
 *                 example: "2025-01-01"
 *               taux_retard:
 *                 oneOf:
 *                   - { type: number }
 *                   - { type: string }
 *                   - { type: "null" }
 *                 example: 0.2
 *               taux_presence:
 *                 oneOf:
 *                   - { type: number }
 *                   - { type: string }
 *                   - { type: "null" }
 *                 example: 0.8
 *               minutes_travaillees:
 *                 type: integer
 *                 example: 1440
 *               minutes_retards:
 *                 type: integer
 *                 example: 35
 *     responses:
 *       201:
 *         description: Indicateur créé
 *       409:
 *         description: Doublon (cible + période)
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
 *               type_cible: { type: string, enum: [utilisateur, equipe], example: "equipe" }
 *               id_cible: { type: integer, example: 2 }
 *               date_periode: { type: string, description: "YYYY-MM-DD", example: "2025-02-01" }
 *               taux_retard:
 *                 oneOf:
 *                   - { type: number }
 *                   - { type: string }
 *                   - { type: "null" }
 *                 example: 0.1
 *               taux_presence:
 *                 oneOf:
 *                   - { type: number }
 *                   - { type: string }
 *                   - { type: "null" }
 *                 example: 0.9
 *               minutes_travaillees: { type: integer, example: 1500 }
 *               minutes_retards: { type: integer, example: 20 }
 *     responses:
 *       200: { description: Indicateur mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon (cible + période) }
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