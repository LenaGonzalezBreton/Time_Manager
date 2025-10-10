import { Request, Response } from "express";
import * as svc from "../services/roles.service";

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