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

    async create(data: { nom: string; description?: string }): Promise<Equipe> {
        return apiService.post<Equipe>('/equipes', data);
    }

    async delete(id: number): Promise<void> {
        return apiService.delete(`/equipes/${id}`);
    }

    async addMember(teamId: number, userId: number): Promise<Equipe> {
        return apiService.post<Equipe>(`/equipes/${teamId}/membres`, { id_utilisateur: userId });
    }

    async removeMember(teamId: number, userId: number): Promise<Equipe> {
        return apiService.delete<Equipe>(`/equipes/${teamId}/membres/${userId}`);
    }
}

export default new EquipeService();
