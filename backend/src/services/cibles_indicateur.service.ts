import { AppDataSource } from "../data-source";
import { CibleIndicateur } from "../entities/Cible_Indicateur";
import { Not } from "typeorm";

const repo = () => AppDataSource.getRepository(CibleIndicateur);

export async function listCiblesIndicateur() {
    return repo().find({ order: { id_cible_indicateur: "DESC" } });
}

export async function createCibleIndicateur(data: { type_cible: "utilisateur" | "equipe"; id_cible: number; objectif_presence?: number; objectif_retard?: number; }) {
    const existing = await repo().findOne({ where: { type_cible: data.type_cible, id_cible: data.id_cible } });
    if (existing) throw { status: 409, message: "Cette cible existe déjà" };
    const cible = repo().create(data);
    return await repo().save(cible);
}

export async function updateCibleIndicateur(
    id_cible_indicateur: number,
    data: Partial<{ type_cible: "utilisateur" | "equipe"; id_cible: number; objectif_presence?: number; objectif_retard?: number; }>
) {
    const cible = await repo().findOneBy({ id_cible_indicateur });
    if (!cible) throw { status: 404, message: "Cible introuvable" };

    const type_cible = data.type_cible ?? cible.type_cible;
    const id_cible = data.id_cible ?? cible.id_cible;

    const dup = await repo().findOne({ where: { type_cible, id_cible, id_cible_indicateur: Not(id_cible_indicateur) as any } as any });
    if (dup) throw { status: 409, message: "Cette cible existe déjà" };

    cible.type_cible = type_cible;
    cible.id_cible = id_cible;
    if (data.objectif_presence !== undefined) cible.objectif_presence = data.objectif_presence;
    if (data.objectif_retard !== undefined) cible.objectif_retard = data.objectif_retard;
    return await repo().save(cible);
}

export async function deleteCibleIndicateur(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Cible introuvable" };
}

