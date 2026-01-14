import { AppDataSource } from "../data-source.js";
import { Utilisateur } from "../entities/Utilisateur.js";
import { Role } from "../entities/Role.js";
import bcrypt from "bcryptjs";
import * as historiqueService from "./historique.service.js";

// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Utilisateur);
const roleRepo = () => AppDataSource.getRepository(Role);

// Liste tous les utilisateurs
export async function listUtilisateurs() {
    return await repo().find({
        relations: ['role']
    });
}

// Créer un nouvel utilisateur
export async function createUtilisateur(data: { nom: string, prenom: string, email: string, telephone: string | null, mot_de_passe: string, id_role: number }) {
    const existing = await repo().findOneBy({ email: data.email }); // Verification si existe déjà
    if (existing) throw { status: 409, message: "Cet email est déjà attribué à un utilisateur" };

    const role = await roleRepo().findOneBy({ id_role: data.id_role });
    if (!role) throw { status: 400, message: "Rôle invalide" };

    const utilisateur = repo().create({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone ?? null,
        mot_de_passe: data.mot_de_passe,
        role, // mapper l'objet Role (relation ManyToOne)
    });
    return await repo().save(utilisateur);
}

// Mettre à jour un utilisateur
export async function updateUtilisateur(id_utilisateur: number, data: Partial<Utilisateur>) {
    const utilisateur = await repo().findOneBy({ id_utilisateur });
    if (!utilisateur) throw { status: 404, message: "Utilisateur introuvable" };

    if (data.email && data.email !== utilisateur.email) {
        const dup = await repo().findOneBy({ email: data.email });
        if (dup && dup.id_utilisateur !== id_utilisateur) throw { status: 409, message: "Cet email est déjà associé à un utilisateur" };
    }

    const merged = repo().merge(utilisateur, data);
    return await repo().save(merged);
}

// Supprimer un utilisateur
export async function deleteUtilisateur(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Utilisateur introuvable" };
}

// ==================== NOUVELLES FONCTIONS POUR LA GESTION DES UTILISATEURS ====================

// Mise à jour par un manager (ne peut pas modifier un autre manager)
export async function updateUtilisateurByManager(
    id_manager: number,
    id_utilisateur: number,
    data: { nom?: string; prenom?: string; email?: string; telephone?: string | null; id_role?: number }
) {
    // Vérifier que le manager existe et est bien un manager
    const manager = await repo().findOne({
        where: { id_utilisateur: id_manager },
        relations: ['role']
    });
    if (!manager || manager.role?.titre !== 'Manager') {
        throw { status: 403, message: "Accès refusé : vous devez être manager" };
    }

    // Récupérer l'utilisateur à modifier
    const utilisateur = await repo().findOne({
        where: { id_utilisateur },
        relations: ['role']
    });
    if (!utilisateur) throw { status: 404, message: "Utilisateur introuvable" };

    // Vérifier que l'utilisateur à modifier n'est pas un manager
    if (utilisateur.role?.titre === 'Manager') {
        throw { status: 403, message: "Vous ne pouvez pas modifier un autre manager" };
    }

    // Vérifier l'unicité de l'email si modifié
    if (data.email && data.email !== utilisateur.email) {
        const dup = await repo().findOneBy({ email: data.email });
        if (dup && dup.id_utilisateur !== id_utilisateur) {
            throw { status: 409, message: "Cet email est déjà associé à un utilisateur" };
        }
    }

    // Si le rôle est modifié, vérifier qu'il existe
    if (data.id_role) {
        const role = await roleRepo().findOneBy({ id_role: data.id_role });
        if (!role) throw { status: 400, message: "Rôle invalide" };
        // Ne pas permettre de changer vers Manager
        if (role.titre === 'Manager') {
            throw { status: 403, message: "Vous ne pouvez pas promouvoir un utilisateur en manager" };
        }
        utilisateur.role = role;
    }

    // Appliquer les modifications et enregistrer l'historique
    const changes: Array<{ champ: string; ancienne: string; nouvelle: string }> = [];

    if (data.nom && data.nom !== utilisateur.nom) {
        changes.push({ champ: 'nom', ancienne: utilisateur.nom, nouvelle: data.nom });
        utilisateur.nom = data.nom;
    }
    if (data.prenom && data.prenom !== utilisateur.prenom) {
        changes.push({ champ: 'prenom', ancienne: utilisateur.prenom, nouvelle: data.prenom });
        utilisateur.prenom = data.prenom;
    }
    if (data.email && data.email !== utilisateur.email) {
        changes.push({ champ: 'email', ancienne: utilisateur.email, nouvelle: data.email });
        utilisateur.email = data.email;
    }
    if (data.telephone !== undefined && data.telephone !== utilisateur.telephone) {
        changes.push({
            champ: 'telephone',
            ancienne: utilisateur.telephone || 'vide',
            nouvelle: data.telephone || 'vide'
        });
        utilisateur.telephone = data.telephone;
    }

    const updated = await repo().save(utilisateur);

    // Enregistrer les modifications dans l'historique
    for (const change of changes) {
        await historiqueService.createHistoriqueEntry({
            type_modification: 'utilisateur',
            id_utilisateur_modifie: id_utilisateur,
            id_utilisateur_modificateur: id_manager,
            champ_modifie: change.champ,
            ancienne_valeur: change.ancienne,
            nouvelle_valeur: change.nouvelle
        });
    }

    return updated;
}

