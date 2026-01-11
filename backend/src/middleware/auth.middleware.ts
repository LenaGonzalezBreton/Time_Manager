import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../services/auth.service.js";

// Étendre l'interface Request pour inclure les informations utilisateur
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware d'authentification - Vérifie le token JWT
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Token d'authentification requis" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(error.status || 401).json({ message: error.message || "Token invalide" });
    }
}

/**
 * Middleware d'autorisation - Vérifie le rôle de l'utilisateur
 * @param allowedRoles - Liste des rôles autorisés (ex: ["manager", "employee"])
 */
export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentification requise" });
        }

        const userRole = req.user.role.toLowerCase();
        const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

        if (!hasPermission) {
            return res.status(403).json({
                message: "Accès refusé - Permissions insuffisantes",
                required: allowedRoles,
                current: req.user.role
            });
        }

        next();
    };
}

/**
 * Middleware pour vérifier que l'utilisateur est un manager
 */
export const requireManager = requireRole("manager");

/**
 * Middleware pour vérifier que l'utilisateur accède à ses propres données
 * ou est un manager
 */
export function requireOwnerOrManager(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ message: "Authentification requise" });
    }

    const userId = Number(req.params.id);
    const isOwner = req.user.id_utilisateur === userId;
    const isManager = req.user.role.toLowerCase() === "manager";

    if (!isOwner && !isManager) {
        return res.status(403).json({
            message: "Accès refusé - Vous ne pouvez accéder qu'à vos propres données"
        });
    }

    next();
}
