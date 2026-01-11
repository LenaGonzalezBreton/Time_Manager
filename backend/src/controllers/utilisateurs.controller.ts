import { Request, Response } from "express";
import * as svc from "../services/utilisateurs.service.js";
import * as absenceSvc from "../services/absences.service.js";
import * as indicateursSvc from "../services/indicateurs.service.js";

// GET /utilisateurs
export async function getUtilisateurs(_req: Request, res: Response) {
    const utilisateurs = await svc.listUtilisateurs();
    res.status(200).json(utilisateurs);
}

// POST /utilisateurs
export async function postUtilisateur(req: Request, res: Response) {
    const created = await svc.createUtilisateur(req.body);
    res.status(201).json(created);
}

// PUT /utilisateurs/:id
export async function putUtilisateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateUtilisateur(id, req.body);
    res.status(200).json(updated);
}

// DELETE /utilisateurs/:id
export async function deleteUtilisateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteUtilisateur(id);
    res.status(204).send();
}

// GET /utilisateurs/:id/absences
export async function getAbsencesByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const absences = await absenceSvc.listAbsencesByUser(id);
    res.status(200).json(absences);
}

// GET /utilisateurs/:id/indicateurs
export async function getIndicateursByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    // Note: dynamic import to avoid circular dependencies if any, or just direct import if fine. 
    // Wait, I need to import indicateursService.
    // I'll add the import at the top.
    const indicateurs = await indicateursSvc.listIndicateursByUser(id);
    res.status(200).json(indicateurs);
}