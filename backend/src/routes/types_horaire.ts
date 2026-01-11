// backend/src/routes/roles.ts
import { Router } from "express";
import { getTypesHoraire, postTypeHoraire, putTypeHoraire, deleteTypeHoraire } from "../controllers/types_horaire.controller.js";

const router = Router();

/**
 * @openapi
 * /api/types-horaire:
 *   get:
 *     tags: [TypesHoraire]
 *     summary: Liste des types d'horaire
 *     responses:
 *       200: { description: OK }
 */
router.get("/", getTypesHoraire);

/**
 * @openapi
 * /api/types-horaire:
 *   post:
 *     tags: [TypesHoraire]
 *     summary: Crée un type d'horaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, example: "Télétravail" }
 *     responses:
 *       201: { description: Créé }
 *       409: { description: Doublon }
 */
router.post("/", postTypeHoraire);

/**
 * @openapi
 * /api/types-horaire/{id}:
 *   put:
 *     tags: [TypesHoraire]
 *     summary: Met à jour un type d'horaire
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
 *               type: { type: string, example: "Présentiel" }
 *     responses:
 *       200: { description: Mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putTypeHoraire);

/**
 * @openapi
 * /api/types-horaire/{id}:
 *   delete:
 *     tags: [TypesHoraire]
 *     summary: Supprime un type d'horaire
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteTypeHoraire);

export default router;

