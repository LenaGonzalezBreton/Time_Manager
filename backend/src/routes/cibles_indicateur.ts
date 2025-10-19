// backend/src/routes/roles.ts
import { Router } from "express";
import { getCiblesIndicateur, postCibleIndicateur, putCibleIndicateur, deleteCibleIndicateur } from "../controllers/cibles_indicateur.controller";

const router = Router();

/**
 * @openapi
 * /api/cibles-indicateur:
 *   get:
 *     tags: [CiblesIndicateur]
 *     summary: Liste des cibles d'indicateur
 *     responses:
 *       200: { description: OK }
 */
router.get("/", getCiblesIndicateur);

/**
 * @openapi
 * /api/cibles-indicateur:
 *   post:
 *     tags: [CiblesIndicateur]
 *     summary: Crée une cible d'indicateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type_cible, id_cible]
 *             properties:
 *               type_cible: { type: string, enum: [utilisateur, equipe], example: "utilisateur" }
 *               id_cible: { type: integer, example: 1 }
 *     responses:
 *       201: { description: Créée }
 *       409: { description: Doublon }
 */
router.post("/", postCibleIndicateur);

/**
 * @openapi
 * /api/cibles-indicateur/{id}:
 *   put:
 *     tags: [CiblesIndicateur]
 *     summary: Met à jour une cible d'indicateur
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
 *     responses:
 *       200: { description: Mise à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putCibleIndicateur);

/**
 * @openapi
 * /api/cibles-indicateur/{id}:
 *   delete:
 *     tags: [CiblesIndicateur]
 *     summary: Supprime une cible d'indicateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteCibleIndicateur);

export default router;

