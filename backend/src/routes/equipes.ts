// backend/src/routes/roles.ts
import { Router } from "express";
import { getEquipes, postEquipe, putEquipe, deleteEquipe, getEquipe, addMember, removeMember } from "../controllers/equipes.controller.js";

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
 * /api/equipes/{id}:
 *   get:
 *     tags: [Equipes]
 *     summary: Récupère une équipe par son ID avec ses membres
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Équipe trouvée
 *       404:
 *         description: Introuvable
 */
router.get("/:id", getEquipe);

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

/**
 * @openapi
 * /api/equipes/{id}/membres:
 *   post:
 *     tags: [Equipes]
 *     summary: Ajouter un membre à une équipe (ne peut pas ajouter un manager)
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
 *             required: [id_utilisateur]
 *             properties:
 *               id_utilisateur: { type: integer, example: 5 }
 *     responses:
 *       200: { description: Membre ajouté }
 *       403: { description: Impossible d'ajouter un manager }
 *       404: { description: Équipe ou utilisateur introuvable }
 *       409: { description: Utilisateur déjà membre }
 */
router.post("/:id/membres", addMember);

/**
 * @openapi
 * /api/equipes/{id}/membres/{userId}:
 *   delete:
 *     tags: [Equipes]
 *     summary: Retirer un membre d'une équipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Membre retiré }
 *       404: { description: Équipe ou utilisateur introuvable }
 */
router.delete("/:id/membres/:userId", removeMember);

export default router;