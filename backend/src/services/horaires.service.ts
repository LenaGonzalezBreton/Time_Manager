import { AppDataSource } from "../data-source.js";
import { Horaire } from "../entities/Horaire.js";
import { Utilisateur } from "../entities/Utilisateur.js";
import { TypeHoraire } from "../entities/Type_Horaire.js";
import { Not } from "typeorm";

// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Horaire);
const utilisateurRepo = () => AppDataSource.getRepository(Utilisateur);
const typeHoraireRepo = () => AppDataSource.getRepository(TypeHoraire);

// Liste tous les horaires POUR un utilisateur
export async function listHorairesByUser(data: { id_utilisateur: number }) {
    return await repo().find({
        relations: ["utilisateur", "type_horaire"],
        where: { utilisateur: { id_utilisateur: data.id_utilisateur } },
        order: { jour: "ASC" }
    });
}

// Liste tous les horaires avec l'id_utilisateur
export async function listHoraires() {
    return await repo().find({
        relations: ["utilisateur", "type_horaire"],
        order: { jour: "ASC" }
    });
}

// Créer un nouvel horaire
export async function createHoraire(data: {
    jour: string; // format ISO YYYY-MM-DD
    id_utilisateur: number;
    id_type_horaire?: number | null;
    heure_arrivee?: string | null; // ISO datetime ou RFC3339
    heure_depart?: string | null;  // ISO datetime ou RFC3339
    minutes_retard?: number;
    minutes_travaillees?: number;
}) {
    // Vérifie l'utilisateur
    const utilisateur = await utilisateurRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
    if (!utilisateur) throw { status: 400, message: "Utilisateur invalide" };

    // Unicité: un seul enregistrement par (utilisateur, jour)
    const duplicate = await repo().findOne({ where: { utilisateur: { id_utilisateur: data.id_utilisateur }, jour: data.jour } });
    if (duplicate) throw { status: 409, message: "Un horaire existe déjà pour cet utilisateur à ce jour" };

    // Type d'horaire optionnel
    let type_horaire: TypeHoraire | null = null;
    if (data.id_type_horaire != null) {
        type_horaire = await typeHoraireRepo().findOneBy({ id_type_horaire: Number(data.id_type_horaire) });
        if (!type_horaire) throw { status: 400, message: "Type d'horaire invalide" };
    }

    const horaire = repo().create({
        jour: data.jour,
        heure_arrivee: data.heure_arrivee ? new Date(data.heure_arrivee) : null,
        heure_depart: data.heure_depart ? new Date(data.heure_depart) : null,
        minutes_retard: data.minutes_retard ?? 0,
        minutes_travaillees: data.minutes_travaillees ?? 0,
        type_horaire,
        utilisateur,
    });
    return await repo().save(horaire);
}

// Mettre à jour un horaire
export async function updateHoraire(id_horaire: number, data: Partial<{
    jour: string;
    id_utilisateur: number;
    id_type_horaire: number | null;
    heure_arrivee: string | null;
    heure_depart: string | null;
    minutes_retard: number;
    minutes_travaillees: number;
}>) {
    const horaire = await repo().findOne({ where: { id_horaire }, relations: ["utilisateur", "type_horaire"] });
    if (!horaire) throw { status: 404, message: "Horaire introuvable" };

    // Gérer un éventuel changement d'utilisateur
    let utilisateur = horaire.utilisateur;
    if (data.id_utilisateur && data.id_utilisateur !== horaire.utilisateur.id_utilisateur) {
        const user = await utilisateurRepo().findOneBy({ id_utilisateur: data.id_utilisateur });
        if (!user) throw { status: 400, message: "Utilisateur invalide" };
        utilisateur = user;
    }

    // Gérer un éventuel changement de type d'horaire
    let type_horaire = horaire.type_horaire;
    if (data.id_type_horaire !== undefined) {
        if (data.id_type_horaire === null) {
            type_horaire = null;
        } else {
            const th = await typeHoraireRepo().findOneBy({ id_type_horaire: Number(data.id_type_horaire) });
            if (!th) throw { status: 400, message: "Type d'horaire invalide" };
            type_horaire = th;
        }
    }

    const newJour = data.jour ?? horaire.jour;

    // Vérifier l'unicité (utilisateur, jour) en excluant l'enregistrement courant
    const existing = await repo().findOne({
        where: {
            jour: newJour,
            utilisateur: { id_utilisateur: utilisateur.id_utilisateur },
            id_horaire: Not(id_horaire) as any
        } as any
    });
    if (existing) throw { status: 409, message: "Un horaire existe déjà pour cet utilisateur à ce jour" };

    horaire.jour = newJour;
    horaire.utilisateur = utilisateur;
    horaire.type_horaire = type_horaire ?? null;
    if (data.heure_arrivee !== undefined) horaire.heure_arrivee = data.heure_arrivee ? new Date(data.heure_arrivee) : null;
    if (data.heure_depart !== undefined) horaire.heure_depart = data.heure_depart ? new Date(data.heure_depart) : null;
    if (data.minutes_retard !== undefined) horaire.minutes_retard = data.minutes_retard;
    if (data.minutes_travaillees !== undefined) horaire.minutes_travaillees = data.minutes_travaillees;

    return await repo().save(horaire);
}

// Supprimer un horaire
export async function deleteHoraire(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Horaire introuvable" };
}