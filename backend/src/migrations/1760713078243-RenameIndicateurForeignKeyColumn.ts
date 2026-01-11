import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameIndicateurForeignKeyColumn1760713078243 implements MigrationInterface {
    name = 'RenameIndicateurForeignKeyColumn1760713078243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renommer la colonne de cibleIndicateurIdCibleIndicateur à id_cible_indicateur
        await queryRunner.query(`ALTER TABLE "indicateurs" RENAME COLUMN "cibleIndicateurIdCibleIndicateur" TO "id_cible_indicateur"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revenir au nom original
        await queryRunner.query(`ALTER TABLE "indicateurs" RENAME COLUMN "id_cible_indicateur" TO "cibleIndicateurIdCibleIndicateur"`);
    }
}
