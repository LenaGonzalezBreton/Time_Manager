import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Absence } from "./Absence";

// Entité représentant la table types_absence
@Entity({ name: "types_absence" })

export class TypeAbsence {
    // ID du type d'absence
    @PrimaryGeneratedColumn({ name: "id_type_absence" })
    id_type_absence!: number;
    // Nom du type d'absence (unique)
    @Column({ type: "varchar", length: 50, unique: true })
    type!: string;
    // Relation OneToMany avec l'entité Absence
    @OneToMany(() => Absence, a => a.type_absence)
    absences!: Absence[];
}