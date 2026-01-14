import apiService from './api.service';
import type { Equipe } from './equipe.service';

class EquipeManagementService {
    private readonly endpoint = '/equipes';

    // POST /api/equipes/:id/membres - Ajouter un membre
    async addMember(id_equipe: number, id_utilisateur: number): Promise<Equipe> {
        return apiService.post<Equipe>(`${this.endpoint}/${id_equipe}/membres`, { id_utilisateur });
    }

    // DELETE /api/equipes/:id/membres/:userId - Retirer un membre
    async removeMember(id_equipe: number, id_utilisateur: number): Promise<Equipe> {
        return apiService.delete<Equipe>(`${this.endpoint}/${id_equipe}/membres/${id_utilisateur}`);
    }
}

export default new EquipeManagementService();
