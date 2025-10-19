// backend/src/routes/horaires.ts
import { Router } from "express";
import { getHoraires, postHoraire, putHoraire, deleteHoraire } from "../controllers/horaires.controller";

const router = Router();


/**
 * @openapi
 * /api/horaires:
 *   get:
 *     tags: [Horaires]
 *     summary: Liste des horaires disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getHoraires);

/**
 * @openapi
 * /api/horaires:
 *   post:
 *     tags: [Horaires]
 *     summary: Créé un nouvel horaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jour, id_utilisateur]
 *             properties:
 *               jour:
 *                 type: string
 *                 description: Date du jour (format YYYY-MM-DD)
 *                 example: "2025-01-01"
 *               id_utilisateur:
 *                 type: integer
 *                 example: 1
 *               id_type_horaire:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant du type d'horaire (optionnel)
 *                 example: 2
 *               heure_arrivee:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Date/heure d'arrivée au format ISO 8601
 *                 example: "2025-01-01T08:30:00.000Z"
 *               heure_depart:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Date/heure de départ au format ISO 8601
 *                 example: "2025-01-01T17:15:00.000Z"
 *               minutes_retard:
 *                 type: integer
 *                 description: Minutes de retard (défaut 0)
 *                 example: 5
 *               minutes_travaillees:
 *                 type: integer
 *                 description: Minutes travaillées (défaut 0)
 *                 example: 480
 *     responses:
 *       201:
 *         description: Horaire créé
 *       409:
 *         description: Un horaire existe déjà pour cet utilisateur à ce jour
 */
router.post("/", postHoraire);

/**
 * @openapi
 * /api/horaires/{id}:
 *   put:
 *     tags: [Horaires]
 *     summary: Met à jour un horaire
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
 *               jour: { type: string, description: "YYYY-MM-DD", example: "2025-01-01" }
 *               id_utilisateur: { type: integer, example: 1 }
 *               id_type_horaire: { type: integer, nullable: true, example: 2 }
 *               heure_arrivee: { type: string, format: date-time, nullable: true, example: "2025-01-01T08:30:00.000Z" }
 *               heure_depart: { type: string, format: date-time, nullable: true, example: "2025-01-01T17:15:00.000Z" }
 *               minutes_retard: { type: integer, example: 10 }
 *               minutes_travaillees: { type: integer, example: 455 }
 *     responses:
 *       200: { description: Horaire mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Un horaire existe déjà pour cet utilisateur à ce jour }
 */
router.put("/:id", putHoraire);

/**
 * @openapi
 * /api/horaires/{id}:
 *   delete:
 *     tags: [Horaires]
 *     summary: Supprime un horaire
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteHoraire);

export default router;