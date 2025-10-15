// backend/src/routes/roles.ts
import { Router } from "express";
import { getHoraires, postHoraire, putHoraire, deleteHoraire } from "../controllers/horaires.controller";

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
 *             required: [type, jour, heure, id_utilisateur]
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Arrivée"
 *               jour:
 *                 type: string
 *                 example: "01/01/2025"
 *               heure:
 *                 type: string
 *                 example: "13:45"
 *               id_utilisateur:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Horaire créé
 *       409:
 *         description: Doublon
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
 *               type: { type: string, example: "Arrivée" }
 *               jour: { type: string, example: "01/01/2025" }
 *               heure: { type: string, example: "13:45" }
 *               id_utilisateur: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Horaire mis à jour }
 *       404: { description: Introuvable }
 *       409: { description: Doublon }
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