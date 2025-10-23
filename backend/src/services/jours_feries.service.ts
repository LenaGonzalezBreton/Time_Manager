import { AppDataSource } from "../data-source";
import { JourFerie } from "../entities/Jours_Feries";

const repo = () => AppDataSource.getRepository(JourFerie);

export async function listJoursFeries() {
    return repo().find({ order: { jour_ferie: "ASC" } });
}

export async function createJourFerie(data: { jour_ferie: string }) {
    const existing = await repo().findOneBy({ jour_ferie: data.jour_ferie });
    if (existing) throw { status: 409, message: "Ce jour férié existe déjà" };
    const row = repo().create(data);
    return await repo().save(row);
}

export async function updateJourFerie(id_jour_ferie: number, data: Partial<JourFerie>) {
    const row = await repo().findOneBy({ id_jour_ferie });
    if (!row) throw { status: 404, message: "Jour férié introuvable" };

    if (data.jour_ferie && data.jour_ferie !== row.jour_ferie) {
        const dup = await repo().findOneBy({ jour_ferie: data.jour_ferie });
        if (dup && dup.id_jour_ferie !== id_jour_ferie) throw { status: 409, message: "Ce jour férié existe déjà" };
    }

    const merged = repo().merge(row, data);
    return await repo().save(merged);
}

export async function deleteJourFerie(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Jour férié introuvable" };
}

