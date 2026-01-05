import apiService from './api.service';
import type {Equipe} from '../types/equipe.types.ts';

// Service pour gérer les appels API liés aux équipes
class EquipeService {
    private readonly endpoint = '/equipe';

    async getAll(): Promise<Equipe[]> {
        return apiService.get<Equipe[]>(this.endpoint);
    }

    async getById(id: number): Promise<Equipe> {
        return apiService.get<Equipe>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<Equipe>): Promise<Equipe> {
        return apiService.post<Equipe>(this.endpoint, data);
    }

    async update(id: number, data: Partial<Equipe>): Promise<Equipe> {
        return apiService.put<Equipe>(`${this.endpoint}/${id}`, data);
    }

    async delete(id: number): Promise<void> {
        return apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}

export default new EquipeService();


