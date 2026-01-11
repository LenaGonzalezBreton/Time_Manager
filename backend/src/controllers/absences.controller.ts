import { Request, Response } from "express";
import * as svc from "../services/absences.service.js";

// GET /absences
export async function getAbsences(_req: Request, res: Response) {
    const rows = await svc.listAbsences();
    res.status(200).json(rows);
}

// POST /absences
export async function postAbsence(req: Request, res: Response) {
    const created = await svc.createAbsence(req.body);
    res.status(201).json(created);
}

// PUT /absences/:id
export async function putAbsence(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateAbsence(id, req.body);
    res.status(200).json(updated);
}

// DELETE /absences/:id
export async function deleteAbsence(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteAbsence(id);
    res.status(204).send();
}

