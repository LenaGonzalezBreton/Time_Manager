import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check } from "typeorm";
import type { Role } from "./Role.js";

// Entité représentant la table Planning
@Entity({ name: "planning" })
// Contrainte pour s'assurer que le jour_semaine est valide
@Check(`"jour_semaine" IN ('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche')`)

export class Planning {
    // ID du planning
    @PrimaryGeneratedColumn({ name: "id_planning" })
    id_planning!: number;
    // Jour de la semaine
    @Column({ type: "varchar", length: 10 })
    jour_semaine!: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";
    // Heures d'arrivée, de pause et de départ (peuvent être nulles)
    @Column({ type: "time", nullable: true }) heure_arrivee!: string | null;
    @Column({ type: "time", nullable: true }) heure_pause!: string | null;
    @Column({ type: "time", nullable: true }) heure_depart!: string | null;
    // Indique si c'est un jour de travail
    @Column({ type: "boolean", default: true }) jour_travail!: boolean;
    // Relation ManyToOne avec l'entité Role
    @ManyToOne("Role", "plannings", { onDelete: "CASCADE", onUpdate: "CASCADE" })
    role!: Role;
}