-- Données de test pour les rapports et tout le domaine, compatibles avec le schéma PostgreSQL de la migration initiale
-- Ce script remplit :
--  - roles (Manager, Employe)
--  - types_horaire (Standard, Télétravail, Astreinte, Heures Sup)
--  - types_absence (Congé payé, Maladie, RTT)
--  - planning hebdomadaire par rôle (lun->ven travaillés, sam/dim off)
--  - jours fériés (incluant 2025-01-01)
--  - equipes (5)
--  - utilisateurs (20: 4/équipe dont 1 manager)
--  - appartenir (membres des équipes)
--  - absences (quelques cas)
--  - horaires (générés sur jours ouvrés, hors fériés et absences)
--  - cibles et indicateurs (7 jours pour utilisateurs et équipes)
--
-- Usage (hôte) :
--   cmd :    docker cp backend\src\test_data.sql postgres_db:/test_data.sql && docker exec -i postgres_db psql -U user -d time_manager -f /test_data.sql
--   psql :   psql "postgres://user:password@localhost:5432/time_manager" -f backend/src/test_data.sql

BEGIN;

-- Clean relevant tables and reset identities
TRUNCATE TABLE indicateurs, cible_indicateur, horaires, absences, appartenir, utilisateurs, equipes, roles, types_horaire, types_absence, jours_feries, planning RESTART IDENTITY CASCADE;

-- Roles
INSERT INTO roles (titre) VALUES ('Manager'), ('Employe');

-- Types d'horaire
INSERT INTO types_horaire (type) VALUES ('Standard'), ('Télétravail'), ('Astreinte'), ('Heures Sup');

-- Types d'absence
INSERT INTO types_absence (type) VALUES ('Congé payé'), ('Maladie'), ('RTT');

-- Planning hebdo par rôle (roleIdRole: 1=Manager, 2=Employe)
-- Lundi à Vendredi travaillés 09:00-12:00 pause 13:00-17:00; Samedi/Dimanche off
INSERT INTO planning (jour_semaine, heure_arrivee, heure_pause, heure_depart, jour_travail, "roleIdRole") VALUES
  -- Manager
  ('Lundi',    '09:00', '12:00', '17:00', true, 1),
  ('Mardi',    '09:00', '12:00', '17:00', true, 1),
  ('Mercredi', '09:00', '12:00', '17:00', true, 1),
  ('Jeudi',    '09:00', '12:00', '17:00', true, 1),
  ('Vendredi', '09:00', '12:00', '17:00', true, 1),
  ('Samedi',   NULL,    NULL,    NULL,    false,1),
  ('Dimanche', NULL,    NULL,    NULL,    false,1),
  -- Employe
  ('Lundi',    '09:00', '12:00', '17:00', true, 2),
  ('Mardi',    '09:00', '12:00', '17:00', true, 2),
  ('Mercredi', '09:00', '12:00', '17:00', true, 2),
  ('Jeudi',    '09:00', '12:00', '17:00', true, 2),
  ('Vendredi', '09:00', '12:00', '17:00', true, 2),
  ('Samedi',   NULL,    NULL,    NULL,    false,2),
  ('Dimanche', NULL,    NULL,    NULL,    false,2);

-- Jours fériés (inclut 2025-01-01)
INSERT INTO jours_feries (jour_ferie) VALUES ('2025-01-01'), ('2025-01-06');

-- Teams
INSERT INTO equipes (nom, description) VALUES
  ('Equipe 1', 'Equipe 1 - Support'),
  ('Equipe 2', 'Equipe 2 - Produit'),
  ('Equipe 3', 'Equipe 3 - QA'),
  ('Equipe 4', 'Equipe 4 - Infra'),
  ('Equipe 5', 'Equipe 5 - Data');

