import { AppDataSource } from "../data-source";
import { Role } from "../entities/Role";
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