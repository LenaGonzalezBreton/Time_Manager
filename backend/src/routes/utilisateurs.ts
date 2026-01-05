// backend/src/routes/roles.ts
import { Router } from "express";
import { getUtilisateurs, postUtilisateur, putUtilisateur, deleteUtilisateur } from "../controllers/utilisateurs.controller";
import { getHorairesByUser } from "../controllers/horaires.controller";

const router = Router();

/**
 * @openapi
 * /api/utilisateurs:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Liste des utilisateurs disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getUtilisateurs);

/**
 * @openapi
 * /api/utilisateurs:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Créé un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, prenom, email, telephone, mot_de_passe, id_role]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "DUPONT"
 *               prenom:
 *                 type: string
 *                 example: "Jean"
 *               email:
 *                 type: string
 *                 example: "example@mail.com"
 *               telephone:
 *                  type: string
 *                  example: "0612345678"
 *                  nullable: true
 *               mot_de_passe:
 *                 type: string
 *                 example: "azerty"
 *               id_role:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       409:
 *         description: Doublon
 */
router.post("/", postUtilisateur);

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Met à jour un utilisateur
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
 *               nom: { type: string, example: "DUPONT" }
 *               prenom: { type: string, example: "Jean" }
 *               email: { type: string, example: "example@mail.com" }
 *               mot_de_passe: { type: string, example: "azerty" }
 *               id_role: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Utilisateur mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putUtilisateur);

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprime un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteUtilisateur);

/**
 * @openapi
 * /api/utilisateurs/{id}/horaires:
 *   get:
 *     tags: [Horaires]
 *     summary: Liste des horaires pour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id/horaires", getHorairesByUser);

export default router;