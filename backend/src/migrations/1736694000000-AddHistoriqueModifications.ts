import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHistoriqueModifications1736694000000 implements MigrationInterface {
    name = 'AddHistoriqueModifications1736694000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Créer la table historique_modifications
        await queryRunner.query(`
            CREATE TABLE "historique_modifications" (
                "id_historique" SERIAL NOT NULL,
                "type_modification" character varying(20) NOT NULL,
                "id_utilisateur_modifie" integer NOT NULL,
                "id_utilisateur_modificateur" integer,
                "champ_modifie" character varying(100) NOT NULL,
                "ancienne_valeur" text,
                "nouvelle_valeur" text,
                "date_modification" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_historique_modifications" PRIMARY KEY ("id_historique")
            )
        `);

        // Créer les index pour améliorer les performances
        await queryRunner.query(`
            CREATE INDEX "idx_historique_utilisateur" 
            ON "historique_modifications" ("id_utilisateur_modifie")
        `);

        await queryRunner.query(`
            CREATE INDEX "idx_historique_modificateur" 
            ON "historique_modifications" ("id_utilisateur_modificateur")
        `);

        await queryRunner.query(`
            CREATE INDEX "idx_historique_date" 
            ON "historique_modifications" ("date_modification")
        `);

        // Ajouter les contraintes de clés étrangères
        await queryRunner.query(`
            ALTER TABLE "historique_modifications" 
            ADD CONSTRAINT "FK_historique_utilisateur_modifie" 
            FOREIGN KEY ("id_utilisateur_modifie") 
            REFERENCES "utilisateurs"("id_utilisateur") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "historique_modifications" 
            ADD CONSTRAINT "FK_historique_utilisateur_modificateur" 
            FOREIGN KEY ("id_utilisateur_modificateur") 
            REFERENCES "utilisateurs"("id_utilisateur") 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer les contraintes de clés étrangères
        await queryRunner.query(`
            ALTER TABLE "historique_modifications" 
            DROP CONSTRAINT "FK_historique_utilisateur_modificateur"
        `);

        await queryRunner.query(`
            ALTER TABLE "historique_modifications" 
            DROP CONSTRAINT "FK_historique_utilisateur_modifie"
        `);

        // Supprimer les index
        await queryRunner.query(`DROP INDEX "public"."idx_historique_date"`);
        await queryRunner.query(`DROP INDEX "public"."idx_historique_modificateur"`);
        await queryRunner.query(`DROP INDEX "public"."idx_historique_utilisateur"`);

        // Supprimer la table
        await queryRunner.query(`DROP TABLE "historique_modifications"`);
    }
}
