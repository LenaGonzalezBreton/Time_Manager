import { Request, Response } from "express";
import * as svc from "../services/utilisateurs.service";

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