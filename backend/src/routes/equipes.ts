// backend/src/routes/roles.ts
import { Router } from "express";
import { getEquipes, postEquipe, putEquipe, deleteEquipe } from "../controllers/equipes.controller";

const router = Router();

/**
 * @openapi
 * /api/equipes:
 *   get:
 *     tags: [Equipes]
 *     summary: Liste des équipes disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getEquipes);

/**
 * @openapi
 * /api/equipes:
 *   post:
 *     tags: [Equipes]
 *     summary: Crée une nouvelle équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "team qualité"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "assurer la qualité des produits par des audits fréquents"
 *     responses:
 *       201:
 *         description: Équipe créée
 *       409:
 *         description: Doublon
 */
router.post("/", postEquipe);

/**
 * @openapi
 * /api/equipes/{id}:
 *   put:
 *     tags: [Equipes]
 *     summary: Met à jour une équipe
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
 *               nom: { type: string, example: "team qualité" }
 *               description: { type: string, nullable: true, example: "assurer la qualité des produits par des audits fréquents" }
 *     responses:
 *       200: { description: Équipe mise à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putEquipe);

/**
 * @openapi
 * /api/equipes/{id}:
 *   delete:
 *     tags: [Equipes]
 *     summary: Supprime une équipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteEquipe);

export default router;