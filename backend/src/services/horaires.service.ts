import { AppDataSource } from "../data-source.js";
import { Horaire } from "../entities/Horaire.js";
import { Utilisateur } from "../entities/Utilisateur.js";
import { TypeHoraire } from "../entities/Type_Horaire.js";
import { Planning } from "../entities/Planning.js";
import { Not, IsNull } from "typeorm";

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
    // Vérifier l'unicité si le jour ou l'utilisateur change
    if (newJour !== horaire.jour || utilisateur.id_utilisateur !== horaire.utilisateur.id_utilisateur) {
        const duplicate = await repo().findOne({
            where: {
                utilisateur: { id_utilisateur: utilisateur.id_utilisateur },
                jour: newJour
            }
        });
        if (duplicate && duplicate.id_horaire !== id_horaire) {
            throw { status: 409, message: "Un horaire existe déjà pour cet utilisateur à ce jour" };
        }
    }

    horaire.jour = newJour;
    horaire.utilisateur = utilisateur;
    horaire.type_horaire = type_horaire;
    if (data.heure_arrivee !== undefined) horaire.heure_arrivee = data.heure_arrivee ? new Date(data.heure_arrivee) : null;
    if (data.heure_depart !== undefined) horaire.heure_depart = data.heure_depart ? new Date(data.heure_depart) : null;
    if (data.minutes_travaillees !== undefined) horaire.minutes_travaillees = data.minutes_travaillees;

    // Logique de modification du retard :
    // 1. Si l'heure d'arrivée est modifiée, on RECALCULE le retard
    // 2. Sinon, si minutes_retard est fourni seul, on l'applique (override manuel)
    if (data.heure_arrivee) {
        try {
            const expectedSchedule = await getExpectedSchedule(horaire.utilisateur.id_utilisateur, horaire.jour);
            if (expectedSchedule && expectedSchedule.heure_arrivee) {
                // Construction de la date prévue avec le fuseau horaire Paris (UTC+1)
                const timePart = expectedSchedule.heure_arrivee.length === 5 ? `${expectedSchedule.heure_arrivee}:00` : expectedSchedule.heure_arrivee;
                const targetDateStr = `${horaire.jour}T${timePart}+01:00`;
                const expectedArrival = new Date(targetDateStr);

                const diffMs = horaire.heure_arrivee!.getTime() - expectedArrival.getTime();
                const diffMinutes = Math.floor(diffMs / 60000);

                horaire.minutes_retard = Math.max(0, diffMinutes);
            } else {
                horaire.minutes_retard = 0;
            }
        } catch (e) {
            console.error("Erreur recalcul retard:", e);
        }
    } else if (data.minutes_retard !== undefined) {
        horaire.minutes_retard = data.minutes_retard;
    }

    return await repo().save(horaire);
}

// Supprimer un horaire
export async function deleteHoraire(id: number) {
    const result = await repo().delete(id);
    if (!result.affected) throw { status: 404, message: "Horaire introuvable" };
}

// ==================== NOUVELLES MÉTHODES POUR LE TRACKING DE JOURNÉE ====================

// Récupère l'horaire du jour pour un utilisateur
export async function getTodayHoraire(id_utilisateur: number) {
    const today: string = new Date().toISOString().split('T')[0]!; // Format YYYY-MM-DD
    return await repo().findOne({
        where: {
            utilisateur: { id_utilisateur },
            jour: today
        },
        relations: ["utilisateur", "type_horaire"]
    });
}

// Récupère les horaires prévus depuis le planning du rôle de l'utilisateur
export async function getExpectedSchedule(id_utilisateur: number, jour?: string) {
    const utilisateur = await utilisateurRepo().findOne({
        where: { id_utilisateur },
        relations: ["role"]
    });

    if (!utilisateur || !utilisateur.role) {
        throw { status: 404, message: "Utilisateur ou rôle introuvable" };
    }

    // Détermine le jour de la semaine
    const date = jour ? new Date(jour) : new Date();
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const jourSemaine = joursSemaine[date.getDay()] as Planning["jour_semaine"];

    // Récupère le planning pour ce rôle et ce jour
    const planningRepo = AppDataSource.getRepository(Planning);
    const planning = await planningRepo.findOne({
        where: {
            role: { id_role: utilisateur.role.id_role },
            jour_semaine: jourSemaine
        },
        relations: ["role"]
    });

    if (!planning) {
        return null;
    }

    return {
        jour_semaine: planning.jour_semaine,
        heure_arrivee: planning.heure_arrivee,
        heure_pause: planning.heure_pause,
        heure_depart: planning.heure_depart,
        jour_travail: planning.jour_travail
    };
}

