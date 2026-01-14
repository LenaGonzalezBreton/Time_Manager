import { Request, Response, NextFunction } from "express";
import * as svc from "../services/indicateurs.service.js";

// GET /indicateurs
export async function getIndicateurs(_req: Request, res: Response, next: NextFunction) {
    try {
        const indicateurs = await svc.listIndicateurs();
        res.status(200).json(indicateurs);
    } catch (err) {
        next(err);
    }
}

// POST /indicateur
export async function postIndicateur(req: Request, res: Response, next: NextFunction) {
    try {
        const created = await svc.createIndicateur(req.body);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
}

// PUT /indicateur/:id
export async function putIndicateur(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const updated = await svc.updateIndicateur(id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

// DELETE /indicateur/:id
export async function deleteIndicateur(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        await svc.deleteIndicateur(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// GET /api/indicateurs/teams
export async function getTeamsStats(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await svc.getAllTeamStats();
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
}

// GET /api/indicateurs/teams/:id
export async function getTeamDetailStats(req: Request, res: Response, next: NextFunction) {
    try {
        const teamId = Number(req.params.id);
        const stats = await svc.getTeamUserStats(teamId);
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
}