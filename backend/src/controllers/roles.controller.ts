import { Request, Response } from "express";
import * as svc from "../services/roles.service.js";

// GET /roles
export async function getRoles(_req: Request, res: Response) {
    const roles = await svc.listRoles();
    res.status(200).json(roles);
}

// POST /roles
export async function postRole(req: Request, res: Response) {
    const created = await svc.createRole(req.body);
    res.status(201).json(created);
}

// PUT /roles/:id
export async function putRole(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateRole(id, req.body);
    res.status(200).json(updated);
}

// DELETE /roles/:id
export async function deleteRole(req: Request, res: Response) {
    const id = Number(req.params.id);
    await svc.deleteRole(id);
    res.status(204).send();
}