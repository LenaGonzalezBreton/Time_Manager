import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

/**
 * POST /api/auth/login
 * Authentifie un utilisateur et retourne un token JWT
 */
export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/register
 * Enregistre un nouvel utilisateur (réservé aux managers)
 */
export async function registerController(req: Request, res: Response, next: NextFunction) {
    try {
        const { nom, prenom, email, telephone, mot_de_passe, id_role } = req.body;

        if (!nom || !prenom || !email || !mot_de_passe || !id_role) {
            return res.status(400).json({
                message: "Champs requis: nom, prenom, email, mot_de_passe, id_role"
            });
        }

        const user = await authService.register({
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            id_role
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/me
 * Retourne les informations de l'utilisateur actuellement connecté
 */
export async function getCurrentUserController(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        const user = await authService.getUserById(req.user.id_utilisateur);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
