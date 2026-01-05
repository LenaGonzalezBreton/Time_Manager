import request from 'supertest';
import app from '../app';
import { cleanTestData } from './setup';

describe('Tests API Horaires', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des horaires
    describe('GET /api/horaires', () => {
        it('devrait retourner la liste des horaires', async () => {
            const response = await request(app)
                .get('/api/horaires')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouvel horaire
    describe('POST /api/horaires', () => {
        it('devrait créer un nouvel horaire', async () => {
            // Créer d'abord un utilisateur pour l'horaire
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.horaire.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Créer l'horaire
            const newHoraire = {
                jour: '2025-06-15',
                id_utilisateur: userId,
                id_type_horaire: 1, // Doit exister dans test_data.sql
                heure_arrivee: '2025-06-15T08:00:00.000Z',
                heure_depart: '2025-06-15T17:00:00.000Z',
                minutes_retard: 0,
                minutes_travaillees: 480
            };

            const response = await request(app)
                .post('/api/horaires')
                .send(newHoraire)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_horaire');
            expect(response.body.jour).toBe(newHoraire.jour);
            expect(response.body.minutes_retard).toBe(newHoraire.minutes_retard);
            expect(response.body.minutes_travaillees).toBe(newHoraire.minutes_travaillees);
        });

        it('devrait créer un horaire avec des valeurs nullables', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.horaire.null.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer un horaire sans heure_arrivee, heure_depart et type_horaire
            const newHoraire = {
                jour: '2025-06-16',
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_horaire: null,
                heure_arrivee: null,
                heure_depart: null,
                minutes_retard: 0,
                minutes_travaillees: 0
            };

            const response = await request(app)
                .post('/api/horaires')
                .send(newHoraire)
                .expect(201);

            expect(response.body).toHaveProperty('id_horaire');
            expect(response.body.jour).toBe(newHoraire.jour);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un horaire avec un utilisateur invalide', async () => {
            const invalidHoraire = {
                jour: '2025-06-17',
                id_utilisateur: 999999, // Utilisateur inexistant
                heure_arrivee: '2025-06-17T08:00:00.000Z',
                heure_depart: '2025-06-17T17:00:00.000Z'
            };

            await request(app)
                .post('/api/horaires')
                .send(invalidHoraire)
                .expect(400);
        });

        it('devrait rejeter un horaire avec un type_horaire invalide', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.horaire.type.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const invalidHoraire = {
                jour: '2025-06-18',
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_horaire: 999999 // Type d'horaire inexistant
            };

            await request(app)
                .post('/api/horaires')
                .send(invalidHoraire)
                .expect(400);
        });

        it('devrait rejeter un horaire dupliqué (même utilisateur et même jour)', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.horaire.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const horaire = {
                jour: '2025-06-19',
                id_utilisateur: userResponse.body.id_utilisateur,
                heure_arrivee: '2025-06-19T08:00:00.000Z',
                heure_depart: '2025-06-19T17:00:00.000Z'
            };

            // Créer le premier horaire
            await request(app)
                .post('/api/horaires')
                .send(horaire)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/horaires')
                .send(horaire)
                .expect(409);
        });

        it('devrait rejeter un horaire avec des données manquantes', async () => {
            const incompleteHoraire = {
                id_utilisateur: 1
                // jour manquant
            };

            const response = await request(app)
                .post('/api/horaires')
                .send(incompleteHoraire);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un horaire existant
    describe('PUT /api/horaires/:id', () => {
        it('devrait mettre à jour un horaire existant', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.update.horaire.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer un horaire
            const newHoraire = {
                jour: '2025-06-20',
                id_utilisateur: userResponse.body.id_utilisateur,
                heure_arrivee: '2025-06-20T08:00:00.000Z',
                heure_depart: '2025-06-20T17:00:00.000Z',
                minutes_retard: 0,
                minutes_travaillees: 480
            };

            const createResponse = await request(app)
                .post('/api/horaires')
                .send(newHoraire)
                .expect(201);

            const horaireId = createResponse.body.id_horaire;

            // Modifier l'horaire
            const updatedData = {
                minutes_retard: 15,
                minutes_travaillees: 465
            };

            const updateResponse = await request(app)
                .put(`/api/horaires/${horaireId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.minutes_retard).toBe(updatedData.minutes_retard);
            expect(updateResponse.body.minutes_travaillees).toBe(updatedData.minutes_travaillees);
        });

        it('devrait retourner 404 pour un horaire inexistant', async () => {
            await request(app)
                .put('/api/horaires/999999')
                .send({ minutes_retard: 10 })
                .expect(404);
        });

        it('devrait permettre de mettre à jour le type_horaire à null', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.update.null.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer un horaire avec un type_horaire
            const newHoraire = {
                jour: '2025-06-21',
                id_utilisateur: userResponse.body.id_utilisateur,
                id_type_horaire: 1
            };

            const createResponse = await request(app)
                .post('/api/horaires')
                .send(newHoraire)
                .expect(201);

            const horaireId = createResponse.body.id_horaire;

            // Modifier pour mettre type_horaire à null
            const updateResponse = await request(app)
                .put(`/api/horaires/${horaireId}`)
                .send({ id_type_horaire: null })
                .expect(200);

            expect(updateResponse.body.type_horaire).toBeNull();
        });

        it('devrait rejeter la mise à jour avec un jour dupliqué', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.update.horaire.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Créer deux horaires différents
            const horaire1 = {
                jour: '2025-06-22',
                id_utilisateur: userId
            };

            const horaire2 = {
                jour: '2025-06-23',
                id_utilisateur: userId
            };

            await request(app)
                .post('/api/horaires')
                .send(horaire1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/horaires')
                .send(horaire2)
                .expect(201);

            const horaireId2 = createResponse2.body.id_horaire;

            // Tenter de mettre à jour horaire2 avec le jour d'horaire1
            await request(app)
                .put(`/api/horaires/${horaireId2}`)
                .send({ jour: horaire1.jour })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer un horaire existant
    describe('DELETE /api/horaires/:id', () => {
        it('devrait supprimer un horaire existant', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.delete.horaire.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer un horaire
            const newHoraire = {
                jour: '2025-06-24',
                id_utilisateur: userResponse.body.id_utilisateur
            };

            const createResponse = await request(app)
                .post('/api/horaires')
                .send(newHoraire)
                .expect(201);

            const horaireId = createResponse.body.id_horaire;

            // Supprimer l'horaire
            await request(app)
                .delete(`/api/horaires/${horaireId}`)
                .expect(204);

            // Vérifier que l'horaire n'existe plus
            await request(app)
                .put(`/api/horaires/${horaireId}`)
                .send({ minutes_retard: 10 })
                .expect(404);
        });

        it('devrait retourner 404 pour un horaire inexistant', async () => {
            await request(app)
                .delete('/api/horaires/999999')
                .expect(404);
        });
    });
});

