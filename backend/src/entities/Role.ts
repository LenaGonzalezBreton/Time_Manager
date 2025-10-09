import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Utilisateur } from "./Utilisateur";
// Entité représentant la table roles
@Entity("roles")
export class Role {
    // ID du rôle
    @PrimaryGeneratedColumn({ name: "id_role" })
    id_role!: number;
    // Titre du rôle (unique)
    @Column({ type: "varchar", length: 50, unique: true }) // unique true car un seul meme titre
    titre!: string;
    // Relation OneToMany avec l'entité Utilisateur
    @OneToMany(() => Utilisateur, (u) => u.role)
    utilisateurs!: Utilisateur[];
}