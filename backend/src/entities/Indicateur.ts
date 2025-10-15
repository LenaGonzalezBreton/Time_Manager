import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Utilisateur } from "./Utilisateur";
// Entité représentant la table indicateurs
@Entity("indicateurs")
export class Indicateur {
    // ID de l'indicateur
    @PrimaryGeneratedColumn({ name: "id_indicateur" })
    id_indicateur!: number;
    // Taux de retard
    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    taux_retard!: number | null;
    // Taux de présence
    @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
    taux_presence!: number | null;
    // Heures travaillées (totale)
    @Column({ type: "varchar", length: 16, nullable: true })
    heures_travaillees!: string | null;
    // Durée totale des retards
    @Column({ type: "varchar", length: 16, nullable: true })
    duree_retards!: string | null;
    // Relation ManyToOne avec la table utilisateur
    @ManyToOne(() => Utilisateur, (u) => u.indicateurs, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_utilisateur" }) // Clé étrangère id de l'utilisateur
    utilisateur!: Utilisateur;
}