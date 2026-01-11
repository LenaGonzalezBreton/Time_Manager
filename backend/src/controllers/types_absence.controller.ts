import { Request, Response } from "express";
import * as svc from "../services/types_absence.service.js";

// GET /types-absence
export async function getTypesAbsence(_req: Request, res: Response) {
    const rows = await svc.listTypesAbsence();
    res.status(200).json(rows);
}

// POST /types-absence
export async function postTypeAbsence(req: Request, res: Response) {
    const created = await svc.createTypeAbsence(req.body);
    res.status(201).json(created);
}

// PUT /types-absence/:id
export async function putTypeAbsence(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateTypeAbsence(id, req.body);
    res.status(200).json(updated);
}

// DELETE /types-absence/:id
export async function deleteTypeAbsence(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteTypeAbsence(id);
    res.status(204).send();
}

