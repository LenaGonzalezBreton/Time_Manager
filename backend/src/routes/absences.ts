// backend/src/routes/roles.ts
import { Router } from "express";
import { getAbsences, postAbsence, putAbsence, deleteAbsence } from "../controllers/absences.controller.js";

const router = Router();

/**
 * @openapi
 * /api/absences:
 *   get:
 *     tags: [Absences]
 *     summary: Liste des absences
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getAbsences);

/**
 * @openapi
 * /api/absences:
 *   post:
 *     tags: [Absences]
 *     summary: Crée une absence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_utilisateur, id_type_absence, date_debut, date_fin]
 *             properties:
 *               id_utilisateur: { type: integer, example: 1 }
 *               id_type_absence: { type: integer, example: 2 }
 *               date_debut: { type: string, example: "2025-01-10" }
 *               date_fin: { type: string, example: "2025-01-12" }
 *               justifiee: { type: boolean, example: true }
 *               commentaire: { type: string, nullable: true, example: "Certificat fourni" }
 *     responses:
 *       201: { description: Créée }
 *       409: { description: Doublon sur la période pour l'utilisateur }
 */
router.post("/", postAbsence);

/**
 * @openapi
 * /api/absences/{id}:
 *   put:
 *     tags: [Absences]
 *     summary: Met à jour une absence
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
 *               id_utilisateur: { type: integer, example: 1 }
 *               id_type_absence: { type: integer, example: 2 }
 *               date_debut: { type: string, example: "2025-01-10" }
 *               date_fin: { type: string, example: "2025-01-12" }
 *               justifiee: { type: boolean, example: true }
 *               commentaire: { type: string, nullable: true, example: "Certificat fourni" }
 *     responses:
 *       200: { description: Mise à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon sur la période pour l'utilisateur }
 */
router.put("/:id", putAbsence);

/**
 * @openapi
 * /api/absences/{id}:
 *   delete:
 *     tags: [Absences]
 *     summary: Supprime une absence
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Supprimé }
 *       404: { description: Introuvable }
 */
router.delete("/:id", deleteAbsence);

export default router;

