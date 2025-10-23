import { AppDataSource } from "../data-source";
import { Absence } from "../entities/Absence";
import { Utilisateur } from "../entities/Utilisateur";
import { TypeAbsence } from "../entities/Type_Absence";
import { Not } from "typeorm";

const repo = () => AppDataSource.getRepository(Absence);
const userRepo = () => AppDataSource.getRepository(Utilisateur);
const typeRepo = () => AppDataSource.getRepository(TypeAbsence);

export async function listAbsences() {
    return repo().find({ relations: ["utilisateur", "type_absence"], order: { date_debut: "DESC" } });
}

export async function createAbsence(data: {
    id_utilisateur: number;
    id_type_absence: number;
    date_debut: string; // YYYY-MM-DD
    date_fin: string;   // YYYY-MM-DD
    justifiee?: boolean;
    commentaire?: string | null;
}) {
    const utilisateur = await userRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
    if (!utilisateur) throw { status: 400, message: "Utilisateur invalide" };

    const type_absence = await typeRepo().findOneBy({ id_type_absence: data.id_type_absence });
    if (!type_absence) throw { status: 400, message: "Type d'absence invalide" };

    // Check doublon exact (même période pour le même utilisateur)
    const duplicate = await repo().findOne({ where: { utilisateur: { id_utilisateur: data.id_utilisateur }, date_debut: data.date_debut, date_fin: data.date_fin } });
    if (duplicate) throw { status: 409, message: "Une absence existe déjà pour cet utilisateur et cette période" };

    const absence = repo().create({
        utilisateur,
        type_absence,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        justifiee: data.justifiee ?? true,
        commentaire: data.commentaire ?? null,
    });
    return await repo().save(absence);
}

export async function updateAbsence(
    id_absence: number,
    data: Partial<{
        id_utilisateur: number;
        id_type_absence: number;
        date_debut: string;
        date_fin: string;
        justifiee: boolean;
        commentaire: string | null;
    }>
) {
    const absence = await repo().findOne({ where: { id_absence }, relations: ["utilisateur", "type_absence"] });
    if (!absence) throw { status: 404, message: "Absence introuvable" };

    // Changement d'utilisateur
    let utilisateur = absence.utilisateur;
    if (data.id_utilisateur && data.id_utilisateur !== utilisateur.id_utilisateur) {
        const u = await userRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
        if (!u) throw { status: 400, message: "Utilisateur invalide" };
        utilisateur = u;
    }

    // Changement de type d'absence
    let type_absence = absence.type_absence;
    if (data.id_type_absence && data.id_type_absence !== type_absence.id_type_absence) {
        const t = await typeRepo().findOneBy({ id_type_absence: data.id_type_absence });
        if (!t) throw { status: 400, message: "Type d'absence invalide" };
        type_absence = t;
    }

    const newDebut = data.date_debut ?? absence.date_debut;
    const newFin = data.date_fin ?? absence.date_fin;

    // Vérifier doublon exact (exclure l'enregistrement courant)
    const dup = await repo().findOne({
        where: {
            utilisateur: { id_utilisateur: utilisateur.id_utilisateur },
            date_debut: newDebut,
            date_fin: newFin,
            id_absence: Not(id_absence) as any,
        } as any,
    });
    if (dup) throw { status: 409, message: "Une absence existe déjà pour cet utilisateur et cette période" };

    absence.utilisateur = utilisateur;
    absence.type_absence = type_absence;
    absence.date_debut = newDebut;
    absence.date_fin = newFin;
    if (data.justifiee !== undefined) absence.justifiee = data.justifiee;
    if (data.commentaire !== undefined) absence.commentaire = data.commentaire;

    return await repo().save(absence);
}

export async function deleteAbsence(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Absence introuvable" };
}

