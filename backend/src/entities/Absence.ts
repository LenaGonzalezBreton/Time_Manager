import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Check, Unique } from "typeorm";
import type { Utilisateur } from "./Utilisateur.js";
import { TypeAbsence } from "./Type_Absence.js";

// Entité représentant la table absences
@Entity({ name: "absences" })
// Vérifie que la date de fin est postérieure ou égale à la date de début
@Check(`"date_fin" >= "date_debut"`)
// Contrainte d'unicité sur la combinaison utilisateur-période
@Unique("uq_absences_user_period", ["utilisateur", "date_debut", "date_fin"])
// Index (en plus) pour optimiser les recherches sur la période
@Index("idx_absences_user_period", ["utilisateur", "date_debut", "date_fin"])

export class Absence {
    // ID de l'absence
    @PrimaryGeneratedColumn({ name: "id_absence" })
    id_absence!: number;
    // Date de début de l'absence
    @Column({ type: "date" })
    date_debut!: string;
    // Date de fin de l'absence
    @Column({ type: "date" })
    date_fin!: string;
    // Indique si l'absence est justifiée
    @Column({ type: "boolean", default: true })
    justifiee!: boolean;
    // Commentaire optionnel sur l'absence
    @Column({ type: "varchar", length: 200, nullable: true })
    commentaire!: string | null;
    // Relation Many to one avec la table utilisateur
    @ManyToOne("Utilisateur", "absences", { onDelete: "CASCADE", onUpdate: "CASCADE" })
    utilisateur!: Utilisateur;
    // Relation Many to one avec la table type_absence
    @ManyToOne(() => TypeAbsence, ta => ta.absences, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
    type_absence!: TypeAbsence;
}