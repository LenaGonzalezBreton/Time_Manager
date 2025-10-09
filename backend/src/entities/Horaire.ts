import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Utilisateur } from "./Utilisateur";
// Entité représentant la table horaires
@Entity("horaires")
export class Horaire {
    // ID de l'horaire
    @PrimaryGeneratedColumn({ name: "id_horaire" }) // Clé primaire auto-incrémentée
    id_horaire!: number;                            // "!" car l'attribut n'est pas nullable
    // Type d'horaire (ARRIVEE ou DEPART)
    @Column({ type: "varchar", length: 50 })
    type!: string; // ex: 'ARRIVEE' ou 'DEPART'
    // Jour de l'horaire
    @Column({ type: "date" })
    jour!: string;
    // Heure de l'horaire
    @Column({ type: "time" })
    heure!: string;
    // Relation ManyToOne avec l'entité Utilisateur
    @ManyToOne(() => Utilisateur, (u) => u.horaires, { nullable: false, onDelete: "CASCADE" }) // Suppression en cascade
    @JoinColumn({ name: "id_utilisateur" }) // Clé étrangère vers Utilisateur
    utilisateur!: Utilisateur;
}