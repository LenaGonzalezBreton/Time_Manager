import { AppDataSource } from "../data-source";
import { TypeHoraire } from "../entities/Type_Horaire";

const repo = () => AppDataSource.getRepository(TypeHoraire);

export async function listTypesHoraire() {
    return repo().find({ order: { type: "ASC" } });
}

export async function createTypeHoraire(data: { type: string }) {
    const existing = await repo().findOneBy({ type: data.type });
    if (existing) throw { status: 409, message: "Ce type d'horaire existe déjà" };
    const row = repo().create(data);
    return await repo().save(row);
}

export async function updateTypeHoraire(id_type_horaire: number, data: Partial<TypeHoraire>) {
    const row = await repo().findOneBy({ id_type_horaire });
    if (!row) throw { status: 404, message: "Type d'horaire introuvable" };

    if (data.type && data.type !== row.type) {
        const dup = await repo().findOneBy({ type: data.type });
        if (dup && dup.id_type_horaire !== id_type_horaire) throw { status: 409, message: "Ce type d'horaire existe déjà" };
    }

    const merged = repo().merge(row, data);
    return await repo().save(merged);
}

export async function deleteTypeHoraire(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Type d'horaire introuvable" };
}

