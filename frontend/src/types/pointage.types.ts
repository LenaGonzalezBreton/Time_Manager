// Type pour l'entité Utilisateur (correspond à la structure du backend)
import type {Utilisateur} from "./utilisateur.types.ts";

export interface Pointage {
    id_pointage: number;
    user: Utilisateur;
    type: 'in' | 'out';
    time: Date;
}