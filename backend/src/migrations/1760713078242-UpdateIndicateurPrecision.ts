import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndicateurPrecision1760713078242 implements MigrationInterface {
    name = 'UpdateIndicateurPrecision1760713078242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Modifier la précision des colonnes taux_retard et taux_presence de (2,2) à (5,2)
        await queryRunner.query(`ALTER TABLE "indicateurs" ALTER COLUMN "taux_retard" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "indicateurs" ALTER COLUMN "taux_presence" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revenir à la précision (2,2)
        await queryRunner.query(`ALTER TABLE "indicateurs" ALTER COLUMN "taux_presence" TYPE numeric(2,2)`);
        await queryRunner.query(`ALTER TABLE "indicateurs" ALTER COLUMN "taux_retard" TYPE numeric(2,2)`);
    }
}
