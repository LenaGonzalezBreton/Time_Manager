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
}

// Export d'une instance unique du service
export default new UtilisateursService();

