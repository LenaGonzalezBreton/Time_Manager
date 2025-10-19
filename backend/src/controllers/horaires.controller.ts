import { Request, Response } from "express";
import * as svc from "../services/horaires.service";

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