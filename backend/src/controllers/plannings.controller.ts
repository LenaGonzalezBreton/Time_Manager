import { Request, Response } from "express";
import * as svc from "../services/plannings.service";

// GET /plannings
export async function getPlannings(_req: Request, res: Response) {
    const rows = await svc.listPlannings();
    res.status(200).json(rows);
}

// POST /plannings
export async function postPlanning(req: Request, res: Response) {
    const created = await svc.createPlanning(req.body);
    res.status(201).json(created);
}

// PUT /plannings/:id
export async function putPlanning(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updatePlanning(id, req.body);
    res.status(200).json(updated);
}

// DELETE /plannings/:id
export async function deletePlanning(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deletePlanning(id);
    res.status(204).send();
}

