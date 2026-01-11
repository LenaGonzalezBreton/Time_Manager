import { Router } from "express";
import { loginController, registerController, getCurrentUserController } from "../controllers/auth.controller.js";
import { authenticateToken, requireManager } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "manager@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_utilisateur:
 *                       type: integer
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/login", loginController);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Enregistre un nouvel utilisateur (réservé aux managers)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, prenom, email, mot_de_passe, id_role]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "DUPONT"
 *               prenom:
 *                 type: string
 *                 example: "Jean"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@example.com"
 *               telephone:
 *                 type: string
 *                 example: "0612345678"
 *                 nullable: true
 *               mot_de_passe:
 *                 type: string
 *                 example: "securePassword123"
 *               id_role:
 *                 type: integer
 *                 example: 2
 *                 description: 1 pour Manager, 2 pour Employee
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       403:
 *         description: Accès refusé - Réservé aux managers
 *       409:
 *         description: Email déjà utilisé
 */
router.post("/register", authenticateToken, requireManager, registerController);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Retourne les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_utilisateur:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telephone:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Non authentifié
 */
router.get("/me", authenticateToken, getCurrentUserController);

export default router;
