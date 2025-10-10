// backend/src/routes/roles.ts
import { Router } from "express";
import { getRoles, postRole, putRole, deleteRole } from "../controllers/roles.controller";

const router = Router();

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Liste des rôles disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getRoles);

/**
 * @openapi
 * /api/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Crée un nouveau rôle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre]
 *             properties:
 *               titre: { type: string, example: "manager" }
 *     responses:
 *       201: { description: Rôle créé }
 *       409: { description: Doublon }
 */
router.post("/", postRole);

/**
 * @openapi
 * /api/roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Met à jour un rôle
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
 *               titre: { type: string, example: "lead" }
 *               description: { type: string, example: "chef d'équipe" }
 *     responses:
 *       200: { description: Rôle mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
 */
router.put("/:id", putRole);

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Supprime un rôle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteRole);

export default router;