// Auto-clôture les journées non terminées avant aujourd'hui
export async function autoCloseIncompleteDays(id_utilisateur: number) {
    const today = new Date().toISOString().split('T')[0];

    // Trouve tous les horaires avec heure_arrivee mais sans heure_depart
    // et dont le jour est antérieur à aujourd'hui
    const incompleteDays = await repo().find({
        where: {
            utilisateur: { id_utilisateur },
            jour: Not(today) as any
        },
        relations: ['utilisateur']
    });

    const closedDays = [];

    // Pour chaque journée incomplète, fermer à 23:59 si pas déjà fermée
    for (const horaire of incompleteDays) {
        if (horaire.heure_arrivee && !horaire.heure_depart) {
            const dayEnd = new Date(horaire.jour + 'T23:59:59');
            horaire.heure_depart = dayEnd;

            // Calculer les minutes travaillées
            const diffMs = dayEnd.getTime() - horaire.heure_arrivee.getTime();
            horaire.minutes_travaillees = Math.floor(diffMs / 60000);

            await repo().save(horaire);
            closedDays.push(horaire);
        }
    }

    return closedDays;
}

// Démarre la journée de travail
export async function startWorkDay(id_utilisateur: number) {
    const utilisateur = await utilisateurRepo().findOneBy({ id_utilisateur });
    if (!utilisateur) throw { status: 404, message: "Utilisateur introuvable" };

    // 1. Auto-clôturer les journées précédentes incomplètes
    await autoCloseIncompleteDays(id_utilisateur);

    const today: string = new Date().toISOString().split('T')[0]!;
    const now = new Date();

    // 2. Vérifier si la journée d'aujourd'hui a déjà été débutée
    const existingHoraire = await getTodayHoraire(id_utilisateur);

    if (existingHoraire && existingHoraire.heure_arrivee) {
        throw { status: 409, message: "La journée a déjà été débutée aujourd'hui" };
    }

    // 3. Récupère les horaires prévus
    const expectedSchedule = await getExpectedSchedule(id_utilisateur, today);

    // 4. Calcule le retard si applicable
    // 4. Calcule le retard si applicable
    let minutes_retard = 0;
    if (expectedSchedule && expectedSchedule.heure_arrivee) {
        // Construction de la date prévue avec le fuseau horaire Paris (UTC+1)
        const timePart = expectedSchedule.heure_arrivee.length === 5 ? `${expectedSchedule.heure_arrivee}:00` : expectedSchedule.heure_arrivee;
        const targetDateStr = `${today}T${timePart}+01:00`;
        const expectedArrival = new Date(targetDateStr);

        // Calcule la différence en minutes
        const diffMs = now.getTime() - expectedArrival.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        // Si positif, c'est un retard
        if (diffMinutes > 0) {
            minutes_retard = diffMinutes;
        }
    }

    // 5. Crée ou met à jour l'horaire d'aujourd'hui
    if (existingHoraire) {
        // Met à jour l'horaire existant (cas où il existe mais sans heure_arrivee)
        existingHoraire.heure_arrivee = now;
        existingHoraire.minutes_retard = minutes_retard;
        return await repo().save(existingHoraire);
    } else {
        // Crée un nouvel horaire
        const horaire = repo().create({
            jour: today,
            heure_arrivee: now,
            heure_depart: null,
            minutes_retard,
            minutes_travaillees: 0,
            type_horaire: null,
            utilisateur
        });
        return await repo().save(horaire);
    }
}

// Termine la journée de travail
export async function endWorkDay(id_utilisateur: number) {
    const horaire = await getTodayHoraire(id_utilisateur);

    if (!horaire) {
        throw { status: 404, message: "Aucune journée de travail n'a été débutée aujourd'hui" };
    }

    if (!horaire.heure_arrivee) {
        throw { status: 400, message: "L'heure d'arrivée n'est pas enregistrée" };
    }

    const now = new Date();
    horaire.heure_depart = now;

    // Calcule les minutes travaillées (différence entre arrivée et départ)
    const diffMs = now.getTime() - horaire.heure_arrivee.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    horaire.minutes_travaillees = Math.max(0, diffMinutes);

    return await repo().save(horaire);
}

// Récupère les journées incomplètes (sans heure_arrivee ou auto-clôturées)
export async function getIncompleteDays(id_utilisateur: number) {
    const today: string = new Date().toISOString().split('T')[0]!;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr: string = thirtyDaysAgo.toISOString().split('T')[0]!;

    // Trouve les horaires :
    // 1. Sans heure_arrivee (journées non débutées)
    // 2. Avec heure_arrivee mais sans heure_depart (journées non terminées)
    const incompleteDays = await repo().find({
        where: [
            {
                utilisateur: { id_utilisateur },
                heure_arrivee: IsNull()
            },
            {
                utilisateur: { id_utilisateur },
                heure_arrivee: Not(IsNull()),
                heure_depart: IsNull()
            }
        ],
        relations: ['utilisateur', 'type_horaire'],
        order: { jour: 'DESC' }
    });

    // Filtrer pour ne garder que les jours passés (pas aujourd'hui ni le futur)
    return incompleteDays.filter(h => h.jour < today && h.jour >= thirtyDaysAgoStr);
}