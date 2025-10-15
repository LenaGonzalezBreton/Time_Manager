import { AppDataSource } from "../data-source";
import { Horaire } from "../entities/Horaire";
import {Utilisateur} from "../entities/Utilisateur";
import {Not} from "typeorm";

// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Horaire);
const utilisateurRepo = () => AppDataSource.getRepository(Utilisateur);

// Liste tous les horaires POUR un utilisateur
export async function listHorairesByUser(data: { id_utilisateur: number }) {
    return await repo().find({
        relations: ["utilisateur"], // jointure avec l'entité Utilisateur
        select: {
            id_horaire: true,
            type: true,
            jour: true,
            heure: true
        },
        where: { utilisateur: { id_utilisateur: data.id_utilisateur } } // filtre par id_utilisateur
    });
}

// Liste tous les horaires avec l'id_utilisateur
export async function listHoraires() {
    return await repo().find({
        relations: ["utilisateur"], // jointure avec l'entité Utilisateur
        select: {
            id_horaire: true,
            type: true,
            jour: true,
            heure: true,
            utilisateur: {
                id_utilisateur: true // sélectionne uniquement l'id_utilisateur
            }
        }
    });
}

// Créer un nouvel horaire
export async function createHoraire(data: { type: string, jour: string, heure: string, id_utilisateur: number }) {
    const existing = await repo().findOneBy({ type: data.type, jour: data.jour }); // Verification si existe déjà
    if (existing) throw { status: 409, message: "Ce type d'horaire a déjà été déclaré pour ce jour pour cet utilisateur" };

    const utilisateur = await utilisateurRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
    if (!utilisateur) throw { status: 400, message: "Utilisateur invalide" };

    const horaire = repo().create({
        type: data.type,
        jour: data.jour,
        heure: data.heure,
        utilisateur, // mapper l'objet Utilisateur (relation ManyToOne)
    });
    return await repo().save(horaire);
}

// Mettre à jour un horaire
export async function updateHoraire(id_horaire: number, data: Partial<Horaire>) {
    const horaire = await repo().findOneBy({ id_horaire });
    if (!horaire) throw { status: 404, message: "Horaire introuvable" };

    // Exclure l'horaire actuel de la recherche
    const existing = await repo().findOneBy({
        type: data.type ?? horaire.type,
        jour: data.jour ?? horaire.jour,
        id_horaire: Not(id_horaire)
    });
    if (existing) throw { status: 409, message: "Ce type d'horaire a déjà été déclaré pour ce jour pour cet utilisateur" };

    const merged = repo().merge(horaire, data);
    return await repo().save(merged);
}

// Supprimer un horaire
export async function deleteHoraire(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Horaire introuvable" };
}