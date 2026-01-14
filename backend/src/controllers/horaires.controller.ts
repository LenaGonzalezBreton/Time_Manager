import { Request, Response } from "express";
import * as svc from "../services/horaires.service.js";

// GET /utilisateurs/{id}/horaires
export async function getHorairesByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const horaires = await svc.listHorairesByUser({ id_utilisateur: id });
    res.status(200).json(horaires);
}

// GET /horaires
export async function getHoraires(_req: Request, res: Response) {
    const horaires = await svc.listHoraires();
    res.status(200).json(horaires);
}

// POST /horaires
export async function postHoraire(req: Request, res: Response) {
    const created = await svc.createHoraire(req.body);
    res.status(201).json(created);
}

// PUT /horaires/:id
export async function putHoraire(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateHoraire(id, req.body);
    res.status(200).json(updated);
}

// DELETE /horaires/:id
export async function deleteHoraire(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteHoraire(id);
    res.status(204).send();
}

// ==================== NOUVELLES ROUTES POUR LE TRACKING DE JOURNÉE ====================

// GET /horaires/today
export async function getTodayHoraire(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const horaire = await svc.getTodayHoraire(id_utilisateur);
    res.status(200).json(horaire);
}

// GET /horaires/expected-schedule
export async function getExpectedSchedule(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const jour = req.query.jour as string | undefined;
    const schedule = await svc.getExpectedSchedule(id_utilisateur, jour);
    res.status(200).json(schedule);
}

// POST /horaires/start-day
export async function startWorkDay(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const horaire = await svc.startWorkDay(id_utilisateur);
    res.status(200).json(horaire);
}

// POST /horaires/end-day
export async function endWorkDay(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const horaire = await svc.endWorkDay(id_utilisateur);
    res.status(200).json(horaire);
}

// GET /horaires/incomplete
export async function getIncompleteDays(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const incompleteDays = await svc.getIncompleteDays(id_utilisateur);
    res.status(200).json(incompleteDays);
}