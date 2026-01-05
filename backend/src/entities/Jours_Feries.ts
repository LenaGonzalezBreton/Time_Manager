import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Entité représentant la table jours_feries
@Entity({ name: "jours_feries" })

export class JourFerie {
    // ID du jour férié
    @PrimaryGeneratedColumn({ name: "id_jour_ferie" })
    id_jour_ferie!: number;
    // Date du jour férié (unique)
    @Column({ type: "date", unique: true })
    jour_ferie!: string; // 'YYYY-MM-DD'
}