-- Users (20 total) - plaintext passwords for testing only
-- "roleIdRole": 1 => Manager, 2 => Employe
INSERT INTO utilisateurs (nom, prenom, email, telephone, mot_de_passe, "roleIdRole") VALUES
  -- Equipe 1
  ('Martin', 'Alice', 'alice.martin+mg1@example.test',  '0600000001', 'pwd', 1),
  ('Durand', 'Bob',   'bob.durand+e1@example.test',     '0600000002', 'pwd', 2),
  ('Petit',  'Chloe', 'chloe.petit+e1@example.test',    '0600000003', 'pwd', 2),
  ('Leroy',  'David', 'david.leroy+e1@example.test',    '0600000004', 'pwd', 2),
  -- Equipe 2
  ('Moreau', 'Eva',   'eva.moreau+mg2@example.test',    '0600000011', 'pwd', 1),
  ('Fourn',  'Fred',  'fred.fourn+e2@example.test',     '0600000012', 'pwd', 2),
  ('Roux',   'Gina',  'gina.roux+e2@example.test',      '0600000013', 'pwd', 2),
  ('Noel',   'Hugo',  'hugo.noel+e2@example.test',      '0600000014', 'pwd', 2),
  -- Equipe 3
  ('Simon',  'Iris',  'iris.simon+mg3@example.test',    '0600000021', 'pwd', 1),
  ('Laurent','Jack',  'jack.laurent+e3@example.test',   '0600000022', 'pwd', 2),
  ('Lefevre','Katy',  'katy.lefevre+e3@example.test',   '0600000023', 'pwd', 2),
  ('Michel', 'Liam',  'liam.michel+e3@example.test',    '0600000024', 'pwd', 2),
  -- Equipe 4
  ('Garcia', 'Mila',  'mila.garcia+mg4@example.test',   '0600000031', 'pwd', 1),
  ('David',  'Noah',  'noah.david+e4@example.test',     '0600000032', 'pwd', 2),
  ('Bernard','Owen',  'owen.bernard+e4@example.test',   '0600000033', 'pwd', 2),
  ('Richard','Paula', 'paula.richard+e4@example.test',  '0600000034', 'pwd', 2),
  -- Equipe 5
  ('Dubois', 'Quinn', 'quinn.dubois+mg5@example.test',  '0600000041', 'pwd', 1),
  ('Morel',  'Rita',  'rita.morel+e5@example.test',     '0600000042', 'pwd', 2),
  ('Faber',  'Sam',   'sam.faber+e5@example.test',      '0600000043', 'pwd', 2),
  ('Mercier','Tom',   'tom.mercier+e5@example.test',    '0600000044', 'pwd', 2);

-- Membership (ManyToMany: appartenir)
-- Users 1-4 -> Team 1, 5-8 -> Team 2, ... 17-20 -> Team 5
INSERT INTO appartenir (id_utilisateur, id_equipe)
SELECT u_id, CEIL(u_id / 4.0)::int AS team_id
FROM generate_series(1, 20) AS u_id;

-- Absences (quelques cas)
INSERT INTO absences (date_debut, date_fin, justifiee, commentaire, "utilisateurIdUtilisateur", "typeAbsenceIdTypeAbsence") VALUES
  ('2025-01-03','2025-01-03', true, 'Congé court', 1, 1),
  ('2025-01-02','2025-01-03', true, 'Maladie',     2, 2),
  ('2025-01-06','2025-01-07', true, 'RTT',        10, 3),
  ('2025-01-02','2025-01-02', true, 'Congé',       5, 1),
  ('2025-01-07','2025-01-07', true, 'RTT',        12, 3);

-- Horaires générés: jours ouvrés (lun->ven), hors fériés et absences
-- Variation de retard/temps travaillé selon l'utilisateur pour diversifier les données
INSERT INTO horaires (
  jour,
  heure_arrivee,
  heure_depart,
  minutes_retard,
  minutes_travaillees,
  "typeHoraireIdTypeHoraire",
  "utilisateurIdUtilisateur"
)
SELECT
  d::date AS jour,
  (d::date || ' ' || LPAD((8 + (u % 2))::text,2,'0') || ':' || LPAD(((u % 3)*5)::text,2,'0') || ':00+00')::timestamptz AS heure_arrivee,
  (d::date || ' ' || '17:' || LPAD(((u % 2)*5)::text,2,'0') || ':00+00')::timestamptz AS heure_depart,
  ((u % 3)*5) AS minutes_retard,
  (480 - ((u % 2)*15)) AS minutes_travaillees,
  CASE WHEN (EXTRACT(ISODOW FROM d)::int IN (2,4) AND (u % 2) = 0) THEN 2 ELSE 1 END AS type_horaire,
  u AS utilisateur
