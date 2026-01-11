import { Request, Response } from "express";
import * as svc from "../services/cibles_indicateur.service.js";

// GET /cibles-indicateur
export async function getCiblesIndicateur(_req: Request, res: Response) {
    const rows = await svc.listCiblesIndicateur();
    res.status(200).json(rows);
}

// POST /cibles-indicateur
export async function postCibleIndicateur(req: Request, res: Response) {
    const created = await svc.createCibleIndicateur(req.body);
    res.status(201).json(created);
}

// PUT /cibles-indicateur/:id
export async function putCibleIndicateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateCibleIndicateur(id, req.body);
    res.status(200).json(updated);
}

// DELETE /cibles-indicateur/:id
export async function deleteCibleIndicateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteCibleIndicateur(id);
    res.status(204).send();
}

