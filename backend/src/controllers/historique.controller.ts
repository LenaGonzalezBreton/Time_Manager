import { Request, Response, NextFunction } from "express";
import * as svc from "../services/historique.service.js";

// GET /api/historique - Tout l'historique (managers uniquement)
export async function getAllHistorique(req: Request, res: Response, next: NextFunction) {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const result = await svc.getAllHistorique(page, limit);
        res.status(200).json({
            data: result.data,
            meta: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/historique/utilisateur/:id - Historique d'un utilisateur
export async function getHistoriqueByUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const result = await svc.getHistoriqueByUser(id, page, limit);
        res.status(200).json({
            data: result.data,
            meta: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/historique/mes-modifications - Modifications faites par l'utilisateur connecté
export async function getMesModifications(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const id_utilisateur = req.user?.id_utilisateur;
        if (!id_utilisateur) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;

        // Note: Pour "mes modifications", c'est un peu plus complexe car on combine deux sources.
        // Pour simplifier et répondre à "fais au plus simple", on va paginer uniquement sur les modifs manager pour l'instant
        // ou alors on accepte que la pagination soit approximative si on merge.
        // IDÉALEMENT: On devrait avoir une requête unique.
        // SOLUTION SIMPLE: On récupère juste les modifs faites PAR le manager (ce qui est le plus important).
        // Les auto-modifs (profil) sont moins critiques pour le dashboard manager.

        const result = await svc.getHistoriqueByModificateur(id_utilisateur, page, limit);

        res.status(200).json({
            data: result.data,
            meta: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
}
