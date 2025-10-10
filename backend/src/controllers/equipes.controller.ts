import { Request, Response } from "express";
import * as svc from "../services/equipes.service";

// GET /roles
export async function getEquipes(_req: Request, res: Response) {
    const equipes = await svc.listEquipes();
    res.status(200).json(equipes);
}

// POST /roles
export async function postEquipe(req: Request, res: Response) {
    const created = await svc.createEquipe(req.body);
    res.status(201).json(created);
}

// PUT /roles/:id
export async function putEquipe(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateEquipe(id, req.body);
    res.status(200).json(updated);
}

// DELETE /roles/:id
export async function deleteEquipe(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteEquipe(id);
    res.status(204).send();
}