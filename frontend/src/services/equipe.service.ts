import apiService from './api.service';
import type { User } from './authService';

export interface Equipe {
    id_equipe: number;
    nom: string;
    description?: string;
    membres?: User[];
}

class EquipeService {
    async getAll(): Promise<Equipe[]> {
        return apiService.get<Equipe[]>('/equipes');
    }

    async getById(id: number): Promise<Equipe> {
        return apiService.get<Equipe>(`/equipes/${id}`);
    }
}

export default new EquipeService();
