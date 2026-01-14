import { Request, Response } from "express";
import * as svc from "../services/utilisateurs.service.js";
import * as absenceSvc from "../services/absences.service.js";
import * as indicateursSvc from "../services/indicateurs.service.js";

import * as roleService from "../services/roles.service.js";

// GET /utilisateurs
export async function getUtilisateurs(_req: Request, res: Response) {
    const utilisateurs = await svc.listUtilisateurs();
    res.status(200).json(utilisateurs);
}

// POST /utilisateurs
export async function postUtilisateur(req: Request, res: Response) {
    // @ts-ignore
    const userRole = req.user?.role;

    if (!userRole) {
        return res.status(401).json({ message: "Authentification requise" });
    }

    const data = req.body;

    if (userRole === "Manager") {
        // Manager ne peut créer que des employés
        const employeRole = await roleService.getRoleByTitle("Employé");
        if (!employeRole) return res.status(500).json({ message: "Rôle 'Employé' non configuré" });
        data.id_role = employeRole.id_role;
    } else if (userRole === "Administrateur") {
        // Administrateur peut choisir, mais il faut vérifier que id_role est fourni
        // Si non fourni, par défaut Employé ?? ou Erreur ?
        // Le front enverra id_role pour l'admin.
        // Si id_role n'est pas fourni, mettons Employé par défaut ou laissons le service gérer (qui plantera si id_role manquant)
        if (!data.id_role) {
            const employeRole = await roleService.getRoleByTitle("Employé");
            if (employeRole) data.id_role = employeRole.id_role;
        }
    } else {
        return res.status(403).json({ message: "Vous n'avez pas les droits pour créer un utilisateur" });
    }

    const created = await svc.createUtilisateur(data);
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

// ==================== NOUVELLES ROUTES POUR LA GESTION DES UTILISATEURS ====================

// PUT /utilisateurs/:id - Modification par manager
export async function updateUtilisateurByManager(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_manager = req.user?.id_utilisateur;
    if (!id_manager) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    const id_utilisateur = Number(req.params.id);
    const data = req.body;

    const utilisateur = await svc.updateUtilisateurByManager(id_manager, id_utilisateur, data);
    res.status(200).json(utilisateur);
}

// PUT /utilisateurs/me - Auto-modification
export async function updateUtilisateurSelf(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    const data = req.body;
    const utilisateur = await svc.updateUtilisateurSelf(id_utilisateur, data);
    res.status(200).json(utilisateur);
}

// PUT /utilisateurs/me/password - Changement de mot de passe
export async function updatePassword(req: Request, res: Response) {
    // @ts-ignore - req.user est ajouté par le middleware d'authentification
    const id_utilisateur = req.user?.id_utilisateur;
    if (!id_utilisateur) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Ancien et nouveau mot de passe requis" });
    }

    const result = await svc.updatePassword(id_utilisateur, oldPassword, newPassword);
    res.status(200).json(result);
}

// GET /utilisateurs/:id/absences
export async function getAbsencesByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const absences = await absenceSvc.listAbsencesByUser(id);
    res.status(200).json(absences);
}

// GET /utilisateurs/:id/indicateurs
export async function getIndicateursByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    // Note: dynamic import to avoid circular dependencies if any, or just direct import if fine. 
    // Wait, I need to import indicateursService.
    // I'll add the import at the top.
    const indicateurs = await indicateursSvc.listIndicateursByUser(id);
    res.status(200).json(indicateurs);
}