import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Check, Index } from "typeorm";
import { Indicateur } from "./Indicateur";

// Entité représentant la table cible_indicateur
@Entity({ name: "cible_indicateur" })
// Contrainte pour s'assurer que type_cible est soit 'utilisateur' soit 'equipe'
@Check(`"type_cible" IN ('utilisateur','equipe')`)
// Index unique sur la combinaison de type_cible et id_cible
@Index("uq_cible_indicateur_unique", ["type_cible", "id_cible"], { unique: true })

export class CibleIndicateur {
    // ID de cible_indicateur
    @PrimaryGeneratedColumn({ name: "id_cible_indicateur" })
    id_cible_indicateur!: number;
    // Type de la cible : 'utilisateur' ou 'equipe'
    @Column({ type: "varchar", length: 12 })
    type_cible!: "utilisateur" | "equipe";
    // ID de la cible, référence logique vers utilisateurs.id_utilisateur ou equipes.id_equipe
    @Column({ type: "int" })
    id_cible!: number; // référence logique vers utilisateurs.id_utilisateur ou equipes.id_equipe
    // Objectif de présence en pourcentage
    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    objectif_presence?: number;
    // Objectif de retard en pourcentage
    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    objectif_retard?: number;
    // Relation OneToMany avec l'entité Indicateur
    @OneToMany(() => Indicateur, i => i.cible_indicateur)
    indicateurs!: Indicateur[];
}