// Auto-modification (utilisateur modifie ses propres informations)
export async function updateUtilisateurSelf(
    id_utilisateur: number,
    data: { email?: string; telephone?: string | null }
) {
    const utilisateur = await repo().findOneBy({ id_utilisateur });
    if (!utilisateur) throw { status: 404, message: "Utilisateur introuvable" };

    // Appliquer les modifications et enregistrer l'historique
    const changes: Array<{ champ: string; ancienne: string; nouvelle: string }> = [];

    if (data.email && data.email !== utilisateur.email) {
        changes.push({ champ: 'email', ancienne: utilisateur.email, nouvelle: data.email });
        utilisateur.email = data.email;
    }

    if (data.telephone !== undefined && data.telephone !== utilisateur.telephone) {
        changes.push({
            champ: 'telephone',
            ancienne: utilisateur.telephone || 'vide',
            nouvelle: data.telephone || 'vide'
        });
        utilisateur.telephone = data.telephone;
    }

    const updated = await repo().save(utilisateur);

    // Enregistrer les modifications dans l'historique (auto-modification)
    for (const change of changes) {
        await historiqueService.createHistoriqueEntry({
            type_modification: 'profil',
            id_utilisateur_modifie: id_utilisateur,
            id_utilisateur_modificateur: null, // Auto-modification
            champ_modifie: change.champ,
            ancienne_valeur: change.ancienne,
            nouvelle_valeur: change.nouvelle
        });
    }

    return updated;
}

// Changement de mot de passe
export async function updatePassword(
    id_utilisateur: number,
    oldPassword: string,
    newPassword: string
) {
    const utilisateur = await repo().findOneBy({ id_utilisateur });
    if (!utilisateur) throw { status: 404, message: "Utilisateur introuvable" };

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, utilisateur.mot_de_passe);
    if (!isValid) {
        throw { status: 401, message: "Ancien mot de passe incorrect" };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    utilisateur.mot_de_passe = hashedPassword;

    await repo().save(utilisateur);

    // Enregistrer dans l'historique
    await historiqueService.createHistoriqueEntry({
        type_modification: 'profil',
        id_utilisateur_modifie: id_utilisateur,
        id_utilisateur_modificateur: null,
        champ_modifie: 'mot_de_passe',
        ancienne_valeur: '***',
        nouvelle_valeur: '***'
    });

    return { message: "Mot de passe modifié avec succès" };
}

// Assurer l'existence d'un administrateur par défaut
export async function ensureDefaultAdmin() {
    const adminEmail = "admin@timemanager.com";
    const exists = await repo().findOneBy({ email: adminEmail });
    if (!exists) {
        const adminRole = await roleRepo().findOneBy({ titre: "Administrateur" });
        if (adminRole) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await repo().save(repo().create({
                nom: "Admin",
                prenom: "System",
                email: adminEmail,
                mot_de_passe: hashedPassword,
                role: adminRole,
                telephone: "0000000000"
            }));
            console.log("Compte Administrateur par défaut créé : admin@timemanager.com / admin123");
        } else {
            console.error("Impossible de créer l'admin : Rôle 'Administrateur' introuvable.");
        }
    }
}