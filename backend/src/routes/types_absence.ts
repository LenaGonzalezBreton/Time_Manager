// backend/src/routes/roles.ts
import { Router } from "express";
import { getTypesAbsence, postTypeAbsence, putTypeAbsence, deleteTypeAbsence } from "../controllers/types_absence.controller";

const router = Router();

/**
 * @openapi
 * /api/types-absence:
 *   get:
 *     tags: [TypesAbsence]
 *     summary: Liste des types d'absence
 *     responses:
 *       200: { description: OK }
 */
router.get("/", getTypesAbsence);

/**
 * @openapi
 * /api/types-absence:
 *   post:
 *     tags: [TypesAbsence]
 *     summary: Crée un type d'absence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, example: "Congé payé" }
 *     responses:
 *       201: { description: Créé }
 *       409: { description: Doublon }
 */
router.post("/", postTypeAbsence);

/**
 * @openapi
 * /api/types-absence/{id}:
 *   put:
 *     tags: [TypesAbsence]
 *     summary: Met à jour un type d'absence
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
 *               type: { type: string, example: "RTT" }
 *     responses:
 *       200: { description: Mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putTypeAbsence);

/**
 * @openapi
 * /api/types-absence/{id}:
 *   delete:
 *     tags: [TypesAbsence]
 *     summary: Supprime un type d'absence
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteTypeAbsence);

export default router;

