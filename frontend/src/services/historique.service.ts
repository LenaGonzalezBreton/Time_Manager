import apiService from './api.service';

export interface HistoriqueModification {
    id_historique: number;
    type_modification: 'utilisateur' | 'profil' | 'equipe';
    id_utilisateur_modifie: number;
    id_utilisateur_modificateur: number | null;
    champ_modifie: string;
    ancienne_valeur: string | null;
    nouvelle_valeur: string | null;
    date_modification: Date;
    utilisateur_modifie?: any;
    utilisateur_modificateur?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

class HistoriqueService {
    private readonly endpoint = '/historique';

    // GET /api/historique - Tout l'historique (managers uniquement)
    async getAll(page: number = 1, limit: number = 20): Promise<PaginatedResponse<HistoriqueModification>> {
        return apiService.get<PaginatedResponse<HistoriqueModification>>(`${this.endpoint}?page=${page}&limit=${limit}`);
    }

    // GET /api/historique/utilisateur/:id - Historique d'un utilisateur
    async getByUser(id: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<HistoriqueModification>> {
        return apiService.get<PaginatedResponse<HistoriqueModification>>(`${this.endpoint}/utilisateur/${id}?page=${page}&limit=${limit}`);
    }

    // GET /api/historique/mes-modifications - Mes modifications
    async getMesModifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<HistoriqueModification>> {
        return apiService.get<PaginatedResponse<HistoriqueModification>>(`${this.endpoint}/mes-modifications?page=${page}&limit=${limit}`);
    }
}

export default new HistoriqueService();
