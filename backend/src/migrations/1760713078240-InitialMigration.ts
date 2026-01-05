import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760713078240 implements MigrationInterface {
    name = 'InitialMigration1760713078240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "planning" ("id_planning" SERIAL NOT NULL, "jour_semaine" character varying(10) NOT NULL, "heure_arrivee" TIME, "heure_pause" TIME, "heure_depart" TIME, "jour_travail" boolean NOT NULL DEFAULT true, "roleIdRole" integer, CONSTRAINT "CHK_bc0441bd65c6afae1243ce34d7" CHECK ("jour_semaine" IN ('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche')), CONSTRAINT "PK_04ff252693cc31e7f2007a6211b" PRIMARY KEY ("id_planning"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id_role" SERIAL NOT NULL, "titre" character varying(50) NOT NULL, CONSTRAINT "UQ_727aff55ab1cd29ce3995fe5371" UNIQUE ("titre"), CONSTRAINT "PK_3ebdb96dd6787bda0e3c8f89d66" PRIMARY KEY ("id_role"))`);
        await queryRunner.query(`CREATE TABLE "types_horaire" ("id_type_horaire" SERIAL NOT NULL, "type" character varying(50) NOT NULL, CONSTRAINT "UQ_6a212adaa66e1acc0a0be68af1f" UNIQUE ("type"), CONSTRAINT "PK_3779238b3125152fb5ca51a0c2b" PRIMARY KEY ("id_type_horaire"))`);
        await queryRunner.query(`CREATE TABLE "horaires" ("id_horaire" SERIAL NOT NULL, "jour" date NOT NULL, "heure_arrivee" TIMESTAMP WITH TIME ZONE, "heure_depart" TIMESTAMP WITH TIME ZONE, "minutes_retard" integer NOT NULL DEFAULT '0', "minutes_travaillees" integer NOT NULL DEFAULT '0', "typeHoraireIdTypeHoraire" integer, "utilisateurIdUtilisateur" integer, CONSTRAINT "uq_horaires_user_jour" UNIQUE ("utilisateurIdUtilisateur", "jour"), CONSTRAINT "PK_aeabc6c8e3979516e71c4387612" PRIMARY KEY ("id_horaire"))`);
        await queryRunner.query(`CREATE INDEX "idx_horaires_user_jour" ON "horaires" ("utilisateurIdUtilisateur", "jour") `);
        await queryRunner.query(`CREATE TABLE "types_absence" ("id_type_absence" SERIAL NOT NULL, "type" character varying(50) NOT NULL, CONSTRAINT "UQ_bd138a1cc218552249c174a182c" UNIQUE ("type"), CONSTRAINT "PK_ccb0bed09e18581155872098161" PRIMARY KEY ("id_type_absence"))`);
        await queryRunner.query(`CREATE TABLE "absences" ("id_absence" SERIAL NOT NULL, "date_debut" date NOT NULL, "date_fin" date NOT NULL, "justifiee" boolean NOT NULL DEFAULT true, "commentaire" character varying(200), "utilisateurIdUtilisateur" integer, "typeAbsenceIdTypeAbsence" integer, CONSTRAINT "uq_absences_user_period" UNIQUE ("utilisateurIdUtilisateur", "date_debut", "date_fin"), CONSTRAINT "CHK_ab47778239dff9c142b1c86882" CHECK ("date_fin" >= "date_debut"), CONSTRAINT "PK_f66b5351c623f01e491d374dcbc" PRIMARY KEY ("id_absence"))`);
        await queryRunner.query(`CREATE INDEX "idx_absences_user_period" ON "absences" ("utilisateurIdUtilisateur", "date_debut", "date_fin") `);
        await queryRunner.query(`CREATE TABLE "equipes" ("id_equipe" SERIAL NOT NULL, "nom" character varying(50) NOT NULL, "description" character varying(500), CONSTRAINT "UQ_656b8cd8713397440d638dfeb79" UNIQUE ("nom"), CONSTRAINT "PK_603dbe0f7683f0497e08410f5e7" PRIMARY KEY ("id_equipe"))`);
        await queryRunner.query(`CREATE TABLE "utilisateurs" ("id_utilisateur" SERIAL NOT NULL, "nom" character varying(50) NOT NULL, "prenom" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "telephone" character varying(15), "mot_de_passe" character varying(300) NOT NULL, "roleIdRole" integer, CONSTRAINT "UQ_6b14325a486fe68d16aa889e4dc" UNIQUE ("email"), CONSTRAINT "PK_f97d7d520e86e39824860ec9f75" PRIMARY KEY ("id_utilisateur"))`);
        await queryRunner.query(`CREATE TABLE "cible_indicateur" ("id_cible_indicateur" SERIAL NOT NULL, "type_cible" character varying(12) NOT NULL, "id_cible" integer NOT NULL, CONSTRAINT "CHK_4bf5f9582b457ab54505d5e1f2" CHECK ("type_cible" IN ('utilisateur','equipe')), CONSTRAINT "PK_656f1b19e0e5c0a8679d26545e1" PRIMARY KEY ("id_cible_indicateur"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_cible_indicateur_unique" ON "cible_indicateur" ("type_cible", "id_cible") `);
        await queryRunner.query(`CREATE TABLE "indicateurs" ("id_indicateur" SERIAL NOT NULL, "date_periode" date NOT NULL, "taux_retard" numeric(2,2), "taux_presence" numeric(2,2), "minutes_travaillees" integer NOT NULL DEFAULT '0', "minutes_retards" integer NOT NULL DEFAULT '0', "date_generation" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cibleIndicateurIdCibleIndicateur" integer NOT NULL, CONSTRAINT "uq_indic_cible_periode" UNIQUE ("cibleIndicateurIdCibleIndicateur", "date_periode"), CONSTRAINT "PK_07cd05ba17d07c67415d545102f" PRIMARY KEY ("id_indicateur"))`);
        await queryRunner.query(`CREATE INDEX "idx_indicateurs_cible_periode" ON "indicateurs" ("cibleIndicateurIdCibleIndicateur", "date_periode") `);
        await queryRunner.query(`CREATE TABLE "jours_feries" ("id_jour_ferie" SERIAL NOT NULL, "jour_ferie" date NOT NULL, CONSTRAINT "UQ_cb48def00416ec2d55f88c3bd9d" UNIQUE ("jour_ferie"), CONSTRAINT "PK_23604e54b73080690fc86dbdf23" PRIMARY KEY ("id_jour_ferie"))`);
        await queryRunner.query(`CREATE TABLE "appartenir" ("id_utilisateur" integer NOT NULL, "id_equipe" integer NOT NULL, CONSTRAINT "PK_5c08dd0ab73f0c5d7c10d2cc8e6" PRIMARY KEY ("id_utilisateur", "id_equipe"))`);
        await queryRunner.query(`CREATE INDEX "IDX_473d539b29f6dac680c9021dd3" ON "appartenir" ("id_utilisateur") `);
        await queryRunner.query(`CREATE INDEX "IDX_7abb579de957cce6872926da1d" ON "appartenir" ("id_equipe") `);
        await queryRunner.query(`ALTER TABLE "planning" ADD CONSTRAINT "FK_dccaa1b5152ea7c276264583ed8" FOREIGN KEY ("roleIdRole") REFERENCES "roles"("id_role") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "horaires" ADD CONSTRAINT "FK_4aab251bdd30a753d4ee7f4c712" FOREIGN KEY ("typeHoraireIdTypeHoraire") REFERENCES "types_horaire"("id_type_horaire") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "horaires" ADD CONSTRAINT "FK_fb6a13af93048ceb581760d35a8" FOREIGN KEY ("utilisateurIdUtilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "absences" ADD CONSTRAINT "FK_321eec0c262ea1d88c1cf9a2127" FOREIGN KEY ("utilisateurIdUtilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "absences" ADD CONSTRAINT "FK_318cfaa3a466107240d36729dc9" FOREIGN KEY ("typeAbsenceIdTypeAbsence") REFERENCES "types_absence"("id_type_absence") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "utilisateurs" ADD CONSTRAINT "FK_b406af2f03826ec03d558acdb60" FOREIGN KEY ("roleIdRole") REFERENCES "roles"("id_role") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "indicateurs" ADD CONSTRAINT "FK_859057b825266b7bbc670a07b74" FOREIGN KEY ("cibleIndicateurIdCibleIndicateur") REFERENCES "cible_indicateur"("id_cible_indicateur") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "appartenir" ADD CONSTRAINT "FK_473d539b29f6dac680c9021dd3b" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "appartenir" ADD CONSTRAINT "FK_7abb579de957cce6872926da1dd" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id_equipe") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appartenir" DROP CONSTRAINT "FK_7abb579de957cce6872926da1dd"`);
        await queryRunner.query(`ALTER TABLE "appartenir" DROP CONSTRAINT "FK_473d539b29f6dac680c9021dd3b"`);
        await queryRunner.query(`ALTER TABLE "indicateurs" DROP CONSTRAINT "FK_859057b825266b7bbc670a07b74"`);
        await queryRunner.query(`ALTER TABLE "utilisateurs" DROP CONSTRAINT "FK_b406af2f03826ec03d558acdb60"`);
        await queryRunner.query(`ALTER TABLE "absences" DROP CONSTRAINT "FK_318cfaa3a466107240d36729dc9"`);
        await queryRunner.query(`ALTER TABLE "absences" DROP CONSTRAINT "FK_321eec0c262ea1d88c1cf9a2127"`);
        await queryRunner.query(`ALTER TABLE "horaires" DROP CONSTRAINT "FK_fb6a13af93048ceb581760d35a8"`);
        await queryRunner.query(`ALTER TABLE "horaires" DROP CONSTRAINT "FK_4aab251bdd30a753d4ee7f4c712"`);
        await queryRunner.query(`ALTER TABLE "planning" DROP CONSTRAINT "FK_dccaa1b5152ea7c276264583ed8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7abb579de957cce6872926da1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_473d539b29f6dac680c9021dd3"`);
        await queryRunner.query(`DROP TABLE "appartenir"`);
        await queryRunner.query(`DROP TABLE "jours_feries"`);
        await queryRunner.query(`DROP INDEX "public"."idx_indicateurs_cible_periode"`);
        await queryRunner.query(`DROP TABLE "indicateurs"`);
        await queryRunner.query(`DROP INDEX "public"."uq_cible_indicateur_unique"`);
        await queryRunner.query(`DROP TABLE "cible_indicateur"`);
        await queryRunner.query(`DROP TABLE "utilisateurs"`);
        await queryRunner.query(`DROP TABLE "equipes"`);
        await queryRunner.query(`DROP INDEX "public"."idx_absences_user_period"`);
        await queryRunner.query(`DROP TABLE "absences"`);
        await queryRunner.query(`DROP TABLE "types_absence"`);
        await queryRunner.query(`DROP INDEX "public"."idx_horaires_user_jour"`);
        await queryRunner.query(`DROP TABLE "horaires"`);
        await queryRunner.query(`DROP TABLE "types_horaire"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "planning"`);
    }

}
