import { Request, Response } from "express";
import * as svc from "../services/indicateurs.service";

// GET /indicateurs
export async function getIndicateurs(_req: Request, res: Response) {
    const indicateurs = await svc.listIndicateurs();
    res.status(200).json(indicateurs);
}

// POST /indicateur
export async function postIndicateur(req: Request, res: Response) {
    const created = await svc.createIndicateur(req.body);
    res.status(201).json(created);
}

// PUT /indicateur/:id
export async function putIndicateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateIndicateur(id, req.body);
    res.status(200).json(updated);
}

// DELETE /indicateur/:id
export async function deleteIndicateur(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteIndicateur(id);
    res.status(204).send();
}