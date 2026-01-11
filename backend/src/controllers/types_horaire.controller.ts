import { Request, Response } from "express";
import * as svc from "../services/types_horaire.service.js";

// GET /types-horaire
export async function getTypesHoraire(_req: Request, res: Response) {
    const rows = await svc.listTypesHoraire();
    res.status(200).json(rows);
}

// POST /types-horaire
export async function postTypeHoraire(req: Request, res: Response) {
    const created = await svc.createTypeHoraire(req.body);
    res.status(201).json(created);
}

// PUT /types-horaire/:id
export async function putTypeHoraire(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateTypeHoraire(id, req.body);
    res.status(200).json(updated);
}

// DELETE /types-horaire/:id
export async function deleteTypeHoraire(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteTypeHoraire(id);
    res.status(204).send();
}

