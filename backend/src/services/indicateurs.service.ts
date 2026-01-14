import { AppDataSource } from "../data-source.js";
import { Indicateur } from "../entities/Indicateur.js";
import { CibleIndicateur } from "../entities/Cible_Indicateur.js";
import { Not } from "typeorm";

// Repositories
const repo = () => AppDataSource.getRepository(Indicateur);
const cibleRepo = () => AppDataSource.getRepository(CibleIndicateur);

// Liste tous les indicateurs avec leur cible
export async function listIndicateurs() {
    return await repo().find({
        relations: ["cible_indicateur"],
        order: { date_periode: "DESC" }
    });
}

// Liste les indicateurs pour un utilisateur spécifique
export async function listIndicateursByUser(userId: number) {
    // Trouver la cible correspondant à l'utilisateur
    const cible = await cibleRepo().findOne({ where: { type_cible: "utilisateur", id_cible: userId } });
    if (!cible) return [];

    return await repo().find({
        where: { cible_indicateur: { id_cible_indicateur: cible.id_cible_indicateur } },
        relations: ["cible_indicateur"],
        order: { date_periode: "DESC" }
    });
}

// récupérer ou créer une cible_indicateur
async function getOrCreateCible(type_cible: "utilisateur" | "equipe", id_cible: number) {
    let cible = await cibleRepo().findOne({ where: { type_cible, id_cible } });
    if (!cible) {
        cible = cibleRepo().create({ type_cible, id_cible });
        cible = await cibleRepo().save(cible);
    }
    return cible;
}

// Créer un nouvel indicateur
export async function createIndicateur(data: {
    id_cible_indicateur?: number;
    type_cible?: "utilisateur" | "equipe";
    id_cible?: number;
    date_periode: string; // YYYY-MM-DD
    taux_retard?: string | number | null;
    taux_presence?: string | number | null;
    minutes_travaillees?: number;
    minutes_retards?: number;
}) {
    // Cible: accepter soit id_cible_indicateur, soit type_cible + id_cible
    let cible: CibleIndicateur;

    if (data.id_cible_indicateur) {
        // Utiliser l'ID de cible existant
        const existingCible = await cibleRepo().findOne({ where: { id_cible_indicateur: data.id_cible_indicateur } });
        if (!existingCible) throw { status: 400, message: "Cible d'indicateur introuvable" };
        cible = existingCible;
    } else if (data.type_cible && data.id_cible !== undefined) {
        // Créer ou récupérer la cible
        cible = await getOrCreateCible(data.type_cible, data.id_cible);
    } else {
        throw { status: 400, message: "Il faut fournir soit id_cible_indicateur, soit type_cible et id_cible" };
    }

    // Unicité cible + date_periode
    const existing = await repo().findOne({ where: { cible_indicateur: { id_cible_indicateur: cible.id_cible_indicateur }, date_periode: data.date_periode }, relations: ["cible_indicateur"] });
    if (existing) throw { status: 409, message: "Un indicateur existe déjà pour cette cible et cette période" };

    const indicateur = repo().create({
        date_periode: data.date_periode,
        taux_retard: data.taux_retard != null ? String(data.taux_retard) : null,
        taux_presence: data.taux_presence != null ? String(data.taux_presence) : null,
        minutes_travaillees: data.minutes_travaillees ?? 0,
        minutes_retards: data.minutes_retards ?? 0,
        cible_indicateur: cible,
    });
    return await repo().save(indicateur);
}

// Mettre à jour un indicateur
export async function updateIndicateur(
    id_indicateur: number,
    data: Partial<{
        type_cible: "utilisateur" | "equipe";
        id_cible: number;
        date_periode: string;
        taux_retard: string | number | null;
        taux_presence: string | number | null;
        minutes_travaillees: number;
        minutes_retards: number;
    }>
) {
    const indicateur = await repo().findOne({ where: { id_indicateur }, relations: ["cible_indicateur"] });
    if (!indicateur) throw { status: 404, message: "Indicateur introuvable" };

    // Gestion éventuel changement de cible
    let cible = indicateur.cible_indicateur;
    const wantsChangeCible = data.type_cible !== undefined || data.id_cible !== undefined;
    if (wantsChangeCible) {
        const type_cible = (data.type_cible ?? cible.type_cible) as "utilisateur" | "equipe";
        const id_cible = data.id_cible ?? cible.id_cible;
        cible = await getOrCreateCible(type_cible, id_cible);
    }

    const newDate = data.date_periode ?? indicateur.date_periode;

    // Unicité cible + date_periode (excluant l'enregistrement courant)
    const duplicate = await repo().findOne({
        where: {
            date_periode: newDate,
            cible_indicateur: { id_cible_indicateur: cible.id_cible_indicateur },
            id_indicateur: Not(id_indicateur) as any,
        } as any,
        relations: ["cible_indicateur"],
    });
    if (duplicate) throw { status: 409, message: "Un indicateur existe déjà pour cette cible et cette période" };

    indicateur.cible_indicateur = cible;
    indicateur.date_periode = newDate;
    if (data.taux_retard !== undefined) indicateur.taux_retard = data.taux_retard != null ? String(data.taux_retard) : null;
    if (data.taux_presence !== undefined) indicateur.taux_presence = data.taux_presence != null ? String(data.taux_presence) : null;
    if (data.minutes_travaillees !== undefined) indicateur.minutes_travaillees = data.minutes_travaillees;
    if (data.minutes_retards !== undefined) indicateur.minutes_retards = data.minutes_retards;

    return await repo().save(indicateur);
}

