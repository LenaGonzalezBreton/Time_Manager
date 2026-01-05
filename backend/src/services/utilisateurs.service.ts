import { AppDataSource } from "../data-source";
import { Utilisateur } from "../entities/Utilisateur";
import {Role} from "../entities/Role";

// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Utilisateur);
const roleRepo = () => AppDataSource.getRepository(Role);

// Liste tous les utilisateurs
export async function listUtilisateurs() {
    return await repo().find();
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