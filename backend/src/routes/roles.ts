import { Router } from "express";
import { getRoles, postRole } from "../controllers/roles.controller";

const router = Router();
// Information OpenAPI (Swagger) pour la documentation des API
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
router.get("/", getRoles);  // Route pour obtenir la liste des rôles

// Information OpenAPI (Swagger) pour la documentation des API
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
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "manager" }
 *               description: { type: string, example: "responsable d'équipe" }
 *     responses:
 *       201: { description: Role créé }
 *       409: { description: Doublon }
 */
router.post("/", postRole); // Route pour créer un nouveau rôle

export default router;