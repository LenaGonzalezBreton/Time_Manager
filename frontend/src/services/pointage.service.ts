import apiService from './api.service';
import type {Pointage} from '../types/pointage.types.ts';

// Service pour gérer les appels API liés aux Pointages
class PointageService {
    private readonly endpoint = '/Pointage';

    async getAll(): Promise<Pointage[]> {
        return apiService.get<Pointage[]>(this.endpoint);
    }

    async getById(id: number): Promise<Pointage> {
        return apiService.get<Pointage>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<Pointage>): Promise<Pointage> {
        return apiService.post<Pointage>(this.endpoint, data);
    }

    async update(id: number, data: Partial<Pointage>): Promise<Pointage> {
        return apiService.put<Pointage>(`${this.endpoint}/${id}`, data);
    }

    async delete(id: number): Promise<void> {
        return apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}

export default new PointageService();
