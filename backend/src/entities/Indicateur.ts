import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from "typeorm";
import type { CibleIndicateur } from "./Cible_Indicateur.js";

// Entité représentant la table indicateurs
@Entity({ name: "indicateurs" })
// Contrainte d'unicité sur la combinaison de cible_indicateur et date_periode
@Unique("uq_indic_cible_periode", ["cible_indicateur", "date_periode"])
// Index sur la combinaison de cible_indicateur et date_periode pour optimiser les requêtes
@Index("idx_indicateurs_cible_periode", ["cible_indicateur", "date_periode"])

export class Indicateur {
    // ID de l'indicateur
    @PrimaryGeneratedColumn({ name: "id_indicateur" })
    id_indicateur!: number;
    // Date de la période
    @Column({ type: "date" })
    date_periode!: string;
    // Taux de retard (nullable, précision 5,2 pour permettre des valeurs jusqu'à 999.99)
    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    taux_retard!: string | null;
    // Taux de présence (pareil)
    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    taux_presence!: string | null;
    // Temps travaillé en minute
    @Column({ type: "int", default: 0 })
    minutes_travaillees!: number;
    // Temps de retards en minutes
    @Column({ type: "int", default: 0 })
    minutes_retards!: number;
    // Date de création de l'indicateur
    @Column({ type: "timestamptz", default: () => "now()" })
    date_generation!: Date;
    // Cible de l'indicateur
    @ManyToOne("CibleIndicateur", "indicateurs", { nullable: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_cible_indicateur" })
    cible_indicateur!: CibleIndicateur;
}