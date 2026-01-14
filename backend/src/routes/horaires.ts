// backend/src/routes/horaires.ts
import { Router } from "express";
import { getHoraires, postHoraire, putHoraire, deleteHoraire, getTodayHoraire, getExpectedSchedule, startWorkDay, endWorkDay, getIncompleteDays } from "../controllers/horaires.controller.js";

const router = Router();


/**
 * @openapi
 * /api/horaires:
 *   get:
 *     tags: [Horaires]
 *     summary: Liste des horaires disponibles
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getHoraires);

// ==================== ROUTES SPÉCIFIQUES (AVANT /:id) ====================

/**
 * @openapi
 * /api/horaires/today:
 *   get:
 *     tags: [Horaires]
 *     summary: Récupère l'horaire du jour pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horaire du jour (ou null si aucun)
 *       401:
 *         description: Non authentifié
 */
router.get("/today", getTodayHoraire);

/**
 * @openapi
 * /api/horaires/expected-schedule:
 *   get:
 *     tags: [Horaires]
 *     summary: Récupère les horaires prévus depuis le planning du rôle de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jour
 *         schema:
 *           type: string
 *           format: date
 *         description: Date au format YYYY-MM-DD (optionnel, par défaut aujourd'hui)
 *         example: "2026-01-12"
 *     responses:
 *       200:
 *         description: Horaires prévus du planning
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur ou rôle introuvable
 */
router.get("/expected-schedule", getExpectedSchedule);

/**
 * @openapi
 * /api/horaires/incomplete:
 *   get:
 *     tags: [Horaires]
 *     summary: Récupère les journées incomplètes (non débutées) des 30 derniers jours
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des journées incomplètes
 *       401:
 *         description: Non authentifié
 */
router.get("/incomplete", getIncompleteDays);

/**
 * @openapi
 * /api/horaires/start-day:
 *   post:
 *     tags: [Horaires]
 *     summary: Démarre la journée de travail
 *     description: Enregistre l'heure d'arrivée et calcule automatiquement le retard si applicable
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horaire créé ou mis à jour avec l'heure d'arrivée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur introuvable
 */
router.post("/start-day", startWorkDay);

/**
 * @openapi
 * /api/horaires/end-day:
 *   post:
 *     tags: [Horaires]
 *     summary: Termine la journée de travail
 *     description: Enregistre l'heure de départ et calcule automatiquement les minutes travaillées
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horaire mis à jour avec l'heure de départ et les minutes travaillées
 *       400:
 *         description: L'heure d'arrivée n'est pas enregistrée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucune journée de travail n'a été débutée aujourd'hui
 */
router.post("/end-day", endWorkDay);

// ==================== ROUTES GÉNÉRIQUES (AVEC /:id) ====================

/**
 * @openapi
 * /api/horaires:
 *   post:
 *     tags: [Horaires]
 *     summary: Créé un nouvel horaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jour, id_utilisateur]
 *             properties:
 *               jour:
 *                 type: string
 *                 description: Date du jour (format YYYY-MM-DD)
 *                 example: "2025-01-01"
 *               id_utilisateur:
 *                 type: integer
 *                 example: 1
 *               id_type_horaire:
 *                 type: integer
 *                 nullable: true
 *                 description: Identifiant du type d'horaire (optionnel)
 *                 example: 2
 *               heure_arrivee:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Date/heure d'arrivée au format ISO 8601
 *                 example: "2025-01-01T08:30:00.000Z"
 *               heure_depart:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Date/heure de départ au format ISO 8601
 *                 example: "2025-01-01T17:15:00.000Z"
 *               minutes_retard:
 *                 type: integer
 *                 description: Minutes de retard (défaut 0)
 *                 example: 5
 *               minutes_travaillees:
 *                 type: integer
 *                 description: Minutes travaillées (défaut 0)
 *                 example: 480
 *     responses:
 *       201:
 *         description: Horaire créé
 *       409:
 *         description: Un horaire existe déjà pour cet utilisateur à ce jour
 */
router.post("/", postHoraire);

/**
 * @openapi
 * /api/horaires/{id}:
 *   put:
 *     tags: [Horaires]
 *     summary: Met à jour un horaire
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
 *               jour: { type: string, description: "YYYY-MM-DD", example: "2025-01-01" }
 *               id_utilisateur: { type: integer, example: 1 }
 *               id_type_horaire: { type: integer, nullable: true, example: 2 }
 *               heure_arrivee: { type: string, format: date-time, nullable: true, example: "2025-01-01T08:30:00.000Z" }
 *               heure_depart: { type: string, format: date-time, nullable: true, example: "2025-01-01T17:15:00.000Z" }
 *               minutes_retard: { type: integer, example: 10 }
 *               minutes_travaillees: { type: integer, example: 455 }
 *     responses:
 *       200: { description: Horaire mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Un horaire existe déjà pour cet utilisateur à ce jour }
 */
router.put("/:id", putHoraire);

/**
 * @openapi
 * /api/horaires/{id}:
 *   delete:
 *     tags: [Horaires]
 *     summary: Supprime un horaire
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteHoraire);

export default router;
