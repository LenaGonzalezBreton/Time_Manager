import { AppDataSource } from "../data-source";
import { Indicateur } from "../entities/Indicateur";
import { CibleIndicateur } from "../entities/Cible_Indicateur";
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

// Helper: récupérer ou créer une cible_indicateur
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
    type_cible: "utilisateur" | "equipe";
    id_cible: number;
    date_periode: string; // YYYY-MM-DD
    taux_retard?: string | number | null;
    taux_presence?: string | number | null;
    minutes_travaillees?: number;
    minutes_retards?: number;
}) {
    // Cible
    const cible = await getOrCreateCible(data.type_cible, data.id_cible);

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