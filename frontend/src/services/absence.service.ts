import apiService from './api.service';

export interface Absence {
    id_absence: number;
    id_utilisateur: number;
    // id_type_absence: number; // Relation often comes as object
    date_debut: string;
    date_fin: string;
    justifiee: boolean;
    commentaire?: string;
    type_absence?: {
        id_type_absence: number;
        nom: string;
    };
}

class AbsenceService {
    private readonly endpoint = '/absences';

    async getByUser(userId: number): Promise<Absence[]> {
        return apiService.get<Absence[]>(`/utilisateurs/${userId}/absences`);
    }

    async getAll(): Promise<Absence[]> {
        return apiService.get<Absence[]>(this.endpoint);
    }
}

export default new AbsenceService();
