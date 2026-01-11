import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Absences', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des absences
    describe('GET /api/absences', () => {
        it('devrait retourner la liste des absences', async () => {
            const response = await request(app)
                .get('/api/absences')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer une nouvelle absence
    describe('POST /api/absences', () => {
        it('devrait créer une nouvelle absence', async () => {
            // Créer d'abord un utilisateur pour l'absence
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.absence.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Créer l'absence
            const newAbsence = {
                id_utilisateur: userId,
                id_type_absence: 1, // Doit exister dans test_data.sql
                date_debut: '2025-06-01',
                date_fin: '2025-06-05',
                justifiee: true,
                commentaire: 'Congés annuels'
            };

            const response = await request(app)
                .post('/api/absences')
                .send(newAbsence)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_absence');
            expect(response.body.date_debut).toBe(newAbsence.date_debut);
            expect(response.body.date_fin).toBe(newAbsence.date_fin);
            expect(response.body.justifiee).toBe(newAbsence.justifiee);
            expect(response.body.commentaire).toBe(newAbsence.commentaire);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter une absence avec un utilisateur invalide', async () => {
            const invalidAbsence = {
                id_utilisateur: 999999, // Utilisateur inexistant
                id_type_absence: 1,
                date_debut: '2025-06-01',
                date_fin: '2025-06-05'
            };

            await request(app)
                .post('/api/absences')
                .send(invalidAbsence)
                .expect(400);
        });

        it('devrait rejeter une absence avec un type invalide', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.absence.type.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const invalidAbsence = {
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_absence: 999999, // Type d'absence inexistant
                date_debut: '2025-06-01',
                date_fin: '2025-06-05'
            };

            await request(app)
                .post('/api/absences')
                .send(invalidAbsence)
                .expect(400);
        });

        it('devrait rejeter une absence dupliquée (même utilisateur et même période)', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.absence.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const absence = {
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_absence: 1,
                date_debut: '2025-07-01',
                date_fin: '2025-07-05',
                justifiee: true
            };

            // Créer la première absence
            await request(app)
                .post('/api/absences')
                .send(absence)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/absences')
                .send(absence)
                .expect(409);
        });

        it('devrait rejeter une absence avec des données manquantes', async () => {
            const incompleteAbsence = {
                id_utilisateur: 1
                // date_debut, date_fin, id_type_absence manquants
            };

            const response = await request(app)
                .post('/api/absences')
                .send(incompleteAbsence);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour une absence existante
    describe('PUT /api/absences/:id', () => {
        it('devrait mettre à jour une absence existante', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.update.absence.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer une absence
            const newAbsence = {
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_absence: 1,
                date_debut: '2025-08-01',
                date_fin: '2025-08-05',
                justifiee: false,
                commentaire: 'Avant modification'
            };

            const createResponse = await request(app)
                .post('/api/absences')
                .send(newAbsence)
                .expect(201);

            const absenceId = createResponse.body.id_absence;

            // Modifier l'absence
            const updatedData = {
                justifiee: true,
                commentaire: 'Après modification'
            };

            const updateResponse = await request(app)
                .put(`/api/absences/${absenceId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.justifiee).toBe(updatedData.justifiee);
            expect(updateResponse.body.commentaire).toBe(updatedData.commentaire);
        });

        it('devrait retourner 404 pour une absence inexistante', async () => {
            await request(app)
                .put('/api/absences/999999')
                .send({ justifiee: true })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec une période dupliquée', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.update.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Créer deux absences différentes
            const absence1 = {
                id_utilisateur: userId,
                id_type_absence: 1,
                date_debut: '2025-09-01',
                date_fin: '2025-09-05'
            };

            const absence2 = {
                id_utilisateur: userId,
                id_type_absence: 1,
                date_debut: '2025-09-10',
                date_fin: '2025-09-15'
            };

            await request(app)
                .post('/api/absences')
                .send(absence1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/absences')
                .send(absence2)
                .expect(201);

            const absenceId2 = createResponse2.body.id_absence;

            // Tenter de mettre à jour absence2 avec la période d'absence1
            await request(app)
                .put(`/api/absences/${absenceId2}`)
                .send({ date_debut: absence1.date_debut, date_fin: absence1.date_fin })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer une absence existante
    describe('DELETE /api/absences/:id', () => {
        it('devrait supprimer une absence existante', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.delete.absence.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer une absence
            const newAbsence = {
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_absence: 1,
                date_debut: '2025-10-01',
                date_fin: '2025-10-05'
            };

            const createResponse = await request(app)
                .post('/api/absences')
                .send(newAbsence)
                .expect(201);

            const absenceId = createResponse.body.id_absence;

            // Supprimer l'absence
            await request(app)
                .delete(`/api/absences/${absenceId}`)
                .expect(204);

            // Vérifier que l'absence n'existe plus
            await request(app)
                .put(`/api/absences/${absenceId}`)
                .send({ justifiee: true })
                .expect(404);
        });

        it('devrait retourner 404 pour une absence inexistante', async () => {
            await request(app)
                .delete('/api/absences/999999')
                .expect(404);
        });
    });
});

