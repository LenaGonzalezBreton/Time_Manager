import apiService from './api.service';

export interface Indicateur {
    id_indicateur: number;
    date_periode: string;
    taux_retard: number | string | null;
    taux_presence: number | string | null;
    minutes_travaillees: number;
    minutes_retards: number;
}

export interface TeamStats {
    id_equipe: number;
    nom: string;
    stats: {
        taux_presence_moyen: number;
        taux_retard_moyen: number;
        heures_travaillees_total: number;
    };
    memberCount: number;
}

export interface TeamMemberStats {
    utilisateur: {
        id_utilisateur: number;
        nom: string;
        prenom: string;
        email: string;
    };
    stats: {
        taux_presence: number | string | null;
        taux_retard: number | string | null;
        minutes_travaillees: number;
        minutes_retards: number;
    };
}

class IndicateurService {
    private readonly endpoint = '/indicateurs';

    async getByUser(userId: number): Promise<Indicateur[]> {
        return apiService.get<Indicateur[]>(`/utilisateurs/${userId}/indicateurs`);
    }

    async getAll(): Promise<Indicateur[]> {
        return apiService.get<Indicateur[]>(this.endpoint);
    }

    // Récupérer les stats agrégées des équipes
    async getTeamsStats(): Promise<TeamStats[]> {
        return apiService.get<TeamStats[]>(`${this.endpoint}/teams`);
    }

    // Récupérer les stats détaillées d'une équipe
    async getTeamDetailStats(teamId: number): Promise<TeamMemberStats[]> {
        return apiService.get<TeamMemberStats[]>(`${this.endpoint}/teams/${teamId}`);
    }
}

export default new IndicateurService();
