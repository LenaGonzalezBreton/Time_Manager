import type {Utilisateur} from "./utilisateur.types.ts";

export interface Equipe {
    id_group: number;
    nom: string;
    compo: Utilisateur[];
    manager: Utilisateur;
}