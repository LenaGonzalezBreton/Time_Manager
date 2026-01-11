import { AppDataSource } from "../data-source.js";
import { TypeAbsence } from "../entities/Type_Absence.js";

const repo = () => AppDataSource.getRepository(TypeAbsence);

export async function listTypesAbsence() {
    return repo().find({ order: { type: "ASC" } });
}

export async function createTypeAbsence(data: { type: string }) {
    const existing = await repo().findOneBy({ type: data.type });
    if (existing) throw { status: 409, message: "Ce type d'absence existe déjà" };
    const row = repo().create(data);
    return await repo().save(row);
}

export async function updateTypeAbsence(id_type_absence: number, data: Partial<TypeAbsence>) {
    const row = await repo().findOneBy({ id_type_absence });
    if (!row) throw { status: 404, message: "Type d'absence introuvable" };

    if (data.type && data.type !== row.type) {
        const dup = await repo().findOneBy({ type: data.type });
        if (dup && dup.id_type_absence !== id_type_absence) throw { status: 409, message: "Ce type d'absence existe déjà" };
    }

    const merged = repo().merge(row, data);
    return await repo().save(merged);
}

export async function deleteTypeAbsence(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Type d'absence introuvable" };
}

