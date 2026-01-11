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

class HoraireService {
    private readonly endpoint = '/horaires';

    async getByUser(userId: number): Promise<Horaire[]> {
        return apiService.get<Horaire[]>(`/utilisateurs/${userId}/horaires`);
    }

    async getAll(): Promise<Horaire[]> {
        return apiService.get<Horaire[]>(this.endpoint);
    }
}

export default new HoraireService();
