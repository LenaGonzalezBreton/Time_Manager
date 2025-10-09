import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1759997677278 implements MigrationInterface {
    name = 'Init1759997677278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id_role" SERIAL NOT NULL, "titre" character varying(50) NOT NULL, CONSTRAINT "UQ_727aff55ab1cd29ce3995fe5371" UNIQUE ("titre"), CONSTRAINT "PK_3ebdb96dd6787bda0e3c8f89d66" PRIMARY KEY ("id_role"))`);
        await queryRunner.query(`CREATE TABLE "equipes" ("id_equipe" SERIAL NOT NULL, "nom" character varying(50) NOT NULL, "description" character varying(500), CONSTRAINT "PK_603dbe0f7683f0497e08410f5e7" PRIMARY KEY ("id_equipe"))`);
        await queryRunner.query(`CREATE TABLE "horaires" ("id_horaire" SERIAL NOT NULL, "type" character varying(50) NOT NULL, "jour" date NOT NULL, "heure" TIME NOT NULL, "id_utilisateur" integer NOT NULL, CONSTRAINT "PK_aeabc6c8e3979516e71c4387612" PRIMARY KEY ("id_horaire"))`);
        await queryRunner.query(`CREATE TABLE "indicateurs" ("id_indicateur" SERIAL NOT NULL, "taux_retard" numeric(5,2), "taux_presence" numeric(5,2), "heures_travaillees" numeric(5,2), "duree_retards" numeric(5,2), "id_utilisateur" integer NOT NULL, CONSTRAINT "PK_07cd05ba17d07c67415d545102f" PRIMARY KEY ("id_indicateur"))`);
        await queryRunner.query(`CREATE TABLE "utilisateurs" ("id_utilisateur" SERIAL NOT NULL, "nom" character varying(50) NOT NULL, "prenom" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "telephone" character varying(15), "mot_de_passe" character varying(300) NOT NULL, "id_role" integer NOT NULL, CONSTRAINT "UQ_6b14325a486fe68d16aa889e4dc" UNIQUE ("email"), CONSTRAINT "PK_f97d7d520e86e39824860ec9f75" PRIMARY KEY ("id_utilisateur"))`);
        await queryRunner.query(`CREATE TABLE "appartenir" ("id_utilisateur" integer NOT NULL, "id_equipe" integer NOT NULL, CONSTRAINT "PK_5c08dd0ab73f0c5d7c10d2cc8e6" PRIMARY KEY ("id_utilisateur", "id_equipe"))`);
        await queryRunner.query(`CREATE INDEX "IDX_473d539b29f6dac680c9021dd3" ON "appartenir" ("id_utilisateur") `);
        await queryRunner.query(`CREATE INDEX "IDX_7abb579de957cce6872926da1d" ON "appartenir" ("id_equipe") `);
        await queryRunner.query(`ALTER TABLE "horaires" ADD CONSTRAINT "FK_7bf220e3a0aecfe4db56f9e009d" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "indicateurs" ADD CONSTRAINT "FK_b85417ae83c9a4fb5800eecbf78" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utilisateurs" ADD CONSTRAINT "FK_57ff021c9656b54c994b413f942" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appartenir" ADD CONSTRAINT "FK_473d539b29f6dac680c9021dd3b" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "appartenir" ADD CONSTRAINT "FK_7abb579de957cce6872926da1dd" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id_equipe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appartenir" DROP CONSTRAINT "FK_7abb579de957cce6872926da1dd"`);
        await queryRunner.query(`ALTER TABLE "appartenir" DROP CONSTRAINT "FK_473d539b29f6dac680c9021dd3b"`);
        await queryRunner.query(`ALTER TABLE "utilisateurs" DROP CONSTRAINT "FK_57ff021c9656b54c994b413f942"`);
        await queryRunner.query(`ALTER TABLE "indicateurs" DROP CONSTRAINT "FK_b85417ae83c9a4fb5800eecbf78"`);
        await queryRunner.query(`ALTER TABLE "horaires" DROP CONSTRAINT "FK_7bf220e3a0aecfe4db56f9e009d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7abb579de957cce6872926da1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_473d539b29f6dac680c9021dd3"`);
        await queryRunner.query(`DROP TABLE "appartenir"`);
        await queryRunner.query(`DROP TABLE "utilisateurs"`);
        await queryRunner.query(`DROP TABLE "indicateurs"`);
        await queryRunner.query(`DROP TABLE "horaires"`);
        await queryRunner.query(`DROP TABLE "equipes"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
