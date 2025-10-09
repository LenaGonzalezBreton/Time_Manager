import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany,
    JoinTable,
    Unique,
} from "typeorm";
import { Role } from "./Role";
import { Equipe } from "./Equipe";
import { Horaire } from "./Horaire";
import { Indicateur } from "./Indicateur";
// Entité représentant la table utilisateurs
@Entity("utilisateurs")
export class Utilisateur {
    // ID de l'utilisateur
    @PrimaryGeneratedColumn({ name: "id_utilisateur" })
    id_utilisateur!: number;
    // Nom de l'utilisateur
    @Column({ type: "varchar", length: 50 })
    nom!: string;
    // Prénom de l'utilisateur
    @Column({ type: "varchar", length: 50 })
    prenom!: string;
    // Email de l'utilisateur (unique)
    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;
    // Téléphone de l'utilisateur (nullable)
    @Column({ type: "varchar", length: 15, nullable: true })
    telephone!: string | null;
    // Mot de passe de l'utilisateur
    @Column({ type: "varchar", length: 300 })
    mot_de_passe!: string;
    // Relation ManyToOne avec l'entité Role
    @ManyToOne(() => Role, (r) => r.utilisateurs, { nullable: false })
    @JoinColumn({ name: "id_role" })
    role!: Role;
    // Relation ManyToMany avec l'entité Equipe
    @ManyToMany(() => Equipe, (e) => e.membres)
    // Jointure de la table appartenir pour lister quel utilisateur appartient à quelle équipe
    @JoinTable({
        name: "appartenir",
        joinColumn: { name: "id_utilisateur", referencedColumnName: "id_utilisateur" },
        inverseJoinColumn: { name: "id_equipe", referencedColumnName: "id_equipe" },
    })
    equipes!: Equipe[];
    // Relation OneToMany avec l'entité Horaire
    @OneToMany(() => Horaire, (h) => h.utilisateur)
    horaires!: Horaire[];
    // Relation OneToMany avec l'entité Indicateur
    @OneToMany(() => Indicateur, (i) => i.utilisateur)
    indicateurs!: Indicateur[];
}