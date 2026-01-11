import { AppDataSource } from "../data-source.js";
import { Role } from "../entities/Role.js";
// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Role);

// Liste tous les rôles
export async function listRoles() {
    return await repo().find();
}

// Créer un nouveau rôle
export async function createRole(data: { titre: string }) {
    const existing = await repo().findOneBy({ titre: data.titre }); // Verification si existe déjà
    if (existing) throw { status: 409, message: "Ce rôle existe déjà" };

    const role = repo().create(data);
    return await repo().save(role);
}

// Mettre à jour un rôle
export async function updateRole(id_role: number, data: Partial<Role>) {
    const role = await repo().findOneBy({ id_role });
    if (!role) throw { status: 404, message: "Rôle introuvable" };

    if (data.titre && data.titre !== role.titre) {
        const dup = await repo().findOneBy({ titre: data.titre });
        if (dup && dup.id_role !== id_role) throw { status: 409, message: "Ce rôle existe déjà" };
    }

    const merged = repo().merge(role, data);
    return await repo().save(merged);
}

// Supprimer un rôle
export async function deleteRole(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Rôle introuvable" };
}