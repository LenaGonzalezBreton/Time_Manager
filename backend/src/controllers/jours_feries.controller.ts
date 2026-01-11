import { Request, Response } from "express";
import * as svc from "../services/jours_feries.service.js";

// GET /jours-feries
export async function getJoursFeries(_req: Request, res: Response) {
    const rows = await svc.listJoursFeries();
    res.status(200).json(rows);
}

// POST /jours-feries
export async function postJourFerie(req: Request, res: Response) {
    const created = await svc.createJourFerie(req.body);
    res.status(201).json(created);
}

// PUT /jours-feries/:id
export async function putJourFerie(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateJourFerie(id, req.body);
    res.status(200).json(updated);
}

// DELETE /jours-feries/:id
export async function deleteJourFerie(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteJourFerie(id);
    res.status(204).send();
}

