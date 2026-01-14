import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Utilisateur } from "./Utilisateur.js";

// Entité pour tracer toutes les modifications des utilisateurs
@Entity("historique_modifications")
export class HistoriqueModification {
    @PrimaryGeneratedColumn({ name: "id_historique" })
    id_historique!: number;

    // Type de modification : utilisateur (par manager) ou profil (auto-modification)
    @Column({
        type: "enum",
        enum: ["utilisateur", "profil", "equipe"],
        default: "profil"
    })
    type_modification!: "utilisateur" | "profil" | "equipe";

    // ID de l'utilisateur qui a été modifié
    @Column({ name: "id_utilisateur_modifie" })
    id_utilisateur_modifie!: number;

    // ID de l'utilisateur qui a fait la modification (null si auto-modification)
    @Column({ name: "id_utilisateur_modificateur", nullable: true })
    id_utilisateur_modificateur!: number | null;

    // Nom du champ modifié (ex: "email", "telephone", "role")
    @Column({ type: "varchar", length: 100 })
    champ_modifie!: string;

    // Ancienne valeur (stockée en texte)
    @Column({ type: "text", nullable: true })
    ancienne_valeur!: string | null;

    // Nouvelle valeur (stockée en texte)
    @Column({ type: "text", nullable: true })
    nouvelle_valeur!: string | null;

    // Date et heure de la modification
    @CreateDateColumn({ name: "date_modification" })
    date_modification!: Date;

    // Relations
    @ManyToOne(() => Utilisateur)
    @JoinColumn({ name: "id_utilisateur_modifie" })
    utilisateur_modifie!: Utilisateur;

    @ManyToOne(() => Utilisateur, { nullable: true })
    @JoinColumn({ name: "id_utilisateur_modificateur" })
    utilisateur_modificateur!: Utilisateur | null;
}
