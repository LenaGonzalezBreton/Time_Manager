import { AppDataSource } from "../data-source.js";
import { HistoriqueModification } from "../entities/HistoriqueModification.js";

const repo = () => AppDataSource.getRepository(HistoriqueModification);

// Créer une entrée d'historique
export async function createHistoriqueEntry(data: {
    type_modification: 'utilisateur' | 'profil' | 'equipe';
    id_utilisateur_modifie: number;
    id_utilisateur_modificateur?: number | null;
    champ_modifie: string;
    ancienne_valeur?: string | null;
    nouvelle_valeur?: string | null;
}) {
    const entry = repo().create({
        type_modification: data.type_modification,
        id_utilisateur_modifie: data.id_utilisateur_modifie,
        id_utilisateur_modificateur: data.id_utilisateur_modificateur ?? null,
        champ_modifie: data.champ_modifie,
        ancienne_valeur: data.ancienne_valeur ?? null,
        nouvelle_valeur: data.nouvelle_valeur ?? null,
    });
    return await repo().save(entry);
}


// Récupérer tout l'historique (pour managers)
export async function getAllHistorique(page: number = 1, limit: number = 20) {
    const [data, total] = await repo().findAndCount({
        relations: ['utilisateur_modifie', 'utilisateur_modificateur', 'utilisateur_modifie.role', 'utilisateur_modificateur.role'],
        order: { date_modification: 'DESC' },
        take: limit,
        skip: (page - 1) * limit
    });
    return { data, total };
}

// Récupérer l'historique d'un utilisateur spécifique
export async function getHistoriqueByUser(id_utilisateur: number, page: number = 1, limit: number = 20) {
    const [data, total] = await repo().findAndCount({
        where: { id_utilisateur_modifie: id_utilisateur },
        relations: ['utilisateur_modifie', 'utilisateur_modificateur', 'utilisateur_modifie.role', 'utilisateur_modificateur.role'],
        order: { date_modification: 'DESC' },
        take: limit,
        skip: (page - 1) * limit
    });
    return { data, total };
}

// Récupérer les modifications faites par un manager spécifique
export async function getHistoriqueByModificateur(id_utilisateur_modificateur: number, page: number = 1, limit: number = 20) {
    const [data, total] = await repo().findAndCount({
        where: { id_utilisateur_modificateur },
        relations: ['utilisateur_modifie', 'utilisateur_modificateur', 'utilisateur_modifie.role'],
        order: { date_modification: 'DESC' },
        take: limit,
        skip: (page - 1) * limit
    });
    return { data, total };
}

// Récupérer les auto-modifications (profil)
export async function getAutoModifications(id_utilisateur: number, page: number = 1, limit: number = 20) {
    const [data, total] = await repo().findAndCount({
        where: {
            id_utilisateur_modifie: id_utilisateur,
            type_modification: 'profil'
        },
        relations: ['utilisateur_modifie'],
        order: { date_modification: 'DESC' },
        take: limit,
        skip: (page - 1) * limit
    });
    return { data, total };
}
