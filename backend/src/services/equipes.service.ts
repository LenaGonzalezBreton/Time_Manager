import { AppDataSource } from "../data-source.js";
import { Equipe } from "../entities/Equipe.js";
// On utilise le repository de TypeORM pour interagir avec la base de données
const repo = () => AppDataSource.getRepository(Equipe);

// Liste toutes les équipes
export async function listEquipes() {
    return await repo().find();
}

// Créer une nouvelle équipe
export async function createEquipe(data: { nom: string; description?: string | null }) {
    const existing = await repo().findOneBy({ nom: data.nom }); // Verification si existe déjà
    if (existing) throw { status: 409, message: "Cette équipe existe déjà" };

    const equipe = repo().create({
        nom: data.nom,
        description: data.description ?? null,
    });
    return await repo().save(equipe);
}

// Mettre à jour une équipe
export async function updateEquipe(id_equipe: number, data: Partial<Equipe>) {
    const equipe = await repo().findOneBy({ id_equipe });
    if (!equipe) throw { status: 404, message: "Équipe introuvable" };

    if (data.nom && data.nom !== equipe.nom) {
        const dup = await repo().findOneBy({ nom: data.nom });
        if (dup && dup.id_equipe !== id_equipe) throw { status: 409, message: "Cette équipe existe déjà" };
    }

    const merged = repo().merge(equipe, data);
    return await repo().save(merged);
}

// Supprimer une équipe
export async function deleteEquipe(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Équipe introuvable" };
}

// Récupérer une équipe par ID avec ses membres
export async function getEquipeById(id_equipe: number) {
    const equipe = await repo().findOne({
        where: { id_equipe },
        relations: ['membres', 'membres.role'] // On inclut les membres et leurs rôles
    });
    if (!equipe) throw { status: 404, message: "Équipe introuvable" };
    return equipe;
}