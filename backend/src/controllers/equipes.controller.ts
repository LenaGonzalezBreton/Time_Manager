import { Request, Response } from "express";
import * as svc from "../services/equipes.service.js";

// GET /equipes
export async function getEquipes(_req: Request, res: Response) {
    const equipes = await svc.listEquipes();
    res.status(200).json(equipes);
}

// POST /equipes
export async function postEquipe(req: Request, res: Response) {
    // @ts-ignore
    const id_manager = req.user?.id_utilisateur;
    const created = await svc.createEquipe(req.body, id_manager);
    res.status(201).json(created);
}

// PUT /equipes/:id
export async function putEquipe(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await svc.updateEquipe(id, req.body);
    res.status(200).json(updated);
}

// DELETE /equipes/:id
export async function deleteEquipe(req: Request, res: Response) {
    // @ts-ignore
    const id_manager = req.user?.id_utilisateur;
    if (!id_manager) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    const id = Number(req.params.id);
    await svc.deleteEquipe(id, id_manager);
    res.status(204).send();
}

// GET /equipes/:id
export async function getEquipe(req: Request, res: Response) {
    const id = Number(req.params.id);
    const equipe = await svc.getEquipeById(id);
    res.status(200).json(equipe);
}

// POST /equipes/:id/membres - Ajouter un membre
export async function addMember(req: Request, res: Response) {
    // @ts-ignore
    const id_manager = req.user?.id_utilisateur;
    const id_equipe = Number(req.params.id);
    const { id_utilisateur } = req.body;

    if (!id_utilisateur) {
        return res.status(400).json({ message: "id_utilisateur requis" });
    }

    const equipe = await svc.addMemberToEquipe(id_equipe, id_utilisateur, id_manager);
    res.status(200).json(equipe);
}

// DELETE /equipes/:id/membres/:userId - Retirer un membre
export async function removeMember(req: Request, res: Response) {
    // @ts-ignore
    const id_manager = req.user?.id_utilisateur;
    const id_equipe = Number(req.params.id);
    const id_utilisateur = Number(req.params.userId);

    const equipe = await svc.removeMemberFromEquipe(id_equipe, id_utilisateur, id_manager);
    res.status(200).json(equipe);
}