import { Router } from "express";
import { getUtilisateurs, postUtilisateur, putUtilisateur, deleteUtilisateur, getAbsencesByUser, getIndicateursByUser, updateUtilisateurByManager, updateUtilisateurSelf, updatePassword } from "../controllers/utilisateurs.controller.js";
import { getHorairesByUser } from "../controllers/horaires.controller.js";

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
 * /api/utilisateurs/me:
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Modifier ses propres informations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "nouveau@mail.com" }
 *               telephone: { type: string, example: "0612345678", nullable: true }
 *     responses:
 *       200: { description: Informations mises à jour }
 *       401: { description: Non authentifié }
 *       409: { description: Email déjà utilisé }
 */
router.put("/me", updateUtilisateurSelf);

/**
 * @openapi
 * /api/utilisateurs/me/password:
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Changer son mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string, example: "ancien_mdp" }
 *               newPassword: { type: string, example: "nouveau_mdp" }
 *     responses:
 *       200: { description: Mot de passe modifié }
 *       401: { description: Ancien mot de passe incorrect }
 */
router.put("/me/password", updatePassword);

/**
 * @openapi
 * /api/utilisateurs/{id}:
 *   put:
 *     tags: [Utilisateurs]
 *     summary: Modifier un utilisateur (Manager uniquement, ne peut pas modifier un autre manager)
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
 *               telephone: { type: string, example: "0612345678", nullable: true }
 *               id_role: { type: integer, example: 2 }
 *     responses:
 *       200: { description: Utilisateur mis à jour }
 *       403: { description: Accès refusé (non manager ou tentative de modifier un manager) }
 *       404: { description: Introuvable }
 *       409: { description: Email déjà utilisé }
 */
router.put("/:id", updateUtilisateurByManager);

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

/**
 * @openapi
 * /api/utilisateurs/{id}/absences:
 *   get:
 *     tags: [Absences]
 *     summary: Liste des absences pour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id/absences", getAbsencesByUser);

/**
 * @openapi
 * /api/utilisateurs/{id}/indicateurs:
 *   get:
 *     tags: [Indicateurs]
 *     summary: Liste des indicateurs pour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id/indicateurs", getIndicateursByUser);

export default router;