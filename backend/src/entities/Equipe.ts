import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from "typeorm";
import type { Utilisateur } from "./Utilisateur.js";
// Entité représentant la table équipe
@Entity("equipes")
@Unique(["nom"]) // Unicité du nom d'équipe
export class Equipe {
    // ID de l'équipe
    @PrimaryGeneratedColumn({ name: "id_equipe" })  // Clé primaire auto-incrémentée
    id_equipe!: number;                             // "!" car l'attribut n'est pas nullable
    // Nom de l'équipe
    @Column({ type: "varchar", length: 50 })
    nom!: string;
    // Description de l'équipe
    @Column({ type: "varchar", length: 500, nullable: true })
    description!: string | null;
    // Relation ManyToMany avec l'entité Utilisateur
    @ManyToMany("Utilisateur", "equipe")
    membres!: Utilisateur[];
}