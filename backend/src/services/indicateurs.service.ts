import { AppDataSource } from "../data-source";
import { Indicateur } from "../entities/Indicateur";
import {Utilisateur} from "../entities/Utilisateur";
import {Not} from "typeorm";

// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Indicateur);
const utilisateurRepo = () => AppDataSource.getRepository(Utilisateur);

// Liste tous les indicateurs avec l'id_utilisateur et l'id_equipe
export async function listIndicateurs() {
    return await repo().find({
        relations: ["utilisateur", "utilisateur.equipes"], // jointure avec équipes
        select: {
            id_indicateur: true,
            taux_retard: true,
            taux_presence: true,
            heures_travaillees: true,
            duree_retards: true,
            utilisateur: {
                id_utilisateur: true,
                equipes: {
                    id_equipe: true
                }
            }
        }
    });
}

// Créer un nouvel indicateur
export async function createIndicateur(data: {id_utilisateur: number, taux_retard?: number, taux_presence?: number, heures_travaillees?: string, duree_retards?: string}) {
    // Vérifie si l'utilisateur possède déjà un indicateur
    const existing = await repo().findOneBy({ utilisateur: { id_utilisateur: data.id_utilisateur } });
    if (existing) throw { status: 409, message: "Cet utilisateur possède déjà un indicateur" };

    // Récupère l'utilisateur
    const utilisateur = await utilisateurRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
    if (!utilisateur) throw { status: 400, message: "Utilisateur invalide" };

    // Crée l'indicateur
    const indicateur = repo().create({
        taux_retard: data.taux_retard ?? null,
        taux_presence: data.taux_presence ?? null,
        heures_travaillees: data.heures_travaillees ?? null,
        duree_retards: data.duree_retards ?? null,
        utilisateur
    });
    return await repo().save(indicateur);
}

// Mettre à jour un indicateur
export async function updateIndicateur(
    id_indicateur: number,
    data: { taux_retard?: number; taux_presence?: number; heures_travaillees?: string; duree_retards?: string; id_utilisateur?: number }
) {
    const indicateur = await repo().findOne({ where: { id_indicateur }, relations: ["utilisateur"] });
    if (!indicateur) throw { status: 404, message: "Indicateur introuvable" };

    let utilisateur = indicateur.utilisateur;

    // Si on change l'utilisateur lié, vérifier l'unicité
    if (data.id_utilisateur && data.id_utilisateur !== indicateur.utilisateur.id_utilisateur) {
        const user = await utilisateurRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
        if (!user) throw { status: 400, message: "Utilisateur invalide" };

        const duplicate = await repo().findOne({
            where: { utilisateur: { id_utilisateur: data.id_utilisateur }, id_indicateur: Not(id_indicateur) },
            relations: ["utilisateur"],
        });
        if (duplicate) throw { status: 409, message: "Cet utilisateur possède déjà un indicateur" };

        utilisateur = user;
    }

    indicateur.taux_retard = data.taux_retard ?? indicateur.taux_retard;
    indicateur.taux_presence = data.taux_presence ?? indicateur.taux_presence;
    indicateur.heures_travaillees = data.heures_travaillees ?? indicateur.heures_travaillees;
    indicateur.duree_retards = data.duree_retards ?? indicateur.duree_retards;
    indicateur.utilisateur = utilisateur;

    return await repo().save(indicateur);
}

// Supprimer un indicateur
export async function deleteIndicateur(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Indicateur introuvable" };
}