FROM generate_series('2025-01-01'::date, '2025-01-07'::date, '1 day') AS d
CROSS JOIN generate_series(1, 20) AS u
LEFT JOIN jours_feries jf ON jf.jour_ferie = d::date
LEFT JOIN absences a ON a."utilisateurIdUtilisateur" = u AND d::date BETWEEN a.date_debut AND a.date_fin
WHERE EXTRACT(ISODOW FROM d)::int BETWEEN 1 AND 5
  AND jf.jour_ferie IS NULL
  AND a.id_absence IS NULL;

-- Targets for each user and each team
INSERT INTO cible_indicateur (type_cible, id_cible)
SELECT 'utilisateur', gs FROM generate_series(1, 20) AS gs;
INSERT INTO cible_indicateur (type_cible, id_cible)
SELECT 'equipe', gs FROM generate_series(1, 5) AS gs;

-- Derive indicators from actual horaires (user-day rows only where horaires exist)
WITH per_user_day AS (
  SELECT
    h."utilisateurIdUtilisateur" AS user_id,
    h.jour::date AS date_periode,
    SUM(h.minutes_travaillees) AS minutes_travaillees,
    SUM(h.minutes_retard) AS minutes_retards
  FROM horaires h
  GROUP BY h."utilisateurIdUtilisateur", h.jour
),
user_targets AS (
  SELECT c.id_cible_indicateur, c.id_cible
  FROM cible_indicateur c
  WHERE c.type_cible = 'utilisateur'
)
INSERT INTO indicateurs (
  date_periode,
  taux_retard,
  taux_presence,
  minutes_travaillees,
  minutes_retards,
  "cibleIndicateurIdCibleIndicateur"
)
SELECT
  p.date_periode,
  ROUND(LEAST(0.99, p.minutes_retards / 60.0)::numeric, 2) AS taux_retard,
  ROUND(LEAST(0.99, p.minutes_travaillees / 480.0)::numeric, 2) AS taux_presence,
  p.minutes_travaillees,
  p.minutes_retards,
  ut.id_cible_indicateur
FROM per_user_day p
JOIN user_targets ut ON ut.id_cible = p.user_id;

-- Team indicators aggregated from per-user-day and membership
WITH per_user_day AS (
  SELECT
    h."utilisateurIdUtilisateur" AS user_id,
    h.jour::date AS date_periode,
    SUM(h.minutes_travaillees) AS minutes_travaillees,
    SUM(h.minutes_retard) AS minutes_retards
  FROM horaires h
  GROUP BY h."utilisateurIdUtilisateur", h.jour
),
per_team_day AS (
  SELECT a.id_equipe AS team_id,
         p.date_periode,
         SUM(p.minutes_travaillees) AS minutes_travaillees,
         SUM(p.minutes_retards) AS minutes_retards,
         ROUND(AVG(LEAST(0.99, p.minutes_travaillees / 480.0))::numeric, 2) AS taux_presence,
         ROUND(AVG(LEAST(0.99, p.minutes_retards / 60.0))::numeric, 2) AS taux_retard
  FROM per_user_day p
  JOIN appartenir a ON a.id_utilisateur = p.user_id
  GROUP BY a.id_equipe, p.date_periode
),
team_targets AS (
  SELECT c.id_cible_indicateur, c.id_cible FROM cible_indicateur c WHERE c.type_cible = 'equipe'
)
INSERT INTO indicateurs (
  date_periode,
  taux_retard,
  taux_presence,
  minutes_travaillees,
  minutes_retards,
  "cibleIndicateurIdCibleIndicateur"
)
SELECT p.date_periode,
       p.taux_retard,
       p.taux_presence,
       p.minutes_travaillees,
       p.minutes_retards,
       tt.id_cible_indicateur
FROM per_team_day p
JOIN team_targets tt ON tt.id_cible = p.team_id;

COMMIT;
