import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddObjectifsToCibleIndicateur1760713078241 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("cible_indicateur", new TableColumn({
            name: "objectif_presence",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true
        }));

        await queryRunner.addColumn("cible_indicateur", new TableColumn({
            name: "objectif_retard",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("cible_indicateur", "objectif_retard");
        await queryRunner.dropColumn("cible_indicateur", "objectif_presence");
    }
}

