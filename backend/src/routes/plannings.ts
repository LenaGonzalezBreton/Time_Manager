// backend/src/routes/roles.ts
import { Router } from "express";
import { getPlannings, postPlanning, putPlanning, deletePlanning } from "../controllers/plannings.controller.js";

const router = Router();

/**
 * @openapi
 * /api/plannings:
 *   get:
 *     tags: [Planning]
 *     summary: Liste des plannings
 *     responses:
 *       200: { description: OK }
 */
router.get("/", getPlannings);

/**
 * @openapi
 * /api/plannings:
 *   post:
 *     tags: [Planning]
 *     summary: Crée un planning
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jour_semaine, id_role]
 *             properties:
 *               jour_semaine: { type: string, enum: [Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche], example: Lundi }
 *               id_role: { type: integer, example: 1 }
 *               heure_arrivee: { type: string, nullable: true, example: "08:30:00" }
 *               heure_pause: { type: string, nullable: true, example: "12:30:00" }
 *               heure_depart: { type: string, nullable: true, example: "17:30:00" }
 *               jour_travail: { type: boolean, example: true }
 *     responses:
 *       201: { description: Créé }
 */
router.post("/", postPlanning);

/**
 * @openapi
 * /api/plannings/{id}:
 *   put:
 *     tags: [Planning]
 *     summary: Met à jour un planning
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
 *               jour_semaine: { type: string, enum: [Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche] }
 *               id_role: { type: integer }
 *               heure_arrivee: { type: string, nullable: true }
 *               heure_pause: { type: string, nullable: true }
 *               heure_depart: { type: string, nullable: true }
 *               jour_travail: { type: boolean }
 *     responses:
 *       200: { description: Mis à jour }
 *       404: { description: Introuvable }
 */
router.put("/:id", putPlanning);

/**
 * @openapi
 * /api/plannings/{id}:
 *   delete:
 *     tags: [Planning]
 *     summary: Supprime un planning
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deletePlanning);

export default router;

