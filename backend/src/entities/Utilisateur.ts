import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./Role";
import { Horaire } from "./Horaire";
import { Absence } from "./Absence";
import { Equipe } from "./Equipe";

// Entité représentant la table utilisateurs
@Entity({ name: "utilisateurs" })

export class Utilisateur {
    // ID de l'utilisateur
    @PrimaryGeneratedColumn({ name: "id_utilisateur" })
    id_utilisateur!: number;

    // Nom de l'utilisateur
    @Column({ type: "varchar", length: 50 }) nom!: string;
    // Prénom de l'utilisateur
    @Column({ type: "varchar", length: 50 }) prenom!: string;
    // Email de l'utilisateur (unique)
    @Column({ type: "varchar", length: 100, unique: true }) email!: string;
    // Téléphone de l'utilisateur (nullable)
    @Column({ type: "varchar", length: 15, nullable: true }) telephone!: string | null;
    // Mot de passe de l'utilisateur
    @Column({ type: "varchar", length: 300 }) mot_de_passe!: string;
    // Rôle de l'utilisateur (relation ManyToOne avec Role)
    @ManyToOne(() => Role, r => r.utilisateurs, { nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
    role!: Role | null;
    // Relation OneToMany avec l'entité Horaire
    @OneToMany(() => Horaire, h => h.utilisateur)
    horaires!: Horaire[];
    // Relation OneToMany avec l'entité Absence
    @OneToMany(() => Absence, a => a.utilisateur)
    absences!: Absence[];
    // Relation ManyToMany avec l'entité Equipe
    @ManyToMany(() => Equipe, e => e.membres, { cascade: false })
    // Jointure avec la table appartenir pour référencer les équipes
    @JoinTable({
        name: "appartenir",
        joinColumns: [{ name: "id_utilisateur" }],
        inverseJoinColumns: [{ name: "id_equipe" }],
    })
    // Équipe(s) de l'utilisateur
    equipe!: Equipe[];
}