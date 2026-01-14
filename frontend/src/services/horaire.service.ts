import apiService from './api.service';

export interface Horaire {
    id_horaire: number;
    id_utilisateur: number;
    // id_type_horaire can be populated or not depending on relation loading, but backend usually sends the object or id.
    // Let's assume generic structure.
    jour: string;
    heure_arrivee: string | null;
    heure_depart: string | null;
    minutes_retard: number;
    minutes_travaillees: number;
    type_horaire?: {
        id_type_horaire: number;
        type: string;
    };
}

export interface ExpectedSchedule {
    jour_semaine: string;
    heure_arrivee: string | null;
    heure_pause: string | null;
    heure_depart: string | null;
    jour_travail: boolean;
}

class HoraireService {
    private readonly endpoint = '/horaires';

    async getByUser(userId: number): Promise<Horaire[]> {
        return apiService.get<Horaire[]>(`/utilisateurs/${userId}/horaires`);
    }

    async getAll(): Promise<Horaire[]> {
        return apiService.get<Horaire[]>(this.endpoint);
    }

    // ==================== NOUVELLES MÉTHODES POUR LE TRACKING DE JOURNÉE ====================

    // Récupère l'horaire du jour pour l'utilisateur connecté
    async getTodayHoraire(): Promise<Horaire | null> {
        return apiService.get<Horaire | null>(`${this.endpoint}/today`);
    }

    // Récupère les horaires prévus depuis le planning
    async getExpectedSchedule(jour?: string): Promise<ExpectedSchedule | null> {
        const params = jour ? `?jour=${jour}` : '';
        return apiService.get<ExpectedSchedule | null>(`${this.endpoint}/expected-schedule${params}`);
    }

    // Démarre la journée de travail
    async startWorkDay(): Promise<Horaire> {
        return apiService.post<Horaire>(`${this.endpoint}/start-day`, {});
    }

    // Termine la journée de travail
    async endWorkDay(): Promise<Horaire> {
        return apiService.post<Horaire>(`${this.endpoint}/end-day`, {});
    }

    // Récupère les journées incomplètes
    async getIncompleteDays(): Promise<Horaire[]> {
        return apiService.get<Horaire[]>(`${this.endpoint}/incomplete`);
    }
}

export default new HoraireService();
