import { AppDataSource } from "../data-source.js";
import { Planning } from "../entities/Planning.js";
import { Role } from "../entities/Role.js";

const repo = () => AppDataSource.getRepository(Planning);
const roleRepo = () => AppDataSource.getRepository(Role);

export async function listPlannings() {
    return repo().find({ relations: ["role"], order: { id_planning: "DESC" } });
}

export async function createPlanning(data: {
    jour_semaine: Planning["jour_semaine"];
    id_role: number;
    heure_arrivee?: string | null;
    heure_pause?: string | null;
    heure_depart?: string | null;
    jour_travail?: boolean;
}) {
    const role = await roleRepo().findOneBy({ id_role: data.id_role });
    if (!role) throw { status: 400, message: "Rôle invalide" };

    const planning = repo().create({
        jour_semaine: data.jour_semaine,
        heure_arrivee: data.heure_arrivee ?? null,
        heure_pause: data.heure_pause ?? null,
        heure_depart: data.heure_depart ?? null,
        jour_travail: data.jour_travail ?? true,
        role,
    });
    return await repo().save(planning);
}

export async function updatePlanning(
    id_planning: number,
    data: Partial<{
        jour_semaine: Planning["jour_semaine"];
        id_role: number;
        heure_arrivee: string | null;
        heure_pause: string | null;
        heure_depart: string | null;
        jour_travail: boolean;
    }>
) {
    const planning = await repo().findOne({ where: { id_planning }, relations: ["role"] });
    if (!planning) throw { status: 404, message: "Planning introuvable" };

    if (data.id_role && data.id_role !== planning.role.id_role) {
        const role = await roleRepo().findOneBy({ id_role: data.id_role });
        if (!role) throw { status: 400, message: "Rôle invalide" };
        planning.role = role;
    }

    if (data.jour_semaine !== undefined) planning.jour_semaine = data.jour_semaine;
    if (data.heure_arrivee !== undefined) planning.heure_arrivee = data.heure_arrivee;
    if (data.heure_pause !== undefined) planning.heure_pause = data.heure_pause;
    if (data.heure_depart !== undefined) planning.heure_depart = data.heure_depart;
    if (data.jour_travail !== undefined) planning.jour_travail = data.jour_travail;

    return await repo().save(planning);
}

export async function deletePlanning(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Planning introuvable" };
}

