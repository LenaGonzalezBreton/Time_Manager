import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Horaire } from "./Horaire";

// Entité représentant la table types_horaire
@Entity({ name: "types_horaire" })

export class TypeHoraire {
    // ID du type d'horaire
    @PrimaryGeneratedColumn({ name: "id_type_horaire" })
    id_type_horaire!: number;
    // Nom du type d'horaire (unique)
    @Column({ type: "varchar", length: 50, unique: true })
    type!: string;
    // Relation OneToMany avec l'entité Horaire
    @OneToMany(() => Horaire, h => h.type_horaire)
    horaires!: Horaire[];
}