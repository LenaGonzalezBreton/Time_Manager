import apiService from './api.service';
import type {KPI} from '../types/kpi.types.ts';

// Service pour gérer les appels API liés aux équipes
class KPIService {
    private readonly endpoint = '/KPI';

    async getAll(): Promise<KPI[]> {
        return apiService.get<KPI[]>(this.endpoint);
    }

    async getById(id: number): Promise<KPI> {
        return apiService.get<KPI>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<KPI>): Promise<KPI> {
        return apiService.post<KPI>(this.endpoint, data);
    }

    async update(id: number, data: Partial<KPI>): Promise<KPI> {
        return apiService.put<KPI>(`${this.endpoint}/${id}`, data);
    }

    async delete(id: number): Promise<void> {
        return apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}

export default new KPIService();


