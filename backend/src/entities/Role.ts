import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Utilisateur } from "./Utilisateur.js";
import type { Planning } from "./Planning.js";

// Entité représentant la table roles
@Entity({ name: "roles" })
export class Role {
    // ID du rôle
    @PrimaryGeneratedColumn({ name: "id_role" })
    id_role!: number;
    // Titre du rôle (unique)
    @Column({ type: "varchar", length: 50, unique: true })
    titre!: string;
    // Relation OneToMany avec l'entité Utilisateur
    @OneToMany("Utilisateur", "role")
    utilisateurs!: Utilisateur[];
    // Relation OneToMany avec l'entité planning
    @OneToMany("Planning", "role")
    plannings!: Planning[];
}