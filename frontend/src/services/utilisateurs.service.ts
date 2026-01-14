import apiService from './api.service';
import type { Utilisateur } from '../types/utilisateur.types';

// Service pour gérer les appels API liés aux utilisateurs
class UtilisateursService {
  private readonly endpoint = '/utilisateurs'; // Correspond à /api/utilisateurs dans le backend

  // GET /api/utilisateurs - Récupérer tous les utilisateurs
  async getAll(): Promise<Utilisateur[]> {
    return apiService.get<Utilisateur[]>(this.endpoint);
  }

  // GET /api/utilisateurs/:id - Récupérer un utilisateur par ID
  async getById(id: number): Promise<Utilisateur> {
    return apiService.get<Utilisateur>(`${this.endpoint}/${id}`);
  }

  // POST /api/utilisateurs - Créer un nouvel utilisateur
  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    return apiService.post<Utilisateur>(this.endpoint, data);
  }

  // PUT /api/utilisateurs/:id - Mettre à jour un utilisateur
  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    return apiService.put<Utilisateur>(`${this.endpoint}/${id}`, data);
  }

  // DELETE /api/utilisateurs/:id - Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // ==================== NOUVELLES MÉTHODES POUR LA GESTION DES UTILISATEURS ====================

  // PUT /api/utilisateurs/:id - Mise à jour par manager
  async updateByManager(id: number, data: { nom?: string; prenom?: string; email?: string; telephone?: string | null; id_role?: number }): Promise<Utilisateur> {
    return apiService.put<Utilisateur>(`${this.endpoint}/${id}`, data);
  }

  // PUT /api/utilisateurs/me - Auto-modification
  async updateSelf(data: { email?: string; telephone?: string | null }): Promise<Utilisateur> {
    return apiService.put<Utilisateur>(`${this.endpoint}/me`, data);
  }

  // PUT /api/utilisateurs/me/password - Changement de mot de passe
  async updatePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiService.put<{ message: string }>(`${this.endpoint}/me/password`, { oldPassword, newPassword });
  }
}

// Export d'une instance unique du service
export default new UtilisateursService();

