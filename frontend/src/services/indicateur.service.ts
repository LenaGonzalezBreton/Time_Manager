import apiService from './api.service';

export interface Indicateur {
    id_indicateur: number;
    date_periode: string;
    taux_retard: number | string | null;
    taux_presence: number | string | null;
    minutes_travaillees: number;
    minutes_retards: number;
}

class IndicateurService {
    private readonly endpoint = '/indicateurs';

    async getByUser(userId: number): Promise<Indicateur[]> {
        return apiService.get<Indicateur[]>(`/utilisateurs/${userId}/indicateurs`);
    }

    async getAll(): Promise<Indicateur[]> {
        return apiService.get<Indicateur[]>(this.endpoint);
    }
}

export default new IndicateurService();