// Supprimer un indicateur
export async function deleteIndicateur(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Indicateur introuvable" };
}

// ==================== STATISTIQUES ÉQUIPES ====================

// Helper pour récupérer le dernier indicateur d'un utilisateur
async function getLatestIndicateur(userId: number) {
    // Trouver la cible
    const cible = await cibleRepo().findOne({ where: { type_cible: "utilisateur", id_cible: userId } });
    if (!cible) return null;

    // Trouver le dernier indicateur
    const indicateur = await repo().findOne({
        where: { cible_indicateur: { id_cible_indicateur: cible.id_cible_indicateur } },
        order: { date_periode: "DESC" }
    });
    return indicateur;
}

// Récupérer les stats détaillées des membres d'une équipe
export async function getTeamUserStats(teamId: number) {
    const { AppDataSource } = await import("../data-source.js");
    const { Equipe } = await import("../entities/Equipe.js");

    // Récupérer l'équipe et ses membres
    const equipe = await AppDataSource.getRepository(Equipe).findOne({
        where: { id_equipe: teamId },
        relations: ['membres']
    });

    if (!equipe) throw { status: 404, message: "Équipe introuvable" };

    // Pour chaque membre, récupérer ses dernières stats
    const stats = await Promise.all(equipe.membres.map(async (membre) => {
        const indicateur = await getLatestIndicateur(membre.id_utilisateur);
        // Si pas d'indicateur, on renvoie une structure vide/par défaut
        return {
            utilisateur: {
                id_utilisateur: membre.id_utilisateur,
                nom: membre.nom,
                prenom: membre.prenom,
                email: membre.email
            },
            stats: indicateur || {
                taux_presence: 0,
                taux_retard: 0,
                minutes_travaillees: 0,
                minutes_retards: 0
            }
        };
    }));

    return stats;
}

// Récupérer les stats agrégées pour toutes les équipes
export async function getAllTeamStats() {
    const { AppDataSource } = await import("../data-source.js");
    const { Equipe } = await import("../entities/Equipe.js");

    const équipes = await AppDataSource.getRepository(Equipe).find({
        relations: ['membres']
    });

    const teamStats = await Promise.all(équipes.map(async (equipe) => {
        if (!equipe.membres || equipe.membres.length === 0) {
            return {
                id_equipe: equipe.id_equipe,
                nom: equipe.nom,
                stats: {
                    taux_presence_moyen: 0,
                    taux_retard_moyen: 0,
                    heures_travaillees_total: 0
                },
                memberCount: 0
            };
        }

        let totalPresence = 0;
        let totalRetard = 0;
        let totalMinutes = 0;
        let count = 0;

        for (const membre of equipe.membres) {
            const ind = await getLatestIndicateur(membre.id_utilisateur);
            if (ind) {
                totalPresence += Number(ind.taux_presence || 0);
                totalRetard += Number(ind.taux_retard || 0);
                totalMinutes += Number(ind.minutes_travaillees || 0);
                count++;
            }
        }

        const stats = count === 0 ? {
            taux_presence_moyen: 0,
            taux_retard_moyen: 0,
            heures_travaillees_total: 0
        } : {
            taux_presence_moyen: totalPresence / count,
            taux_retard_moyen: totalRetard / count,
            heures_travaillees_total: totalMinutes / 60
        };

        return {
            id_equipe: equipe.id_equipe,
            nom: equipe.nom,
            stats,
            memberCount: equipe.membres.length
        };
    }));

    return teamStats;
}