import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Unique } from "typeorm";
import type { Utilisateur } from "./Utilisateur.js";
import { TypeHoraire } from "./Type_Horaire.js";

// Entité représentant la table horaires
@Entity({ name: "horaires" })

// Contrainte d'unicité sur la combinaison utilisateur-jour
@Unique("uq_horaires_user_jour", ["utilisateur", "jour"])
@Index("idx_horaires_user_jour", ["utilisateur", "jour"])

export class Horaire {
    // ID de l'horaire
    @PrimaryGeneratedColumn({ name: "id_horaire" })
    id_horaire!: number;
    // Date de l'horaire
    @Column({ type: "date" })
    jour!: string;
    // Heure d'arrivée (nullable)
    @Column({ type: "timestamptz", nullable: true })
    heure_arrivee!: Date | null;
    // Heure de départ (nullable)
    @Column({ type: "timestamptz", nullable: true })
    heure_depart!: Date | null;
    // Minutes de retard
    @Column({ type: "int", default: 0 })
    minutes_retard!: number;
    // Minutes travaillées
    @Column({ type: "int", default: 0 })
    minutes_travaillees!: number;
    // Relation Many to one avec la table type_horaire
    @ManyToOne(() => TypeHoraire, th => th.horaires, { nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
    type_horaire!: TypeHoraire | null;
    // Relation Many to one avec la table utilisateur
    @ManyToOne("Utilisateur", "horaires", { onDelete: "CASCADE", onUpdate: "CASCADE" })
    utilisateur!: Utilisateur;
}