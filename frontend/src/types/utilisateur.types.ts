// Type pour l'entité Utilisateur (correspond à la structure du backend)
export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  mot_de_passe?: string;
  role?: {
    id_role: number;
    nom: string;
  } | null;
  equipe?: Array<{
    id_equipe: number;
    nom: string;
  }>;
}